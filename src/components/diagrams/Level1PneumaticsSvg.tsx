import { useState } from 'react';
import {
  AirSourceSymbol,
  DoubleActingCylinderSymbol,
  FrlUnitSymbol,
  ThrottleCheckValveSymbol,
  Valve52Symbol,
  Valve53Symbol,
} from '../PneumaticSymbols';

type ValveMode =
  | '5_2_rest'
  | '5_2_active'
  | '5_3_closed'
  | '5_3_exhausted'
  | '5_3_pressurized';

export function Level1PneumaticsSvg() {
  const [valveMode, setValveMode] = useState<ValveMode>('5_2_rest');

  const is53 = valveMode.startsWith('5_3');
  const extensionPct =
    valveMode === '5_2_active'
      ? 86
      : valveMode === '5_3_pressurized'
        ? 58
        : valveMode === '5_3_closed' || valveMode === '5_3_exhausted'
          ? 48
          : 12;

  const port4Pressurized =
    valveMode === '5_2_active' || valveMode === '5_3_pressurized';
  const port2Pressurized =
    valveMode === '5_2_rest' || valveMode === '5_3_pressurized';

  const port4Color = port4Pressurized
    ? '#dc2626'
    : valveMode === '5_3_closed'
      ? '#d97706'
      : '#16a34a';

  const port2Color = port2Pressurized
    ? '#dc2626'
    : valveMode === '5_3_closed'
      ? '#d97706'
      : '#16a34a';

  const stateExplanation: Record<ValveMode, string> = {
    '5_2_rest':
      '5/2 stan spoczynkowy (sprężyna): Port 1 zasila port 2 → prawy króciec (komora tłoczyskowa, czerwony) — siłownik schowany. Lewa komora (port 4) odpowietrza się z dławieniem przez GRLA 1 do portu 5 (zielony).',
    '5_2_active':
      '5/2 wysterowany (cewka 14): Port 1 zasila port 4 → lewy króciec (komora tłokowa, czerwony) — tłoczysko wysuwa się, a powietrze z prawej komory (port 2) uchodzi przez dławik wylotowy GRLA 2 do portu 3 (zielony).',
    '5_3_closed':
      '5/3 środek zamknięty (3 kwadraty, wszystkie porty T): Porty 4 i 2 odcięte — powietrze zostaje uwięzione (pomarańczowy) w obu komorach siłownika. Uwaga na wewnętrzne przecieki i pełzanie!',
    '5_3_exhausted':
      '5/3 środek odpowietrzony: Port 1 zaślepiony (T), a porty 4→5 oraz 2→3 łączą obie komory z atmosferą przez tłumiki (zielony). Brak ciśnienia i siły na tłoczysku.',
    '5_3_pressurized':
      '5/3 środek zasilony: Port 1 podaje 6 bar jednocześnie na port 4 (lewa komora) oraz port 2 (prawa komora). Z powodu większej powierzchni tłoka siłownik może powoli wysuwać się w prawo.',
  };

  // Wspólne współrzędne portów 4, 2, 1 dla idealnego styku z przewodami
  const valveY = 188;
  const port4X = is53 ? 255.6 : 254.8;
  const port2X = is53 ? 272.4 : 273.2;
  const port1X = 264;
  const valveTopStubY = valveY - 8;
  const valveBottomStubY = is53 ? valveY + 38 + 8 : valveY + 42 + 8;

  // Siłownik: x=446, y=30, width=164, height=58 -> lewy króciec x=456, prawy króciec x=600, końce króćców y=100
  const cylLeftPortX = 456;
  const cylRightPortX = 600;
  const cylPortEndY = 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Interaktywny schemat ISO 1219-1: Zespół FRL · Zawór 5/2 i 5/3 · 2× GRLA (dławienie wylotowe)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Przełączaj stan zaworu, aby obserwować aktywny kwadrat ISO, przepływ przez dławiki GRLA oraz wypełnienie komór siłownika.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(
            [
              { id: '5_2_rest', label: '5/2 Spoczynek' },
              { id: '5_2_active', label: '5/2 Cewka 14' },
              { id: '5_3_closed', label: '5/3 Zamknięty' },
              { id: '5_3_exhausted', label: '5/3 Odpowietrzony' },
              { id: '5_3_pressurized', label: '5/3 Zasilony' },
            ] as { id: ValveMode; label: string }[]
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setValveMode(btn.id)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                valveMode === btn.id
                  ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 720 296"
          className="mx-auto h-auto w-full max-w-[820px] min-w-[580px] text-slate-900 dark:text-slate-100"
          role="img"
          aria-label="Interaktywny schemat pneumatyczny ISO 1219-1 z zespołem FRL, zaworem 5/2 lub 5/3, dwoma zaworami GRLA i siłownikiem dwustronnego działania"
        >
          <rect
            x="4"
            y="4"
            width="712"
            height="288"
            rx="10"
            className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800"
          />

          {/* Źródło sprężonego powietrza 6 bar */}
          <AirSourceSymbol x={30} y={248} color="#dc2626" />
          <text
            x="30"
            y="272"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[9.5px] font-semibold dark:fill-slate-300"
          >
            6 bar
          </text>

          {/* Przewód źródło -> FRL */}
          <line x1="40" y1="248" x2="54" y2="248" stroke="#dc2626" strokeWidth="2.2" />

          {/* Prawdziwy zespół FRL wg ISO 1219-1 (Filtr + Reduktor z manometrem + Smarownica) */}
          <FrlUnitSymbol x={56} y={220} scale={0.86} includeLubricator lineColor="#dc2626" />
          <text
            x="114"
            y="286"
            textAnchor="middle"
            className="fill-slate-600 text-[9px] font-medium dark:fill-slate-400"
          >
            Zespół FRL (0Z1)
          </text>

          {/* Przewód zasilający z FRL do portu 1 zaworu */}
          <polyline
            points={`168,248 ${port1X},248 ${port1X},${valveBottomStubY}`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.4"
          />

          {/* Przewód Port 4 -> GRLA 1 -> LEWY króciec siłownika (komora tłokowa) */}
          <polyline
            points={`${port4X},${valveTopStubY} ${port4X},166 ${cylLeftPortX},166 ${cylLeftPortX},148`}
            fill="none"
            stroke={port4Color}
            strokeWidth="2.4"
          />
          <line
            x1={cylLeftPortX}
            y1="104"
            x2={cylLeftPortX}
            y2={cylPortEndY}
            stroke={port4Color}
            strokeWidth="2.4"
          />

          {/* Przewód Port 2 -> GRLA 2 -> PRAWY króciec siłownika (komora tłoczyskowa) */}
          <polyline
            points={`${port2X},${valveTopStubY} ${port2X},174 ${cylRightPortX},174 ${cylRightPortX},148`}
            fill="none"
            stroke={port2Color}
            strokeWidth="2.4"
          />
          <line
            x1={cylRightPortX}
            y1="104"
            x2={cylRightPortX}
            y2={cylPortEndY}
            stroke={port2Color}
            strokeWidth="2.4"
          />

          {/* DWA zawory dławiąco-zwrotne GRLA (dławienie na wylocie) na obu przewodach */}
          <ThrottleCheckValveSymbol
            x={cylLeftPortX}
            y={126}
            orientation="vertical"
            flowColor={port4Color}
            scale={0.95}
          />
          <text
            x={cylLeftPortX - 24}
            y="130"
            textAnchor="end"
            className="fill-slate-600 font-mono text-[9px] font-semibold dark:fill-slate-400"
          >
            1V2
          </text>

          <ThrottleCheckValveSymbol
            x={cylRightPortX}
            y={126}
            orientation="vertical"
            flowColor={port2Color}
            scale={0.95}
          />
          <text
            x={cylRightPortX + 24}
            y="130"
            textAnchor="start"
            className="fill-slate-600 font-mono text-[9px] font-semibold dark:fill-slate-400"
          >
            1V3
          </text>

          {/* Zawór rozdzielający 5/2 lub 5/3 wg ISO 1219-1 */}
          {!is53 ? (
            <Valve52Symbol
              x={201}
              y={valveY}
              size={42}
              active={valveMode === '5_2_active'}
              showPortNumbers
            />
          ) : (
            <Valve53Symbol
              x={207}
              y={valveY}
              size={38}
              centerType={
                valveMode === '5_3_closed'
                  ? 'closed'
                  : valveMode === '5_3_exhausted'
                    ? 'exhausted'
                    : 'pressurized'
              }
              position="center"
              showPortNumbers
            />
          )}
          <text
            x={is53 ? 174 : 172}
            y={valveY + 56}
            className="fill-slate-600 font-mono text-[9.5px] font-bold dark:fill-slate-400"
          >
            1V1
          </text>

          {/* Siłownik dwustronnego działania ISO 1219-1 */}
          <DoubleActingCylinderSymbol
            x={446}
            y={30}
            width={164}
            height={58}
            extensionPct={extensionPct}
            leftChamberColor={port4Color}
            rightChamberColor={port2Color}
            withCushioning
            portSide="bottom"
          />
          <text
            x="528"
            y="21"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300"
          >
            1A1 · Siłownik dwustronny (Port 4 → Lewa · Port 2 → Prawa)
          </text>

          {/* Legenda kolorów ISO */}
          <g transform="translate(396, 224)">
            <rect
              x="0"
              y="0"
              width="304"
              height="56"
              rx="6"
              className="fill-white/90 stroke-slate-200 dark:fill-slate-900/90 dark:stroke-slate-800"
            />
            <line x1="12" y1="18" x2="34" y2="18" stroke="#dc2626" strokeWidth="2.8" />
            <text x="40" y="21" className="fill-slate-700 text-[9.5px] dark:fill-slate-300">
              Zasilanie (6 bar)
            </text>

            <line x1="154" y1="18" x2="176" y2="18" stroke="#16a34a" strokeWidth="2.8" />
            <text x="182" y="21" className="fill-slate-700 text-[9.5px] dark:fill-slate-300">
              Odpowietrzenie (0 bar)
            </text>

            <line x1="12" y1="40" x2="34" y2="40" stroke="#d97706" strokeWidth="2.8" />
            <text x="40" y="43" className="fill-slate-700 text-[9.5px] dark:fill-slate-300">
              Powietrze uwięzione
            </text>

            <text x="154" y="43" className="fill-slate-500 font-mono text-[9px] dark:fill-slate-400">
              1V2, 1V3: GRLA (wylot)
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
        <strong className="font-semibold text-slate-900 dark:text-slate-100">
          Analiza przepływu:
        </strong>{' '}
        {stateExplanation[valveMode]}
      </div>
    </div>
  );
}
