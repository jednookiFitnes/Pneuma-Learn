export type IfaExampleId =
  | 'ifa_ex2'
  | 'ifa_ex11'
  | 'ifa_ex14'
  | 'ifa_ex25'
  | 'ifa_ex26'
  | 'ifa_ex31';

export type IfaSimState = 'normal' | 'safety_demand' | 'single_fault';

export interface IfaStateBehavior {
  statusBadge: string;
  severity: 'safe' | 'warning' | 'danger';
  summary: string;
  flowDetail: string;
  faultDetection: string;
}

export interface IfaExampleItem {
  id: IfaExampleId;
  exampleNumber: number;
  sectionRef: string;
  pageRef: string;
  originalTitle: string;
  polishTitle: string;
  category: '1' | '2' | '3' | '4';
  pl: 'c' | 'd' | 'e';
  safetyFunctionCode: string;
  isHistoricalNote?: boolean;
  historicalBanner?: string;
  tags: string[];
  parameters: {
    pfhd: string;
    b10d: string;
    cycleProfile: string;
    mttfd: string;
    t10d: string;
    dcAvg: string;
    ccfScore: string;
    ccfBreakdown: string[];
  };
  principles: {
    basic: string[];
    wellTried: string[];
  };
  explanationSteps: {
    normalOperation: string;
    onSafetyDemand: string;
    onSingleFault: string;
  };
  states: Record<IfaSimState, IfaStateBehavior>;
  whyThisCategory: {
    summary: string;
    vsLower: string;
    vsHigher: string;
  };
  specialistWarning: string;
}

export const IFA_EXAMPLES: IfaExampleItem[] = [
  {
    id: 'ifa_ex2',
    exampleNumber: 2,
    sectionRef: 'Rozdz. 8.2.2',
    pageRef: 'str. 108–109',
    originalTitle: 'Pneumatic valve (subsystem) – Category 1 – PL c',
    polishTitle: 'Zawór pneumatyczny (podsystem) — Kat. 1 / PL c',
    category: '1',
    pl: 'c',
    safetyFunctionCode: 'SSC (Bezpieczne zatrzymanie i odcięcie)',
    tags: ['1V1 (5/3 zamkn.)', '1A1 (Siłownik)', 'Sprawdzony komponent'],
    parameters: {
      pfhd: '1,1 × 10⁻⁶ / h (PL c)',
      b10d: '20 000 000 cykli [S] (wg IFA / VDMA)',
      cycleProfile: 'dop = 240 dni/rok · hop = 16 h/dzień · t_cycle = 10 s (nop = 1 382 400 / rok)',
      mttfd: '100 lat — „Wysokie” (surowe 145 lat, ograniczone limitem 100 lat dla Kat. 1)',
      t10d: '14,5 lat (< 20 lat — wymagana planowa wymiana zaworu 1V1!)',
      dcAvg: 'Nie dotyczy (Brak — 0%, Kat. 1 nie wymaga diagnostyki automatycznej)',
      ccfScore: 'Nie dotyczy w Kat. 1 (architektura jednokanałowa)',
      ccfBreakdown: [
        'W Kategorii 1 ocena punktowa CCF (Zał. F) nie jest formalnie wymagana, ale czystość powietrza (ISO 8573-1) pozostaje warunkiem zasad podstawowych.',
      ],
    },
    principles: {
      basic: [
        'Czyste, przefiltrowane sprężone powietrze (FRL) zapobiegające zanieczyszczeniu suwaka.',
        'Prawidłowy dobór wymiarów, zabezpieczenie przed nadciśnieniem i montaż zgodnie z EN ISO 4414.',
        'Wyłączenie napędu przez odcięcie energii sterującej (zasada zaniku napięcia).',
      ],
      wellTried: [
        'Zastosowanie sprawdzonego komponentu (well-tried component) 1V1: zawór 5/3 o wystarczającym przekryciu (positive overlap).',
        'Sprężyny centrujące odporne na zmęczenie z zapasem siły powrotu (EN ISO 13849-2, Tab. B.2).',
        'Regularna praca cykliczna zapobiegająca zjawisku pęcznienia i sklejania uszczelek miękkich.',
      ],
    },
    explanationSteps: {
      normalOperation:
        'Podsystem stanowi pojedynczy sprawdzony zawór rozdzielający 5/3 (1V1) ze środkiem zamkniętym sterujący siłownikiem dwustronnego działania 1A1. Podczas pracy normalnej cewki 14 lub 12 przesterowują suwak, doprowadzając sprężone powietrze do odpowiedniej komory siłownika.',
      onSafetyDemand:
        'W momencie żądania funkcji bezpieczeństwa SSC (np. otwarcie osłony lub STOP) nadrzędny układ elektryczny odcina napięcie z obu cewek 1V1. Sprężyny centrujące ustawiają suwak w pozycji środkowej zamkniętej, odcinając wszystkie porty i zatrzymując ruch siłownika.',
      onSingleFault:
        'Kategoria 1 NIE jest odporna na pojedynczą usterkę! Jeżeli suwak zaworu 1V1 zatnie się w pozycji roboczej (np. wskutek zanieczyszczenia lub pęknięcia sprężyny), siłownik wykona pełny, niekontrolowany ruch do krańca. Niezawodność opiera się wyłącznie na niskim prawdopodobieństwie uszkodzenia sprawdzonego komponentu.',
    },
    states: {
      normal: {
        statusBadge: 'PRACA NORMALNA (1V1 WYSTEROWANY)',
        severity: 'safe',
        summary: 'Cewka 14 zaworu 1V1 podaje 6 bar z portu 1 do portu 4 (komora tłokowa 1A1). Komora tłoczyskowa odpowietrza się 2→3.',
        flowDetail: 'Zasilanie: P1 → 1V1 (lewy kwadrat 1→4) → lewy króciec 1A1. Wydech: prawy króciec 1A1 → 2→3 (tłumik).',
        faultDetection: 'Brak automatycznej diagnostyki (DC = 0%).',
      },
      safety_demand: {
        statusBadge: 'STAN BEZPIECZNY (SSC — ŚRODEK ZAMKNIĘTY)',
        severity: 'safe',
        summary: 'Oba sygnały 24V DC zdjęte. Sprężyny centrujące ustawiły 1V1 w położeniu środkowym zamkniętym — ruch zatrzymany.',
        flowDetail: 'Wszystkie porty 1, 2, 3, 4, 5 zamknięte (T). Uwaga na powietrze uwięzione w komorach i ewentualne powolne pełzanie przy przeciekach.',
        faultDetection: 'Brak kontroli położenia suwaka. Bezpieczeństwo gwarantuje sprawdzona konstrukcja 1V1.',
      },
      single_fault: {
        statusBadge: 'KRYTYCZNA UTRATA FUNKCJI (ZACIĘCIE 1V1!)',
        severity: 'danger',
        summary: 'Usterka pojedyncza w Kat. 1 prowadzi bezpośrednio do utraty funkcji bezpieczeństwa — suwak 1V1 zablokował się w pozycji 1→4!',
        flowDetail: 'Mimo braku napięcia 24V na cewce 14 powietrze nadal zasila lewą komorę 1A1, powodując niebezpieczny ruch tłoczyska.',
        faultDetection: 'USTERKA NIEWYKRYTA! Brak kanału testowego (Kat. 2) oraz brak redundancji (Kat. 3/4).',
      },
    },
    whyThisCategory: {
      summary:
        'Kategoria 1 to jednokanałowa architektura wykorzystująca wyłącznie podstawowe i sprawdzone zasady bezpieczeństwa oraz sprawdzone komponenty o wysokim MTTFD (≥ 30 lat). Pozwala osiągnąć maksymalnie PL c.',
      vsLower:
        'W porównaniu do Kategorii B (maks. PL b) wymaga sprawdzonych komponentów (well-tried) i wyższego MTTFD, co pozwala podnieść osiągany poziom do PL c.',
      vsHigher:
        'Nie może osiągnąć PL d ani PL e, ponieważ pojedyncze zacięcie zaworu 1V1 natychmiast powoduje utratę funkcji bezpieczeństwa — brakuje kanału testowego z wyjściem zastępczym (Kat. 2) lub drugiego toru odcinającego (Kat. 3/4).',
    },
    specialistWarning:
      'Przykład 2 z raportu IFA 2/2017e opisuje wyłącznie podsystem pneumatyczny (wyjście O). Na rzeczywistej maszynie układ wymaga kompletnej logiki elektrycznej, zabezpieczenia przed energią resztkową oraz weryfikacji, czy T10D = 14,5 lat jest ujęte w harmonogramie wymian prewencyjnych.',
  },

  {
    id: 'ifa_ex11',
    exampleNumber: 11,
    sectionRef: 'Rozdz. 8.2.11',
    pageRef: 'str. 132–134',
    originalTitle: 'Tested pneumatic valve (subsystem) – Category 2 – PL d',
    polishTitle: 'Testowany zawór pneumatyczny (podsystem) — Kat. 2 / PL d',
    category: '2',
    pl: 'd',
    safetyFunctionCode: 'SSC + zastępcze SDE (Kat. 2: TE + OTE)',
    tags: ['1V1 (5/3)', '0V1 (3/2 OTE)', '1S1 (Pomiar drogi)', 'K1 (PLC TE)'],
    parameters: {
      pfhd: '7,6 × 10⁻⁷ / h (PL d)',
      b10d: '1V1 i 0V1: 20 000 000 cykli [S] · 1S1: MTTFD = 150 lat · K1: MTTFD = 50 lat',
      cycleProfile: '1V1: 240 d · 16 h · t_cycle = 5 s (nop = 2,76 mln/rok) · 0V1: 1× dziennie (240/rok)',
      mttfd: 'Kanał funkcyjny: 72,3 lat („Wysokie”) · Kanał testowy TE: 37,5 lat (≥ 0,5 × 72,3)',
      t10d: '1V1: ok. 7,2 lat (obowiązkowa wymiana prewencyjna co ~7 lat!)',
      dcAvg: '60% („Niskie”) dla 1V1 przez dynamiczną kontrolę drogi/czasu w 1S1 + K1',
      ccfScore: '85 / 100 pkt (Spełnione ≥ 65 pkt)',
      ccfBreakdown: [
        'Separacja fizyczna: 15 pkt',
        'Różnorodność (różne technologie: zawór 5/3 vs przetwornik 1S1 + PLC K1 + zawór 0V1): 20 pkt',
        'Ochrona przed nadciśnieniem i przepięciami: 15 pkt',
        'Czystość powietrza / filtracja / środowisko i EMC: 25 + 10 pkt',
      ],
    },
    principles: {
      basic: [
        'Niezależność kanału testowego: sterownik K1 kontrolujący 1S1 i 0V1 NIE może jednocześnie sterować roboczo zaworem 1V1 (wymóg IFA!).',
        'Uwzględnienie dłuższego czasu zatrzymania przy awaryjnym odpowietrzeniu przez 0V1 w obliczeniu odległości bezpieczeństwa.',
      ],
      wellTried: [
        'Zawory 1V1 i 0V1 ze sprężynowym powrotem oraz sprawdzonym przekryciem suwaka.',
        'Codzienny test ruchowy zaworu odcinającego 0V1 (1×/dzień) przeciw sklejaniu uszczelek.',
      ],
    },
    explanationSteps: {
      normalOperation:
        'W pracy normalnej ruch siłownika 1A1 realizuje jednokanałowy zawór 5/3 (1V1). Nadrzędny zawór 3/2 (0V1) pozostaje otwarty, podając ciśnienie zasilania. Przetwornik położenia 1S1 mierzy pozycję tłoczyska i przekazuje ją do układu testowego K1.',
      onSafetyDemand:
        'Żądanie bezpieczeństwa zdejmuje wysterowanie z 1V1 (powrót do środka zamkniętego). Natychmiast po żądaniu układ testowy K1 sprawdza za pomocą 1S1, czy tłoczysko rzeczywiście zatrzymało się w dopuszczalnej charakterystyce droga–czas.',
      onSingleFault:
        'Gdy zawór 1V1 zatnie się w pozycji otwartej i tłoczysko nadal się porusza (lub przekroczy dozwoloną drogę wybiegu), czujnik 1S1 zgłasza anomalię do K1 (TE). K1 natychmiast wyłącza wyjście zastępcze OTE — zawór 3/2 (0V1) odcina dopływ sprężonego powietrza i odpowietrza zasilanie 1V1 do atmosfery (SDE)!',
    },
    states: {
      normal: {
        statusBadge: 'PRACA NORMALNA (0V1 OTWARTY, 1V1 STERUJE)',
        severity: 'safe',
        summary: 'Zawór 0V1 podaje 6 bar na wejście 1 zaworu 1V1. Przetwornik 1S1 na bieżąco raportuje ruch tłoczyska do K1.',
        flowDetail: 'Zasilanie: P1 → 0V1 (1→2) → 1V1 (1→4) → komora tłokowa 1A1. Kanał testowy K1 w gotowości.',
        faultDetection: 'Ciągły nadzór spójności ruchu przez 1S1 → K1 (DC = 60%).',
      },
      safety_demand: {
        statusBadge: 'STAN BEZPIECZNY (1V1 ZAMKNIĘTY, TEST OK)',
        severity: 'safe',
        summary: 'Zawór 1V1 wrócił do pozycji środkowej zamkniętej. Przetwornik 1S1 potwierdził brak ruchu w czasie t_test.',
        flowDetail: '1V1 blokuje obie komory 1A1. Zawór 0V1 pozostaje w gotowości (testowany osobno min. 1× na dobę).',
        faultDetection: 'Test żądaniowy (on-demand) zaliczony pozytywnie przez K1.',
      },
      single_fault: {
        statusBadge: 'USTERKA 1V1 WYKRYTA → WYZWOLENIE OTE (0V1)!',
        severity: 'warning',
        summary: 'Suwak 1V1 zaciął się w pozycji roboczej! 1S1 wykrył niepożądany ruch → K1 wyłączył zawór 0V1, który odpowietrzył zasilanie!',
        flowDetail: '0V1 przeszedł na pozycję spoczynkową (1 zamknięte T, 2→3 wydech) — ciśnienie spada do 0 bar mimo zablokowanego 1V1.',
        faultDetection: 'Kanał TE (1S1 + K1) wykrył błąd i aktywował OTE (0V1). Uwaga: w Kat. 2 krótki wybieg w trakcie testu musi być bezpieczny!',
      },
    },
    whyThisCategory: {
      summary:
        'Kategoria 2 opiera się na jednym kanale funkcyjnym (1V1) sprawdzanym cyklicznie lub na żądanie przez niezależny sprzęt testowy TE (1S1 + K1), który w razie błędu aktywuje wyjście bezpieczne OTE (0V1). Wymaga MTTFD,TE ≥ 0,5 · MTTFD kanału funkcyjnego i CCF ≥ 65 pkt.',
      vsLower:
        'W odróżnieniu od Kat. 1 (PL c), dodanie automatycznego testu i niezależnego zaworu odcinającego 0V1 wykrywa zacięcie 1V1 i pozwala osiągnąć PL d.',
      vsHigher:
        'W Kat. 2 pojedyncza usterka może chwilowo spowodować utratę funkcji między kolejnymi testami (zatrzymanie przez 0V1 ma większy wybieg niż w architekturze redundantnej Kat. 3/4). Ponadto do osiągnięcia PL e konieczna jest Kat. 3 lub Kat. 4.',
    },
    specialistWarning:
      'Zgodnie z IFA Report 2/2017e warunek Kat. 2 wymaga, aby czas testu + reakcji OTE (0V1) był krótszy niż czas dojścia operatora do strefy niebezpiecznej (lub częstotliwość testów ≥ 100× częstotliwość żądań). Układ wymaga walidacji rzeczywistego wybiegu i niezależności logicznej K1.',
  },

  {
    id: 'ifa_ex14',
    exampleNumber: 14,
    sectionRef: 'Rozdz. 8.2.14',
    pageRef: 'str. 144–146',
    originalTitle: 'Pneumatic valve control (subsystem) – Category 3 – PL d',
    polishTitle: 'Sterowanie zaworem + hamulec tłoczyska — Kat. 3 / PL d',
    category: '3',
    pl: 'd',
    safetyFunctionCode: 'SSC + SBC (Zróżnicowana redundancja: 5/3 + Hamulec 2Z1)',
    tags: ['1V1 (5/3)', '2V1 (3/2)', '2Z1 (Hamulec)', '2S1 (Presostat)', '1S1 (Droga)'],
    parameters: {
      pfhd: '1,1 × 10⁻⁷ / h (PL d)',
      b10d: '1V1 i 2V1: 20 000 000 [S] · Hamulec mechaniczny 2Z1: 5 000 000 [M]',
      cycleProfile: 'dop = 240 dni/rok · hop = 16 h/dzień · t_cycle = 15 s (nop = 921 600 / rok)',
      mttfd: 'Zsymetryzowane 75 lat („Wysokie”: Kanał 1 = 217→100 lat, Kanał 2 = 43 lat)',
      t10d: 'Hamulec 2Z1: 5,4 lat (wymagana okresowa inspekcja i wymiana okładzin!)',
      dcAvg: '76,5% („Niskie”: 2V1 = 99% przez 2S1, 1V1 = 60%, 2Z1 = 75% testem przez 1S1)',
      ccfScore: '85 / 100 pkt (Spełnione ≥ 65 pkt)',
      ccfBreakdown: [
        'Separacja fizyczna toru pneumatycznego i hamulca: 15 pkt',
        'Różnorodność (dywersyfikacja: zawór 5/3 vs mechaniczny hamulec tłoczyska 2Z1): 20 pkt',
        'Ochrona przed nadciśnieniem i przeciążeniem: 15 pkt',
        'Czystość powietrza / filtracja / środowisko: 25 + 10 pkt',
      ],
    },
    principles: {
      basic: [
        'Dwukanałowe zróżnicowane zatrzymanie (pneumatyczne 1V1 + mechaniczne 2Z1 na tłoczysku) — idealne dla osi pionowych i dużych mas.',
        'Obowiązkowy test trzymania hamulca (static brake test) min. co 8 godzin pracy przy użyciu przetwornika 1S1.',
      ],
      wellTried: [
        'Certyfikowana jednostka hamująca 2Z1 (np. Festo DNCKE-S) przystosowana do dynamicznego hamowania w ruchu (nie zwykły zacisk!).',
        'Bezpośredni nadzór ciśnienia odblokowującego hamulec za pomocą presostatu 2S1 (DC = 99% dla 2V1).',
      ],
    },
    explanationSteps: {
      normalOperation:
        'Kanał 1 (zawór 5/3 1V1) steruje ruchem siłownika 1A1. Równolegle Kanał 2 (zawór 3/2 2V1) podaje ciśnienie odblokowujące (> 3,5 bar) na mechaniczną jednostkę hamującą 2Z1, utrzymując jej szczęki otwarte. Presostat 2S1 potwierdza stan ciśnienia na hamulcu.',
      onSafetyDemand:
        'Przy żądaniu zatrzymania oba kanały zostają jednocześnie odłączone: 1V1 wraca do środka zamkniętego (SSC), a 2V1 gwałtownie odpowietrza jednostkę hamującą 2Z1, której sprężyny natychmiast zaciskają szczęki na tłoczysku (SBC).',
      onSingleFault:
        'Zacięcie zaworu 1V1 w pozycji roboczej NIE powoduje utraty bezpieczeństwa — niezależny Kanał 2 (2V1 + hamulec 2Z1) mechanicznie zatrzymuje i blokuje tłoczysko. Z kolei usterka zaworu 2V1 jest wykrywana natychmiast przez presostat 2S1 (DC = 99%), a zużycie okładzin 2Z1 przez test statyczny/wybiegu na przetworniku 1S1.',
    },
    states: {
      normal: {
        statusBadge: 'PRACA NORMALNA (1V1 STERUJE, 2Z1 OTWARTY)',
        severity: 'safe',
        summary: 'Zawór 2V1 podaje ciśnienie zwalniające hamulec 2Z1 (2S1 = 1), a 1V1 realizuje ruch siłownika 1A1.',
        flowDetail: 'Kanał 1: 1V1 zasila lewą komorę 1A1. Kanał 2: 2V1 podaje 6 bar do 2Z1 (szczęki rozwarte).',
        faultDetection: 'Presostat 2S1 potwierdza otwarcie hamulca; 1S1 śledzi trajektorię ruchu.',
      },
      safety_demand: {
        statusBadge: 'STAN BEZPIECZNY (SSC + HAMULEC 2Z1 ZACIŚNIĘTY)',
        severity: 'safe',
        summary: '1V1 w położeniu zamkniętym, 2V1 odpowietrzył jednostkę 2Z1 — sprężyny zacisnęły tłoczysko na sztywno.',
        flowDetail: 'Kanał 1: obie komory odcięte (powietrze uwięzione). Kanał 2: linia 2Z1 odpowietrzona (0 bar) → 2S1 = 0.',
        faultDetection: '2S1 potwierdza spadek ciśnienia w 2Z1; 1S1 weryfikuje brak pełzania osi.',
      },
      single_fault: {
        statusBadge: 'USTERKA KANAŁU 1 (1V1 ZACIĘTY) — 2Z1 TRZYMA OŚ!',
        severity: 'warning',
        summary: 'Mimo zacięcia suwaka 1V1 w pozycji zasilającej, niezależny hamulec mechaniczny 2Z1 zatrzymuje siłownik!',
        flowDetail: '1V1 podaje 6 bar na komorę tłokową, lecz 2V1 odpowietrzył hamulec 2Z1, który mechanicznie unieruchamia tłoczysko.',
        faultDetection: 'Kategoria 3 zachowana! 1S1 wykrywa odchylenie w teście i blokuje kolejny cykl.',
      },
    },
    whyThisCategory: {
      summary:
        'Kategoria 3 zapewnia pełną odporność na pojedynczą usterkę dzięki dwóm niezależnym, zróżnicowanym kanałom zatrzymania (pneumatyczny 1V1 + mechaniczny 2V1/2Z1). Połączenie Kat. 3 + wysokie MTTFD (75 lat) + niskie DCavg (76,5%) daje PL d.',
      vsLower:
        'W przeciwieństwie do Kat. 2 (Przykład 11), pojedyncza usterka nie powoduje nawet chwilowej utraty funkcji zatrzymania — drugi kanał działa od razu równolegle.',
      vsHigher:
        'Dlaczego PL d, a nie PL e? Ponieważ średnie pokrycie diagnostyczne DCavg wynosi 76,5% („Niskie” — poniżej progu 90% wymaganego dla Kat. 3 / PL e, głównie ze względu na DC = 60% dla 1V1 i 75% dla hamulca 2Z1).',
    },
    specialistWarning:
      'Dla osi pionowych pod obciążeniem grawitacyjnym siła trzymania hamulca 2Z1 musi pokonać zarówno ciężar masy, jak i pełną siłę siłownika przy zaciętym 1V1! Wymagany jest rzeczywisty test hamowania dynamicznego i harmonogram wymiany okładzin (T10D ≈ 5,4 lat).',
  },

  {
    id: 'ifa_ex25',
    exampleNumber: 25,
    sectionRef: 'Rozdz. 8.2.25',
    pageRef: 'str. 192–194',
    originalTitle: 'Pneumatic valve control (subsystem) – Category 3 – PL e',
    polishTitle: 'Zawór 5/3 + dwa sterowane zawory odcinające — Kat. 3 / PL e',
    category: '3',
    pl: 'e',
    safetyFunctionCode: 'SSC (Redundantne odcięcie: 1V1 + 2V1/2V2/2V3)',
    tags: ['1V1 (5/3)', '2V1 (Pilot 3/2)', '2V2, 2V3 (HGL)', '2S1 (Presostat)'],
    parameters: {
      pfhd: '4,3 × 10⁻⁸ / h (PL e wg EN ISO 13849-1 / IFA SISTEMA)',
      b10d: '1V1, 2V1, 2V2, 2V3: 20 000 000 cykli [S]',
      cycleProfile: 'dop = 240 dni/rok · hop = 16 h/dzień · t_cycle = 20 s (nop = 691 200 / rok)',
      mttfd: 'Zsymetryzowane 98,2 lat („Wysokie” — oba kanały bliskie limitu 100 lat)',
      t10d: '28,9 lat (> 20 lat — brak wymogu wymiany prewencyjnej w czasie misji TM = 20 lat)',
      dcAvg: '90% („Średnie” — 2V1 = 99% przez 2S1; cykliczna kontrola przełączania 1V1 i 2V2/2V3)',
      ccfScore: '85 / 100 pkt (Spełnione ≥ 65 pkt)',
      ccfBreakdown: [
        'Separacja fizyczna: 15 pkt',
        'Różnorodność (zawór 5/3 suwakowy vs zawory grzybkowe zwrotne sterowane 2V2/2V3): 20 pkt',
        'Ochrona przed nadciśnieniem i skokami ciśnienia: 15 pkt',
        'Czystość powietrza / filtracja / środowisko: 25 + 10 pkt',
      ],
    },
    principles: {
      basic: [
        'Montaż zaworów odcinających (zwrotnych sterowanych) 2V2 i 2V3 bezpośrednio na przyłączach siłownika 1A1 — minimalizacja ryzyka pęknięcia węża między zaworem a cylindrem.',
        'Zabezpieczenie przed pułapką powietrzną i skokami ciśnienia przy nagłym zamknięciu komór.',
      ],
      wellTried: [
        'Zróżnicowanie konstrukcyjne: Kanał 1 to zawór suwakowy 5/3 (1V1), a Kanał 2 to zawór pilotowy 3/2 (2V1) sterujący parą zaworów zwrotnych/odcinających (2V2, 2V3).',
        'Monitorowanie sygnału sterującego 2V1 presostatem 2S1 (DC = 99%) oraz weryfikacja położenia/szczelności.',
      ],
    },
    explanationSteps: {
      normalOperation:
        'W trakcie pracy normalnej zawór pilotowy 2V1 (3/2) jest wysterowany i podaje sygnał pneumatyczny (port 21) otwierający oba sterowane zawory zwrotne 2V2 oraz 2V3 (zamontowane przy siłowniku). Presostat 2S1 potwierdza obecność pilota, a zawór 1V1 (5/3) swobodnie steruje siłownikiem 1A1.',
      onSafetyDemand:
        'Po wyzwoleniu funkcji bezpieczeństwa SSC oba kanały odcinają ruch: 1V1 przechodzi w środek zamknięty, a 2V1 odpowietrza linię pilotową zaworów 2V2 i 2V3, które natychmiast zamykają obie komory bezpośrednio na korpusie siłownika.',
      onSingleFault:
        'Jeżeli zawór 1V1 zatnie się w pozycji roboczej, zawory 2V2 i 2V3 nadal skutecznie blokują wypływ i dopływ powietrza do siłownika. Z kolei zacięcie zaworu 2V1 w pozycji otwartej jest natychmiast wykrywane przez presostat 2S1 (w oknie Δt po zdjęciu napięcia), a ruch zatrzymuje zawór 1V1.',
    },
    states: {
      normal: {
        statusBadge: 'PRACA NORMALNA (2V1 OTWIERA 2V2/2V3, 1V1 STERUJE)',
        severity: 'safe',
        summary: 'Zawór 2V1 odblokował parę 2V2/2V3 (presostat 2S1 = 1), a 1V1 przesterował siłownik 1A1.',
        flowDetail: 'Kanał 1: 1V1 (1→4) → otwarty 2V2 → lewa komora 1A1. Kanał 2: 2V1 podaje pilota na 2V2 i 2V3.',
        faultDetection: 'Presostat 2S1 weryfikuje obecność ciśnienia pilotowego z 2V1.',
      },
      safety_demand: {
        statusBadge: 'STAN BEZPIECZNY (1V1 + 2V2/2V3 ZAMKNIĘTE)',
        severity: 'safe',
        summary: 'Oba tory odcięły przepływ: 1V1 w środku zamkniętym oraz 2V2/2V3 zatrzaśnięte bezpośrednio na siłowniku.',
        flowDetail: 'Linia pilotowa z 2V1 odpowietrzona (0 bar, 2S1 = 0). Powietrze uwięzione w komorach 1A1 — ruch zablokowany.',
        faultDetection: 'Presostat 2S1 potwierdził odpowietrzenie pilota 2V1 (DC = 99% dla 2V1).',
      },
      single_fault: {
        statusBadge: 'USTERKA 2V1 WYKRYTA PRZEZ 2S1 — 1V1 ZATRZYMUJE!',
        severity: 'warning',
        summary: 'Zawór pilotowy 2V1 zaciął się w pozycji otwartej (2V2/2V3 pozostały odblokowane), ale 1V1 zamknął przepływ!',
        flowDetail: 'Mimo obecności pilota na 2V2/2V3, Kanał 1 (1V1 w środku zamkniętym) odcina zasilanie i utrzymuje siłownik.',
        faultDetection: 'ALARM 2S1: Presostat nadal widzi ciśnienie po wyłączeniu 2V1 → F-PLC wykrywa usterkę i blokuje restart!',
      },
    },
    whyThisCategory: {
      summary:
        'Przykład 25 pokazuje, że poziom PL e można osiągnąć już w Kategorii 3, o ile oba kanały redundantne mają wysokie MTTFD (bliskie 100 lat, tutaj 98,2 lat), CCF ≥ 65 pkt (tutaj 85 pkt) oraz co najmniej średnie pokrycie diagnostyczne DCavg (≥ 90%).',
      vsLower:
        'W porównaniu do Przykładu 14 (Kat. 3 / PL d), wyższe MTTFD (98,2 vs 75 lat — brak szybciej zużywającego się hamulca mechanicznego) oraz wyższe pokrycie diagnostyczne podnoszą PFHD poniżej progu 10⁻⁷/h (PL e).',
      vsHigher:
        'W odróżnieniu od Kat. 4 (Przykład 31), Kat. 3 nie gwarantuje wykrycia absolutnie każdej akumulacji usterek (DCavg < 99%) i ma limit MTTFD kanału 100 lat zamiast 2500 lat. Ponadto układ SSC tworzy pułapkę powietrzną (w przeciwieństwie do SDE w Przykładzie 31).',
    },
    specialistWarning:
      'Uwaga na pułapkę powietrzną między 2V2/2V3 a tłokiem! Przy zatrzymywaniu dużych mas zawory HGL potrafią wygenerować skoki ciśnienia > 30 bar, a dla osi pionowych wymagają analizy szczelności lub dodatkowego hamulca mechanicznego. Wymagana walidacja przez specjalistę.',
  },

  {
    id: 'ifa_ex26',
    exampleNumber: 26,
    sectionRef: 'Rozdz. 8.2.26',
    pageRef: 'str. 196 (nota edycyjna)',
    originalTitle: 'Pneumatic valve control – Category 3 – PL e (Deleted in 2017 ed.)',
    polishTitle: 'Klasyczny układ dwuzaworowy (nota IFA 2/2017e) — Kat. 3 / PL e',
    category: '3',
    pl: 'e',
    safetyFunctionCode: 'SDE / SSC (Rekonstrukcja historyczna BGIA 2/2008e)',
    isHistoricalNote: true,
    historicalBanner:
      'W oficjalnej edycji IFA Report 2/2017e (str. 196) sekcja 8.2.26 zawiera adnotację: „This example has been deleted, since the technology is no longer relevant.” Poniżej prezentujemy edukacyjną rekonstrukcję klasycznego układu dwuzaworowego z poprzedniej edycji (BGIA 2/2008e) wraz z wyjaśnieniem, dlaczego zastąpiły go współczesne rozwiązania z Przykładów 25 i 31.',
    tags: ['Nota IFA 2017', '1V1, 1V2 (2× 5/2)', '1S1, 1S2 (Nadzór zewn.)'],
    parameters: {
      pfhd: 'Historycznie: ok. 4,5 × 10⁻⁸ / h (Kat. 3 / PL e)',
      b10d: 'Klasyczne zawory 5/2 (1V1, 1V2): 20 000 000 cykli [S]',
      cycleProfile: 'Układ historyczny BGIA 2/2008e (zastąpiony przez Przykład 25 i 31 w edycji 2/2017e)',
      mttfd: 'Wysokie (~95–100 lat po symetryzacji obu kanałów)',
      t10d: 'Zależne od cyklu (typowo > 20 lat przy umiarkowanej częstotliwości)',
      dcAvg: 'Średnie (90%) — przy zewnętrznej kontroli krzyżowej wyłącznikami/presostatami',
      ccfScore: '≥ 65 pkt (wymagana separacja, filtracja i ochrona przed nadciśnieniem)',
      ccfBreakdown: [
        'Separacja fizyczna przewodów sterujących: 15 pkt',
        'Ochrona przed nadciśnieniem i przeciążeniem: 15 pkt',
        'Czystość powietrza / filtracja / środowisko: 25 + 10 pkt',
        'Brak dywersyfikacji (identyczne zawory 1V1 i 1V2): 0 pkt — identycznie jak w Przykładzie 31',
      ],
    },
    principles: {
      basic: [
        'Historycznie: dwa szeregowo-równoległe zawory 5/2 lub 3/2 z zewnętrznym nadzorem stanu ciśnienia/położenia.',
        'Powód usunięcia w 2017 r.: zewnętrzne monitorowanie ciśnienia nie wykrywało niezawodnie wszystkich usterek wewnętrznych uszczelek i przekrycia w nowoczesnych maszynach.',
      ],
      wellTried: [
        'Współczesny standard przemysłowy (Przykład 31) integruje bezpośrednie czujniki położenia suwaka (indukcyjne G) fabrycznie wewnątrz certyfikowanego bloku zaworowego (np. Festo VOFA / MS6-SV).',
      ],
    },
    explanationSteps: {
      normalOperation:
        'W klasycznym układzie z edycji BGIA 2/2008e dwa niezależne zawory sterujące 1V1 i 1V2 współpracowały szeregowo na linii zasilania siłownika 1A1. Oba zawory musiały być przesterowane jednocześnie, aby podać ciśnienie robocze.',
      onSafetyDemand:
        'Odcięcie napięcia z obu cewek 1V1 i 1V2 powodowało powrót obu suwaków sprężyną i szybkie odpowietrzenie komory roboczej. Zewnętrzne przetworniki/presostaty 1S1 i 1S2 potwierdzały w przekaźniku/PLC zanik ciśnienia w obu sekcjach.',
      onSingleFault:
        'Przy zacięciu zaworu 1V1 drugi zawór 1V2 nadal bezpiecznie odpowietrzał siłownik, a różnica sygnałów na zewnętrznych czujnikach 1S1/1S2 wykrywała rozbieżność. Zewnętrzna diagnostyka ciśnieniowa osiągała jednak tylko DC ≈ 90% (Kat. 3) i była podatna na błędy montażowe — dlatego IFA w 2017 r. usunęła ten przykład, rekomendując fabrycznie monitorowane zawory z Przykładu 31.',
    },
    states: {
      normal: {
        statusBadge: 'PRACA NORMALNA (REKONSTRUKCJA 1V1 + 1V2)',
        severity: 'safe',
        summary: 'Oba szeregowe zawory 1V1 i 1V2 załączone jednocześnie — zasilanie dociera do siłownika 1A1.',
        flowDetail: 'P1 → 1V1 (1→2) → 1V2 (1→4) → lewa komora 1A1. Zewnętrzne czujniki 1S1 i 1S2 aktywne.',
        faultDetection: 'Zewnętrzny nadzór krzyżowy (DC ≈ 90%) — dziś zastąpiony przez wbudowane czujniki suwaków (DC = 99%).',
      },
      safety_demand: {
        statusBadge: 'STAN BEZPIECZNY (SDE — ODPOWIETRZENIE)',
        severity: 'safe',
        summary: 'Oba zawory 1V1 i 1V2 rozłączone — zasilanie odcięte, siłownik odpowietrzony.',
        flowDetail: '1V1 i 1V2 w pozycjach spoczynkowych: droga zasilania zamknięta, komora 1A1 połączona z atmosferą.',
        faultDetection: 'Zewnętrzne czujniki 1S1 i 1S2 potwierdzają spadek ciśnienia w obu sekcjach.',
      },
      single_fault: {
        statusBadge: 'USTERKA 1V1 — 1V2 ODPOWIETRZA (OGRANICZENIA DC)',
        severity: 'warning',
        summary: '1V1 zacięty, ale 1V2 odcina zasilanie i opróżnia siłownik. Zewnętrzny pomiar ciśnienia ma jednak martwe strefy diagnostyczne.',
        flowDetail: 'Ciśnienie między 1V1 a 1V2 pozostaje (1S1 = 1), lecz 1V2 odpowietrza 1A1 (1S2 = 0).',
        faultDetection: 'Rozbieżność 1S1 ≠ 1S2 zgłasza błąd. Właśnie z powodu ograniczeń zewnętrznych czujników IFA wycofała Przykład 26 w 2017 r.',
      },
    },
    whyThisCategory: {
      summary:
        'Usunięcie Przykładu 26 w raporcie IFA 2/2017e to kluczowa lekcja inżynierska: technologia bezpieczeństwa ewoluuje. Zamiast budować rozproszone układy Kat. 3 z zewnętrznymi presostatami, współczesne projekty PL e bazują na Przykładzie 25 (Kat. 3, HGL) lub Przykładzie 31 (Kat. 4, bezpośredni monitoring suwaków).',
      vsLower:
        'Historycznie układ spełniał Kat. 3 / PL e dzięki redundancji dwóch zaworów i zewnętrznemu monitorowaniu (DCavg = 90%).',
      vsHigher:
        'Nie osiągał Kat. 4 (DC = 99%), ponieważ pośredni pomiar ciśnienia nie wykrywa wszystkich stanów pośrednich suwaka ani powolnego zakleszczania przed zablokowaniem całkowitym.',
    },
    specialistWarning:
      'Nie projektuj nowych maszyn na podstawie wycofanego Przykładu 26! Zgodnie z IFA Report 2/2017e dla nowych instalacji PL e należy stosować certyfikowane zawory z bezpośrednią kontrolą położenia suwaka (Przykład 31, np. Festo MS6-SV / VOFA) lub redundantne układy z Przykładu 25.',
  },

  {
    id: 'ifa_ex31',
    exampleNumber: 31,
    sectionRef: 'Rozdz. 8.2.31',
    pageRef: 'str. 214–216',
    originalTitle: 'Pneumatic valve control (subsystem) – Category 4 – PL e',
    polishTitle: 'Dwukanałowe zawory z kontrolą suwaka — Kat. 4 / PL e',
    category: '4',
    pl: 'e',
    safetyFunctionCode: 'SDE (Bezpieczne odłączenie energii i odpowietrzenie)',
    tags: ['1V1, 1V2 (2× 3/2)', 'Bezpośrednie czujniki G', 'DC = 99%', 'Limit 2500 lat'],
    parameters: {
      pfhd: '8,1 × 10⁻⁹ / h (PL e — najwyższy poziom niezawodności!)',
      b10d: '1V1 i 1V2: 20 000 000 cykli [M] (dane producenta zaworu bezpieczeństwa)',
      cycleProfile: 'dop = 240 dni/rok · hop = 16 h/dzień · t_cycle = 20 s (nop = 691 200 / rok)',
      mttfd: '289 lat na kanał („Wysokie” — NIE ograniczane do 100 lat, bo limit Kat. 4 to 2500 lat!)',
      t10d: '28,9 lat (> 20 lat — wystarcza na cały 20-letni okres misji bez wymiany)',
      dcAvg: '99% („Wysokie” — bezpośredni nadzór położenia każdego suwaka w 1V1 i 1V2)',
      ccfScore: '65 / 100 pkt (Dokładnie na progu ≥ 65 pkt — brak pkt za dywersyfikację!)',
      ccfBreakdown: [
        'Separacja fizyczna: 15 pkt',
        'Różnorodność / dywersyfikacja: 0 pkt (oba zawory 1V1 i 1V2 są tego samego typu!)',
        'Ochrona przed nadciśnieniem i przeciążeniem: 15 pkt',
        'Czystość powietrza / filtracja / środowisko i EMC: 25 + 10 pkt (razem 65 pkt)',
      ],
    },
    principles: {
      basic: [
        'Bezpieczne odłączenie energii (SDE): wyłączenie choćby jednego sygnału sterującego odcina zasilanie i odpowietrza stronę roboczą siłownika 1A1.',
        'Rygorystyczna filtracja powietrza (25 pkt CCF!) — bez niej identyczne zawory 1V1/1V2 straciłyby próg 65 pkt CCF!',
      ],
      wellTried: [
        'Zintegrowane, fabrycznie skalibrowane indukcyjne czujniki położenia suwaków (symbol G) w obu zaworach 1V1 i 1V2 (jak w Festo VOFA / MS6-SV-E).',
        'Wystarczające przekrycie (positive overlap) uniemożliwiające jednoczesne otwarcie zasilania i wydechu, oraz sprężyny powrotne o podwyższonej trwałości.',
      ],
    },
    explanationSteps: {
      normalOperation:
        'Dwa redundantne zawory 3/2 (1V1 i 1V2) z wbudowanymi czujnikami położenia suwaka pracują szeregowo na zasilaniu i równolegle na wydechu. Podanie sygnałów 24V DC na oba kanały otwiera przepływ do komory roboczej siłownika 1A1, a oba czujniki suwaków zmieniają stan synchronicznie (kontrola w oknie Δt w F-PLC).',
      onSafetyDemand:
        'Zdjęcie sygnałów bezpieczeństwa z 1V1 i 1V2 natychmiast odcina zasilanie i otwiera dwie równoległe drogi szybkiego odpowietrzenia do atmosfery (funkcja SDE / STO). Oba indukcyjne czujniki położenia suwaka potwierdzają powrót mechaniczny do pozycji spoczynkowej.',
      onSingleFault:
        'Jeżeli suwak zaworu 1V1 zatnie się w pozycji wysterowanej, niezależny zawór 1V2 natychmiast odcina zasilanie i przejmuje pełne odpowietrzenie siłownika 1A1. Czujnik położenia suwaka na 1V1 natychmiast zgłasza brak powrotu do F-PLC (DC = 99%), który blokuje ponowne uruchomienie maszyny zanim mogłaby wystąpić druga usterka!',
    },
    states: {
      normal: {
        statusBadge: 'PRACA NORMALNA (1V1 I 1V2 ZAŁĄCZONE — KAT. 4)',
        severity: 'safe',
        summary: 'Oba zawory 1V1 i 1V2 zasilone (24V DC). Bezpośrednie czujniki suwaków potwierdzają zgodność obu kanałów.',
        flowDetail: 'Zasilanie szeregowe: P1 → 1V2 (1→2) → 1V1 (1→2) → lewa komora 1A1 (6 bar). Wydech zamknięty.',
        faultDetection: 'Ciągłe porównanie stanów czujników położenia suwaka w F-PLC (DC = 99%).',
      },
      safety_demand: {
        statusBadge: 'STAN BEZPIECZNY (SDE — BŁYSKAWICZNE ODPOWIETRZENIE)',
        severity: 'safe',
        summary: 'Oba zawory powróciły sprężyną, odcinając zasilanie P1 i odpowietrzając 1A1 równolegle do 0 bar.',
        flowDetail: 'Porty 1 zamknięte (T), porty 2→3 otwarte przez tłumiki. Brak energii resztkowej w siłowniku 1A1.',
        faultDetection: 'Oba czujniki suwaków potwierdziły bezpieczną pozycję spoczynkową (DCavg = 99%).',
      },
      single_fault: {
        statusBadge: 'ZACIĘCIE 1V1 WYKRYTE (DC 99%) — 1V2 ODPOWIETRZA!',
        severity: 'warning',
        summary: 'Suwak 1V1 zablokował się w pozycji otwartej, ale 1V2 odciął P1 i odpowietrzył siłownik. Restart natychmiast zablokowany!',
        flowDetail: '1V2 zamknął dopływ 6 bar (port 1 T) i opróżnił cały tor przez swój port wydechowy 3 (0 bar).',
        faultDetection: 'WYKRYCIE NATYCHMIASTOWE (Kat. 4): Czujnik G na 1V1 nie zmienił stanu → F-PLC blokuje ponowny cykl przed kumulacją błędów!',
      },
    },
    whyThisCategory: {
      summary:
        'Kategoria 4 to najwyższa architektura EN ISO 13849-1: pełna dwukanałowa redundancja + bezpośrednia diagnostyka wysokiego poziomu (DCavg = 99% wykrywa pojedynczą usterkę przed kolejnym żądaniem lub zapobiega niebezpiecznej akumulacji błędów) + podniesiony limit MTTFD aż do 2500 lat (PFHD = 8,1 × 10⁻⁹/h).',
      vsLower:
        'W przeciwieństwie do Kat. 3 / PL e (Przykład 25), tutaj DCavg osiąga 99% (bezpośrednie czujniki na suwakach, a nie pośredni presostat), a limit MTTFD rośnie ze 100 do 2500 lat, co obniża PFHD ponad pięciokrotnie!',
      vsHigher:
        'Jest to najwyższy możliwy poziom w normie EN ISO 13849-1 (Kat. 4 / PL e). Uwaga na CCF = 65 pkt: ponieważ zawory są identyczne (0 pkt za dywersyfikację), każda redukcja filtracji lub separacji powoduje utratę Kat. 4!',
    },
    specialistWarning:
      'Zwróć uwagę na funkcję SDE (odpowietrzenie): na osiach pionowych z obciążeniem grawitacyjnym samo odpowietrzenie w Przykładzie 31 nie zatrzyma spadającego ciężaru — potrzebny jest dodatkowy hamulec mechaniczny. Logika F-PLC musi realizować test spójności czujników Δt i blokadę restartu (walidacja przez specjalistę).',
  },
];
