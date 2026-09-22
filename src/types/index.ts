export type Language = 'en' | 'zh' | 'both';

export type ActiveLanguage = 'en' | 'zh';

export type TopicId = 'animals' | 'food' | 'colors' | 'numbers' | 'family' | 'school' | 'daily';

export type GameType = 'picture_match' | 'listen_choose' | 'word_builder' | 'memory_match';

export interface VocabularyItem {
  id: string;
  topic: TopicId;
  english: string;
  chinese: string;
  pinyin: string;
  indonesian: string; // Indonesian meaning as specified in PRD
  exampleEn: string;
  exampleZh: string;
  emoji: string;
  difficulty: 1 | 2 | 3;
}

export interface Topic {
  id: TopicId;
  nameEn: string;
  nameZh: string;
  nameIndo: string;
  icon: string;
  bgGradient: string;
  accentColor: string;
  description: string;
}

export interface AvatarCustomization {
  mascotId: string; // e.g., 'lion', 'panda', 'dragon', 'bunny', 'penguin'
  hatId: string; // e.g., 'none', 'crown', 'cap', 'wizard', 'glasses', 'headphones', 'flower'
  outfitColor: string; // hex or tailwind class
  bgColor: string;
}

export interface UnlockedItem {
  id: string;
  type: 'hat' | 'outfit' | 'background';
}

export interface ChildProfile {
  id: string;
  nickname: string;
  selectedLanguage: Language;
  activeLanguage: ActiveLanguage;
  level: number;
  xp: number;
  stars: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  avatar: AvatarCustomization;
  unlockedItems: string[]; // item IDs
  dailyChallengeCompleted: boolean;
  dailyChallengeDate: string;
}

export interface WordProgress {
  wordId: string;
  correctCount: number;
  incorrectCount: number;
  masteryScore: number; // 0 to 100
  lastReviewedAt: number; // timestamp
}

export interface GameSession {
  id: string;
  childId: string;
  gameType: GameType;
  language: ActiveLanguage;
  topicId: TopicId;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  coinsEarned: number;
  starsEarned: number;
  accuracy: number; // 0 - 100
  timestamp: number;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleZh: string;
  description: string;
  icon: string;
  requirementType: 'streak' | 'games_played' | 'words_learned' | 'stars_earned' | 'topic_mastered';
  requirementValue: number;
  unlockedAt?: number;
}

export interface AvatarShopItem {
  id: string;
  name: string;
  type: 'hat' | 'outfit' | 'background';
  price: number;
  icon: string;
  previewClass?: string;
}

export interface ParentSettings {
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  speechSpeed: number; // 0.7 to 1.0
  childPin: string;
}
