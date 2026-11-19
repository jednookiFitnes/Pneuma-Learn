import React from 'react';

export type FluidColorState = 'supply' | 'exhaust' | 'pilot' | 'trapped' | 'neutral';

export function fluidHex(state: FluidColorState): string {
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
      return 'currentColor';
  }
}

/** Mały wektorowy grot strzałki ISO 1219 (kierunek w stopniach: 0 = prawo, -90 = góra, 90 = dół, 180 = lewo) */
export function IsoArrowHead({
  x,
  y,
  angleDeg,
  color = 'currentColor',
  size = 5,
}: {
  x: number;
  y: number;
  angleDeg: number;
  color?: string;
  size?: number;
}) {
  return (
    <polygon
      points={`0,0 ${-size},${-size * 0.55} ${-size},${size * 0.55}`}
      fill={color}
      stroke="none"
      transform={`translate(${x}, ${y}) rotate(${angleDeg})`}
    />
  );
}

/** Wektorowa linia przepływu z grotem */
function FlowArrow({
  x1,
  y1,
  x2,
  y2,
  color = 'currentColor',
  strokeWidth = 1.5,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
}) {
  const angleDeg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth} />
      <IsoArrowHead x={x2} y={y2} angleDeg={angleDeg} color={color} size={4.8} />
    </g>
  );
}

/** Symbol zaślepki T (odcięty port w zaworze ISO 1219) */
function BlockedPortT({
  x,
  y,
  direction,
  color = 'currentColor',
}: {
  x: number;
  y: number;
  direction: 'up' | 'down';
  color?: string;
}) {
  const stemEnd = direction === 'up' ? y - 7 : y + 7;
  return (
    <g stroke={color} strokeWidth="1.5">
      <line x1={x} y1={y} x2={x} y2={stemEnd} />
      <line x1={x - 4} y1={stemEnd} x2={x + 4} y2={stemEnd} />
    </g>
  );
}

/** Symbol odpowietrzenia / tłumika (trójkąt ISO 1219) */
export function ExhaustTriangle({
  x,
  y,
  color = 'currentColor',
  withMuffler = true,
  direction = 'down',
}: {
  x: number;
  y: number;
  color?: string;
  withMuffler?: boolean;
  direction?: 'down' | 'right' | 'left';
}) {
  const rot = direction === 'down' ? 0 : direction === 'right' ? -90 : 90;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`} stroke={color} strokeWidth="1.4" fill="none">
      <line x1="0" y1="0" x2="0" y2="6" />
      <polygon points="-4.5,6 4.5,6 0,13" />
      {withMuffler && (
        <>
          <line x1="-2.5" y1="15.5" x2="2.5" y2="15.5" strokeDasharray="1.5 1.5" />
          <line x1="-4" y1="18" x2="4" y2="18" strokeDasharray="1.5 1.5" />
        </>
      )}
    </g>
  );
}

/** 1. Źródło sprężonego powietrza wg ISO 1219-1 (kółko z trójkątem kierunku przepływu) */
export function AirSourceSymbol({
  x,
  y,
  direction = 'right',
  color = '#dc2626',
  filled = false,
}: {
  x: number;
  y: number;
  direction?: 'right' | 'up';
  color?: string;
  filled?: boolean;
}) {
  const rot = direction === 'up' ? -90 : 0;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <circle cx="0" cy="0" r="10" fill="none" stroke={color} strokeWidth="1.5" />
      <polygon
        points="-4,-4.5 -4,4.5 5.5,0"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.4"
      />
    </g>
  );
}

/** 2. Zespół przygotowania powietrza FRL wg ISO 1219-1 (Filtr + Reduktor z manometrem + Smarownica w ramce przerywanej) */
export function FrlUnitSymbol({
  x,
  y,
  scale = 1,
  includeLubricator = true,
  lineColor = '#dc2626',
}: {
  x: number;
  y: number;
  scale?: number;
  includeLubricator?: boolean;
  lineColor?: string;
}) {
  const frameWidth = includeLubricator ? 124 : 88;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="text-slate-900 dark:text-slate-100">
      {/* Zewnętrzna ramka przerywana zespołu FRL (obejmuje manometr i spust kondensatu) */}
      <rect
        x="0"
        y="-4"
        width={frameWidth}
        height="64"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.7"
      />

      {/* Przewód główny przechodzący przez FRL (y = 32) */}
      <line x1="-6" y1="32" x2="10" y2="32" stroke={lineColor} strokeWidth="1.6" />
      <line x1="34" y1="32" x2="48" y2="32" stroke={lineColor} strokeWidth="1.6" />
      {includeLubricator ? (
        <>
          <line x1="74" y1="32" x2="90" y2="32" stroke={lineColor} strokeWidth="1.6" />
          <line x1="114" y1="32" x2={frameWidth + 6} y2="32" stroke={lineColor} strokeWidth="1.6" />
        </>
      ) : (
        <line x1="74" y1="32" x2={frameWidth + 6} y2="32" stroke={lineColor} strokeWidth="1.6" />
      )}

      {/* FILTR: romb + pionowa linia przerywana wkładu + dolny odstojnik kondensatu */}
      <g transform="translate(22, 32)">
        <polygon
          points="0,-12 12,0 0,12 -12,0"
          className="fill-white dark:fill-slate-900"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Wkład filtracyjny */}
        <line x1="0" y1="-10" x2="0" y2="8" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 2" />
        {/* Przegroda odstojnika kondensatu */}
        <line x1="-6" y1="6.5" x2="6" y2="6.5" stroke="currentColor" strokeWidth="1.3" />
        {/* Króciec spustu kondensatu */}
        <line x1="0" y1="12" x2="0" y2="20" stroke="currentColor" strokeWidth="1.4" />
        <IsoArrowHead x={0} y={20} angleDeg={90} color="currentColor" size={4} />
      </g>

      {/* REDUKTOR CIŚNIENIA: kwadrat ze strzałką + linia sprzężenia zwrotnego + sprężyna nastawcza + manometr u góry */}
      <g transform="translate(48, 20)">
        {/* Manometr nad reduktorem */}
        <line x1="13" y1="0" x2="13" y2="-5" stroke="currentColor" strokeWidth="1.3" />
        <circle
          cx="13"
          cy="-12"
          r="7"
          className="fill-white dark:fill-slate-900"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line x1="9.5" y1="-8.5" x2="16.5" y2="-15.5" stroke="currentColor" strokeWidth="1.2" />
        <IsoArrowHead x={16.5} y={-15.5} angleDeg={-45} color="currentColor" size={3.2} />

        {/* Kwadrat reduktora */}
        <rect
          x="0"
          y="0"
          width="26"
          height="24"
          className="fill-white dark:fill-slate-900"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Strzałka przepływu w reduktorze */}
        <FlowArrow x1={4} y1={12} x2={22} y2={12} color={lineColor} strokeWidth={1.5} />

        {/* Odpowietrzenie wtórne reduktora (trójkąt z boku / dół) */}
        <polygon points="10,24 16,24 13,29" fill="none" stroke="currentColor" strokeWidth="1.2" />

        {/* Przerywana linia sprzężenia zwrotnego od strony wtórnej do dołu kwadratu */}
        <polyline
          points="29,12 29,29 21,29 21,24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
        />

        {/* Sprężyna nastawcza po lewej/dole ze skośną strzałką regulacji */}
        <polyline
          points="4,24 2,27 7,29 2,31 7,33 4,35"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line x1="-1" y1="34" x2="10" y2="25" stroke="currentColor" strokeWidth="1.2" />
        <IsoArrowHead x={10} y={25} angleDeg={-40} color="currentColor" size={3.2} />
      </g>

      {/* SMAROWNICA (opcjonalna): romb z pionową kreską kropelkową u góry */}
      {includeLubricator && (
        <g transform="translate(102, 32)">
          <polygon
            points="0,-12 12,0 0,12 -12,0"
            className="fill-white dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line x1="0" y1="-11" x2="0" y2="-2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="0" cy="2" r="1.4" fill="currentColor" />
        </g>
      )}
    </g>
  );
}

/** Elementy napędu zaworu (cewka elektromagnetyczna + pilot / przycisk / sprężyna / czujnik położenia suwaka G) */
export function SolenoidPilotActuator({
  x,
  y,
  side,
  active = false,
  withPilotTriangle = true,
  withManualOverride = false,
  portLabel,
}: {
  x: number;
  y: number;
  side: 'left' | 'right';
  active?: boolean;
  withPilotTriangle?: boolean;
  withManualOverride?: boolean;
  portLabel?: string;
}) {
  const strokeColor = active ? '#0284c7' : 'currentColor';
  const fillClass = active ? 'fill-sky-500/15' : 'fill-white dark:fill-slate-900';

  if (side === 'left') {
    const pilotW = withPilotTriangle ? 12 : 0;
    const coilW = 18;
    const totalW = pilotW + coilW;
    return (
      <g transform={`translate(${x - totalW}, ${y})`}>
        {withManualOverride && (
          <g stroke="currentColor" strokeWidth="1.3" fill="none">
            <line x1="-9" y1="7" x2="0" y2="7" />
            <line x1="-9" y1="3" x2="-9" y2="11" />
          </g>
        )}
        {/* Cewka elektromagnetyczna (prostokąt ze skośną kreską) */}
        <rect x="0" y="0" width={coilW} height="14" className={fillClass} stroke={strokeColor} strokeWidth="1.5" />
        <line x1="5" y1="14" x2="13" y2="0" stroke={strokeColor} strokeWidth="1.5" />
        {/* Wspomaganie pilotowe (kwadrat z trójkątem) */}
        {withPilotTriangle && (
          <g>
            <rect x={coilW} y="0" width={pilotW} height="14" className={fillClass} stroke={strokeColor} strokeWidth="1.5" />
            <polygon points={`${coilW + 3},4 ${coilW + 3},10 ${coilW + 9},7`} fill="none" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        )}
        {portLabel && (
          <text x={totalW / 2} y="-4" textAnchor="middle" className="fill-slate-600 font-mono text-[8.5px] font-semibold dark:fill-slate-400">
            {portLabel}
          </text>
        )}
      </g>
    );
  }

  // prawa strona
  const pilotW = withPilotTriangle ? 12 : 0;
  const coilW = 18;
  const totalW = pilotW + coilW;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {withPilotTriangle && (
        <g>
          <rect x="0" y="0" width={pilotW} height="14" className={fillClass} stroke={strokeColor} strokeWidth="1.5" />
          <polygon points={`${pilotW - 3},4 ${pilotW - 3},10 ${pilotW - 9},7`} fill="none" stroke={strokeColor} strokeWidth="1.2" />
        </g>
      )}
      <rect x={pilotW} y="0" width={coilW} height="14" className={fillClass} stroke={strokeColor} strokeWidth="1.5" />
      <line x1={pilotW + 5} y1="14" x2={pilotW + 13} y2="0" stroke={strokeColor} strokeWidth="1.5" />
      {portLabel && (
        <text x={totalW / 2} y="-4" textAnchor="middle" className="fill-slate-600 font-mono text-[8.5px] font-semibold dark:fill-slate-400">
          {portLabel}
        </text>
      )}
    </g>
  );
}

export function SpringReturnActuator({
  x,
  y,
  side = 'right',
  width = 20,
}: {
  x: number;
  y: number;
  side?: 'left' | 'right';
  width?: number;
}) {
  const dir = side === 'right' ? 1 : -1;
  const step = width / 5;
  const pts = [
    `${x},${y}`,
    `${x + dir * step * 0.7},${y - 5}`,
    `${x + dir * step * 1.8},${y + 5}`,
    `${x + dir * step * 2.9},${y - 5}`,
    `${x + dir * step * 4.0},${y + 5}`,
    `${x + dir * width},${y}`,
  ].join(' ');
  return <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" />;
}

export function PushbuttonActuator({
  x,
  y,
  active = false,
  withCollar = true,
}: {
  x: number;
  y: number;
  active?: boolean;
  withCollar?: boolean;
}) {
  const color = active ? '#0284c7' : 'currentColor';
  return (
    <g transform={`translate(${x}, ${y})`} stroke={color} strokeWidth="1.5" fill="none">
      {/* Trzpień */}
      <line x1="-14" y1="-3" x2="0" y2="-3" />
      <line x1="-14" y1="3" x2="0" y2="3" />
      {/* Grzybek przycisku */}
      <path d="M -14 -8 C -20 -8 -20 8 -14 8 Z" className={active ? 'fill-sky-500/20' : 'fill-white dark:fill-slate-900'} />
      {/* Kołnierz ochronny EN 574 */}
      {withCollar && (
        <>
          <polyline points="-10,-11 -21,-11 -21,-7" strokeWidth="1.3" />
          <polyline points="-10,11 -21,11 -21,7" strokeWidth="1.3" />
        </>
      )}
    </g>
  );
}

/** Czujnik położenia suwaka (indukcyjny / stykowy z symbolem G / cewką zbliżeniową wg ISO 1219 / Festo) */
export function SpoolPositionSensor({
  x,
  y,
  ok = true,
  fault = false,
  label,
}: {
  x: number;
  y: number;
  ok?: boolean;
  fault?: boolean;
  label?: string;
}) {
  const color = fault ? '#dc2626' : ok ? '#0284c7' : 'currentColor';
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Linia sprzężenia mechanicznego ze suwakiem */}
      <line x1="0" y1="0" x2="10" y2="0" stroke={color} strokeWidth="1.3" strokeDasharray="2.5 2" />
      {/* Kwadrat czujnika indukcyjnego */}
      <rect
        x="10"
        y="-9"
        width="18"
        height="18"
        className={fault ? 'fill-rose-500/20' : ok ? 'fill-sky-500/10' : 'fill-white dark:fill-slate-900'}
        stroke={color}
        strokeWidth="1.4"
      />
      {/* Romb czujnika zbliżeniowego / symbol G */}
      <polygon points="19,-6 25,0 19,6 13,0" fill="none" stroke={color} strokeWidth="1.1" />
      <text x="19" y="3" textAnchor="middle" fill={color} className="font-mono text-[7.5px] font-bold" stroke="none">
        G
      </text>
      {label && (
        <text x="19" y="18" textAnchor="middle" fill={color} className="font-mono text-[8px] font-semibold" stroke="none">
          {label}
        </text>
      )}
    </g>
  );
}

/** 3A. Zawór kierunkowy 3/2 (dwa kwadraty ISO 1219-1, bez tekstu dróg przepływu!) */
export function Valve32Symbol({
  x,
  y,
  active = false,
  fault = false,
  actuator = 'solenoid',
  showExhaustTriangle = true,
  showPortNumbers = true,
  withSpoolSensor = false,
  sensorOk = true,
  supplyColor = '#dc2626',
  exhaustColor = '#16a34a',
  size = 34,
}: {
  x: number;
  y: number;
  active?: boolean;
  fault?: boolean;
  actuator?: 'solenoid' | 'pushbutton' | 'pilot';
  showExhaustTriangle?: boolean;
  showPortNumbers?: boolean;
  withSpoolSensor?: boolean;
  sensorOk?: boolean;
  supplyColor?: string;
  exhaustColor?: string;
  size?: number;
}) {
  const s = size;
  const frameStroke = fault ? '#dc2626' : 'currentColor';
  // Aktywny kwadrat: lewy (wysterowany 1->2, 3 blocked) lub prawy (spoczynek 2->3, 1 blocked)
  const leftActive = active;
  const rightActive = !active;

  return (
    <g transform={`translate(${x}, ${y})`} className="text-slate-900 dark:text-slate-100">
      {/* Napęd po lewej stronie */}
      {actuator === 'solenoid' && (
        <SolenoidPilotActuator x={0} y={s / 2 - 7} side="left" active={active} withPilotTriangle />
      )}
      {actuator === 'pushbutton' && <PushbuttonActuator x={0} y={s / 2} active={active} withCollar />}
      {actuator === 'pilot' && (
        <g transform={`translate(-14, ${s / 2 - 7})`}>
          <rect x="0" y="0" width="14" height="14" className="fill-white dark:fill-slate-900" stroke={active ? '#0284c7' : 'currentColor'} strokeWidth="1.5" />
          <polygon points="3,4 3,10 10,7" fill="none" stroke={active ? '#0284c7' : 'currentColor'} strokeWidth="1.2" />
        </g>
      )}

      {/* Kwadrat LEWY (położenie wysterowane: 1→2, port 3 zaślepiony T) */}
      <rect
        x="0"
        y="0"
        width={s}
        height={s}
        className={leftActive ? (fault ? 'fill-rose-500/15' : 'fill-sky-500/10') : 'fill-white dark:fill-slate-900'}
        stroke={frameStroke}
        strokeWidth={leftActive ? 1.8 : 1.4}
      />
      <FlowArrow x1={s * 0.3} y1={s - 2} x2={s * 0.3} y2={3} color={leftActive ? supplyColor : 'currentColor'} />
      <BlockedPortT x={s * 0.72} y={s} direction="up" color="currentColor" />

      {/* Kwadrat PRAWY (położenie spoczynkowe: 2→3, port 1 zaślepiony T) */}
      <rect
        x={s}
        y="0"
        width={s}
        height={s}
        className={rightActive ? 'fill-emerald-500/10' : 'fill-white dark:fill-slate-900'}
        stroke={frameStroke}
        strokeWidth={rightActive ? 1.8 : 1.4}
      />
      <FlowArrow x1={s + s * 0.3} y1={2} x2={s + s * 0.72} y2={s - 3} color={rightActive ? exhaustColor : 'currentColor'} />
      <BlockedPortT x={s + s * 0.3} y={s} direction="up" color="currentColor" />

      {/* Sprężyna powrotna po prawej */}
      <SpringReturnActuator x={s * 2} y={s / 2} side="right" width={18} />

      {/* Opcjonalny czujnik położenia suwaka (jak VOFA / MS6-SV / IFA Ex.31) */}
      {withSpoolSensor && (
        <SpoolPositionSensor x={s * 2 + 18} y={s / 2} ok={sensorOk} fault={fault} />
      )}

      {/* Króćce i oznaczenia portów poza kwadratami (na aktywnym lub spoczynkowym kwadracie wg normy ISO: porty przy pozycji spoczynkowej = prawy kwadrat) */}
      {/* Port 2 (góra prawego kwadratu) */}
      <line x1={s + s * 0.3} y1={0} x2={s + s * 0.3} y2={-8} stroke="currentColor" strokeWidth="1.5" />
      {/* Port 1 (dół lewy prawego kwadratu) */}
      <line x1={s + s * 0.3} y1={s} x2={s + s * 0.3} y2={s + 8} stroke="currentColor" strokeWidth="1.5" />
      {/* Port 3 (dół prawy prawego kwadratu + trójkąt odpowietrzenia) */}
      {showExhaustTriangle ? (
        <ExhaustTriangle x={s + s * 0.72} y={s} color={rightActive ? exhaustColor : 'currentColor'} withMuffler={false} />
      ) : (
        <line x1={s + s * 0.72} y1={s} x2={s + s * 0.72} y2={s + 8} stroke="currentColor" strokeWidth="1.5" />
      )}

      {showPortNumbers && (
        <g className="fill-slate-600 font-mono text-[8.5px] font-bold dark:fill-slate-400" stroke="none">
          <text x={s + s * 0.3 - 6} y={-3}>2</text>
          <text x={s + s * 0.3 - 7} y={s + 10}>1</text>
          <text x={s + s * 0.72 + 6} y={s + 10}>3</text>
        </g>
      )}
    </g>
  );
}

/** 3B. Zawór kierunkowy 5/2 (dwa kwadraty ISO 1219-1: spoczynek 1→2, 4→5, 3 T; wysterowany 1→4, 2→3, 5 T) */
export function Valve52Symbol({
  x,
  y,
  active = false,
  fault = false,
  supplyActive = true,
  actuator = 'solenoid',
  showPortNumbers = true,
  withSpoolSensor = false,
  sensorOk = true,
  size = 42,
}: {
  x: number;
  y: number;
  active?: boolean;
  fault?: boolean;
  supplyActive?: boolean;
  actuator?: 'solenoid' | 'pilot';
  showPortNumbers?: boolean;
  withSpoolSensor?: boolean;
  sensorOk?: boolean;
  size?: number;
}) {
  const s = size;
  const frameStroke = fault ? '#dc2626' : 'currentColor';
  const leftActive = active;
  const rightActive = !active;
  const supplyCol = supplyActive ? '#dc2626' : '#16a34a';
  const exhaustCol = '#16a34a';

  // Położenia 3 portów dolnych (5, 1, 3) i 2 górnych (4, 2) wewnątrz kwadratu szerokości s
  const p5 = s * 0.2;
  const p1 = s * 0.5;
  const p3 = s * 0.8;
  const p4 = s * 0.28;
  const p2 = s * 0.72;

  return (
    <g transform={`translate(${x}, ${y})`} className="text-slate-900 dark:text-slate-100">
      {/* Napęd lewy (port 14) */}
      {actuator === 'solenoid' ? (
        <SolenoidPilotActuator x={0} y={s / 2 - 7} side="left" active={active} withPilotTriangle portLabel="14" />
      ) : (
        <g transform={`translate(-16, ${s / 2 - 7})`}>
          <rect x="0" y="0" width="16" height="14" className="fill-white dark:fill-slate-900" stroke={active ? '#0284c7' : 'currentColor'} strokeWidth="1.5" />
          <polygon points="4,4 4,10 11,7" fill="none" stroke={active ? '#0284c7' : 'currentColor'} strokeWidth="1.2" />
          <text x="8" y="-3" textAnchor="middle" className="fill-slate-600 font-mono text-[8.5px] font-bold dark:fill-slate-400">14</text>
        </g>
      )}

      {/* LEWY KWADRAT (wysterowany 14): 1→4 (zasilanie), 2→3 (odpowietrzenie), port 5 zaślepiony T */}
      <rect
        x="0"
        y="0"
        width={s}
        height={s}
        className={leftActive ? (fault ? 'fill-rose-500/15' : 'fill-sky-500/10') : 'fill-white dark:fill-slate-900'}
        stroke={frameStroke}
        strokeWidth={leftActive ? 1.9 : 1.4}
      />
      <FlowArrow x1={p1} y1={s - 2} x2={p4} y2={3} color={leftActive ? supplyCol : 'currentColor'} />
      <FlowArrow x1={p2} y1={2} x2={p3} y2={s - 3} color={leftActive ? exhaustCol : 'currentColor'} />
      <BlockedPortT x={p5} y={s} direction="up" color="currentColor" />

      {/* PRAWY KWADRAT (spoczynek - sprężyna): 1→2 (zasilanie), 4→5 (odpowietrzenie), port 3 zaślepiony T */}
      <rect
        x={s}
        y="0"
        width={s}
        height={s}
        className={rightActive ? 'fill-sky-500/10' : 'fill-white dark:fill-slate-900'}
        stroke={frameStroke}
        strokeWidth={rightActive ? 1.9 : 1.4}
      />
      <FlowArrow x1={s + p1} y1={s - 2} x2={s + p2} y2={3} color={rightActive ? supplyCol : 'currentColor'} />
      <FlowArrow x1={s + p4} y1={2} x2={s + p5} y2={s - 3} color={rightActive ? exhaustCol : 'currentColor'} />
      <BlockedPortT x={s + p3} y={s} direction="up" color="currentColor" />

      {/* Sprężyna powrotna po prawej */}
      <SpringReturnActuator x={s * 2} y={s / 2} side="right" width={20} />

      {withSpoolSensor && (
        <SpoolPositionSensor x={s * 2 + 20} y={s / 2} ok={sensorOk} fault={fault} />
      )}

      {/* Króćce i tłumiki przypisane do kwadratu spoczynkowego (prawy kwadrat) */}
      {/* Port 4 i Port 2 (góra) */}
      <line x1={s + p4} y1={0} x2={s + p4} y2={-8} stroke="currentColor" strokeWidth="1.5" />
      <line x1={s + p2} y1={0} x2={s + p2} y2={-8} stroke="currentColor" strokeWidth="1.5" />
      {/* Port 1 (dół środek) */}
      <line x1={s + p1} y1={s} x2={s + p1} y2={s + 8} stroke="currentColor" strokeWidth="1.5" />
      {/* Port 5 i Port 3 z tłumikami */}
      <ExhaustTriangle x={s + p5} y={s} color={rightActive ? exhaustCol : 'currentColor'} withMuffler />
      <ExhaustTriangle x={s + p3} y={s} color={leftActive ? exhaustCol : 'currentColor'} withMuffler />

      {showPortNumbers && (
        <g className="fill-slate-600 font-mono text-[8.5px] font-bold dark:fill-slate-400" stroke="none">
          <text x={s + p4 - 8} y={-2}>4</text>
          <text x={s + p2 + 4} y={-2}>2</text>
          <text x={s + p5 - 9} y={s + 11}>5</text>
          <text x={s + p1 + 3} y={s + 11}>1</text>
          <text x={s + p3 + 6} y={s + 11}>3</text>
        </g>
      )}
    </g>
  );
}

/** 3C. Zawór kierunkowy 5/3 — OBOWIĄZKOWO TRZY KWADRATY (lewy, środek, prawy) + 2 cewki + 2 sprężyny centrujące */
export function Valve53Symbol({
  x,
  y,
  centerType = 'closed',
  position = 'center',
  fault = false,
  supplyActive = true,
  showPortNumbers = true,
  size = 38,
}: {
  x: number;
  y: number;
  centerType?: 'closed' | 'exhausted' | 'pressurized';
  position?: 'left' | 'center' | 'right';
  fault?: boolean;
  supplyActive?: boolean;
  showPortNumbers?: boolean;
  size?: number;
}) {
  const s = size;
  const frameStroke = fault ? '#dc2626' : 'currentColor';
  const supplyCol = supplyActive ? '#dc2626' : '#16a34a';
  const exhaustCol = '#16a34a';
  const trappedCol = '#d97706';

  const p5 = s * 0.2;
  const p1 = s * 0.5;
  const p3 = s * 0.8;
  const p4 = s * 0.28;
  const p2 = s * 0.72;

  const leftActive = position === 'left';
  const centerActive = position === 'center';
  const rightActive = position === 'right';

  return (
    <g transform={`translate(${x}, ${y})`} className="text-slate-900 dark:text-slate-100">
      {/* Sprężyna centrująca lewa + Cewka 14 */}
      <SpringReturnActuator x={0} y={s / 2 + 8} side="left" width={16} />
      <SolenoidPilotActuator x={0} y={s / 2 - 12} side="left" active={leftActive} withPilotTriangle portLabel="14" />

      {/* KWADRAT 1 (LEWY): 1→4, 2→3, 5 T */}
      <rect
        x="0"
        y="0"
        width={s}
        height={s}
        className={leftActive ? 'fill-sky-500/12' : 'fill-white dark:fill-slate-900'}
        stroke={frameStroke}
        strokeWidth={leftActive ? 1.9 : 1.4}
      />
      <FlowArrow x1={p1} y1={s - 2} x2={p4} y2={3} color={leftActive ? supplyCol : 'currentColor'} />
      <FlowArrow x1={p2} y1={2} x2={p3} y2={s - 3} color={leftActive ? exhaustCol : 'currentColor'} />
      <BlockedPortT x={p5} y={s} direction="up" color="currentColor" />

      {/* KWADRAT 2 (ŚRODKOWY — POZYCJA NEUTRALNA) */}
      <rect
        x={s}
        y="0"
        width={s}
        height={s}
        className={
          centerActive
            ? fault
              ? 'fill-rose-500/15'
              : centerType === 'closed'
                ? 'fill-amber-500/12'
                : centerType === 'exhausted'
                  ? 'fill-emerald-500/12'
                  : 'fill-rose-500/12'
            : 'fill-white dark:fill-slate-900'
        }
        stroke={frameStroke}
        strokeWidth={centerActive ? 1.9 : 1.4}
      />

      {centerType === 'closed' && (
        <g>
          <BlockedPortT x={s + p4} y={0} direction="down" color={centerActive ? trappedCol : 'currentColor'} />
          <BlockedPortT x={s + p2} y={0} direction="down" color={centerActive ? trappedCol : 'currentColor'} />
          <BlockedPortT x={s + p5} y={s} direction="up" color="currentColor" />
          <BlockedPortT x={s + p1} y={s} direction="up" color={centerActive ? supplyCol : 'currentColor'} />
          <BlockedPortT x={s + p3} y={s} direction="up" color="currentColor" />
        </g>
      )}

      {centerType === 'exhausted' && (
        <g>
          <FlowArrow x1={s + p4} y1={2} x2={s + p5} y2={s - 3} color={centerActive ? exhaustCol : 'currentColor'} />
          <FlowArrow x1={s + p2} y1={2} x2={s + p3} y2={s - 3} color={centerActive ? exhaustCol : 'currentColor'} />
          <BlockedPortT x={s + p1} y={s} direction="up" color={centerActive ? supplyCol : 'currentColor'} />
        </g>
      )}

      {centerType === 'pressurized' && (
        <g>
          <FlowArrow x1={s + p1} y1={s - 2} x2={s + p4} y2={3} color={centerActive ? supplyCol : 'currentColor'} />
          <FlowArrow x1={s + p1} y1={s - 2} x2={s + p2} y2={3} color={centerActive ? supplyCol : 'currentColor'} />
          <BlockedPortT x={s + p5} y={s} direction="up" color="currentColor" />
          <BlockedPortT x={s + p3} y={s} direction="up" color="currentColor" />
        </g>
      )}

      {/* KWADRAT 3 (PRAWY): 1→2, 4→5, 3 T */}
      <rect
        x={s * 2}
        y="0"
        width={s}
        height={s}
        className={rightActive ? 'fill-sky-500/12' : 'fill-white dark:fill-slate-900'}
        stroke={frameStroke}
        strokeWidth={rightActive ? 1.9 : 1.4}
      />
      <FlowArrow x1={s * 2 + p1} y1={s - 2} x2={s * 2 + p2} y2={3} color={rightActive ? supplyCol : 'currentColor'} />
      <FlowArrow x1={s * 2 + p4} y1={2} x2={s * 2 + p5} y2={s - 3} color={rightActive ? exhaustCol : 'currentColor'} />
      <BlockedPortT x={s * 2 + p3} y={s} direction="up" color="currentColor" />

      {/* Sprężyna centrująca prawa + Cewka 12 */}
      <SpringReturnActuator x={s * 3} y={s / 2 + 8} side="right" width={16} />
      <SolenoidPilotActuator x={s * 3} y={s / 2 - 12} side="right" active={rightActive} withPilotTriangle portLabel="12" />

      {/* Porty na kwadracie środkowym (spoczynkowym) */}
      <line x1={s + p4} y1={0} x2={s + p4} y2={-8} stroke="currentColor" strokeWidth="1.5" />
      <line x1={s + p2} y1={0} x2={s + p2} y2={-8} stroke="currentColor" strokeWidth="1.5" />
      <line x1={s + p1} y1={s} x2={s + p1} y2={s + 8} stroke="currentColor" strokeWidth="1.5" />
      <ExhaustTriangle x={s + p5} y={s} color={centerActive && centerType === 'exhausted' ? exhaustCol : 'currentColor'} withMuffler />
      <ExhaustTriangle x={s + p3} y={s} color={centerActive && centerType === 'exhausted' ? exhaustCol : 'currentColor'} withMuffler />

      {showPortNumbers && (
        <g className="fill-slate-600 font-mono text-[8.5px] font-bold dark:fill-slate-400" stroke="none">
          <text x={s + p4 - 8} y={-2}>4</text>
          <text x={s + p2 + 4} y={-2}>2</text>
          <text x={s + p5 - 9} y={s + 11}>5</text>
          <text x={s + p1 + 3} y={s + 11}>1</text>
          <text x={s + p3 + 6} y={s + 11}>3</text>
        </g>
      )}
    </g>
  );
}

/** 4. Zawór dławiąco-zwrotny (GRLA — dławienie na wylocie): prostokąt z równoległym dławikiem regulowanym )( + strzałka oraz zaworem zwrotnym kulka+V */
export function ThrottleCheckValveSymbol({
  x,
  y,
  orientation = 'horizontal',
  flowColor = 'currentColor',
  scale = 1,
}: {
  x: number;
  y: number;
  orientation?: 'horizontal' | 'vertical';
  flowColor?: string;
  scale?: number;
}) {
  // Domyślny układ poziomy (środek w (0,0), szerokość 46, wysokość 30):
  // Lewa gałąź = zasilanie od zaworu, Prawa gałąź = do siłownika
  // Zawór zwrotny przepuszcza z lewej na prawo (do siłownika), blokuje powrót -> dławienie na wylocie!
  const rot = orientation === 'vertical' ? -90 : 0;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`} className="text-slate-900 dark:text-slate-100">
      {/* Obudowa prostokątna wg ISO 1219 */}
      <rect
        x="-22"
        y="-16"
        width="44"
        height="32"
        rx="2"
        className="fill-white dark:fill-slate-900"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      {/* Węzły rozgałęzienia */}
      <line x1="-22" y1="0" x2="-14" y2="0" stroke={flowColor} strokeWidth="1.5" />
      <line x1="14" y1="0" x2="22" y2="0" stroke={flowColor} strokeWidth="1.5" />
      <circle cx="-14" cy="0" r="1.8" fill={flowColor} />
      <circle cx="14" cy="0" r="1.8" fill={flowColor} />

      {/* Górna gałąź: regulowany dławik (dwa łuki + skośna strzałka) */}
      <polyline points="-14,0 -14,-8 14,-8 14,0" fill="none" stroke={flowColor} strokeWidth="1.4" />
      <path d="M -7 -12 Q 0 -8 7 -12" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M -7 -4 Q 0 -8 7 -4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <line x1="-6" y1="-2" x2="7" y2="-14" stroke="currentColor" strokeWidth="1.3" />
      <IsoArrowHead x={7} y={-14} angleDeg={-42} color="currentColor" size={3.8} />

      {/* Dolna gałąź: zawór zwrotny (kulka w gnieździe V — otwarty w prawo, zablokowany w lewo) */}
      <polyline points="-14,0 -14,9 -4,9" fill="none" stroke={flowColor} strokeWidth="1.4" />
      <polyline points="4,9 14,9 14,0" fill="none" stroke={flowColor} strokeWidth="1.4" />
      {/* Gniazdo V otwarte w prawo */}
      <polyline points="1,4 -5,9 1,14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Kulka */}
      <circle cx="1.5" cy="9" r="3.4" className="fill-white dark:fill-slate-900" stroke="currentColor" strokeWidth="1.4" />
    </g>
  );
}

/** 5. Zawór zwrotny sterowany (HGL): kulka + gniazdo V + sprężyna + przerywana linia pilotowa (port 21) */
export function PilotCheckValveSymbol({
  x,
  y,
  orientation = 'horizontal',
  pilotActive = false,
  flowColor = 'currentColor',
  scale = 1,
}: {
  x: number;
  y: number;
  orientation?: 'horizontal' | 'vertical';
  pilotActive?: boolean;
  flowColor?: string;
  scale?: number;
}) {
  const rot = orientation === 'vertical' ? -90 : 0;
  const pilotCol = pilotActive ? '#0284c7' : '#94a3b8';

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`} className="text-slate-900 dark:text-slate-100">
      {/* Prostokątna obudowa ISO */}
      <rect
        x="-20"
        y="-14"
        width="40"
        height="28"
        rx="2"
        className={pilotActive ? 'fill-sky-500/8' : 'fill-white dark:fill-slate-900'}
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* Przewód główny */}
      <line x1="-20" y1="0" x2="-6" y2="0" stroke={flowColor} strokeWidth="1.6" />
      <line x1="6" y1="0" x2="20" y2="0" stroke={flowColor} strokeWidth="1.6" />
      {/* Gniazdo V (blokuje wypływ z prawej na lewo gdy pilot=0) */}
      <polyline points="0,-6 -6,0 0,6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Kulka (odsunięta gdy pilot aktywny) */}
      <circle
        cx={pilotActive ? 3.5 : 0.5}
        cy="0"
        r="4"
        className="fill-white dark:fill-slate-900"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Sprężynka dociskająca kulkę */}
      <polyline points="5,0 7,-3 9,3 11,-3 13,0" fill="none" stroke="currentColor" strokeWidth="1.1" />
      {/* Przerywana linia pilota odblokowującego (port 21) */}
      <line x1="-2" y1="14" x2="-2" y2="26" stroke={pilotCol} strokeWidth="1.4" strokeDasharray="3 2" />
      <line x1="-2" y1="14" x2="-2" y2="5" stroke={pilotCol} strokeWidth="1.3" strokeDasharray="2.5 2" />
      <IsoArrowHead x={-2} y={5} angleDeg={-90} color={pilotCol} size={3.6} />
    </g>
  );
}

/** 6. Zawór szybkiego spustu (Quick Exhaust) wg ISO 1219 */
export function QuickExhaustValveSymbol({
  x,
  y,
  exhausting = true,
  scale = 1,
}: {
  x: number;
  y: number;
  exhausting?: boolean;
  scale?: number;
}) {
  const exhCol = exhausting ? '#16a34a' : 'currentColor';
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="text-slate-900 dark:text-slate-100">
      <rect x="-22" y="-16" width="44" height="32" rx="2" className="fill-white dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
      {/* Port 1 (lewy) i Port 2 (prawy) */}
      <line x1="-30" y1="-4" x2="-9" y2="-4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="-4" x2="30" y2="-4" stroke={exhausting ? exhCol : '#dc2626'} strokeWidth="1.5" />
      {/* Gniazda V i kulka przełączająca */}
      <polyline points="-9,-9 -3,-4 -9,1" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <polyline points="5,7 0,1 -5,7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {/* Przełączająca się kulka/membrana */}
      <circle
        cx={exhausting ? -4.5 : 0}
        cy={exhausting ? -4 : 5}
        r="4"
        className="fill-white dark:fill-slate-900"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Port 3 (szybki wydech w dół) */}
      <line x1="0" y1="7" x2="0" y2="16" stroke={exhCol} strokeWidth="1.5" />
      <ExhaustTriangle x={0} y={16} color={exhCol} withMuffler />
      {/* Oznaczenia portów poza obudową */}
      <text x="-28" y="-8" className="fill-slate-600 font-mono text-[8px] font-bold dark:fill-slate-400" stroke="none">1</text>
      <text x="23" y="-8" className="fill-slate-600 font-mono text-[8px] font-bold dark:fill-slate-400" stroke="none">2</text>
      <text x="8" y="26" className="fill-slate-600 font-mono text-[8px] font-bold dark:fill-slate-400" stroke="none">3</text>
    </g>
  );
}

/** 7. Siłownik dwustronnego działania wg ISO 1219-1 (wyraźny LEWY króciec w komorze tłokowej i PRAWY króciec w komorze tłoczyskowej + opcjonalny hamulec DNCKE/KP) */
export function DoubleActingCylinderSymbol({
  x,
  y,
  width = 160,
  height = 54,
  extensionPct = 20,
  leftChamberColor = '#16a34a',
  rightChamberColor = '#dc2626',
  withCushioning = true,
  withBrake = false,
  brakeEngaged = false,
  withDisplacementSensor = false,
  sensorLabel,
  portSide = 'bottom',
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  extensionPct?: number; // 0..100
  leftChamberColor?: string;
  rightChamberColor?: string;
  withCushioning?: boolean;
  withBrake?: boolean;
  brakeEngaged?: boolean;
  withDisplacementSensor?: boolean;
  sensorLabel?: string;
  portSide?: 'bottom' | 'top';
}) {
  const clampedPct = Math.max(0, Math.min(100, extensionPct));
  const pistonW = 10;
  const minPistonX = 14;
  const maxPistonX = width - 28;
  const pistonX = minPistonX + (clampedPct / 100) * (maxPistonX - minPistonX);
  const rodLength = 72;
  const rodY = height / 2 - 4;

  // Króćce: LEWY ściśle na początku komory tłokowej (x=10), PRAWY ściśle na końcu komory tłoczyskowej (x=width-10)
  const leftPortX = 10;
  const rightPortX = width - 10;
  const portYStart = portSide === 'bottom' ? height : 0;
  const portYEnd = portSide === 'bottom' ? height + 12 : -12;

  return (
    <g transform={`translate(${x}, ${y})`} className="text-slate-900 dark:text-slate-100">
      {/* Tło korpusu */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        className="fill-white dark:fill-slate-900"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      {/* Wypełnienie LEWEJ komory (tłokowej) */}
      <rect
        x="1.5"
        y="1.5"
        width={Math.max(2, pistonX - 1.5)}
        height={height - 3}
        fill={leftChamberColor}
        opacity="0.2"
      />

      {/* Wypełnienie PRAWEJ komory (tłoczyskowej) */}
      <rect
        x={pistonX + pistonW}
        y="1.5"
        width={Math.max(2, width - 1.5 - (pistonX + pistonW))}
        height={height - 3}
        fill={rightChamberColor}
        opacity="0.2"
      />

      {/* Tłok */}
      <rect
        x={pistonX}
        y="1"
        width={pistonW}
        height={height - 2}
        className="fill-slate-700 dark:fill-slate-200"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Tuleje amortyzacji końcowej (opcjonalne) */}
      {withCushioning && (
        <>
          <rect x={pistonX - 5} y={height / 2 - 7} width="5" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <rect x={pistonX + pistonW} y={height / 2 - 7} width="5" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </>
      )}

      {/* Tłoczysko wychodzące w prawo */}
      <rect
        x={pistonX + pistonW}
        y={rodY}
        width={width - (pistonX + pistonW) + rodLength}
        height="8"
        className="fill-slate-300 dark:fill-slate-500"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* LEWY KRÓCIEC (komora tłokowa) */}
      <line x1={leftPortX} y1={portYStart} x2={leftPortX} y2={portYEnd} stroke={leftChamberColor} strokeWidth="2.2" />
      {/* PRAWY KRÓCIEC (komora tłoczyskowa) */}
      <line x1={rightPortX} y1={portYStart} x2={rightPortX} y2={portYEnd} stroke={rightChamberColor} strokeWidth="2.2" />

      {/* Opcjonalna jednostka hamująca / zaciskowa tłoczyska (Festo DNCKE / KP: sprężyna + kliny + pilot pneumatyczny) */}
      {withBrake && (
        <g transform={`translate(${width + 10}, ${height / 2})`}>
          {/* Korpus jednostki zaciskowej */}
          <rect
            x="0"
            y="-20"
            width="30"
            height="40"
            rx="2"
            className={brakeEngaged ? 'fill-emerald-500/15' : 'fill-white dark:fill-slate-900'}
            stroke={brakeEngaged ? '#059669' : 'currentColor'}
            strokeWidth="1.5"
          />
          {/* Szczęki / kliny zaciskowe na tłoczysku */}
          <polygon
            points="7,-10 23,-10 18,-4 12,-4"
            fill={brakeEngaged ? '#059669' : 'none'}
            stroke={brakeEngaged ? '#059669' : 'currentColor'}
            strokeWidth="1.3"
          />
          <polygon
            points="7,10 23,10 18,4 12,4"
            fill={brakeEngaged ? '#059669' : 'none'}
            stroke={brakeEngaged ? '#059669' : 'currentColor'}
            strokeWidth="1.3"
          />
          {/* Sprężyna zamykająca hamulec od góry */}
          <polyline points="15,-20 12,-17 18,-15 12,-13 15,-10" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {/* Trójkąt pilota odblokowującego od dołu */}
          <polygon
            points="11,18 19,18 15,12"
            fill={!brakeEngaged ? '#0284c7' : 'none'}
            stroke={!brakeEngaged ? '#0284c7' : 'currentColor'}
            strokeWidth="1.2"
          />
          <line
            x1="15"
            y1="20"
            x2="15"
            y2="30"
            stroke={!brakeEngaged ? '#0284c7' : '#16a34a'}
            strokeWidth="1.4"
            strokeDasharray="3 2"
          />
        </g>
      )}

      {/* Opcjonalny liniowy przetwornik przemieszczenia (IFA Ex.11 / Ex.14: 1S1) */}
      {withDisplacementSensor && (
        <g transform={`translate(${width + (withBrake ? 48 : 16)}, ${height / 2 - 22})`}>
          <rect x="0" y="0" width="26" height="14" className="fill-sky-500/10" stroke="#0284c7" strokeWidth="1.3" />
          <line x1="4" y1="7" x2="22" y2="7" stroke="#0284c7" strokeWidth="1.2" />
          <line x1="8" y1="3" x2="8" y2="11" stroke="#0284c7" strokeWidth="1.2" />
          <line x1="14" y1="3" x2="14" y2="11" stroke="#0284c7" strokeWidth="1.2" />
          <line x1="20" y1="3" x2="20" y2="11" stroke="#0284c7" strokeWidth="1.2" />
          <line x1="13" y1="14" x2="13" y2="20" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="2 2" />
          {sensorLabel && (
            <text x="13" y="-4" textAnchor="middle" className="fill-sky-700 font-mono text-[8.5px] font-bold dark:fill-sky-400" stroke="none">
              {sensorLabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

/** Złożony symbol ISO 1219: Dwukanałowy zawór bezpieczeństwa 3/2 (MS6-SV / VOFA — dwa zawory 3/2 szeregowo na zasilaniu, równolegle na wydechu + czujniki suwaków) */
export function DualSafety32BlockSymbol({
  x,
  y,
  ch1Active = false,
  ch2Active = false,
  ch1Fault = false,
  ch2Fault = false,
  withSoftStart = false,
  scale = 1,
}: {
  x: number;
  y: number;
  ch1Active?: boolean;
  ch2Active?: boolean;
  ch1Fault?: boolean;
  ch2Fault?: boolean;
  withSoftStart?: boolean;
  scale?: number;
}) {
  const bothActive = ch1Active && ch2Active;
  const outCol = bothActive ? '#dc2626' : '#16a34a';
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="text-slate-900 dark:text-slate-100">
      {/* Zewnętrzna przerywana obudowa bloku dwukanałowego */}
      <rect
        x="-2"
        y="0"
        width="168"
        height="118"
        rx="4"
        fill="none"
        stroke={ch1Fault || ch2Fault ? '#dc2626' : 'currentColor'}
        strokeWidth="1.3"
        strokeDasharray="5 3"
        opacity="0.85"
      />

      {/* Zawór Kanału 1 (górny 3/2) */}
      <Valve32Symbol
        x={40}
        y={14}
        size={28}
        active={ch1Active}
        fault={ch1Fault}
        showPortNumbers={false}
        showExhaustTriangle
        withSpoolSensor
        sensorOk={!ch1Fault}
      />

      {/* Zawór Kanału 2 (dolny 3/2) */}
      <Valve32Symbol
        x={40}
        y={68}
        size={28}
        active={ch2Active}
        fault={ch2Fault}
        showPortNumbers={false}
        showExhaustTriangle
        withSpoolSensor
        sensorOk={!ch2Fault}
      />

      {/* Połączenie szeregowe zasilania P1 -> Kanał 2 -> Kanał 1 -> Wyjście P2 */}
      {/* Zasilanie P1 od lewej do dolnego zaworu (port 1) */}
      <polyline points="-2,104 76.4,104 76.4,96" fill="none" stroke="#dc2626" strokeWidth="1.8" />
      {/* Z wyjścia dolnego zaworu (port 2) do wejścia górnego zaworu (port 1) */}
      <polyline
        points="76.4,68 76.4,54 76.4,42"
        fill="none"
        stroke={ch2Active ? '#dc2626' : '#16a34a'}
        strokeWidth="1.8"
      />
      {/* Wyjście P2 z górnego zaworu w prawo */}
      <polyline points="76.4,14 76.4,6 166,6" fill="none" stroke={outCol} strokeWidth="1.8" />

      {/* Opcjonalny bypass łagodnego startu (dławik regulowany dla MS6-SV) */}
      {withSoftStart && (
        <g transform="translate(122, 6)">
          <path d="M -6 -4 Q 0 0 6 -4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M -6 4 Q 0 0 6 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="-5" y1="6" x2="5" y2="-6" stroke="currentColor" strokeWidth="1.2" />
        </g>
      )}
    </g>
  );
}
