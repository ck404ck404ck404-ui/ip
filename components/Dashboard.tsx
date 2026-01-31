import React, { useState, useEffect } from 'react';
import { IPData, SecurityRisk, DeviceInfo, Language } from '../types';
import { translations } from '../translations';
import { 
  MapPin, 
  Network, 
  Clock, 
  Copy, 
  Check, 
  Database, 
  Activity, 
  ShieldAlert, 
  Monitor, 
  ExternalLink,
  Bot,
  Globe,
  Braces,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface DashboardProps {
  data: IPData;
  security: SecurityRisk;
  device: DeviceInfo;
  aiInsights: string;
  darkMode: boolean;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ data, security, device, aiInsights, darkMode, lang }) => {
  const [copied, setCopied] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);
  const t = translations[lang];

  const anonymityPercent = 100 - security.risk_score;

  useEffect(() => {
    // Smooth transition for the gauge
    const timeout = setTimeout(() => setGaugeValue(anonymityPercent), 100);
    return () => clearTimeout(timeout);
  }, [anonymityPercent]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (score: number) => {
    if (score <= 15) return '#10b981'; // emerald-500
    if (score <= 45) return '#3b82f6'; // blue-500
    if (score <= 75) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const flagUrl = `https://flagcdn.com/w80/${data.country_code.toLowerCase()}.png`;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* Top Hero Section - Big IP Display */}
      <div className="text-center space-y-4 py-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <p className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500">{t.identity}</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 relative z-10">
          <h1 className="text-5xl md:text-8xl font-black font-mono tracking-tighter text-white drop-shadow-2xl">
            {data.ip}
          </h1>
          <button 
            onClick={() => copyToClipboard(data.ip)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:scale-110 active:scale-95 text-slate-400 hover:text-white"
          >
            {copied ? <Check size={28} className="text-emerald-500" /> : <Copy size={28} />}
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 border border-white/5 rounded-full shadow-lg">
            <img src={flagUrl} className="w-6 h-4 object-cover rounded shadow" alt="flag" />
            <span className="text-sm font-bold">{data.city}, {data.country_name}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900/80 border border-white/5 rounded-full shadow-lg">
            <span className="text-sm font-bold text-blue-400">{data.org}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Detail Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 rounded-[2.5rem] group hover:border-blue-500/30 transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform"><MapPin size={24} /></div>
                <h3 className="text-lg font-black tracking-tight">{t.location}</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">City & Region</p>
                  <p className="text-xl font-bold">{data.city}, {data.region}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Country</p>
                  <p className="text-xl font-bold">{data.country_name} ({data.country_code})</p>
                </div>
                <div className="flex gap-10">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Latitude</p>
                    <p className="font-mono font-bold text-slate-300">{data.latitude}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Longitude</p>
                    <p className="font-mono font-bold text-slate-300">{data.longitude}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform"><Network size={24} /></div>
                <h3 className="text-lg font-black tracking-tight">{t.isp}</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Organization / ISP</p>
                  <p className="text-xl font-bold leading-tight">{data.org}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">ASN (Autonomous System)</p>
                  <p className="text-xl font-bold font-mono text-indigo-400">AS{data.asn}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Hostname</p>
                  <p className="text-sm font-mono text-slate-400 truncate">{data.hostname || 'Unresolved Host'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights - Large Panel */}
          <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
              <Bot size={280} />
            </div>
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-500/20">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">{t.aiAnalysis}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Real-time analysis active</p>
                </div>
              </div>
            </div>
            {aiInsights ? (
              <div className="relative z-10">
                <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-line bg-white/5 p-8 rounded-[2rem] border border-white/5 backdrop-blur shadow-inner">
                  {aiInsights}
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center space-y-6 text-slate-500">
                <RefreshCcw size={48} className="animate-spin opacity-20" />
                <p className="text-lg font-bold animate-pulse">{t.analyzing}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Security Profile & Device (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Anonymity Score Panel - THE KEY PIECE */}
          <div className="glass-card p-10 rounded-[3rem] border-t-2 border-t-white/10">
            <div className="text-center mb-8">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-2">{t.securityScore}</h3>
              <p className="text-[10px] font-bold text-slate-400 px-6 py-1 bg-white/5 rounded-full inline-block">ANONYMITY STATUS</p>
            </div>

            <div className="relative flex justify-center items-center h-64">
              {/* Outer Ring */}
              <svg className="w-56 h-56 -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke={getRiskColor(security.risk_score)}
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray="628"
                  strokeDashoffset={628 - (628 * gaugeValue) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1500 ease-out"
                  style={{ filter: `drop-shadow(0 0 12px ${getRiskColor(security.risk_score)}88)` }}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black tracking-tighter text-white">{gaugeValue}%</span>
                <span className={`text-xs font-black uppercase tracking-widest mt-1 ${gaugeValue > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {gaugeValue >= 90 ? 'Protected' : gaugeValue >= 60 ? 'Moderate' : 'Unsafe'}
                </span>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              {[
                { label: t.proxyVpn, status: security.is_proxy || security.is_vpn },
                { label: t.torNode, status: security.is_tor },
                { label: t.hosting, status: security.is_hosting },
                { label: t.blacklist, status: security.blacklisted }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-sm font-bold text-slate-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status ? 'text-red-500' : 'text-emerald-500'}`}>
                      {item.status ? 'Detected' : 'No'}
                    </span>
                    {item.status ? <ShieldAlert size={14} className="text-red-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Forensics */}
          <div className="glass-card p-8 rounded-[2.5rem] group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl group-hover:scale-110 transition-transform"><Monitor size={24} /></div>
              <h3 className="text-lg font-black tracking-tight">{t.visitorDevice}</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: t.browser, value: device.browser },
                { label: t.os, value: device.os },
                { label: t.resolution, value: device.resolution },
                { label: t.deviceType, value: device.deviceType }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                  <span className="text-sm font-bold text-slate-200">{item.value}</span>
                </div>
              ))}
              <div className="pt-4">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">User Agent Hash</p>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                  <p className="text-[10px] font-mono text-slate-500 break-all leading-tight line-clamp-2">
                    {device.userAgent}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const jsonStr = JSON.stringify({ data, security, device }, null, 2);
                navigator.clipboard.writeText(jsonStr);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 p-4 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Braces size={16} /> JSON
            </button>
            <a 
              href={`https://whoer.net/check?ip=${data.ip}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 p-4 bg-blue-600 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white hover:bg-blue-500 transition-all hover:shadow-lg shadow-blue-500/20"
            >
              External Check <ExternalLink size={16} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

const RefreshCcw = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

export default Dashboard;