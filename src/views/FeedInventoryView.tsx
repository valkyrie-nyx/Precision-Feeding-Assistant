// src/views/FeedInventoryView.tsx
import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { DISCLAIMER_NOTE } from '../data';

export const FeedInventoryView: React.FC = () => {
  const inventory = aquacultureService.getFeedInventory();
  const [restockSuccessMsg, setRestockSuccessMsg] = useState<string | null>(null);

  const totalStockKg = inventory.reduce((acc, item) => acc + item.stockOnHandKg, 0);
  const totalBurnKg = inventory.reduce((acc, item) => acc + item.dailyUsageKg, 0);
  const daysOfFarmSupply = totalBurnKg > 0 ? (totalStockKg / totalBurnKg).toFixed(1) : '15.0';
  const shortBatches = inventory.filter((item) => item.isShortStock || item.daysLeft < 3.0);

  const handleSimulateRestock = (feedId: string) => {
    setRestockSuccessMsg(`Restock delivery recorded: +50 kg added to ${feedId.toUpperCase()}. Inventory records updated.`);
    setTimeout(() => setRestockSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
            Warehouse Logistics
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Feed Stock, Batches & Reorder Management
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Sangli Regional Warehouse · 3 Active Pellet Specifications
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200">
          Total Farm Security: ~{daysOfFarmSupply} Days Supply
        </div>
      </div>

      {/* AGGREGATE WAREHOUSE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-panel p-4 space-y-1 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Total Inventory on Hand
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {totalStockKg.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            Across 3 registered SKU batches
          </span>
        </div>

        <div className="surface-panel p-4 space-y-1 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Daily Aggregate Burn Rate
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {totalBurnKg.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">kg/day</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            Based on current pond biomass schedules
          </span>
        </div>

        <div className="surface-panel p-4 space-y-1 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Stock Short Alert Trigger
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-bold font-mono ${
                shortBatches.length > 0 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {shortBatches.length > 0 ? `${shortBatches.length} BATCH LOW` : 'ALL CLEAR'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            Reorder threshold: &lt; 3.0 days supply
          </span>
        </div>
      </div>

      {/* RESTOCK SUCCESS NOTICE */}
      {restockSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{restockSuccessMsg}</span>
        </div>
      )}

      {/* CRITICAL SHORT STOCK ALARM PANEL (IF ANY) */}
      {shortBatches.length > 0 && (
        <div className="surface-panel p-5 border border-rose-300 bg-rose-50/60 space-y-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-rose-950 uppercase font-mono">
                  Inventory Depletion Warning: {shortBatches[0].codeName} Running Low
                </h4>
                <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
                  Only <strong className="font-mono">{shortBatches[0].stockOnHandKg} kg</strong> remaining in warehouse (~{shortBatches[0].daysLeft.toFixed(1)} days of feeding).
                  Stock will be depleted before the next regular regional supplier delivery.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold uppercase">
              ACTION REQUIRED
            </span>
          </div>

          {/* TRANSITION MATRIX RECOMMENDATION */}
          {shortBatches[0].suggestedSwap && (
            <div className="bg-white p-3.5 rounded border border-rose-200 text-xs space-y-1.5">
              <span className="font-bold text-rose-950 flex items-center gap-1.5 font-mono">
                <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                Adaptive Pellet Transition Plan:
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                To prevent feeding halts, initiate transition mixing to{' '}
                <strong className="text-slate-900">{shortBatches[0].suggestedSwap}</strong>.
                Stage fingerlings at 40g can accept 3.5mm finisher pellets if mixed 50/50 over 48 hours.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => handleSimulateRestock(shortBatches[0].id)}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-mono text-xs font-semibold rounded shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Emergency Delivery (+50 kg)</span>
            </button>
          </div>
        </div>
      )}

      {/* REGISTERED FEED BATCHES TABLE */}
      <div className="surface-panel p-5 space-y-3 shadow-2xs">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Registered Feed Batches & Stock On Hand
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            3 Active SKUs in Store
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500">
                <th className="pb-2">Feed Product</th>
                <th className="pb-2">Specification</th>
                <th className="pb-2">Stock On Hand</th>
                <th className="pb-2">Daily Usage</th>
                <th className="pb-2">Days Left</th>
                <th className="pb-2">Batch / Expiry</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Intake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => {
                const isShort = item.isShortStock || item.daysLeft < 3.0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-900 font-sans">
                      {item.codeName}
                    </td>
                    <td className="py-3 text-slate-600 font-sans">
                      {item.feedType} ({item.pelletSizeMm}mm)
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {item.stockOnHandKg} kg
                    </td>
                    <td className="py-3 text-slate-600">
                      ~{item.dailyUsageKg} kg/day
                    </td>
                    <td className="py-3 font-bold">
                      <span className={isShort ? 'text-rose-600' : 'text-slate-900'}>
                        {item.daysLeft.toFixed(1)} days
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      #AK-2026-09 · Exp: Nov 2026
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          isShort
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleSimulateRestock(item.id)}
                        className="text-xs text-[#0f766e] font-semibold hover:underline"
                      >
                        + Intake
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-6 pb-2 text-center border-t border-slate-200/80">
        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          {DISCLAIMER_NOTE}
        </p>
      </footer>
    </div>
  );
};
