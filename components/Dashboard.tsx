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
  Monitor, 
  ExternalLink,
  Bot,
  Globe,
  Zap,
  Fingerprint,
  Activity,
  Braces,
  Cpu,
  Navigation,
  Lock,
  Search,
  Shield,
  ZapOff
} from 'lucide-react';

interface DashboardProps {
  data: IPData;
  security: SecurityRisk;
  device: DeviceInfo;
  aiInsights: string;
  darkMode: boolean;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ data, security, device, aiInsights, lang }) => {
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
    if (val >= 80) return '#10b981'; // Success Green
    if (val >= 50) return '#3b82f6'; // Info Blue
    if (val >= 25) return '#f59e0b'; // Warning Orange
    return '#ef4444'; // Danger Red
  };

  const flagUrl = `https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png`;

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-20">
      
      {/* ELITE HEADER: IP IDENTITY CARD */}
      <section className="glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
           <Shield size={200} />
        </div>
        <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/80">{t.identity}</p>
            </div>
            <div className="flex items-center gap-5">
               <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tighter text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                {data.ip}
              </h1>
              <button 
                onClick={() => copyToClipboard(data.ip)}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90 border border-white/10 shadow-lg backdrop-blur-md"
              >
                {copied ? <Check size={24} className="text-emerald-500" /> : <Copy size={24} className="text-slate-400" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Network size={12} /> {data.network_type || 'Broadband'}
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Activity size={12} /> IPv4 STACK
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 p-6 bg-black/40 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
             <div className="relative">
                <img src={flagUrl} className="w-20 h-14 object-cover rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.5)] border border-white/10" alt="flag" />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-lg border-2 border-slate-950">
                   <Globe size={14} className="text-white" />
                </div>
             </div>
             <div>
                <p className="text-2xl font-black text-white leading-tight">{data.country_name}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{data.city}, {data.region}</p>
             </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* LEFT COLUMN (GRID 4): SECURITY & PRIVACY */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          
          {/* ENHANCED PRIVACY GAUGE */}
          <div className="glass-card p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 w-full text-center">{t.securityScore}</h3>
            
            <div className="relative flex justify-center items-center h-56 w-56">
              {/* Outer Glow Circle */}
              <div 
                className="absolute inset-0 rounded-full blur-[40px] opacity-20 transition-all duration-1000"
                style={{ backgroundColor: getRiskColor(gaugeValue) }}
              ></div>
              
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                {/* Background Track */}
                <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="transparent" />
                {/* Score Fill */}
                <circle
                  cx="50%" cy="50%" r="42%"
                  stroke={getRiskColor(gaugeValue)}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="263%"
                  strokeDashoffset={`${263 - (263 * gaugeValue) / 100}%`}
                  strokeLinecap="round"
                  className="anonymity-circle transition-all duration-1000 ease-out"
                />
                {/* Segmented Detail Ring */}
                <circle cx="50%" cy="50%" r="35%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 8" fill="transparent" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white tracking-tighter text-shadow-lg">{gaugeValue}%</span>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] mt-2 text-center max-w-[80px] leading-tight">
                  {t.anonymityStatus}
                </span>
              </div>
            </div>

            <div className="w-full mt-12 space-y-3">
              {[
                { label: t.proxyVpn, status: security.is_proxy || security.is_vpn, icon: <Lock size={16}/> },
                { label: t.torNode, status: security.is_tor, icon: <Navigation size={16}/> },
                { label: t.hosting, status: security.is_hosting, icon: <Database size={16}/> },
                { label: t.blacklist, status: security.blacklisted, icon: <ZapOff size={16}/> }
              ].map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${item.status ? 'bg-red-500/5 border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`p-2 rounded-lg ${item.status ? 'text-red-500 bg-red-500/10' : 'text-slate-400 bg-slate-800'}`}>{item.icon}</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">{item.label}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {item.status && <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>}
                    {item.status ? t.detected : t.clean}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CYBER FRAUD METER */}
          <div className="glass-card p-8 border-l-4 border-l-amber-500/50">
             <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t.fraudScore}</h3>
                   <p className="text-xl font-black text-white">INTEGRITY SCAN</p>
                </div>
                <Zap size={24} className="text-amber-500 animate-pulse" />
             </div>
             <div className="space-y-6">
                <div className="relative h-4 w-full bg-slate-950 rounded-full border border-white/5 p-1">
                   <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    style={{ width: `${100 - gaugeValue}%` }}
                   ></div>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-[10px] font-black uppercase text-slate-500 space-y-1">
                      <p>Probability</p>
                      <p className="text-xs text-white">{(100 - gaugeValue).toFixed(0)}% RISK</p>
                   </div>
                   <div className="text-right text-[10px] font-black uppercase text-slate-500 space-y-1">
                      <p>Status</p>
                      <p className={`text-xs ${gaugeValue > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {gaugeValue > 80 ? 'HIGH INTEGRITY' : 'SUSPICIOUS'}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* CENTER COLUMN (GRID 4): GEO & NETWORK */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          
          <div className="glass-card p-8 h-full">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl shadow-inner"><MapPin size={24} /></div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t.location}</h3>
                <p className="text-xl font-black text-white">GEOSPATIAL INTEL</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="group bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">City / Municipality</p>
                  <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{data.city}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">State/Region</p>
                      <p className="text-sm font-bold text-white truncate">{data.region || 'N/A'}</p>
                   </div>
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Postal Code</p>
                      <p className="text-sm font-bold text-white">{data.postal || 'N/A'}</p>
                   </div>
                </div>
                <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.currency}</p>
                      <p className="text-lg font-black text-blue-400">{data.currency}</p>
                   </div>
                   <div className="p-3 bg-blue-500/10 rounded-xl">
                      <ExternalLink size={20} className="text-blue-500" />
                   </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-950/80 rounded-3xl border border-white/5 flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-lg"><Clock size={18} className="text-slate-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.timezone}</p>
                      <p className="text-sm font-black text-white">{data.timezone}</p>
                    </div>
                 </div>
                 <span className="text-xs font-mono font-bold px-3 py-1 bg-blue-600/20 text-blue-500 rounded-lg">{data.utc_offset}</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><Network size={24} /></div>
              <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t.isp}</h3>
                 <p className="text-xl font-black text-white">PROVIDER NODE</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Organization Handle</p>
                <p className="text-lg font-black text-white leading-tight">{data.org}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/20">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">ASN Index</p>
                    <p className="text-sm font-mono font-black text-indigo-400">AS{data.asn}</p>
                 </div>
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5 overflow-hidden">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.hostname}</p>
                    <p className="text-[10px] font-mono font-bold text-slate-400 truncate">{data.hostname || 'UNRESOLVED'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (GRID 4): FORENSICS & ANALYSIS */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          
          {/* MAP: DARK SATELLITE MODE */}
          <div className="glass-card overflow-hidden h-72 relative group border-2 border-white/5">
             <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.7) contrast(1.2)' }} 
                src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=10&output=embed`}
                allowFullScreen
             ></iframe>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none"></div>
             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase text-white shadow-2xl backdrop-blur-md">
                   <Navigation size={14} /> {t.mapView}
                </div>
                <span className="text-[10px] font-mono font-black text-slate-400 bg-black/80 px-3 py-1.5 rounded-lg border border-white/5">
                  {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                </span>
             </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl"><Fingerprint size={24} /></div>
              <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t.visitorDevice}</h3>
                 <p className="text-xl font-black text-white">HARDWARE TRACE</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: t.browser, value: device.browser, icon: <Globe size={16} />, color: 'text-blue-500' },
                { label: t.os, value: device.os, icon: <Monitor size={16} />, color: 'text-indigo-500' },
                { label: t.resolution, value: device.resolution, icon: <Activity size={16} />, color: 'text-pink-500' },
                { label: t.deviceType, value: device.deviceType, icon: <Cpu size={16} />, color: 'text-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <span className={item.color}>{item.icon}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="text-xs font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI NEURAL REPORT */}
          <div className="glass-card p-8 bg-blue-600/5 border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full"></div>
            <div className="flex items-center gap-4 mb-8">
              <Bot size={28} className="text-blue-500 animate-pulse" />
              <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t.aiAnalysis}</h3>
                 <p className="text-xl font-black text-white uppercase">Neural Assessment</p>
              </div>
            </div>
            {aiInsights ? (
              <div className="text-xs md:text-sm leading-relaxed text-slate-300 italic bg-black/40 border border-white/5 p-6 rounded-3xl shadow-inner">
                {aiInsights}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500 space-y-4">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t.analyzing}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION GRID */}
      <section className="glass-card p-10 bg-slate-950/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <Zap size={24} className="text-blue-500" />
                 <h3 className="text-3xl font-black tracking-tighter uppercase">{t.advancedUtils}</h3>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Investigative Toolkit</p>
           </div>
           <div className="h-1 flex-1 mx-10 bg-gradient-to-r from-blue-500/20 via-transparent to-transparent hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => copyToClipboard(JSON.stringify({ data, security, device }, null, 2))}
            className="group p-8 bg-slate-900/40 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 shadow-xl"
          >
            <Braces size={32} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white">{t.copyJson}</span>
          </button>
          
          <a 
            href={`https://whoer.net/check?ip=${data.ip}`} 
            target="_blank" 
            className="group p-8 bg-slate-900/40 hover:bg-emerald-600/10 border border-white/5 hover:border-emerald-500/30 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 shadow-xl"
          >
            <Search size={32} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white">{t.whois}</span>
          </a>

          <a 
            href={`https://dnschecker.org/#A/${data.ip}`} 
            target="_blank" 
            className="group p-8 bg-slate-900/40 hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/30 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 shadow-xl"
          >
            <Globe size={32} className="text-slate-500 group-hover:text-indigo-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white">{t.dns}</span>
          </a>

          <button 
            onClick={() => window.print()}
            className="group p-8 bg-slate-900/40 hover:bg-pink-600/10 border border-white/5 hover:border-pink-500/30 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 shadow-xl"
          >
            <ExternalLink size={32} className="text-slate-500 group-hover:text-pink-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white">Print Intel</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;