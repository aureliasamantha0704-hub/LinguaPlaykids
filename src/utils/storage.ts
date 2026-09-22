import {
  ChildProfile,
  GameSession,
  LanguageProgressStats,
  ParentSettings,
  ActiveLanguage,
  WordProgress,
} from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

const PROFILE_KEY = 'linguaplay_child_profile';
const WORD_PROGRESS_KEY = 'linguaplay_word_progress';
const SESSIONS_KEY = 'linguaplay_game_sessions';
const SETTINGS_KEY = 'linguaplay_parent_settings';
const SESSION_KEY = 'linguaplay_active_session';

export const DEFAULT_EN_PROGRESS: LanguageProgressStats = {
  level: 1,
  xp: 0,
  stars: 0,
  coins: 50,
  streakDays: 1,
  dailyChallengeCompleted: false,
  dailyChallengeDate: '',
};

export const DEFAULT_ZH_PROGRESS: LanguageProgressStats = {
  level: 1,
  xp: 0,
  stars: 0,
  coins: 50,
  streakDays: 1,
  dailyChallengeCompleted: false,
  dailyChallengeDate: '',
};

export const DEFAULT_PROFILE: ChildProfile = {
  id: 'child_default',
  nickname: 'Leo Explorer',
  selectedLanguage: 'both',
  activeLanguage: 'en',
  level: 1,
  xp: 0,
  stars: 0,
  coins: 50,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  avatar: {
    mascotId: 'lion',
    hatId: 'none',
    outfitColor: '#f59e0b',
    bgColor: 'from-amber-100 to-orange-200',
  },
  unlockedItems: ['none', 'bg_default'],
  dailyChallengeCompleted: false,
  dailyChallengeDate: '',
  languageProgress: {
    en: { ...DEFAULT_EN_PROGRESS },
    zh: { ...DEFAULT_ZH_PROGRESS },
  },
};

export const DEFAULT_SETTINGS: ParentSettings = {
  dailyGoalMinutes: 15,
  soundEnabled: true,
  speechSpeed: 0.85,
  childPin: '1234',
};

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isSessionActive(): boolean {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

export function setSessionActive(active: boolean): void {
  if (active) {
    localStorage.setItem(SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function ensureLanguageProgress(profile: ChildProfile): ChildProfile {
  if (!profile.languageProgress) {
    profile.languageProgress = {
      en: {
        level: profile.activeLanguage === 'en' ? profile.level : 1,
        xp: profile.activeLanguage === 'en' ? profile.xp : 0,
        stars: profile.activeLanguage === 'en' ? profile.stars : 0,
        coins: profile.activeLanguage === 'en' ? profile.coins : 50,
        streakDays: profile.activeLanguage === 'en' ? profile.streakDays : 1,
        dailyChallengeCompleted: profile.activeLanguage === 'en' ? profile.dailyChallengeCompleted : false,
        dailyChallengeDate: profile.activeLanguage === 'en' ? profile.dailyChallengeDate : '',
      },
      zh: {
        level: profile.activeLanguage === 'zh' ? profile.level : 1,
        xp: profile.activeLanguage === 'zh' ? profile.xp : 0,
        stars: profile.activeLanguage === 'zh' ? profile.stars : 0,
        coins: profile.activeLanguage === 'zh' ? profile.coins : 50,
        streakDays: profile.activeLanguage === 'zh' ? profile.streakDays : 1,
        dailyChallengeCompleted: profile.activeLanguage === 'zh' ? profile.dailyChallengeCompleted : false,
        dailyChallengeDate: profile.activeLanguage === 'zh' ? profile.dailyChallengeDate : '',
      },
    };
  }
  return profile;
}

export function loadChildProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    let profile = JSON.parse(raw) as ChildProfile;
    profile = ensureLanguageProgress(profile);

    // Ensure top-level stats match current activeLanguage
    const activeStats = profile.languageProgress![profile.activeLanguage || 'en'];
    if (activeStats) {
      profile.level = activeStats.level;
      profile.xp = activeStats.xp;
      profile.stars = activeStats.stars;
      profile.coins = activeStats.coins;
      profile.streakDays = activeStats.streakDays;
      profile.dailyChallengeCompleted = activeStats.dailyChallengeCompleted;
      profile.dailyChallengeDate = activeStats.dailyChallengeDate;
    }

    // Check daily streak reset logic
    const today = getTodayDateString();
    if (profile.lastActiveDate !== today) {
      const lastDate = new Date(profile.lastActiveDate);
      const currDate = new Date(today);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        profile.streakDays += 1;
      } else if (diffDays > 1) {
        profile.streakDays = 1;
      }
      profile.lastActiveDate = today;
      if (profile.dailyChallengeDate !== today) {
        profile.dailyChallengeCompleted = false;
      }

      // Update active language stats
      if (profile.languageProgress && profile.languageProgress[profile.activeLanguage]) {
        profile.languageProgress[profile.activeLanguage].streakDays = profile.streakDays;
        profile.languageProgress[profile.activeLanguage].dailyChallengeCompleted = profile.dailyChallengeCompleted;
        profile.languageProgress[profile.activeLanguage].dailyChallengeDate = profile.dailyChallengeDate;
      }

      saveChildProfile(profile);
    }

    return profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveChildProfile(profile: ChildProfile): void {
  try {
    const hydrated = ensureLanguageProgress(profile);
    const activeLang = hydrated.activeLanguage || 'en';

    hydrated.languageProgress![activeLang] = {
      level: hydrated.level,
      xp: hydrated.xp,
      stars: hydrated.stars,
      coins: hydrated.coins,
      streakDays: hydrated.streakDays,
      dailyChallengeCompleted: hydrated.dailyChallengeCompleted,
      dailyChallengeDate: hydrated.dailyChallengeDate,
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(hydrated));
  } catch {
    // Storage write fallback
  }
}

export function switchProfileLanguage(profile: ChildProfile, newLang: ActiveLanguage): ChildProfile {
  const hydrated = ensureLanguageProgress({ ...profile });
  const currentLang = hydrated.activeLanguage || 'en';

  // Save current active language progress
  hydrated.languageProgress![currentLang] = {
    level: hydrated.level,
    xp: hydrated.xp,
    stars: hydrated.stars,
    coins: hydrated.coins,
    streakDays: hydrated.streakDays,
    dailyChallengeCompleted: hydrated.dailyChallengeCompleted,
    dailyChallengeDate: hydrated.dailyChallengeDate,
  };

  // Set active language
  hydrated.activeLanguage = newLang;

  // Retrieve target language progress
  const targetStats = hydrated.languageProgress![newLang] || { ...DEFAULT_EN_PROGRESS };

  hydrated.level = targetStats.level;
  hydrated.xp = targetStats.xp;
  hydrated.stars = targetStats.stars;
  hydrated.coins = targetStats.coins;
  hydrated.streakDays = targetStats.streakDays;
  hydrated.dailyChallengeCompleted = targetStats.dailyChallengeCompleted;
  hydrated.dailyChallengeDate = targetStats.dailyChallengeDate;

  saveChildProfile(hydrated);
  return hydrated;
}

export function loadWordProgress(lang?: ActiveLanguage): Record<string, WordProgress> {
  try {
    const activeLang = lang || loadChildProfile().activeLanguage || 'en';
    const key = `${WORD_PROGRESS_KEY}_${activeLang}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    const legacyRaw = localStorage.getItem(WORD_PROGRESS_KEY);
    return legacyRaw ? JSON.parse(legacyRaw) : {};
  } catch {
    return {};
  }
}

export function updateWordProgress(wordId: string, isCorrect: boolean, lang?: ActiveLanguage): void {
  const activeLang = lang || loadChildProfile().activeLanguage || 'en';
  const key = `${WORD_PROGRESS_KEY}_${activeLang}`;
  const map = loadWordProgress(activeLang);
  const existing = map[wordId] || {
    wordId,
    correctCount: 0,
    incorrectCount: 0,
    masteryScore: 0,
    lastReviewedAt: Date.now(),
  };

  if (isCorrect) {
    existing.correctCount += 1;
  } else {
    existing.incorrectCount += 1;
  }

  const total = existing.correctCount + existing.incorrectCount;
  existing.masteryScore = Math.round((existing.correctCount / total) * 100);
  existing.lastReviewedAt = Date.now();

  map[wordId] = existing;
  localStorage.setItem(key, JSON.stringify(map));
}

export function loadGameSessions(lang?: ActiveLanguage): GameSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    const sessions = raw ? (JSON.parse(raw) as GameSession[]) : [];
    if (lang) {
      return sessions.filter((s) => s.language === lang);
    }
    return sessions;
  } catch {
    return [];
  }
}

export function recordGameSession(session: GameSession): void {
  const sessions = loadGameSessions();
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

  // Update profile XP, stars, coins, level for session language
  const profile = loadChildProfile();
  
  // Update current active stats
  profile.xp += session.xpEarned;
  profile.stars += session.starsEarned;
  profile.coins += session.coinsEarned;

  // Level formula: level = 1 + Math.floor(xp / 100)
  profile.level = 1 + Math.floor(profile.xp / 100);

  saveChildProfile(profile);
}

export function loadParentSettings(): ParentSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveParentSettings(settings: ParentSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Save error fallback
  }
}

export function getUnlockedAchievements(lang?: ActiveLanguage): string[] {
  const profile = loadChildProfile();
  const activeLang = lang || profile.activeLanguage;
  const sessions = loadGameSessions(activeLang);
  const wordMap = loadWordProgress(activeLang);
  const masteredWordsCount = Object.values(wordMap).filter((w) => w.masteryScore >= 70).length;

  const unlockedIds: string[] = [];

  ACHIEVEMENTS.forEach((ach) => {
    let unlocked = false;
    switch (ach.requirementType) {
      case 'games_played':
        if (sessions.length >= ach.requirementValue) unlocked = true;
        break;
      case 'streak':
        if (profile.streakDays >= ach.requirementValue) unlocked = true;
        break;
      case 'words_learned':
        if (masteredWordsCount >= ach.requirementValue) unlocked = true;
        break;
      case 'stars_earned':
        if (profile.stars >= ach.requirementValue) unlocked = true;
        break;
      case 'topic_mastered':
        if (masteredWordsCount >= 8) unlocked = true;
        break;
    }
    if (unlocked) unlockedIds.push(ach.id);
  });

  return unlockedIds;
}

export function getTodayLearningMinutes(): number {
  const sessions = loadGameSessions();
  const today = getTodayDateString();
  const todaySessions = sessions.filter((s) => {
    const sDate = new Date(s.timestamp).toISOString().split('T')[0];
    return sDate === today;
  });
  return todaySessions.length * 2;
}
