import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Search, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  Layers, 
  Tag, 
  Building2, 
  ArrowRightLeft, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export default function DatasetViewer() {
  const [datasets, setDatasets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materialDataset');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'json'

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/datasets');
      const data = await res.json();
      if (data.success) {
        setDatasets(data.datasets);
      }
    } catch (err) {
      console.error('Error loading datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDownload = (key, data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kabadiwala_${key}_sih2026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabsConfig = [
    { key: 'materialDataset', label: '1. Material Dataset', icon: Layers, desc: 'Category, sub-category, condition, hazardous elements, and recovery minerals' },
    { key: 'priceDataset', label: '2. Price Dataset', icon: Tag, desc: 'Category, location, prevailing buying price, historical trends, spoken scripts' },
    { key: 'recyclerDataset', label: '3. Recycler Dataset', icon: Building2, desc: 'Facility name, location, CPCB authorization status, offered rates, pickup fleet' },
    { key: 'transactionDataset', label: '4. Transaction Dataset', icon: ArrowRightLeft, desc: 'Lot ID, collector ID, material, weights, quotes, final value, payment status' },
    { key: 'traceabilityDataset', label: '5. Traceability Dataset', icon: ShieldCheck, desc: 'EPR custody hash, GPS tags, timestamps, chain-of-custody audit logs' },
    { key: 'collectorDataset', label: '6. Collector Dataset', icon: UserCheck, desc: 'Minimal collector profile, operating area, language, earnings ledger history' }
  ];

  const currentDataset = datasets ? datasets[activeTab] || [] : [];

  // Filter based on search query
  const filteredDataset = Array.isArray(currentDataset) 
    ? currentDataset.filter(item => JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="space-y-6">
      {/* SIH Datasets Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Ministry of Mines (MoM) & JNARDDC Specification</span>
          </div>
          <h2 className="text-2xl font-black">Structured Operational Datasets</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Live datasets created through platform transactions, material grading, calibrated weighing, and verified CPCB secondary recycling handovers.
          </p>
        </div>

        <button
          onClick={fetchDatasets}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Datasets</span>
        </button>
      </div>

      {/* Dataset Pipeline Flow Diagram */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          End-to-End Dataset Lifecycle & Processing Pipeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <span className="font-bold text-emerald-800 block">1. Field Generation</span>
            <p className="text-slate-600 mt-1">Photo capture, category selection, and geo-tagged collector submissions.</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
            <span className="font-bold text-blue-800 block">2. ML Cleaning & Validation</span>
            <p className="text-slate-600 mt-1">Anomaly detection flags price skew &gt;30% and bulk permits over 500kg.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <span className="font-bold text-amber-800 block">3. Handover Audit</span>
            <p className="text-slate-600 mt-1">Recycler confirms weight on calibrated scale, minting SHA-256 custody hash.</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
            <span className="font-bold text-purple-800 block">4. EPR Analytics & ML</span>
            <p className="text-slate-600 mt-1">Feeds live price trend models and CPCB secondary resource recovery reports.</p>
          </div>
        </div>
      </div>

      {/* Dataset Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isSelected = tab.key === activeTab;
          const count = datasets && datasets[tab.key] ? datasets[tab.key].length : 0;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count} rows
                </span>
              </div>
              <h4 className="font-extrabold text-xs line-clamp-1">{tab.label}</h4>
            </button>
          );
        })}
      </div>

      {/* Dataset Content View */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {tabsConfig.find(t => t.key === activeTab)?.label}
            </h3>
            <p className="text-xs text-slate-500">
              {tabsConfig.find(t => t.key === activeTab)?.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>

            {/* Toggle Table vs JSON */}
            <div className="flex border border-slate-200 rounded-lg p-0.5 text-xs font-bold">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md transition ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-2.5 py-1 rounded-md transition ${viewMode === 'json' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
              >
                JSON
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(activeTab, currentDataset)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border border-slate-200"
              title="Download structured JSON dataset"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-600 mb-2" />
            <span className="text-xs">Loading structured datasets...</span>
          </div>
        ) : viewMode === 'json' ? (
          <pre className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl max-h-96 overflow-auto border border-slate-800">
            {JSON.stringify(filteredDataset, null, 2)}
          </pre>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 sticky top-0 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  {filteredDataset.length > 0 &&
                    Object.keys(filteredDataset[0])
                      .slice(0, 7)
                      .map((col) => (
                        <th key={col} className="p-2.5 font-bold uppercase text-[11px]">
                          {col}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredDataset.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {Object.keys(filteredDataset[0])
                      .slice(0, 7)
                      .map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className="p-2.5 truncate max-w-[200px] text-slate-700">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
