
import React, { useState } from 'react';
import { IPData, SecurityRisk, DeviceInfo } from '../types';
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
  Globe
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  data: IPData;
  security: SecurityRisk;
  device: DeviceInfo;
  aiInsights: string;
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ data, security, device, aiInsights, darkMode }) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
    if (security.threat_level === 'Low') return 'bg-blue-500';
    if (security.threat_level === 'Medium') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRiskShadowClass = () => {
    if (security.threat_level === 'Low') return 'shadow-[0_0_15px_rgba(59,130,246,0.4)]';
    if (security.threat_level === 'Medium') return 'shadow-[0_0_15px_rgba(245,158,11,0.4)]';
    return 'shadow-[0_0_15px_rgba(239,68,68,0.4)]';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Main Section: IP Card */}
      <div className="lg:col-span-2 space-y-6">
        <div className={`p-6 rounded-2xl shadow-xl overflow-hidden relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Globe size={160} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1 block">Your Public Identity</span>
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
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                security.threat_level === 'Low' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                security.threat_level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {security.threat_level} Threat Level
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                {data.network_type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Location</p>
                  <p className="font-medium">{data.city}, {data.region}, {data.country_name} ({data.country_code})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Network size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Internet Service Provider</p>
                  <p className="font-medium">{data.org} (ASN {data.asn})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><Activity size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Network & Host</p>
                  <p className="font-medium truncate max-w-[200px]" title={data.hostname}>{data.hostname || 'No reverse DNS set'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Clock size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Timezone</p>
                  <p className="font-medium">{data.timezone} (UTC {data.utc_offset})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Database size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Postal & Coordinates</p>
                  <p className="font-medium">{data.postal || 'N/A'} • {data.latitude}, {data.longitude}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg"><Code size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Developer Shortcuts</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setShowRaw(!showRaw)} className="text-xs text-blue-500 hover:underline">View Raw JSON</button>
                    <span className="text-slate-400">|</span>
                    <a href={`https://who.is/whois-ip/ip-address/${data.ip}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">WHOIS <ExternalLink size={10} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className={`p-6 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 text-white rounded-lg"><Bot size={20} /></div>
            <h3 className="font-bold">AI Intelligence Analysis</h3>
          </div>
          {aiInsights ? (
             <div className="prose prose-sm dark:prose-invert max-w-none">
               <p className="text-slate-400 leading-relaxed whitespace-pre-line">{aiInsights}</p>
             </div>
          ) : (
            <div className="flex items-center gap-3 py-4 text-slate-400 italic">
              <div className="w-4 h-4 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Gemini is analyzing threat patterns for this IP...</span>
            </div>
          )}
        </div>

        {/* Raw JSON Display */}
        {showRaw && (
          <div className={`p-6 rounded-2xl font-mono text-sm overflow-x-auto ${darkMode ? 'bg-black border border-slate-800' : 'bg-slate-100 border border-slate-200'}`}>
            <div className="flex justify-between mb-4">
              <span className="text-slate-500">Raw API Response</span>
              <button onClick={() => setShowRaw(false)} className="text-red-500 hover:underline">Close</button>
            </div>
            <pre className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
              {JSON.stringify({ data, security, device }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Right Column: Risk & Maps */}
      <div className="space-y-6">
        {/* Risk Gauge */}
        <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              Security Risk Profile
            </h3>
            <span className="text-2xl font-black font-mono">{security.risk_score}</span>
          </div>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
              <p className="text-xs uppercase font-bold text-slate-500">Security Score</p>
              <p className={`text-xl font-bold ${security.risk_score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                {100 - security.risk_score}% Secure
              </p>
            </div>
          </div>

          {/* New Enhanced Progress Bar */}
          <div className="mt-4 mb-6 px-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Aggregated Threat Vector</span>
              <span className={`text-xs font-bold font-mono ${security.risk_score > 50 ? 'text-red-500' : 'text-blue-500'}`}>
                {security.risk_score}/100
              </span>
            </div>
            <div className={`h-2.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div 
                className={`h-full transition-all duration-[1500ms] ease-out rounded-full ${getRiskColorClass()} ${getRiskShadowClass()}`}
                style={{ width: `${security.risk_score}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-[8px] uppercase font-medium text-slate-600">
              <span>Stable</span>
              <span>Insecure</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm p-2 rounded bg-slate-500/5">
              <span className="text-slate-400">Proxy/VPN</span>
              <span className={`font-bold ${security.is_proxy || security.is_vpn ? 'text-red-500' : 'text-green-500'}`}>
                {security.is_proxy || security.is_vpn ? 'Detected' : 'Clean'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 rounded bg-slate-500/5">
              <span className="text-slate-400">Tor Exit Node</span>
              <span className={`font-bold ${security.is_tor ? 'text-red-500' : 'text-green-500'}`}>
                {security.is_tor ? 'Detected' : 'Clean'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 rounded bg-slate-500/5">
              <span className="text-slate-400">Datacenter/Hosting</span>
              <span className={`font-bold ${security.is_hosting ? 'text-orange-500' : 'text-green-500'}`}>
                {security.is_hosting ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 rounded bg-slate-500/5">
              <span className="text-slate-400">Blacklist Status</span>
              <span className={`font-bold ${security.blacklisted ? 'text-red-500' : 'text-green-500'}`}>
                {security.blacklisted ? 'Flagged' : 'Passed'}
              </span>
            </div>
          </div>
        </div>

        {/* Browser & OS Info */}
        <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Monitor size={18} className="text-blue-500" />
            Visitor Device Info
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Browser</span>
              <span className="font-medium">{device.browser}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Operating System</span>
              <span className="font-medium">{device.os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Resolution</span>
              <span className="font-medium">{device.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Device Type</span>
              <span className="font-medium">{device.deviceType}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-1">User Agent</p>
              <p className="text-[10px] leading-tight text-slate-400 font-mono break-all">{device.userAgent}</p>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="rounded-2xl overflow-hidden shadow-xl h-64 border border-slate-800 relative group">
          <iframe
            title="Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/view?key=NOT_REQUIRED_FOR_EMBED_ONLY&center=${data.latitude},${data.longitude}&zoom=8&maptype=roadmap`}
            allowFullScreen
          ></iframe>
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none group-hover:bg-transparent transition-all"></div>
          <div className="absolute bottom-4 left-4 right-4 glass p-2 rounded-lg text-xs flex items-center gap-2 shadow-lg">
             <MapPin size={12} className="text-red-500" />
             <span className="truncate">{data.city}, {data.country_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
