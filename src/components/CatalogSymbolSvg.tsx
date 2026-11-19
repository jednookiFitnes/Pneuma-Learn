import type { CatalogSymbolId } from '../data/catalog';
import {
  AirSourceSymbol,
  DoubleActingCylinderSymbol,
  DualSafety32BlockSymbol,
  FrlUnitSymbol,
  IsoArrowHead,
  PilotCheckValveSymbol,
  QuickExhaustValveSymbol,
  ThrottleCheckValveSymbol,
  Valve32Symbol,
  Valve52Symbol,
  Valve53Symbol,
} from './PneumaticSymbols';

export function CatalogSymbolSvg({ symbolId }: { symbolId: CatalogSymbolId }) {
  return (
    <svg
      viewBox="0 0 240 120"
      className="h-28 w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      role="img"
      aria-label={`Symbol techniczny ISO 1219: ${symbolId}`}
    >
      {/* 1. Siłownik dwustronnego działania */}
      {symbolId === 'cylinder_double' && (
        <DoubleActingCylinderSymbol
          x={26}
          y={28}
          width={126}
          height={52}
          extensionPct={38}
          leftChamberColor="#dc2626"
          rightChamberColor="#16a34a"
          withCushioning
          portSide="bottom"
        />
      )}

      {/* 2. Zawór 5/2 monostabilny */}
      {symbolId === 'valve_5_2' && (
        <Valve52Symbol x={72} y={36} active={false} size={42} showPortNumbers />
      )}

      {/* 3. Zawór 5/3 — TRZY KWADRATY (zamknięty lub odpowietrzony) */}
      {(symbolId === 'valve_5_3_closed' || symbolId === 'valve_5_3_exhaust') && (
        <Valve53Symbol
          x={60}
          y={38}
          centerType={symbolId === 'valve_5_3_exhaust' ? 'exhausted' : 'closed'}
          position="center"
          size={38}
          showPortNumbers
        />
      )}

      {/* 4. Zawór dławiąco-zwrotny GRLA */}
      {symbolId === 'throttle_check_grla' && (
        <g>
          <line x1="28" y1="60" x2="92" y2="60" stroke="#dc2626" strokeWidth="1.6" />
          <line x1="148" y1="60" x2="212" y2="60" stroke="#dc2626" strokeWidth="1.6" />
          <ThrottleCheckValveSymbol x={120} y={60} flowColor="#dc2626" scale={1.35} />
        </g>
      )}

      {/* 5. Zawór zwrotny sterowany HGL */}
      {symbolId === 'pilot_check_hgl' && (
        <g>
          <line x1="28" y1="50" x2="94" y2="50" stroke="#dc2626" strokeWidth="1.6" />
          <line x1="146" y1="50" x2="212" y2="50" stroke="#d97706" strokeWidth="1.6" />
          <PilotCheckValveSymbol x={120} y={50} pilotActive flowColor="#dc2626" scale={1.3} />
          <text x="132" y="96" className="fill-sky-700 font-mono text-[9px] font-bold dark:fill-sky-400">
            21
          </text>
        </g>
      )}

      {/* 6. Zawór szybkiego spustu */}
      {symbolId === 'quick_exhaust' && (
        <QuickExhaustValveSymbol x={120} y={52} exhausting scale={1.35} />
      )}

      {/* 7. Zespół przygotowania powietrza FRL */}
      {symbolId === 'frl_unit' && (
        <g>
          <AirSourceSymbol x={24} y={62} color="#dc2626" />
          <line x1="34" y1="62" x2="54" y2="62" stroke="#dc2626" strokeWidth="1.6" />
          <FrlUnitSymbol x={58} y={30} scale={1} includeLubricator lineColor="#dc2626" />
          <line x1="188" y1="62" x2="216" y2="62" stroke="#dc2626" strokeWidth="1.6" />
          <IsoArrowHead x={216} y={62} angleDeg={0} color="#dc2626" size={5} />
        </g>
      )}

      {/* 8. Festo MS6-SV (dwukanałowy 3/2 łagodny start + szybkie odpowietrzanie) */}
      {symbolId === 'ms6_sv' && (
        <g>
          <AirSourceSymbol x={22} y={96} color="#dc2626" />
          <line x1="32" y1="96" x2="52" y2="96" stroke="#dc2626" strokeWidth="1.6" />
          <DualSafety32BlockSymbol x={52} y={8} ch1Active ch2Active withSoftStart scale={0.86} />
          <line x1="191" y1="13" x2="220" y2="13" stroke="#dc2626" strokeWidth="1.6" />
          <IsoArrowHead x={220} y={13} angleDeg={0} color="#dc2626" size={4.5} />
        </g>
      )}

      {/* 9. Festo VOFA (dwukanałowy zawór prasowy z czujnikami indukcyjnymi) */}
      {symbolId === 'vofa_dual' && (
        <g>
          <AirSourceSymbol x={22} y={96} color="#dc2626" />
          <line x1="32" y1="96" x2="52" y2="96" stroke="#dc2626" strokeWidth="1.6" />
          <DualSafety32BlockSymbol x={52} y={8} ch1Active={false} ch2Active={false} withSoftStart={false} scale={0.86} />
          <line x1="191" y1="13" x2="220" y2="13" stroke="#16a34a" strokeWidth="1.6" />
        </g>
      )}

      {/* 10. Jednostka hamująca / zaciskowa tłoczyska (DNCKE / KP) */}
      {symbolId === 'dncke_kp' && (
        <DoubleActingCylinderSymbol
          x={18}
          y={28}
          width={98}
          height={48}
          extensionPct={55}
          leftChamberColor="#d97706"
          rightChamberColor="#d97706"
          withBrake
          brakeEngaged
        />
      )}

      {/* 11. Sterowanie oburęczne ZSB-1/8 + 2x przyciski SV/O */}
      {symbolId === 'zsb_two_hand' && (
        <g>
          {/* Dwa przyciski 3/2 z kołnierzem EN 574 */}
          <g transform="scale(0.68)">
            <Valve32Symbol x={34} y={24} size={28} actuator="pushbutton" active showPortNumbers={false} showExhaustTriangle={false} />
            <Valve32Symbol x={34} y={102} size={28} actuator="pushbutton" active showPortNumbers={false} showExhaustTriangle={false} />
          </g>
          {/* Linie pilotowe do bloku jednoczesności (&) */}
          <polyline points="68,26 112,26 112,48 124,48" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 2" />
          <polyline points="68,80 112,80 112,68 124,68" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Pneumatyczny blok jednoczesności (bramka AND + czasówka) */}
          <rect x="124" y="34" width="54" height="48" rx="3" className="fill-white dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
          <line x1="151" y1="34" x2="151" y2="82" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* Symbol logiczny AND (łuk) + klepsydra czasu */}
          <path d="M 130 50 L 138 50 A 8 8 0 0 1 138 66 L 130 66 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <polygon points="158,48 171,48 164.5,58" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <polygon points="158,68 171,68 164.5,58" fill="none" stroke="currentColor" strokeWidth="1.3" />
          {/* Wyjście sterujące */}
          <line x1="178" y1="58" x2="216" y2="58" stroke="#0284c7" strokeWidth="1.6" strokeDasharray="4 2" />
          <IsoArrowHead x={216} y={58} angleDeg={0} color="#0284c7" size={4.5} />
        </g>
      )}

      {/* 12. Przekaźnik bezpieczeństwa PNOZ (styki o wymuszonym prowadzeniu + cewki K1/K2) */}
      {symbolId === 'pnoz_relay' && (
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <rect x="28" y="16" width="184" height="88" rx="4" strokeDasharray="4 3" opacity="0.7" />
          {/* Cewki K1 i K2 */}
          <rect x="46" y="30" width="24" height="16" className="fill-sky-500/10" stroke="#0284c7" />
          <rect x="46" y="72" width="24" height="16" className="fill-sky-500/10" stroke="#0284c7" />
          <line x1="58" y1="20" x2="58" y2="30" stroke="#0284c7" />
          <line x1="58" y1="46" x2="58" y2="54" stroke="#0284c7" />
          <line x1="58" y1="64" x2="58" y2="72" stroke="#0284c7" />
          <line x1="58" y1="88" x2="58" y2="98" stroke="#0284c7" />
          {/* Sprzężenie mechaniczne (wymuszone prowadzenie styków) */}
          <line x1="70" y1="38" x2="178" y2="38" strokeDasharray="3 2" opacity="0.8" />
          <line x1="70" y1="80" x2="178" y2="80" strokeDasharray="3 2" opacity="0.8" />
          {/* Styki NO (tor bezpieczny szeregowy 13-14) */}
          <line x1="114" y1="22" x2="114" y2="33" />
          <line x1="114" y1="43" x2="114" y2="75" />
          <line x1="114" y1="85" x2="114" y2="98" />
          <line x1="108" y1="33" x2="114" y2="43" stroke="#16a34a" strokeWidth="1.8" />
          <line x1="108" y1="75" x2="114" y2="85" stroke="#16a34a" strokeWidth="1.8" />
          {/* Styk NC sprzężenia zwrotnego EDM */}
          <line x1="176" y1="22" x2="176" y2="34" />
          <line x1="176" y1="44" x2="176" y2="76" />
          <line x1="176" y1="86" x2="176" y2="98" />
          <polyline points="171,34 179,34 176,44" stroke="#d97706" />
          <polyline points="171,76 179,76 176,86" stroke="#d97706" />
          <text x="58" y="41" textAnchor="middle" className="fill-sky-700 font-mono text-[8px] font-bold dark:fill-sky-400" stroke="none">K1</text>
          <text x="58" y="83" textAnchor="middle" className="fill-sky-700 font-mono text-[8px] font-bold dark:fill-sky-400" stroke="none">K2</text>
          <text x="114" y="109" textAnchor="middle" className="fill-emerald-700 font-mono text-[7.5px] font-bold dark:fill-emerald-400" stroke="none">13-14</text>
          <text x="176" y="109" textAnchor="middle" className="fill-amber-700 font-mono text-[7.5px] font-bold dark:fill-amber-400" stroke="none">EDM</text>
        </g>
      )}

      {/* 13. Kurtyna świetlna ESPE (nadajnik TX, wiązki podczerwieni, odbiornik RX + OSSD) */}
      {symbolId === 'espe_curtain' && (
        <g strokeWidth="1.5" fill="none">
          <rect x="34" y="18" width="22" height="84" rx="2" className="fill-amber-500/15" stroke="#d97706" />
          <rect x="184" y="18" width="22" height="84" rx="2" className="fill-amber-500/15" stroke="#d97706" />
          {[30, 44, 58, 72, 86].map((by) => (
            <g key={by}>
              <line x1="56" y1={by} x2="180" y2={by} stroke="#dc2626" strokeWidth="1.3" strokeDasharray="5 3" />
              <IsoArrowHead x={182} y={by} angleDeg={0} color="#dc2626" size={4} />
            </g>
          ))}
          <text x="45" y="64" textAnchor="middle" className="fill-amber-800 font-mono text-[9px] font-bold dark:fill-amber-300" stroke="none">TX</text>
          <text x="195" y="64" textAnchor="middle" className="fill-amber-800 font-mono text-[9px] font-bold dark:fill-amber-300" stroke="none">RX</text>
          <line x1="206" y1="44" x2="226" y2="44" stroke="#0284c7" />
          <line x1="206" y1="74" x2="226" y2="74" stroke="#0284c7" />
        </g>
      )}

      {/* 14. Wyłącznik ryglowany osłony (EN ISO 14119) */}
      {symbolId === 'guard_lock_14119' && (
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          {/* Drzwi / aktywator RFID po lewej */}
          <rect x="24" y="34" width="34" height="52" rx="2" className="fill-slate-200/60 dark:fill-slate-800" />
          <line x1="58" y1="60" x2="88" y2="60" strokeWidth="2.5" />
          {/* Korpus wyłącznika ryglowanego */}
          <rect x="88" y="24" width="118" height="72" rx="3" className="fill-white dark:fill-slate-900" />
          {/* Rygiel blokowany sprężyną (prąd spoczynkowy) */}
          <rect x="106" y="44" width="14" height="32" className="fill-emerald-500/20" stroke="#059669" />
          <polyline points="113,26 109,30 117,34 109,38 113,44" />
          {/* Cewka zwalniająca rygiel */}
          <rect x="138" y="50" width="24" height="18" className="fill-sky-500/15" stroke="#0284c7" />
          <line x1="145" y1="68" x2="155" y2="50" stroke="#0284c7" />
          <line x1="120" y1="59" x2="138" y2="59" strokeDasharray="3 2" />
          {/* Styki monitoringu pozycji rygla */}
          <line x1="184" y1="32" x2="184" y2="52" />
          <line x1="179" y1="52" x2="186" y2="66" stroke="#16a34a" strokeWidth="1.8" />
          <line x1="184" y1="66" x2="184" y2="88" />
        </g>
      )}

      {/* 15–21. Pojęcia normatywne — precyzyjne diagramy inżynierskie */}
      {symbolId === 'pl_plr_chart' && (
        <g strokeWidth="1.4">
          <line x1="34" y1="96" x2="210" y2="96" stroke="currentColor" />
          <line x1="34" y1="20" x2="34" y2="96" stroke="currentColor" />
          {[
            { x: 46, h: 18, lbl: 'a', fill: '#94a3b8' },
            { x: 78, h: 30, lbl: 'b', fill: '#64748b' },
            { x: 110, h: 44, lbl: 'c', fill: '#0284c7' },
            { x: 142, h: 58, lbl: 'd', fill: '#0ea5e9' },
            { x: 174, h: 72, lbl: 'e', fill: '#059669' },
          ].map((b) => (
            <g key={b.lbl}>
              <rect x={b.x} y={96 - b.h} width="22" height={b.h} fill={b.fill} opacity="0.82" rx="2" />
              <text x={b.x + 11} y="109" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold dark:fill-slate-300">
                {b.lbl}
              </text>
            </g>
          ))}
        </g>
      )}

      {symbolId === 'b10d_mttfd' && (
        <g strokeWidth="1.5" fill="none">
          <line x1="30" y1="94" x2="212" y2="94" stroke="currentColor" />
          <line x1="30" y1="20" x2="30" y2="94" stroke="currentColor" />
          {/* Krzywa zużycia Weibulla */}
          <path d="M 32 92 C 92 92, 125 84, 154 50 C 172 30, 188 24, 208 23" stroke="#0284c7" strokeWidth="2" />
          {/* Próg 10% (B10D) */}
          <line x1="30" y1="78" x2="124" y2="78" stroke="#dc2626" strokeDasharray="3 2" />
          <line x1="124" y1="78" x2="124" y2="94" stroke="#dc2626" strokeDasharray="3 2" />
          <circle cx="124" cy="78" r="3.5" fill="#dc2626" />
          <text x="124" y="108" textAnchor="middle" className="fill-rose-700 font-mono text-[8.5px] font-bold dark:fill-rose-400" stroke="none">
            B10D (10%)
          </text>
        </g>
      )}

      {symbolId === 'dc_avg' && (
        <g strokeWidth="1.5" fill="none">
          {/* Półokrągły miernik pokrycia diagnostycznego */}
          <path d="M 55 88 A 65 65 0 0 1 185 88" stroke="#cbd5e1" strokeWidth="10" className="dark:stroke-slate-700" />
          <path d="M 55 88 A 65 65 0 0 1 180 65" stroke="#059669" strokeWidth="10" />
          <line x1="120" y1="88" x2="168" y2="54" stroke="#0f172a" className="dark:stroke-slate-100" strokeWidth="2" />
          <circle cx="120" cy="88" r="4.5" fill="currentColor" />
          <text x="54" y="104" textAnchor="middle" className="fill-slate-500 font-mono text-[8px]" stroke="none">0%</text>
          <text x="120" y="18" textAnchor="middle" className="fill-slate-600 font-mono text-[8px] font-bold dark:fill-slate-300" stroke="none">90%</text>
          <text x="188" y="104" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] font-bold dark:fill-emerald-400" stroke="none">99%</text>
        </g>
      )}

      {symbolId === 'ccf_shield' && (
        <g strokeWidth="1.5" fill="none">
          {/* Dwa niezależne kanały oddzielone barierą przed wspólną przyczyną */}
          <rect x="28" y="24" width="66" height="24" rx="3" className="fill-sky-500/10" stroke="#0284c7" />
          <rect x="28" y="72" width="66" height="24" rx="3" className="fill-sky-500/10" stroke="#0284c7" />
          {/* Bariera separacji */}
          <line x1="20" y1="60" x2="112" y2="60" stroke="#059669" strokeWidth="2" strokeDasharray="5 3" />
          {/* Tarcza CCF ≥ 65 */}
          <path d="M 164 22 L 198 34 L 198 62 C 198 80 182 92 164 98 C 146 92 130 80 130 62 L 130 34 Z" className="fill-emerald-500/15" stroke="#059669" strokeWidth="1.8" />
          <polyline points="152,60 161,70 178,48" stroke="#059669" strokeWidth="2.4" />
        </g>
      )}

      {symbolId === 'safety_functions' && (
        <g strokeWidth="1.5" fill="none">
          {/* Wykres prędkości v(t): SLS + rampa SS1 + STO */}
          <line x1="28" y1="92" x2="214" y2="92" stroke="currentColor" />
          <line x1="28" y1="20" x2="28" y2="92" stroke="currentColor" />
          {/* Próg SLS */}
          <line x1="28" y1="54" x2="210" y2="54" stroke="#d97706" strokeDasharray="4 3" />
          {/* Profil prędkości */}
          <polyline points="32,32 82,32 108,54 148,54 176,92 208,92" stroke="#0284c7" strokeWidth="2.2" />
          <text x="128" y="48" textAnchor="middle" className="fill-amber-700 font-mono text-[8px] font-bold dark:fill-amber-400" stroke="none">SLS</text>
          <text x="166" y="72" className="fill-sky-700 font-mono text-[8px] font-bold dark:fill-sky-400" stroke="none">SS1</text>
          <text x="194" y="86" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] font-bold dark:fill-emerald-400" stroke="none">STO</text>
        </g>
      )}

      {symbolId === 'fault_exclusion' && (
        <g strokeWidth="1.5" fill="none">
          {/* Przewymiarowana sprężyna prowadzona (klasyczny przykład wykluczenia błędu wg EN ISO 13849-2) */}
          <rect x="46" y="34" width="148" height="52" rx="3" strokeDasharray="4 3" opacity="0.65" />
          <line x1="62" y1="60" x2="178" y2="60" strokeWidth="3" opacity="0.45" />
          <polyline
            points="72,60 80,44 92,76 104,44 116,76 128,44 140,76 152,44 164,76 170,60"
            stroke="#059669"
            strokeWidth="2"
          />
          <line x1="72" y1="38" x2="72" y2="82" strokeWidth="2.5" />
          <line x1="170" y1="38" x2="170" y2="82" strokeWidth="2.5" />
        </g>
      )}

      {symbolId === 'ossd_pulses' && (
        <g strokeWidth="1.6" fill="none">
          <line x1="24" y1="96" x2="216" y2="96" stroke="currentColor" opacity="0.5" />
          {/* Kanał OSSD1 z ciemnym impulsem testowym */}
          <polyline points="28,36 74,36 74,56 82,56 82,36 164,36 164,56 172,56 172,36 212,36" stroke="#0284c7" strokeWidth="2" />
          {/* Kanał OSSD2 z przesuniętym impulsem testowym */}
          <polyline points="28,72 118,72 118,92 126,92 126,72 212,72" stroke="#059669" strokeWidth="2" />
          <text x="34" y="28" className="fill-sky-700 font-mono text-[8px] font-bold dark:fill-sky-400" stroke="none">OSSD1</text>
          <text x="34" y="66" className="fill-emerald-700 font-mono text-[8px] font-bold dark:fill-emerald-400" stroke="none">OSSD2</text>
        </g>
      )}
    </svg>
  );
}
