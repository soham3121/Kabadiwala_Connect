import React from 'react';
import { translations } from '../../utils/translations';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  QrCode,
  FileCheck,
  Building2,
  Calendar
} from 'lucide-react';

export default function EarningsLedger({
  transactions,
  lang,
  onSelectLot,
  onOpenEprCert
}) {
  const t = translations[lang] || translations.en;

  const totalEarned = transactions
    .filter(t => t.paymentStatus === 'Paid')
    .reduce((sum, t) => sum + (t.totalValue || 0), 0);

  const pendingDues = transactions
    .filter(t => t.paymentStatus !== 'Paid')
    .reduce((sum, t) => sum + (t.totalValue || 0), 0);

  const totalExtraFormalProfit = transactions
    .reduce((sum, t) => sum + (t.extraProfitEarned || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">{t.ledger.totalEarned}</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{totalEarned.toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold">✓ Direct In-Hand / Bank</span>
          </div>
        </div>

        {/* Extra Profit Over Middlemen */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-amber-800 font-bold uppercase">{t.ledger.extraProfit}</span>
            <h3 className="text-2xl font-black text-amber-950 mt-0.5">
              +₹{totalExtraFormalProfit.toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-amber-800 font-bold">★ Higher Than Middlemen</span>
          </div>
        </div>

        {/* Pending Handover Dues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">{t.ledger.pendingDues}</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{pendingDues.toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-blue-600 font-medium">To be paid at handover</span>
          </div>
        </div>
      </div>

      {/* Transactions History List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            <span>{t.ledger.transactionsList}</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {transactions.length} Lots
            </span>
          </h3>
          <span className="text-xs text-slate-400">Tap lot to view QR Pass</span>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => {
            const isCompleted = tx.status === 'Completed';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectLot(tx)}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 transition cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{tx.materialName}</h4>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{tx.id}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{tx.weightKg} {tx.unit}</span>
                      <span>•</span>
                      <span>{tx.recyclerName}</span>
                      <span>•</span>
                      <span className="text-slate-400">{tx.timestamp}</span>
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.paymentMethod}: {tx.paymentStatus}
                      </span>

                      {tx.extraProfitEarned > 0 && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          +₹{tx.extraProfitEarned} bonus
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-black text-slate-900">
                      ₹{tx.totalValue?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      ₹{tx.finalRate}/{tx.unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEprCert(tx);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>EPR Cert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
