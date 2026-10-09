// src/views/AlertsView.tsx
import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE } from '../data';

interface AlertsViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigateToTab }) => {
  const alerts = aquacultureService.getActiveAlerts();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0789F9] block">
            Operational Safety & Threshold Monitor
          </span>
          <h2 className="text-2xl font-bold text-[#12365F]">
            Pond Safety Alerts & System Interlocks
          </h2>
          <p className="text-xs text-[#547392] mt-0.5">
            Real-time optical probe and inventory guardrails enforcing hard safety rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Safety Interlock Active
          </span>
        </div>
      </div>

      {/* ACTIVE ALERTS LIST */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="ocean-card p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-[#12365F] text-base">
              All Pond Systems Operating Normally
            </h3>
            <p className="text-xs text-[#547392] max-w-md mx-auto">
              Dissolved oxygen is safely above the 5.0 mg/L feeding ceiling. Temperature and feed reserves are optimal.
            </p>
          </div>
        ) : (
          alerts.map((alt) => {
            const isCritical = alt.severity === 'critical';
            return (
              <div
                key={alt.id}
                className={`ocean-card p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/50'
                    : 'border-amber-300 bg-amber-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCritical ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isCritical ? 'CRITICAL SAFETY INTERLOCK' : 'OPERATIONAL NOTICE'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {alt.timestampText || 'Just now'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#12365F] mt-1">{alt.title}</h3>
                    <p className="text-xs text-[#547392] mt-0.5 leading-relaxed">
                      {alt.message}
                    </p>
                    <div className="mt-2 text-xs font-semibold text-slate-700">
                      Required Action: <span className="text-[#0789F9]">{alt.actionRequired}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  {alt.category === 'stock_short' ? (
                    <button
                      onClick={() => onNavigateToTab('inventory')}
                      className="px-4 py-2 rounded-xl bg-[#0789F9] hover:bg-[#0574d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Manage Stock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToTab('meals')}
                      className="px-4 py-2 rounded-xl bg-[#0789F9] hover:bg-[#0574d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Inspect Gate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SYSTEM SAFETY THRESHOLDS AUDIT */}
      <div className="ocean-card p-5 space-y-4">
        <h3 className="font-bold text-[#12365F] text-sm">
          Active Biological Safety Thresholds (Hard Invariants)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12365F]">Oxygen Safety Stop</span>
              <span className="text-rose-600 font-mono font-bold">&lt; 3.0 mg/L</span>
            </div>
            <p className="text-[#547392] text-[11px]">
              Non-negotiable rule. Complete feed halt and aerator relay activation.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12365F]">Partial Feeding Scale</span>
              <span className="text-amber-600 font-mono font-bold">3.0 – 5.0 mg/L</span>
            </div>
            <p className="text-[#547392] text-[11px]">
              Linear scaling of meal ration to avoid metabolic oxygen distress.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f0f7fe] border border-[#d6e8f7] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12365F]">Thermal Limits</span>
              <span className="text-teal-700 font-mono font-bold">20°C – 32°C</span>
            </div>
            <p className="text-[#547392] text-[11px]">
              Above 32°C feeding is reduced by 10%. Below 20°C feeds are delayed.
            </p>
          </div>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 text-center">
        {DISCLAIMER_NOTE}
      </div>
    </div>
  );
};
