export type SeverityParam = 'S1' | 'S2';
export type FrequencyParam = 'F1' | 'F2';
export type PossibilityParam = 'P1' | 'P2';
export type PerformanceLevel = 'a' | 'b' | 'c' | 'd' | 'e';
export type ControlCategory = 'B' | '1' | '2' | '3' | '4';
export type DcLevel = 'none' | 'low' | 'medium' | 'high';
export type MttfdBand = 'below' | 'low' | 'medium' | 'high';

export interface RiskGraphInput {
  severity: SeverityParam;
  frequency: FrequencyParam;
  possibility: PossibilityParam;
  lowProbabilityReduction?: boolean;
}

export interface RiskGraphResult {
  basePlr: PerformanceLevel;
  finalPlr: PerformanceLevel;
  pathLabel: string;
}

const PL_ORDER: PerformanceLevel[] = ['a', 'b', 'c', 'd', 'e'];

export function comparePerformanceLevels(a: PerformanceLevel, b: PerformanceLevel): number {
  return PL_ORDER.indexOf(a) - PL_ORDER.indexOf(b);
}

/**
 * Wyznacza wymagany poziom zapewnienia bezpieczeństwa PLr wg EN ISO 13849-1 (Rys. A.1 / Pilz Compendium).
 */
export function evaluateRiskGraph(input: RiskGraphInput): RiskGraphResult {
  const { severity, frequency, possibility, lowProbabilityReduction = false } = input;
  let basePlr: PerformanceLevel;

  if (severity === 'S1') {
    if (frequency === 'F1') {
      basePlr = possibility === 'P1' ? 'a' : 'b';
    } else {
      basePlr = possibility === 'P1' ? 'b' : 'c';
    }
  } else {
    if (frequency === 'F1') {
      basePlr = possibility === 'P1' ? 'c' : 'd';
    } else {
      basePlr = possibility === 'P1' ? 'd' : 'e';
    }
  }

  let finalPlr = basePlr;
  if (lowProbabilityReduction) {
    const idx = PL_ORDER.indexOf(basePlr);
    if (idx > 0) {
      finalPlr = PL_ORDER[idx - 1];
    }
  }

  return {
    basePlr,
    finalPlr,
    pathLabel: `${severity} → ${frequency} → ${possibility}`,
  };
}

export interface EspeDistanceInput {
  mode: 'hand_fine' | 'body_coarse' | 'single_beam' | 'two_hand';
  resolutionMm: number; // d [mm]
  stoppingTimeMs: number; // t1 + t2 [ms]
}

export interface EspeDistanceResult {
  kMmPerSec: number;
  cMm: number;
  tSec: number;
  rawSMm: number;
  finalSMm: number;
  minSMm: number;
  formulaText: string;
}

/**
 * Oblicza minimalną odległość bezpieczeństwa S = K * T + C wg EN ISO 13855 (Pilz Compendium).
 */
export function calculateEspeDistance(input: EspeDistanceInput): EspeDistanceResult {
  const tSec = Math.max(0, input.stoppingTimeMs) / 1000;

  if (input.mode === 'two_hand') {
    const k = 1600;
    const c = 250;
    const raw = k * tSec + c;
    return {
      kMmPerSec: k,
      cMm: c,
      tSec,
      rawSMm: Math.round(raw),
      finalSMm: Math.max(100, Math.round(raw)),
      minSMm: 100,
      formulaText: `S = 1600 × ${tSec.toFixed(3)} + 250`,
    };
  }

  if (input.mode === 'single_beam') {
    const k = 1600;
    const c = 1200;
    const raw = k * tSec + c;
    return {
      kMmPerSec: k,
      cMm: c,
      tSec,
      rawSMm: Math.round(raw),
      finalSMm: Math.round(raw),
      minSMm: 1200,
      formulaText: `S = 1600 × ${tSec.toFixed(3)} + 1200`,
    };
  }

  if (input.mode === 'body_coarse' || input.resolutionMm > 40) {
    const k = 1600;
    const c = 850;
    const raw = k * tSec + c;
    return {
      kMmPerSec: k,
      cMm: c,
      tSec,
      rawSMm: Math.round(raw),
      finalSMm: Math.max(850, Math.round(raw)),
      minSMm: 850,
      formulaText: `S = 1600 × ${tSec.toFixed(3)} + 850`,
    };
  }

  // hand_fine: d <= 40 mm
  const d = Math.max(14, Math.min(40, input.resolutionMm));
  const c = 8 * (d - 14);
  const raw2000 = 2000 * tSec + c;

  // EN ISO 13855: jeśli S > 500 mm przy K=2000, można przeliczyć z K=1600 (min 500 mm)
  if (raw2000 > 500) {
    const raw1600 = Math.max(500, 1600 * tSec + c);
    return {
      kMmPerSec: 1600,
      cMm: c,
      tSec,
      rawSMm: Math.round(raw1600),
      finalSMm: Math.round(raw1600),
      minSMm: 500,
      formulaText: `S = 1600 × ${tSec.toFixed(3)} + ${c} (przeliczenie dla S > 500 mm)`,
    };
  }

  return {
    kMmPerSec: 2000,
    cMm: c,
    tSec,
    rawSMm: Math.round(raw2000),
    finalSMm: Math.max(100, Math.round(raw2000)),
    minSMm: 100,
    formulaText: `S = 2000 × ${tSec.toFixed(3)} + ${c}`,
  };
}

export interface MttfdSingleInput {
  b10d: number;
  dOp: number;
  hOp: number;
  tCycleSec: number;
  category: ControlCategory;
}

export interface MttfdSingleResult {
  nOpPerYear: number;
  t10dYears: number;
  rawMttfdYears: number;
  cappedMttfdYears: number;
  capLimitYears: number;
  preventiveReplacementWarning: boolean;
  band: MttfdBand;
}

export function classifyMttfdBand(years: number): MttfdBand {
  if (years < 3) return 'below';
  if (years < 10) return 'low';
  if (years < 30) return 'medium';
  return 'high';
}

/**
 * Oblicza nop, T10D oraz MTTFD dla komponentu elektromechanicznego/pneumatycznego wg IFA Report 2/2017e.
 */
export function calculateMttfdFromB10d(input: MttfdSingleInput): MttfdSingleResult {
  const safeTCycle = Math.max(0.1, input.tCycleSec);
  const safeDOp = Math.max(1, input.dOp);
  const safeHOp = Math.max(0.1, input.hOp);
  const safeB10d = Math.max(1, input.b10d);

  const nOpPerYear = (safeDOp * safeHOp * 3600) / safeTCycle;
  const t10dYears = safeB10d / nOpPerYear;
  const rawMttfdYears = safeB10d / (0.1 * nOpPerYear);
  const capLimitYears = input.category === '4' ? 2500 : 100;
  const cappedMttfdYears = Math.min(rawMttfdYears, capLimitYears);

  return {
    nOpPerYear,
    t10dYears,
    rawMttfdYears,
    cappedMttfdYears,
    capLimitYears,
    preventiveReplacementWarning: t10dYears < 20,
    band: classifyMttfdBand(cappedMttfdYears),
  };
}

/**
 * Symetryzacja MTTFD dwóch kanałów wg EN ISO 13849-1 Zał. D / IFA Report 2/2017e.
 */
export function symmetrizeChannelsMttfd(
  mttfdC1: number,
  mttfdC2: number,
  category: ControlCategory
): number {
  const cap = category === '4' ? 2500 : 100;
  const c1 = Math.min(Math.max(0.1, mttfdC1), cap);
  const c2 = Math.min(Math.max(0.1, mttfdC2), cap);
  const harmonicHalf = 1 / (1 / c1 + 1 / c2);
  const result = (2 / 3) * (c1 + c2 - harmonicHalf);
  return Math.min(result, cap);
}

/**
 * Sumowanie szeregowe bloków w jednym kanale: 1/MTTFD = sum(1/MTTFDi).
 */
export function combineSeriesMttfd(values: number[], category: ControlCategory): number {
  const valid = values.filter((v) => Number.isFinite(v) && v > 0);
  if (valid.length === 0) return 0;
  const invSum = valid.reduce((acc, v) => acc + 1 / v, 0);
  const cap = category === '4' ? 2500 : 100;
  return Math.min(1 / invSum, cap);
}

export interface DcComponentInput {
  mttfdYears: number;
  dcPercent: number;
}

export function classifyDcLevel(dcPercent: number): DcLevel {
  if (dcPercent < 60) return 'none';
  if (dcPercent < 90) return 'low';
  if (dcPercent < 99) return 'medium';
  return 'high';
}

export function calculateDcAvg(components: DcComponentInput[]): {
  dcAvgPercent: number;
  level: DcLevel;
} {
  const valid = components.filter((c) => c.mttfdYears > 0);
  if (valid.length === 0) {
    return { dcAvgPercent: 0, level: 'none' };
  }
  let numerator = 0;
  let denominator = 0;
  for (const item of valid) {
    const inv = 1 / item.mttfdYears;
    numerator += item.dcPercent * inv;
    denominator += inv;
  }
  const dcAvgPercent = denominator > 0 ? numerator / denominator : 0;
  return {
    dcAvgPercent,
    level: classifyDcLevel(dcAvgPercent),
  };
}

export interface CcfCriterion {
  id: string;
  label: string;
  description: string;
  points: number;
}

export const CCF_CRITERIA: CcfCriterion[] = [
  {
    id: 'separation',
    label: 'Separacja fizyczna przewodów i torów sygnałowych',
    description: 'Oddzielne wiązki elektryczne i przewody pneumatyczne dla kanału 1 i kanału 2, minimalizujące ryzyko jednoczesnego uszkodzenia mechanicznego.',
    points: 15,
  },
  {
    id: 'diversity',
    label: 'Różnorodność (dywersyfikacja) technologii lub konstrukcji',
    description: 'Zastosowanie różnych zasad działania, różnych producentów lub odmiennej logiki między kanałami (np. zawór główny + czujnik ciśnienia/położenia).',
    points: 20,
  },
  {
    id: 'overpressure',
    label: 'Ochrona przed nadciśnieniem, przepięciem i przeciążeniem',
    description: 'Zabezpieczenia przed przekroczeniem ciśnienia roboczego (zawory redukcyjne/bezpieczeństwa), diody/warystory na cewkach 24V DC, bezpieczniki.',
    points: 15,
  },
  {
    id: 'well_tried',
    label: 'Stosowanie sprawdzonych komponentów (Well-tried)',
    description: 'Dobór zaworów, przekaźników i czujników spełniających wymagania sprawdzonych zasad i komponentów wg EN ISO 13849-2 (Zał. B i D).',
    points: 5,
  },
  {
    id: 'fmea',
    label: 'Analiza FMEA podczas projektowania',
    description: 'Przeprowadzona i udokumentowana analiza rodzajów i skutków możliwych błędów dla wykluczenia lub wykrycia usterek wspólnej przyczyny.',
    points: 5,
  },
  {
    id: 'training',
    label: 'Kompetencje projektanta i szkolenie personelu utrzymania ruchu',
    description: 'Personel projektujący i serwisujący posiada udokumentowaną wiedzę nt. przyczyn i zapobiegania awariom wspólnym w pneumatyce.',
    points: 5,
  },
  {
    id: 'contamination_emc',
    label: 'Czystość sprężonego powietrza (filtracja FRL) oraz odporność EMC',
    description: 'Zastosowanie odpowiedniej klasy czystości powietrza (ISO 8573-1, filtracja min. 5–40 µm, osuszanie) i ekranowanie przed zakłóceniami elektromagnetycznymi.',
    points: 25,
  },
  {
    id: 'environment',
    label: 'Odporność na czynniki środowiskowe (temperatura, wstrząsy, wibracje)',
    description: 'Komponenty dobrane i zamontowane z zapasem względem temperatury otoczenia, wilgotności, drgań i agresywnych mediów.',
    points: 10,
  },
];

export function evaluateCcfScore(checkedIds: string[]): {
  score: number;
  maxScore: number;
  passed: boolean;
} {
  const checkedSet = new Set(checkedIds);
  const score = CCF_CRITERIA.reduce(
    (sum, item) => (checkedSet.has(item.id) ? sum + item.points : sum),
    0
  );
  return {
    score,
    maxScore: 100,
    passed: score >= 65,
  };
}

export interface PlEvaluationInput {
  category: ControlCategory;
  dcLevel: DcLevel;
  mttfdBand: MttfdBand;
  ccfPassed: boolean;
}

export interface PlEvaluationResult {
  achievedPl: PerformanceLevel | null;
  compliantArchitecture: boolean;
  reasons: string[];
}

/**
 * Wyznacza osiągnięty poziom PL na podstawie EN ISO 13849-1 Rys. 5 / Tabela 7 (IFA Report 2/2017e).
 */
export function evaluateAchievedPl(input: PlEvaluationInput): PlEvaluationResult {
  const { category, dcLevel, mttfdBand, ccfPassed } = input;
  const reasons: string[] = [];

  if (mttfdBand === 'below') {
    reasons.push('MTTFD kanału wynosi poniżej 3 lat — nie spełnia minimalnych wymagań normy EN ISO 13849-1.');
    return { achievedPl: null, compliantArchitecture: false, reasons };
  }

  if (category === 'B') {
    if (mttfdBand === 'high') {
      reasons.push('Kategoria B przy wysokim MTTFD bez sprawdzonych komponentów i DC ograniczona jest do poziomu maksymalnie PL b.');
      return { achievedPl: 'b', compliantArchitecture: true, reasons };
    }
    return {
      achievedPl: mttfdBand === 'low' ? 'a' : 'b',
      compliantArchitecture: true,
      reasons,
    };
  }

  if (category === '1') {
    if (mttfdBand !== 'high') {
      reasons.push('Kategoria 1 wymaga wysokiego MTTFD (≥ 30 lat) oraz zastosowania sprawdzonych komponentów i zasad bezpieczeństwa.');
      return { achievedPl: null, compliantArchitecture: false, reasons };
    }
    return { achievedPl: 'c', compliantArchitecture: true, reasons };
  }

  if (!ccfPassed) {
    reasons.push('Dla Kategorii 2, 3 i 4 wymagane jest osiągnięcie minimum 65 punktów w liście kontrolnej CCF.');
    return { achievedPl: null, compliantArchitecture: false, reasons };
  }

  if (category === '2') {
    if (dcLevel === 'none') {
      reasons.push('Kategoria 2 wymaga pokrycia diagnostycznego DCavg co najmniej na poziomie Niskim (≥ 60%) poprzez okresowe testowanie.');
      return { achievedPl: null, compliantArchitecture: false, reasons };
    }
    if (dcLevel === 'low') {
      const map: Record<Exclude<MttfdBand, 'below'>, PerformanceLevel> = {
        low: 'a',
        medium: 'b',
        high: 'c',
      };
      return { achievedPl: map[mttfdBand], compliantArchitecture: true, reasons };
    }
    // medium lub high (w Kat. 2 wykres przewiduje maks. Medium -> PL d)
    if (dcLevel === 'high') {
      reasons.push('W Kategorii 2 maksymalny osiągalny poziom przy wysokim MTTFD wynosi PL d (diagnostyka okresowa nie gwarantuje wykrycia przed każdym żądaniem).');
    }
    const mapMed: Record<Exclude<MttfdBand, 'below'>, PerformanceLevel> = {
      low: 'b',
      medium: 'c',
      high: 'd',
    };
    return { achievedPl: mapMed[mttfdBand], compliantArchitecture: true, reasons };
  }

  if (category === '3') {
    if (dcLevel === 'none') {
      reasons.push('Kategoria 3 wymaga co najmniej Niskiego pokrycia diagnostycznego DCavg (≥ 60%).');
      return { achievedPl: null, compliantArchitecture: false, reasons };
    }
    if (dcLevel === 'low') {
      const map: Record<Exclude<MttfdBand, 'below'>, PerformanceLevel> = {
        low: 'b',
        medium: 'c',
        high: 'd',
      };
      return { achievedPl: map[mttfdBand], compliantArchitecture: true, reasons };
    }
    if (dcLevel === 'high') {
      reasons.push('Dla Kategorii 3 i wysokiego DCavg wartości PL odpowiadają kolumnie DCavg = Średnie (maks. PL e przy wysokim MTTFD).');
    }
    const mapMed: Record<Exclude<MttfdBand, 'below'>, PerformanceLevel> = {
      low: 'c',
      medium: 'd',
      high: 'e',
    };
    return { achievedPl: mapMed[mttfdBand], compliantArchitecture: true, reasons };
  }

  // Category 4
  if (dcLevel !== 'high') {
    reasons.push('Kategoria 4 bezwzględnie wymaga Wysokiego pokrycia diagnostycznego DCavg (≥ 99%).');
    return { achievedPl: null, compliantArchitecture: false, reasons };
  }
  if (mttfdBand !== 'high') {
    reasons.push('Kategoria 4 bezwzględnie wymaga Wysokiego MTTFD każdego kanału (≥ 30 lat, z limitem normowym 2500 lat).');
    return { achievedPl: null, compliantArchitecture: false, reasons };
  }
  return { achievedPl: 'e', compliantArchitecture: true, reasons };
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  xpBonus: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_quiz',
    title: 'Pierwszy Certyfikat ISO 1219',
    description: 'Ukończ pierwszy quiz lekcyjny w Ścieżce Nauki.',
    xpBonus: 50,
  },
  {
    id: 'all_lessons',
    title: 'Mistrz Ścieżki Safety',
    description: 'Ukończ wszystkie 4 poziomy edukacyjne (ISO 1219, Pilz, Festo, IFA).',
    xpBonus: 150,
  },
  {
    id: 'fault_hunter',
    title: 'Tester Usterek Pneumatycznych',
    description: 'Przeanalizuj symulację pojedynczej usterki w Symulatorze Układów.',
    xpBonus: 50,
  },
  {
    id: 'pl_verifier',
    title: 'Analityk PL (EN ISO 13849-1)',
    description: 'Przejdź pełną 4-etapową weryfikację PL ≥ PLr w Weryfikatorze PL.',
    xpBonus: 75,
  },
  {
    id: 'catalog_explorer',
    title: 'Badacz Dokumentacji',
    description: 'Otwórz kartę komponentu Safety w Katalogu oraz hasło w Słowniku.',
    xpBonus: 40,
  },
];

export function computeUserRank(xp: number): {
  level: number;
  title: string;
  nextLevelXp: number;
  progressPercent: number;
} {
  const tiers = [
    { minXp: 0, title: 'Adept Pneumatyki' },
    { minXp: 150, title: 'Technik Obwodów Safety' },
    { minXp: 350, title: 'Inżynier Walidacji' },
    { minXp: 600, title: 'Ekspert EN ISO 13849-1' },
  ];

  let idx = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (xp >= tiers[i].minXp) idx = i;
  }

  const currentMin = tiers[idx].minXp;
  const nextMin = idx < tiers.length - 1 ? tiers[idx + 1].minXp : tiers[idx].minXp + 250;
  const span = Math.max(1, nextMin - currentMin);
  const pct = idx === tiers.length - 1 && xp >= nextMin ? 100 : Math.min(100, Math.round(((xp - currentMin) / span) * 100));

  return {
    level: idx + 1,
    title: tiers[idx].title,
    nextLevelXp: nextMin,
    progressPercent: pct,
  };
}
