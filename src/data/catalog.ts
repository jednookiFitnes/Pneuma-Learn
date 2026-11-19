export type CatalogCategory =
  | 'pneumatic'
  | 'safety_component'
  | 'norm_concept';

export type CatalogSymbolId =
  | 'cylinder_double'
  | 'valve_5_2'
  | 'valve_5_3_closed'
  | 'valve_5_3_exhaust'
  | 'throttle_check_grla'
  | 'pilot_check_hgl'
  | 'quick_exhaust'
  | 'frl_unit'
  | 'ms6_sv'
  | 'vofa_dual'
  | 'dncke_kp'
  | 'zsb_two_hand'
  | 'pnoz_relay'
  | 'espe_curtain'
  | 'guard_lock_14119'
  | 'pl_plr_chart'
  | 'b10d_mttfd'
  | 'dc_avg'
  | 'ccf_shield'
  | 'safety_functions'
  | 'fault_exclusion'
  | 'ossd_pulses';

export interface CatalogItem {
  id: string;
  title: string;
  codeOrRef: string;
  category: CatalogCategory;
  categoryLabel: string;
  symbolId: CatalogSymbolId;
  shortDesc: string;
  plainPrinciple: string;
  specs: string[];
  safetyEngineerEye: string;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  // --- ELEMENTY PNEUMATYCZNE (8 kart) ---
  {
    id: 'cat-cyl-double',
    title: 'Siłownik dwustronnego działania',
    codeOrRef: 'ISO 15552 / ISO 1219',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'cylinder_double',
    shortDesc: 'Element wykonawczy realizujący ruch roboczy w obu kierunkach pod wpływem sprężonego powietrza.',
    plainPrinciple:
      'Powietrze podawane naprzemiennie do przedniej lub tylnej komory przesuwa tłok oraz tłoczysko. W przeciwieństwie do siłownika jednostronnego, powrót wymaga ciśnienia zasilania zamiast sprężyny.',
    specs: [
      'Zasilanie robocze: typowo 4–8 bar',
      'Komora tylna (wysuw) ma większą powierzchnię czynną niż strona tłoczyska',
      'Często wyposażany w czujniki położenia tłoka SMT (kontrola krańcowa)',
    ],
    safetyEngineerEye:
      'Sam siłownik nie gwarantuje bezpiecznego utrzymania pozycji po zaniku ciśnienia. Na osiach pionowych grozi opadnięciem ładunku pod wpływem grawitacji — zawsze sprawdź potrzebę mechanicznej jednostki hamującej (DNCKE) oraz zagrożenie energią resztkową.',
  },
  {
    id: 'cat-valve-52',
    title: 'Zawór rozdzielający 5/2 monostabilny',
    codeOrRef: 'ISO 5599 · Porty 1, 2, 3, 4, 5, 14',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'valve_5_2',
    shortDesc: 'Podstawowy zawór sterujący siłownikiem dwustronnego działania z powrotem sprężyną.',
    plainPrinciple:
      'Posiada 5 portów i 2 położenia. Po podaniu sygnału na cewkę (port 14) łączy zasilanie (1) z wyjściem (4), a komorę (2) odpowietrza przez (3). Po zaniku sygnału sprężyna cofa suwak do pozycji bazowej.',
    specs: [
      'Port 1: zasilanie; Porty 2/4: wyjścia; Porty 3/5: odpowietrzenia',
      'Powrót sprężyną mechaniczną lub powietrzną (preferowana mechaniczna)',
      'Typowe B10D dla dobrze dobranych zaworów: ok. 20 000 000 cykli',
    ],
    safetyEngineerEye:
      'Pojedynczy zawór 5/2 bez nadzoru położenia suwaka osiąga co najwyżej Kategorię B lub 1 (PL c przy spełnieniu zasad sprawdzonych komponentów). Uwaga na zjawisko pęcznienia uszczelnień przy rzadkim przełączaniu — zaplanuj test ruchowy min. raz na zmianę.',
  },
  {
    id: 'cat-valve-53',
    title: 'Zawór 5/3 (zamknięty lub odpowietrzony w środku)',
    codeOrRef: 'ISO 1219 · Pozycja neutralna',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'valve_5_3_closed',
    shortDesc: 'Zawór z trzecią pozycją neutralną utrzymywaną sprężynami centrującymi po zdjęciu obu sygnałów.',
    plainPrinciple:
      'Wersja z zamkniętym środkiem odcina wszystkie porty, próbując zatrzymać tłok na poduszce powietrznej. Wersja odpowietrzona w środku łączy oba wyjścia (2 i 4) z odpowietrzeniami (3 i 5), zdejmując siłę z siłownika.',
    specs: [
      'Dwie cewki sterujące (porty 12 oraz 14)',
      'Wersja zamknięta: próba zatrzymania w pół skoku (tworzy pułapkę powietrzną)',
      'Wersja odpowietrzona: bezpieczne rozprężenie obu komór po zatrzymaniu',
    ],
    safetyEngineerEye:
      'Wersja 5/3 zamknięta NIE zapewnia szczelności absolutnej przez długi czas — wewnętrzne przecieki suwaka powodują pełzanie siłownika. Dodatkowo uwięzione powietrze stanowi energię resztkową, która może szarpnąć tłoczyskiem po ponownym załączeniu.',
  },
  {
    id: 'cat-grla',
    title: 'Zawór dławiąco-zwrotny (np. Festo GRLA)',
    codeOrRef: 'Festo GRLA / GRLA-...-SA',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'throttle_check_grla',
    shortDesc: 'Reguluje prędkość wysuwu lub powrotu siłownika przez dławienie powietrza na wylocie.',
    plainPrinciple:
      'W jednym kierunku powietrze swobodnie omija dławik przez klapkę zaworu zwrotnego (pełny dopływ), a w kierunku powrotnym musi przejść przez regulowaną szczelinę dławiącą.',
    specs: [
      'Montaż bezpośrednio w przyłączu siłownika (dławienie wylotowe)',
      'Wersje -SA posiadają śrubę zabezpieczoną przed manipulacją/przestawieniem',
      'Kluczowy element przy realizacji funkcji SLS (Safely-Limited Speed)',
    ],
    safetyEngineerEye:
      'Jeżeli zawór dławiący ma realizować bezpieczne ograniczenie prędkości (SLS), musi posiadać blokadę nastawy lub plombę (np. GRLA-...-SA), aby operator nie mógł go odkręcić wkrętakiem podczas trybu nastawczego.',
  },
  {
    id: 'cat-hgl',
    title: 'Zawór zwrotny sterowany (np. Festo HGL-1/4-B)',
    codeOrRef: 'Festo HGL · Zatrzymanie awaryjne',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'pilot_check_hgl',
    shortDesc: 'Blokuje ujście powietrza z komory siłownika natychmiast po zaniku sygnału sterującego.',
    plainPrinciple:
      'Podczas normalnej pracy ciśnienie pilotowe otwiera grzybek zaworu zwrotnego i pozwala na swobodny ruch. Po odcięciu pilota zawór zamyka się przy samej głowicy siłownika, więżąc powietrze w komorze.',
    specs: [
      'Montaż bezpośrednio na przyłączach siłownika (minimalizacja podatności węża)',
      'Wymaga różnicy ciśnień do otwarcia i odpowietrzenia',
      'Często łączony w parze z zaworem 5/3 zamkniętym lub odpowietrzonym',
    ],
    safetyEngineerEye:
      'W warunkach awarii przy uwalnianiu ciśnienia zawory HGL mogą pozostawić ok. 0,5 bar ciśnienia resztkowego, a przy gwałtownym zatrzymaniu dużych mas pionowych generują skoki ciśnienia przekraczające 30 bar! Zawsze dodaj procedurę bezpiecznego odpowietrzania serwisowego.',
  },
  {
    id: 'cat-quick-exhaust',
    title: 'Zawór szybkiego spustu (Quick Exhaust)',
    codeOrRef: 'Festo SEU / ISO 1219',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'quick_exhaust',
    shortDesc: 'Umożliwia gwałtowne opróżnienie komory siłownika bezpośrednio przy cylindrze z pominięciem długiego węża.',
    plainPrinciple:
      'Gdy ciśnienie z zaworu sterującego zanika, membrana wewnętrzna przełącza się i otwiera szeroki wylot bezpośrednio do atmosfery przez tłumik hałasu.',
    specs: [
      'Zwiększa prędkość powrotu i skraca czas odpowietrzania',
      'Redukuje wpływ oporu długich przewodów (istotne przy wężach > 2 m)',
      'Wymaga zastosowania odpowiedniego tłumika hałasu (ochrona słuchu)',
    ],
    safetyEngineerEye:
      'Przyspieszenie ruchu powrotnego może zwiększyć energię kinetyczną uderzenia w krańcu lub zmienić czas zatrzymania w obliczeniach dla kurtyny świetlnej EN ISO 13855. Zweryfikuj rzeczywisty czas zatrzymania T po montażu.',
  },
  {
    id: 'cat-frl',
    title: 'Zespół przygotowania powietrza (FRL)',
    codeOrRef: 'Festo MS4/MS6 · Filtr-Reduktor-Smarownica',
    category: 'pneumatic',
    categoryLabel: 'Elementy Pneumatyczne',
    symbolId: 'frl_unit',
    shortDesc: 'Przygotowuje sprężone powietrze pod kątem czystości, ciśnienia roboczego oraz odwodnienia.',
    plainPrinciple:
      'Filtr zatrzymuje cząstki stałe i skropliny, reduktor z odpowietrzeniem wtórnym stabilizuje ciśnienie po stronie wtórnej, a opcjonalny manometr pozwala na kontrolę wzrokową.',
    specs: [
      'Klasa czystości powietrza wg ISO 8573-1 (np. [7:4:4] lub wyższa dla zaworów Safety)',
      'Reduktor z blokadą pokrętła chroni przed nieautoryzowanym podniesieniem siły',
      'Zespół FRL wnosi aż 25 punktów w ocenie CCF (odporność na zanieczyszczenia)',
    ],
    safetyEngineerEye:
      'Brak sprawnej filtracji i osuszania to najczęstsza przyczyna awarii wspólnej przyczyny (CCF) zacierającej oba kanały zaworów bezpieczeństwa jednocześnie! Zadbaj o automatyczny spust kondensatu i okresową wymianę wkładów.',
  },

  // --- KOMPONENTY SAFETY FESTO / PILZ (7 kart) ---
  {
    id: 'cat-ms6-sv',
    title: 'Zawór łagodnego startu i szybkiego odpowietrzania (Festo MS6-SV)',
    codeOrRef: 'Festo MS6-SV-E / MS6-SV-C · Kat. 4 / PL e',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'ms6_sv',
    shortDesc: 'Certyfikowany dwukanałowy zawór bezpieczeństwa do bezpiecznego odpowietrzania (STO / SDE).',
    plainPrinciple:
      'Po podaniu sygnału 24V DC na oba kanały zawór powoli podnosi ciśnienie do ok. 50% wartości zasilania (ochrona przed gwałtownym ruchem siłowników), a następnie otwiera pełny przepływ. Przy zatrzymaniu błyskawicznie opróżnia instalację.',
    specs: [
      'Zgodność: Kat. 4 / PL e (wersja -E z wbudowaną kontrolą położenia suwaków)',
      'Wydajność odpowietrzania do 9000 l/min (port 3)',
      'Zakres ciśnienia roboczego: 3,5–10 bar (wersja -C do Kat. 3 / PL d)',
    ],
    safetyEngineerEye:
      'MS6-SV-E nie jest zaworem do częstego przełączania cyklu roboczego maszyny — służy jako nadrzędny zawór strefowy (zatrzymanie awaryjne / otwarcie osłon). Przy bardzo długich lub rozbudowanych instalacjach sprawdź czas całkowitego odpowietrzenia strefy.',
  },
  {
    id: 'cat-vofa',
    title: 'Dwukanałowy zawór bezpieczeństwa dla pras (Festo VOFA)',
    codeOrRef: 'Festo VOFA-L26-T32C / T52C · Kat. 4 / PL e',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'vofa_dual',
    shortDesc: 'Redundantny blok dwóch zaworów z indukcyjnymi czujnikami położenia suwaka dla aplikacji cyklicznych.',
    plainPrinciple:
      'Zawiera dwa zawory połączone szeregowo na zasilaniu i równolegle na odpowietrzeniu. Każdy zawór ma indukcyjny czujnik zbliżeniowy (PNP/NPN), który potwierdza w F-PLC powrót suwaka do pozycji bezpiecznej.',
    specs: [
      'Architektura Kat. 4 / PL e (certyfikacja IFA)',
      'Wbudowana diagnostyka położenia suwaków (DC ≥ 99% przy poprawnym nadzorze w PLC)',
      'Przystosowany do wysokiej częstotliwości cykli (prasy, sprzęgła, hamulce)',
    ],
    safetyEngineerEye:
      'Sama obecność czujników na zaworze VOFA nie tworzy jeszcze PL e! Sterownik bezpieczeństwa musi porównywać stan obu czujników z sygnałami wyjściowymi w oknie czasowym Δt (plausibility check) i blokować start w razie rozbieżności.',
  },
  {
    id: 'cat-dncke-kp',
    title: 'Jednostka hamująca i zaciskowa (Festo DNCKE / KP)',
    codeOrRef: 'Festo DNCKE-S / KEC-S (hamulec) · KP / KPE (zacisk)',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'dncke_kp',
    shortDesc: 'Mechaniczne zabezpieczenie tłoczyska siłownika przed opadnięciem lub przesunięciem.',
    plainPrinciple:
      'Sprężyny zaciskają szczęki na tłoczysku po spadku ciśnienia odblokowującego (< ok. 3,5 bar). Jednostka KP służy tylko do trzymania nieruchomej osi, natomiast DNCKE-S ma certyfikat IFA do dynamicznego wyhamowania masy w ruchu.',
    specs: [
      'DNCKE-S / KEC-S: certyfikowane hamowanie dynamiczne + trzymanie (osie pionowe)',
      'KP / KPE: wyłącznie statyczna funkcja trzymania po zatrzymaniu siłownika',
      'Wymaga czystego, niezaolejonego tłoczyska oraz okresowego testu trzymania',
    ],
    safetyEngineerEye:
      'Błąd krytyczny projektantów: użycie zwykłej wkładki zaciskowej KP zamiast jednostki hamującej DNCKE do zatrzymania spadającej osi pionowej w trakcie ruchu! Prowadzi to do zniszczenia okładzin i opadnięcia narzędzia.',
  },
  {
    id: 'cat-zsb',
    title: 'Blok sterowania oburęcznego (Festo ZSB-1/8 + SV/O)',
    codeOrRef: 'EN 574 Typ IIIB · Festo ZSB-1/8',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'zsb_two_hand',
    shortDesc: 'Czysto pneumatyczny moduł jednoczesności wymuszający użycie obu rąk operatora poza strefą zagrożenia.',
    plainPrinciple:
      'Wewnętrzny układ zaworów i komory opóźniającej przepuszcza sygnał startu tylko wtedy, gdy oba przyciski panelowe (SV/O) zostaną wciśnięte w odstępie czasu krótszym niż 200 ms. Zablokowanie jednego przycisku blokuje układ.',
    specs: [
      'Okno jednoczesności: ≤ 200 ms (Festo) przy limicie normowym EN 574 ≤ 500 ms',
      'Zgodność: Typ IIIB (wymaga ciągłego trzymania obu przycisków do końca fazy groźnej)',
      'Przyciski muszą posiadać kołnierze przeciw przypadkowemu wciśnięciu łokciem',
    ],
    safetyEngineerEye:
      'Zadbaj o prawidłową odległość montażową pulpitu zgodnie z EN ISO 13855 (S = 1600 · T + 250 mm). Pamiętaj, że sterowanie oburęczne chroni wyłącznie jednego operatora, który obsługuje przyciski — nigdy osób postronnych!',
  },
  {
    id: 'cat-pnoz',
    title: 'Przekaźnik bezpieczeństwa (Pilz PNOZ)',
    codeOrRef: 'Pilz PNOZsigma / PNOZ X · Kat. 4 / PL e',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'pnoz_relay',
    shortDesc: 'Przekaźnik logiczny monitorujący wejścia E-Stop, osłon lub kurtyn i sterujący obwodami wykonawczymi.',
    plainPrinciple:
      'Wykorzystuje styki o wymuszonym prowadzeniu (mechanicznie sprzężone NC/NO) oraz nadzór zwrotny pętli EDM, aby wykryć sklejenie styków lub zwarcie między kanałami wejściowymi.',
    specs: [
      'Osiągany poziom: do PL e / Kat. 4 (EN ISO 13849-1) i SIL CL 3',
      'Monitorowanie zwarć międzykanałowych przez napięcie impulsowe lub polaryzację',
      'Pętla sprzężenia zwrotnego (Feedback loop Y1/Y2) dla kontroli zaworów/styczników',
    ],
    safetyEngineerEye:
      'Podłączając zawory bezpieczeństwa (np. VOFA lub MS6-SV-E) do przekaźnika PNOZ, pamiętaj o podpięciu czujników suwaków lub styków pomocniczych w obwód startowy / feedback lub F-PLC — inaczej nie uzyskasz wymaganego DCavg!',
  },
  {
    id: 'cat-espe',
    title: 'Kurtyna świetlna bezpieczeństwa (ESPE)',
    codeOrRef: 'IEC 61496 Typ 2 / Typ 4 · EN ISO 13855',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'espe_curtain',
    shortDesc: 'Elektroczułe wyposażenie ochronne tworzące niewidoczną barierę optyczną wokół strefy niebezpiecznej.',
    plainPrinciple:
      'Nadajnik wysyła wiązki podczerwieni do odbiornika. Przerwanie choćby jednej wiązki przez dłoń lub ciało natychmiast wyłącza oba bezpieczne wyjścia półprzewodnikowe OSSD.',
    specs: [
      'Typ 4: przeznaczony do aplikacji PL e (detekcja pojedynczej usterki)',
      'Rozdzielczość d: 14 mm (palce), 20–30 mm (dłoń), > 40 mm / wielowiązkowe (ciało)',
      'Wyjścia OSSD generują krótkie impulsy testowe w celu samokontroli przewodów',
    ],
    safetyEngineerEye:
      'Najczęstsze błędy: brak zabezpieczenia przed obejściem/wejściem za kurtynę (wymóg ręcznego resetu poza strefą!) oraz zbyt mała odległość S. Pamiętaj, że czas T obejmuje także czas opóźnienia zaworu i wybieg siłownika.',
  },
  {
    id: 'cat-guard-lock',
    title: 'Wyłącznik ryglowany osłony (EN ISO 14119)',
    codeOrRef: 'Pilz PSENslock / PSENmech · RFID / Kodowanie',
    category: 'safety_component',
    categoryLabel: 'Komponenty Safety Festo/Pilz',
    symbolId: 'guard_lock_14119',
    shortDesc: 'Nadzoruje zamknięcie drzwi maszyny oraz blokuje je mechanicznie lub elektromagnetycznie do czasu ustania zagrożenia.',
    plainPrinciple:
      'Stosowany tam, gdzie czas wybiegu maszyny lub odpowietrzenia instalacji jest dłuższy niż czas dojścia operatora do strefy niebezpiecznej po otwarciu osłony.',
    specs: [
      'Kodowanie wysokie (RFID unikalne) skutecznie zniechęca do manipulacji kluczem',
      'Zasada prądu spoczynkowego (rygiel trzyma bez napięcia) dla ochrony personelu',
      'Wyjścia OSSD eliminują problem maskowania błędów przy połączeniu szeregowym',
    ],
    safetyEngineerEye:
      'Nigdy nie łącz klasycznych wyłączników stykowych szeregowo na więcej niż jednych często otwieranych drzwiach (> 1/h), ponieważ zgodnie z ISO/TR 24119 maskowanie błędów niszczy pokrycie diagnostyczne DCavg!',
  },

  // --- POJĘCIA NORMATYWNE (7 kart) ---
  {
    id: 'cat-pl-plr',
    title: 'Performance Level (PL oraz PLr)',
    codeOrRef: 'EN ISO 13849-1 · Skala a–e',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'pl_plr_chart',
    shortDesc: 'Miara zdolności funkcji bezpieczeństwa do wykonywania zadania w przewidywanych warunkach.',
    plainPrinciple:
      'PLr (wymagany) wynika z oceny ryzyka (graf S, F, P). Zaprojektowany układ musi osiągnąć poziom PL ≥ PLr na podstawie kategorii, MTTFD, DCavg i CCF. Poziom „e” oznacza najwyższą niezawodność (PFHD < 10⁻⁷/h).',
    specs: [
      'PL a: PFHD ≥ 10⁻⁵ do < 10⁻⁴ / h',
      'PL c: PFHD ≥ 10⁻⁶ do < 3·10⁻⁶ / h',
      'PL d: PFHD ≥ 10⁻⁷ do < 10⁻⁶ / h; PL e: PFHD ≥ 10⁻⁸ do < 10⁻⁷ / h',
    ],
    safetyEngineerEye:
      'O poziomie PL całego łańcucha bezpieczeństwa decyduje jego najsłabsze ogniwo (np. zawór w Kat. 1 ogranicza cały układ z kurtyną Typ 4 i F-PLC do maksymalnie PL c!).',
  },
  {
    id: 'cat-b10d-mttfd',
    title: 'Parametry B10D, T10D oraz MTTFD',
    codeOrRef: 'IFA Report 2/2017e (Rozdz. 6)',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'b10d_mttfd',
    shortDesc: 'Wskaźniki trwałości i średniego czasu do niebezpiecznego uszkodzenia komponentów zużywalnych.',
    plainPrinciple:
      'B10D to liczba cykli, po której 10% badanych elementów ulega niebezpiecznemu uszkodzeniu. Na jej podstawie oraz rocznej liczby cykli nop obliczamy MTTFD = B10D / (0,1 · nop) w latach.',
    specs: [
      'Pasmo MTTFD: Niskie (3–10 lat), Średnie (10–30 lat), Wysokie (≥ 30 lat)',
      'Limit kanału: maks. 100 lat (Kat. B–3) lub 2500 lat (Kat. 4)',
      'Jeśli T10D = B10D / nop < 20 lat, element wymaga planowej wymiany prewencyjnej',
    ],
    safetyEngineerEye:
      'Uważaj na zawory pracujące w szybkich cyklach (np. t_cycle = 2 s na trzy zmiany)! Nawet zawór o B10D = 20 mln cykli osiąga wtedy T10D ≈ 1,8 roku i bez wpisania wymiany prewencyjnej do DTR nie może gwarantować trwałości.',
  },
  {
    id: 'cat-dcavg',
    title: 'Pokrycie diagnostyczne (DCavg)',
    codeOrRef: 'EN ISO 13849-1 Zał. E · 0% / 60% / 90% / 99%',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'dc_avg',
    shortDesc: 'Procentowy udział niebezpiecznych uszkodzeń wykrywanych automatycznie przez diagnostykę układu.',
    plainPrinciple:
      'Wyraża skuteczność testów automatycznych (np. odczytu czujników położenia suwaka VOFA przez F-PLC). Im wyższe DC, tym mniejsze ryzyko ukrytej (niebezpiecznej) usterki czekającej na drugi błąd.',
    specs: [
      'Brak: < 60% · Niskie: 60–90% · Średnie: 90–99% · Wysokie: ≥ 99%',
      'DCavg to średnia ważona wskaźnikami awaryjności (1 / MTTFDi) bloków funkcyjnych',
      'W Kat. 2 do średniej DCavg nie wlicza się bloków testujących TE i OTE',
    ],
    safetyEngineerEye:
      'Dla zaworu pneumatycznego samo wykrywanie przerwy w cewce (DC ≈ 60%) nie wykrywa mechanicznego zatarcia suwaka! Aby uzyskać DC = 99% (wymagane w Kat. 4), potrzebujesz bezpośredniego czujnika położenia suwaka lub nadzoru procesu.',
  },
  {
    id: 'cat-ccf',
    title: 'Błędy wspólnej przyczyny (CCF)',
    codeOrRef: 'EN ISO 13849-1 Zał. F · Próg ≥ 65/100 pkt',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'ccf_shield',
    shortDesc: 'Pojedyncze zdarzenie lub czynnik środowiskowy wyłączający równocześnie oba kanały redundantne.',
    plainPrinciple:
      'Nawet dwa zawory bezpieczeństwa zawiodą jednocześnie, jeśli dostanie się do nich woda z niesprawnego FRL lub przetnie się wspólny wąż. Lista kontrolna Załącznika F weryfikuje środki zapobiegawcze.',
    specs: [
      '8 kryteriów o łącznej wartości 100 pkt (punktacja zero-jedynkowa)',
      'Największe wagi: Czystość medium/EMC (25 pkt), Różnorodność (20 pkt), Separacja i Nadciśnienie (po 15 pkt)',
      'Wymagane minimum 65 punktów dla Kategorii 2, 3 oraz 4',
    ],
    safetyEngineerEye:
      'Brak spełnienia progu 65 pkt CCF natychmiast dyskwalifikuje Kategorię 2, 3 i 4 niezależnie od tego, jak drogie zawory zastosowano. W pneumatyce kluczowa jest niezależna filtracja i rozdzielenie przewodów.',
  },
  {
    id: 'cat-safety-funcs',
    title: 'Funkcje STO / SS1 / SS2 / SLS / SDI',
    codeOrRef: 'EN 61800-5-2 / Festo Guidelines',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'safety_functions',
    shortDesc: 'Znormalizowane funkcje napędowe i pneumatyczne określające sposób zatrzymania lub ograniczenia ruchu.',
    plainPrinciple:
      'STO (Safe Torque Off) to bezpieczne odłączenie zasilania/powietrza (SDE). SS1 zatrzymuje ruch i odcina energię. SS2 zatrzymuje i nadzoruje postój (SOS). SLS ogranicza prędkość (np. dławieniem), a SDI kierunek ruchu.',
    specs: [
      'STO / SDE: brak energii mogącej wytworzyć siłę (np. MS6-SV)',
      'SS1: wyhamowanie sterowane (lub dławienie) + po czasie bezpieczne odpowietrzenie',
      'SLS: bezpiecznie ograniczona prędkość w trybie nastawczym (np. ≤ 250 mm/s)',
    ],
    safetyEngineerEye:
      'W pneumatyce odpowiednikiem STO jest bezpieczne odpowietrzenie (Safe Exhausting / SDE), ale pamiętaj o grawitacji! STO na osi pionowej bez hamulca mechanicznego spowoduje opadnięcie ładunku.',
  },
  {
    id: 'cat-fault-excl',
    title: 'Wykluczenie błędów (Fault Exclusion)',
    codeOrRef: 'EN ISO 13849-2 Zał. B i D',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'fault_exclusion',
    shortDesc: 'Uzasadnione wyeliminowanie analizy konkretnego rodzaju uszkodzenia jako skrajnie nieprawdopodobnego.',
    plainPrinciple:
      'Zamiast dublować np. mechaniczny trzpień lub przewód stalowy, projektant może wykazać, że element jest przewymiarowany i poprawnie zamontowany zgodnie z rygorystycznymi warunkami EN ISO 13849-2.',
    specs: [
      'Wymaga udokumentowania w ocenie ryzyka (FMEA + dane producenta)',
      'Często stosowane dla pęknięcia sprężyny powrotnej (prowadzona, poniżej progu naprężeń)',
      'Niedopuszczalne dla typowych usterek ruchomych zaworów przy PL e bez nadzoru',
    ],
    safetyEngineerEye:
      'W normie EN ISO 13849-1 wykluczenie błędów stosuje się oszczędnie. Przykładowo w Kat. 4 nie można po prostu „wykluczyć” zacięcia zwykłego zaworu 5/2 — konieczna jest redundancja i kontrola suwaka.',
  },
  {
    id: 'cat-ossd-pulses',
    title: 'Impulsy testujące OSSD (Test Pulses)',
    codeOrRef: 'Festo Guidelines / IEC 61496',
    category: 'norm_concept',
    categoryLabel: 'Normy i Pojęcia',
    symbolId: 'ossd_pulses',
    shortDesc: 'Krótkie impulsy diagnostyczne wysyłane przez wyjścia bezpieczeństwa w celu wykrycia zwarć linii.',
    plainPrinciple:
      'Sterowniki F-PLC i kurtyny na ułamek milisekundy (0,1–4 ms) wyłączają lub załączają wyjścia 24V DC, sprawdzając czy napięcie na przewodzie rzeczywiście spada/rośnie (wykrycie zwarcia do +24V lub sąsiedniego kanału).',
    specs: [
      'Ciemny impuls (OFF) ≥ 0,1 ms może zmniejszyć siłę trzymania kotwicy elektromagnesu',
      'Jasny impuls (ON) ≥ 0,4 ms może wywołać drgnięcie rdzenia szybkiego zaworu',
      'Środki zaradcze: długość kabla, filtry RC/diody, wyłączenie impulsów lub przekaźniki pośredniczące',
    ],
    safetyEngineerEye:
      'Nigdy nie zakładaj z góry, że każdy elektrozawór 24V DC toleruje impulsy testowe Twojego F-PLC! Zawsze porównaj maksymalną szerokość impulsu ze specyfikacji sterownika z tolerancją podaną przez producenta zaworu.',
  },
];
