import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  Scale, 
  Truck, 
  ShieldCheck, 
  Search, 
  MapPin, 
  IndianRupee,
  FileCheck2,
  ExternalLink,
  Filter
} from 'lucide-react';

export default function RecyclerDashboard({
  transactions,
  recyclers,
  onConfirmHandover,
  onOpenEprCert
}) {
  const [selectedLot, setSelectedLot] = useState(null);
  const [verifiedWeight, setVerifiedWeight] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [recyclerNotes, setRecyclerNotes] = useState('Material inspected. Calibrated digital scale weight confirmed.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const pendingLots = transactions.filter(t => t.status !== 'Completed');
  const completedLots = transactions.filter(t => t.status === 'Completed');

  const displayedLots = transactions.filter(t => {
    if (filterStatus === 'pending') return t.status !== 'Completed';
    if (filterStatus === 'completed') return t.status === 'Completed';
    return true;
  });

  const handleSelectToVerify = (lot) => {
    setSelectedLot(lot);
    setVerifiedWeight(lot.weightKg.toString());
    setPaymentMode(lot.paymentMethod || 'Cash');
    setPaymentStatus('Paid');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedLot) return;
    setIsProcessing(true);

    try {
      await onConfirmHandover(selectedLot.id, {
        verifiedWeightKg: parseFloat(verifiedWeight) || selectedLot.weightKg,
        paymentStatus,
        paymentMethod: paymentMode,
        recyclerNotes
      });
      setSelectedLot(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recycler Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-5 shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              CPCB / SPCB Authorized Inbound Hub
            </span>
            <span className="text-xs text-emerald-300">EcoGreen Solutions MIDC Facility</span>
          </div>
          <h2 className="text-xl font-black">Authorized Recycler & Aggregator Terminal</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Verify collector deliveries, confirm calibrated scale weights, and mint EPR compliance certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center">
            <span className="text-[10px] text-amber-400 font-bold block uppercase">Pending Acceptance</span>
            <span className="text-xl font-black text-white">{pendingLots.length}</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Recycled / Minted</span>
            <span className="text-xl font-black text-white">{completedLots.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Lots ({transactions.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Handover ({pendingLots.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            EPR Verified ({completedLots.length})
          </button>
        </div>
      </div>

      {/* Main Lot Grid / Verification Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lots Table */}
        <div className="lg:col-span-2 space-y-3">
          {displayedLots.map((lot) => {
            const isCompleted = lot.status === 'Completed';

            return (
              <div
                key={lot.id}
                className={`bg-white rounded-2xl p-4 border-2 transition shadow-sm flex flex-col sm:flex-row justify-between gap-4 ${
                  isCompleted ? 'border-slate-200' : 'border-amber-400 ring-2 ring-amber-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={lot.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60"}
                      alt={lot.materialName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {lot.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 animate-pulse'
                      }`}>
                        {lot.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{lot.materialName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Collector: <strong>{lot.collectorName}</strong></span>
                      <span>•</span>
                      <span>{lot.weightKg} {lot.unit}</span>
                      <span>•</span>
                      <span>₹{lot.totalValue?.toLocaleString('en-IN')}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{lot.collectionLocation} ({lot.gpsCoordinates})</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {isCompleted ? (
                    <button
                      onClick={() => onOpenEprCert(lot)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>View EPR Cert</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectToVerify(lot)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Weigh & Confirm</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Verification & Weighing Console */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm h-fit space-y-4 sticky top-24">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Weighing & Handover Console</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Scan collector QR or pick an active lot to verify
            </p>
          </div>

          {selectedLot ? (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Selected Lot</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{selectedLot.materialName}</h4>
                <p className="text-slate-600 font-mono text-[11px]">{selectedLot.id} • {selectedLot.collectorName}</p>
              </div>

              {/* Verified Weight Input */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Calibrated Digital Scale Weight ({selectedLot.unit}):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={verifiedWeight}
                    onChange={(e) => setVerifiedWeight(e.target.value)}
                    className="w-full text-lg font-black py-2 px-3 border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50"
                  />
                  <span className="font-bold text-slate-500">{selectedLot.unit}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Original collector estimate: {selectedLot.weightKg} {selectedLot.unit}
                </span>
              </div>

              {/* Payment Settlement Mode */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Settlement:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Cash')}
                    className={`py-2 px-2.5 rounded-lg font-bold transition border ${
                      paymentMode === 'Cash'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    💵 Cash Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('UPI / Digital')}
                    className={`py-2 px-2.5 rounded-lg font-bold transition border ${
                      paymentMode !== 'Cash'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📱 UPI Settled
                  </button>
                </div>
              </div>

              {/* Recycler Audit Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">EPR Quality / Inspection Note:</label>
                <textarea
                  rows="2"
                  value={recyclerNotes}
                  onChange={(e) => setRecyclerNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Confirm Handover Button */}
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-3 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Handover & Issue EPR Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLot(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Scale className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Click <strong>Weigh & Confirm</strong> on any pending lot to inspect, calibrate, and generate the verifiable EPR Chain of Custody.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
