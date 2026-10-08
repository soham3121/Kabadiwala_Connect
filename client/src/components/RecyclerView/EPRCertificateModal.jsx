import React from 'react';
import { 
  ShieldCheck, 
  X, 
  Printer, 
  CheckCircle2, 
  Building2, 
  User, 
  Scale, 
  QrCode, 
  MapPin, 
  Calendar,
  IndianRupee,
  Leaf
} from 'lucide-react';

export default function EPRCertificateModal({ lot, onClose }) {
  if (!lot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-emerald-600 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Watermark Header */}
        <div className="bg-emerald-800 text-white p-6 text-center relative border-b-2 border-amber-400">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-200">
              Government of India • Ministry of Mines (MoM) & JNARDDC
            </span>
          </div>
          <h2 className="text-xl font-black tracking-wide text-white uppercase mt-1">
            E-Waste Digital Certificate of Custody
          </h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Form 6 Transfer Receipt under Rule 14, E-Waste (Management) Rules, 2022
          </p>

          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-mono text-emerald-300">
            <span>CERT ID: {lot.eprCertificateId || `EPR-CERT-2026-${lot.id.split('-')[2] || '901'}`}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-6 text-xs text-slate-800 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Official Verification Stamp */}
          <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-900 text-sm">CPCB Formal Recycling Verified</h4>
                <p className="text-[11px] text-emerald-700">
                  This electronic scrap lot was officially routed into authorized secondary mineral recovery.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Cryptographic Hash</span>
              <span className="font-mono text-[11px] font-black text-slate-700">{lot.handoverHash}</span>
            </div>
          </div>

          {/* Grid of Parties & Material */}
          <div className="grid grid-cols-2 gap-4">
            {/* Origin Informal Collector */}
            <div className="border border-slate-200 bg-white/90 p-4 rounded-xl space-y-1.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <User className="w-3 h-3" /> Origin Collector
              </span>
              <h5 className="font-extrabold text-sm text-slate-900">{lot.collectorName}</h5>
              <p className="text-slate-600 font-mono text-[11px]">ID: {lot.collectorId}</p>
              <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{lot.collectionLocation}</span>
              </p>
            </div>

            {/* Destination Authorized Recycler */}
            <div className="border border-slate-200 bg-white/90 p-4 rounded-xl space-y-1.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Authorized Recycler
              </span>
              <h5 className="font-extrabold text-sm text-slate-900">{lot.recyclerName}</h5>
              <p className="text-emerald-700 font-semibold text-[11px]">CPCB/EPR/2023/REC-0982</p>
              <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Facility Verified</span>
              </p>
            </div>
          </div>

          {/* Material & Financial Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-2.5">E-Waste Category</th>
                  <th className="p-2.5">Certified Weight</th>
                  <th className="p-2.5">Rate Applied</th>
                  <th className="p-2.5">Total Paid</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">{lot.materialName}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-900">{lot.weightKg} {lot.unit}</td>
                  <td className="p-2.5">₹{lot.finalRate}/{lot.unit}</td>
                  <td className="p-2.5 font-black text-emerald-700 text-sm">₹{lot.totalValue?.toLocaleString('en-IN')}</td>
                  <td className="p-2.5">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {lot.paymentStatus || 'Paid'} ({lot.paymentMethod})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Audit Trail Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Chain of Custody Timestamp</span>
              <p className="font-mono text-slate-700 text-[11px] mt-0.5">{lot.timestamp}</p>
              <p className="text-[10px] text-slate-500 mt-1">Geo Tag: {lot.gpsCoordinates}</p>
            </div>
            <div className="text-right">
              <div className="inline-block border-2 border-emerald-600 rounded-lg p-2 text-center text-emerald-800">
                <span className="text-[9px] font-black uppercase tracking-wider block">KABADIWALA CONNECT</span>
                <span className="text-[11px] font-extrabold text-emerald-950">DIGITALLY SIGNED</span>
                <span className="text-[9px] block text-emerald-700 font-mono">EPR-VERIFIED-2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 flex justify-between items-center border-t border-slate-200">
          <span className="text-[11px] text-slate-500">
            Complies with Extended Producer Responsibility (EPR) reporting guidelines.
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
