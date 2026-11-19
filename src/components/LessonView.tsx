import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  HelpCircle,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { LESSON_LEVELS } from '../data/lessons';
import { Level1PneumaticsSvg } from './diagrams/Level1PneumaticsSvg';
import { Level2RiskEspeSvg } from './diagrams/Level2RiskEspeSvg';
import { Level3FestoSafetySvg } from './diagrams/Level3FestoSafetySvg';
import { Level4IfaArchitectureSvg } from './diagrams/Level4IfaArchitectureSvg';
import type { ErrorReport } from '../utils/storage';

interface LessonViewProps {
  completedLessons: number[];
  quizBestScores: Record<number, number>;
  errorReports: ErrorReport[];
  onCompleteQuiz: (lessonId: number, score: number, total: number, xpReward: number) => void;
  onSubmitErrorReport: (lessonId: number, lessonTitle: string, description: string) => void;
}

export function LessonView({
  completedLessons,
  quizBestScores,
  errorReports,
  onCompleteQuiz,
  onSubmitErrorReport,
}: LessonViewProps) {
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [answersByLesson, setAnswersByLesson] = useState<Record<string, string>>({});
  const [submittedLessons, setSubmittedLessons] = useState<Record<number, boolean>>({});
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const currentLesson =
    LESSON_LEVELS.find((l) => l.id === activeLevelId) ?? LESSON_LEVELS[0];

  const isQuizSubmitted = Boolean(submittedLessons[currentLesson.id]);
  const allQuestionsAnswered = currentLesson.quiz.every(
    (q) => Boolean(answersByLesson[q.id])
  );

  const currentScore = currentLesson.quiz.reduce((acc, q) => {
    return answersByLesson[q.id] === q.correctOptionId ? acc + 1 : acc;
  }, 0);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswersByLesson((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleFinishQuiz = () => {
    if (!allQuestionsAnswered) return;
    setSubmittedLessons((prev) => ({ ...prev, [currentLesson.id]: true }));
    onCompleteQuiz(
      currentLesson.id,
      currentScore,
      currentLesson.quiz.length,
      currentLesson.xpReward
    );
  };

  const handleResetQuiz = () => {
    setSubmittedLessons((prev) => ({ ...prev, [currentLesson.id]: false }));
    setAnswersByLesson((prev) => {
      const next = { ...prev };
      for (const q of currentLesson.quiz) {
        delete next[q.id];
      }
      return next;
    });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reportText.trim();
    if (trimmed.length < 8) {
      setReportError('Opisz zauważony błąd merytoryczny lub niejasność (min. 8 znaków).');
      return;
    }
    onSubmitErrorReport(currentLesson.id, currentLesson.title, trimmed);
    setReportText('');
    setReportError('');
    setReportSuccess(true);
  };

  const lessonReports = errorReports.filter((r) => r.lessonId === currentLesson.id);

  return (
    <div className="space-y-6">
      {/* Pasek wyboru poziomów */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-50">
            Ścieżka Nauki: Pneumatyka i Bezpieczeństwo Maszyn
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Cztery poziomy wiedzy technicznej opartej na wytycznych Festo, kompendium Pilz oraz raporcie IFA 2/2017e.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setReportSuccess(false);
            setReportError('');
            setReportModalOpen(true);
          }}
          className="inline-flex min-h-[40px] items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:self-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Flag className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>Zgłoś błąd ({lessonReports.length})</span>
        </button>
      </div>

      {/* Zakładki poziomów 1-4 */}
      <div
        role="tablist"
        aria-label="Poziomy ścieżki nauki"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {LESSON_LEVELS.map((level) => {
          const isActive = level.id === activeLevelId;
          const isCompleted = completedLessons.includes(level.id);
          const best = quizBestScores[level.id];
          return (
            <button
              key={level.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveLevelId(level.id)}
              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isActive
                  ? 'border-sky-500 bg-sky-50/70 dark:border-sky-500 dark:bg-sky-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2 text-xs">
                <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                  Poziom {level.id}
                </span>
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Ukończono</span>
                  </span>
                ) : (
                  <span className="font-mono text-slate-500 tabular-nums dark:text-slate-400">
                    +{level.xpReward} XP
                  </span>
                )}
              </div>
              <div className="mt-1.5 font-display text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                {level.title.replace(/^Poziom \d:\s*/, '')}
              </div>
              {typeof best === 'number' && (
                <div className="mt-1.5 text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                  Najlepszy wynik: {best} / {level.quiz.length}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Nagłówek aktywnej lekcji */}
      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Źródło merytoryczne: {currentLesson.sourceDoc}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Nagroda: +{currentLesson.xpReward} XP</span>
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">
            {currentLesson.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {currentLesson.subtitle}
          </p>
        </header>

        {/* Interaktywny diagram SVG dla danego poziomu */}
        <section aria-label="Interaktywny schemat lekcji">
          {currentLesson.id === 1 && <Level1PneumaticsSvg />}
          {currentLesson.id === 2 && <Level2RiskEspeSvg />}
          {currentLesson.id === 3 && <Level3FestoSafetySvg />}
          {currentLesson.id === 4 && <Level4IfaArchitectureSvg />}
        </section>

        {/* Sekcje wiedzy */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {currentLesson.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50"
            >
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                  {section.heading}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {section.summary}
                </p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-400"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-2.5 font-mono text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Norma / źródło: {section.normRef}
              </div>
            </section>
          ))}
        </div>

        {/* Ramka Weryfikacja przez specjalistę */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-display text-sm font-bold text-amber-950 dark:text-amber-100">
                Weryfikacja przez specjalistę
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                {currentLesson.specialistVerification}
              </p>
            </div>
          </div>
        </div>

        {/* Quiz sprawdzający (3 pytania) */}
        <section
          aria-label="Quiz sprawdzający wiedzę"
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/60"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                Quiz sprawdzający — Poziom {currentLesson.id} (3 pytania)
              </h3>
            </div>
            {isQuizSubmitted && (
              <div className="font-mono text-sm font-bold text-sky-700 tabular-nums dark:text-sky-400">
                Wynik: {currentScore} / {currentLesson.quiz.length}
              </div>
            )}
          </div>

          <div className="space-y-5">
            {currentLesson.quiz.map((q, qIndex) => {
              const selectedId = answersByLesson[q.id];
              return (
                <fieldset
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <legend className="px-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {qIndex + 1}. {q.question}
                  </legend>

                  <div className="mt-3 space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedId === opt.id;
                      const isCorrect = opt.id === q.correctOptionId;
                      let optionClass =
                        'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70';

                      if (isSelected) {
                        optionClass = isCorrect
                          ? 'border-emerald-400 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-950/40'
                          : 'border-rose-400 bg-rose-50/70 dark:border-rose-700 dark:bg-rose-950/40';
                      }

                      return (
                        <div key={opt.id}>
                          <label
                            className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs transition-colors ${optionClass}`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => handleSelectOption(q.id, opt.id)}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-sky-600"
                            />
                            <span className="flex-1 leading-relaxed text-slate-800 dark:text-slate-200">
                              {opt.text}
                            </span>
                            {isSelected && (
                              <span className="shrink-0">
                                {isCorrect ? (
                                  <CheckCircle2
                                    className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                                    aria-label="Poprawna odpowiedź"
                                  />
                                ) : (
                                  <XCircle
                                    className="h-4 w-4 text-rose-600 dark:text-rose-400"
                                    aria-label="Błędna odpowiedź"
                                  />
                                )}
                              </span>
                            )}
                          </label>

                          {/* Natychmiastowe wyjaśnienie po wyborze */}
                          {isSelected && (
                            <div
                              className={`mt-1.5 rounded-md px-3 py-2 text-xs leading-relaxed ${
                                isCorrect
                                  ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
                                  : 'bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200'
                              }`}
                            >
                              {opt.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {allQuestionsAnswered
                ? 'Wszystkie pytania zaznaczone — zapisz wynik, aby odebrać punkty XP.'
                : 'Zaznacz odpowiedzi na wszystkie 3 pytania, aby ukończyć lekcję.'}
            </div>
            <div className="flex items-center gap-2">
              {isQuizSubmitted && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Powtórz quiz
                </button>
              )}
              <button
                type="button"
                disabled={!allQuestionsAnswered}
                onClick={handleFinishQuiz}
                className="min-h-[40px] rounded-lg bg-sky-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950"
              >
                {isQuizSubmitted ? 'Zaktualizuj wynik (+XP)' : 'Zapisz wynik i odbierz XP'}
              </button>
            </div>
          </div>
        </section>
      </article>

      {/* Modal Zgłoś błąd */}
      {reportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="report-modal-title"
                  className="font-display text-lg font-bold text-slate-900 dark:text-slate-100"
                >
                  Zgłoś błąd merytoryczny
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {currentLesson.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                aria-label="Zamknij okno zgłoszenia"
                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                  Dziękujemy! Zgłoszenie zostało zapisane lokalnie w dzienniku uwag lekcji do weryfikacji merytorycznej.
                </div>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="min-h-[40px] w-full rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  Zamknij
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="report-description"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Opis uwagi lub błędu w treści / schemacie
                  </label>
                  <textarea
                    id="report-description"
                    rows={4}
                    value={reportText}
                    onChange={(e) => {
                      setReportText(e.target.value);
                      if (reportError) setReportError('');
                    }}
                    placeholder="Np. w opisie zaworu HGL brakuje doprecyzowania ciśnienia pilotowego..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  {reportError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{reportError}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="min-h-[40px] rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950"
                  >
                    Zapisz zgłoszenie
                  </button>
                </div>
              </form>
            )}

            {lessonReports.length > 0 && (
              <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Zapisane uwagi dla tej lekcji ({lessonReports.length}):
                </h4>
                <ul className="mt-2 max-h-28 space-y-1.5 overflow-y-auto text-xs text-slate-600 dark:text-slate-400">
                  {lessonReports.map((rep) => (
                    <li key={rep.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-950">
                      {rep.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
