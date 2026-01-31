
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
  ShieldCheck,
  Zap,
  Fingerprint,
  Cpu,
  Lock,
  ArrowUpRight,
  // Added missing Braces icon import
  Braces
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
    const timeout = setTimeout(() => setGaugeValue(anonymityPercent), 300);
    return () => clearTimeout(timeout);
  }, [anonymityPercent]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (val: number) => {
    if (val >= 90) return '#10b981';
    if (val >= 60) return '#3b82f6';
    if (val >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const flagUrl = `https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png`;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* HEADER HERO: THE IDENTITY CARD */}
      <section className="relative pt-12 pb-24 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase">
            <Activity size={12} className="animate-pulse" />
            Active Signal Detected
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <h1 className="text-6xl md:text-9xl font-black font-mono tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-none">
              {data.ip}
            </h1>
            <button 
              onClick={() => copyToClipboard(data.ip)}
              className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] transition-all hover:scale-110 active:scale-95 text-slate-400 hover:text-white shadow-2xl"
            >
              {copied ? <Check size={32} className="text-emerald-500" /> : <Copy size={32} />}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-4 pl-2 pr-6 py-2 bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-md shadow-xl">
              <img src={flagUrl} className="w-10 h-7 object-cover rounded shadow-lg border border-white/10" alt="flag" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Origin</p>
                <p className="text-sm font-bold text-white">{data.city}, {data.country_name}</p>
              </div>
            </div>
            <div className="px-6 py-2 bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-md shadow-xl text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Infrastructure</p>
              <p className="text-sm font-bold text-blue-400">{data.org}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-2">
        
        {/* LEFT: CORE INTELLIGENCE (8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* GEOGRAPHIC & NETWORK DETAIL GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-premium p-10 rounded-[3rem] group">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-500/10 text-blue-500 rounded-3xl"><MapPin size={28} /></div>
                  <h3 className="text-xl font-black tracking-tight">{t.location}</h3>
                </div>
                <Globe size={20} className="text-slate-700" />
              </div>
              
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Regional Hub</p>
                    <p className="text-2xl font-bold">{data.region}, {data.city}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Temporal Alignment</p>
                    <p className="text-xl font-bold">{data.timezone}</p>
                  </div>
                  <p className="text-sm font-mono text-slate-500">UTC {data.utc_offset}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">LAT</p>
                    <p className="font-mono font-bold text-lg">{data.latitude}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">LONG</p>
                    <p className="font-mono font-bold text-lg">{data.longitude}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-premium p-10 rounded-[3rem] group">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-3xl"><Network size={28} /></div>
                  <h3 className="text-xl font-black tracking-tight">{t.isp}</h3>
                </div>
                <Activity size={20} className="text-slate-700" />
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Main Backbone</p>
                  <p className="text-2xl font-bold leading-tight line-clamp-2">{data.org}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Autonomous System</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-black font-mono text-indigo-400">AS{data.asn}</p>
                    <div className="h-1 flex-1 bg-white/5 rounded-full">
                       <div className="h-full bg-indigo-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Network Resolution</p>
                  <p className="text-sm font-mono text-slate-400 truncate bg-black/30 p-3 rounded-xl border border-white/5">
                    {data.hostname || 'Unresolved.PTR_Signal_Null'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI STRATEGIC REPORT PANEL */}
          <div className="glass-premium p-12 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-5 transition-opacity duration-1000">
              <Bot size={350} />
            </div>
            
            <div className="flex items-center gap-6 mb-10 relative z-10">
              <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-[2rem] shadow-2xl shadow-blue-500/20 animate-pulse">
                <Cpu size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter">{t.aiAnalysis}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0s'}}></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Processing Neural Insights</p>
                </div>
              </div>
            </div>

            {aiInsights ? (
              <div className="relative z-10">
                <div className="text-slate-200 text-xl leading-[1.8] font-medium whitespace-pre-line bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-inner-white">
                  {aiInsights}
                </div>
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center space-y-8 text-slate-600">
                <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-xl font-bold tracking-widest animate-pulse">{t.analyzing}</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: SECURITY & FINGERPRINT (4 COLS) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* ANONYMITY GAUGE PANEL (WHOER STYLE) */}
          <div className="glass-premium p-10 rounded-[3rem] border-t-4 border-t-blue-500/50">
            <div className="text-center mb-10">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{t.securityScore}</h3>
              <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="text-[10px] font-black tracking-widest text-slate-400">{t.anonymityStatus}</span>
              </div>
            </div>

            <div className="relative flex justify-center items-center h-72">
              <svg className="w-64 h-64 -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="20"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke={getStatusColor(gaugeValue)}
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray="691"
                  strokeDashoffset={691 - (691 * gaugeValue) / 100}
                  strokeLinecap="round"
                  className="anonymity-gauge-ring"
                  style={{ filter: `drop-shadow(0 0 15px ${getStatusColor(gaugeValue)}66)` }}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black tracking-tighter text-white">{gaugeValue}%</span>
                <span className={`text-sm font-black uppercase tracking-[0.2em] mt-3 ${gaugeValue >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                   {gaugeValue >= 90 ? t.protectionLevel[3] : gaugeValue >= 70 ? t.protectionLevel[2] : gaugeValue >= 40 ? t.protectionLevel[1] : t.protectionLevel[0]}
                </span>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              {[
                { label: t.proxyVpn, status: security.is_proxy || security.is_vpn },
                { label: t.torNode, status: security.is_tor },
                { label: t.hosting, status: security.is_hosting },
                { label: t.blacklist, status: security.blacklisted }
              ].map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center p-5 rounded-3xl border transition-all ${item.status ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.status ? 'bg-red-500/10 text-red-500' : 'bg-slate-800/50 text-slate-500'}`}>
                      {item.status ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                    </div>
                    <span className="text-sm font-bold text-slate-300">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.status ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {item.status ? t.detected : t.clean}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HARDWARE FINGERPRINT PANEL */}
          <div className="glass-premium p-10 rounded-[3rem] group overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-pink-500/10 text-pink-500 rounded-3xl"><Fingerprint size={28} /></div>
                <h3 className="text-xl font-black tracking-tight">{t.visitorDevice}</h3>
              </div>
              <Lock size={18} className="text-slate-700" />
            </div>
            
            <div className="space-y-6">
              {[
                { label: t.browser, value: device.browser, icon: <Globe size={14} /> },
                { label: t.os, value: device.os, icon: <Monitor size={14} /> },
                { label: t.resolution, value: device.resolution, icon: <Activity size={14} /> },
                { label: t.deviceType, value: device.deviceType, icon: <Cpu size={14} /> }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group/item transition-all hover:translate-x-1">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">{item.icon}</span>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-lg">{item.value}</span>
                </div>
              ))}
              
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-4">{t.userAgent}</p>
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 relative group/ua cursor-help">
                  <p className="text-[11px] font-mono text-slate-500 break-all leading-relaxed line-clamp-3 group-hover/ua:line-clamp-none transition-all">
                    {device.userAgent}
                  </p>
                  <div className="absolute top-2 right-2 p-1 bg-white/5 rounded-lg opacity-0 group-hover/ua:opacity-100 transition-opacity">
                    <ArrowUpRight size={10} className="text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* MISSION ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                const jsonStr = JSON.stringify({ data, security, device }, null, 2);
                navigator.clipboard.writeText(jsonStr);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="group p-5 bg-slate-900 border border-white/10 rounded-[2rem] flex items-center justify-center gap-3 font-black text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              <Braces size={16} className="text-blue-500 group-hover:scale-110 transition-transform" /> JSON INTEL
            </button>
            <a 
              href={`https://whoer.net/check?ip=${data.ip}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-5 bg-blue-600 rounded-[2rem] flex items-center justify-center gap-3 font-black text-xs text-white hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] uppercase tracking-widest"
            >
              VERIFY <ExternalLink size={16} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
