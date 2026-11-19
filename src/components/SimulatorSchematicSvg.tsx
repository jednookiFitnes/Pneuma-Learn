import type {
  CircuitTemplateId,
  LineFluidState,
  SimulationMode,
  SimulationStateOutput,
} from '../utils/simulatorEngine';
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

interface SimulatorSchematicSvgProps {
  templateId: CircuitTemplateId;
  mode: SimulationMode;
  mechLockEnabled: boolean;
  sim: SimulationStateOutput;
  title: string;
}

function lineColor(state: LineFluidState): string {
  switch (state) {
    case 'supply':
      return '#dc2626';
    case 'exhaust':
      return '#16a34a';
    case 'pilot':
      return '#0284c7';
    case 'trapped':
      return '#d97706';
    case 'neutral':
    default:
      return '#94a3b8';
  }
}

export function SimulatorSchematicSvg({
  templateId,
  mode,
  mechLockEnabled,
  sim,
  title,
}: SimulatorSchematicSvgProps) {
  const workACol = lineColor(sim.lines.workLineA);
  const workBCol = lineColor(sim.lines.workLineB);
  const pilot1Col = lineColor(sim.lines.pilotCh1);
  const pilot2Col = lineColor(sim.lines.pilotCh2);
  const isNormal = mode === 'normal';
  const isFault = mode === 'single_fault';

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 740 310"
        className="h-auto w-full min-w-[580px] text-slate-900 dark:text-slate-100"
        role="img"
        aria-label={`Schemat ISO 1219-1 symulatora: ${title}`}
      >
        <rect
          x="4"
          y="4"
          width="732"
          height="302"
          rx="10"
          className="fill-slate-50 stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-800"
        />

        {/* ================================================================= */}
        {/* 1. MS6-SV: Źródło P1 -> FRL -> MS6-SV (2x 3/2) -> Zawór 5/2 -> Siłownik */}
        {/* ================================================================= */}
        {templateId === 'ms6_sv_exhaust' && (
          <g>
            {/* Źródło P1 (6 bar) */}
            <AirSourceSymbol x={28} y={248} color="#dc2626" />
            <text x="28" y="271" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-semibold dark:fill-slate-300">
              P1: {sim.supplyPressureBar.toFixed(1)} bar
            </text>
            <line x1="38" y1="248" x2="54" y2="248" stroke="#dc2626" strokeWidth="2.2" />

            {/* FRL */}
            <FrlUnitSymbol x={56} y={222} scale={0.78} includeLubricator={false} lineColor="#dc2626" />
            <text x="90" y="280" textAnchor="middle" className="fill-slate-500 font-mono text-[8.5px] dark:fill-slate-400">
              0Z1 (FRL)
            </text>

            {/* Linia zasilająca FRL -> MS6-SV wejście P1 */}
            <polyline points="130,248 156,248 156,227 166,227" fill="none" stroke="#dc2626" strokeWidth="2.4" />

            {/* Dwukanałowy zawór bezpieczeństwa MS6-SV (2× 3/2 szeregowo-równolegle z łagodnym startem i czujnikami) */}
            <DualSafety32BlockSymbol
              x={166}
              y={136}
              scale={0.88}
              ch1Active={isNormal || isFault}
              ch2Active={isNormal}
              ch1Fault={isFault}
              ch2Fault={false}
              withSoftStart
            />
            <text x="237" y="130" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              0V1 — Blok MS6-SV (2× 3/2 Kat. 4)
            </text>
            <text
              x="237"
              y="255"
              textAnchor="middle"
              className={`font-mono text-[8.5px] font-bold ${
                sim.sensorFeedbackOk ? 'fill-sky-700 dark:fill-sky-400' : 'fill-rose-600 dark:fill-rose-400'
              }`}
            >
              {sim.sensorFeedbackOk ? 'Kontrola suwaków: OK' : 'BŁĄD: Suwak A zacięty!'}
            </text>

            {/* Linia zasilania za MS6-SV -> Port 1 zaworu roboczego 5/2 (czerwona w normalnej, zielona po odpowietrzeniu!) */}
            <polyline
              points="309,141 334,141 334,254 424,254 424,234"
              fill="none"
              stroke={isNormal ? '#dc2626' : '#16a34a'}
              strokeWidth="2.5"
            />
            <text x="366" y="266" textAnchor="middle" className="fill-slate-600 font-mono text-[8.5px] dark:fill-slate-400">
              P2: {isNormal ? '6.0 bar' : '0.0 bar (SDE)'}
            </text>

            {/* Zawór roboczy 5/2 (1V1) na linii do siłownika */}
            <Valve52Symbol
              x={364}
              y={186}
              size={40}
              active={isNormal}
              supplyActive={isNormal}
              showPortNumbers
            />
            <text x="342" y="236" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V1 (5/2)
            </text>

            {/* Port 4 (x=415.2) -> LEWY króciec siłownika (x=512), Port 2 (x=432.8) -> PRAWY króciec siłownika (x=642) */}
            <polyline
              points="415.2,178 415.2,130 512,130 512,96"
              fill="none"
              stroke={workACol}
              strokeWidth="2.5"
            />
            <polyline
              points="432.8,178 432.8,144 642,144 642,96"
              fill="none"
              stroke={workBCol}
              strokeWidth="2.5"
            />

            {/* Siłownik dwustronnego działania */}
            <DoubleActingCylinderSymbol
              x={502}
              y={28}
              width={150}
              height={56}
              extensionPct={sim.cylinderExtensionPct}
              leftChamberColor={workACol}
              rightChamberColor={workBCol}
              portSide="bottom"
            />
            <text x="577" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 · Komora A: {sim.chamberABar.toFixed(1)} bar · Komora B: {sim.chamberBBar.toFixed(1)} bar
            </text>
          </g>
        )}

        {/* ================================================================= */}
        {/* 2. STEROWANIE OBURĘCZNE: FRL -> 2x SV/O (3/2) -> ZSB-1/8 -> 5/2 -> Siłownik */}
        {/* ================================================================= */}
        {templateId === 'two_hand_zsb' && (
          <g>
            <AirSourceSymbol x={28} y={248} color="#dc2626" />
            <line x1="38" y1="248" x2="54" y2="248" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={222} scale={0.78} includeLubricator={false} lineColor="#dc2626" />

            {/* Rozgałęzienie zasilania do przycisków SV/O i zaworu 5/2 */}
            <polyline points="130,248 416,248 416,232" fill="none" stroke="#dc2626" strokeWidth="2.4" />
            <polyline points="142,248 142,162 121,162" fill="none" stroke="#dc2626" strokeWidth="1.8" />
            <polyline points="142,162 142,102 121,102" fill="none" stroke="#dc2626" strokeWidth="1.8" />

            {/* Przycisk Lewy SV/O (3/2) */}
            <Valve32Symbol
              x={84}
              y={66}
              size={28}
              actuator="pushbutton"
              active={isNormal || isFault}
              fault={isFault}
              showPortNumbers={false}
            />
            <text x="54" y="60" className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-300">
              1S1 (SV/O Lewy)
            </text>

            {/* Przycisk Prawy SV/O (3/2) */}
            <Valve32Symbol
              x={84}
              y={128}
              size={28}
              actuator="pushbutton"
              active={isNormal}
              showPortNumbers={false}
            />
            <text x="54" y="122" className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-300">
              1S2 (SV/O Prawy)
            </text>

            {/* Sygnały pilotowe do bloku jednoczesności ZSB-1/8 */}
            <polyline
              points="120.4,58 120.4,50 198,50 198,94 212,94"
              fill="none"
              stroke={pilot1Col}
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <polyline
              points="120.4,120 120.4,116 212,116"
              fill="none"
              stroke={pilot2Col}
              strokeWidth="2"
              strokeDasharray="5 3"
            />

            {/* Blok jednoczesności ZSB-1/8 (bramka AND + czasówka ≤ 200 ms) */}
            <g transform="translate(212, 74)">
              <rect
                x="0"
                y="0"
                width="76"
                height="62"
                rx="4"
                className={isFault ? 'fill-rose-500/10' : 'fill-white dark:fill-slate-900'}
                stroke={isFault ? '#dc2626' : 'currentColor'}
                strokeWidth="1.6"
              />
              <line x1="38" y1="0" x2="38" y2="62" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
              {/* Bramka AND */}
              <path d="M 10 21 L 20 21 A 10 10 0 0 1 20 41 L 10 41 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {/* Klepsydra (okno jednoczesności) */}
              <polygon points="48,18 66,18 57,31" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <polygon points="48,44 66,44 57,31" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </g>
            <text x="250" y="66" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V2 — ZSB-1/8 (≤ 200 ms)
            </text>
            <text
              x="250"
              y="150"
              textAnchor="middle"
              className={`font-mono text-[8.5px] font-bold ${
                isFault ? 'fill-rose-600 dark:fill-rose-400' : 'fill-sky-700 dark:fill-sky-400'
              }`}
            >
              {isFault ? 'Δt > 200 ms: ZABLOKOWANY' : isNormal ? 'Jednoczesność OK' : 'Brak sygnału startu'}
            </text>

            {/* Wyjście pilotowe ZSB -> Pilot 14 zaworu 5/2 */}
            <polyline
              points="288,105 322,105 322,204 340,204"
              fill="none"
              stroke={isNormal ? '#0284c7' : '#94a3b8'}
              strokeWidth="2.2"
              strokeDasharray="5 3"
            />

            {/* Zawór roboczy 5/2 sterowany pneumatycznie */}
            <Valve52Symbol
              x={356}
              y={184}
              size={40}
              actuator="pilot"
              active={isNormal}
              supplyActive
              showPortNumbers
            />
            <text x="396" y="246" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V1 (5/2)
            </text>

            {/* Port 4 -> lewy króciec, Port 2 -> prawy króciec */}
            <polyline
              points="407.2,176 407.2,126 512,126 512,96"
              fill="none"
              stroke={workACol}
              strokeWidth="2.5"
            />
            <polyline
              points="424.8,176 424.8,142 642,142 642,96"
              fill="none"
              stroke={workBCol}
              strokeWidth="2.5"
            />

            <DoubleActingCylinderSymbol
              x={502}
              y={28}
              width={150}
              height={56}
              extensionPct={sim.cylinderExtensionPct}
              leftChamberColor={workACol}
              rightChamberColor={workBCol}
              portSide="bottom"
            />
            <text x="577" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 · Komora A: {sim.chamberABar.toFixed(1)} bar · Komora B: {sim.chamberBBar.toFixed(1)} bar
            </text>
          </g>
        )}

        {/* ================================================================= */}
        {/* 3. OŚ PIONOWA: FRL -> 5/3 zamkn. + 2x HGL + Siłownik + Hamulec DNCKE */}
        {/* ================================================================= */}
        {templateId === 'vertical_axis_hgl_dncke' && (
          <g>
            <AirSourceSymbol x={28} y={248} color="#dc2626" />
            <line x1="38" y1="248" x2="54" y2="248" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={222} scale={0.78} includeLubricator={false} lineColor="#dc2626" />

            {/* Linia zasilania do 5/3 oraz zaworu pilota 3/2 dla HGL + DNCKE */}
            <polyline points="130,248 256,248 256,232" fill="none" stroke="#dc2626" strokeWidth="2.4" />
            <polyline points="256,248 398,248 398,240" fill="none" stroke="#dc2626" strokeWidth="2" />

            {/* Zawór 5/3 (3 kwadraty, środek zamknięty) */}
            <Valve53Symbol
              x={200}
              y={186}
              size={37}
              centerType="closed"
              position={isNormal ? 'left' : 'center'}
              fault={isFault}
              showPortNumbers
            />
            <text x="256" y="176" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
              1V1 (5/3 środek zamknięty)
            </text>

            {/* Zawór 3/2 sterujący odblokowaniem HGL oraz hamulca DNCKE */}
            <Valve32Symbol
              x={360}
              y={202}
              size={30}
              active={isNormal}
              showPortNumbers={false}
            />
            <text x="390" y="256" textAnchor="middle" className="fill-slate-600 font-mono text-[8.5px] font-bold dark:fill-slate-400">
              2V1 (Pilot HGL/DNCKE)
            </text>

            {/* Przerywana linia pilota z 2V1 do obu HGL oraz do jednostki DNCKE */}
            <polyline
              points="399,194 399,154 456,154 456,138"
              fill="none"
              stroke={pilot2Col}
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
            <polyline
              points="456,154 584,154 584,138"
              fill="none"
              stroke={pilot2Col}
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
            {mechLockEnabled && (
              <polyline
                points="584,154 639,154 639,86"
                fill="none"
                stroke={pilot2Col}
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />
            )}

            {/* Przewód Port 4 (x=247.4) -> HGL A -> LEWY króciec siłownika (x=474) */}
            <polyline
              points="247.4,178 247.4,128 474,128 474,108"
              fill="none"
              stroke={workACol}
              strokeWidth="2.5"
              strokeDasharray={isFault ? '6 4' : undefined}
            />
            <line x1="474" y1="108" x2="474" y2="94" stroke={workACol} strokeWidth="2.5" />

            {/* Oznaczenie pęknięcia przewodu przy usterce */}
            {isFault && (
              <g transform="translate(338, 128)">
                <line x1="-7" y1="-7" x2="7" y2="7" stroke="#dc2626" strokeWidth="2.5" />
                <line x1="7" y1="-7" x2="-7" y2="7" stroke="#dc2626" strokeWidth="2.5" />
                <text x="0" y="-12" textAnchor="middle" className="fill-rose-600 font-mono text-[8.5px] font-bold dark:fill-rose-400">
                  PĘKNIĘCIE!
                </text>
              </g>
            )}

            {/* Przewód Port 2 (x=263.6) -> HGL B -> PRAWY króciec siłownika (x=602) */}
            <polyline
              points="263.6,178 263.6,140 602,140 602,108"
              fill="none"
              stroke={workBCol}
              strokeWidth="2.5"
            />
            <line x1="602" y1="108" x2="602" y2="94" stroke={workBCol} strokeWidth="2.5" />

            {/* Dwa sterowane zawory zwrotne HGL-1/4-B bezpośrednio przy króćcach siłownika */}
            <PilotCheckValveSymbol
              x={474}
              y={114}
              orientation="vertical"
              pilotActive={isNormal}
              flowColor={workACol}
              scale={0.82}
            />
            <text x="444" y="116" textAnchor="end" className="fill-amber-700 font-mono text-[8.5px] font-bold dark:fill-amber-400">
              HGL A
            </text>

            <PilotCheckValveSymbol
              x={602}
              y={114}
              orientation="vertical"
              pilotActive={isNormal}
              flowColor={workBCol}
              scale={0.82}
            />
            <text x="572" y="116" textAnchor="end" className="fill-amber-700 font-mono text-[8.5px] font-bold dark:fill-amber-400">
              HGL B
            </text>

            {/* Siłownik + opcjonalna jednostka hamująca DNCKE-S */}
            <DoubleActingCylinderSymbol
              x={464}
              y={26}
              width={148}
              height={56}
              extensionPct={sim.cylinderExtensionPct}
              leftChamberColor={workACol}
              rightChamberColor={workBCol}
              withBrake={mechLockEnabled}
              brakeEngaged={sim.mechBrakeEngaged}
              portSide="bottom"
            />
            <text x="546" y="18" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              1A1 (Oś pionowa) · {mechLockEnabled ? (sim.mechBrakeEngaged ? 'DNCKE ZACIŚNIĘTY' : 'DNCKE OTWARTY') : 'BRAK HAMULCA'}
            </text>
          </g>
        )}

        {/* ================================================================= */}
        {/* 4. BLOK PRASOWY VOFA: FRL -> VOFA (2x 3/2 + czujniki G) -> Siłownik */}
        {/* ================================================================= */}
        {templateId === 'press_vofa_dual' && (
          <g>
            <AirSourceSymbol x={28} y={248} color="#dc2626" />
            <line x1="38" y1="248" x2="54" y2="248" stroke="#dc2626" strokeWidth="2.2" />
            <FrlUnitSymbol x={56} y={222} scale={0.78} includeLubricator={false} lineColor="#dc2626" />

            {/* Linia zasilania do bloku VOFA */}
            <polyline points="130,248 190,248 190,234 202,234" fill="none" stroke="#dc2626" strokeWidth="2.5" />

            {/* Dwukanałowy blok VOFA (2× 3/2 szeregowo-równolegle z indukcyjnymi czujnikami położenia suwaka G) */}
            <DualSafety32BlockSymbol
              x={202}
              y={132}
              scale={0.96}
              ch1Active={isNormal || isFault}
              ch2Active={isNormal}
              ch1Fault={isFault}
              ch2Fault={false}
              withSoftStart={false}
            />
            <text x="280" y="124" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              Blok VOFA (2× 3/2 + Indukcyjne czujniki suwaków)
            </text>

            {/* Moduł diagnostyczny F-PLC porównujący czujniki G w oknie Δt */}
            <g transform="translate(390, 174)">
              <rect
                x="0"
                y="0"
                width="96"
                height="58"
                rx="4"
                className={sim.sensorFeedbackOk ? 'fill-sky-500/10' : 'fill-rose-500/15'}
                stroke={sim.sensorFeedbackOk ? '#0284c7' : '#dc2626'}
                strokeWidth="1.5"
              />
              <text x="48" y="22" textAnchor="middle" className="fill-slate-800 font-mono text-[9px] font-bold dark:fill-slate-100">
                F-PLC (Δt)
              </text>
              <text
                x="48"
                y="40"
                textAnchor="middle"
                className={`font-mono text-[8.5px] font-bold ${
                  sim.sensorFeedbackOk ? 'fill-emerald-700 dark:fill-emerald-400' : 'fill-rose-600 dark:fill-rose-400'
                }`}
              >
                {sim.sensorFeedbackOk ? 'DC ≥ 99% OK' : 'BŁĄD KANAŁU 1'}
              </text>
            </g>
            {/* Przewody diagnostyczne od czujników suwaków do F-PLC */}
            <polyline
              points="357,159 374,159 374,192 390,192"
              fill="none"
              stroke={isFault ? '#dc2626' : '#0284c7'}
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <polyline
              points="357,211 390,211"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />

            {/* Wyjście robocze z VOFA -> LEWY króciec siłownika prasy (komora robocza A) */}
            <polyline
              points="358,138 512,138 512,96"
              fill="none"
              stroke={workACol}
              strokeWidth="2.6"
            />
            {/* Komora prawa siłownika połączona z odpowietrzeniem */}
            <polyline
              points="642,96 642,148 666,148"
              fill="none"
              stroke={workBCol}
              strokeWidth="2.2"
            />

            <DoubleActingCylinderSymbol
              x={502}
              y={28}
              width={150}
              height={56}
              extensionPct={sim.cylinderExtensionPct}
              leftChamberColor={workACol}
              rightChamberColor={workBCol}
              portSide="bottom"
            />
            <text x="577" y="20" textAnchor="middle" className="fill-slate-700 font-mono text-[9.5px] font-bold dark:fill-slate-300">
              Siłownik / Sprzęgło prasy · A: {sim.chamberABar.toFixed(1)} bar
            </text>
          </g>
        )}

        {/* Legenda kolorów ISO 1219 na dole po prawej */}
        <g transform="translate(466, 246)">
          <rect
            x="0"
            y="0"
            width="256"
            height="48"
            rx="6"
            className="fill-white/90 stroke-slate-200 dark:fill-slate-900/90 dark:stroke-slate-800"
          />
          <line x1="10" y1="15" x2="30" y2="15" stroke="#dc2626" strokeWidth="2.6" />
          <text x="35" y="18" className="fill-slate-700 text-[9px] dark:fill-slate-300">Zasilanie (6 bar)</text>

          <line x1="130" y1="15" x2="150" y2="15" stroke="#16a34a" strokeWidth="2.6" />
          <text x="155" y="18" className="fill-slate-700 text-[9px] dark:fill-slate-300">Odpowietrzenie</text>

          <line x1="10" y1="34" x2="30" y2="34" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
          <text x="35" y="37" className="fill-slate-700 text-[9px] dark:fill-slate-300">Sygnał sterujący</text>

          <line x1="130" y1="34" x2="150" y2="34" stroke="#d97706" strokeWidth="2.6" />
          <text x="155" y="37" className="fill-slate-700 text-[9px] dark:fill-slate-300">Powietrze uwięzione</text>
        </g>
      </svg>
    </div>
  );
}
