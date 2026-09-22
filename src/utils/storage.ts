import {
  ChildProfile,
  GameSession,
  ParentSettings,
  WordProgress,
} from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

const PROFILE_KEY = 'linguaplay_child_profile';
const WORD_PROGRESS_KEY = 'linguaplay_word_progress';
const SESSIONS_KEY = 'linguaplay_game_sessions';
const SETTINGS_KEY = 'linguaplay_parent_settings';

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

export function loadChildProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const profile = JSON.parse(raw) as ChildProfile;
    
    // Check daily streak reset logic
    const today = getTodayDateString();
    if (profile.lastActiveDate !== today) {
      const lastDate = new Date(profile.lastActiveDate);
      const currDate = new Date(today);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day! Increment streak
        profile.streakDays += 1;
      } else if (diffDays > 1) {
        // Missed more than a day, reset streak gently to 1
        profile.streakDays = 1;
      }
      profile.lastActiveDate = today;
      if (profile.dailyChallengeDate !== today) {
        profile.dailyChallengeCompleted = false;
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
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage write fallback
  }
}

export function loadWordProgress(): Record<string, WordProgress> {
  try {
    const raw = localStorage.getItem(WORD_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateWordProgress(wordId: string, isCorrect: boolean): void {
  const map = loadWordProgress();
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
  localStorage.setItem(WORD_PROGRESS_KEY, JSON.stringify(map));
}

export function loadGameSessions(): GameSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordGameSession(session: GameSession): void {
  const sessions = loadGameSessions();
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

  // Update profile XP, stars, coins, level
  const profile = loadChildProfile();
  profile.xp += session.xpEarned;
  profile.stars += session.starsEarned;
  profile.coins += session.coinsEarned;

  // Level formula: level = 1 + Math.floor(xp / 100)
  const newLevel = 1 + Math.floor(profile.xp / 100);
  profile.level = newLevel;

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

export function getUnlockedAchievements(): string[] {
  const profile = loadChildProfile();
  const sessions = loadGameSessions();
  const wordMap = loadWordProgress();
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
  // Estimate ~2 minutes per game session
  return todaySessions.length * 2;
}
