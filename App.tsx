
import React, { useState, useEffect, useCallback } from 'react';
import { fetchIPDetails, analyzeSecurity, getDeviceInfo } from './services/ipService';
import { getAIInsights } from './services/geminiService';
import { IPData, SecurityRisk, DeviceInfo, LookupHistory } from './types';
import Dashboard from './components/Dashboard';
import HistoryLog from './components/HistoryLog';
import { 
  Shield, 
  Globe, 
  History, 
  Cpu, 
  Moon, 
  Sun, 
  Search, 
  RefreshCcw,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [security, setSecurity] = useState<SecurityRisk | null>(null);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [history, setHistory] = useState<LookupHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  const loadData = useCallback(async (targetIp?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIPDetails(targetIp);
      const risk = await analyzeSecurity(data);
      const dev = getDeviceInfo();
      
      setIpData(data);
      setSecurity(risk);
      setDevice(dev);
      
      // Save to history
      const newEntry: LookupHistory = {
        id: Date.now().toString(),
        ip: data.ip,
        timestamp: new Date().toLocaleString(),
        location: `${data.city}, ${data.country_name}`,
        risk: risk.threat_level
      };
      setHistory(prev => {
        const filtered = prev.filter(h => h.ip !== data.ip);
        const updated = [newEntry, ...filtered].slice(0, 50);
        localStorage.setItem('ip_history', JSON.stringify(updated));
        return updated;
      });

      // AI Insights - non blocking
      getAIInsights(data, risk).then(setAiInsights);

    } catch (err) {
      setError('Could not retrieve IP intelligence. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ip_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setDarkMode(false);
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadData(searchQuery.trim());
      setActiveTab('dashboard');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Navbar */}
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
              placeholder="Enter IPv4 or IPv6 address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-full border outline-none transition-all ${
                darkMode ? 'bg-slate-900 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-300 focus:border-blue-500 shadow-sm'
              }`}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <button type="submit" className="hidden">Search</button>
          </form>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Zap size={18} />
              <span className="hidden sm:inline">Live Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <History size={18} />
              <span className="hidden sm:inline">History</span>
            </button>
            <div className={`w-[1px] h-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} mx-2`}></div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-200 text-slate-700'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => loadData()}
              className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors`}
              title="Refresh IP"
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
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Extracting Intelligence...</p>
              <p className="text-sm text-slate-500">Analyzing global IP databases & threat signatures</p>
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
              />
            )}
            {activeTab === 'history' && (
              <HistoryLog 
                history={history} 
                darkMode={darkMode} 
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
            <span>Powered by Global IP Intelligence Networks & Gemini AI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500 transition-colors">API Documentation</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          </div>
          <p>© {new Date().getFullYear()} Guardia IP Intelligence System</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
