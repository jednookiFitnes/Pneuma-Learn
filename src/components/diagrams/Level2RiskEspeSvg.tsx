import { useState } from 'react';
import {
  calculateEspeDistance,
  evaluateRiskGraph,
  type FrequencyParam,
  type PossibilityParam,
  type SeverityParam,
} from '../../utils/safetyMath';
import { RiskGraphTreeSvg } from './RiskGraphTreeSvg';

export function Level2RiskEspeSvg() {
  const [severity, setSeverity] = useState<SeverityParam>('S2');
  const [frequency, setFrequency] = useState<FrequencyParam>('F1');
  const [possibility, setPossibility] = useState<PossibilityParam>('P2');

  const [resolutionMm, setResolutionMm] = useState<number>(24);
  const [stopTimeMs, setStopTimeMs] = useState<number>(150);

  const risk = evaluateRiskGraph({ severity, frequency, possibility });
  const espe = calculateEspeDistance({
    mode: resolutionMm > 40 ? 'body_coarse' : 'hand_fine',
    resolutionMm,
    stoppingTimeMs: stopTimeMs,
  });

  const barScale = Math.min(260, Math.max(40, (espe.finalSMm / 1500) * 240));

  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">
      {/* Graf ryzyka EN ISO 13849-1 */}
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
          Interaktywny graf ryzyka (EN ISO 13849-1)
        </h4>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
          Kliknij S, F, P, aby wyznaczyć wymagany poziom PLr.
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['S1', 'S2'] as SeverityParam[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverity(s)}
                className={`rounded-md px-2.5 py-1 font-mono font-semibold ${
                  severity === s
                    ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['F1', 'F2'] as FrequencyParam[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`rounded-md px-2.5 py-1 font-mono font-semibold ${
                  frequency === f
                    ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['P1', 'P2'] as PossibilityParam[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPossibility(p)}
                className={`rounded-md px-2.5 py-1 font-mono font-semibold ${
                  possibility === p
                    ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <RiskGraphTreeSvg
          severity={severity}
          frequency={frequency}
          possibility={possibility}
          compact
        />

        <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/60">
          <span className="text-slate-600 dark:text-slate-400">Ścieżka: {risk.pathLabel}</span>
          <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
            Wymagane PLr = {risk.finalPlr}
          </span>
        </div>
      </div>

      {/* Odległość bezpieczeństwa ESPE EN ISO 13855 */}
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
          Odległość bezpieczeństwa kurtyny ESPE (EN ISO 13855)
        </h4>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
          Dostosuj rozdzielczość <span className="font-mono">d</span> oraz czas zatrzymania <span className="font-mono">T = t1 + t2</span>.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-xs text-slate-700 dark:text-slate-300">
            <span className="flex justify-between font-medium">
              <span>Rozdzielczość d</span>
              <span className="font-mono font-semibold tabular-nums">{resolutionMm} mm</span>
            </span>
            <input
              type="range"
              min={14}
              max={70}
              step={2}
              value={resolutionMm}
              onChange={(e) => setResolutionMm(Number(e.target.value))}
              className="mt-1.5 w-full accent-sky-600"
            />
          </label>

          <label className="block text-xs text-slate-700 dark:text-slate-300">
            <span className="flex justify-between font-medium">
              <span>Czas zatrzymania T</span>
              <span className="font-mono font-semibold tabular-nums">{stopTimeMs} ms</span>
            </span>
            <input
              type="range"
              min={40}
              max={600}
              step={10}
              value={stopTimeMs}
              onChange={(e) => setStopTimeMs(Number(e.target.value))}
              className="mt-1.5 w-full accent-sky-600"
            />
          </label>
        </div>

        <svg
          viewBox="0 0 380 120"
          className="mt-3 h-auto w-full"
          role="img"
          aria-label="Wizualizacja minimalnej odległości bezpieczeństwa S między kurtyną a strefą zagrożenia"
        >
          <rect x="2" y="2" width="376" height="116" rx="8" className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800" />
          {/* Kurtyna świetlna */}
          <rect x="34" y="22" width="12" height="68" rx="2" fill="#0284c7" />
          <line x1="40" y1="22" x2="40" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="40" y="106" textAnchor="middle" className="fill-slate-600 text-[9px] dark:fill-slate-400">ESPE</text>

          {/* Strefa niebezpieczna */}
          <rect x={46 + barScale} y="24" width="52" height="64" rx="4" fill="#dc2626" opacity="0.2" stroke="#dc2626" strokeWidth="1.5" />
          <text x={72 + barScale} y="60" textAnchor="middle" className="fill-rose-700 text-[9px] font-bold dark:fill-rose-400">Strefa</text>

          {/* Wymiar S */}
          <line x1="48" y1="56" x2={44 + barScale} y2="56" stroke="#0f172a" className="dark:stroke-slate-200" strokeWidth="1.5" />
          <text x={46 + barScale / 2} y="46" textAnchor="middle" className="fill-slate-900 font-mono text-[11px] font-bold tabular-nums dark:fill-slate-100">
            S = {espe.finalSMm} mm
          </text>
        </svg>

        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700 tabular-nums dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          {espe.formulaText} = <strong>{espe.finalSMm} mm</strong> (K = {espe.kMmPerSec} mm/s, C = {espe.cMm} mm)
        </div>
      </div>
    </div>
  );
}
