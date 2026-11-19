import { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Play,
  PowerOff,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import {
  CIRCUIT_TEMPLATES,
  simulateCircuit,
  type CircuitTemplateId,
  type SimulationMode,
} from '../utils/simulatorEngine';
import { SimulatorSchematicSvg } from './SimulatorSchematicSvg';

interface SimulatorViewProps {
  onExploreFault: () => void;
}

export function SimulatorView({ onExploreFault }: SimulatorViewProps) {
  const [templateId, setTemplateId] = useState<CircuitTemplateId>('ms6_sv_exhaust');
  const [mode, setMode] = useState<SimulationMode>('normal');
  const [mechLockEnabled, setMechLockEnabled] = useState<boolean>(true);

  const activeTemplate =
    CIRCUIT_TEMPLATES.find((t) => t.id === templateId) ?? CIRCUIT_TEMPLATES[0];
  const sim = simulateCircuit(templateId, mode, mechLockEnabled);

  const handleModeChange = (nextMode: SimulationMode) => {
    setMode(nextMode);
    if (nextMode === 'single_fault') {
      onExploreFault();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-50">
          Symulator Układów Pneumatycznych Safety
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Wybierz gotowy szablon obwodu z dokumentacji Festo i IFA Report 2/2017e, a następnie przetestuj stany pracy oraz pojedyncze usterki.
        </p>
      </div>

      {/* Wybór jednego z 4 szablonów */}
      <div
        role="tablist"
        aria-label="Szablony obwodów pneumatycznych Safety"
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CIRCUIT_TEMPLATES.map((tpl) => {
          const isSelected = tpl.id === templateId;
          return (
            <button
              key={tpl.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setTemplateId(tpl.id)}
              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/70 dark:border-sky-500 dark:bg-sky-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <span className="font-mono text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                {tpl.categoryTarget}
              </span>
              <span className="mt-1 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                {tpl.shortTitle}
              </span>
              <span className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                {tpl.standardRef}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dwustrefowy układ symulatora: Scena SVG (lewo) + Panel sterowania i analizy (prawo) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Lewa strefa: Interaktywna wizualizacja SVG */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                {activeTemplate.title}
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {activeTemplate.summary}
              </p>
            </div>

            {activeTemplate.supportsMechLock && (
              <button
                type="button"
                onClick={() => setMechLockEnabled((v) => !v)}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  mechLockEnabled
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                }`}
              >
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {mechLockEnabled ? 'Blokada DNCKE: Aktywna' : 'Blokada DNCKE: Brak'}
                </span>
              </button>
            )}
          </div>

          {/* Przyciski trybów pracy */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => handleModeChange('normal')}
              className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                mode === 'normal'
                  ? 'border-sky-600 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-500 dark:text-slate-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Play className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Praca normalna</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('safety_demand')}
              className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                mode === 'safety_demand'
                  ? 'border-rose-600 bg-rose-600 text-white dark:border-rose-500 dark:bg-rose-500 dark:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <AlertOctagon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Żądanie Safety</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('power_loss')}
              className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                mode === 'power_loss'
                  ? 'border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <PowerOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Zanik 24V DC</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('single_fault')}
              className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                mode === 'single_fault'
                  ? 'border-purple-600 bg-purple-600 text-white dark:border-purple-500 dark:bg-purple-500 dark:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Pojedyncza usterka</span>
            </button>
          </div>

          {/* Dynamiczny schemat ISO 1219-1 */}
          <SimulatorSchematicSvg
            templateId={templateId}
            mode={mode}
            mechLockEnabled={mechLockEnabled}
            sim={sim}
            title={activeTemplate.title}
          />
        </div>

        {/* Prawa strefa: Panel analizy inżynierskiej */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4">
            {/* Status bezpieczeństwa z ikoną i tekstem (bez samego koloru) */}
            <div
              className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                sim.safetySeverity === 'safe'
                  ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100'
                  : sim.safetySeverity === 'warning'
                    ? 'border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100'
                    : 'border-rose-300 bg-rose-50/80 text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100'
              }`}
            >
              {sim.safetySeverity === 'safe' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : sim.safetySeverity === 'warning' ? (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              ) : (
                <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              )}
              <div>
                <div className="font-mono text-xs font-bold">{sim.safetyStatusLabel}</div>
                <div className="mt-1 text-xs leading-relaxed">{sim.cylinderPositionLabel}</div>
              </div>
            </div>

            {/* Stan komór i zaworów */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                Panel analizy inżynierskiej — Stan komór i kanałów
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Komora A (wysuw):</dt>
                  <dd className="font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {sim.chamberAState}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Komora B (powrót):</dt>
                  <dd className="font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {sim.chamberBState}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200 pb-1.5 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Element 1:</dt>
                  <dd className="text-right font-medium text-slate-800 dark:text-slate-200">{sim.valve1Label}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">Element 2:</dt>
                  <dd className="text-right font-medium text-slate-800 dark:text-slate-200">{sim.valve2Label}</dd>
                </div>
              </dl>
            </div>

            {/* Wyjaśnienie przepływu i diagnostyki */}
            <div className="space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-slate-100">Przepływ powietrza:</strong>{' '}
                {sim.flowExplanation}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-100">Diagnostyka:</strong>{' '}
                {sim.diagnosticMessage}
              </p>
            </div>

            {/* Zagrożenie energią resztkową */}
            <div
              className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                sim.residualEnergyRisk === 'high'
                  ? 'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-200'
                  : sim.residualEnergyRisk === 'low'
                    ? 'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300'
              }`}
            >
              <strong className="font-semibold">
                Energia resztkowa / pułapki powietrzne:
              </strong>{' '}
              {sim.residualEnergyWarning}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>
                Symulator prezentuje zachowanie poglądowe. Przed wdrożeniem na maszynie rzeczywisty układ musi przejść walidację (testy usterek i pomiary czasu zatrzymania) przez kompetentnego specjalistę ds. bezpieczeństwa.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
