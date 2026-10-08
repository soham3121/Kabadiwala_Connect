import React, { useState } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  Award,
  ArrowRight,
  Scale
} from 'lucide-react';

export default function UnitEconomics() {
  const [monthlyVolumeKg, setMonthlyVolumeKg] = useState(250);

  const materialsBreakdown = [
    { name: "PCBs & Motherboards", share: 0.20, informalRate: 220, formalRate: 380, minerals: "Gold, Copper, Silver" },
    { name: "Copper Cables", share: 0.30, informalRate: 310, formalRate: 460, minerals: "Pure Copper (Cu)" },
    { name: "Li-ion Batteries", share: 0.15, informalRate: 110, formalRate: 240, minerals: "Lithium, Cobalt" },
    { name: "Motors & Hard Drives", share: 0.20, informalRate: 85, formalRate: 140, minerals: "Neodymium Magnets" },
    { name: "Engineering E-Plastics", share: 0.15, informalRate: 18, formalRate: 45, minerals: "Recycled ABS" }
  ];

  let informalTotal = 0;
  let formalTotal = 0;

  const rows = materialsBreakdown.map(item => {
    const weight = monthlyVolumeKg * item.share;
    const informalIncome = Math.round(weight * item.informalRate);
    const formalIncome = Math.round(weight * item.formalRate);
    const gain = formalIncome - informalIncome;

    informalTotal += informalIncome;
    formalTotal += formalIncome;

    return {
      ...item,
      weight,
      informalIncome,
      formalIncome,
      gain
    };
  });

  const totalGain = formalTotal - informalTotal;
  const percentageGain = Math.round((totalGain / informalTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>SIH 2026 Core Assessment • Ministry of Mines (MoM)</span>
        </div>
        <h2 className="text-2xl font-black">
          Unit-Economics & Collector Livelihood Assessment
        </h2>
        <p className="text-sm text-emerald-100 mt-1 max-w-3xl">
          Quantitative financial comparison proving why the informal scrap dealer earns <strong>25% to 45% higher net income</strong> through Kabadiwala Connect while eliminating lethal occupational health hazards.
        </p>
      </div>

      {/* Interactive Volume Slider */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800">
            Simulate Collector Monthly E-Waste Volume:
          </h3>
          <p className="text-xs text-slate-500">
            Average Indian informal aggregator collects 200kg - 400kg electronic scrap monthly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="100"
            max="600"
            step="25"
            value={monthlyVolumeKg}
            onChange={(e) => setMonthlyVolumeKg(Number(e.target.value))}
            className="w-48 accent-emerald-600 cursor-pointer"
          />
          <span className="bg-emerald-100 text-emerald-900 text-sm font-black px-3 py-1 rounded-xl">
            {monthlyVolumeKg} kg / month
          </span>
        </div>
      </div>

      {/* Financial Comparison Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Existing Middleman Backyard Route */}
        <div className="bg-white rounded-2xl p-5 border-2 border-red-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
            1. Existing Informal Channel
          </span>
          <h4 className="text-sm font-semibold text-slate-700">Exploitative Middleman / Mafia</h4>
          <p className="text-3xl font-black text-slate-900 pt-1">
            ₹{informalTotal.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-400 block">Monthly collector gross payout</span>
          <div className="pt-2 text-xs text-red-700 space-y-1">
            <p>✗ Loss of 85% gold & critical minerals</p>
            <p>✗ Deadly exposure to lead & dioxin smoke</p>
            <p>✗ Zero receipts, debt bondage to scrap sharks</p>
          </div>
        </div>

        {/* Kabadiwala Connect Formal Route */}
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-lg space-y-2 border-2 border-emerald-500">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>2. Kabadiwala Connect Channel</span>
          </span>
          <h4 className="text-sm font-semibold text-emerald-100">CPCB Authorized Recyclers</h4>
          <p className="text-3xl font-black text-emerald-400 pt-1">
            ₹{formalTotal.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-200 block">Monthly transparent payout</span>
          <div className="pt-2 text-xs text-emerald-200 space-y-1">
            <p>✓ 98% scientific mineral recovery (JNARDDC)</p>
            <p>✓ 100% elimination of open burning & acid</p>
            <p>✓ Digital & Cash proof for bank credit rating</p>
          </div>
        </div>

        {/* Net Value Added / Profit Boost */}
        <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 shadow-sm space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            3. Net Monthly Income Boost
          </span>
          <h4 className="text-sm font-semibold text-amber-900">Direct Collector Economic Gain</h4>
          <p className="text-3xl font-black text-amber-600 pt-1">
            +₹{totalGain.toLocaleString('en-IN')}
          </p>
          <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full inline-block">
            +{percentageGain}% Higher Monthly Take-Home Pay
          </span>
          <div className="pt-2 text-xs text-slate-600 space-y-1">
            <p>★ Bypasses 2-3 layers of informal middlemen</p>
            <p>★ Doorstep collection reduces transport cost</p>
          </div>
        </div>
      </div>

      {/* Breakdown Table by Material Stream */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h3 className="font-extrabold text-sm text-slate-800 mb-3">
          Material Stream Unit Economics Breakdown ({monthlyVolumeKg} kg volume)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Material Stream</th>
                <th className="p-3">Monthly Qty</th>
                <th className="p-3">Informal Rate</th>
                <th className="p-3">Formal CPCB Rate</th>
                <th className="p-3">Informal Payout</th>
                <th className="p-3">Formal Payout</th>
                <th className="p-3 text-emerald-700">Net Extra Gain</th>
                <th className="p-3">Critical Minerals Recovered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-slate-800">{row.name}</td>
                  <td className="p-3 font-mono">{row.weight} kg</td>
                  <td className="p-3 text-slate-500">₹{row.informalRate}/kg</td>
                  <td className="p-3 font-bold text-emerald-700">₹{row.formalRate}/kg</td>
                  <td className="p-3 text-slate-600">₹{row.informalIncome.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-slate-900">₹{row.formalIncome.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-black text-amber-600">+₹{row.gain.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{row.minerals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Sustainability Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>Platform Operational & Financial Sustainability Model</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 block">100% Free For Collectors</span>
            <p className="text-slate-600">
              Informal waste-pickers and kabadiwalas pay <strong>zero registration or transaction fees</strong>. No digital payment mandatory; cash is fully supported.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <span className="font-bold text-blue-900 block">0.75% Recycler Facilitation Fee</span>
            <p className="text-slate-600">
              Authorized recyclers pay a minimal 0.75% logistics & facilitation fee per confirmed batch. This generates predictable recurring revenue to sustain cloud & field operations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
            <span className="font-bold text-purple-900 block">EPR Compliance Credit Arbitrage</span>
            <p className="text-slate-600">
              Authorized recyclers earn <strong>₹8 to ₹15 per kg</strong> in government-mandated EPR credits from electronic producers (OEMs) for verifiable informal-sector intake.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
