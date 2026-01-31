
import { IPData, SecurityRisk } from '../types';

export const fetchIPDetails = async (targetIp?: string): Promise<IPData> => {
  const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : `https://ipapi.co/json/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch IP details');
  const data = await response.json();
  
  // Enriched simulated fields for missing features in free API
  return {
    ...data,
    network_type: data.org?.toLowerCase().includes('hosting') ? 'Hosting' : 'Broadband',
    hostname: data.ip.replace(/\./g, '-') + '.dynamic.pool'
  };
};

export const analyzeSecurity = async (ipData: IPData): Promise<SecurityRisk> => {
  // Real world would use specialized security APIs (like IPQualityScore, ProxyCheck)
  // Simulating logic for prototype
  const isHosting = ipData.org?.toLowerCase().includes('hosting') || 
                    ipData.org?.toLowerCase().includes('server') ||
                    ipData.org?.toLowerCase().includes('amazon') ||
                    ipData.org?.toLowerCase().includes('google');
  
  const isVPN = false; // Mock
  const isTor = false; // Mock
  
  let score = 0;
  if (isHosting) score += 40;
  if (isVPN) score += 30;
  if (isTor) score += 50;

  return {
    is_proxy: false,
    is_vpn: isVPN,
    is_tor: isTor,
    is_hosting: !!isHosting,
    risk_score: score,
    threat_level: score > 70 ? 'Critical' : score > 40 ? 'High' : score > 15 ? 'Medium' : 'Low',
    blacklisted: score > 80
  };
};

export const getDeviceInfo = (): any => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  else if (ua.includes("Edge")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  const width = window.screen.width;
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (width < 768) deviceType = 'Mobile';
  else if (width < 1024) deviceType = 'Tablet';

  return {
    browser,
    os,
    deviceType,
    resolution: `${window.screen.width}x${window.screen.height}`,
    userAgent: ua,
    language: navigator.language
  };
};
