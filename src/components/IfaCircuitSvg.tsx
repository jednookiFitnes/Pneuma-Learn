import type { IfaExampleId, IfaSimState } from '../data/ifaExamples';
import {
  AirSourceSymbol,
  DoubleActingCylinderSymbol,
  DualSafety32BlockSymbol,
  FrlUnitSymbol,
  PilotCheckValveSymbol,
  Valve32Symbol,
  Valve52Symbol,
  Valve53Symbol,
} from './PneumaticSymbols';

interface IfaCircuitSvgProps {
  exampleId: IfaExampleId;
  simState: IfaSimState;
}

/** Dokładny schemat pneumatyczny ISO 1219-1 dla każdego z 6 przykładów z IFA Report 2/2017e */
export function IfaCircuitSvg({ exampleId, simState }: IfaCircuitSvgProps) {
  const isNormal = simState === 'normal';
  const isFault = simState === 'single_fault';

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 740 300"
        className="h-auto w-full min-w-[580px] text-slate-900 dark:text-slate-100"
        role="img"
        aria-label={`Schemat pneumatyczny ISO 1219-1 dla przykładu ${exampleId}`}
      >
        <rect
          x="4"
          y="4"
          width="732"
          height="292"
          rx="10"
          className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800"
        />

        {/* ============================================================ */}
        {/* PRZYKŁAD 2 (Kat. 1 / PL c): 1V1 (5/3 zamkn.) -> 1A1           */}
        {/* ============================================================ */}
        {exampleId === 'ifa_ex2' && (
          <g>
            <AirSourceSymbol x={32} y={244} color="#dc2626" />
            <line x1="42" y1="244" x2="62" y2="244" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={64} y={216} scale={0.82} includeLubricator={false} lineColor="#dc2626" />
            <polyline points="142,244 268,244 268,228" fill="none" stroke="#dc2626" strokeWidth="2.5" />

            {/* 1V1: Sprawdzony zawór 5/3 zamknięty w środku */}
            <Valve53Symbol
              x={211}
              y={182}
              size={38}
              centerType="closed"
              position={isNormal || isFault ? 'left' : 'center'}
              fault={isFault}
              showPortNumbers
            />
            <text x="268" y="171" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1V1 (Sprawdzony 5/3 zamkn.)
            </text>
            {isFault && (
              <text x="268" y="264" textAnchor="middle" className="fill-rose-600 font-mono text-[9px] font-bold dark:fill-rose-400">
                USTERKA: Suwak 1V1 zacięty w 1→4 (brak wykrycia!)
              </text>
            )}

            {/* Port 4 -> Lewa komora, Port 2 -> Prawa komora */}
            <polyline
              points="259.6,174 259.6,126 472,126 472,96"
              fill="none"
              stroke={isNormal || isFault ? '#dc2626' : '#d97706'}
              strokeWidth="2.6"
            />
            <polyline
              points="276.4,174 276.4,142 608,142 608,96"
              fill="none"
              stroke={isNormal || isFault ? '#16a34a' : '#d97706'}
              strokeWidth="2.6"
            />

            <DoubleActingCylinderSymbol
              x={462}
              y={28}
              width={156}
              height={56}
              extensionPct={isNormal || isFault ? 88 : 48}
              leftChamberColor={isNormal || isFault ? '#dc2626' : '#d97706'}
              rightChamberColor={isNormal || isFault ? '#16a34a' : '#d97706'}
              portSide="bottom"
            />
            <text x="540" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 · {isFault ? 'NIEBEZPIECZNY RUCH!' : isNormal ? 'Ruch roboczy' : 'Zatrzymany (SSC)'}
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* PRZYKŁAD 11 (Kat. 2 / PL d): 0V1 (3/2 OTE) -> 1V1 (5/3) -> 1A1 + 1S1 -> K1 */}
        {/* ============================================================ */}
        {exampleId === 'ifa_ex11' && (
          <g>
            <AirSourceSymbol x={28} y={244} color="#dc2626" />
            <line x1="38" y1="244" x2="54" y2="244" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={218} scale={0.76} includeLubricator={false} lineColor="#dc2626" />
            <polyline points="128,244 185.6,244 185.6,232" fill="none" stroke="#dc2626" strokeWidth="2.4" />

            {/* 0V1: Nadrzędny zawór odpowietrzający 3/2 (wyjście zastępcze OTE) */}
            <Valve32Symbol
              x={144}
              y={192}
              size={32}
              active={!isFault}
              showPortNumbers
            />
            <text x="176" y="180" textAnchor="middle" className="fill-sky-700 font-mono text-[9px] font-bold dark:fill-sky-400">
              0V1 (OTE 3/2)
            </text>

            {/* Zasilanie za 0V1 -> Port 1 zaworu 1V1 */}
            <polyline
              points="185.6,184 185.6,162 240,162 240,252 345,252 345,232"
              fill="none"
              stroke={isFault ? '#16a34a' : '#dc2626'}
              strokeWidth="2.4"
            />

            {/* 1V1: Zawór roboczy 5/3 */}
            <Valve53Symbol
              x={288}
              y={186}
              size={38}
              centerType="closed"
              position={isNormal || isFault ? 'left' : 'center'}
              fault={isFault}
              supplyActive={!isFault}
              showPortNumbers
            />
            <text x="345" y="176" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1V1 (5/3 Kanał funkcyjny)
            </text>

            {/* Port 4 -> Lewa, Port 2 -> Prawa */}
            <polyline
              points="336.6,178 336.6,126 462,126 462,96"
              fill="none"
              stroke={isFault ? '#16a34a' : isNormal ? '#dc2626' : '#d97706'}
              strokeWidth="2.5"
            />
            <polyline
              points="353.4,178 353.4,142 590,142 590,96"
              fill="none"
              stroke={isFault ? '#16a34a' : isNormal ? '#16a34a' : '#d97706'}
              strokeWidth="2.5"
            />

            {/* 1A1 + przetwornik przemieszczenia 1S1 */}
            <DoubleActingCylinderSymbol
              x={452}
              y={28}
              width={148}
              height={56}
              extensionPct={isNormal ? 84 : isFault ? 60 : 48}
              leftChamberColor={isFault ? '#16a34a' : isNormal ? '#dc2626' : '#d97706'}
              rightChamberColor={isFault ? '#16a34a' : isNormal ? '#16a34a' : '#d97706'}
              withDisplacementSensor
              sensorLabel="1S1"
              portSide="bottom"
            />
            <text x="526" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 + 1S1 (Pomiar drogi)
            </text>

            {/* Blok testowy K1 (PLC TE) połączony z 1S1 i wyłączający 0V1 */}
            <g transform="translate(520, 174)">
              <rect
                x="0"
                y="0"
                width="160"
                height="50"
                rx="4"
                className={isFault ? 'fill-amber-500/15' : 'fill-sky-500/10'}
                stroke={isFault ? '#d97706' : '#0284c7'}
                strokeWidth="1.5"
              />
              <text x="80" y="20" textAnchor="middle" className="fill-slate-800 font-mono text-[9px] font-bold dark:fill-slate-100">
                K1 (PLC — kanał TE)
              </text>
              <text x="80" y="37" textAnchor="middle" className={`font-mono text-[8.5px] font-bold ${isFault ? 'fill-amber-700 dark:fill-amber-400' : 'fill-sky-700 dark:fill-sky-400'}`}>
                {isFault ? 'BŁĄD 1V1 → WYŁĄCZ 0V1!' : 'Test 1S1: OK (NIE steruje 1V1)'}
              </text>
            </g>
            {/* Przewód sygnałowy 1S1 -> K1 -> 0V1 */}
            <polyline points="629,48 694,48 694,198 680,198" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 2" />
            <polyline points="520,214 504,214 504,274 106,274 106,208 114,208" fill="none" stroke={isFault ? '#d97706' : '#0284c7'} strokeWidth="1.6" strokeDasharray="4 2" />
          </g>
        )}

        {/* ============================================================ */}
        {/* PRZYKŁAD 14 (Kat. 3 / PL d): 1V1 (5/3) + 2V1 (3/2) + 2Z1 (Hamulec) + 2S1 + 1S1 */}
        {/* ============================================================ */}
        {exampleId === 'ifa_ex14' && (
          <g>
            <AirSourceSymbol x={28} y={244} color="#dc2626" />
            <line x1="38" y1="244" x2="54" y2="244" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={218} scale={0.76} includeLubricator={false} lineColor="#dc2626" />
            <polyline points="128,244 252,244 252,230" fill="none" stroke="#dc2626" strokeWidth="2.4" />
            <polyline points="252,244 402,244 402,232" fill="none" stroke="#dc2626" strokeWidth="2.2" />

            {/* Kanał 1: 1V1 (5/3 zamkn.) */}
            <Valve53Symbol
              x={195}
              y={184}
              size={38}
              centerType="closed"
              position={isNormal || isFault ? 'left' : 'center'}
              fault={isFault}
              showPortNumbers
            />
            <text x="252" y="173" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V1 (Kanał 1 — 5/3)
            </text>

            {/* Kanał 2: 2V1 (3/2 sterujący hamulcem 2Z1) */}
            <Valve32Symbol x={362} y={194} size={30} active={isNormal} showPortNumbers />
            <text x="392" y="180" textAnchor="middle" className="fill-emerald-700 font-mono text-[9px] font-bold dark:fill-emerald-400">
              2V1 (Kanał 2 — 3/2)
            </text>

            {/* Presostat 2S1 monitorujący 2V1 */}
            <g transform="translate(464, 152)">
              <rect x="0" y="0" width="38" height="24" rx="3" className="fill-sky-500/10" stroke="#0284c7" strokeWidth="1.4" />
              <text x="19" y="15" textAnchor="middle" className="fill-sky-700 font-mono text-[8.5px] font-bold dark:fill-sky-400">2S1</text>
              <text x="19" y="34" textAnchor="middle" className="fill-slate-500 font-mono text-[7.5px] dark:fill-slate-400">p&gt;3.5b</text>
            </g>

            {/* Linia z 2V1 -> 2S1 -> Hamulec 2Z1 */}
            <polyline
              points="401,186 401,164 464,164"
              fill="none"
              stroke={isNormal ? '#0284c7' : '#16a34a'}
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <polyline
              points="502,164 620,164 620,86"
              fill="none"
              stroke={isNormal ? '#0284c7' : '#16a34a'}
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* Port 4 -> Lewa, Port 2 -> Prawa */}
            <polyline
              points="243.6,176 243.6,124 454,124 454,96"
              fill="none"
              stroke={isNormal || isFault ? '#dc2626' : '#d97706'}
              strokeWidth="2.5"
            />
            <polyline
              points="260.4,176 260.4,138 584,138 584,96"
              fill="none"
              stroke={isNormal || isFault ? '#16a34a' : '#d97706'}
              strokeWidth="2.5"
            />

            {/* Siłownik 1A1 + Hamulec tłoczyska 2Z1 + Przetwornik 1S1 */}
            <DoubleActingCylinderSymbol
              x={444}
              y={28}
              width={150}
              height={56}
              extensionPct={isNormal ? 72 : 52}
              leftChamberColor={isNormal || isFault ? '#dc2626' : '#d97706'}
              rightChamberColor={isNormal || isFault ? '#16a34a' : '#d97706'}
              withBrake
              brakeEngaged={!isNormal}
              withDisplacementSensor
              sensorLabel="1S1"
              portSide="bottom"
            />
            <text x="550" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 + 2Z1 ({isNormal ? 'Hamulec otwarty' : 'HAMULEC ZACIŚNIĘTY'}) + 1S1
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* PRZYKŁAD 25 (Kat. 3 / PL e): 1V1 (5/3) + 2V1 (3/2) + 2V2, 2V3 (HGL) + 2S1 */}
        {/* ============================================================ */}
        {exampleId === 'ifa_ex25' && (
          <g>
            <AirSourceSymbol x={28} y={244} color="#dc2626" />
            <line x1="38" y1="244" x2="54" y2="244" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={218} scale={0.76} includeLubricator={false} lineColor="#dc2626" />
            <polyline points="128,244 252,244 252,230" fill="none" stroke="#dc2626" strokeWidth="2.4" />
            <polyline points="252,244 398,244 398,232" fill="none" stroke="#dc2626" strokeWidth="2.2" />

            {/* Kanał 1: 1V1 (5/3 zamkn.) */}
            <Valve53Symbol
              x={195}
              y={184}
              size={38}
              centerType="closed"
              position={isNormal ? 'left' : 'center'}
              showPortNumbers
            />
            <text x="252" y="173" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V1 (Kanał 1 — 5/3)
            </text>

            {/* Kanał 2: 2V1 (3/2 pilotujący 2V2 i 2V3) */}
            <Valve32Symbol
              x={358}
              y={194}
              size={30}
              active={isNormal || isFault}
              fault={isFault}
              showPortNumbers
            />
            <text x="388" y="180" textAnchor="middle" className="fill-sky-700 font-mono text-[9px] font-bold dark:fill-sky-400">
              2V1 (Pilot 3/2)
            </text>

            {/* Presostat 2S1 na wyjściu 2V1 */}
            <g transform="translate(414, 152)">
              <rect
                x="0"
                y="0"
                width="38"
                height="24"
                rx="3"
                className={isFault ? 'fill-rose-500/20' : 'fill-sky-500/10'}
                stroke={isFault ? '#dc2626' : '#0284c7'}
                strokeWidth="1.5"
              />
              <text x="19" y="15" textAnchor="middle" className={`font-mono text-[8.5px] font-bold ${isFault ? 'fill-rose-700 dark:fill-rose-400' : 'fill-sky-700 dark:fill-sky-400'}`}>
                2S1
              </text>
            </g>
            {isFault && (
              <text x="433" y="256" textAnchor="middle" className="fill-rose-600 font-mono text-[8.5px] font-bold dark:fill-rose-400">
                ALARM 2S1: 2V1 ZACIĘTY!
              </text>
            )}

            {/* Linia pilota z 2V1 -> 2S1 -> 2V2 i 2V3 */}
            <polyline
              points="397,186 397,164 414,164"
              fill="none"
              stroke={isNormal || isFault ? '#0284c7' : '#94a3b8'}
              strokeWidth="1.9"
              strokeDasharray="4 2"
            />
            <polyline
              points="452,164 494,164 494,136"
              fill="none"
              stroke={isNormal || isFault ? '#0284c7' : '#94a3b8'}
              strokeWidth="1.8"
              strokeDasharray="4 2"
            />
            <polyline
              points="494,164 624,164 624,136"
              fill="none"
              stroke={isNormal || isFault ? '#0284c7' : '#94a3b8'}
              strokeWidth="1.8"
              strokeDasharray="4 2"
            />

            {/* Przewody Port 4 -> 2V2 -> Lewa, Port 2 -> 2V3 -> Prawa */}
            <polyline
              points="243.6,176 243.6,128 476,128 476,110"
              fill="none"
              stroke={isNormal ? '#dc2626' : '#d97706'}
              strokeWidth="2.5"
            />
            <line x1="476" y1="108" x2="476" y2="96" stroke={isNormal ? '#dc2626' : '#d97706'} strokeWidth="2.5" />

            <polyline
              points="260.4,176 260.4,142 606,142 606,110"
              fill="none"
              stroke={isNormal ? '#16a34a' : '#d97706'}
              strokeWidth="2.5"
            />
            <line x1="606" y1="108" x2="606" y2="96" stroke={isNormal ? '#16a34a' : '#d97706'} strokeWidth="2.5" />

            {/* 2V2 i 2V3 (zawory zwrotne sterowane HGL przy siłowniku) */}
            <PilotCheckValveSymbol
              x={476}
              y={114}
              orientation="vertical"
              pilotActive={isNormal || isFault}
              flowColor={isNormal ? '#dc2626' : '#d97706'}
              scale={0.82}
            />
            <text x="454" y="116" textAnchor="end" className="fill-amber-700 font-mono text-[8.5px] font-bold dark:fill-amber-400">
              2V2
            </text>

            <PilotCheckValveSymbol
              x={606}
              y={114}
              orientation="vertical"
              pilotActive={isNormal || isFault}
              flowColor={isNormal ? '#16a34a' : '#d97706'}
              scale={0.82}
            />
            <text x="630" y="116" textAnchor="start" className="fill-amber-700 font-mono text-[8.5px] font-bold dark:fill-amber-400">
              2V3
            </text>

            <DoubleActingCylinderSymbol
              x={466}
              y={28}
              width={150}
              height={56}
              extensionPct={isNormal ? 82 : 54}
              leftChamberColor={isNormal ? '#dc2626' : '#d97706'}
              rightChamberColor={isNormal ? '#16a34a' : '#d97706'}
              portSide="bottom"
            />
            <text x="541" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 · {isNormal ? 'Ruch roboczy' : 'Zatrzymany (1V1 + 2V2/2V3)'}
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* PRZYKŁAD 26 (Rekonstrukcja historyczna BGIA 2/2008e: 1V1 + 1V2 + 1S1/1S2) */}
        {/* ============================================================ */}
        {exampleId === 'ifa_ex26' && (
          <g>
            <AirSourceSymbol x={28} y={244} color="#dc2626" />
            <line x1="38" y1="244" x2="54" y2="244" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={218} scale={0.76} includeLubricator={false} lineColor="#dc2626" />
            <polyline points="128,244 204,244 204,230" fill="none" stroke="#dc2626" strokeWidth="2.4" />

            {/* 1V1: Pierwszy zawór 3/2 (szeregowy) */}
            <Valve32Symbol x={164} y={192} size={30} active={isNormal || isFault} fault={isFault} showPortNumbers />
            <text x="194" y="180" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V1 (Kanał 1)
            </text>

            {/* Zewnętrzny presostat 1S1 między 1V1 i 1V2 */}
            <polyline
              points="203,184 203,154 274,154 274,250 374,250 374,232"
              fill="none"
              stroke={isNormal || isFault ? '#dc2626' : '#16a34a'}
              strokeWidth="2.4"
            />
            <g transform="translate(232, 114)">
              <rect x="0" y="0" width="38" height="22" rx="3" className={isFault ? 'fill-rose-500/20' : 'fill-sky-500/10'} stroke={isFault ? '#dc2626' : '#0284c7'} strokeWidth="1.4" />
              <text x="19" y="14" textAnchor="middle" className="fill-slate-800 font-mono text-[8.5px] font-bold dark:fill-slate-100">1S1</text>
              <line x1="19" y1="22" x2="19" y2="40" stroke={isFault ? '#dc2626' : '#0284c7'} strokeWidth="1.4" strokeDasharray="3 2" />
            </g>

            {/* 1V2: Drugi zawór 5/2 (szeregowy na wyjściu do siłownika) */}
            <Valve52Symbol x={314} y={184} size={40} active={isNormal} supplyActive={isNormal || isFault} showPortNumbers />
            <text x="354" y="172" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V2 (Kanał 2)
            </text>

            {/* Zewnętrzny presostat 1S2 na wyjściu roboczym */}
            <g transform="translate(416, 152)">
              <rect x="0" y="0" width="38" height="22" rx="3" className="fill-sky-500/10" stroke="#0284c7" strokeWidth="1.4" />
              <text x="19" y="14" textAnchor="middle" className="fill-slate-800 font-mono text-[8.5px] font-bold dark:fill-slate-100">1S2</text>
              <line x1="19" y1="0" x2="19" y2="-24" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="3 2" />
            </g>

            {/* Port 4 -> Lewa, Port 2 -> Prawa */}
            <polyline
              points="365.2,176 365.2,128 482,128 482,96"
              fill="none"
              stroke={isNormal ? '#dc2626' : '#16a34a'}
              strokeWidth="2.5"
            />
            <polyline
              points="382.8,176 382.8,142 612,142 612,96"
              fill="none"
              stroke={isNormal ? '#16a34a' : '#16a34a'}
              strokeWidth="2.5"
            />

            <DoubleActingCylinderSymbol
              x={472}
              y={28}
              width={150}
              height={56}
              extensionPct={isNormal ? 86 : 22}
              leftChamberColor={isNormal ? '#dc2626' : '#16a34a'}
              rightChamberColor="#16a34a"
              portSide="bottom"
            />
            <text x="547" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1A1 · Rekonstrukcja historyczna BGIA 2/2008e (wycofana 2017)
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* PRZYKŁAD 31 (Kat. 4 / PL e): 1V1 + 1V2 (2× 3/2 + bezpośrednie czujniki G) -> 1A1 */}
        {/* ============================================================ */}
        {exampleId === 'ifa_ex31' && (
          <g>
            <AirSourceSymbol x={28} y={244} color="#dc2626" />
            <line x1="38" y1="244" x2="54" y2="244" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={218} scale={0.76} includeLubricator={false} lineColor="#dc2626" />
            <polyline points="128,244 190,244 190,230 204,230" fill="none" stroke="#dc2626" strokeWidth="2.5" />

            {/* 1V1 + 1V2: Dwa redundantne zawory 3/2 z bezpośrednią kontrolą położenia suwaka (DC = 99%) */}
            <DualSafety32BlockSymbol
              x={204}
              y={128}
              scale={0.96}
              ch1Active={isNormal || isFault}
              ch2Active={isNormal}
              ch1Fault={isFault}
              ch2Fault={false}
              withSoftStart={false}
            />
            <text x="282" y="120" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1V1 (góra) + 1V2 (dół) — Bezpośrednie czujniki suwaków (G)
            </text>

            {/* F-PLC nadzór spójności DC = 99% */}
            <g transform="translate(396, 170)">
              <rect
                x="0"
                y="0"
                width="104"
                height="58"
                rx="4"
                className={isFault ? 'fill-rose-500/15' : 'fill-emerald-500/10'}
                stroke={isFault ? '#dc2626' : '#059669'}
                strokeWidth="1.6"
              />
              <text x="52" y="22" textAnchor="middle" className="fill-slate-800 font-mono text-[9px] font-bold dark:fill-slate-100">
                F-PLC (Kat. 4)
              </text>
              <text x="52" y="40" textAnchor="middle" className={`font-mono text-[8.5px] font-bold ${isFault ? 'fill-rose-600 dark:fill-rose-400' : 'fill-emerald-700 dark:fill-emerald-400'}`}>
                {isFault ? '1V1 ZACIĘTY! STOP' : 'DCavg = 99% OK'}
              </text>
            </g>
            <polyline points="359,155 378,155 378,188 396,188" fill="none" stroke={isFault ? '#dc2626' : '#059669'} strokeWidth="1.5" strokeDasharray="3 2" />
            <polyline points="359,207 396,207" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Wyjście robocze SDE do komory tłokowej 1A1 */}
            <polyline
              points="360,134 508,134 508,96"
              fill="none"
              stroke={isNormal ? '#dc2626' : '#16a34a'}
              strokeWidth="2.6"
            />
            <polyline
              points="638,96 638,144 662,144"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.2"
            />

            <DoubleActingCylinderSymbol
              x={498}
              y={28}
              width={150}
              height={56}
              extensionPct={isNormal ? 88 : 18}
              leftChamberColor={isNormal ? '#dc2626' : '#16a34a'}
              rightChamberColor="#16a34a"
              portSide="bottom"
            />
            <text x="573" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 · {isNormal ? 'Zasilony (6 bar)' : 'Bezpiecznie odpowietrzony (SDE)'}
            </text>
          </g>
        )}

        {/* Legenda kolorów ISO 1219 */}
        <g transform="translate(526, 240)">
          <rect
            x="0"
            y="0"
            width="198"
            height="46"
            rx="5"
            className="fill-white/90 stroke-slate-200 dark:fill-slate-900/90 dark:stroke-slate-800"
          />
          <line x1="8" y1="14" x2="26" y2="14" stroke="#dc2626" strokeWidth="2.5" />
          <text x="31" y="17" className="fill-slate-700 text-[8.5px] dark:fill-slate-300">Zasilanie</text>
          <line x1="94" y1="14" x2="112" y2="14" stroke="#16a34a" strokeWidth="2.5" />
          <text x="117" y="17" className="fill-slate-700 text-[8.5px] dark:fill-slate-300">Odpowietrzenie</text>
          <line x1="8" y1="32" x2="26" y2="32" stroke="#0284c7" strokeWidth="1.9" strokeDasharray="4 2" />
          <text x="31" y="35" className="fill-slate-700 text-[8.5px] dark:fill-slate-300">Sterowanie/Test</text>
          <line x1="94" y1="32" x2="112" y2="32" stroke="#d97706" strokeWidth="2.5" />
          <text x="117" y="35" className="fill-slate-700 text-[8.5px] dark:fill-slate-300">Uwięzione</text>
        </g>
      </svg>
    </div>
  );
}

/** Schemat blokowy SRP/CS wierny ilustracjom IFA Report 2/2017e (I/L/O, TE/OTE w Kat. 2, m w Kat. 3 i 4) */
export function IfaBlockDiagramSvg({ exampleId }: { exampleId: IfaExampleId }) {
  return (
    <svg
      viewBox="0 0 460 156"
      className="h-auto w-full rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      role="img"
      aria-label={`Schemat blokowy SRP/CS dla przykładu ${exampleId}`}
    >
      {/* Kat. 1 — Przykład 2: pojedynczy kanał O (1V1) */}
      {exampleId === 'ifa_ex2' && (
        <g>
          <text x="230" y="20" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold dark:fill-slate-400">
            Architektura wyznaczona: Kategoria 1 (Podsystem wyjściowy)
          </text>
          <rect x="44" y="54" width="90" height="44" rx="5" className="fill-slate-100 stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-600" strokeDasharray="4 2" strokeWidth="1.4" />
          <text x="89" y="74" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold">I / L</text>
          <text x="89" y="88" textAnchor="middle" className="fill-slate-400 text-[8px]">(Poza podsystemem)</text>

          <line x1="134" y1="76" x2="196" y2="76" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="196,76 189,72 189,80" fill="currentColor" />

          <rect x="196" y="48" width="136" height="56" rx="6" className="fill-sky-50 stroke-sky-600 dark:fill-sky-950/50 dark:stroke-sky-400" strokeWidth="1.8" />
          <text x="264" y="72" textAnchor="middle" className="fill-sky-900 font-mono text-[11px] font-bold dark:fill-sky-200">O: 1V1 (5/3)</text>
          <text x="264" y="89" textAnchor="middle" className="fill-sky-700 font-mono text-[8.5px] dark:fill-sky-400">Sprawdzony · MTTFD = 100 lat</text>

          <line x1="332" y1="76" x2="394" y2="76" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="394,76 387,72 387,80" fill="currentColor" />
          <text x="418" y="80" textAnchor="middle" className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-300">1A1</text>
        </g>
      )}

      {/* Kat. 2 — Przykład 11: Kanał funkcyjny O (1V1) + Kanał testowy TE (1S1 + K1) -> OTE (0V1) */}
      {exampleId === 'ifa_ex11' && (
        <g>
          <text x="230" y="18" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold dark:fill-slate-400">
            Architektura wyznaczona: Kategoria 2 (Kanał funkcyjny + TE → OTE)
          </text>
          {/* Kanał funkcyjny góra */}
          <rect x="34" y="34" width="124" height="36" rx="5" className="fill-sky-50 stroke-sky-600 dark:fill-sky-950/50 dark:stroke-sky-400" strokeWidth="1.6" />
          <text x="96" y="56" textAnchor="middle" className="fill-sky-900 font-mono text-[10px] font-bold dark:fill-sky-200">O: 1V1 (5/3)</text>

          <line x1="158" y1="52" x2="366" y2="52" stroke="currentColor" strokeWidth="1.6" />
          <polygon points="366,52 359,48 359,56" fill="currentColor" />
          <text x="394" y="56" textAnchor="middle" className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-300">1A1</text>

          {/* Kanał testowy dół: 1S1 -> TE (K1) -> OTE (0V1) */}
          <rect x="34" y="96" width="96" height="38" rx="5" className="fill-amber-50 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-400" strokeWidth="1.5" />
          <text x="82" y="113" textAnchor="middle" className="fill-amber-900 font-mono text-[9.5px] font-bold dark:fill-amber-200">TE: 1S1</text>
          <text x="82" y="126" textAnchor="middle" className="fill-amber-700 font-mono text-[8px] dark:fill-amber-400">Pomiar drogi</text>

          <line x1="130" y1="115" x2="170" y2="115" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="170,115 163,111 163,119" fill="#d97706" />

          <rect x="170" y="96" width="102" height="38" rx="5" className="fill-amber-50 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-400" strokeWidth="1.5" />
          <text x="221" y="113" textAnchor="middle" className="fill-amber-900 font-mono text-[9.5px] font-bold dark:fill-amber-200">TE: K1 (PLC)</text>
          <text x="221" y="126" textAnchor="middle" className="fill-amber-700 font-mono text-[8px] dark:fill-amber-400">Ocena testu</text>

          <line x1="272" y1="115" x2="314" y2="115" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="314,115 307,111 307,119" fill="#d97706" />

          <rect x="314" y="96" width="112" height="38" rx="5" className="fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/40 dark:stroke-emerald-400" strokeWidth="1.6" />
          <text x="370" y="113" textAnchor="middle" className="fill-emerald-900 font-mono text-[9.5px] font-bold dark:fill-emerald-200">OTE: 0V1 (3/2)</text>
          <text x="370" y="126" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] dark:fill-emerald-400">Odpowietrzenie</text>

          {/* Przerywana linia monitorowania m */}
          <line x1="96" y1="70" x2="96" y2="96" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="3 2" />
          <text x="108" y="86" className="fill-sky-700 font-mono text-[8.5px] font-bold dark:fill-sky-400">m</text>
        </g>
      )}

      {/* Kat. 3 — Przykład 14: Kanał 1 (1V1) || Kanał 2 (2V1 + 2Z1) + monitoring m (1S1, 2S1) */}
      {exampleId === 'ifa_ex14' && (
        <g>
          <text x="230" y="18" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold dark:fill-slate-400">
            Architektura wyznaczona: Kategoria 3 (Zróżnicowane kanały + monitoring m)
          </text>
          {/* Kanał 1 */}
          <rect x="44" y="34" width="246" height="36" rx="5" className="fill-sky-50 stroke-sky-600 dark:fill-sky-950/50 dark:stroke-sky-400" strokeWidth="1.6" />
          <text x="167" y="56" textAnchor="middle" className="fill-sky-900 font-mono text-[10px] font-bold dark:fill-sky-200">Kanał 1: O1 = 1V1 (5/3 zamkn. · DC 60%)</text>

          {/* Kanał 2 */}
          <rect x="44" y="96" width="114" height="38" rx="5" className="fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/40 dark:stroke-emerald-400" strokeWidth="1.6" />
          <text x="101" y="113" textAnchor="middle" className="fill-emerald-900 font-mono text-[9.5px] font-bold dark:fill-emerald-200">2V1 (3/2)</text>
          <text x="101" y="126" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] dark:fill-emerald-400">DC 99% (2S1)</text>

          <line x1="158" y1="115" x2="176" y2="115" stroke="currentColor" strokeWidth="1.5" />
          <rect x="176" y="96" width="114" height="38" rx="5" className="fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/40 dark:stroke-emerald-400" strokeWidth="1.6" />
          <text x="233" y="113" textAnchor="middle" className="fill-emerald-900 font-mono text-[9.5px] font-bold dark:fill-emerald-200">2Z1 (Hamulec)</text>
          <text x="233" y="126" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] dark:fill-emerald-400">DC 75% (1S1)</text>

          {/* Cross-monitoring m */}
          <line x1="167" y1="70" x2="167" y2="96" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="3 2" />
          <text x="176" y="86" className="fill-sky-700 font-mono text-[8.5px] font-bold dark:fill-sky-400">m (1S1 + 2S1)</text>

          {/* Wyjście do 1A1 */}
          <polyline points="290,52 340,52 340,84 378,84" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <polyline points="290,115 340,115 340,84" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <polygon points="378,84 371,80 371,88" fill="currentColor" />
          <text x="406" y="88" textAnchor="middle" className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-300">1A1</text>
        </g>
      )}

      {/* Kat. 3 / PL e — Przykład 25: Kanał 1 (1V1) || Kanał 2 (2V1 -> 2V2/2V3) + m (2S1) */}
      {exampleId === 'ifa_ex25' && (
        <g>
          <text x="230" y="18" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold dark:fill-slate-400">
            Architektura wyznaczona: Kategoria 3 — PL e (MTTFD 98,2 lat · DCavg średnie)
          </text>
          <rect x="40" y="34" width="256" height="36" rx="5" className="fill-sky-50 stroke-sky-600 dark:fill-sky-950/50 dark:stroke-sky-400" strokeWidth="1.6" />
          <text x="168" y="56" textAnchor="middle" className="fill-sky-900 font-mono text-[10px] font-bold dark:fill-sky-200">Kanał 1: O1 = 1V1 (5/3 środek zamkn.)</text>

          <rect x="40" y="96" width="114" height="38" rx="5" className="fill-amber-50 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-400" strokeWidth="1.6" />
          <text x="97" y="113" textAnchor="middle" className="fill-amber-900 font-mono text-[9.5px] font-bold dark:fill-amber-200">2V1 (3/2)</text>
          <text x="97" y="126" textAnchor="middle" className="fill-amber-700 font-mono text-[8px] dark:fill-amber-400">DC 99% (2S1)</text>

          <line x1="154" y1="115" x2="174" y2="115" stroke="currentColor" strokeWidth="1.5" />
          <rect x="174" y="96" width="122" height="38" rx="5" className="fill-amber-50 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-400" strokeWidth="1.6" />
          <text x="235" y="113" textAnchor="middle" className="fill-amber-900 font-mono text-[9.5px] font-bold dark:fill-amber-200">2V2 + 2V3</text>
          <text x="235" y="126" textAnchor="middle" className="fill-amber-700 font-mono text-[8px] dark:fill-amber-400">Zawory odcin. HGL</text>

          <line x1="168" y1="70" x2="168" y2="96" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="3 2" />
          <text x="178" y="86" className="fill-sky-700 font-mono text-[8.5px] font-bold dark:fill-sky-400">m (2S1 + nadzór PLC)</text>

          <polyline points="296,52 344,52 344,84 380,84" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <polyline points="296,115 344,115 344,84" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <polygon points="380,84 373,80 373,88" fill="currentColor" />
          <text x="408" y="88" textAnchor="middle" className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-300">1A1</text>
        </g>
      )}

      {/* Kat. 3 / PL e — Przykład 26 (Rekonstrukcja historyczna) */}
      {exampleId === 'ifa_ex26' && (
        <g>
          <text x="230" y="18" textAnchor="middle" className="fill-amber-700 font-mono text-[9px] font-bold dark:fill-amber-400">
            Schemat historyczny BGIA 2/2008e (Kat. 3 — usunięty w IFA 2/2017e)
          </text>
          <rect x="44" y="36" width="240" height="34" rx="5" className="fill-slate-100 stroke-slate-500 dark:fill-slate-900 dark:stroke-slate-500" strokeDasharray="4 2" strokeWidth="1.5" />
          <text x="164" y="57" textAnchor="middle" className="fill-slate-800 font-mono text-[9.5px] font-bold dark:fill-slate-200">Kanał 1: 1V1 + zewn. czujnik 1S1</text>

          <rect x="44" y="96" width="240" height="34" rx="5" className="fill-slate-100 stroke-slate-500 dark:fill-slate-900 dark:stroke-slate-500" strokeDasharray="4 2" strokeWidth="1.5" />
          <text x="164" y="117" textAnchor="middle" className="fill-slate-800 font-mono text-[9.5px] font-bold dark:fill-slate-200">Kanał 2: 1V2 + zewn. czujnik 1S2</text>

          <line x1="164" y1="70" x2="164" y2="96" stroke="#d97706" strokeWidth="1.4" strokeDasharray="3 2" />
          <text x="174" y="86" className="fill-amber-700 font-mono text-[8.5px] font-bold dark:fill-amber-400">m (pośrednie — DC ≈ 90%)</text>

          <polyline points="284,53 340,53 340,84 378,84" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polyline points="284,113 340,113 340,84" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="378,84 371,80 371,88" fill="currentColor" />
          <text x="406" y="88" textAnchor="middle" className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-300">1A1</text>
        </g>
      )}

      {/* Kat. 4 / PL e — Przykład 31: Kanał 1 (1V1) || Kanał 2 (1V2) + ciągły bezpośredni cross-monitoring m (DC 99%) */}
      {exampleId === 'ifa_ex31' && (
        <g>
          <text x="230" y="18" textAnchor="middle" className="fill-emerald-700 font-mono text-[9px] font-bold dark:fill-emerald-400">
            Architektura wyznaczona: Kategoria 4 — PL e (Ciągły monitoring m · DC = 99%)
          </text>
          <rect x="44" y="34" width="246" height="36" rx="5" className="fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/50 dark:stroke-emerald-400" strokeWidth="1.8" />
          <text x="167" y="56" textAnchor="middle" className="fill-emerald-900 font-mono text-[10px] font-bold dark:fill-emerald-200">Kanał 1: 1V1 (3/2 + czujnik suwaka G)</text>

          <rect x="44" y="96" width="246" height="36" rx="5" className="fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/50 dark:stroke-emerald-400" strokeWidth="1.8" />
          <text x="167" y="118" textAnchor="middle" className="fill-emerald-900 font-mono text-[10px] font-bold dark:fill-emerald-200">Kanał 2: 1V2 (3/2 + czujnik suwaka G)</text>

          {/* Ciągła linia wzajemnego monitorowania Kat. 4 (pogrubiona) */}
          <line x1="167" y1="70" x2="167" y2="96" stroke="#059669" strokeWidth="2.4" />
          <polygon points="167,70 163,76 171,76" fill="#059669" />
          <polygon points="167,96 163,90 171,90" fill="#059669" />
          <text x="178" y="86" className="fill-emerald-700 font-mono text-[8.5px] font-bold dark:fill-emerald-400">m ciągłe (DC = 99%, Kat. 4)</text>

          <polyline points="290,52 340,52 340,84 378,84" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <polyline points="290,114 340,114 340,84" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="378,84 371,80 371,88" fill="currentColor" />
          <text x="406" y="88" textAnchor="middle" className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-300">1A1</text>
        </g>
      )}
    </svg>
  );
}
