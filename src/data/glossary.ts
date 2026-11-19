export interface GlossaryTerm {
  id: string;
  term: string;
  fullName: string;
  category: 'Pneumatyka' | 'Architektura i Niezawodność' | 'Urządzenia Ochronne' | 'Normy i Funkcje';
  definition: string;
  sourceRef: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'g-frl',
    term: 'FRL',
    fullName: 'Filter · Regulator · Lubricator (Zespół przygotowania powietrza)',
    category: 'Pneumatyka',
    definition:
      'Zestaw składający się z filtra usuwającego zanieczyszczenia i wodę, reduktora ciśnienia z odpowietrzeniem wtórnym oraz opcjonalnej smarownicy. Zapewnia klasę czystości powietrza wymaganą przez zawory Safety i buduje odporność na CCF.',
    sourceRef: 'Festo Guidelines / ISO 8573-1',
  },
  {
    id: 'g-ossd',
    term: 'OSSD',
    fullName: 'Output Signal Switching Device',
    category: 'Urządzenia Ochronne',
    definition:
      'Bezpieczne, nadmiarowe wyjścia półprzewodnikowe (np. w kurtynach ESPE lub wyłącznikach RFID) wysyłające krótkie impulsy testowe w celu wykrycia zwarć do +24V, masy lub między kanałami.',
    sourceRef: 'Pilz Compendium / Festo Guidelines',
  },
  {
    id: 'g-mttfd',
    term: 'MTTFD',
    fullName: 'Mean Time To Dangerous Failure',
    category: 'Architektura i Niezawodność',
    definition:
      'Średni oczekiwany czas pracy do wystąpienia niebezpiecznego uszkodzenia kanału (w latach). Dla komponentów zużywalnych obliczany ze wzoru B10D / (0,1 · nop), z normowym limitem 100 lat (Kat. B–3) lub 2500 lat (Kat. 4).',
    sourceRef: 'IFA Report 2/2017e / EN ISO 13849-1',
  },
  {
    id: 'g-b10d',
    term: 'B10D',
    fullName: 'Liczba cykli do 10% uszkodzeń niebezpiecznych',
    category: 'Architektura i Niezawodność',
    definition:
      'Parametr trwałości komponentów elektromechanicznych i pneumatycznych określający liczbę operacji, po której 10% badanej populacji ulegnie uszkodzeniu mogącemu zagrozić bezpieczeństwu (typowo B10D = 2 · B10).',
    sourceRef: 'IFA Report 2/2017e (Rozdz. 6)',
  },
  {
    id: 'g-t10d',
    term: 'T10D',
    fullName: 'Średni czas do 10% uszkodzeń niebezpiecznych',
    category: 'Architektura i Niezawodność',
    definition:
      'Okres eksploatacji w latach (T10D = B10D / nop), po którym należy wymienić komponent zużywalny, aby nie wyjść poza obszar stałej intensywności uszkodzeń. Jeśli T10D < 20 lat, wymagana jest wymiana prewencyjna.',
    sourceRef: 'IFA Report 2/2017e / EN ISO 13849-1',
  },
  {
    id: 'g-plr',
    term: 'PLr',
    fullName: 'Required Performance Level (Wymagany poziom PL)',
    category: 'Normy i Funkcje',
    definition:
      'Docelowy poziom niezawodności funkcji bezpieczeństwa (od „a” do „e”) wyznaczany na podstawie oceny ryzyka (ciężkość urazu S, częstość narażenia F, możliwość uniknięcia P). Układ musi osiągnąć PL ≥ PLr.',
    sourceRef: 'Pilz Compendium / EN ISO 13849-1',
  },
  {
    id: 'g-pl',
    term: 'PL',
    fullName: 'Performance Level (Poziom zapewnienia bezpieczeństwa)',
    category: 'Normy i Funkcje',
    definition:
      'Dyskretny poziom (a, b, c, d, e) określający zdolność części systemu sterowania związanych z bezpieczeństwem do wykonania funkcji bezpieczeństwa w przewidywalnych warunkach (odpowiada przedziałom PFHD).',
    sourceRef: 'EN ISO 13849-1 / IFA Report',
  },
  {
    id: 'g-dcavg',
    term: 'DCavg',
    fullName: 'Average Diagnostic Coverage (Średnie pokrycie diagnostyczne)',
    category: 'Architektura i Niezawodność',
    definition:
      'Miara skuteczności automatycznej diagnostyki wykrywającej niebezpieczne błędy w łańcuchu bezpieczeństwa: Brak (< 60%), Niskie (60–90%), Średnie (90–99%), Wysokie (≥ 99%).',
    sourceRef: 'IFA Report 2/2017e / EN ISO 13849-1 Zał. E',
  },
  {
    id: 'g-ccf',
    term: 'CCF',
    fullName: 'Common Cause Failure (Błędy wspólnej przyczyny)',
    category: 'Architektura i Niezawodność',
    definition:
      'Usterki różnych elementów wynikające z jednego zdarzenia (np. zanieczyszczone powietrze, skok ciśnienia, zakłócenia EMC), powodujące jednoczesną utratę obu kanałów. Kat. 2, 3 i 4 wymagają ≥ 65/100 pkt wg Zał. F.',
    sourceRef: 'IFA Report 2/2017e / EN ISO 13849-1 Zał. F',
  },
  {
    id: 'g-sto',
    term: 'STO / SDE',
    fullName: 'Safe Torque Off / Safe Exhausting (Bezpieczne odłączenie energii)',
    category: 'Normy i Funkcje',
    definition:
      'Funkcja bezpieczeństwa polegająca na odcięciu zasilania energetycznego siłownika i szybkim odpowietrzeniu przewodów roboczych (np. przez zawór MS6-SV), uniemożliwiając wygenerowanie siły lub momentu.',
    sourceRef: 'Festo Guidelines / EN ISO 14118',
  },
  {
    id: 'g-ss1-ss2',
    term: 'SS1 / SS2',
    fullName: 'Safe Stop 1 / Safe Stop 2',
    category: 'Normy i Funkcje',
    definition:
      'SS1 realizuje kontrolowane wyhamowanie ruchu, po którym następuje odcięcie energii (STO). SS2 zatrzymuje maszynę i utrzymuje ją w aktywnie nadzorowanym postoju (SOS) bez odłączania zasilania.',
    sourceRef: 'Pilz Compendium / EN 61800-5-2',
  },
  {
    id: 'g-sls',
    term: 'SLS',
    fullName: 'Safely-Limited Speed (Bezpiecznie ograniczona prędkość)',
    category: 'Normy i Funkcje',
    definition:
      'Funkcja zapobiegająca przekroczeniu bezpiecznej prędkości granicznej (np. w trybie nastawczym lub czyszczenia). W pneumatyce wspomagana zaworami dławiącymi zabezpieczonymi przed manipulacją (GRLA-...-SA) i kontrolą czasu/czujników.',
    sourceRef: 'Festo Guidelines',
  },
  {
    id: 'g-sdi',
    term: 'SDI',
    fullName: 'Safe Direction (Bezpieczny kierunek ruchu)',
    category: 'Normy i Funkcje',
    definition:
      'Funkcja nadzorująca, aby element wykonawczy mógł poruszać się wyłącznie w zezwolonym, bezpiecznym kierunku (np. otwieranie osłony lub odjazd od strefy zgniotu).',
    sourceRef: 'Pilz Compendium / Festo Guidelines',
  },
  {
    id: 'g-espe',
    term: 'ESPE',
    fullName: 'Electro-Sensitive Protective Equipment (Kurtyny świetlne)',
    category: 'Urządzenia Ochronne',
    definition:
      'Urządzenia optoelektroniczne (kurtyny, bariery, skanery laserowe), które po naruszeniu strefy detekcji wysyłają sygnał zatrzymania. Odległość montażu S = K · (t1 + t2) + C wyznacza norma EN ISO 13855.',
    sourceRef: 'Pilz Compendium / EN ISO 13855',
  },
  {
    id: 'g-hgl',
    term: 'HGL',
    fullName: 'Sterowany zawór zwrotny (Festo HGL)',
    category: 'Pneumatyka',
    definition:
      'Zawór zamykający ujście powietrza bezpośrednio przy porcie siłownika w razie braku sygnału pilotowego. Tworzy pułapkę powietrzną — na osiach pionowych wymaga łączenia z hamulcem mechanicznym.',
    sourceRef: 'Festo Guidelines',
  },
  {
    id: 'g-ms6sv',
    term: 'MS6-SV',
    fullName: 'Zawór łagodnego startu i szybkiego odpowietrzania',
    category: 'Pneumatyka',
    definition:
      'Certyfikowany zawór bezpieczeństwa Festo (wersja -E do Kat. 4 / PL e) realizujący bezpieczne odpowietrzanie (do 9000 l/min), monitorowanie suwaka i ochronę przed gwałtownym uderzeniem ciśnienia przy starcie.',
    sourceRef: 'Festo Guidelines',
  },
  {
    id: 'g-vofa',
    term: 'VOFA',
    fullName: 'Redundantny blok zaworowy z czujnikami suwaka',
    category: 'Pneumatyka',
    definition:
      'Podwójny zawór bezpieczeństwa (3/2 lub 5/2) z indukcyjnymi czujnikami położenia przeznaczony do układów o wysokiej częstotliwości przełączeń (np. prasy), osiągający Kat. 4 / PL e.',
    sourceRef: 'Festo Guidelines / IFA Report Rozdz. 8',
  },
  {
    id: 'g-dncke-kp',
    term: 'DNCKE / KP',
    fullName: 'Jednostka hamująca (DNCKE) i zaciskowa (KP/KPE)',
    category: 'Pneumatyka',
    definition:
      'Zacisk KP utrzymuje wyłącznie nieruchome tłoczysko (hamulec postojowy). Jednostka DNCKE-S z certyfikatem IFA jest przeznaczona do dynamicznego wyhamowania oraz bezpiecznego utrzymania osi pionowych.',
    sourceRef: 'Festo Guidelines',
  },
  {
    id: 'g-zsb',
    term: 'ZSB-1/8',
    fullName: 'Pneumatyczny blok sterowania oburęcznego',
    category: 'Urządzenia Ochronne',
    definition:
      'Element logiczno-czasowy wymuszający jednoczesne wciśnięcie obu przycisków ręcznych (okno ≤ 200 ms wg Festo, norma EN 574 ≤ 500 ms), uniemożliwiający obejście poprzez zablokowanie jednego przycisku.',
    sourceRef: 'Festo Guidelines / EN 574 Typ IIIB',
  },
  {
    id: 'g-air-trap',
    term: 'Pułapka powietrzna',
    fullName: 'Trapped Compressed Air (Energia resztkowa)',
    category: 'Pneumatyka',
    definition:
      'Sprężone powietrze uwięzione między zaworem odcinającym (np. 5/3 zamkniętym lub HGL) a tłokiem. Może wywołać nieoczekiwany ruch podczas serwisu lub skok ciśnienia po restarcie.',
    sourceRef: 'Festo Guidelines / EN ISO 14118',
  },
  {
    id: 'g-fault-masking',
    term: 'Maskowanie błędów',
    fullName: 'Fault Masking (ISO/TR 24119)',
    category: 'Architektura i Niezawodność',
    definition:
      'Ukrycie usterki kanału w jednym wyłączniku bezpotencjałowym przez otwarcie i zamknięcie innych drzwi połączonych w tym samym szeregu — drastycznie obniża DCavg i uniemożliwia uzyskanie PL e.',
    sourceRef: 'Pilz Compendium / ISO/TR 24119',
  },
  {
    id: 'g-fault-exclusion',
    term: 'Wykluczenie błędu',
    fullName: 'Fault Exclusion (EN ISO 13849-2)',
    category: 'Normy i Funkcje',
    definition:
      'Formalne uzasadnienie, że określony typ uszkodzenia (np. pęknięcie specjalnie dobranej sprężyny lub sztywnego trzpienia) nie wystąpi w przewidywanych warunkach eksploatacji.',
    sourceRef: 'EN ISO 13849-2 / IFA Report 2/2017e',
  },
  {
    id: 'g-plausibility',
    term: 'Kontrola spójności Δt',
    fullName: 'Plausibility Check (Test dynamiczny zaworu)',
    category: 'Architektura i Niezawodność',
    definition:
      'Algorytm diagnostyczny w sterowniku bezpieczeństwa porównujący stan cewki wyjściowej ze stanem czujnika położenia suwaka lub ciśnienia w oknie czasowym Δt po przełączeniu.',
    sourceRef: 'Festo Guidelines / IFA Report',
  },
  {
    id: 'g-seal-swelling',
    term: 'Pęcznienie uszczelnień',
    fullName: 'Seal Swelling / Stiction',
    category: 'Pneumatyka',
    definition:
      'Zjawisko osiadania i przywierania miękkich uszczelnień w zaworach nieprzełączanych przez dłuższy czas, zwiększające ryzyko zacięcia suwaka. Wymaga okresowych testów przełączania (np. < 8 h).',
    sourceRef: 'IFA Report 2/2017e / Festo Guidelines',
  },
  {
    id: 'g-ilo',
    term: 'Łańcuch I–L–O',
    fullName: 'Input – Logic – Output (Wejście–Logika–Wyjście)',
    category: 'Architektura i Niezawodność',
    definition:
      'Trzyelementowy podział każdej funkcji bezpieczeństwa: czujnik/kurtyna (I), przekaźnik/F-PLC (L) oraz zawór/stycznik (O). Całkowite PL określa najsłabsze ogniwo lub kombinacja wg normy.',
    sourceRef: 'IFA Report 2/2017e (Rozdz. 5)',
  },
  {
    id: 'g-iso12100',
    term: 'EN ISO 12100',
    fullName: 'Bezpieczeństwo maszyn — Ogólne zasady projektowania i ocena ryzyka',
    category: 'Normy i Funkcje',
    definition:
      'Podstawowa norma typu A definiująca iteracyjną ocenę ryzyka i obowiązkową 3-stopniową metodę jego redukcji: konstrukcja bezpieczna -> środki techniczne -> informacje dla użytkownika.',
    sourceRef: 'Pilz Compendium (Rozdz. 3)',
  },
  {
    id: 'g-iso14119',
    term: 'EN ISO 14119',
    fullName: 'Urządzenia blokujące sprzężone z osłonami',
    category: 'Normy i Funkcje',
    definition:
      'Norma regulująca dobór i montaż wyłączników osłon (typy 1–4, kodowanie niskie/średnie/wysokie) ze szczególnym naciskiem na zapobieganie manipulacjom i obejściom przez operatorów.',
    sourceRef: 'Pilz Compendium (Rozdz. 4)',
  },
  {
    id: 'g-iso13855',
    term: 'EN ISO 13855',
    fullName: 'Umiejscowienie wyposażenia ochronnego ze względu na prędkości zbliżania',
    category: 'Normy i Funkcje',
    definition:
      'Określa wzór S = K · (t1 + t2) + C do wyliczania bezpiecznej odległości montażu kurtyn świetlnych, skanerów, mat bezpieczeństwa oraz urządzeń oburęcznych od strefy zagrożenia.',
    sourceRef: 'Pilz Compendium (Rozdz. 7)',
  },
];
