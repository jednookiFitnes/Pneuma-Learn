export interface ErrorReport {
  id: string;
  lessonId: number;
  lessonTitle: string;
  description: string;
  createdAt: string;
}

export interface AcademyProgressState {
  xp: number;
  completedLessons: number[];
  quizBestScores: Record<number, number>;
  achievements: string[];
  errorReports: ErrorReport[];
}

export const PROGRESS_STORAGE_KEY = 'pneumosafe_academy_progress_v1';
export const THEME_STORAGE_KEY = 'pneumosafe_theme_v1';

export const DEFAULT_PROGRESS: AcademyProgressState = {
  xp: 0,
  completedLessons: [],
  quizBestScores: {},
  achievements: [],
  errorReports: [],
};

export function loadProgress(): AcademyProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<AcademyProgressState>;
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      quizBestScores:
        parsed.quizBestScores && typeof parsed.quizBestScores === 'object'
          ? parsed.quizBestScores
          : {},
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      errorReports: Array.isArray(parsed.errorReports) ? parsed.errorReports : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(state: AcademyProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function loadTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore storage errors
  }
}
