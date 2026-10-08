import React from 'react';
import { translations } from '../utils/translations';
import { 
  Recycle, 
  Wifi, 
  WifiOff, 
  Globe, 
  UserCheck, 
  Building2, 
  TrendingUp, 
  Database,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export default function Header({
  lang,
  setLang,
  role,
  setRole,
  isOnline,
  setIsOnline,
  pendingSyncCount,
  onTriggerSync,
  isSyncing
}) {
  const t = translations[lang] || translations.en;

  return (
    <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      {/* Top Ministry Banner */}
      <div className="bg-emerald-950 px-4 py-1 text-xs text-emerald-300 flex justify-between items-center border-b border-emerald-800/40">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-700/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            SIH 2026
          </span>
          <span className="hidden sm:inline">Ministry of Mines (MoM) & JNARDDC</span>
          <span>• E-Waste (Management) Rules 2022 Compliance</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Offline / Online Simulation Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition ${
              isOnline 
                ? 'bg-emerald-600/60 text-emerald-100 hover:bg-emerald-600' 
                : 'bg-amber-600/80 text-amber-100 hover:bg-amber-600'
            }`}
            title="Click to toggle network connectivity simulation"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.online}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span>{t.offline}</span>
              </>
            )}
          </button>

          {/* Sync Trigger Button if items are queued */}
          {pendingSyncCount > 0 && isOnline && (
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold shadow animate-bounce"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{pendingSyncCount} {t.syncNow}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-emerald-900/80 rounded px-1.5 py-0.5">
            <Globe className="w-3 h-3 text-emerald-300" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer font-medium"
            >
              <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              <option value="mr" className="text-slate-900">मराठी (Marathi)</option>
              <option value="en" className="text-slate-900">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRole('collector')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md text-white">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
                {t.appTitle}
              </h1>
              <span className="bg-emerald-600/70 border border-emerald-400/30 text-emerald-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> CPCB Traceable
              </span>
            </div>
            <p className="text-xs text-emerald-200 hidden md:block">
              {t.subTitle}
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center bg-emerald-900/70 p-1 rounded-xl border border-emerald-700/50 text-xs font-semibold">
          <button
            onClick={() => setRole('collector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              role === 'collector'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.roles.collector}</span>
          </button>

          <button
            onClick={() => setRole('recycler')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              role === 'recycler'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.roles.recycler}</span>
          </button>

          <button
            onClick={() => setRole('economics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              role === 'economics'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.roles.economics}</span>
          </button>

          <button
            onClick={() => setRole('datasets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              role === 'datasets'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{t.roles.datasets}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
