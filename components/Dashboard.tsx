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
  Cpu
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
    <div className="w-full space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-10">
      
      {/* HERO SECTION: IP ADDRESS */}
      <section className="glass-card p-6 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <p className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-blue-500 mb-4">{t.identity}</p>
        
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <div className="relative group flex items-center gap-2 md:gap-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-white break-all">
              {data.ip}
            </h1>
            <button 
              onClick={() => copyToClipboard(data.ip)}
              className="p-3 md:p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-xl active:scale-90"
              title="Copy IP"
            >
              {copied ? <Check size={20} className="md:w-8 md:h-8" /> : <Copy size={20} className="md:w-8 md:h-8" />}
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 bg-white/5 rounded-full border border-white/10">
              <img src={flagUrl} className="w-5 h-3.5 md:w-8 md:h-5 object-cover rounded shadow" alt="flag" />
              <span className="text-xs md:text-sm font-bold">{data.city}, {data.country_name}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 bg-white/5 rounded-full border border-white/10">
              <Activity size={14} className="text-blue-500" />
              <span className="text-xs md:text-sm font-bold text-slate-400 truncate max-w-[150px] md:max-w-xs">{data.org}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* COLUMN 1: SECURITY GAUGE */}
        <div className="glass-card p-6 md:p-8 flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 w-full text-center">{t.securityScore}</h3>
          
          <div className="relative flex justify-center items-center h-48 md:h-56">
            <svg className="w-44 h-44 md:w-52 md:h-52 -rotate-90">
              <circle cx="50%" cy="50%" r="40%" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="transparent" />
              <circle
                cx="50%" cy="50%" r="40%"
                stroke={getRiskColor(gaugeValue)}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="251.3%" /* Approximation for relative stroke */
                strokeDashoffset={`${251.3 - (251.3 * gaugeValue) / 100}%`}
                strokeLinecap="round"
                className="anonymity-circle"
                style={{ 
                    strokeDasharray: '251.3%',
                    strokeDashoffset: (251.3 - (251.3 * gaugeValue) / 100) + '%'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-black">{gaugeValue}%</span>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">Status</span>
            </div>
          </div>

          <div className="w-full mt-10 space-y-3">
            {[
              { label: t.proxyVpn, status: security.is_proxy || security.is_vpn },
              { label: t.torNode, status: security.is_tor },
              { label: t.hosting, status: security.is_hosting },
              { label: t.blacklist, status: security.blacklisted }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase ${item.status ? 'text-red-500' : 'text-emerald-500'}`}>
                    {item.status ? t.detected : t.clean}
                  </span>
                  {item.status ? <ShieldAlert size={14} className="text-red-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: GEOGRAPHIC & NETWORK */}
        <div className="space-y-6 md:space-y-8">
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><MapPin size={20} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest">{t.location}</h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">State / City</p>
                <p className="text-base md:text-lg font-bold">{data.region || 'Unknown'}, {data.city}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Timezone</p>
                  <p className="text-xs md:text-sm font-bold truncate">{data.timezone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Currency</p>
                  <p className="text-xs md:text-sm font-bold">{data.currency}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"><Network size={20} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest">{t.isp}</h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Infrastructure</p>
                <p className="text-base md:text-lg font-bold truncate">{data.org}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">ASN</p>
                  <p className="text-sm font-mono font-bold text-indigo-400">AS{data.asn}</p>
                </div>
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-400 uppercase">
                  Routing Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: DEVICE & AI */}
        <div className="space-y-6 md:space-y-8 lg:col-span-1 md:col-span-2 lg:block">
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl"><Fingerprint size={20} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest">{t.visitorDevice}</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { label: t.browser, value: device.browser, icon: <Globe size={14} /> },
                { label: t.os, value: device.os, icon: <Monitor size={14} /> },
                { label: t.resolution, value: device.resolution, icon: <Activity size={14} /> }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">{item.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 bg-blue-600/5 border-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Bot size={24} className="text-blue-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest">{t.aiAnalysis}</h3>
            </div>
            {aiInsights ? (
              <div className="text-xs md:text-sm leading-relaxed text-slate-300 italic">
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

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => copyToClipboard(JSON.stringify({ data, security, device }, null, 2))}
          className="flex-1 p-4 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-xl"
        >
          <Braces size={18} className="text-blue-500" /> RAW INTEL
        </button>
        <a 
          href={`https://whoer.net/check?ip=${data.ip}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
        >
          Verify Integrity <ExternalLink size={18} />
        </a>
      </div>

    </div>
  );
};

export default Dashboard;