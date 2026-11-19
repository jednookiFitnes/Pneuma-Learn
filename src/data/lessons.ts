export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface LessonSection {
  heading: string;
  summary: string;
  keyPoints: string[];
  normRef: string;
}

export interface LessonLevel {
  id: number;
  title: string;
  subtitle: string;
  sourceDoc: string;
  xpReward: number;
  specialistVerification: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export const LESSON_LEVELS: LessonLevel[] = [
  {
    id: 1,
    title: 'Poziom 1: Podstawy pneumatyki i czytanie schematów (ISO 1219)',
    subtitle: 'Przygotowanie powietrza FRL, siłowniki, zawory kierunkowe 3/2, 5/2, 5/3 oraz numeracja przyłączy.',
    sourceDoc: 'Festo Safety Guidelines & ISO 1219 / ISO 5599',
    xpReward: 100,
    specialistVerification:
      'Przed zastosowaniem elementów podstawowych (zawory 5/2, 5/3, dławiąco-zwrotne GRLA) w funkcji bezpieczeństwa należy zweryfikować ich klasę czystości powietrza (ISO 8573-1) oraz sprawdzić w dokumentacji producenta, czy element spełnia wymagania „sprawdzonego komponentu” (well-tried) wg EN ISO 13849-2.',
    sections: [
      {
        heading: '1. Przygotowanie sprężonego powietrza (zespół FRL)',
        summary:
          'Niezawodność układów pneumatycznych i funkcji Safety zależy bezpośrednio od jakości medium. Zanieczyszczenia stałe oraz kondensat powodują zacieranie suwaków i pęcznienie uszczelnień.',
        keyPoints: [
          'Filtr (F) usuwa cząstki stałe (typowo 5–40 µm) i wykroploną wodę ze sprężonego powietrza.',
          'Reduktor ciśnienia (R) z odpowietrzeniem wtórnym utrzymuje stałe ciśnienie robocze i chroni przed nadciśnieniem.',
          'Smarownica (L) jest dziś stosowana rzadko: nowoczesne zawory posiadają smarowanie na cały okres eksploatacji — uruchomienie smarownicy wypłukuje smar fabryczny i wymusza jej stałe używanie.',
        ],
        normRef: 'ISO 1219-1 / EN ISO 4414 / Festo Guidelines',
      },
      {
        heading: '2. Siłowniki oraz elementy przepływowe i logiczne',
        summary:
          'Ruch liniowy realizują siłowniki jednostronnego działania (powrót sprężyną) lub dwustronnego działania (zasilane naprzemiennie z obu stron), a w osiach pionowych — z zewnętrzną blokadą lub hamulcem tłoczyska.',
        keyPoints: [
          'Zawory zwrotne przepuszczają powietrze tylko w jednym kierunku; w wersji sterowanej (HGL) otwierają się dopiero po podaniu sygnału pilotowego.',
          'Zawory dławiąco-zwrotne (np. GRLA) regulują prędkość siłownika przez dławienie powietrza wylotowego (wylotowo) — zapewniają płynny ruch bez szarpnięć.',
          'Zawory szybkiego spustu skracają czas odpowietrzania komory bezpośrednio przy siłowniku; elementy logiczne LUB (zawór selektorowy) oraz I (zawór dwuciśnieniowy) budują prostą logikę pneumatyczną.',
        ],
        normRef: 'ISO 1219-1 / Festo Catalog',
      },
      {
        heading: '3. Zawory kierunkowe (3/2, 5/2, 5/3) oraz numeracja portów',
        summary:
          'Oznaczenie zaworu np. 5/2 oznacza 5 dróg (przyłączy) i 2 położenia przełączania. Zrozumienie numeracji portów wg ISO 5599 jest niezbędne do poprawnego czytania schematów.',
        keyPoints: [
          'Port 1: zasilanie sprężonym powietrzem (P). Porty 2 i 4: wyjścia robocze (B i A) do komór siłownika.',
          'Porty 3 i 5: odpowietrzenia do atmosfery (R i S). Porty 12 i 14: sygnały sterujące/pilotowe (14 łączy 1→4, 12 łączy 1→2).',
          'Zawór 5/3 posiada trzecie położenie środkowe: zamknięte (zatrzymuje powietrze w komorach), odpowietrzone (komory 2 i 4 połączone z 3 i 5 — brak siły) lub zasilone w środku (ciśnienie na obu stronach tłoka).',
        ],
        normRef: 'ISO 5599 / ISO 1219-1',
      },
    ],
    quiz: [
      {
        id: 'l1_q1',
        question: 'Co oznacza numer przyłącza 14 w zaworze rozdzielającym 5/2 wg normy ISO 5599 / ISO 1219?',
        options: [
          {
            id: 'a',
            text: 'Główne przyłącze odpowietrzające komory robocze.',
            explanation: 'Błędna odpowiedź — do odpowietrzania służą porty 3 i 5 (dawniej R i S).',
          },
          {
            id: 'b',
            text: 'Sygnał sterujący (pilot), który po aktywacji łączy zasilanie (1) z wyjściem roboczym (4).',
            explanation: 'Poprawna odpowiedź! Zapis 14 dosłownie wskazuje drogę przepływu 1 → 4 po podaniu sygnału pilotowego.',
          },
          {
            id: 'c',
            text: 'Złącze smarownicy olejem mgłowym w zespole FRL.',
            explanation: 'Błędna odpowiedź — smarownica należy do zespołu przygotowania powietrza i nie jest oznaczana numerem pilota 14.',
          },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'l1_q2',
        question: 'Która wersja położenia środkowego zaworu 5/3 pozwala na ręczne przesunięcie tłoczyska siłownika w stanie zatrzymania (brak ciśnienia w komorach)?',
        options: [
          {
            id: 'a',
            text: 'Położenie środkowe zamknięte (all ports blocked).',
            explanation: 'Błędna odpowiedź — w pozycji zamkniętej powietrze pozostaje uwięzione w komorach siłownika i blokuje ruch.',
          },
          {
            id: 'b',
            text: 'Położenie środkowe zasilone (pressurized center).',
            explanation: 'Błędna odpowiedź — obie komory siłownika są pod ciśnieniem zasilania, co stawia duży opór.',
          },
          {
            id: 'c',
            text: 'Położenie środkowe odpowietrzone (exhausted center).',
            explanation: 'Poprawna odpowiedź! Gdy wyjścia 2 i 4 są połączone z odpowietrzeniami 3 i 5, z siłownika schodzi ciśnienie i zanika siła.',
          },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'l1_q3',
        question: 'Jakie ryzyko wiąże się z dławieniem powietrza na zasilaniu (wlotowo) zamiast na wylocie przy siłownikach dwustronnego działania?',
        options: [
          {
            id: 'a',
            text: 'Powstanie zjawiska „stick-slip” (szarpanego ruchu tłoka) z powodu braku poduszki przeciwciśnienia.',
            explanation: 'Poprawna odpowiedź! Dławienie na wylocie utrzymuje stabilną poduszkę powietrzną po stronie przeciwnej do ruchu.',
          },
          {
            id: 'b',
            text: 'Natychmiastowe zablokowanie zaworu zwrotnego sterowanego HGL.',
            explanation: 'Błędna odpowiedź — zawory HGL otwiera ciśnienie pilotowe niezależnie od metody dławienia.',
          },
          {
            id: 'c',
            text: 'Brak możliwości użycia reduktora z odpowietrzeniem wtórnym w FRL.',
            explanation: 'Błędna odpowiedź — reduktor FRL znajduje się na początku instalacji przed zaworami kierunkowymi.',
          },
        ],
        correctOptionId: 'a',
      },
    ],
  },
  {
    id: 2,
    title: 'Poziom 2: Ocena ryzyka i urządzenia ochronne (wg Pilz Compendium)',
    subtitle: 'Metoda 3-stopniowa EN ISO 12100, graf ryzyka PLr, E-Stop, osłony ryglowane, kurtyny ESPE i sterowanie oburęczne.',
    sourceDoc: 'Pilz – The Safety Compendium (rozdz. 3, 4, 7)',
    xpReward: 120,
    specialistVerification:
      'Dobór kurtyn świetlnych (ESPE) oraz wyłączników osłon w połączeniu szeregowym wymaga weryfikacji maskowania błędów (ISO/TR 24119) oraz pomiaru rzeczywistego czasu zatrzymania całej maszyny T = t1 + t2 urządzeniem pomiarowym przed oddaniem do eksploatacji.',
    sections: [
      {
        heading: '1. Trójstopniowa redukcja ryzyka i graf PLr',
        summary:
          'Norma EN ISO 12100 narzuca iteracyjny proces zmniejszania ryzyka w ścisłej kolejności, a EN ISO 13849-1 pozwala wyznaczyć wymagany poziom zapewnienia bezpieczeństwa PLr (od a do e).',
        keyPoints: [
          'Krok 1: Konstrukcja bezpieczna sama w sobie (ograniczenie siły, ciśnienia, brak stref zgniecenia). Krok 2: Techniczne środki ochronne (osłony, kurtyny, E-Stop). Krok 3: Informacje dla użytkownika (instrukcje, piktogramy).',
          'Graf ryzyka ocenia trzy parametry: S (ciężkość urazu: S1 odwracalny, S2 nieodwracalny/śmierć), F (częstotliwość narażenia: F1 rzadko, F2 często/długo) oraz P (możliwość uniknięcia: P1 możliwa, P2 prawie niemożliwa).',
          'Zatrzymanie awaryjne (E-Stop, EN ISO 13850) jest wyłącznie środkiem uzupełniającym — nigdy nie zastępuje osłon ani urządzeń ochronnych.',
        ],
        normRef: 'EN ISO 12100 / EN ISO 13849-1 / EN ISO 13850',
      },
      {
        heading: '2. Osłony ryglowane i maskowanie błędów (EN ISO 14119)',
        summary:
          'Ponad 37% maszyn do obróbki metalu bywa manipulowanych przez operatorów. EN ISO 14119 wymaga minimalizowania zachęty do obchodzenia wyłączników bezpieczeństwa.',
        keyPoints: [
          'Łączenie szeregowe bezpotencjałowych styków kilku wyłączników osłon powoduje tzw. maskowanie błędów (fault masking): otwarcie innych drzwi może ukryć zwarcie pierwszego kanału i zredukować DCavg do poziomu Niskiego lub Brak.',
          'Wyłączniki z wyjściami OSSD i kodowaniem RFID (np. PSENcode) posiadają zintegrowaną diagnostykę i nie ulegają maskowaniu błędów przy łączeniu szeregowym.',
          'Osłony z ryglowaniem utrzymują drzwi zamknięte aż do całkowitego ustania zagrożenia (np. wybiegu wrzeciona lub pełnego odpowietrzenia).',
        ],
        normRef: 'EN ISO 14119 / ISO/TR 24119 / Pilz Compendium',
      },
      {
        heading: '3. Kurtyny świetlne (ESPE) i sterowanie oburęczne (EN 574)',
        summary:
          'Bezdotykowe urządzenia ochronne oraz pulpity oburęczne muszą być zamontowane w ściśle wyliczonej odległości bezpieczeństwa S, aby operator nie zdążył dosięgnąć strefy niebezpiecznej przed zatrzymaniem.',
        keyPoints: [
          'Wzór EN ISO 13855: S = K · (t1 + t2) + C, gdzie K = 2000 mm/s (prędkość zbliżania dłoni) lub 1600 mm/s (prędkość chodu), T = t1 + t2 (czas reakcji kurtyny + czas zatrzymania maszyny).',
          'Dla rozdzielczości d ≤ 40 mm: C = 8 · (d − 14) mm (min. S = 100 mm; przy S > 500 mm można przeliczyć z K = 1600, min. 500 mm). Dla 40 < d ≤ 70 mm: C = 850 mm; pojedyncza wiązka: C = 1200 mm.',
          'Sterowanie oburęczne (EN 574): Typ IIIA (Kat. 1), IIIB (Kat. 3), IIIC (Kat. 4) — wymagają jednoczesnego naciśnięcia obu przycisków w oknie ≤ 0,5 s (500 ms), a w pneumatycznych blokach Festo nawet ≤ 200 ms; dystans montażowy liczy się z K = 1600 mm/s i C = 250 mm.',
        ],
        normRef: 'EN ISO 13855 / EN 574 / Pilz Compendium',
      },
    ],
    quiz: [
      {
        id: 'l2_q1',
        question: 'Dlaczego szeregowe łączenie klasycznych styków bezpotencjałowych kilku wyłączników osłon ogranicza możliwy do osiągnięcia poziom PL?',
        options: [
          {
            id: 'a',
            text: 'Z powodu maskowania błędów (fault masking) — otwarcie sprawnych drzwi może zresetować lub ukryć wykrycie zwarcia w kanale sąsiednich drzwi.',
            explanation: 'Poprawna odpowiedź! Zgodnie z ISO/TR 24119 maskowanie błędów obniża pokrycie diagnostyczne DCavg (czasem aż do „Brak”), uniemożliwiając uzyskanie PL e.',
          },
          {
            id: 'b',
            text: 'Ponieważ wyłączniki mechaniczne mają zawsze mniejsze B10d niż 1000 cykli.',
            explanation: 'Błędna odpowiedź — typowe B10d łączników elektromechanicznych wynosi setki tysięcy lub miliony cykli.',
          },
          {
            id: 'c',
            text: 'Ponieważ norma EN ISO 14119 zakazuje całkowicie stosowania osłon ruchomych.',
            explanation: 'Błędna odpowiedź — norma dopuszcza osłony ruchome, o ile prawidłowo zaprojektowano ich monitorowanie i ochronę przed manipulacją.',
          },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'l2_q2',
        question: 'Ile wynosi minimalna odległość bezpieczeństwa S dla kurtyny o rozdzielczości d = 24 mm i całkowitym czasie zatrzymania T = 0,15 s (150 ms) wg EN ISO 13855?',
        options: [
          {
            id: 'a',
            text: '320 mm',
            explanation: 'Błędna odpowiedź — sprawdź współczynnik C = 8 · (24 − 14) = 80 mm oraz 2000 · 0,15 = 300 mm.',
          },
          {
            id: 'b',
            text: '380 mm',
            explanation: 'Poprawna odpowiedź! S = 2000 mm/s × 0,15 s + 8 × (24 − 14) = 300 + 80 = 380 mm.',
          },
          {
            id: 'c',
            text: '1150 mm',
            explanation: 'Błędna odpowiedź — dodatek C = 850 mm dotyczy kurtyn o rozdzielczości powyżej 40 mm do 70 mm.',
          },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'l2_q3',
        question: 'Która ścieżka na grafie ryzyka EN ISO 13849-1 prowadzi bezpośrednio do wymaganego poziomu PLr = d?',
        options: [
          {
            id: 'a',
            text: 'S1 (lekki uraz) → F2 (często) → P1 (możliwe uniknięcie)',
            explanation: 'Błędna odpowiedź — kombinacja S1 → F2 → P1 daje PLr = b.',
          },
          {
            id: 'b',
            text: 'S2 (ciężki uraz) → F1 (rzadko) → P1 (możliwe uniknięcie)',
            explanation: 'Błędna odpowiedź — kombinacja S2 → F1 → P1 daje PLr = c.',
          },
          {
            id: 'c',
            text: 'S2 (ciężki uraz) → F1 (rzadko) → P2 (prawie niemożliwe uniknięcie)',
            explanation: 'Poprawna odpowiedź! Zarówno S2-F1-P2, jak i S2-F2-P1 wyznaczają PLr = d.',
          },
        ],
        correctOptionId: 'c',
      },
    ],
  },
  {
    id: 3,
    title: 'Poziom 3: Funkcje bezpieczeństwa w pneumatyce (wg Festo Guidelines)',
    subtitle: 'Bezpieczne odpowietrzanie (MS6-SV, VOFA), zatrzymanie osi pionowych (HGL, KP, DNCKE), pułapki powietrzne oraz diagnostyka OSSD.',
    sourceDoc: 'Festo – Safety engineering guidelines (pneumatic & electric)',
    xpReward: 140,
    specialistVerification:
      'W układach osi pionowych oraz przy stosowaniu impulsów testowych OSSD na cewkach zaworów należy zweryfikować maksymalny czas zaniku impulsu u producenta zaworu oraz potwierdzić eksperymentalnie, czy po wyłączeniu nie pozostaje niebezpieczna energia resztkowa.',
    sections: [
      {
        heading: '1. Bezpieczne odpowietrzanie (STO) i ochrona przed uruchomieniem',
        summary:
          'Zgodnie z EN ISO 14118 (dawniej EN 1037) bezpieczne odpowietrzenie usuwa źródło energii z siłowników, zapobiegając nieoczekiwanemu uruchomieniu podczas prac w strefie.',
        keyPoints: [
          'Zawór łagodnego startu i szybkiego odpowietrzania MS6-SV-E (Kat. 4, PL e, przepływ do 9000 l/min) monitoruje położenie własnego suwaka i przy starcie łagodnie podnosi ciśnienie do ok. 50% P1 zanim otworzy pełny przepływ.',
          'Dwukanałowe bloki zaworowe VOFA-L26 (Kat. 4, PL e) wykorzystują nadmiarową parę zaworów z indukcyjnymi czujnikami położenia suwaka do bezpiecznego odcięcia zasilania i szybkiego spustu (np. w prasach).',
          'Uwaga na średnicę i długość przewodów: wąż 9 mm odpowietrza szybciej niż wąż 2,5 mm (~140 ms vs ~300 ms przy 10 m), lecz grubszy krótki wąż zwiększa też prędkość roboczą i drogę hamowania.',
        ],
        normRef: 'EN ISO 14118 / Festo MS6-SV & VOFA Guidelines',
      },
      {
        heading: '2. Bezpieczne zatrzymanie, pułapki powietrzne i osie pionowe',
        summary:
          'Zatrzymanie siłownika przez zablokowanie ciśnienia (zawór 5/3 zamknięty w środku lub sterowany zawór zwrotny HGL) tworzy pułapkę powietrzną — energia potencjalna pozostaje uwięziona w układzie.',
        keyPoints: [
          'Zawory HGL-1/4-B wymagają różnicy ciśnień do przesterowania; w warunkach usterki w komorze może pozostać ciśnienie resztkowe (~0,5 bar) lub przy gwałtownym zatrzymaniu masy pionowej wystąpić skok > 30 bar.',
          'Jednostki zaciskowe KP / KPE służą WYŁĄCZNIE do utrzymywania nieruchomego tłoczyska (holding brake) po zatrzymaniu i nie posiadają tolerancji na pojedynczą usterkę przy hamowaniu dynamicznym.',
          'Jednostki hamujące z certyfikatem IFA (np. DNCKE-S / KEC-S) są przystosowane zarówno do dynamicznego wyhamowania w ruchu awaryjnym, jak i bezpiecznego utrzymania osi pionowych.',
        ],
        normRef: 'Festo Safety Guidelines (SSC / Vertical Axes)',
      },
      {
        heading: '3. Redukcja siły/prędkości (SLS) i diagnostyka (Δt, OSSD, pęcznienie uszczelnień)',
        summary:
          'Ograniczenie prędkości (SLS — np. zawór dławiąco-zwrotny GRLA-...-SA zabezpieczony przed manipulacją) oraz diagnostyka czasowa (plausibility check) gwarantują wykrycie usterek przed kolejnym cyklem.',
        keyPoints: [
          'Kontrola spójności Δt: sterownik F-PLC sprawdza, czy po zmianie sygnału cewki czujnik na zaworze (lub przetwornik ciśnienia/przepływu) zmieni stan w oczekiwanym oknie Δt.',
          'Impulsy testujące OSSD: wyjścia półprzewodnikowe wysyłają krótkie przerwy OFF (już 0,1 ms obniża siłę trzymania kotwicy elektromagnesu) lub impulsy ON (od 0,4 ms mogą poruszyć rdzeń), skracając żywotność lub wywołując migotanie zaworu.',
          'Pęcznienie uszczelnień (seal swelling): miękkie uszczelnienia zaworów nieprzełączanych przez dłuższy czas mogą przywrzeć do gładzi, zwiększając tarcie rozruchowe — stąd wymóg cyklicznych testów przełączania (np. raz na zmianę < 8 h).',
        ],
        normRef: 'Festo Guidelines / IFA Report 2/2017e',
      },
    ],
    quiz: [
      {
        id: 'l3_q1',
        question: 'Jaka jest kluczowa różnica między jednostką zaciskową KP/KPE a jednostką hamującą DNCKE-S na osi pionowej?',
        options: [
          {
            id: 'a',
            text: 'KP/KPE służy wyłącznie do statycznego utrzymania po zatrzymaniu, natomiast DNCKE-S może bezpiecznie wyhamować opadający ładunek w ruchu.',
            explanation: 'Poprawna odpowiedź! Wg Festo Guidelines zacisk KP działa jako hamulec postojowy, a dynamiczne zatrzymanie osi pionowej wymaga jednostki hamującej (np. DNCKE-S).',
          },
          {
            id: 'b',
            text: 'KP/KPE działa elektrycznie na 24V DC, a DNCKE-S jest zawsze ręczna.',
            explanation: 'Błędna odpowiedź — obie jednostki są zwalniane ciśnieniem pneumatycznym i zaciskane sprężyną.',
          },
          {
            id: 'c',
            text: 'DNCKE-S nie potrzebuje sprężonego powietrza do otwarcia szczęk.',
            explanation: 'Błędna odpowiedź — DNCKE-S zamyka się poniżej ok. 3,5 bar i wymaga ciśnienia roboczego do odblokowania.',
          },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'l3_q2',
        question: 'Jakie zjawisko może wystąpić, gdy wyjście OSSD z impulsami testowymi podłączymy bezpośrednio do bardzo szybkiej cewki elektrozaworu?',
        options: [
          {
            id: 'a',
            text: 'Zwiększenie maksymalnego ciśnienia roboczego w sieci powyżej 10 bar.',
            explanation: 'Błędna odpowiedź — impulsy elektryczne nie podnoszą ciśnienia w instalacji.',
          },
          {
            id: 'b',
            text: 'Drgania/brzęczenie kotwicy, spadek siły trzymania (już przy przerwie 0,1 ms) i przedwczesne zużycie lub niezamierzone otwarcie zaworu.',
            explanation: 'Poprawna odpowiedź! Festo wskazuje, że bardzo krótkie impulsy testowe OSSD mogą obniżać siłę trzymania (0,1 ms OFF) lub pobudzać rdzeń (od 0,4 ms ON).',
          },
          {
            id: 'c',
            text: 'Automatyczna zmiana numeracji przyłączy z ISO 5599 na DIN.',
            explanation: 'Błędna odpowiedź — kwestia czysto elektryczno-mechaniczna, bez związku z oznaczeniami portów.',
          },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'l3_q3',
        question: 'Dlaczego w zaworach bezpieczeństwa z miękkimi uszczelnieniami zaleca się okresowe przełączenie (np. częściej niż co 8 godzin)?',
        options: [
          {
            id: 'a',
            text: 'Aby zapobiec efektowi pęcznienia i przywierania uszczelnień (seal swelling), które mogłoby zablokować zawór w stanie awaryjnym.',
            explanation: 'Poprawna odpowiedź! Zjawisko opisane zarówno w IFA Report 2/2017e, jak i wytycznych Festo wymusza cykliczny test przełączania.',
          },
          {
            id: 'b',
            text: 'Aby usunąć nadmiar oleju z filtra bez smarownicy.',
            explanation: 'Błędna odpowiedź — przełączanie zaworu nie opróżnia odstojnika filtra.',
          },
          {
            id: 'c',
            text: 'Aby zwiększyć wartość znamionową B10D komponentu w trakcie eksploatacji.',
            explanation: 'Błędna odpowiedź — wartość B10D jest parametrem trwałościowym z badań producenta i nie rośnie podczas pracy.',
          },
        ],
        correctOptionId: 'a',
      },
    ],
  },
  {
    id: 4,
    title: 'Poziom 4: Kategorie sterowania i niezawodność (wg IFA Report 2/2017e)',
    subtitle: 'Łańcuch I–L–O, Kategorie B–4, wyznaczanie MTTFd z B10d i nop, pokrycie diagnostyczne DCavg oraz ocena CCF.',
    sourceDoc: 'IFA Report 2/2017e – Application of EN ISO 13849',
    xpReward: 160,
    specialistVerification:
      'Ostateczna klasyfikacja poziomu PL wymaga uwzględnienia nie tylko części pneumatycznej (Wyjście — O), ale całego łańcucha Wejście–Logika–Wyjście (I–L–O) w certyfikowanym programie obliczeniowym (np. IFA SISTEMA lub Pilz PAScal) oraz weryfikacji wymogów jakościowych EN ISO 13849-2.',
    sections: [
      {
        heading: '1. Łańcuch bezpieczeństwa I–L–O oraz Kategorie B, 1, 2, 3, 4',
        summary:
          'Każda funkcja bezpieczeństwa obejmuje trzy podsystemy: Wejście (czujnik/kurtyna), Logikę (przekaźnik/F-PLC) i Wyjście (zawór/siłownik). Norma wyróżnia 5 kategorii architektonicznych.',
        keyPoints: [
          'Kategoria B i 1 (jednokanałowe): brak tolerancji na usterkę; Kat. 1 wymaga sprawdzonych komponentów i MTTFd ≥ 30 lat (osiąga maks. PL c).',
          'Kategoria 2 (jednokanałowa z kanałem testującym TE): wymaga testu min. 100× częściej niż żądanie funkcji (lub 25× ze współczynnikiem kary 1,1 albo natychmiastowego testu na żądanie szybszego niż czas dojścia do zagrożenia) oraz MTTFd,TE ≥ 0,5 · MTTFd,func (maks. PL d).',
          'Kategoria 3 (dwukanałowa): pojedynczy błąd nie prowadzi do utraty funkcji bezpieczeństwa, DCavg ≥ Niskie (60%). Kategoria 4: uwzględnia kumulację błędów, wykrywa błędy przed kolejnym żądaniem, wymaga DCavg Wysokiego (≥ 99%) i MTTFd Wysokiego (limit 2500 lat).',
        ],
        normRef: 'EN ISO 13849-1 / IFA Report 2/2017e (Rozdz. 5)',
      },
      {
        heading: '2. Niezawodność B10D, T10D oraz obliczanie MTTFD',
        summary:
          'Dla elementów ulegających zużyciu mechanicznemu (zawory, przekaźniki, wyłączniki krańcowe) niezawodność wyznacza się z liczby cykli B10D (gdzie typowo B10D = 2 · B10, a dla pneumatyki wg dobrej praktyki często 20 mln cykli).',
        keyPoints: [
          'Roczna liczba operacji: nop = (dop · hop · 3600) / t_cycle. Średni czas do niebezpiecznego uszkodzenia: MTTFD = B10D / (0,1 · nop) [lata].',
          'Czas T10D = B10D / nop wyznacza moment, w którym 10% populacji ulegnie uszkodzeniu niebezpiecznemu — jeśli T10D < 20 lat, wymagana jest prewencyjna wymiana komponentu przed upływem T10D.',
          'Wartości MTTFD każdego kanału są ograniczane normowo do 100 lat (Kat. B–3) lub 2500 lat (Kat. 4). Dla dwóch nierównych kanałów stosuje się wzór symetryzacji z Załącznika D.',
        ],
        normRef: 'EN ISO 13849-1 Zał. C i D / IFA Report (Rozdz. 6)',
      },
      {
        heading: '3. Pokrycie diagnostyczne DCavg i błędy wspólnej przyczyny (CCF)',
        summary:
          'Architektury wielokanałowe oraz Kat. 2 są bezwartościowe, jeśli jedna awaria (np. brudne powietrze lub zwarcie wiązki) wyłączy oba tory jednocześnie.',
        keyPoints: [
          'Klasy DCavg: Brak (< 60%), Niskie (60% ≤ DC < 90%), Średnie (90% ≤ DC < 99%), Wysokie (≥ 99%). Średnią ważoną liczy się z udziałem odwrotności MTTFDi bloków funkcjonalnych (bez TE/OTE z Kat. 2).',
          'Lista kontrolna CCF (Załącznik F) obejmuje 8 kryteriów o łącznej wadze 100 punktów (m.in. czystość powietrza/EMC 25 pkt, dywersyfikacja 20 pkt, separacja fizyczna 15 pkt, ochrona przed nadciśnieniem 15 pkt).',
          'Punktacja CCF przyznawana jest zero-jedynkowo (wszystkie punkty albo 0). Do spełnienia wymagań Kategorii 2, 3 i 4 konieczne jest uzyskanie minimum 65 punktów.',
        ],
        normRef: 'EN ISO 13849-1 Zał. E i F / IFA Report 2/2017e',
      },
    ],
    quiz: [
      {
        id: 'l4_q1',
        question: 'Jaki warunek częstotliwości testowania obowiązuje w Kategorii 2 wg EN ISO 13849-1 i IFA Report 2/2017e?',
        options: [
          {
            id: 'a',
            text: 'Wskaźnik testów musi być co najmniej 100 razy większy niż częstość żądań funkcji bezpieczeństwa (lub 25× z korekcją / test natychmiastowy przed zagrożeniem).',
            explanation: 'Poprawna odpowiedź! Norma wymaga relacji częstości testów ≥ 100× żądania (z dopuszczalnym wyjątkiem 25× przy współczynniku 1,1 lub testem natychmiastowym szybszym niż dojście do strefy niebezpiecznej).',
          },
          {
            id: 'b',
            text: 'Test wystarczy przeprowadzać raz na 5 lat podczas przeglądu okresowego.',
            explanation: 'Błędna odpowiedź — tak rzadkie testy nie pozwalają wykryć awarii przed potencjalnym żądaniem funkcji.',
          },
          {
            id: 'c',
            text: 'Kategoria 2 nie potrzebuje w ogóle kanału testującego (TE), jeśli B10D przekracza 1 milion cykli.',
            explanation: 'Błędna odpowiedź — właśnie obecność testowania (TE + OTE) odróżnia Kategorię 2 od Kategorii B i 1.',
          },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'l4_q2',
        question: 'Co oznacza sytuacja, w której obliczony parametr T10D = B10D / nop dla zaworu wynosi 12 lat (czyli poniżej 20 lat)?',
        options: [
          {
            id: 'a',
            text: 'Zawór natychmiast traci certyfikat i nie może być użyty w żadnej kategorii.',
            explanation: 'Błędna odpowiedź — zawór można zastosować, lecz należy zaplanować jego wymianę przed końcem żywotności T10D.',
          },
          {
            id: 'b',
            text: 'Należy zaplanować prewencyjną wymianę zaworu przed upływem 12 lat, aby utrzymać założone MTTFD.',
            explanation: 'Poprawna odpowiedź! Założenie stałego wskaźnika uszkodzeń w modelu EN ISO 13849-1 obowiązuje tylko do czasu T10D; przy T10D < 20 lat konieczna jest wymiana okresowa.',
          },
          {
            id: 'c',
            text: 'Automatycznie przechodzimy z Kategorii 3 do Kategorii 4 bez zmiany DCavg.',
            explanation: 'Błędna odpowiedź — T10D dotyczy czasu użytkowania komponentu zużywalnego, a nie zmiany kategorii.',
          },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'l4_q3',
        question: 'Ile punktów w liście kontrolnej CCF (Załącznik F EN ISO 13849-1) potrzeba minimum, aby zakwalifikować obwód dwukanałowy do Kategorii 3 lub 4?',
        options: [
          {
            id: 'a',
            text: 'Minimum 45 punktów na 100 możliwych.',
            explanation: 'Błędna odpowiedź — 45 punktów to za mało i oznacza niedostateczną odporność na awarie wspólnej przyczyny.',
          },
          {
            id: 'b',
            text: 'Minimum 65 punktów na 100 możliwych (przy ocenie zero-jedynkowej każdego kryterium).',
            explanation: 'Poprawna odpowiedź! Próg 65/100 pkt jest wymagany dla Kategorii 2, 3 oraz 4, a kryteria ocenia się w pełni albo 0 pkt.',
          },
          {
            id: 'c',
            text: 'Dokładnie 100 punktów — nawet brak FMEA całkowicie wyklucza Kategorię 3.',
            explanation: 'Błędna odpowiedź — próg normowy wynosi ≥ 65 punktów, nie 100.',
          },
        ],
        correctOptionId: 'b',
      },
    ],
  },
];
