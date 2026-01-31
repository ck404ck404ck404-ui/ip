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
      
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
          
          <div className="w-full md:w-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                <Shield size={18} className="text-white md:w-5 md:h-5" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-black tracking-tighter uppercase">GUARDIA<span className="text-blue-500">IP</span></h1>
                <p className="hidden md:block text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Security Systems</p>
              </div>
            </div>
            
            <div className="flex md:hidden items-center gap-2">
                <button onClick={toggleLanguage} className="p-2 bg-white/5 rounded-lg text-[10px] font-black">{lang.toUpperCase()}</button>
                <button onClick={() => loadData()} className="p-2 bg-white/5 rounded-lg"><RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /></button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="w-full md:flex-1 relative group">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 border border-white/10 focus:border-blue-500 rounded-xl md:rounded-2xl outline-none transition-all text-sm font-medium"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
          </form>

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all font-bold text-xs ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-white'}`}
              >
                <Zap size={14} /> {t.dashboard}
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all font-bold text-xs ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-white'}`}
              >
                <History size={14} /> {t.history}
              </button>
            </nav>
            <button onClick={toggleLanguage} className="p-2.5 bg-white/5 rounded-xl text-xs font-black text-slate-400 hover:text-white transition-all">{lang.toUpperCase()}</button>
            <button onClick={() => loadData()} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /></button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 px-4 py-3 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-500'}`}
        >
          <Zap size={20} />
          <span className="text-[10px] font-bold uppercase">{t.dashboard}</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-blue-500' : 'text-slate-500'}`}
        >
          <History size={20} />
          <span className="text-[10px] font-bold uppercase">{t.history}</span>
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-bold flex-1">{error}</p>
            <button onClick={() => loadData()} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 md:py-40 text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
              <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2 uppercase">Syncing Intelligence</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Connecting to secure nodes...</p>
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

      <footer className="hidden md:block mt-10 py-10 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-slate-500">
           <div className="flex items-center gap-3">
              <Shield size={20} className="text-blue-900" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Guardia Intel Platform v2.5</p>
           </div>
           <p className="text-[10px] font-mono">© {new Date().getFullYear()} CYBER DEFENSE NETWORK</p>
        </div>
      </footer>
    </div>
  );
};

export default App;