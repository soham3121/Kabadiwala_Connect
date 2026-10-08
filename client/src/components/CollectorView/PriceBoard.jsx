import React, { useState } from 'react';
import { translations } from '../../utils/translations';
import { 
  Volume2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { playSpeech, stopSpeech } from '../../utils/speech';

export default function PriceBoard({ prices, lang }) {
  const t = translations[lang] || translations.en;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCategory, setActiveCategory] = useState(prices[0]?.category || 'PCBs');

  const selectedPriceItem = prices.find(p => p.category === activeCategory) || prices[0] || {};

  const handleListenAllPrices = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    let fullScript = "";
    if (lang === 'hi') {
      fullScript = "नमस्ते कबाड़ीवाला भाई। आज के सरकारी रीसाइक्लिंग भाव हैं: " + 
        prices.map(p => p.spoken_hi).join(" ");
    } else if (lang === 'mr') {
      fullScript = "नमस्कार कबाडीवाला मित्रहो. आजचे अधिकृत रीसायकलिंग दर खालीलप्रमाणे आहेत: " + 
        prices.map(p => p.spoken_mr).join(" ");
    } else {
      fullScript = "Hello scrap partner. Today's formal CPCB authorized scrap prices are: " + 
        prices.map(p => p.spoken_en).join(" ");
    }

    playSpeech(fullScript, lang, () => setIsSpeaking(false));
  };

  const handleListenSingle = (item) => {
    const text = lang === 'hi' ? item.spoken_hi : lang === 'mr' ? item.spoken_mr : item.spoken_en;
    playSpeech(text, lang);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Audio Button */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              CPCB E-Waste Index
            </span>
            <span className="text-xs text-emerald-200">Daily Live Rates</span>
          </div>
          <h2 className="text-xl font-extrabold">{t.prices.title}</h2>
          <p className="text-xs text-emerald-200 mt-0.5">{t.prices.subTitle}</p>
        </div>

        {/* Vernacular Audio Readout Button */}
        <button
          onClick={handleListenAllPrices}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition active:scale-95 ${
            isSpeaking 
              ? 'bg-amber-400 text-slate-950 animate-pulse'
              : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span>{isSpeaking ? t.prices.speaking : t.prices.listenAudio}</span>
        </button>
      </div>

      {/* Grid of Material Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((item) => {
          const isSelected = item.category === activeCategory;
          const isUp = item.trend === 'up';
          const isDown = item.trend === 'down';

          return (
            <div
              key={item.category}
              onClick={() => setActiveCategory(item.category)}
              className={`bg-white rounded-2xl p-4 border-2 transition cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md ${
                isSelected ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className={`flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isUp ? 'bg-emerald-50 text-emerald-700' : isDown ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    <span>{item.changePercent}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{item.currentRate}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {item.unit}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1">
                  {t.prices.minMax.replace('{min}', item.rangeMin).replace('{max}', item.rangeMax)}
                </p>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleListenSingle(item);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Listen</span>
                </button>

                <span className="text-[10px] text-slate-400 font-medium">
                  Tap for 7-Day Trend
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Day Trend Chart for Active Category */}
      {selectedPriceItem.history && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <span>{selectedPriceItem.category}</span>
                <span className="text-xs text-slate-400">• {t.prices.sevenDayTrend}</span>
              </h3>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              ₹{selectedPriceItem.currentRate} / {selectedPriceItem.unit}
            </span>
          </div>

          {/* Visual Trend Bars */}
          <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 pb-2 border-b border-slate-100">
            {selectedPriceItem.history.map((pt, idx) => {
              const maxRate = selectedPriceItem.rangeMax || 500;
              const minRate = selectedPriceItem.rangeMin || 50;
              const heightPercent = Math.max(20, Math.min(100, ((pt.rate - minRate) / (maxRate - minRate)) * 100));
              const isToday = idx === selectedPriceItem.history.length - 1;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    ₹{pt.rate}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                      isToday 
                        ? 'bg-emerald-600 shadow-md' 
                        : 'bg-emerald-200 hover:bg-emerald-300'
                    }`}
                  />
                  <span className={`text-[10px] font-medium ${isToday ? 'text-emerald-800 font-bold' : 'text-slate-400'}`}>
                    {pt.day}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Rates reflect verified secondary scrap transactions from registered e-waste dismantle facilities.
          </p>
        </div>
      )}
    </div>
  );
}
