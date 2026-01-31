
import React, { useState } from 'react';
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
  Braces
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
  const t = translations[lang];

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

  const riskData = [
    { name: 'Risk', value: security.risk_score },
    { name: 'Safe', value: 100 - security.risk_score },
  ];

  const RISK_COLORS = ['#ef4444', '#22c55e'];
  if (security.threat_level === 'Low') RISK_COLORS[0] = '#3b82f6';
  else if (security.threat_level === 'Medium') RISK_COLORS[0] = '#f59e0b';

  const getRiskColorClass = () => {
    if (security.threat_level === 'Low') return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
    if (security.threat_level === 'Medium') return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  const flagUrl = `https://flagcdn.com/w40/${data.country_code.toLowerCase()}.png`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="lg:col-span-2 space-y-6">
        <div className={`p-6 rounded-2xl shadow-xl overflow-hidden relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Globe size={160} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-start gap-4">
              <img 
                src={flagUrl} 
                alt={`${data.country_name} flag`} 
                className="w-12 h-auto rounded shadow-sm border border-slate-200 dark:border-slate-700 mt-1"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1 block">{t.identity}</span>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl md:text-4xl font-mono font-bold">{data.ip}</h2>
                  <button 
                    onClick={() => copyToClipboard(data.ip)}
                    className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                security.threat_level === 'Low' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                security.threat_level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {t.threatLevel}: {security.threat_level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t.location}</p>
                  <p className="font-medium">{data.city}, {data.region}, {data.country_name} ({data.country_code})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Network size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t.isp}</p>
                  <p className="font-medium">{data.org} (ASN {data.asn})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><Activity size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t.networkHost}</p>
                  <p className="font-medium truncate max-w-[200px]">{data.hostname || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Clock size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t.timezone}</p>
                  <p className="font-medium">{data.timezone} (UTC {data.utc_offset})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Database size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t.postalCoords}</p>
                  <p className="font-medium">{data.postal || 'N/A'} • {data.latitude}, {data.longitude}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg"><Code size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t.devShortcuts}</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={copyJson} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                      <Braces size={12} /> {t.rawJson}
                    </button>
                    <span className="text-slate-400">|</span>
                    <a href={`https://who.is/whois-ip/ip-address/${data.ip}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">WHOIS <ExternalLink size={10} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/30"><Bot size={20} /></div>
            <h3 className="font-bold">{t.aiAnalysis}</h3>
          </div>
          {aiInsights ? (
             <div className="prose prose-sm dark:prose-invert max-w-none">
               <div className="text-slate-400 leading-relaxed whitespace-pre-line bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/10">{aiInsights}</div>
             </div>
          ) : (
            <div className="flex items-center gap-3 py-4 text-slate-400 italic">
              <div className="w-4 h-4 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin"></div>
              <span>{t.analyzing}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              {t.securityRisk}
            </h3>
            <span className="text-2xl font-black font-mono">{security.risk_score}</span>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={180}
                  endAngle={-180}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? RISK_COLORS[0] : darkMode ? '#1e293b' : '#f1f5f9'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-24 pb-12">
              <p className="text-xs uppercase font-bold text-slate-500">{t.securityScore}</p>
              <p className={`text-xl font-bold ${security.risk_score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                {100 - security.risk_score}% {t.secure}
              </p>
            </div>
          </div>

          <div className="mt-2 mb-6 px-1">
            <div className={`h-3 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div 
                className={`h-full transition-all duration-1000 ${getRiskColorClass()}`}
                style={{ width: `${security.risk_score}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 px-0.5">
               <span className="text-[10px] uppercase font-bold text-slate-500">Safe</span>
               <span className="text-[10px] uppercase font-bold text-slate-500">Critical</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { label: t.proxyVpn, status: security.is_proxy || security.is_vpn, color: 'red' },
              { label: t.torNode, status: security.is_tor, color: 'red' },
              { label: t.hosting, status: security.is_hosting, color: 'orange' },
              { label: t.blacklist, status: security.blacklisted, color: 'red' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-slate-500/5 border border-white/5">
                <span className="text-slate-400">{item.label}</span>
                <span className={`font-bold ${item.status ? `text-${item.color}-500` : 'text-green-500'}`}>
                  {item.status ? (item.label === t.blacklist ? t.flagged : t.detected) : (item.label === t.blacklist ? t.passed : t.clean)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Monitor size={18} className="text-blue-500" />
            {t.visitorDevice}
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { label: t.browser, value: device.browser },
              { label: t.os, value: device.os },
              { label: t.resolution, value: device.resolution },
              { label: t.deviceType, value: device.deviceType }
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/50 last:border-0">
                <span className="text-slate-500">{d.label}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
            <div className="mt-2 pt-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t.userAgent}</p>
              <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 break-all leading-tight">{device.userAgent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
