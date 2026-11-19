import { ShieldAlert } from 'lucide-react';

export function LegalBanner() {
  return (
    <aside
      aria-label="Zastrzeżenie prawne"
      className="border-b border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-[1360px] items-start gap-3 px-4 py-2.5 text-xs leading-relaxed sm:items-center sm:px-6 lg:px-8">
        <ShieldAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 sm:mt-0 dark:text-amber-400"
          aria-hidden="true"
        />
        <p>
          <strong className="font-semibold">Zastrzeżenie prawne:</strong>{' '}
          PneumoSafe Academy &amp; Studio ma charakter wyłącznie edukacyjny i szkoleniowy (oparty na materiałach Festo, Pilz oraz IFA Report 2/2017e).
          Prezentowane schematy i obliczenia nie zastępują formalnej oceny ryzyka (EN ISO 12100), weryfikacji w certyfikowanych narzędziach (IFA SISTEMA, Pilz PAScal) ani odbioru przez uprawnionego specjalistę ds. bezpieczeństwa maszyn.
        </p>
      </div>
    </aside>
  );
}
