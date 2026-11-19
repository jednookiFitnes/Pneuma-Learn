import { useEffect, useState } from 'react';
import { Header, type AppTab } from './components/Header';
import { LegalBanner } from './components/LegalBanner';
import { XpBar } from './components/XpBar';
import { LessonView } from './components/LessonView';
import { SimulatorView } from './components/SimulatorView';
import { VerifierView } from './components/VerifierView';
import { CatalogView } from './components/CatalogView';
import { GlossaryView } from './components/GlossaryView';
import { IfaExamplesView } from './components/IfaExamplesView';
import { ACHIEVEMENTS } from './utils/safetyMath';
import {
  loadProgress,
  loadTheme,
  saveProgress,
  saveTheme,
  type AcademyProgressState,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('learn');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [progress, setProgress] = useState<AcademyProgressState>(() => loadProgress());
  const [exploredCatalog, setExploredCatalog] = useState(false);
  const [exploredGlossary, setExploredGlossary] = useState(false);

  // Synchronizacja klasy .dark na <html> oraz zapis preferencji motywu
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Zapis postępu XP / osiągnięć w localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const unlockAchievement = (
    draft: AcademyProgressState,
    achievementId: string
  ): AcademyProgressState => {
    if (draft.achievements.includes(achievementId)) return draft;
    const def = ACHIEVEMENTS.find((a) => a.id === achievementId);
    const bonus = def ? def.xpBonus : 0;
    return {
      ...draft,
      xp: draft.xp + bonus,
      achievements: [...draft.achievements, achievementId],
    };
  };

  const handleCompleteQuiz = (
    lessonId: number,
    score: number,
    _total: number,
    xpReward: number
  ) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const prevBest = prev.quizBestScores[lessonId] ?? 0;
      const bestScore = Math.max(prevBest, score);

      let next: AcademyProgressState = {
        ...prev,
        xp: alreadyCompleted ? prev.xp : prev.xp + xpReward,
        completedLessons: alreadyCompleted
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        quizBestScores: {
          ...prev.quizBestScores,
          [lessonId]: bestScore,
        },
      };

      next = unlockAchievement(next, 'first_quiz');
      if (next.completedLessons.length >= 4) {
        next = unlockAchievement(next, 'all_lessons');
      }
      return next;
    });
  };

  const handleSubmitErrorReport = (
    lessonId: number,
    lessonTitle: string,
    description: string
  ) => {
    setProgress((prev) => ({
      ...prev,
      errorReports: [
        {
          id: `rep_${Date.now()}`,
          lessonId,
          lessonTitle,
          description,
          createdAt: new Date().toISOString(),
        },
        ...prev.errorReports,
      ],
    }));
  };

  const handleExploreFault = () => {
    setProgress((prev) => unlockAchievement(prev, 'fault_hunter'));
  };

  const handleCompleteVerification = (passed: boolean) => {
    if (!passed) return;
    setProgress((prev) => unlockAchievement(prev, 'pl_verifier'));
  };

  const handleInspectCatalog = () => {
    setExploredCatalog(true);
    if (exploredGlossary) {
      setProgress((prev) => unlockAchievement(prev, 'catalog_explorer'));
    }
  };

  const handleInteractGlossary = () => {
    setExploredGlossary(true);
    if (exploredCatalog) {
      setProgress((prev) => unlockAchievement(prev, 'catalog_explorer'));
    }
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <LegalBanner />
      <XpBar progress={progress} />

      <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {activeTab === 'learn' && (
          <LessonView
            completedLessons={progress.completedLessons}
            quizBestScores={progress.quizBestScores}
            errorReports={progress.errorReports}
            onCompleteQuiz={handleCompleteQuiz}
            onSubmitErrorReport={handleSubmitErrorReport}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView onExploreFault={handleExploreFault} />
        )}

        {activeTab === 'verifier' && (
          <VerifierView onCompleteVerification={handleCompleteVerification} />
        )}

        {activeTab === 'catalog' && (
          <CatalogView onInspectItem={handleInspectCatalog} />
        )}

        {activeTab === 'ifa' && <IfaExamplesView />}

        {activeTab === 'glossary' && (
          <GlossaryView onInteractGlossary={handleInteractGlossary} />
        )}
      </main>

      <footer className="mt-10 border-t border-slate-200 bg-white py-5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <span>
            PneumoSafe Academy &amp; Studio · Materiały referencyjne: Festo Safety Engineering Guidelines · Pilz The Safety Compendium · IFA Report 2/2017e
          </span>
          <span>Narzędzie edukacyjne (EN ISO 13849-1 / EN ISO 12100 / ISO 1219)</span>
        </div>
      </footer>
    </div>
  );
}
