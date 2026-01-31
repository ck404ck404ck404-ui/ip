
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
  AlertTriangle, 
  Monitor, 
  Code,
  ExternalLink,
  Bot,
  Globe,
  Braces,
  ShieldCheck,
  ShieldAlert,
  Zap
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
  const [gaugeOffset, setGaugeOffset] = useState(440); // Initial circle offset
  const t = translations[lang];

  useEffect(() => {
    // Animate the gauge on mount
    const score = 100 - security.risk_score;
    const offset = 440 - (440 * score) / 100;
    const timeout = setTimeout(() => setGaugeOffset(offset), 300);
    return () => clearTimeout(timeout);
  }, [security.risk_score]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyJson = () => {
    const jsonStr = JSON.stringify({ data, security, device }, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = () => {
    if (security.risk_score <= 15) return 'text-emerald-500';
    if (security.risk_score <= 45) return 'text-blue-500';
    if (security.risk_score <= 75) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRiskBg = () => {
    if (security.risk_score <= 15) return 'from-emerald-500/20 to-emerald-500/5';
    if (security.risk_score <= 45) return 'from-blue-500/20 to-blue-500/5';
    if (security.risk_score <= 75) return 'from-amber-500/20 to-amber-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  const flagUrl = `https://flagcdn.com/w40/${data.country_code.toLowerCase()}.png`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Left Column: Core Info & AI */}
      <div className="lg:col-span-2 space-y-6">
        <div className={`p-6 rounded-3xl shadow-2xl overflow-hidden relative border transition-all duration-500 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Globe size={240} className="text-blue-500" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img 
                  src={flagUrl} 
                  alt={`${data.country_name} flag`} 
                  className="w-16 h-11 object-cover rounded-xl shadow-2xl border-2 border-white/10 group-hover:scale-105 transition-transform"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-lg text-white shadow-lg">
                  <Globe size={12} />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1 block">{t.identity}</span>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl md:text-5xl font-mono font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                    {data.ip}
                  </h2>
                  <button 
                    onClick={() => copyToClipboard(data.ip)}
                    className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                      darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border shadow-lg ${
              security.threat_level === 'Low' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
              security.threat_level === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
              <Zap size={16} className="fill-current" />
              <span className="text-sm font-bold tracking-wide">
                {security.threat_level} Risk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all"><MapPin size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{t.location}</p>
                  <p className="font-bold text-lg leading-tight">{data.city}, {data.region}<br/><span className="text-slate-500 font-medium text-sm">{data.country_name}</span></p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all"><Network size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{t.isp}</p>
                  <p className="font-bold text-lg leading-tight truncate max-w-[240px]">{data.org}<br/><span className="text-slate-500 font-medium text-sm">ASN {data.asn}</span></p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all"><Clock size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{t.timezone}</p>
                  <p className="font-bold text-lg leading-tight">{data.timezone}<br/><span className="text-slate-500 font-medium text-sm">UTC {data.utc_offset}</span></p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all"><Database size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{t.postalCoords}</p>
                  <p className="font-bold text-lg leading-tight">{data.postal || 'N/A'}<br/><span className="text-slate-500 font-medium text-sm">{data.latitude}, {data.longitude}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-wrap gap-4 items-center">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-white/5">
                <Activity size={14} className="text-pink-500" />
                <span className="text-xs font-mono text-slate-400">Host: {data.hostname || 'Unresolved'}</span>
             </div>
             <div className="flex gap-4 ml-auto">
                <button onClick={copyJson} className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <Braces size={14} /> {t.rawJson}
                </button>
                <a href={`https://who.is/whois-ip/ip-address/${data.ip}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  WHOIS <ExternalLink size={12} />
                </a>
             </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className={`p-8 rounded-3xl border shadow-2xl transition-all duration-500 relative overflow-hidden ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-blue-50/50 border-blue-100'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/4 -translate-y-1/4">
            <Bot size={180} />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20"><Bot size={24} /></div>
            <div>
              <h3 className="text-xl font-black tracking-tight">{t.aiAnalysis}</h3>
              <p className="text-xs text-slate-500 font-medium">{t.analyzing}</p>
            </div>
          </div>
          {aiInsights ? (
             <div className="relative z-10 group">
               <div className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-6 rounded-2xl border border-white/10 backdrop-blur-sm group-hover:border-blue-500/30 transition-colors">
                 {aiInsights}
               </div>
               <div className="absolute -bottom-2 -right-2 bg-blue-600/10 text-blue-500 text-[10px] font-black px-2 py-1 rounded-lg border border-blue-500/20">
                 SECURED_INTEL_MODEL_2.5
               </div>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500 space-y-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm font-medium animate-pulse">{t.analyzing}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Security Profile & Device Info */}
      <div className="space-y-6">
        {/* ENHANCED Security Risk Profile Card */}
        <div className={`p-8 rounded-3xl shadow-2xl border relative overflow-hidden transition-all duration-500 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Background Highlight */}
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[80px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000 bg-gradient-to-br ${getRiskBg()}`}></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${
                security.risk_score > 50 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              }`}>
                {security.risk_score > 50 ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
              </div>
              <h3 className="text-lg font-black tracking-tight">{t.securityRisk}</h3>
            </div>
            <div className={`text-4xl font-black font-mono tracking-tighter ${getRiskColor()}`}>
              {security.risk_score}
            </div>
          </div>

          {/* Custom SVG Gauge */}
          <div className="relative flex justify-center items-center h-48 mb-8">
            <svg className="w-44 h-44 -rotate-90">
              {/* Background Ring */}
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-800/40"
              />
              {/* Score Ring */}
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out drop-shadow-[0_0_8px_currentColor] ${getRiskColor()}`}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">{t.securityScore}</p>
              <p className={`text-3xl font-black tracking-tighter ${security.risk_score > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                {100 - security.risk_score}%
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-500">{t.secure}</p>
            </div>
          </div>

          {/* New Custom Risk Meter Bar */}
          <div className="mb-8 relative px-2">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
               <div className="h-full bg-emerald-500" style={{ width: '33%' }}></div>
               <div className="h-full bg-amber-500" style={{ width: '33%' }}></div>
               <div className="h-full bg-red-500" style={{ width: '34%' }}></div>
            </div>
            <div 
              className={`absolute top-0 -translate-y-full mb-1 transition-all duration-1000 ease-out`}
              style={{ left: `${security.risk_score}%` }}
            >
               <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${getRiskColor().replace('text-', 'bg-')}`}></div>
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
               <span>Safe</span>
               <span>Warning</span>
               <span>Critical</span>
            </div>
          </div>

          {/* Redesigned Risk Factor List */}
          <div className="space-y-3">
            {[
              { label: t.proxyVpn, status: security.is_proxy || security.is_vpn, color: 'red' },
              { label: t.torNode, status: security.is_tor, color: 'red' },
              { label: t.hosting, status: security.is_hosting, color: 'orange' },
              { label: t.blacklist, status: security.blacklisted, color: 'red' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`flex justify-between items-center px-4 py-3 rounded-2xl border transition-all hover:translate-x-1 duration-300 ${
                  item.status 
                    ? 'bg-red-500/5 border-red-500/20' 
                    : 'bg-slate-800/30 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500'}`}></div>
                   <span className="text-sm font-bold text-slate-300">{item.label}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                  item.status 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                    : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {item.status ? (item.label === t.blacklist ? t.flagged : t.detected) : (item.label === t.blacklist ? t.passed : t.clean)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Device Info Card */}
        <div className={`p-8 rounded-3xl shadow-2xl border transition-all duration-500 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><Monitor size={22} /></div>
            <h3 className="text-lg font-black tracking-tight">{t.visitorDevice}</h3>
          </div>
          <div className="space-y-5">
            {[
              { label: t.browser, value: device.browser, icon: <Globe size={14} className="text-blue-500" /> },
              { label: t.os, value: device.os, icon: <Monitor size={14} className="text-indigo-500" /> },
              { label: t.resolution, value: device.resolution, icon: <Activity size={14} className="text-pink-500" /> },
              { label: t.deviceType, value: device.deviceType, icon: <Monitor size={14} className="text-emerald-500" /> }
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">{d.icon}</div>
                  <span className="text-sm font-medium text-slate-500">{d.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-200">{d.value}</span>
              </div>
            ))}
            <div className="mt-6 pt-6 border-t border-slate-800/50">
              <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-3">{t.userAgent}</p>
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
                <p className="text-[10px] font-mono text-slate-500 break-all leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                  {device.userAgent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
