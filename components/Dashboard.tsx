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
  ShieldAlert, 
  Monitor, 
  ExternalLink,
  Bot,
  Globe,
  ShieldCheck,
  Zap,
  Fingerprint,
  Activity,
  Braces,
  Cpu,
  Navigation,
  Lock,
  Search,
  DollarSign
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

  const anonymityPercent = Math.max(0, 100 - security.risk_score);

  useEffect(() => {
    const timeout = setTimeout(() => setGaugeValue(anonymityPercent), 400);
    return () => clearTimeout(timeout);
  }, [anonymityPercent]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (val: number) => {
    if (val >= 90) return '#10b981';
    if (val >= 60) return '#3b82f6';
    if (val >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const flagUrl = `https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png`;

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* HEADER: MAIN IP CARD */}
      <section className="glass-card p-6 md:p-10 border-t-4 border-t-blue-600">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">{t.identity}</p>
            <div className="flex items-center gap-4">
               <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white truncate max-w-[80vw]">
                {data.ip}
              </h1>
              <button 
                onClick={() => copyToClipboard(data.ip)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90 border border-white/10"
              >
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} className="text-slate-400" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {data.network_type || 'Broadband'}
              </span>
              <span className="px-3 py-1 bg-slate-800 border border-white/5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                IPv4 Detected
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
             <img src={flagUrl} className="w-16 h-10 object-cover rounded-lg shadow-xl" alt="flag" />
             <div>
                <p className="text-lg font-bold text-white">{data.country_name}</p>
                <p className="text-xs font-medium text-slate-400">{data.city}, {data.region}</p>
             </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: SECURITY & REPUTATION */}
        <div className="space-y-6 md:space-y-8">
          
          {/* PRIVACY GAUGE */}
          <div className="glass-card p-8 flex flex-col items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 w-full text-center">{t.securityScore}</h3>
            
            <div className="relative flex justify-center items-center h-48">
              <svg className="w-44 h-44 -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50%" cy="50%" r="40%"
                  stroke={getRiskColor(gaugeValue)}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="251.3%"
                  strokeDashoffset={`${251.3 - (251.3 * gaugeValue) / 100}%`}
                  strokeLinecap="round"
                  className="anonymity-circle"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{gaugeValue}%</span>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-1">{t.anonymityStatus}</span>
              </div>
            </div>

            <div className="w-full mt-10 space-y-3">
              {[
                { label: t.proxyVpn, status: security.is_proxy || security.is_vpn, icon: <Lock size={14}/> },
                { label: t.torNode, status: security.is_tor, icon: <Navigation size={14}/> },
                { label: t.hosting, status: security.is_hosting, icon: <Database size={14}/> },
                { label: t.blacklist, status: security.blacklisted, icon: <Activity size={14}/> }
              ].map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3.5 rounded-xl border transition-all ${item.status ? 'bg-red-500/5 border-red-500/10' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className={item.status ? 'text-red-500' : 'text-slate-500'}>{item.icon}</span>
                    <span className="text-xs font-bold text-slate-400">{item.label}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${item.status ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {item.status ? t.detected : t.clean}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FRAUD SCORE CARD */}
          <div className="glass-card p-6 border-l-4 border-l-amber-500">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{t.fraudScore}</h3>
                <Zap size={16} className="text-amber-500" />
             </div>
             <div className="space-y-4">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-1000"
                    style={{ width: `${100 - gaugeValue}%` }}
                   ></div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                   <span>Low Risk</span>
                   <span className="text-amber-500">{(100 - gaugeValue).toFixed(0)}% Probability</span>
                   <span>High Risk</span>
                </div>
             </div>
          </div>
        </div>

        {/* CENTER COLUMN: NETWORK & LOCATION */}
        <div className="space-y-6 md:space-y-8">
          
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><MapPin size={20} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest">{t.location}</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">City</p>
                  <p className="text-sm font-bold text-white">{data.city}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">State</p>
                  <p className="text-sm font-bold text-white truncate">{data.region || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">ZIP / Postal</p>
                  <p className="text-sm font-bold text-white">{data.postal || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">{t.currency}</p>
                  <p className="text-sm font-bold text-blue-400">{data.currency}</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Clock size={16} className="text-slate-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase">{t.timezone}</p>
                      <p className="text-xs font-bold">{data.timezone}</p>
                    </div>
                 </div>
                 <span className="text-xs font-mono text-blue-500">{data.utc_offset}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"><Network size={20} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest">{t.isp}</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Organization / ISP</p>
                <p className="text-lg font-bold text-white leading-tight">{data.org}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">ASN</p>
                    <p className="text-sm font-mono font-bold text-indigo-400">AS{data.asn}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 overflow-hidden">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">{t.hostname}</p>
                    <p className="text-[10px] font-mono font-bold text-slate-300 truncate">{data.hostname || 'None'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORENSICS & MAP */}
        <div className="space-y-6 md:space-y-8 lg:col-span-1 md:col-span-2">
          
          {/* MAP PREVIEW (Iframe approach for visual flair) */}
          <div className="glass-card overflow-hidden h-64 relative group">
             <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8)' }} 
                src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=12&output=embed`}
                allowFullScreen
             ></iframe>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-black uppercase text-white shadow-xl">{t.mapView}</div>
                <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-1 rounded">{data.latitude}, {data.longitude}</span>
             </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl"><Fingerprint size={20} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest">{t.visitorDevice}</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: t.browser, value: device.browser, icon: <Globe size={14} /> },
                { label: t.os, value: device.os, icon: <Monitor size={14} /> },
                { label: t.resolution, value: device.resolution, icon: <Activity size={14} /> },
                { label: t.deviceType, value: device.deviceType, icon: <Cpu size={14} /> }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">{item.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI REPORT PANEL */}
          <div className="glass-card p-6 bg-blue-600/5 border-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Bot size={24} className="text-blue-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest">{t.aiAnalysis}</h3>
            </div>
            {aiInsights ? (
              <div className="text-xs md:text-sm leading-relaxed text-slate-300 italic bg-black/20 p-4 rounded-xl">
                {aiInsights}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-4 text-slate-500">
                <div className="w-4 h-4 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest">{t.analyzing}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADVANCED UTILITIES SECTION */}
      <section className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8">
           <Zap size={24} className="text-blue-500" />
           <h3 className="text-xl font-black tracking-tight uppercase">{t.advancedUtils}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => copyToClipboard(JSON.stringify({ data, security, device }, null, 2))}
            className="p-5 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all"
          >
            <Braces size={24} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.copyJson}</span>
          </button>
          
          <a 
            href={`https://whoer.net/check?ip=${data.ip}`} 
            target="_blank" 
            className="p-5 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all"
          >
            <Search size={24} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.whois}</span>
          </a>

          <a 
            href={`https://dnschecker.org/#A/${data.ip}`} 
            target="_blank" 
            className="p-5 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all"
          >
            <Globe size={24} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.dns}</span>
          </a>

          <button 
            onClick={() => window.print()}
            className="p-5 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all"
          >
            <ExternalLink size={24} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Print Report</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;