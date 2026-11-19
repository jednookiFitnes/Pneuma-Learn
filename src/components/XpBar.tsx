import { useState } from 'react';
import { Award, ChevronDown, ChevronUp, CheckCircle2, Lock } from 'lucide-react';
import { ACHIEVEMENTS, computeUserRank } from '../utils/safetyMath';
import type { AcademyProgressState } from '../utils/storage';

interface XpBarProps {
  progress: AcademyProgressState;
}

export function XpBar({ progress }: XpBarProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const rank = computeUserRank(progress.xp);
  const unlockedCount = progress.achievements.length;

  return (
    <section
      aria-label="Postęp nauki i osiągnięcia"
      className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Poziom {rank.level}: {rank.title}
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <div className="font-mono text-xs font-semibold text-sky-700 tabular-nums dark:text-sky-400">
            {progress.xp} XP
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <div className="text-xs text-slate-600 tabular-nums dark:text-slate-300">
            Ukończone lekcje: {progress.completedLessons.length} / 4
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 min-w-[240px]">
          <div className="hidden max-w-[220px] flex-1 sm:block">
            <div className="mb-1 flex justify-between text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
              <span>Postęp rangi</span>
              <span>
                {progress.xp} / {rank.nextLevelXp} XP
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300 dark:bg-sky-400"
                style={{ width: `${rank.progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAchievements((prev) => !prev)}
            aria-expanded={showAchievements}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="tabular-nums">
              Osiągnięcia ({unlockedCount}/{ACHIEVEMENTS.length})
            </span>
            {showAchievements ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {showAchievements && (
        <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = progress.achievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`rounded-lg border p-3 transition-colors ${
                    unlocked
                      ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30'
                      : 'border-slate-200 bg-white opacity-75 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {ach.title}
                    </span>
                    {unlocked ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-label="Odblokowano"
                      />
                    ) : (
                      <Lock
                        className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-600"
                        aria-label="Zablokowano"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600 dark:text-slate-400">
                    {ach.description}
                  </p>
                  <div className="mt-2 font-mono text-[11px] font-semibold text-sky-700 tabular-nums dark:text-sky-400">
                    +{ach.xpBonus} XP · {unlocked ? 'Zdobyte' : 'Do zdobycia'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
