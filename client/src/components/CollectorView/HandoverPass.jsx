import React from 'react';
import { translations } from '../../utils/translations';
import { 
  QrCode, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  FileText,
  Copy,
  Download
} from 'lucide-react';

export default function HandoverPass({
  lot,
  lang,
  onBack,
  onOpenEprCert
}) {
  const t = translations[lang] || translations.en;

  if (!lot) return null;

  // Generate a mock SVG QR Code representation
  const qrSvgMatrix = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,1,1,0,1,1]
  ];

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lots</span>
      </button>

      {/* Main Digital Pass Card */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-500 overflow-hidden">
        {/* Pass Header */}
        <div className="bg-emerald-700 text-white p-5 text-center relative">
          <div className="inline-flex items-center gap-1 bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ministry of Mines / CPCB Form 6 Pass</span>
          </div>
          <h2 className="text-xl font-black tracking-wide">
            {t.handover.title}
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            {t.handover.scanInstruction}
          </p>

          <div className="mt-3 inline-block bg-white text-emerald-900 font-mono text-xs font-black px-3 py-1 rounded-lg shadow-inner">
            {lot.id}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-6 flex flex-col items-center justify-center bg-emerald-50/40 border-b border-dashed border-emerald-300">
          <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-slate-800 flex flex-col items-center">
            {/* Render scannable QR Code */}
            <div className="grid grid-cols-17 gap-0.5 p-1 bg-white">
              {qrSvgMatrix.map((row, rIdx) => (
                <div key={rIdx} className="flex">
                  {row.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`w-3.5 h-3.5 ${cell === 1 ? 'bg-slate-900' : 'bg-white'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-2 font-semibold">
              HASH: {lot.handoverHash}
            </span>
          </div>

          <div className="mt-3 text-center">
            <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
              lot.status === 'Completed'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
            }`}>
              {lot.status === 'Completed' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.handover.completed}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.handover.pending}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Lot Specifications */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Material Category</span>
              <span className="font-extrabold text-slate-800 text-sm">{lot.materialName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Estimated Weight</span>
              <span className="font-extrabold text-slate-800 text-sm">{lot.weightKg} {lot.unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Formal Payable Amount</span>
              <span className="font-black text-emerald-700 text-base">₹{lot.totalValue?.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Payment Mode</span>
              <span className="font-bold text-slate-700">{lot.paymentMethod} ({lot.paymentStatus})</span>
            </div>
          </div>

          {/* Assigned Recycler */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Authorized Destination</span>
            <h4 className="font-bold text-slate-800 text-sm">{lot.recyclerName}</h4>
            <p className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{lot.collectionLocation} ({lot.gpsCoordinates})</span>
            </p>
            <p className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Registered at: {lot.timestamp}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onOpenEprCert(lot)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
            >
              <FileText className="w-4 h-4" />
              <span>{t.handover.viewCertificate}</span>
            </button>
            <button
              onClick={() => alert(`Copied Lot ID ${lot.id} and Handover Hash ${lot.handoverHash}`)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1"
              title="Copy Reference"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
