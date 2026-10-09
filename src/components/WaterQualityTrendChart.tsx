// src/components/WaterQualityTrendChart.tsx
import React, { useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import { aquacultureService } from '../services/aquacultureService';

export const WaterQualityTrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const telemetry = aquacultureService.getTelemetry();

  // 24-hour diurnal curve points (00:00 to 24:00)
  const data24h = [
    { time: '00:00', doVal: 4.8, temp: 26.2, ph: 7.5, sal: 1.2 },
    { time: '03:00', doVal: 3.9, temp: 25.8, ph: 7.4, sal: 1.2 },
    { time: '06:00', doVal: 3.4, temp: 25.5, ph: 7.3, sal: 1.2 }, // dawn minimum
    { time: '09:00', doVal: 5.6, temp: 27.8, ph: 7.7, sal: 1.2 }, // morning photosynthesis
    { time: '12:00', doVal: 7.4, temp: 30.5, ph: 8.2, sal: 1.3 }, // solar peak
    { time: '15:00', doVal: 7.8, temp: 31.2, ph: 8.3, sal: 1.3 }, // maximum DO
    { time: '18:00', doVal: 6.5, temp: 29.8, ph: 8.0, sal: 1.2 }, // sunset
    { time: '21:00', doVal: 5.3, temp: 27.5, ph: 7.6, sal: 1.2 },
    { time: 'Now', doVal: telemetry.liveDO, temp: telemetry.liveTemp, ph: 7.8, sal: 1.2 },
  ];

  const data7d = [
    { time: 'Mon', doVal: 5.8, temp: 28.5, ph: 7.8, sal: 1.2 },
    { time: 'Tue', doVal: 6.2, temp: 29.1, ph: 7.9, sal: 1.2 },
    { time: 'Wed', doVal: 5.4, temp: 28.2, ph: 7.7, sal: 1.2 },
    { time: 'Thu', doVal: 6.5, temp: 29.6, ph: 8.0, sal: 1.3 },
    { time: 'Fri', doVal: 5.9, temp: 29.0, ph: 7.8, sal: 1.2 },
    { time: 'Sat', doVal: 6.1, temp: 29.4, ph: 7.9, sal: 1.2 },
    { time: 'Sun (Today)', doVal: telemetry.liveDO, temp: telemetry.liveTemp, ph: 7.8, sal: 1.2 },
  ];

  const data30d = [
    { time: 'W1', doVal: 5.6, temp: 27.8, ph: 7.6, sal: 1.1 },
    { time: 'W2', doVal: 6.0, temp: 28.4, ph: 7.8, sal: 1.2 },
    { time: 'W3', doVal: 5.7, temp: 29.2, ph: 7.9, sal: 1.2 },
    { time: 'W4', doVal: telemetry.liveDO, temp: telemetry.liveTemp, ph: 7.8, sal: 1.2 },
  ];

  const activeData = timeRange === '24h' ? data24h : timeRange === '7d' ? data7d : data30d;

  // Chart dimensions
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingTop - paddingBottom;

  // Scales
  const getX = (idx: number) => paddingX + (idx / (activeData.length - 1)) * plotWidth;
  // DO scale: 0 to 10 mg/L
  const getDO_Y = (v: number) => paddingTop + plotHeight - (Math.min(10, Math.max(0, v)) / 10) * plotHeight;
  // Temp scale: 20 to 35 °C
  const getTemp_Y = (v: number) => paddingTop + plotHeight - ((Math.min(35, Math.max(20, v)) - 20) / 15) * plotHeight;
  // pH scale: 6 to 9
  const getPH_Y = (v: number) => paddingTop + plotHeight - ((Math.min(9, Math.max(6, v)) - 6) / 3) * plotHeight;
  // Salinity scale: 0 to 3 ppt
  const getSal_Y = (v: number) => paddingTop + plotHeight - (Math.min(3, Math.max(0, v)) / 3) * plotHeight;

  // Build SVG polyline paths
  const doPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getDO_Y(d.doVal)}`).join(' ');
  const tempPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getTemp_Y(d.temp)}`).join(' ');
  const phPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getPH_Y(d.ph)}`).join(' ');
  const salPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getSal_Y(d.sal)}`).join(' ');

  // Area under DO curve
  const doAreaPath = `${doPath} L ${getX(activeData.length - 1)} ${paddingTop + plotHeight} L ${getX(0)} ${paddingTop + plotHeight} Z`;

  const hoveredPoint = hoverIndex !== null ? activeData[hoverIndex] : null;

  return (
    <div className="ocean-card p-5 space-y-4">
      {/* HEADER & TIME RANGE SELECTORS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#08B9E8]/15 text-[#0789F9] flex items-center justify-center">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-[#12365F] text-sm">
              Water Quality Diurnal Trends
            </h3>
            <span className="text-[11px] text-[#547392] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#0789F9]" />
              Multi-channel optical telemetry stream
            </span>
          </div>
        </div>

        {/* RANGE TABS */}
        <div className="flex items-center bg-[#f0f7fe] p-1 rounded-xl border border-[#d6e8f7]">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setTimeRange(r);
                setHoverIndex(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                timeRange === r
                  ? 'bg-white text-[#0789F9] shadow-xs'
                  : 'text-[#547392] hover:text-[#12365F]'
              }`}
            >
              {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* LEGEND STRIP */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pb-1 border-b border-[#e2eef9]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#08B9E8] shadow-xs" />
          <span className="text-[#12365F]">DO (mg/L):</span>
          <span className="font-mono text-[#0789F9]">{telemetry.liveDO.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="text-[#12365F]">Temp (°C):</span>
          <span className="font-mono text-[#F59E0B]">{telemetry.liveTemp.toFixed(1)}°</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="text-[#12365F]">pH:</span>
          <span className="font-mono text-[#10B981]">7.8</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0789F9]" />
          <span className="text-[#12365F]">Salinity (ppt):</span>
          <span className="font-mono text-[#0789F9]">1.2</span>
        </div>

        <div className="ml-auto text-[10px] text-slate-400 font-mono hidden sm:block">
          *Hover points for historical readings
        </div>
      </div>

      {/* SVG PLOTTING CANVAS */}
      <div className="relative w-full overflow-hidden bg-white rounded-xl pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56"
          preserveAspectRatio="none"
        >
          {/* Pale blue grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingTop + plotHeight * pct;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e6f2fc"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* DO STOP SAFETY LEVEL LINE (3.0 mg/L) */}
          <line
            x1={paddingX}
            y1={getDO_Y(3.0)}
            x2={width - paddingX}
            y2={getDO_Y(3.0)}
            stroke="#fca5a5"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text
            x={paddingX + 5}
            y={getDO_Y(3.0) - 4}
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            DO Safety Threshold (3.0 mg/L)
          </text>

          {/* DO Area fill */}
          <path d={doAreaPath} fill="url(#doAreaGrad)" opacity="0.3" />

          {/* Lines */}
          <path d={salPath} fill="none" stroke="#0789F9" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d={phPath} fill="none" stroke="#10B981" strokeWidth="1.8" strokeOpacity="0.8" />
          <path d={tempPath} fill="none" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.85" />
          <path d={doPath} fill="none" stroke="#08B9E8" strokeWidth="2.8" strokeLinecap="round" />

          {/* Data point dots */}
          {activeData.map((d, i) => {
            const cx = getX(i);
            const cy = getDO_Y(d.doVal);
            const isHovered = hoverIndex === i;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3}
                  fill="#ffffff"
                  stroke="#08B9E8"
                  strokeWidth="2.5"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />
              </g>
            );
          })}

          {/* Time axis labels */}
          {activeData.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={height - 10}
              fill="#547392"
              fontSize="10"
              fontWeight="500"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {d.time}
            </text>
          ))}

          {/* Linear gradient for DO fill */}
          <defs>
            <linearGradient id="doAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#08B9E8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#08B9E8" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>

        {/* HOVER TOOLTIP */}
        {hoveredPoint && (
          <div
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-[#d6e8f7] rounded-xl p-2.5 shadow-md text-xs space-y-1 z-10 pointer-events-none"
          >
            <div className="font-bold text-[#12365F] border-b border-[#e2eef9] pb-0.5">
              Reading at {hoveredPoint.time}
            </div>
            <div className="font-mono text-[11px] space-y-0.5">
              <div className="text-[#0789F9]">DO: <strong>{hoveredPoint.doVal.toFixed(1)} mg/L</strong></div>
              <div className="text-[#F59E0B]">Temp: <strong>{hoveredPoint.temp.toFixed(1)}°C</strong></div>
              <div className="text-[#10B981]">pH: <strong>{hoveredPoint.ph.toFixed(1)}</strong></div>
              <div className="text-slate-600">Salinity: <strong>{hoveredPoint.sal.toFixed(1)} ppt</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
