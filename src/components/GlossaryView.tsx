import { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { GLOSSARY_TERMS, type GlossaryTerm } from '../data/glossary';

interface GlossaryViewProps {
  onInteractGlossary: () => void;
}

type GlossaryFilter = 'Wszystkie' | GlossaryTerm['category'];

const CATEGORIES: GlossaryFilter[] = [
  'Wszystkie',
  'Pneumatyka',
  'Architektura i Niezawodność',
  'Urządzenia Ochronne',
  'Normy i Funkcje',
];

export function GlossaryView({ onInteractGlossary }: GlossaryViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<GlossaryFilter>('Wszystkie');

  const filteredTerms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((item) => {
      const catMatch = category === 'Wszystkie' || item.category === category;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.term.localeCompare(b.term, 'pl'));
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-50">
            Słownik Safety (Festo · Pilz · IFA Report 2/2017e)
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Zwięzłe definicje kluczowych skrótów, norm i pojęć pneumatycznych z materiałów źródłowych.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
          Liczba haseł: {filteredTerms.length} / {GLOSSARY_TERMS.length}
        </div>
      </div>

      {/* Wyszukiwarka i filtry kategorii */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="glossary-search" className="sr-only">
            Wyszukaj pojęcie w słowniku
          </label>
          <input
            id="glossary-search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onInteractGlossary();
            }}
            placeholder="Wpisz skrót lub termin (np. FRL, OSSD, MTTFd, PLr, CCF, STO...)"
            className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div
          role="group"
          aria-label="Kategorie słownika"
          className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                onInteractGlossary();
              }}
              className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                category === cat
                  ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista definicji */}
      {filteredTerms.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Nie znaleziono hasła pasującego do zapytania „{search}”.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('Wszystkie');
            }}
            className="mt-3 min-h-[40px] rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Pokaż wszystkie hasła
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTerms.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px]">{item.sourceRef}</span>
                </div>

                <div className="mt-2 flex items-baseline gap-2.5">
                  <BookOpen
                    className="h-4 w-4 shrink-0 translate-y-0.5 text-sky-600 dark:text-sky-400"
                    aria-hidden="true"
                  />
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.term}
                  </h2>
                </div>
                <div className="mt-0.5 text-xs font-medium text-sky-700 dark:text-sky-400">
                  {item.fullName}
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {item.definition}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
