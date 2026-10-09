// src/views/WaterQualityView.tsx
import React, { useState } from 'react';
import {
  Wind,
  Radio,
} from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';
import { HOURLY_OXYGEN_OUTLOOK, DISCLAIMER_NOTE, PLACEHOLDER_LIMITS } from '../data';
import { WaterQualityTrendChart } from '../components/WaterQualityTrendChart';

export const WaterQualityView: React.FC = () => {
  const telemetry = aquacultureService.getTelemetry();
  const farmSetup = aquacultureService.getFarmSetup();
  const [selectedHour, setSelectedHour] = useState<string>('08:00');

  const selectedPoint =
    HOURLY_OXYGEN_OUTLOOK.find((p) => p.hour === selectedHour) || HOURLY_OXYGEN_OUTLOOK[2];

  const isLowDO = telemetry.liveDO < PLACEHOLDER_LIMITS.oxygen.stopLevelMgL;
  const isCautionDO =
    telemetry.liveDO >= PLACEHOLDER_LIMITS.oxygen.stopLevelMgL &&
    telemetry.liveDO < PLACEHOLDER_LIMITS.oxygen.fullFeedingLevelMgL;

  const aeratorSchedule = [
    { time: '22:00 – 06:00', relay: 'Relay 1 + 2', status: 'ACTIVE (Forced)', reason: 'Pre-dawn algal respiration trough protection' },
    { time: '12:00 – 14:00', relay: 'Relay 1', status: 'STANDBY (Thermal Mix)', reason: 'Water column destratification & heat mixing' },
    { time: '14:00 – 18:00', relay: 'Relay 1', status: 'OFF (Standby)', reason: 'Natural photosynthetic super-saturation' },
    { time: '18:00 – 22:00', relay: 'Relay 1', status: 'ACTIVE', reason: 'Post-dusk oxygen depletion mitigation' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
            Environmental Telemetry
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Water Quality Monitoring & Aerator Controls
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Pond: {farmSetup.pondName} · ESP32 Sensor Hub Stream
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200">
          <Radio className="w-3.5 h-3.5 text-[#0f766e] animate-pulse" />
          <span>Probe Stream: OK · {telemetry.lastSyncText}</span>
        </div>
      </div>

      {/* 4 PRIMARY SENSOR CHANNELS MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* DO Channel */}
        <div className="surface-panel p-4 space-y-2 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500">
            <span>Dissolved Oxygen</span>
            <span
              className={`font-bold ${
                isLowDO ? 'text-rose-600' : isCautionDO ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {isLowDO ? 'STOP' : isCautionDO ? 'CAUTION' : 'NORMAL'}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {telemetry.liveDO.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">mg/L</span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="w-[30%] bg-rose-400" />
              <div className="w-[20%] bg-amber-400" />
              <div className="w-[50%] bg-emerald-400" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>0</span>
              <span>Stop &lt; 3.0</span>
              <span>Target ≥ 5.0</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Water Temp Channel */}
        <div className="surface-panel p-4 space-y-2 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500">
            <span>Temperature</span>
            <span className="text-teal-700 font-bold">OPTIMUM</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {telemetry.liveTemp.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">°C</span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="w-[25%] bg-sky-300" />
              <div className="w-[50%] bg-emerald-400" />
              <div className="w-[25%] bg-rose-400" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>15°C</span>
              <span>Opt: 27–32°C</span>
              <span>38°C</span>
            </div>
          </div>
        </div>

        {/* pH Channel */}
        <div className="surface-panel p-4 space-y-2 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500">
            <span>Acidity (pH)</span>
            <span className="text-emerald-700 font-bold">STABLE</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              7.6
            </span>
            <span className="text-xs font-mono text-slate-500">pH</span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="w-[25%] bg-amber-300" />
              <div className="w-[50%] bg-emerald-400" />
              <div className="w-[25%] bg-amber-300" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>6.0</span>
              <span>Safe: 6.5–8.5</span>
              <span>9.0</span>
            </div>
          </div>
        </div>

        {/* Turbidity Channel */}
        <div className="surface-panel p-4 space-y-2 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500">
            <span>Turbidity</span>
            <span className="text-slate-600 font-bold">NORMAL</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {telemetry.turbidityNtu}
            </span>
            <span className="text-xs font-mono text-slate-500">NTU</span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="w-[60%] bg-emerald-400" />
              <div className="w-[40%] bg-rose-400" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>0 NTU</span>
              <span>Safe &lt; 50</span>
              <span>100 NTU</span>
            </div>
          </div>
        </div>
      </div>

      {/* 24-HOUR DIURNAL OXYGEN FORECASTING GRAPH */}
      <div className="surface-panel p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              24-Hour Diurnal Dissolved Oxygen Model
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Hourly photosynthesis & algal respiration cycle predictions
            </p>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">
            Model: Diurnal Sine Curve + Sunlight Irradiance
          </span>
        </div>

        {/* TECHNICAL STEP/BAR CHART */}
        <div className="bg-[#f8faf9] border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
            {HOURLY_OXYGEN_OUTLOOK.map((pt) => {
              const isSelected = selectedHour === pt.hour;
              const heightPct = Math.min(100, Math.max(12, (pt.predictedDO / 8.0) * 100));
              const isSafe = pt.predictedDO >= 5.0;
              const isDanger = pt.predictedDO < 3.5;

              return (
                <div
                  key={pt.hour}
                  onClick={() => setSelectedHour(pt.hour)}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <span
                    className={`text-[9px] font-mono font-bold transition-opacity ${
                      isSelected
                        ? 'opacity-100 text-[#0f766e]'
                        : 'opacity-0 group-hover:opacity-100 text-slate-500'
                    }`}
                  >
                    {pt.predictedDO}
                  </span>

                  <div className="w-full max-w-[36px] h-32 bg-slate-200/80 rounded-t flex items-end p-0.5">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all ${
                        isSelected
                          ? 'bg-[#0f766e] ring-2 ring-teal-300'
                          : isDanger
                          ? 'bg-rose-500 group-hover:bg-rose-600'
                          : isSafe
                          ? 'bg-emerald-600 group-hover:bg-emerald-700'
                          : 'bg-amber-500 group-hover:bg-amber-600'
                      }`}
                    />
                  </div>

                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      isSelected ? 'font-bold text-[#0f766e]' : 'text-slate-500'
                    }`}
                  >
                    {pt.hour}
                  </span>
                </div>
              );
            })}
          </div>

          {/* INSPECTED HOUR DETAIL STRIP */}
          <div className="bg-white p-3 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="font-bold text-slate-900">
                Window {selectedPoint.hour}: Predicted {selectedPoint.predictedDO} mg/L
              </span>
              <span className="text-slate-500 block text-[11px] mt-0.5">
                Biological rationale: {selectedPoint.reason}
              </span>
            </div>

            <span
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase self-start sm:self-auto border ${
                selectedPoint.safety === 'Safe'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : selectedPoint.safety === 'Caution'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {selectedPoint.safety} Feeding Window
            </span>
          </div>
        </div>
      </div>

      {/* AERATOR AUTOMATION SCHEDULE & HARDWARE RELAY BOARD */}
      <div className="surface-panel p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Paddlewheel Aerator Control Matrix (ESP32 Relay Board)
            </h3>
          </div>

          <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Automated Duty Cycle Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500">
                <th className="pb-2">Time Window</th>
                <th className="pb-2">Assigned Relays</th>
                <th className="pb-2">Operational State</th>
                <th className="pb-2">Biological Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aeratorSchedule.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-bold text-slate-900">{row.time}</td>
                  <td className="py-2.5 text-slate-600">{row.relay}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        row.status.includes('ACTIVE')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : row.status.includes('STANDBY')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500 font-sans text-[11px]">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MULTI-CHANNEL DIURNAL TREND CHART */}
      <WaterQualityTrendChart />

      {/* FOOTER */}
      <footer className="pt-6 pb-2 text-center border-t border-slate-200/80">
        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          {DISCLAIMER_NOTE}
        </p>
      </footer>
    </div>
  );
};
