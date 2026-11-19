import { useState } from 'react';

type SafetyConceptTab = 'vertical_trap' | 'ossd_pulses';

export function Level3FestoSafetySvg() {
  const [tab, setTab] = useState<SafetyConceptTab>('vertical_trap');
  const [useBrake, setUseBrake] = useState(true);
  const [pulseWidthMs, setPulseWidthMs] = useState(0.5);

  const pulseRisky = pulseWidthMs >= 0.4;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Interaktywne zjawiska Safety w pneumatyce (Festo Guidelines)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Porównaj pułapkę powietrzną z hamulcem DNCKE-S lub przetestuj wpływ impulsów testujących OSSD na cewkę zaworu.
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setTab('vertical_trap')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
              tab === 'vertical_trap'
                ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Oś pionowa (HGL + DNCKE)
          </button>
          <button
            type="button"
            onClick={() => setTab('ossd_pulses')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
              tab === 'ossd_pulses'
                ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Impulsy testowe OSSD
          </button>
        </div>
      </div>

      {tab === 'vertical_trap' ? (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-700 dark:text-slate-300">
              Symulacja awarii ciśnienia po zatrzymaniu osi zaworami HGL:
            </span>
            <button
              type="button"
              onClick={() => setUseBrake((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                useBrake
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
              }`}
            >
              {useBrake ? 'Hamulec DNCKE-S: WŁĄCZONY' : 'Hamulec DNCKE-S: WYŁĄCZONY'}
            </button>
          </div>

          <svg viewBox="0 0 640 190" className="h-auto w-full" role="img" aria-label="Schemat osi pionowej z zaworami HGL i hamulcem DNCKE">
            <rect x="2" y="2" width="636" height="186" rx="8" className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800" />
            {/* Zawory HGL */}
            <rect x="70" y="68" width="90" height="54" rx="4" className="fill-white stroke-amber-500 dark:fill-slate-900" strokeWidth="1.5" />
            <text x="115" y="92" textAnchor="middle" className="fill-slate-800 font-mono text-[11px] font-bold dark:fill-slate-100">2x HGL</text>
            <text x="115" y="108" textAnchor="middle" className="fill-amber-700 text-[9px] dark:fill-amber-400">Uwięzione ~5 bar</text>

            {/* Przewody z pułapką */}
            <line x1="160" y1="80" x2="290" y2="80" stroke="#d97706" strokeWidth="3" />
            <line x1="160" y1="110" x2="290" y2="110" stroke="#d97706" strokeWidth="3" />

            {/* Cylinder pionowy (przedstawiony poziomo/skośnie dla przejrzystości lub pionowo) */}
            <rect x="290" y="28" width="64" height="106" rx="4" className="fill-white stroke-slate-700 dark:fill-slate-900 dark:stroke-slate-300" strokeWidth="1.8" />
            <rect x="292" y={useBrake ? 78 : 108} width="60" height="10" className="fill-slate-700 dark:fill-slate-200" />
            {/* Tłoczysko w dół */}
            <rect x="317" y={useBrake ? 88 : 118} width="10" height="52" className="fill-slate-500" />
            {/* Hamulec DNCKE */}
            <rect
              x="306"
              y="134"
              width="32"
              height="18"
              rx="2"
              fill={useBrake ? '#059669' : '#e2e8f0'}
              stroke={useBrake ? '#047857' : '#94a3b8'}
            />
            <text x="322" y="146" textAnchor="middle" className={`font-mono text-[8px] font-bold ${useBrake ? 'fill-white' : 'fill-slate-600'}`}>
              DNCKE
            </text>
            {/* Ładunek grawitacyjny */}
            <rect x="296" y={useBrake ? 140 : 162} width="52" height="22" rx="3" fill={useBrake ? '#0284c7' : '#dc2626'} opacity="0.85" />
            <text x="322" y={useBrake ? 155 : 177} textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
              Masa g ↓
            </text>

            {/* Komentarz po prawej */}
            <text x="390" y="62" className="fill-slate-900 text-xs font-semibold dark:fill-slate-100">
              {useBrake ? 'Bezpieczne zatrzymanie osi pionowej' : 'Ryzyko opadnięcia ładunku przy przecieku!'}
            </text>
            <text x="390" y="84" className="fill-slate-600 text-[11px] dark:fill-slate-400">
              • Pułapka powietrzna: w przewodach zostaje energia resztkowa.
            </text>
            <text x="390" y="104" className="fill-slate-600 text-[11px] dark:fill-slate-400">
              • Sam HGL bez DNCKE-S nie gwarantuje Kat. 3/4 przy sile grawitacji.
            </text>
            <text x="390" y="124" className="fill-slate-600 text-[11px] dark:fill-slate-400">
              • Uwaga: wkładka KP służy tylko do trzymania po postoju, nie do hamowania!
            </text>
          </svg>
        </div>
      ) : (
        <div>
          <label className="mb-3 block text-xs text-slate-700 dark:text-slate-300">
            <span className="flex justify-between font-medium">
              <span>Szerokość impulsu testującego OSSD (t_test)</span>
              <span className="font-mono font-bold tabular-nums">{pulseWidthMs.toFixed(1)} ms</span>
            </span>
            <input
              type="range"
              min={0.1}
              max={4.0}
              step={0.1}
              value={pulseWidthMs}
              onChange={(e) => setPulseWidthMs(Number(e.target.value))}
              className="mt-1.5 w-full accent-sky-600"
            />
          </label>

          <svg viewBox="0 0 640 140" className="h-auto w-full" role="img" aria-label="Przebieg sygnału 24V DC z impulsem testowym OSSD">
            <rect x="2" y="2" width="636" height="136" rx="8" className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800" />
            <text x="20" y="26" className="fill-slate-600 font-mono text-[10px] dark:fill-slate-400">24V DC (OSSD)</text>
            <polyline
              points={`20,42 180,42 180,96 ${180 + pulseWidthMs * 24},96 ${180 + pulseWidthMs * 24},42 420,42`}
              fill="none"
              stroke={pulseRisky ? '#dc2626' : '#0284c7'}
              strokeWidth="2.5"
            />
            <text x="185" y="114" className="fill-slate-700 font-mono text-[10px] tabular-nums dark:fill-slate-300">
              t_test = {pulseWidthMs.toFixed(1)} ms
            </text>
            <text x="440" y="64" className={`text-xs font-semibold ${pulseRisky ? 'fill-rose-600 dark:fill-rose-400' : 'fill-amber-700 dark:fill-amber-400'}`}>
              {pulseRisky ? 'Ryzyko ruchu kotwicy / brzęczenia!' : 'Spadek siły trzymania elektromagnesu'}
            </text>
            <text x="440" y="84" className="fill-slate-600 text-[10px] dark:fill-slate-400">
              Od 0,1 ms: mniejsza siła trzymania; od 0,4 ms: ruch rdzenia.
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
