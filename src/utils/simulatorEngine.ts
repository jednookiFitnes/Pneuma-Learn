export type CircuitTemplateId =
  | 'ms6_sv_exhaust'
  | 'two_hand_zsb'
  | 'vertical_axis_hgl_dncke'
  | 'press_vofa_dual';

export type SimulationMode =
  | 'normal'
  | 'safety_demand'
  | 'power_loss'
  | 'single_fault';

export type LineFluidState = 'supply' | 'exhaust' | 'pilot' | 'trapped' | 'neutral';

export interface CircuitTemplateMeta {
  id: CircuitTemplateId;
  title: string;
  shortTitle: string;
  standardRef: string;
  categoryTarget: string;
  summary: string;
  supportsMechLock?: boolean;
}

export const CIRCUIT_TEMPLATES: CircuitTemplateMeta[] = [
  {
    id: 'ms6_sv_exhaust',
    title: 'Bezpieczne odpowietrzanie i łagodny start (MS6-SV)',
    shortTitle: 'MS6-SV (STO / SDE)',
    standardRef: 'EN ISO 14118 / Festo MS6-SV-E · Kat. 4 / PL e',
    categoryTarget: 'Kat. 4 / PL e',
    summary:
      'Dwukanałowy zawór bezpieczeństwa z kontrolą położenia suwaka, łagodnym narostem ciśnienia (50% P1) oraz szybkim odpowietrzaniem do atmosfery.',
  },
  {
    id: 'two_hand_zsb',
    title: 'Dwukanałowe sterowanie oburęczne (ZSB-1/8 + SV/O)',
    shortTitle: 'Sterowanie oburęczne (EN 574)',
    standardRef: 'DIN EN 574 Typ IIIB · Festo ZSB-1/8 + 2x SV/O',
    categoryTarget: 'Kat. 3 / PL d',
    summary:
      'Pneumatyczny blok jednoczesności (okno ≤ 200 ms wg Festo / ≤ 500 ms wg EN 574) zasilany przez dwa zawory przyciskowe z osłonami.',
  },
  {
    id: 'vertical_axis_hgl_dncke',
    title: 'Bezpieczne zatrzymanie osi pionowej (5/3 + HGL + DNCKE)',
    shortTitle: 'Oś pionowa (HGL + DNCKE)',
    standardRef: 'Festo Guidelines (SSC) · 5/3 zamkn. + HGL-1/4-B + DNCKE-S',
    categoryTarget: 'Kat. 3 / PL d–e',
    summary:
      'Zatrzymanie siłownika pionowego pod obciążeniem grawitacyjnym przy użyciu zaworów zwrotnych sterowanych HGL oraz opcjonalnej blokady mechanicznej tłoczyska.',
    supportsMechLock: true,
  },
  {
    id: 'press_vofa_dual',
    title: 'Dwukanałowy blok zaworowy do pras (VOFA)',
    shortTitle: 'Blok prasowy (VOFA)',
    standardRef: 'Festo VOFA-L26-T32C + IFA Report Rozdz. 8 · Kat. 4 / PL e',
    categoryTarget: 'Kat. 4 / PL e',
    summary:
      'Nadmiarowy układ 2× zaworów 3/2 lub 5/2 z indukcyjnymi czujnikami położenia suwaka (kontrola spójności Δt w sterowniku bezpieczeństwa).',
  },
];

export interface SimulationStateOutput {
  templateId: CircuitTemplateId;
  mode: SimulationMode;
  mechLockEnabled: boolean;
  supplyPressureBar: number;
  chamberABar: number;
  chamberBBar: number;
  chamberAState: string;
  chamberBState: string;
  cylinderPositionLabel: string;
  cylinderExtensionPct: number; // 0 = retracted, 50 = mid stop, 100 = extended
  mechBrakeEngaged: boolean;
  valve1Label: string;
  valve2Label: string;
  sensorFeedbackOk: boolean;
  diagnosticMessage: string;
  lines: {
    mainSupply: LineFluidState;
    pilotCh1: LineFluidState;
    pilotCh2: LineFluidState;
    workLineA: LineFluidState;
    workLineB: LineFluidState;
    exhaustLine: LineFluidState;
  };
  residualEnergyRisk: 'none' | 'low' | 'high';
  residualEnergyWarning: string;
  flowExplanation: string;
  safetyStatusLabel: string;
  safetySeverity: 'safe' | 'warning' | 'danger';
}

export function simulateCircuit(
  templateId: CircuitTemplateId,
  mode: SimulationMode,
  mechLockEnabled: boolean = true
): SimulationStateOutput {
  if (templateId === 'ms6_sv_exhaust') {
    if (mode === 'normal') {
      return {
        templateId,
        mode,
        mechLockEnabled: false,
        supplyPressureBar: 6.0,
        chamberABar: 6.0,
        chamberBBar: 0.0,
        chamberAState: 'Zasilona (6.0 bar — wysuw)',
        chamberBState: 'Odpowietrzona (0.0 bar)',
        cylinderPositionLabel: 'Siłownik wysunięty w pozycji roboczej',
        cylinderExtensionPct: 100,
        mechBrakeEngaged: false,
        valve1Label: 'MS6-SV Kanał A: Otwarty (24V DC)',
        valve2Label: 'MS6-SV Kanał B: Otwarty (24V DC)',
        sensorFeedbackOk: true,
        diagnosticMessage: 'Czujniki położenia suwaka potwierdzają stan załączenia obu kanałów.',
        lines: {
          mainSupply: 'supply',
          pilotCh1: 'pilot',
          pilotCh2: 'pilot',
          workLineA: 'supply',
          workLineB: 'exhaust',
          exhaustLine: 'neutral',
        },
        residualEnergyRisk: 'none',
        residualEnergyWarning: 'Układ pod nominalnym ciśnieniem roboczym. Brak zagrożenia niekontrolowanym ruchem przy zamkniętych osłonach.',
        flowExplanation: 'Oba kanały 24V DC zasilają piloty MS6-SV. Po fazie łagodnego startu (p > 50% P1) zawór przełącza na pełny przepływ (do 9000 l/min), zasilając układ wykonawczy.',
        safetyStatusLabel: 'PRACA NORMALNA (ZASILANIE AKTYWNE)',
        safetySeverity: 'safe',
      };
    }

    if (mode === 'safety_demand' || mode === 'power_loss') {
      const isPowerLoss = mode === 'power_loss';
      return {
        templateId,
        mode,
        mechLockEnabled: false,
        supplyPressureBar: 6.0,
        chamberABar: 0.0,
        chamberBBar: 0.0,
        chamberAState: 'Odpowietrzona (0.0 bar)',
        chamberBState: 'Odpowietrzona (0.0 bar)',
        cylinderPositionLabel: 'Siłownik bezciśnieniowy (funkcja STO / SDE aktywna)',
        cylinderExtensionPct: 50,
        mechBrakeEngaged: false,
        valve1Label: isPowerLoss ? 'MS6-SV Kanał A: Brak 24V → Sprężyna' : 'MS6-SV Kanał A: Rozłączony',
        valve2Label: isPowerLoss ? 'MS6-SV Kanał B: Brak 24V → Sprężyna' : 'MS6-SV Kanał B: Rozłączony',
        sensorFeedbackOk: true,
        diagnosticMessage: 'Kontrola położenia suwaków potwierdziła przejście w pozycję bezpiecznego odpowietrzenia.',
        lines: {
          mainSupply: 'supply',
          pilotCh1: 'neutral',
          pilotCh2: 'neutral',
          workLineA: 'exhaust',
          workLineB: 'exhaust',
          exhaustLine: 'exhaust',
        },
        residualEnergyRisk: 'none',
        residualEnergyWarning: 'Brak energii resztkowej — port 2 został bezpiecznie odpowietrzony przez tłumik o dużej przepustowości (port 3).',
        flowExplanation: isPowerLoss
          ? 'Zanik zasilania 24V DC powoduje powrót obu suwaków sprężyną. Zasilanie P1 zostaje odcięte, a obwód roboczy P2 gwałtownie opróżniony do atmosfery.'
          : 'Żądanie bezpieczeństwa (E-Stop / otwarcie osłony) odcina oba kanały sterujące. Układ przechodzi w stan bezenergetyczny (Safe Torque Off).',
        safetyStatusLabel: 'STAN BEZPIECZNY (UKŁAD ODPOWIETRZONY)',
        safetySeverity: 'safe',
      };
    }

    // single_fault
    return {
      templateId,
      mode,
      mechLockEnabled: false,
      supplyPressureBar: 6.0,
      chamberABar: 0.0,
      chamberBBar: 0.0,
      chamberAState: 'Odpowietrzona przez kanał B (0.0 bar)',
      chamberBState: 'Odpowietrzona (0.0 bar)',
      cylinderPositionLabel: 'Zatrzymany — wykryto usterkę kanału A',
      cylinderExtensionPct: 50,
      mechBrakeEngaged: false,
      valve1Label: 'MS6-SV Kanał A: ZACIĘTY SUWAK!',
      valve2Label: 'MS6-SV Kanał B: Odpowietrzony poprawnie',
      sensorFeedbackOk: false,
      diagnosticMessage: 'ALARM DIAGNOSTYCZNY: Brak zmiany stanu czujnika w kanale A w oknie Δt. Ponowne załączenie zablokowane!',
      lines: {
        mainSupply: 'supply',
        pilotCh1: 'neutral',
        pilotCh2: 'neutral',
        workLineA: 'exhaust',
        workLineB: 'exhaust',
        exhaustLine: 'exhaust',
      },
      residualEnergyRisk: 'low',
      residualEnergyWarning: 'Dzięki architekturze redundantnej Kat. 4 pojedyncze zacięcie suwaka A nie uniemożliwia odpowietrzenia przez kanał B. Układ blokuje restart do czasu usunięcia awarii.',
      flowExplanation: 'Mimo mechanicznego zablokowania suwaka A w pozycji otwartej, drugi niezależny tor B zamyka zasilanie P1 i otwiera ścieżkę odpowietrzającą do portu 3.',
      safetyStatusLabel: 'POJEDYNCZA USTERKA WYKRYTA (REDUKCJA DO BEZPIECZEŃSTWA)',
      safetySeverity: 'warning',
    };
  }

  if (templateId === 'two_hand_zsb') {
    if (mode === 'normal') {
      return {
        templateId,
        mode,
        mechLockEnabled: false,
        supplyPressureBar: 6.0,
        chamberABar: 6.0,
        chamberBBar: 0.0,
        chamberAState: 'Zasilona (6.0 bar — ruch roboczy)',
        chamberBState: 'Odpowietrzona (0.0 bar)',
        cylinderPositionLabel: 'Ruch roboczy przy wciśniętych obu przyciskach (Δt ≤ 200 ms)',
        cylinderExtensionPct: 100,
        mechBrakeEngaged: false,
        valve1Label: 'Przycisk L + P (SV/O): Wciśnięte synchronicznie',
        valve2Label: 'Blok ZSB-1/8: Wyjście sterujące aktywne',
        sensorFeedbackOk: true,
        diagnosticMessage: 'Warunek jednoczesności spełniony (Δt < 200 ms wg Festo / < 500 ms wg EN 574).',
        lines: {
          mainSupply: 'supply',
          pilotCh1: 'pilot',
          pilotCh2: 'pilot',
          workLineA: 'supply',
          workLineB: 'exhaust',
          exhaustLine: 'neutral',
        },
        residualEnergyRisk: 'none',
        residualEnergyWarning: 'Obie dłonie operatora są fizycznie zajęte na przyciskach z kołnierzami ochronnymi.',
        flowExplanation: 'Oba zawory panelowe SV/O podały sygnał na wejścia bloku ZSB-1/8 w dopuszczalnym oknie czasowym. Sygnał wyjściowy przesterował zawór główny 5/2.',
        safetyStatusLabel: 'STEROWANIE OBURĘCZNE AKTYWNE',
        safetySeverity: 'safe',
      };
    }

    if (mode === 'safety_demand' || mode === 'power_loss') {
      return {
        templateId,
        mode,
        mechLockEnabled: false,
        supplyPressureBar: 6.0,
        chamberABar: 0.0,
        chamberBBar: 6.0,
        chamberAState: 'Odpowietrzona (0.0 bar)',
        chamberBState: 'Zasilona powrotnie (6.0 bar)',
        cylinderPositionLabel: 'Natychmiastowy powrót tłoczyska do pozycji bazowej',
        cylinderExtensionPct: 0,
        mechBrakeEngaged: false,
        valve1Label: mode === 'power_loss' ? 'Zasilanie 24V odcięte (jeśli zawór elektr.)' : 'Zwolniony jeden lub oba przyciski',
        valve2Label: 'Blok ZSB-1/8: Sygnał zablokowany / odpowietrzony',
        sensorFeedbackOk: true,
        diagnosticMessage: 'Zwolnienie przycisku natychmiast przerywa wyjście ZSB i wymusza powrót siłownika.',
        lines: {
          mainSupply: 'supply',
          pilotCh1: 'neutral',
          pilotCh2: 'neutral',
          workLineA: 'exhaust',
          workLineB: 'supply',
          exhaustLine: 'exhaust',
        },
        residualEnergyRisk: 'low',
        residualEnergyWarning: 'Uwaga na linię powrotną (komora B): siłownik pozostaje dociśnięty w pozycji schowanej. Przed pracami serwisowymi odetnij zasilanie główne.',
        flowExplanation: 'Zwolnienie choćby jednego z przycisków SV/O rozładowuje układ czasowy ZSB-1/8. Ponowny cykl wymaga puszczenia OBU przycisków i ponownego jednoczesnego wciśnięcia.',
        safetyStatusLabel: 'STOP / POWRÓT BEZPIECZNY',
        safetySeverity: 'safe',
      };
    }

    // single_fault: zablokowany lewy przycisk (np. próba manipulacji lub zacięcie)
    return {
      templateId,
      mode,
      mechLockEnabled: false,
      supplyPressureBar: 6.0,
      chamberABar: 0.0,
      chamberBBar: 6.0,
      chamberAState: 'Odpowietrzona (0.0 bar)',
      chamberBState: 'Zasilona powrotnie (6.0 bar)',
      cylinderPositionLabel: 'Zablokowany w pozycji bazowej — wykryto brak jednoczesności',
      cylinderExtensionPct: 0,
      mechBrakeEngaged: false,
      valve1Label: 'Przycisk L: ZABLOKOWANY / MANIPULACJA!',
      valve2Label: 'Blok ZSB-1/8: Wyczerpana pojemność rozruchowa',
      sensorFeedbackOk: false,
      diagnosticMessage: 'BLOKADA JEDNOCZESNOŚCI: Sygnał P pojawił się po czasie > 200 ms od L. Wyjście zablokowane!',
      lines: {
        mainSupply: 'supply',
        pilotCh1: 'pilot',
        pilotCh2: 'neutral',
        workLineA: 'exhaust',
        workLineB: 'supply',
        exhaustLine: 'exhaust',
      },
      residualEnergyRisk: 'none',
      residualEnergyWarning: 'Zabezpieczenie przed oszustwem (unikanie obejścia jednym przyciskiem zablokowanym opaską) działa poprawnie.',
      flowExplanation: 'Gdy przycisk L jest zablokowany na stałe, zbiornik sterujący w bloku ZSB-1/8 rozładowuje się przed wciśnięciem przycisku P — układ nie poda sygnału startu.',
      safetyStatusLabel: 'OCHRONA PRZED MANIPULACJĄ AKTYWNA',
      safetySeverity: 'warning',
    };
  }

  if (templateId === 'vertical_axis_hgl_dncke') {
    if (mode === 'normal') {
      return {
        templateId,
        mode,
        mechLockEnabled,
        supplyPressureBar: 6.0,
        chamberABar: 6.0,
        chamberBBar: 2.5,
        chamberAState: 'Zasilona (6.0 bar — ruch kontrolowany)',
        chamberBState: 'Podciśnienie robocze / przeciwciśnienie (2.5 bar)',
        cylinderPositionLabel: 'Oś pionowa w ruchu roboczym (hamulec DNCKE zwolniony)',
        cylinderExtensionPct: 65,
        mechBrakeEngaged: false,
        valve1Label: 'Zawór 5/3 zamkn.: Przesterowany (24V DC)',
        valve2Label: 'HGL-1/4-B: Odblokowane pilotem',
        sensorFeedbackOk: true,
        diagnosticMessage: mechLockEnabled
          ? 'Ciśnienie > 3.5 bar utrzymuje jednostkę hamującą DNCKE w stanie otwartym.'
          : 'Uwaga: pracuje wyłącznie na poduszce pneumatycznej bez jednostki DNCKE/KP.',
        lines: {
          mainSupply: 'supply',
          pilotCh1: 'pilot',
          pilotCh2: 'pilot',
          workLineA: 'supply',
          workLineB: 'exhaust',
          exhaustLine: 'neutral',
        },
        residualEnergyRisk: 'low',
        residualEnergyWarning: 'Oś pionowa pod działaniem grawitacji — w układzie zawsze obecna jest energia potencjalna masy roboczej.',
        flowExplanation: 'Pilot otwiera oba zawory zwrotne HGL-1/4-B oraz zwalnia okładziny hamulca DNCKE. Zawór 5/3 steruje ruchem w górę/dół.',
        safetyStatusLabel: 'PRACA OSI PIONOWEJ',
        safetySeverity: 'safe',
      };
    }

    if (mode === 'safety_demand' || mode === 'power_loss') {
      return {
        templateId,
        mode,
        mechLockEnabled,
        supplyPressureBar: 6.0,
        chamberABar: 4.5,
        chamberBBar: 5.2,
        chamberAState: 'Zablokowana zaworem HGL (4.5 bar uwięzione!)',
        chamberBState: 'Zablokowana zaworem HGL (5.2 bar uwięzione!)',
        cylinderPositionLabel: mechLockEnabled
          ? 'Zatrzymany i zablokowany mechanicznie przez DNCKE-S'
          : 'Zatrzymany wyłącznie na poduszce powietrznej (RYZYKO OPADANIA!)',
        cylinderExtensionPct: 65,
        mechBrakeEngaged: mechLockEnabled,
        valve1Label: 'Zawór 5/3: Pozycja środkowa zamknięta',
        valve2Label: 'HGL-1/4-B: ZAMKNIĘTE (uwięzione powietrze)',
        sensorFeedbackOk: true,
        diagnosticMessage: mechLockEnabled
          ? 'Jednostka DNCKE-S zamknęła zacisk na tłoczysku poniżej progu odblokowania.'
          : 'Brak hamulca mechanicznego — utrzymanie zależy wyłącznie od szczelności uszczelek!',
        lines: {
          mainSupply: 'supply',
          pilotCh1: 'neutral',
          pilotCh2: 'neutral',
          workLineA: 'trapped',
          workLineB: 'trapped',
          exhaustLine: 'neutral',
        },
        residualEnergyRisk: 'high',
        residualEnergyWarning: mechLockEnabled
          ? 'UWAGA: Energia resztkowa (pułapka powietrzna 4.5–5.2 bar) między HGL a siłownikiem! Podczas restartu możliwe nagłe szarpnięcie tłoczyska. DNCKE-S zabezpiecza oś przed opadnięciem.'
          : 'KRYTYCZNE ZAGROŻENIE: Pułapka powietrzna + grawitacja! Przeciek w HGL lub tłoku spowoduje niekontrolowane opadnięcie osi pionowej (Festo SSC). Włącz blokadę DNCKE/KP!',
        flowExplanation: 'Zawór 5/3 wraca do pozycji środkowej zamkniętej, a sterowane zawory zwrotne HGL-1/4-B zamykają obie komory siłownika. Powietrze zostaje uwięzione bezpośrednio przy cylindrze.',
        safetyStatusLabel: mechLockEnabled
          ? 'ZATRZYMANIE Z BLOKADĄ MECHANICZNĄ (PUŁAPKA POWIETRZA)'
          : 'ZATRZYMANIE TYLKO PNEUMATYCZNE (WYSOKIE RYZYKO)',
        safetySeverity: mechLockEnabled ? 'warning' : 'danger',
      };
    }

    // single_fault: nieszczelność / pęknięcie przewodu między 5/3 a HGL lub usterka w komorze dolnej
    return {
      templateId,
      mode,
      mechLockEnabled,
      supplyPressureBar: 6.0,
      chamberABar: 0.0,
      chamberBBar: mechLockEnabled ? 3.5 : 0.4,
      chamberAState: 'Utrata ciśnienia (pęknięcie przewodu!)',
      chamberBState: mechLockEnabled ? 'Utrzymane częściowo + zacisk DNCKE' : 'Spadek ciśnienia przez przeciek (0.4 bar)',
      cylinderPositionLabel: mechLockEnabled
        ? 'Oś utrzymana przez mechaniczny hamulec DNCKE-S'
        : 'NIEKONTROLOWANE OPADANIE TŁOCZYSKA W DÓŁ!',
      cylinderExtensionPct: mechLockEnabled ? 68 : 95,
      mechBrakeEngaged: mechLockEnabled,
      valve1Label: 'Przewód zasilający komorę: PĘKNIĘCIE!',
      valve2Label: mechLockEnabled ? 'DNCKE-S: Zacisk awaryjny aktywny' : 'HGL / Uszczelnienie: Brak zatrzymania awaryjnego',
      sensorFeedbackOk: false,
      diagnosticMessage: mechLockEnabled
        ? 'Hamulec DNCKE-S przejął obciążenie osi pionowej mimo rozszczelnienia obwodu.'
        : 'BRAK BLOKADY MECHANICZNEJ: Po rozszczelnieniu lub nieszczelności grawitacja ściąga obciążenie na dół!',
      lines: {
        mainSupply: 'supply',
        pilotCh1: 'neutral',
        pilotCh2: 'neutral',
        workLineA: 'exhaust',
        workLineB: mechLockEnabled ? 'trapped' : 'exhaust',
        exhaustLine: 'exhaust',
      },
      residualEnergyRisk: 'high',
      residualEnergyWarning: mechLockEnabled
        ? 'DNCKE-S zatrzymał opadanie (hamowanie dynamiczne + trzymanie). Pamiętaj: zwykły zacisk KP NIE służy do hamowania w ruchu!'
        : 'KATASTROFICZNA USTERKA DLA OSI PIONOWEJ: Sama pneumatyka bez mechanicznego hamulca (DNCKE) nie gwarantuje Kat. 3/4 dla obciążenia grawitacyjnego.',
      flowExplanation: 'Przy pęknięciu przewodu lub awarii zaworu zwrotnego powietrze uchodzi z komory podpierającej ciężar. Tylko mechaniczna jednostka hamująca DNCKE-S powstrzymuje spadek.',
      safetyStatusLabel: mechLockEnabled
        ? 'AWARIA PRZEWODU — OŚ ZATRZYMANA PRZEZ DNCKE'
        : 'AWARIA KRYTYCZNA — OPADANIE OSI PIONOWEJ',
      safetySeverity: mechLockEnabled ? 'warning' : 'danger',
    };
  }

  // press_vofa_dual
  if (mode === 'normal') {
    return {
      templateId,
      mode,
      mechLockEnabled: false,
      supplyPressureBar: 6.0,
      chamberABar: 6.0,
      chamberBBar: 0.0,
      chamberAState: 'Zasilona przez oba zawory VOFA (6.0 bar)',
      chamberBState: 'Odpowietrzona (0.0 bar)',
      cylinderPositionLabel: 'Suw roboczy prasy (kanały 1 i 2 wysterowane)',
      cylinderExtensionPct: 100,
      mechBrakeEngaged: false,
      valve1Label: 'VOFA Zawór 1: Załączony (czujnik PNP = 0)',
      valve2Label: 'VOFA Zawór 2: Załączony (czujnik PNP = 0)',
      sensorFeedbackOk: true,
      diagnosticMessage: 'Sterownik F-PLC zweryfikował jednoczesne przełączenie obu suwaków w Δt < 150 ms.',
      lines: {
        mainSupply: 'supply',
        pilotCh1: 'pilot',
        pilotCh2: 'pilot',
        workLineA: 'supply',
        workLineB: 'exhaust',
        exhaustLine: 'neutral',
      },
      residualEnergyRisk: 'none',
      residualEnergyWarning: 'Nadmiarowy układ szeregowo-równoległy VOFA monitorowany w trybie ciągłym.',
      flowExplanation: 'Aby ciśnienie dotarło do sprzęgła/siłownika prasy, oba zawory VOFA muszą być wysterowane jednocześnie (połączenie szeregowe zasilania).',
      safetyStatusLabel: 'CYKL ROBOCZY PRASY (KAT. 4 / PL e)',
      safetySeverity: 'safe',
    };
  }

  if (mode === 'safety_demand' || mode === 'power_loss') {
    return {
      templateId,
      mode,
      mechLockEnabled: false,
      supplyPressureBar: 6.0,
      chamberABar: 0.0,
      chamberBBar: 0.0,
      chamberAState: 'Błyskawicznie odpowietrzona (0.0 bar)',
      chamberBState: 'Odpowietrzona (0.0 bar)',
      cylinderPositionLabel: 'Prasa zatrzymana w bezpiecznej pozycji',
      cylinderExtensionPct: 20,
      mechBrakeEngaged: false,
      valve1Label: 'VOFA Zawór 1: Pozycja bezpieczna (czujnik = 1)',
      valve2Label: 'VOFA Zawór 2: Pozycja bezpieczna (czujnik = 1)',
      sensorFeedbackOk: true,
      diagnosticMessage: 'Oba indukcyjne czujniki zbliżeniowe potwierdziły powrót suwaków (DC ≥ 99%).',
      lines: {
        mainSupply: 'supply',
        pilotCh1: 'neutral',
        pilotCh2: 'neutral',
        workLineA: 'exhaust',
        workLineB: 'exhaust',
        exhaustLine: 'exhaust',
      },
      residualEnergyRisk: 'none',
      residualEnergyWarning: 'Brak ciśnienia resztkowego — droga odpowietrzająca otwarta równolegle przez oba zawory.',
      flowExplanation: 'Wyłączenie obu cewek odcina zasilanie i otwiera dwie równoległe drogi szybkiego odpowietrzenia do portu 3.',
      safetyStatusLabel: 'BEZPIECZNE ZATRZYMANIE PRASY',
      safetySeverity: 'safe',
    };
  }

  // single_fault on VOFA
  return {
    templateId,
    mode,
    mechLockEnabled: false,
    supplyPressureBar: 6.0,
    chamberABar: 0.0,
    chamberBBar: 0.0,
    chamberAState: 'Odpowietrzona przez Zawór 2 (0.0 bar)',
    chamberBState: 'Odpowietrzona (0.0 bar)',
    cylinderPositionLabel: 'Zatrzymana bezpiecznie — blokada ponownego cyklu',
    cylinderExtensionPct: 20,
    mechBrakeEngaged: false,
    valve1Label: 'VOFA Zawór 1: ZACIĘTY (czujnik = 0 mimo braku 24V!)',
    valve2Label: 'VOFA Zawór 2: Powrócił poprawnie (czujnik = 1)',
    sensorFeedbackOk: false,
    diagnosticMessage: 'WYKRYTO ROZBIEŻNOŚĆ (Plausibility Check Δt): Zawór 1 nie powrócił! Funkcja bezpieczeństwa utrzymana przez Zawór 2, restart zablokowany.',
    lines: {
      mainSupply: 'supply',
      pilotCh1: 'neutral',
      pilotCh2: 'neutral',
      workLineA: 'exhaust',
      workLineB: 'exhaust',
      exhaustLine: 'exhaust',
    },
    residualEnergyRisk: 'none',
    residualEnergyWarning: 'Dzięki równoległemu odpowietrzaniu i szeregowemu zasilaniu zacięcie jednego zaworu nie powoduje niezamierzonego ruchu prasy ani uwięzienia powietrza.',
    flowExplanation: 'Zawór 2 odcina dopływ sprężonego powietrza i przejmuje pełne odpowietrzenie komory roboczej. Indukcyjny czujnik na Zaworze 1 natychmiast raportuje błąd do F-PLC.',
    safetyStatusLabel: 'BŁĄD KANAŁU 1 WYKRYTY — BLOKADA RESTARTU',
    safetySeverity: 'warning',
  };
}
