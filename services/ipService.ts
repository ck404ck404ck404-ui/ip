import { IPData, SecurityRisk } from '../types';

/**
 * Enhanced Fallback Strategy (Cascade Fetch):
 * 1. ipwhois (Supports both IP and Domains)
 * 2. ipapi (Secondary IP support)
 * 3. bigdatacloud (Client-only fallback)
 */

const providers = [
  {
    name: 'ipwhois',
    url: (query?: string) => `https://ipwho.is/${query || ''}`,
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
    name: 'ipapi',
    url: (query?: string) => `https://ipapi.co/${query ? `${query}/json/` : 'json/'}`,
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

export const fetchIPDetails = async (targetQuery?: string): Promise<IPData> => {
  let lastError: any = null;

  // Cleanup query (remove http/https if present)
  let cleanQuery = targetQuery?.trim().replace(/^(https?:\/\/)/, '').replace(/\/$/, '');

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url(cleanQuery), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) continue;
      const data = await response.json();
      
      // Validation for different APIs
      if (data.success === false || data.error === true) continue;
      // ipwhois uses 'success' boolean, ipapi.co returns data directly or error=true
      if (!data.ip && !data.city) continue;

      return provider.map(data) as any;
    } catch (error) {
      lastError = error;
    }
  }

  // Critical Fallback for empty search (My IP)
  if (!cleanQuery) {
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

  if (lastError instanceof TypeError && lastError.message === 'Failed to fetch') {
    throw new Error('Intelligence network blocked. Please disable Ad-blockers or VPN and refresh.');
  }
  throw new Error('Intelligence node unreachable. Input might be invalid or network is down.');
};

export const analyzeSecurity = async (ipData: any): Promise<SecurityRisk> => {
  const sec = ipData._raw_security || {};
  let riskScore = 0;
  
  if (sec.vpn) riskScore += 35;
  if (sec.proxy) riskScore += 25;
  if (sec.tor) riskScore += 50;
  if (sec.hosting) riskScore += 20;

  if (ipData.city === 'Discovery Mode') riskScore = 5;

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