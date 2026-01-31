
import React, { useState } from 'react';
import { LookupHistory, Language } from '../types';
import { translations } from '../translations';
import { 
  Trash2, 
  Download, 
  Search,
  ChevronRight,
  Filter
} from 'lucide-react';

interface HistoryLogProps {
  history: LookupHistory[];
  darkMode: boolean;
  lang: Language;
  onSelect: (ip: string) => void;
  onClear: () => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, darkMode, lang, onSelect, onClear }) => {
  const [filter, setFilter] = useState('');
  const t = translations[lang];

  const filteredHistory = history.filter(h => 
    h.ip.includes(filter) || h.location.toLowerCase().includes(filter.toLowerCase())
  );

  const exportCSV = () => {
    const headers = "ID,IP Address,Timestamp,Location,Risk\n";
    const csv = history.map(h => `${h.id},${h.ip},"${h.timestamp}","${h.location}",${h.risk}`).join("\n");
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'guardia_ip_history.csv');
    a.click();
  };

  return (
    <div className={`rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'} animate-in fade-in slide-in-from-bottom-4`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t.investigationLogs}</h2>
          <p className="text-slate-500 text-sm">{t.logsSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={exportCSV}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            <Download size={16} /> {t.exportCsv}
          </button>
          <button 
            onClick={onClear}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={16} /> {t.clearAll}
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder={t.filterLogs}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all ${
            darkMode ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
          }`}
        />
        <Filter className="absolute left-3 top-2.5 text-slate-500" size={18} />
      </div>

      <div className="overflow-x-auto">
        {filteredHistory.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={`text-xs uppercase font-bold text-slate-500 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <th className="pb-4 pr-4">IP</th>
                <th className="pb-4 pr-4">Time</th>
                <th className="pb-4 pr-4">Location</th>
                <th className="pb-4 pr-4">Risk</th>
                <th className="pb-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-500/5 transition-colors">
                  <td className="py-4 pr-4 font-mono font-medium text-blue-500">{item.ip}</td>
                  <td className="py-4 pr-4 text-sm text-slate-500">{item.timestamp}</td>
                  <td className="py-4 pr-4 text-sm font-medium">{item.location}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.risk === 'Low' ? 'bg-green-500/20 text-green-500' :
                      item.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => onSelect(item.ip)}
                      className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${darkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg">{t.noLogs}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryLog;
