
export interface IPData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  languages: string;
  asn: string;
  org: string;
  isp?: string;
  network_type?: 'Mobile' | 'Broadband' | 'Hosting' | 'Corporate';
  hostname?: string;
}

export interface SecurityRisk {
  is_proxy: boolean;
  is_vpn: boolean;
  is_tor: boolean;
  is_hosting: boolean;
  risk_score: number; // 0-100
  threat_level: 'Low' | 'Medium' | 'High' | 'Critical';
  blacklisted: boolean;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  resolution: string;
  userAgent: string;
  language: string;
}

export interface LookupHistory {
  id: string;
  ip: string;
  timestamp: string;
  location: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}
