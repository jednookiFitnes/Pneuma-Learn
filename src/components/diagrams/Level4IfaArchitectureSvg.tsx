import { useState } from 'react';
import type { ControlCategory } from '../../utils/safetyMath';

const CATEGORY_INFO: Record<
  ControlCategory,
  {
    name: string;
    maxPl: string;
    summary: string;
    faultBehavior: string;
  }
> = {
  B: {
    name: 'Kategoria B (Podstawowa)',
    maxPl: 'maks. PL b',
    summary: 'Pojedynczy kanał I → L → O bez sprawdzonych komponentów i bez diagnostyki.',
    faultBehavior: 'Pojedyncza usterka prowadzi do utraty funkcji bezpieczeństwa.',
  },
  '1': {
    name: 'Kategoria 1 (Sprawdzone komponenty)',
    maxPl: 'maks. PL c',
    summary: 'Pojedynczy kanał zbudowany ze sprawdzonych komponentów i zasad bezpieczeństwa (MTTFD ≥ 30 lat).',
    faultBehavior: 'Pojedynczy błąd może spowodować utratę funkcji, lecz prawdopodobieństwo jest niższe niż w Kat. B.',
  },
  '2': {
    name: 'Kategoria 2 (Testowana)',
    maxPl: 'maks. PL d',
    summary: 'Kanał funkcyjny I → L → O sprawdzany okresowo przez kanał testowy TE oraz OTE (≥ 100× częściej niż żądanie).',
    faultBehavior: 'Usterka między testami może spowodować tymczasową utratę funkcji do chwili kolejnego testu.',
  },
  '3': {
    name: 'Kategoria 3 (Dwukanałowa)',
    maxPl: 'maks. PL e',
    summary: 'Dwa niezależne tory I1-L1-O1 oraz I2-L2-O2 z monitorowaniem krzyżowym m (DCavg ≥ Niskie 60%).',
    faultBehavior: 'Pojedynczy błąd NIE powoduje utraty funkcji bezpieczeństwa; część usterek pozostaje wykrywana.',
  },
  '4': {
    name: 'Kategoria 4 (Najwyższa odporność)',
    maxPl: 'PL e',
    summary: 'Architektura dwukanałowa z ciągłą diagnostyką DCavg ≥ 99%, wysokim MTTFD (limit 2500 lat) i odpornością na kumulację błędów.',
    faultBehavior: 'Pojedynczy błąd wykrywany natychmiast przed kolejnym żądaniem; nawet kumulacja błędów nie znosi funkcji.',
  },
};

export function Level4IfaArchitectureSvg() {
  const [cat, setCat] = useState<ControlCategory>('3');
  const info = CATEGORY_INFO[cat];
  const isDual = cat === '3' || cat === '4';
  const isCat2 = cat === '2';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Architektury wyznaczone wg IFA Report 2/2017e (Łańcuch I–L–O)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Wybierz kategorię B, 1, 2, 3 lub 4, aby porównać strukturę kanałów i diagnostykę.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(['B', '1', '2', '3', '4'] as ControlCategory[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap shrink-0 ${
                cat === c
                  ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Kat. {c}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 640 165" className="h-auto w-full" role="img" aria-label={`Schemat blokowy kategorii ${cat}`}>
        <rect x="2" y="2" width="636" height="161" rx="8" className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800" />

        {/* Kanał 1 (lub jedyny) */}
        <g transform="translate(80, 26)">
          <rect x="0" y="0" width="110" height="44" rx="6" className="fill-white stroke-sky-600 dark:fill-slate-900 dark:stroke-sky-400" strokeWidth="1.8" />
          <text x="55" y="26" textAnchor="middle" className="fill-slate-900 font-mono text-xs font-bold dark:fill-slate-100">
            Wejście {isDual ? 'I1' : 'I'}
          </text>

          <line x1="110" y1="22" x2="180" y2="22" stroke="#0284c7" strokeWidth="2" />

          <rect x="180" y="0" width="110" height="44" rx="6" className="fill-white stroke-sky-600 dark:fill-slate-900 dark:stroke-sky-400" strokeWidth="1.8" />
          <text x="235" y="26" textAnchor="middle" className="fill-slate-900 font-mono text-xs font-bold dark:fill-slate-100">
            Logika {isDual ? 'L1' : 'L'}
          </text>

          <line x1="290" y1="22" x2="360" y2="22" stroke="#0284c7" strokeWidth="2" />

          <rect x="360" y="0" width="110" height="44" rx="6" className="fill-white stroke-sky-600 dark:fill-slate-900 dark:stroke-sky-400" strokeWidth="1.8" />
          <text x="415" y="26" textAnchor="middle" className="fill-slate-900 font-mono text-xs font-bold dark:fill-slate-100">
            Wyjście {isDual ? 'O1' : 'O'}
          </text>
        </g>

        {/* Kanał 2 dla Kat. 3 i 4 */}
        {isDual && (
          <g transform="translate(80, 96)">
            <rect x="0" y="0" width="110" height="44" rx="6" className="fill-white stroke-emerald-600 dark:fill-slate-900 dark:stroke-emerald-400" strokeWidth="1.8" />
            <text x="55" y="26" textAnchor="middle" className="fill-slate-900 font-mono text-xs font-bold dark:fill-slate-100">Wejście I2</text>

            <line x1="110" y1="22" x2="180" y2="22" stroke="#059669" strokeWidth="2" />

            <rect x="180" y="0" width="110" height="44" rx="6" className="fill-white stroke-emerald-600 dark:fill-slate-900 dark:stroke-emerald-400" strokeWidth="1.8" />
            <text x="235" y="26" textAnchor="middle" className="fill-slate-900 font-mono text-xs font-bold dark:fill-slate-100">Logika L2</text>

            <line x1="290" y1="22" x2="360" y2="22" stroke="#059669" strokeWidth="2" />

            <rect x="360" y="0" width="110" height="44" rx="6" className="fill-white stroke-emerald-600 dark:fill-slate-900 dark:stroke-emerald-400" strokeWidth="1.8" />
            <text x="415" y="26" textAnchor="middle" className="fill-slate-900 font-mono text-xs font-bold dark:fill-slate-100">Wyjście O2</text>

            {/* Monitorowanie krzyżowe m */}
            <line x1="55" y1="-26" x2="55" y2="0" stroke="#d97706" strokeDasharray="3 3" strokeWidth="1.8" />
            <line x1="235" y1="-26" x2="235" y2="0" stroke="#d97706" strokeDasharray="3 3" strokeWidth="1.8" />
            <line x1="415" y1="-26" x2="415" y2="0" stroke="#d97706" strokeDasharray="3 3" strokeWidth="1.8" />
            <text x="244" y="-9" className="fill-amber-700 font-mono text-[10px] font-bold dark:fill-amber-400">
              Monitorowanie m ({cat === '4' ? 'DCavg ≥ 99%' : 'DCavg ≥ 60%'})
            </text>
          </g>
        )}

        {/* Tor testujący TE / OTE dla Kat. 2 */}
        {isCat2 && (
          <g transform="translate(80, 96)">
            <rect x="180" y="0" width="110" height="42" rx="6" className="fill-amber-50 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-400" strokeWidth="1.6" />
            <text x="235" y="25" textAnchor="middle" className="fill-amber-900 font-mono text-xs font-bold dark:fill-amber-300">
              Test TE
            </text>
            <line x1="290" y1="21" x2="360" y2="21" stroke="#d97706" strokeDasharray="4 2" strokeWidth="1.8" />
            <rect x="360" y="0" width="110" height="42" rx="6" className="fill-amber-50 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-400" strokeWidth="1.6" />
            <text x="415" y="25" textAnchor="middle" className="fill-amber-900 font-mono text-xs font-bold dark:fill-amber-300">
              Wyjście OTE
            </text>
            <line x1="55" y1="-26" x2="180" y2="21" stroke="#d97706" strokeDasharray="3 3" strokeWidth="1.5" />
            <line x1="415" y1="-26" x2="290" y2="12" stroke="#d97706" strokeDasharray="3 3" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-950/60">
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {info.name} · <span className="font-mono text-sky-700 dark:text-sky-400">{info.maxPl}</span>
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{info.summary}</p>
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">Zachowanie przy usterce:</div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{info.faultBehavior}</p>
        </div>
      </div>
    </div>
  );
}
