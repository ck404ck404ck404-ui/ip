
import React, { useState, useEffect, useCallback } from 'react';
import { fetchIPDetails, analyzeSecurity, getDeviceInfo } from './services/ipService';
import { getAIInsights } from './services/geminiService';
import { IPData, SecurityRisk, DeviceInfo, LookupHistory, Language } from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import HistoryLog from './components/HistoryLog';
import { 
  Shield, 
  Globe, 
  History, 
  Moon, 
  Sun, 
  Search, 
  RefreshCcw,
  Zap,
  Languages
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
        location: `${data.city}, ${data.country_name}`,
        risk: risk.threat_level
      };

      setHistory(prev => {
        const filtered = prev.filter(h => h.ip !== data.ip);
        const updated = [newEntry, ...filtered].slice(0, 50);
        localStorage.setItem('ip_history', JSON.stringify(updated));
        return updated;
      });

      // AI Insights - respects current language
      getAIInsights(data, risk, lang).then(setAiInsights);

    } catch (err) {
      setError(lang === 'bn' ? 'আইপি তথ্য উদ্ধার করা সম্ভব হয়নি।' : 'Could not retrieve IP intelligence.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ip_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setDarkMode(false);

    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) setLang(savedLang);
    
    loadData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadData(searchQuery.trim());
      setActiveTab('dashboard');
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'bn' : 'en';
    setLang(nextLang);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <nav className={`sticky top-0 z-50 glass border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Shield size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Guardia<span className="text-blue-500">IP</span></h1>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-lg w-full relative">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-full border outline-none transition-all ${
                darkMode ? 'bg-slate-900 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-300 focus:border-blue-500 shadow-sm'
              }`}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </form>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Zap size={18} />
              <span className="hidden lg:inline">{t.dashboard}</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <History size={18} />
              <span className="hidden lg:inline">{t.history}</span>
            </button>
            <div className={`w-[1px] h-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} mx-1`}></div>
            
            <button 
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
              title="Change Language"
            >
              <Languages size={20} />
              <span className="text-xs font-bold">{lang === 'en' ? 'BN' : 'EN'}</span>
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => loadData()}
              className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors`}
              title={t.refresh}
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500">
            <Shield size={20} />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-lg font-medium">{lang === 'bn' ? 'তথ্য অনুসন্ধান করা হচ্ছে...' : 'Extracting Intelligence...'}</p>
              <p className="text-sm text-slate-500">{lang === 'bn' ? 'গ্লোবাল আইপি ডাটাবেস বিশ্লেষণ করা হচ্ছে' : 'Analyzing global IP databases & threat signatures'}</p>
            </div>
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

      <footer className={`mt-12 py-8 border-t ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>{lang === 'bn' ? 'Gemini AI দ্বারা চালিত' : 'Powered by Global IP Intelligence Networks & Gemini AI'}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
          </div>
          <p>© {new Date().getFullYear()} Guardia IP System</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
