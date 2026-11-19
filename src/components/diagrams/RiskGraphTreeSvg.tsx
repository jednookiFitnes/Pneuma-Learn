import type {
  FrequencyParam,
  PerformanceLevel,
  PossibilityParam,
  SeverityParam,
} from '../../utils/safetyMath';

interface RiskGraphTreeSvgProps {
  severity: SeverityParam;
  frequency: FrequencyParam;
  possibility: PossibilityParam;
  compact?: boolean;
}

interface LeafRow {
  s: SeverityParam;
  f: FrequencyParam;
  p: PossibilityParam;
  pl: PerformanceLevel;
  y: number;
}

const LEAF_ROWS: LeafRow[] = [
  { s: 'S1', f: 'F1', p: 'P1', pl: 'a', y: 38 },
  { s: 'S1', f: 'F1', p: 'P2', pl: 'b', y: 66 },
  { s: 'S1', f: 'F2', p: 'P1', pl: 'b', y: 94 },
  { s: 'S1', f: 'F2', p: 'P2', pl: 'c', y: 122 },
  { s: 'S2', f: 'F1', p: 'P1', pl: 'c', y: 158 },
  { s: 'S2', f: 'F1', p: 'P2', pl: 'd', y: 186 },
  { s: 'S2', f: 'F2', p: 'P1', pl: 'd', y: 214 },
  { s: 'S2', f: 'F2', p: 'P2', pl: 'e', y: 242 },
];

export function RiskGraphTreeSvg({
  severity,
  frequency,
  possibility,
  compact = false,
}: RiskGraphTreeSvgProps) {
  // Współrzędne X trzech poziomów binarnego drzewa EN ISO 13849-1
  const xStart = 32;
  const yStart = 140;

  const xS = 110;
  const yS1 = 80;
  const yS2 = 200;

  const xF = 198;
  const fNodes: { s: SeverityParam; f: FrequencyParam; y: number }[] = [
    { s: 'S1', f: 'F1', y: 52 },
    { s: 'S1', f: 'F2', y: 108 },
    { s: 'S2', f: 'F1', y: 172 },
    { s: 'S2', f: 'F2', y: 228 },
  ];

  const xP = 290;
  const xPl = 374;

  const activeColor = '#0284c7';
  const inactiveStroke = '#cbd5e1';

  return (
    <svg
      viewBox="0 0 430 270"
      className={compact ? 'mt-3 h-auto w-full' : 'mt-3 h-auto w-full'}
      role="img"
      aria-label={`Trzystopniowe binarne drzewo grafu ryzyka EN ISO 13849-1 — aktywna ścieżka ${severity} → ${frequency} → ${possibility}`}
    >
      <rect
        x="2"
        y="2"
        width="426"
        height="266"
        rx="8"
        className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-800"
      />

      {/* Nagłówki kolumn etapów */}
      <g className="fill-slate-400 font-mono text-[8.5px] font-semibold dark:fill-slate-500">
        <text x={xStart} y="17" textAnchor="middle">Start</text>
        <text x={xS} y="17" textAnchor="middle">Ciężkość S</text>
        <text x={xF} y="17" textAnchor="middle">Częstość F</text>
        <text x={xP} y="17" textAnchor="middle">Uniknięcie P</text>
        <text x={xPl} y="17" textAnchor="middle">Wynik PLr</text>
      </g>

      {/* Poziom 1: Start -> S1 / S2 */}
      {[
        { s: 'S1' as SeverityParam, y: yS1 },
        { s: 'S2' as SeverityParam, y: yS2 },
      ].map((node) => {
        const isActive = severity === node.s;
        return (
          <line
            key={node.s}
            x1={xStart + 14}
            y1={yStart}
            x2={xS - 15}
            y2={node.y}
            stroke={isActive ? activeColor : inactiveStroke}
            strokeWidth={isActive ? 3 : 1.3}
            className={isActive ? '' : 'dark:stroke-slate-700'}
          />
        );
      })}

      {/* Poziom 2: S1/S2 -> F1/F2 */}
      {fNodes.map((fn) => {
        const parentY = fn.s === 'S1' ? yS1 : yS2;
        const isActive = severity === fn.s && frequency === fn.f;
        return (
          <line
            key={`${fn.s}-${fn.f}`}
            x1={xS + 15}
            y1={parentY}
            x2={xF - 15}
            y2={fn.y}
            stroke={isActive ? activeColor : inactiveStroke}
            strokeWidth={isActive ? 3 : 1.3}
            className={isActive ? '' : 'dark:stroke-slate-700'}
          />
        );
      })}

      {/* Poziom 3: F1/F2 -> P1/P2 -> PLr */}
      {LEAF_ROWS.map((leaf) => {
        const parentF = fNodes.find((fn) => fn.s === leaf.s && fn.f === leaf.f)!;
        const isActive =
          severity === leaf.s && frequency === leaf.f && possibility === leaf.p;
        return (
          <g key={`${leaf.s}-${leaf.f}-${leaf.p}`}>
            {/* Gałąź F -> P */}
            <line
              x1={xF + 15}
              y1={parentF.y}
              x2={xP - 15}
              y2={leaf.y}
              stroke={isActive ? activeColor : inactiveStroke}
              strokeWidth={isActive ? 3 : 1.2}
              className={isActive ? '' : 'dark:stroke-slate-700'}
            />
            {/* Gałąź P -> PLr */}
            <line
              x1={xP + 15}
              y1={leaf.y}
              x2={xPl - 24}
              y2={leaf.y}
              stroke={isActive ? activeColor : inactiveStroke}
              strokeWidth={isActive ? 3 : 1.2}
              className={isActive ? '' : 'dark:stroke-slate-700'}
            />

            {/* Węzeł P1 / P2 */}
            <rect
              x={xP - 15}
              y={leaf.y - 9}
              width="30"
              height="18"
              rx="4"
              className={
                isActive
                  ? 'fill-sky-600 stroke-sky-700 dark:fill-sky-500 dark:stroke-sky-400'
                  : 'fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700'
              }
              strokeWidth={isActive ? 1.8 : 1.1}
            />
            <text
              x={xP}
              y={leaf.y + 3.5}
              textAnchor="middle"
              className={`font-mono text-[9.5px] font-bold ${
                isActive ? 'fill-white dark:fill-slate-950' : 'fill-slate-600 dark:fill-slate-400'
              }`}
            >
              {leaf.p}
            </text>

            {/* Węzeł wynikowy PLr a..e */}
            <rect
              x={xPl - 24}
              y={leaf.y - 10}
              width="58"
              height="20"
              rx="5"
              className={
                isActive
                  ? 'fill-sky-600 stroke-sky-700 dark:fill-sky-500 dark:stroke-sky-300'
                  : 'fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800'
              }
              strokeWidth={isActive ? 1.8 : 1}
            />
            <text
              x={xPl + 5}
              y={leaf.y + 3.5}
              textAnchor="middle"
              className={`font-mono text-[10px] font-bold ${
                isActive ? 'fill-white dark:fill-slate-950' : 'fill-slate-500 dark:fill-slate-500'
              }`}
            >
              PLr {leaf.pl}
            </text>
          </g>
        );
      })}

      {/* Węzły F1 / F2 */}
      {fNodes.map((fn) => {
        const isActive = severity === fn.s && frequency === fn.f;
        return (
          <g key={`node-${fn.s}-${fn.f}`}>
            <rect
              x={xF - 15}
              y={fn.y - 10}
              width="30"
              height="20"
              rx="4"
              className={
                isActive
                  ? 'fill-sky-600 stroke-sky-700 dark:fill-sky-500 dark:stroke-sky-400'
                  : 'fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700'
              }
              strokeWidth={isActive ? 1.8 : 1.1}
            />
            <text
              x={xF}
              y={fn.y + 3.5}
              textAnchor="middle"
              className={`font-mono text-[10px] font-bold ${
                isActive ? 'fill-white dark:fill-slate-950' : 'fill-slate-700 dark:fill-slate-300'
              }`}
            >
              {fn.f}
            </text>
          </g>
        );
      })}

      {/* Węzły S1 / S2 */}
      {[
        { s: 'S1' as SeverityParam, y: yS1 },
        { s: 'S2' as SeverityParam, y: yS2 },
      ].map((node) => {
        const isActive = severity === node.s;
        return (
          <g key={`node-${node.s}`}>
            <rect
              x={xS - 15}
              y={node.y - 11}
              width="30"
              height="22"
              rx="5"
              className={
                isActive
                  ? 'fill-sky-600 stroke-sky-700 dark:fill-sky-500 dark:stroke-sky-400'
                  : 'fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700'
              }
              strokeWidth={isActive ? 1.8 : 1.2}
            />
            <text
              x={xS}
              y={node.y + 4}
              textAnchor="middle"
              className={`font-mono text-[10.5px] font-bold ${
                isActive ? 'fill-white dark:fill-slate-950' : 'fill-slate-700 dark:fill-slate-300'
              }`}
            >
              {node.s}
            </text>
          </g>
        );
      })}

      {/* Węzeł Start */}
      <circle cx={xStart} cy={yStart} r="15" className="fill-sky-600 dark:fill-sky-500" />
      <text
        x={xStart}
        y={yStart + 3.5}
        textAnchor="middle"
        className="fill-white font-mono text-[9.5px] font-bold dark:fill-slate-950"
      >
        Start
      </text>
    </svg>
  );
}
