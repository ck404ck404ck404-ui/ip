import React, { useState, useEffect, useCallback } from 'react';
import { fetchIPDetails, analyzeSecurity, getDeviceInfo } from './services/ipService';
import { getAIInsights } from './services/geminiService';
import { IPData, SecurityRisk, DeviceInfo, LookupHistory, Language } from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import HistoryLog from './components/HistoryLog';
import { 
  Shield, 
  History, 
  Search, 
  RefreshCcw,
  Zap,
  Languages,
  AlertCircle,
  Cpu
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [security, setSecurity] = useState<SecurityRisk | null>(null);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [history, setHistory] = useState<LookupHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  const t = translations[lang];

  const loadData = useCallback(async (targetIp?: string) => {
    setLoading(true);
    setError(null);
    setAiInsights('');
    try {
      const data = await fetchIPDetails(targetIp);
      const risk = await analyzeSecurity(data);
      const dev = getDeviceInfo();
      
      setIpData(data);
      setSecurity(risk);
      setDevice(dev);
      
      const newEntry: LookupHistory = {
        id: Date.now().toString(),
        ip: data.ip,
        timestamp: new Date().toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US'),
        location: `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`,
        risk: risk.threat_level
      };

      setHistory(prev => {
        const filtered = prev.filter(h => h.ip !== data.ip);
        const updated = [newEntry, ...filtered].slice(0, 50);
        localStorage.setItem('ip_history', JSON.stringify(updated));
        return updated;
      });

      if (process.env.API_KEY && process.env.API_KEY !== 'undefined') {
        getAIInsights(data, risk, lang).then(setAiInsights).catch(err => {
          console.warn("AI Insights failed:", err);
          setAiInsights(lang === 'bn' ? 'AI বিশ্লেষণ বর্তমানে অনুপলব্ধ।' : 'AI Analysis is currently unavailable.');
        });
      }

    } catch (err: any) {
      setError(err.message || (lang === 'bn' ? 'আইপি তথ্য উদ্ধার করা সম্ভব হয়নি।' : 'Could not retrieve IP intelligence.'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ip_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadData(searchQuery.trim());
      setActiveTab('dashboard');
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'bn' : 'en');
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-blue-500/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="sticky top-0 z-50 px-6 py-4 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Shield size={22} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tighter">GUARDIA<span className="text-blue-500">IP</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Security Intelligence</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl group relative">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-sm placeholder:text-slate-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          </form>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                <Zap size={16} /> {t.dashboard}
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                <History size={16} /> {t.history}
              </button>
            </nav>

            <button 
              onClick={toggleLanguage}
              className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-black text-xs"
            >
              {lang.toUpperCase()}
            </button>

            <button 
              onClick={() => loadData()}
              className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10 relative z-10">
        {error && (
          <div className="mb-10 p-5 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center gap-4 text-red-500">
            <AlertCircle size={24} />
            <p className="font-bold">{error}</p>
            <button onClick={() => loadData()} className="ml-auto px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="relative mb-10">
              <div className="w-24 h-24 border-[6px] border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
              <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-2">SCANNING NETWORKS</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Synchronizing with global security clusters...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && ipData && security && device && (
              <Dashboard 
                data={ipData} 
                security={security} 
                device={device} 
                aiInsights={aiInsights}
                darkMode={darkMode}
                lang={lang}
              />
            )}
            {activeTab === 'history' && (
              <HistoryLog 
                history={history} 
                darkMode={darkMode} 
                lang={lang}
                onSelect={(ip) => {
                  setSearchQuery(ip);
                  loadData(ip);
                  setActiveTab('dashboard');
                }}
                onClear={() => {
                  setHistory([]);
                  localStorage.removeItem('ip_history');
                }}
              />
            )}
          </>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Shield size={24} className="text-blue-600" />
            <div>
              <p className="font-black tracking-tighter text-sm uppercase">Guardia Intelligence System</p>
              <p className="text-[10px] font-bold text-slate-500 tracking-widest">ENCRYPTED DATA FLOW • V2.5.0</p>
            </div>
          </div>
          <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-blue-500 transition-colors">API Docs</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Security Audit</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Nodes</a>
          </div>
          <p className="text-[10px] font-mono text-slate-600">© {new Date().getFullYear()} GLOBAL CYBER DEFENSE NETWORK</p>
        </div>
      </footer>
    </div>
  );
};

export default App;