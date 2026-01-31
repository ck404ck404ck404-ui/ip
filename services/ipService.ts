import { IPData, SecurityRisk } from '../types';

/**
 * Enhanced Fallback Strategy (Cascade Fetch):
 * 1. cloudflare (Ultra-reliable IP discovery)
 * 2. ipwhois (High detail)
 * 3. bigdatacloud (Resilient)
 * 4. ipapi (Secondary)
 * 5. seeip (Simple)
 * 6. ipify (Public API)
 */

const providers = [
  {
    name: 'ipwhois',
    url: (ip?: string) => `https://ipwho.is/${ip || ''}`,
    map: (data: any) => ({
      ip: data.ip,
      city: data.city,
      region: data.region,
      country_name: data.country,
      country_code: data.country_code,
      continent_code: data.continent_code,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone?.id || 'UTC',
      utc_offset: data.timezone?.utc || '+00:00',
      country_calling_code: data.calling_code,
      currency: data.currency?.code || 'USD',
      languages: data.country_neighbours || '',
      asn: data.connection?.asn?.toString() || '',
      org: data.connection?.org || data.connection?.isp || '',
      isp: data.connection?.isp || '',
      network_type: data.security?.hosting ? 'Hosting' : 'Broadband',
      hostname: data.connection?.domain || '',
      _raw_security: data.security
    })
  },
  {
    name: 'bigdatacloud',
    url: (ip?: string) => `https://api.bigdatacloud.net/data/client-info`,
    map: (data: any) => ({
      ip: data.clientIp,
      city: data.location?.city || '',
      region: data.location?.principalSubdivision || '',
      country_name: data.location?.countryName || '',
      country_code: data.location?.countryCode || '',
      org: data.network?.organisation || 'Unknown',
      isp: data.network?.organisation || 'Unknown',
      network_type: 'Broadband'
    })
  },
  {
    name: 'ipapi',
    url: (ip?: string) => `https://ipapi.co/${ip ? `${ip}/json/` : 'json/'}`,
    map: (data: any) => ({
      ip: data.ip,
      city: data.city,
      region: data.region,
      country_name: data.country_name,
      country_code: data.country_code,
      org: data.org,
      isp: data.org,
      network_type: 'Broadband'
    })
  }
];

const getCloudflareIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', { cache: 'no-store' });
    const text = await response.text();
    const match = text.match(/ip=(.*)/);
    return match ? match[1].trim() : null;
  } catch (e) {
    return null;
  }
};

const getIpifyIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    const data = await response.json();
    return data.ip || null;
  } catch (e) {
    return null;
  }
};

export const fetchIPDetails = async (targetIp?: string): Promise<IPData> => {
  let lastError: any = null;

  // Step 1: Try enriched providers first
  for (const provider of providers) {
    try {
      if (provider.name === 'bigdatacloud' && targetIp) continue;
      const response = await fetch(provider.url(targetIp), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) continue;
      const data = await response.json();
      if (data.success === false || data.error === true || !data.ip) continue;

      return provider.map(data) as any;
    } catch (error) {
      lastError = error;
    }
  }

  // Step 2: Critical Fallback - If everything is blocked, try to get at least the IP via Cloudflare or Ipify
  if (!targetIp) {
    const fallbackIp = await getCloudflareIP() || await getIpifyIP();
    if (fallbackIp) {
      return {
        ip: fallbackIp,
        city: 'Discovery Mode',
        region: 'Network Restricted',
        country_name: 'Unknown',
        country_code: 'XX',
        org: 'Network Restricted (Ad-blocker Active)',
        isp: 'Unknown',
        network_type: 'Broadband',
        latitude: 0,
        longitude: 0,
        timezone: 'UTC',
        utc_offset: '+00:00'
      } as any;
    }
  }

  // Step 3: Definitive Error
  if (lastError instanceof TypeError && lastError.message === 'Failed to fetch') {
    throw new Error('Intelligence network blocked. This is caused by an Ad-blocker or strict Firewall. Please disable "uBlock", "Ad-block", or Brave Shield for this site and refresh.');
  }
  throw new Error('Global IP intelligence is unreachable. Please check your connection.');
};

// Fix: Added missing fraud_score property to satisfy SecurityRisk interface definition
export const analyzeSecurity = async (ipData: any): Promise<SecurityRisk> => {
  const sec = ipData._raw_security || {};
  let riskScore = 0;
  
  if (sec.vpn) riskScore += 35;
  if (sec.proxy) riskScore += 25;
  if (sec.tor) riskScore += 50;
  if (sec.hosting) riskScore += 20;

  // Basic detection for restricted mode
  if (ipData.city === 'Discovery Mode') riskScore = 10;

  riskScore = Math.min(riskScore, 100);

  return {
    is_proxy: !!sec.proxy,
    is_vpn: !!sec.vpn,
    is_tor: !!sec.tor,
    is_hosting: !!sec.hosting,
    risk_score: riskScore,
    threat_level: riskScore > 75 ? 'Critical' : riskScore > 45 ? 'High' : riskScore > 15 ? 'Medium' : 'Low',
    blacklisted: riskScore > 80,
    fraud_score: riskScore
  };
};

export const getDeviceInfo = (): any => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone")) os = "iOS";

  return {
    browser,
    os,
    deviceType: window.screen.width < 768 ? 'Mobile' : 'Desktop',
    resolution: `${window.screen.width}x${window.screen.height}`,
    userAgent: ua,
    language: navigator.language
  };
};