import { useMemo, useState } from 'react';
import { Search, ShieldCheck, X } from 'lucide-react';
import {
  CATALOG_ITEMS,
  type CatalogCategory,
  type CatalogItem,
} from '../data/catalog';
import { CatalogSymbolSvg } from './CatalogSymbolSvg';

interface CatalogViewProps {
  onInspectItem: () => void;
}

type FilterOption = 'all' | CatalogCategory;

const FILTERS: { id: FilterOption; label: string }[] = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'pneumatic', label: 'Elementy Pneumatyczne' },
  { id: 'safety_component', label: 'Komponenty Safety Festo/Pilz' },
  { id: 'norm_concept', label: 'Normy i Pojęcia' },
];

export function CatalogView({ onInspectItem }: CatalogViewProps) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG_ITEMS.filter((item) => {
      const matchesCat = filter === 'all' || item.category === filter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.codeOrRef.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.plainPrinciple.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const handleOpenItem = (item: CatalogItem) => {
    setSelectedItem(item);
    onInspectItem();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-50">
            Katalog Elementów, Symboli i Pojęć Safety
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Przeszukiwalna baza wiedzy ({CATALOG_ITEMS.length} kart) z symbolami ISO, zasadą działania i analizą usterek okiem inżyniera Safety.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
          Wyświetlane karty: {filteredItems.length} / {CATALOG_ITEMS.length}
        </div>
      </div>

      {/* Pasek wyszukiwania i filtrów */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="catalog-search" className="sr-only">
            Szukaj w katalogu komponentów i pojęć
          </label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj (np. MS6-SV, HGL, B10D, OSSD...)"
            className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div
          role="group"
          aria-label="Filtry kategorii katalogu"
          className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                filter === f.id
                  ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Siatka kart */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Brak kart pasujących do zapytania „{query}”.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
            className="mt-3 min-h-[40px] rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpenItem(item)}
              className="flex flex-col items-stretch justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-500"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{item.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate font-mono">{item.codeOrRef}</span>
                </div>

                <h2 className="mt-1.5 font-display text-base font-bold leading-snug text-slate-900 dark:text-slate-100">
                  {item.title}
                </h2>

                <div className="mt-3">
                  <CatalogSymbolSvg symbolId={item.symbolId} />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.shortDesc}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-2.5 text-xs font-semibold text-sky-700 dark:border-slate-800 dark:text-sky-400">
                Otwórz kartę techniczną →
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Okno szczegółów karty */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalog-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedItem.categoryLabel} ·{' '}
                  <span className="font-mono">{selectedItem.codeOrRef}</span>
                </div>
                <h2
                  id="catalog-detail-title"
                  className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-slate-100"
                >
                  {selectedItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Zamknij kartę szczegółową"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <CatalogSymbolSvg symbolId={selectedItem.symbolId} />

              <div>
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  Zasada działania (prostym językiem)
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedItem.plainPrinciple}
                </p>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  Kluczowe parametry i cechy
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedItem.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-400"
                      />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/75 p-4 dark:border-amber-900/60 dark:bg-amber-950/35">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-sm font-bold text-amber-950 dark:text-amber-100">
                      Okiem inżyniera Safety
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                      {selectedItem.safetyEngineerEye}
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-amber-800 dark:text-amber-300">
                      Przypomnienie: dobór komponentu do funkcji bezpieczeństwa wymaga weryfikacji i odbioru przez specjalistę ds. bezpieczeństwa maszyn.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="min-h-[40px] rounded-lg bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950"
              >
                Zamknij kartę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
