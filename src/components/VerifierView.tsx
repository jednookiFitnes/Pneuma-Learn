import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  CCF_CRITERIA,
  calculateMttfdFromB10d,
  comparePerformanceLevels,
  evaluateAchievedPl,
  evaluateCcfScore,
  evaluateRiskGraph,
  symmetrizeChannelsMttfd,
  type ControlCategory,
  type DcLevel,
  type FrequencyParam,
  type PerformanceLevel,
  type PossibilityParam,
  type SeverityParam,
} from '../utils/safetyMath';
import { RiskGraphTreeSvg } from './diagrams/RiskGraphTreeSvg';

interface VerifierViewProps {
  onCompleteVerification: (passed: boolean) => void;
}

const PL_BARS: { pl: PerformanceLevel; label: string; pfhdRange: string; heightPct: number }[] = [
  { pl: 'a', label: 'PL a', pfhdRange: '≥ 10⁻⁵ do < 10⁻⁴ / h', heightPct: 28 },
  { pl: 'b', label: 'PL b', pfhdRange: '≥ 3·10⁻⁶ do < 10⁻⁵ / h', heightPct: 45 },
  { pl: 'c', label: 'PL c', pfhdRange: '≥ 10⁻⁶ do < 3·10⁻⁶ / h', heightPct: 62 },
  { pl: 'd', label: 'PL d', pfhdRange: '≥ 10⁻⁷ do < 10⁻⁶ / h', heightPct: 80 },
  { pl: 'e', label: 'PL e', pfhdRange: '≥ 10⁻⁸ do < 10⁻⁷ / h', heightPct: 98 },
];

export function VerifierView({ onCompleteVerification }: VerifierViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Etap 1: Graf ryzyka
  const [severity, setSeverity] = useState<SeverityParam>('S2');
  const [frequency, setFrequency] = useState<FrequencyParam>('F1');
  const [possibility, setPossibility] = useState<PossibilityParam>('P2');
  const [lowProbReduction, setLowProbReduction] = useState<boolean>(false);

  // Etap 2: MTTFD i T10D
  const [b10d, setB10d] = useState<number>(20_000_000);
  const [dOp, setDOp] = useState<number>(250);
  const [hOp, setHOp] = useState<number>(16);
  const [tCycleSec, setTCycleSec] = useState<number>(12);
  const [useSymmetrization, setUseSymmetrization] = useState<boolean>(false);
  const [c2MttfdInput, setC2MttfdInput] = useState<number>(45);

  // Etap 3: CCF 100 pkt
  const [checkedCcfIds, setCheckedCcfIds] = useState<string[]>([
    'separation',
    'diversity',
    'overpressure',
    'well_tried',
    'contamination_emc',
  ]);

  // Etap 4: Kategoria i DCavg
  const [category, setCategory] = useState<ControlCategory>('3');
  const [dcLevel, setDcLevel] = useState<DcLevel>('medium');

  const risk = evaluateRiskGraph({
    severity,
    frequency,
    possibility,
    lowProbabilityReduction: lowProbReduction,
  });

  const mttfdRes = calculateMttfdFromB10d({
    b10d,
    dOp,
    hOp,
    tCycleSec,
    category,
  });

  const effectiveMttfdYears = useSymmetrization
    ? symmetrizeChannelsMttfd(mttfdRes.cappedMttfdYears, c2MttfdInput, category)
    : mttfdRes.cappedMttfdYears;

  const effectiveMttfdBand =
    effectiveMttfdYears < 3
      ? 'below'
      : effectiveMttfdYears < 10
        ? 'low'
        : effectiveMttfdYears < 30
          ? 'medium'
          : 'high';

  const ccf = evaluateCcfScore(checkedCcfIds);

  const plResult = evaluateAchievedPl({
    category,
    dcLevel,
    mttfdBand: effectiveMttfdBand,
    ccfPassed: ccf.passed,
  });

  const meetsRequirement =
    plResult.achievedPl !== null &&
    comparePerformanceLevels(plResult.achievedPl, risk.finalPlr) >= 0;

  const toggleCcf = (id: string) => {
    setCheckedCcfIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const goToStep = (nextStep: 1 | 2 | 3 | 4) => {
    setStep(nextStep);
    if (nextStep === 4) {
      onCompleteVerification(meetsRequirement);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-50">
          Weryfikator Bezpieczeństwa (EN ISO 13849-1)
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Czteroetapowy kreator obliczeniowy opracowany na podstawie metodologii IFA Report 2/2017e (rozdz. 5–6) oraz Festo Guidelines.
        </p>
      </div>

      {/* Nawigacja kroków 1-4 */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          { num: 1, title: '1. Graf ryzyka (PLr)', val: `PLr = ${risk.finalPlr}` },
          {
            num: 2,
            title: '2. MTTFD i T10D',
            val: `${effectiveMttfdYears.toFixed(1)} lat`,
          },
          { num: 3, title: '3. Lista CCF (≥ 65)', val: `${ccf.score} / 100 pkt` },
          {
            num: 4,
            title: '4. Ocena PL ≥ PLr',
            val: plResult.achievedPl ? `PL ${plResult.achievedPl}` : 'Brak PL',
          },
        ].map((item) => {
          const isCurrent = step === item.num;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => goToStep(item.num as 1 | 2 | 3 | 4)}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isCurrent
                  ? 'border-sky-500 bg-sky-50/70 dark:border-sky-500 dark:bg-sky-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </span>
              <span className="mt-1 font-mono text-xs font-bold text-sky-700 tabular-nums dark:text-sky-400">
                {item.val}
              </span>
            </button>
          );
        })}
      </div>

      {/* Zawartość aktywnego etapu */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        {step === 1 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Etap 1: Wyznaczanie wymaganego poziomu PLr
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Wybierz parametry ciężkości urazu (S), częstości narażenia (F) oraz możliwości uniknięcia zagrożenia (P).
                </p>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  S — Ciężkość możliwego urazu
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    { id: 'S1', desc: 'S1: Lekki, zwykle odwracalny uraz (stłuczenie, drobne skaleczenie)' },
                    { id: 'S2', desc: 'S2: Ciężki, nieodwracalny uraz (amputacja, zgniecenie lub śmierć)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSeverity(opt.id as SeverityParam)}
                      className={`rounded-xl border p-3 text-left text-xs transition-colors ${
                        severity === opt.id
                          ? 'border-sky-500 bg-sky-50 text-sky-950 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-100'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-mono font-bold">{opt.id}</span> — {opt.desc.slice(4)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  F — Częstość i/lub czas narażenia na zagrożenie
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    { id: 'F1', desc: 'F1: Rzadko / krótko (≤ 1/15 min i < 1/20 czasu pracy)' },
                    { id: 'F2', desc: 'F2: Często lub ciągle (> 1/15 min lub długie przebywanie w strefie)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFrequency(opt.id as FrequencyParam)}
                      className={`rounded-xl border p-3 text-left text-xs transition-colors ${
                        frequency === opt.id
                          ? 'border-sky-500 bg-sky-50 text-sky-950 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-100'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-mono font-bold">{opt.id}</span> — {opt.desc.slice(4)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  P — Możliwość uniknięcia zagrożenia
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    { id: 'P1', desc: 'P1: Możliwa w określonych warunkach (niska prędkość, wolny ruch)' },
                    { id: 'P2', desc: 'P2: Prawie niemożliwa (szybki ruch siłownika lub brak czasu reakcji)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPossibility(opt.id as PossibilityParam)}
                      className={`rounded-xl border p-3 text-left text-xs transition-colors ${
                        possibility === opt.id
                          ? 'border-sky-500 bg-sky-50 text-sky-950 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-100'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-mono font-bold">{opt.id}</span> — {opt.desc.slice(4)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950">
                <input
                  type="checkbox"
                  checked={lowProbReduction}
                  onChange={(e) => setLowProbReduction(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-sky-600"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Zastosuj redukcję o 1 poziom dla skrajnie niskiego prawdopodobieństwa wystąpienia zdarzenia niebezpiecznego (Pilz Compendium / EN ISO 13849-1 Zał. A).
                </span>
              </label>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  Podświetlona ścieżka na drzewie decyzyjnym PLr
                </h3>
                <RiskGraphTreeSvg
                  severity={severity}
                  frequency={frequency}
                  possibility={possibility}
                />
              </div>

              <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-800 dark:bg-sky-950/40">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Ścieżka: <span className="font-mono font-semibold">{risk.pathLabel}</span>
                  {lowProbReduction && ` (redukcja z ${risk.basePlr})`}
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-sky-700 dark:text-sky-400">
                  Wymagany poziom PLr = {risk.finalPlr}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Etap 2: Kalkulator MTTFD oraz T10D dla pneumatyki
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Wpisz parametr trwałości B10D (dla pneumatyki dobra praktyka inżynierska to często 20 000 000 cykli) oraz profil pracy maszyny.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>B10D [cykle]</span>
                  <input
                    type="number"
                    min={10000}
                    step={100000}
                    value={b10d}
                    onChange={(e) => setB10d(Math.max(1000, Number(e.target.value)))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>Dni pracy w roku (dop)</span>
                  <input
                    type="number"
                    min={1}
                    max={366}
                    value={dOp}
                    onChange={(e) => setDOp(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>Godziny dziennie (hop)</span>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={hOp}
                    onChange={(e) => setHOp(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>Czas cyklu t_cycle [s]</span>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={tCycleSec}
                    onChange={(e) => setTCycleSec(Math.max(0.5, Number(e.target.value)))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
              </div>

              {/* Opcja symetryzacji dwóch kanałów */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <input
                    type="checkbox"
                    checked={useSymmetrization}
                    onChange={(e) => setUseSymmetrization(e.target.checked)}
                    className="h-4 w-4 accent-sky-600"
                  />
                  <span>Włącz symetryzację dwóch kanałów (MTTFD,C1 i MTTFD,C2)</span>
                </label>

                {useSymmetrization && (
                  <label className="mt-3 block text-xs text-slate-700 dark:text-slate-300">
                    <span>MTTFD kanału 2 (C2) [lata]</span>
                    <input
                      type="number"
                      min={1}
                      max={2500}
                      value={c2MttfdInput}
                      onChange={(e) => setC2MttfdInput(Math.max(1, Number(e.target.value)))}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                Wyniki obliczeń na żywo (IFA Report 2/2017e)
              </h3>

              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                  <dt className="text-slate-600 dark:text-slate-400">Roczna liczba cykli nop:</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums dark:text-slate-100">
                    {Math.round(mttfdRes.nOpPerYear).toLocaleString('pl-PL')} cykli/rok
                  </dd>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                  <dt className="text-slate-600 dark:text-slate-400">Czas T10D = B10D / nop:</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums dark:text-slate-100">
                    {mttfdRes.t10dYears.toFixed(2)} lat
                  </dd>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                  <dt className="text-slate-600 dark:text-slate-400">Surowe MTTFD kanału 1:</dt>
                  <dd className="font-mono font-semibold text-slate-800 tabular-nums dark:text-slate-200">
                    {mttfdRes.rawMttfdYears.toFixed(1)} lat (limit Kat. {category}: {mttfdRes.capLimitYears} lat)
                  </dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">
                    {useSymmetrization ? 'MTTFD po symetryzacji:' : 'Ograniczone MTTFD:'}
                  </dt>
                  <dd className="font-mono text-base font-bold text-sky-700 tabular-nums dark:text-sky-400">
                    {effectiveMttfdYears.toFixed(1)} lat ({effectiveMttfdBand === 'high' ? 'Wysokie' : effectiveMttfdBand === 'medium' ? 'Średnie' : effectiveMttfdBand === 'low' ? 'Niskie' : 'Poniżej 3 lat'})
                  </dd>
                </div>
              </dl>

              {mttfdRes.preventiveReplacementWarning && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <div>
                    <strong>Uwaga T10D &lt; 20 lat ({mttfdRes.t10dYears.toFixed(1)} lat):</strong>{' '}
                    Wymagana jest planowa wymiana prewencyjna zaworu przed upływem T10D w instrukcji konserwacji maszyny.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Etap 3: Lista kontrolna CCF (Załącznik F EN ISO 13849-1)
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Zaznacz wdrożone środki przeciw awariom wspólnej przyczyny (punktacja zero-jedynkowa, wymagane ≥ 65/100 pkt dla Kat. 2, 3, 4).
                </p>
              </div>
              <div
                className={`rounded-xl border px-4 py-2 font-mono text-sm font-bold tabular-nums ${
                  ccf.passed
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                Wynik CCF: {ccf.score} / 100 pkt ({ccf.passed ? 'Spełnione ≥ 65' : 'Niespełnione < 65'})
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {CCF_CRITERIA.map((item) => {
                const checked = checkedCcfIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                      checked
                        ? 'border-sky-400 bg-sky-50/50 dark:border-sky-600 dark:bg-sky-950/30'
                        : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCcf(item.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-sky-600"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between gap-2 font-semibold text-slate-900 dark:text-slate-100">
                        <span>{item.label}</span>
                        <span className="font-mono text-sky-700 tabular-nums dark:text-sky-400">
                          +{item.points} pkt
                        </span>
                      </div>
                      <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Etap 4: Wybór Kategorii, DCavg i raport końcowy
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Skonfiguruj kategorię architektury oraz średnie pokrycie diagnostyczne, aby wyznaczyć osiągnięty poziom PL.
                </p>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Kategoria architektury (EN ISO 13849-1)
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {(['B', '1', '2', '3', '4'] as ControlCategory[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`min-h-[40px] rounded-lg border px-4 py-2 font-mono text-xs font-bold ${
                        category === c
                          ? 'border-sky-600 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-500 dark:text-slate-950'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      Kat. {c}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Średnie pokrycie diagnostyczne (DCavg)
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'Brak (< 60%)' },
                    { id: 'low', label: 'Niskie (60–90%)' },
                    { id: 'medium', label: 'Średnie (90–99%)' },
                    { id: 'high', label: 'Wysokie (≥ 99%)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDcLevel(d.id as DcLevel)}
                      className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold ${
                        dcLevel === d.id
                          ? 'border-sky-600 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-950/60 dark:text-sky-100'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Werdykt PL >= PLr */}
              <div
                className={`rounded-xl border p-4 ${
                  meetsRequirement
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100'
                    : 'border-rose-300 bg-rose-50/70 text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {meetsRequirement ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  )}
                  <div>
                    <div className="font-display text-base font-bold">
                      {meetsRequirement
                        ? `Spełniono warunek: PL ${plResult.achievedPl} ≥ PLr ${risk.finalPlr}`
                        : `Niespełniony warunek: ${plResult.achievedPl ? `PL ${plResult.achievedPl}` : 'Brak PL'} < PLr ${risk.finalPlr}`}
                    </div>
                    <p className="mt-1 text-xs">
                      Kategoria {category} · MTTFD {effectiveMttfdYears.toFixed(1)} lat · CCF {ccf.score} pkt · DCavg {dcLevel === 'none' ? 'Brak' : dcLevel === 'low' ? 'Niskie' : dcLevel === 'medium' ? 'Średnie' : 'Wysokie'}
                    </p>
                    {plResult.reasons.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                        {plResult.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Wykres słupkowy PL wg EN ISO 13849-1 */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  Wykres słupkowy PL vs wymagane PLr (EN ISO 13849-1)
                </h3>
                <div className="mt-5 flex h-44 items-end justify-between gap-3 border-b border-slate-300 pb-2 dark:border-slate-700">
                  {PL_BARS.map((bar) => {
                    const isAchieved = plResult.achievedPl === bar.pl;
                    const isRequired = risk.finalPlr === bar.pl;
                    return (
                      <div key={bar.pl} className="flex flex-1 flex-col items-center justify-end h-full">
                        <div className="mb-1 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          {isAchieved ? 'Osiągnięty' : isRequired ? 'Cel PLr' : ''}
                        </div>
                        <div
                          style={{ height: `${bar.heightPct}%` }}
                          className={`w-full max-w-[54px] rounded-t-lg border transition-all ${
                            isAchieved
                              ? meetsRequirement
                                ? 'border-emerald-600 bg-emerald-500/85'
                                : 'border-rose-600 bg-rose-500/85'
                              : isRequired
                                ? 'border-sky-600 bg-sky-500/35'
                                : 'border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-800'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 grid grid-cols-5 gap-3 text-center font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {PL_BARS.map((bar) => (
                    <div key={bar.pl}>{bar.label}</div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span>
                  <strong>Klauzula edukacyjna:</strong> Obliczenia mają charakter wyłącznie szkoleniowy i nie obejmują pełnych wartości PFHD dla podsystemów elektronicznych. Projekt rzeczywistego układu wymaga weryfikacji w certyfikowanym narzędziu (np. <strong>IFA SISTEMA</strong> lub <strong>Pilz PAScal</strong>) oraz walidacji przez specjalistę.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Przyciski nawigacji między etapami */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => goToStep((step - 1) as 1 | 2 | 3 | 4)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Poprzedni etap</span>
          </button>

          {step < 4 && (
            <button
              type="button"
              onClick={() => goToStep((step + 1) as 1 | 2 | 3 | 4)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950"
            >
              <span>Następny etap</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
