import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LotCreation from './components/CollectorView/LotCreation';
import HandoverPass from './components/CollectorView/HandoverPass';
import PriceBoard from './components/CollectorView/PriceBoard';
import EarningsLedger from './components/CollectorView/EarningsLedger';
import SafetyGuide from './components/CollectorView/SafetyGuide';
import RecyclerDashboard from './components/RecyclerView/RecyclerDashboard';
import EPRCertificateModal from './components/RecyclerView/EPRCertificateModal';
import UnitEconomics from './components/Economics/UnitEconomics';
import DatasetViewer from './components/Datasets/DatasetViewer';
import { translations } from './utils/translations';
import { 
  getOfflineLots, 
  saveOfflineLot, 
  syncOfflineQueue 
} from './utils/offlineStorage';
import { 
  PlusCircle, 
  Tag, 
  Wallet, 
  ShieldAlert, 
  CheckCircle2, 
  WifiOff, 
  RefreshCw 
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [role, setRole] = useState('collector'); // 'collector', 'recycler', 'economics', 'datasets'
  const [collectorTab, setCollectorTab] = useState('createLot'); // 'createLot', 'priceBoard', 'ledger', 'safety'

  // Connectivity & offline sync simulation
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Core backend data
  const [materials, setMaterials] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [prices, setPrices] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Modals & active passes
  const [activePassLot, setActivePassLot] = useState(null);
  const [activeEprCertLot, setActiveEprCertLot] = useState(null);

  const t = translations[lang] || translations.en;

  // Load initial data
  const fetchData = async () => {
    try {
      const [matRes, recRes, priceRes, safeRes, txRes] = await Promise.all([
        fetch('/api/materials').then(r => r.json()),
        fetch('/api/recyclers').then(r => r.json()),
        fetch('/api/prices').then(r => r.json()),
        fetch('/api/safety').then(r => r.json()),
        fetch('/api/transactions').then(r => r.json())
      ]);

      if (matRes.data) setMaterials(matRes.data);
      if (recRes.data) setRecyclers(recRes.data);
      if (priceRes.data) setPrices(priceRes.data);
      if (safeRes.data) setSafetyData(safeRes.data);
      if (txRes.data) setTransactions(txRes.data);
    } catch (err) {
      console.warn('Using offline data fallback:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const queued = getOfflineLots();
    setPendingSyncCount(queued.length);
  }, []);

  // Show temporary toast notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Sync offline queue to backend
  const handleTriggerSync = async () => {
    if (!isOnline) {
      showToast('Cannot sync in offline mode. Please toggle back to online.', 'warning');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await syncOfflineQueue();
      if (res.success) {
        setPendingSyncCount(0);
        showToast(`Successfully synchronized ${res.count} lots with CPCB network!`, 'success');
        fetchData();
      } else {
        showToast('Sync failed: ' + res.error, 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Trigger sync automatically when going back online
  useEffect(() => {
    if (isOnline && pendingSyncCount > 0) {
      handleTriggerSync();
    }
  }, [isOnline]);

  // Create Lot Handler (works both online and offline)
  const handleCreateLot = async (payload) => {
    if (!isOnline) {
      // Offline mode: generate temporary offline lot
      const offlineId = `OFFLINE-LOT-${Date.now().toString().slice(-4)}`;
      const mat = materials.find(m => m.id === payload.materialId) || materials[0];
      const rec = recyclers.find(r => r.id === payload.recyclerId) || recyclers[0];
      const formalRate = Math.round(mat.formalPrice * (rec.rateMultiplier || 1.05));
      const totalVal = Math.round(formalRate * payload.weightKg);

      const offlineLot = {
        ...payload,
        id: offlineId,
        materialName: mat.name,
        category: mat.category,
        unit: mat.unit,
        quotedRate: mat.formalPrice,
        finalRate: formalRate,
        totalValue: totalVal,
        extraProfitEarned: Math.round(totalVal * 0.35),
        status: 'Saved Offline (Will sync)',
        paymentMethod: payload.paymentPreference || 'Cash',
        paymentStatus: 'Pending At Handover',
        recyclerName: rec.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        handoverHash: `OFFLINE-SHA256-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
        isOfflineQueued: true
      };

      const updatedQueue = saveOfflineLot(offlineLot);
      setPendingSyncCount(updatedQueue.length);
      setTransactions([offlineLot, ...transactions]);
      showToast('⚡ Lot saved offline in local queue. Ready for handover!', 'info');
      return offlineLot;
    }

    // Online mode: POST to backend
    try {
      const res = await fetch('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setTransactions([data.lot, ...transactions]);
        showToast('✓ Digital Lot registered with verified CPCB Recycler!', 'success');
        return data.lot;
      } else {
        showToast('Error: ' + data.error, 'error');
      }
    } catch (err) {
      showToast('Network error while saving lot: ' + err.message, 'error');
    }
    return null;
  };

  // Recycler confirms lot handover & calibrated weight
  const handleConfirmHandover = async (lotId, handoverData) => {
    try {
      const res = await fetch(`/api/lots/${lotId}/handover`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(handoverData)
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(transactions.map(t => t.id === lotId ? data.lot : t));
        showToast(`✓ Lot ${lotId} verified! EPR Custody Certificate issued.`, 'success');
        setActiveEprCertLot(data.lot);
      }
    } catch (err) {
      showToast('Error confirming handover: ' + err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={(r) => {
          setRole(r);
          setActivePassLot(null);
        }}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        pendingSyncCount={pendingSyncCount}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white border ${
            notification.type === 'success' ? 'bg-emerald-700 border-emerald-500' :
            notification.type === 'info' ? 'bg-blue-700 border-blue-500' :
            notification.type === 'warning' ? 'bg-amber-600 border-amber-400' : 'bg-red-700 border-red-500'
          }`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* COLLECTOR ROLE VIEW */}
        {role === 'collector' && (
          <div className="space-y-6">
            {/* Collector Sub-Navigation Tabs */}
            <div className="grid grid-cols-4 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => {
                  setCollectorTab('createLot');
                  setActivePassLot(null);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                  collectorTab === 'createLot' && !activePassLot
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.tabs.createLot}</span>
              </button>

              <button
                onClick={() => {
                  setCollectorTab('priceBoard');
                  setActivePassLot(null);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                  collectorTab === 'priceBoard'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>{t.tabs.priceBoard}</span>
              </button>

              <button
                onClick={() => {
                  setCollectorTab('ledger');
                  setActivePassLot(null);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                  collectorTab === 'ledger'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>{t.tabs.ledger}</span>
              </button>

              <button
                onClick={() => {
                  setCollectorTab('safety');
                  setActivePassLot(null);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                  collectorTab === 'safety'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>{t.tabs.safety}</span>
              </button>
            </div>

            {/* If Active QR Pass is open */}
            {activePassLot ? (
              <HandoverPass
                lot={activePassLot}
                lang={lang}
                onBack={() => setActivePassLot(null)}
                onOpenEprCert={(lot) => setActiveEprCertLot(lot)}
              />
            ) : collectorTab === 'createLot' ? (
              <LotCreation
                materials={materials}
                recyclers={recyclers}
                lang={lang}
                isOnline={isOnline}
                onCreateLot={handleCreateLot}
                onViewLotDetails={(lot) => setActivePassLot(lot)}
              />
            ) : collectorTab === 'priceBoard' ? (
              <PriceBoard prices={prices} lang={lang} />
            ) : collectorTab === 'ledger' ? (
              <EarningsLedger
                transactions={transactions}
                lang={lang}
                onSelectLot={(lot) => setActivePassLot(lot)}
                onOpenEprCert={(lot) => setActiveEprCertLot(lot)}
              />
            ) : (
              <SafetyGuide safetyData={safetyData} lang={lang} />
            )}
          </div>
        )}

        {/* RECYCLER ROLE VIEW */}
        {role === 'recycler' && (
          <RecyclerDashboard
            transactions={transactions}
            recyclers={recyclers}
            onConfirmHandover={handleConfirmHandover}
            onOpenEprCert={(lot) => setActiveEprCertLot(lot)}
          />
        )}

        {/* UNIT ECONOMICS VIEW */}
        {role === 'economics' && <UnitEconomics />}

        {/* SIH STRUCTURED DATASETS VIEW */}
        {role === 'datasets' && <DatasetViewer />}
      </main>

      {/* EPR Certificate Modal */}
      {activeEprCertLot && (
        <EPRCertificateModal
          lot={activeEprCertLot}
          onClose={() => setActiveEprCertLot(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-4 mt-12 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-slate-300">
            {t.slogan}
          </p>
          <p className="text-[11px] text-slate-500">
            Smart India Hackathon (SIH 2026) Prototype • Ministry of Mines (MoM) & JNARDDC • E-Waste (Management) Rules 2022
          </p>
        </div>
      </footer>
    </div>
  );
}
