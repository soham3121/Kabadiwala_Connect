import React, { useState } from 'react';
import { translations } from '../../utils/translations';
import { 
  Camera, 
  Check, 
  AlertTriangle, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Volume2,
  TrendingUp,
  Cpu,
  BatteryCharging,
  Cable,
  Tv,
  Monitor,
  Disc,
  Box
} from 'lucide-react';
import { playSpeech } from '../../utils/speech';

export default function LotCreation({
  materials,
  recyclers,
  lang,
  isOnline,
  onCreateLot,
  onViewLotDetails
}) {
  const t = translations[lang] || translations.en;

  const [selectedMatId, setSelectedMatId] = useState(materials[0]?.id || 'mat_pcb_high');
  const [weightKg, setWeightKg] = useState(10);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState(recyclers[0]?.id || 'rec_maha_01');
  const [paymentPreference, setPaymentPreference] = useState('Cash');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anomalyNotice, setAnomalyNotice] = useState(null);

  const selectedMaterial = materials.find(m => m.id === selectedMatId) || materials[0] || {};
  const selectedRecycler = recyclers.find(r => r.id === selectedRecyclerId) || recyclers[0] || {};

  // Calculations
  const formalUnitRate = Math.round(selectedMaterial.formalPrice * (selectedRecycler.rateMultiplier || 1.05));
  const informalUnitRate = selectedMaterial.informalPrice || Math.round(formalUnitRate * 0.6);
  const totalFormalValue = Math.round(formalUnitRate * weightKg);
  const totalInformalValue = Math.round(informalUnitRate * weightKg);
  const extraGain = totalFormalValue - totalInformalValue;
  const gainPercentage = totalInformalValue > 0 ? Math.round((extraGain / totalInformalValue) * 100) : 0;

  // Audio helper
  const speakValuation = () => {
    let msg = "";
    if (lang === 'hi') {
      msg = `${selectedMaterial.name_hi || selectedMaterial.name}, ${weightKg} किलो का अधिकृत मूल्य है ${totalFormalValue} रुपये। बिचौलिये से ${extraGain} रुपये ज्यादा कमाई होगी।`;
    } else if (lang === 'mr') {
      msg = `${selectedMaterial.name_mr || selectedMaterial.name}, ${weightKg} किलोची अधिकृत किंमत आहे ${totalFormalValue} रुपये. दलालापेक्षा ${extraGain} रुपये जास्तीचा नफा होईल.`;
    } else {
      msg = `${selectedMaterial.name}, ${weightKg} kg has a formal authorized value of ${totalFormalValue} rupees, giving you ${extraGain} rupees extra profit over informal middlemen.`;
    }
    playSpeech(msg, lang);
  };

  const handleAdjustWeight = (delta) => {
    const next = Math.max(0.5, parseFloat((weightKg + delta).toFixed(1)));
    setWeightKg(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lotPayload = {
      materialId: selectedMaterial.id,
      weightKg: weightKg,
      recyclerId: selectedRecycler.id,
      paymentPreference,
      imageUrl: customPhotoUrl || selectedMaterial.image,
      collectionLocation: "Dapodi Scrap Cluster, Pune",
      gpsCoordinates: "18.5789° N, 73.8322° E"
    };

    try {
      const createdLot = await onCreateLot(lotPayload);
      if (createdLot) {
        onViewLotDetails(createdLot);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMatIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'BatteryCharging': return <BatteryCharging className="w-6 h-6" />;
      case 'Cable': return <Cable className="w-6 h-6" />;
      case 'Tv': return <Tv className="w-6 h-6" />;
      case 'Monitor': return <Monitor className="w-6 h-6" />;
      case 'Disc': return <Disc className="w-6 h-6" />;
      default: return <Box className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Collector Profile Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-4 shadow-md flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
            {t.collectorProfile.id}
          </span>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <span>{t.collectorProfile.name}</span>
            <span className="text-xs bg-emerald-500/80 px-2 py-0.5 rounded-full font-normal">
              {t.collectorProfile.location}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold text-emerald-100">
            {t.collectorProfile.greenPoints}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Select Material Category */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">1</span>
              {t.lotCreation.step1}
            </h3>
            <span className="text-xs text-slate-500">Tap to select</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {materials.map((mat) => {
              const isSelected = mat.id === selectedMatId;
              const displayName = lang === 'hi' ? mat.name_hi || mat.name : lang === 'mr' ? mat.name_mr || mat.name : mat.name;
              return (
                <button
                  type="button"
                  key={mat.id}
                  onClick={() => setSelectedMatId(mat.id)}
                  className={`relative text-left p-3 rounded-xl border-2 transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {getMatIcon(mat.icon)}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {mat.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
                      {displayName}
                    </h4>
                    <p className="text-xs text-emerald-700 font-extrabold mt-1">
                      ₹{mat.formalPrice} / {mat.unit}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Toxic Hazard & Critical Mineral Notice for Selected Material */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-amber-900 font-semibold">
                <span className="text-amber-700 font-bold uppercase mr-1">[{selectedMaterial.hazardLevel} Hazard]:</span>
                {lang === 'hi' ? selectedMaterial.hazardInfo_hi || selectedMaterial.hazardInfo : lang === 'mr' ? selectedMaterial.hazardInfo_mr || selectedMaterial.hazardInfo : selectedMaterial.hazardInfo}
              </p>
              {selectedMaterial.recoveredElements && (
                <p className="text-slate-600">
                  <span className="font-semibold text-emerald-800">Recovers Critical Minerals: </span>
                  {selectedMaterial.recoveredElements.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* STEP 2: Scrap Photo & Proof */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">2</span>
              {t.lotCreation.step2}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">AI Pre-verified</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <img
                src={customPhotoUrl || selectedMaterial.image}
                alt={selectedMaterial.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <Camera className="w-4 h-4" /> Click to Retake
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full text-xs">
              <p className="text-slate-600">
                A clear digital photo is required for CPCB Extended Producer Responsibility (EPR) digital chain of custody.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCustomPhotoUrl(selectedMaterial.image)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Use Sample Photo
                </button>
                <label className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-medium cursor-pointer flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload from Camera / Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setCustomPhotoUrl(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: Enter Approximate Weight */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">3</span>
              {t.lotCreation.step3}
            </h3>
            <span className="text-xs text-slate-500">Unit: {selectedMaterial.unit}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={() => handleAdjustWeight(-5)}
                className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-700 text-lg transition"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(-1)}
                className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-700 text-lg transition"
              >
                -1
              </button>

              <div className="relative w-36">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full text-center text-3xl font-extrabold py-2 px-3 border-2 border-emerald-500 rounded-xl focus:outline-none bg-emerald-50/40 text-slate-900"
                />
                <span className="absolute right-3 top-4 text-xs font-bold text-slate-400">
                  {selectedMaterial.unit}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustWeight(1)}
                className="w-12 h-12 rounded-xl bg-emerald-100 hover:bg-emerald-200 font-extrabold text-emerald-800 text-lg transition"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(5)}
                className="w-12 h-12 rounded-xl bg-emerald-100 hover:bg-emerald-200 font-extrabold text-emerald-800 text-lg transition"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(10)}
                className="w-12 h-12 rounded-xl bg-emerald-200 hover:bg-emerald-300 font-extrabold text-emerald-900 text-lg transition"
              >
                +10
              </button>
            </div>
            <p className="text-center text-xs text-slate-500">
              Approximate weight. The recycler will verify on calibrated digital scale at handover.
            </p>
          </div>
        </div>

        {/* STEP 4: Choose Authorized Recycler */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">4</span>
              {t.lotCreation.step4}
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {recyclers.length} Recyclers Nearby
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recyclers.map((rec) => {
              const isSelected = rec.id === selectedRecyclerId;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecyclerId(rec.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900">{rec.name}</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                          ★ {rec.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rec.facilityLocation}</span>
                      </p>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold">
                      +{Math.round((rec.rateMultiplier - 1) * 100)}% Bonus Rate
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{rec.distanceKm} km</span>
                      {rec.pickupAvailable && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Pickup
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 5: Payment Preference (Cash vs UPI) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between gap-4">
          <div className="text-xs">
            <span className="font-bold text-slate-800">Payment Mode:</span>
            <p className="text-slate-500">Cash is 100% supported on-the-spot. Digital UPI is optional.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaymentPreference('Cash')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                paymentPreference === 'Cash'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💵 Cash on Handover
            </button>
            <button
              type="button"
              onClick={() => setPaymentPreference('UPI / Digital')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                paymentPreference !== 'Cash'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📱 Instant UPI
            </button>
          </div>
        </div>

        {/* LIVE VALUATION SUMMARY CARD */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xl border border-slate-700">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                {t.lotCreation.instantEstimate}
              </h3>
            </div>
            <button
              type="button"
              onClick={speakValuation}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow transition"
              title="Listen in chosen language"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen Value</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {/* Informal Middleman Offer */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t.lotCreation.informalRate}
              </span>
              <p className="text-lg font-bold text-slate-300 line-through mt-1">
                ₹{totalInformalValue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-slate-500">₹{informalUnitRate}/{selectedMaterial.unit}</span>
            </div>

            {/* Formal Recycler Rate */}
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3">
              <span className="text-[11px] text-emerald-300 block font-bold">
                {t.lotCreation.formalRate}
              </span>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">
                ₹{totalFormalValue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-300 font-semibold">₹{formalUnitRate}/{selectedMaterial.unit}</span>
            </div>

            {/* Extra Profit Boost */}
            <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3">
              <span className="text-[11px] text-amber-300 block font-bold">
                {t.lotCreation.extraEarnings}
              </span>
              <p className="text-xl font-black text-amber-400 mt-1">
                +₹{extraGain.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                +{gainPercentage}% More Income
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <span>{t.lotCreation.submitting}</span>
              ) : (
                <>
                  <span>{t.lotCreation.createBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {!isOnline && (
              <p className="text-center text-xs text-amber-300 mt-2 font-medium">
                ⚡ Offline mode active. Lot will be saved locally and given instant QR pass. Will sync to server when reconnected.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
