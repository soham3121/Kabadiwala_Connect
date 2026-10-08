import React, { useState } from 'react';
import { translations } from '../../utils/translations';
import { 
  ShieldAlert, 
  Volume2, 
  Flame, 
  AlertTriangle, 
  Skull, 
  CheckCircle2, 
  XCircle,
  HeartPulse
} from 'lucide-react';
import { playSpeech, stopSpeech } from '../../utils/speech';

export default function SafetyGuide({ safetyData, lang }) {
  const t = translations[lang] || translations.en;
  const [playingId, setPlayingId] = useState(null);

  const handlePlayAudio = (item) => {
    if (playingId === item.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);
    const text = lang === 'hi' ? item.audio_hi : lang === 'mr' ? item.audio_mr : item.audio_en;
    playSpeech(text, lang, () => setPlayingId(null));
  };

  const getHazardIcon = (iconName) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6 text-red-600" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-orange-600" />;
      case 'Skull': return <Skull className="w-6 h-6 text-red-700" />;
      default: return <ShieldAlert className="w-6 h-6 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Header */}
      <div className="bg-gradient-to-r from-red-800 to-rose-950 text-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              Health & Life Protection
            </span>
            <span className="text-xs text-rose-200">Zero Toxic Backyard Dismantling</span>
          </div>
          <h2 className="text-xl font-extrabold">{t.safety.title}</h2>
          <p className="text-xs text-rose-200 mt-0.5">{t.safety.subTitle}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-red-900/60 border border-red-500/40 p-3 rounded-xl">
          <HeartPulse className="w-7 h-7 text-rose-400" />
        </div>
      </div>

      {/* Safety Hazard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {safetyData.map((guide) => {
          const isPlaying = playingId === guide.id;
          const title = lang === 'hi' ? guide.title_hi : lang === 'mr' ? guide.title_mr : guide.title;
          const severity = lang === 'hi' ? guide.severity_hi : lang === 'mr' ? guide.severity_mr : guide.severity;
          const description = lang === 'hi' ? guide.description_hi : lang === 'mr' ? guide.description_mr : guide.description;
          const formal = lang === 'hi' ? guide.formalAdvantage_hi : lang === 'mr' ? guide.formalAdvantage_mr : guide.formalAdvantage;

          return (
            <div
              key={guide.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 transition p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-100">
                      {getHazardIcon(guide.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        {severity}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(guide)}
                    className={`p-2 rounded-xl transition flex items-center justify-center ${
                      isPlaying 
                        ? 'bg-amber-400 text-slate-950 animate-pulse'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    }`}
                    title="Play Audio Warning"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bad Hazard Practice */}
                <div className="mt-3 bg-red-50/70 border border-red-200/80 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-red-800 font-bold mb-1">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>{t.safety.whyStop}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Safe Formal Recycler Practice */}
                <div className="mt-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.safety.formalSolution}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {formal}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                <span>EPR Safe Dismantle Standard</span>
                <span className="font-semibold text-emerald-700">JNARDDC Protocol</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
