import { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  GitCompare,
  Info,
  Play,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import {
  IFA_EXAMPLES,
  type IfaExampleId,
  type IfaSimState,
} from '../data/ifaExamples';
import { IfaBlockDiagramSvg, IfaCircuitSvg } from './IfaCircuitSvg';

export function IfaExamplesView() {
  const [selectedId, setSelectedId] = useState<IfaExampleId>('ifa_ex2');
  const [simState, setSimState] = useState<IfaSimState>('normal');

  const active =
    IFA_EXAMPLES.find((ex) => ex.id === selectedId) ?? IFA_EXAMPLES[0];
  const stateData = active.states[simState];

  const handleSelectExample = (id: IfaExampleId) => {
    setSelectedId(id);
    setSimState('normal');
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek modułu */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-50">
          Przykłady IFA 2/2017e — Układy Pneumatyczne (Rozdz. 8.2)
        </h1>
        <p className="mt-1 max-w-4xl text-sm text-slate-600 dark:text-slate-400">
          Kompletna analiza wszystkich 6 przykładów obwodów pneumatycznych z raportu{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            IFA Report 2/2017e (Functional safety of machine controls)
          </span>{' '}
          oraz uwag z rozdziału 8.1.2 <span className="italic">Fluid power controls</span>: schematy ISO 1219-1, diagramy blokowe SRP/CS, symulacja stanów i dokładne parametry obliczeniowe.
        </p>
      </div>

      {/* Wybór jednego z 6 przykładów IFA */}
      <div
        role="tablist"
        aria-label="Lista 6 przykładów pneumatycznych IFA Report 2/2017e"
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {IFA_EXAMPLES.map((ex) => {
          const isSelected = ex.id === selectedId;
          return (
            <button
              key={ex.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelectExample(ex.id)}
              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/70 dark:border-sky-400 dark:bg-sky-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                  Przykład {ex.exampleNumber} · {ex.sectionRef}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                  Kat. {ex.category} / PL {ex.pl}
                </span>
              </div>
              <span className="mt-1 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                {ex.polishTitle}
              </span>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {ex.pageRef} · {ex.safetyFunctionCode}
              </span>
            </button>
          );
        })}
      </div>

      {/* Główny obszar wybranego przykładu */}
      <div className="space-y-6">
        {/* Baner edycyjny dla Przykładu 26 (usunięty w edycji 2/2017e) */}
        {active.isHistoricalNote && active.historicalBanner && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
            <div>
              <div className="font-display text-sm font-bold">
                Nota źródłowa IFA Report 2/2017e (Rozdz. 8.2.26, str. 196)
              </div>
              <p className="mt-1">{active.historicalBanner}</p>
            </div>
          </div>
        )}

        {/* Wiersz 1: Interaktywny schemat ISO 1219-1 (lewo) + Schemat blokowy SRP/CS i status stanu (prawo) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Schemat ISO 1219-1 + przyciski stanów */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-mono text-xs font-semibold text-sky-700 dark:text-sky-400">
                  IFA Report 2/2017e · {active.sectionRef} ({active.pageRef})
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Przykład {active.exampleNumber}: {active.originalTitle}
                </h2>
              </div>
              <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                Funkcja: {active.safetyFunctionCode}
              </div>
            </div>

            {/* Przełącznik 3 stanów pracy */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setSimState('normal')}
                className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  simState === 'normal'
                    ? 'border-sky-600 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-500 dark:text-slate-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Play className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Stan normalny</span>
              </button>

              <button
                type="button"
                onClick={() => setSimState('safety_demand')}
                className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  simState === 'safety_demand'
                    ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Stan bezpieczny (SF)</span>
              </button>

              <button
                type="button"
                onClick={() => setSimState('single_fault')}
                className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  simState === 'single_fault'
                    ? 'border-rose-600 bg-rose-600 text-white dark:border-rose-500 dark:bg-rose-500 dark:text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Usterka pojedyncza</span>
              </button>
            </div>

            {/* Schemat ISO 1219-1 */}
            <IfaCircuitSvg exampleId={active.id} simState={simState} />

            {/* Komunikat na żywo dla wybranego stanu */}
            <div
              className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                stateData.severity === 'safe'
                  ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-100'
                  : stateData.severity === 'warning'
                    ? 'border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-800 dark:bg-amber-950/35 dark:text-amber-100'
                    : 'border-rose-300 bg-rose-50/80 text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {stateData.severity === 'safe' ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : stateData.severity === 'warning' ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                ) : (
                  <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                )}
                <div className="space-y-1">
                  <div className="font-mono font-bold">{stateData.statusBadge}</div>
                  <p>{stateData.summary}</p>
                  <p className="opacity-90">
                    <strong>Tor przepływu:</strong> {stateData.flowDetail}
                  </p>
                  <p className="opacity-90">
                    <strong>Diagnostyka:</strong> {stateData.faultDetection}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prawa kolumna: Schemat blokowy SRP/CS + Karta parametrów z IFA */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:col-span-5 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                Schemat blokowy SRP/CS (wg EN ISO 13849-1 / IFA)
              </h3>
              <div className="mt-2">
                <IfaBlockDiagramSvg exampleId={active.id} />
              </div>
            </div>

            {/* Karta parametrów obliczeniowych IFA */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                Karta parametrów IFA Report 2/2017e
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Kategoria / PL:</dt>
                  <dd className="font-mono font-bold text-sky-700 dark:text-sky-400">
                    Kategoria {active.category} / PL {active.pl}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">PFHD:</dt>
                  <dd className="text-right font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {active.parameters.pfhd}
                  </dd>
                </div>
                <div className="border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Dane niezawodności (B10D / MTTFD):</dt>
                  <dd className="mt-0.5 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    {active.parameters.b10d}
                  </dd>
                  <dd className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                    {active.parameters.cycleProfile}
                  </dd>
                </div>
                <div className="border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Wynikowe MTTFD i T10D:</dt>
                  <dd className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                    {active.parameters.mttfd}
                  </dd>
                  <dd className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-300">
                    T10D: {active.parameters.t10d}
                  </dd>
                </div>
                <div className="border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Pokrycie diagnostyczne (DCavg):</dt>
                  <dd className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                    {active.parameters.dcAvg}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    Ocena CCF (Zał. F):{' '}
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {active.parameters.ccfScore}
                    </span>
                  </dt>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-slate-600 dark:text-slate-400">
                    {active.parameters.ccfBreakdown.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Wiersz 2: Wyjaśnienie krok po kroku + Zasady podstawowe i sprawdzone + Dlaczego ta Kategoria? */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Szczegółowe wyjaśnienie działania prostym językiem inżynierskim */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                Wyjaśnienie zasady działania krok po kroku
              </h3>
            </div>

            <ol className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <li className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  1. Praca normalna i funkcja bezpieczeństwa
                </div>
                <p className="mt-1">{active.explanationSteps.normalOperation}</p>
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  2. Zachowanie przy żądaniu funkcji bezpieczeństwa (SF)
                </div>
                <p className="mt-1">{active.explanationSteps.onSafetyDemand}</p>
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  3. Reakcja na typową usterkę pojedynczą i diagnostyka (DC)
                </div>
                <p className="mt-1">{active.explanationSteps.onSingleFault}</p>
              </li>
            </ol>

            {/* Podstawowe i sprawdzone zasady bezpieczeństwa (EN ISO 13849-2 / Rozdz. 8.1.2) */}
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/40">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Zasady podstawowe (EN ISO 13849-2 Tab. B.1)
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-slate-600 dark:text-slate-400">
                  {active.principles.basic.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/40">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Zasady sprawdzone (EN ISO 13849-2 Tab. B.2)
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-slate-600 dark:text-slate-400">
                  {active.principles.wellTried.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Prawa kolumna: „Dlaczego ta Kategoria?” + „Weryfikacja przez specjalistę” */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900/70 dark:bg-sky-950/30">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                  Dlaczego ta Kategoria (Kat. {active.category} / PL {active.pl})?
                </h3>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {active.whyThisCategory.summary}
              </p>

              <div className="mt-3 space-y-2.5 text-xs">
                <div className="rounded-xl border border-sky-200/80 bg-white/80 p-3 dark:border-sky-900/60 dark:bg-slate-900/80">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Co odróżnia ten układ od niższej kategorii / PL?
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                    {active.whyThisCategory.vsLower}
                  </p>
                </div>
                <div className="rounded-xl border border-sky-200/80 bg-white/80 p-3 dark:border-sky-900/60 dark:bg-slate-900/80">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Czego brakuje do wyższej kategorii / PL?
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                    {active.whyThisCategory.vsHigher}
                  </p>
                </div>
              </div>
            </div>

            {/* Obowiązkowe ostrzeżenie: Weryfikacja przez specjalistę */}
            <div className="rounded-2xl border border-amber-300 bg-amber-50/75 p-5 text-xs leading-relaxed text-amber-950 dark:border-amber-800/80 dark:bg-amber-950/35 dark:text-amber-100">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-sm font-bold">
                    Weryfikacja przez specjalistę (Uwaga z Rozdz. 8.1.2 IFA)
                  </h3>
                  <p className="mt-1">{active.specialistWarning}</p>
                  <p className="mt-2 opacity-85">
                    Schematy w raporcie IFA są poglądowymi podsystemami bez pełnego osprzętu roboczego i zabezpieczeń elektrycznych — każde wdrożenie przemysłowe wymaga kompletnej oceny ryzyka (EN ISO 12100), obliczeń w SISTEMA/PAScal oraz walidacji wg EN ISO 13849-2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
