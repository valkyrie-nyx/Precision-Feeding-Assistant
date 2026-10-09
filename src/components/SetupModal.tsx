// src/components/SetupModal.tsx
import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { SPECIES_LIST, DISCLAIMER_NOTE } from '../data';
import { determineStage } from '../calcEngine';

interface SetupModalProps {
  onComplete: (data: {
    farmName: string;
    pondName: string;
    speciesId: string;
    customSpeciesName?: string;
    stockingDate: string;
    stockCount: number;
    startingWeightG: number;
  }) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [farmName, setFarmName] = useState<string>('Sangli Aqua Farm');
  const [pondName, setPondName] = useState<string>('Pond A1');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('nile_tilapia');
  const [customSpeciesName, setCustomSpeciesName] = useState<string>('');
  const [stockingDate, setStockingDate] = useState<string>('2026-09-01');
  const [stockCount, setStockCount] = useState<number>(15000);
  const [startingWeightG, setStartingWeightG] = useState<number>(12.0);

  const calculatedStage = determineStage(selectedSpeciesId, startingWeightG);

  const handleFinish = () => {
    onComplete({
      farmName: farmName || 'My Farm',
      pondName: pondName || 'Pond 1',
      speciesId: selectedSpeciesId,
      customSpeciesName: selectedSpeciesId === 'other' ? customSpeciesName : undefined,
      stockingDate,
      stockCount: Number(stockCount) || 1000,
      startingWeightG: Number(startingWeightG) || 12.0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-300 flex flex-col justify-between max-h-[92vh]">
        {/* STEP HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-[#f8faf9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0f766e]" />
            <span className="font-bold text-slate-900 text-sm">
              Pond Initialization Wizard
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500">Step {step} of 4</span>
            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0f766e] h-full transition-all"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP 1: FARM & POND IDENTIFIER */}
        {step === 1 && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-800 font-bold block">
                Step 1 · Identification
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Register Farm & Pond Identifier
              </h2>
              <p className="text-xs text-slate-500">
                Establishes the agricultural management unit and links to the ESP32 sensor stream.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-700">
                  Facility / Farm Name
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Sangli Aqua Farm"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0f766e] rounded px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-700">
                  Pond Unit Identifier
                </label>
                <input
                  type="text"
                  value={pondName}
                  onChange={(e) => setPondName(e.target.value)}
                  placeholder="e.g. Pond A1"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0f766e] rounded px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SPECIES SELECTION */}
        {step === 2 && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-800 font-bold block">
                Step 2 · Biology
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Select Cultured Species
              </h2>
              <p className="text-xs text-slate-500">
                Links biological growth dynamics and feeding tables from verified aquaculture sources.
              </p>
            </div>

            <div className="max-h-[46vh] overflow-y-auto space-y-1.5 pr-1">
              {SPECIES_LIST.map((sp) => {
                const isSelected = selectedSpeciesId === sp.id;
                return (
                  <button
                    key={sp.id}
                    onClick={() => setSelectedSpeciesId(sp.id)}
                    className={`w-full text-left p-3 rounded border text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-[#0f766e] bg-teal-50/50 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sp.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ({sp.category})
                        </span>
                      </div>
                      <div className="text-[10px] font-mono mt-0.5">
                        {sp.hasReferenceTable ? (
                          <span className="text-emerald-700 font-medium">
                            Table: {sp.tableId} (Reference loaded)
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            No table loaded, placeholder sample rates
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0f766e] shrink-0 font-bold" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedSpeciesId === 'other' && (
              <div className="space-y-1 pt-1">
                <label className="text-xs font-mono font-bold text-slate-700">
                  Custom Species Name
                </label>
                <input
                  type="text"
                  value={customSpeciesName}
                  onChange={(e) => setCustomSpeciesName(e.target.value)}
                  placeholder="e.g. Chanos chanos / Milkfish"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0f766e] rounded px-3 py-2 text-xs font-semibold"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3: STOCKING PARAMETERS */}
        {step === 3 && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-800 font-bold block">
                Step 3 · Stocking
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Pond Stocking Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Stocking date, fish count, and starting weight determine baseline biomass automatically.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[11px] block">
                  Stocking Date
                </label>
                <input
                  type="date"
                  value={stockingDate}
                  onChange={(e) => setStockingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[11px] block">
                  Stocked Quantity (Live Count)
                </label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-base font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[11px] block">
                  Starting Mean Weight (grams per fish)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={startingWeightG}
                  onChange={(e) => setStartingWeightG(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-base font-bold text-slate-900"
                />
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  *The platform classifies growth stage automatically based on weight range.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & CONFIRMATION */}
        {step === 4 && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-800 font-bold block">
                Step 4 · Verification
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Pond Baseline Configured
              </h2>
              <p className="text-xs text-slate-500">
                Calculated operational parameters ready for precision feeding.
              </p>
            </div>

            <div className="bg-[#f8faf9] border border-slate-200 rounded p-4 space-y-3 font-mono text-xs">
              <div className="pb-2 border-b border-slate-200 flex justify-between">
                <span className="text-slate-500">Automated Stage:</span>
                <span className="font-bold text-slate-900 font-sans">{calculatedStage.name}</span>
              </div>
              <div className="pb-2 border-b border-slate-200 flex justify-between">
                <span className="text-slate-500">Assigned Feed:</span>
                <span className="font-bold text-slate-900 font-sans">{calculatedStage.feedCode} ({calculatedStage.pelletSizeMm}mm)</span>
              </div>
              <div className="pb-2 border-b border-slate-200 flex justify-between">
                <span className="text-slate-500">Session Frequency:</span>
                <span className="font-bold text-slate-900">{calculatedStage.mealsPerDay} meals / day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Live Biomass:</span>
                <span className="font-bold text-teal-800 font-bold">
                  {((stockCount * startingWeightG) / 1000).toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER & NAVIGATION BUTTONS */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-[#f8faf9] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            {DISCLAIMER_NOTE}
          </span>

          <div className="flex gap-2 font-mono text-xs">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep((prev) => prev + 1)}
                className="px-4 py-1.5 rounded bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-4 py-1.5 rounded bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold flex items-center gap-1.5"
              >
                <span>Initialize {pondName || 'Pond A1'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
