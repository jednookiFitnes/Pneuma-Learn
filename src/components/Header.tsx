import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

export type AppTab = 'learn' | 'simulator' | 'verifier' | 'catalog' | 'ifa' | 'glossary';

interface HeaderProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'learn', label: '1. Ścieżka Nauki' },
  { id: 'simulator', label: '2. Symulator Układów' },
  { id: 'verifier', label: '3. Weryfikator PL' },
  { id: 'catalog', label: '4. Katalog' },
  { id: 'ifa', label: '5. Przykłady IFA (Pneumatyka)' },
  { id: 'glossary', label: 'Słownik Safety' },
];

export function Header({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: AppTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 xl:gap-6">
        {/* Strefa 1: Jednoliniowa nazwa aplikacji */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('learn');
          }}
          className="font-display text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 sm:text-base dark:text-slate-50"
        >
          PneumoSafe Academy &amp; Studio
        </a>

        {/* Strefa 2: Nawigacja główna (jedna linia na ekranach xl+) */}
        <nav
          aria-label="Nawigacja główna"
          className="hidden items-center gap-4 xl:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md px-1 ${
                  isActive
                    ? 'text-sky-700 dark:text-sky-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-1 -bottom-3 h-0.5 bg-sky-600 dark:bg-sky-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Strefa 3: Przełącznik motywu (+ przycisk menu na mniejszych ekranach) */}
        <div className="flex items-center gap-2 shrink-0 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Przełącz na tryb jasny'
                : 'Przełącz na tryb ciemny'
            }
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:px-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span className="hidden sm:inline">Tryb jasny</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-sky-700" aria-hidden="true" />
                <span className="hidden sm:inline">Tryb ciemny</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu nawigacji'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 xl:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobilna szuflada nawigacyjna */}
      {mobileMenuOpen && (
        <nav
          aria-label="Nawigacja mobilna"
          className="border-t border-slate-200 bg-white px-4 py-3 xl:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-[44px] w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
