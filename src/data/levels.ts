import { LevelTier, ActiveLanguage } from '../types';

export const LEVEL_TIERS: LevelTier[] = [
  {
    level: 1,
    titleEn: 'Starter Explorer',
    titleZh: '小小启蒙家',
    titleIndo: 'Penjelajah Pemula',
    cefrEquivalent: 'Pre-A1 Starters',
    yctEquivalent: 'YCT 1 (入门级)',
    hskEquivalent: 'Pre-HSK (启蒙)',
    xpRequired: 0,
    nextLevelXp: 100,
    targetWordsCount: 10,
    badgeEmoji: '🥉',
    badgeGradient: 'from-amber-400 to-amber-600',
    colorHex: '#f59e0b',
    descriptionEn: 'First words, animal sounds, colors, and everyday greeting vocabulary.',
    descriptionZh: '初步接触汉字笔画、基础拼音声母、日常生活问候及可爱动物。',
    descriptionIndo: 'Kata pertama, suara hewan, warna, dan kosakata sapaan sehari-hari.',
    skillsEn: ['Phonics letter sounds', 'Numbers 1-5 recognition', 'Basic everyday animals'],
    skillsZh: ['拼音四声初步认知', '一至五简单数字', '日常问候 (你好/谢谢)'],
  },
  {
    level: 2,
    titleEn: 'Curious Adventurer',
    titleZh: '好奇探险家',
    titleIndo: 'Petualang Cilik',
    cefrEquivalent: 'Pre-A1+ Starters Advanced',
    yctEquivalent: 'YCT 1+ (拼音达人)',
    hskEquivalent: 'HSK 1 预备',
    xpRequired: 100,
    nextLevelXp: 250,
    targetWordsCount: 25,
    badgeEmoji: '🥈',
    badgeGradient: 'from-slate-400 to-slate-600',
    colorHex: '#64748b',
    descriptionEn: 'Yummy fruits, family member names, primary colors, and basic listening comprehension.',
    descriptionZh: '美味水果、家庭称呼、明亮色彩辨别以及简单听力匹配。',
    descriptionIndo: 'Buah-buahan lezat, sebutan keluarga, warna dasar, dan pemahaman audio sederhana.',
    skillsEn: ['Family member names', 'Fruit and snack words', 'Listen & picture matching'],
    skillsZh: ['家庭主要称谓 (爸爸/妈妈)', '常用食物水果', '听音识图正确率 ≥ 75%'],
  },
  {
    level: 3,
    titleEn: 'Word Voyager',
    titleZh: '词汇小水手',
    titleIndo: 'Penjelajah Kosakata',
    cefrEquivalent: 'A1 Movers',
    yctEquivalent: 'YCT 2 (进阶级)',
    hskEquivalent: 'HSK 1 基础',
    xpRequired: 250,
    nextLevelXp: 450,
    targetWordsCount: 45,
    badgeEmoji: '🥇',
    badgeGradient: 'from-yellow-400 to-amber-500',
    colorHex: '#eab308',
    descriptionEn: 'Mastery of classroom items, counting to 10+, and assembling 3-letter word tiles.',
    descriptionZh: '掌握校园用具、十以内数字顺逆数、以及基础汉字拼词拼图。',
    descriptionIndo: 'Penguasaan perlengkapan sekolah, berhitung 1-10, dan menyusun balok kata.',
    skillsEn: ['School & classroom items', 'Numbers 1-10 counting', 'Unscrambling word tiles'],
    skillsZh: ['学校及学习用品', '一至十顺逆数数', '拼音与汉字配对游戏'],
  },
  {
    level: 4,
    titleEn: 'Junior Scholar',
    titleZh: '博学小学者',
    titleIndo: 'Cendekiawan Cilik',
    cefrEquivalent: 'A1+ Movers Advanced',
    yctEquivalent: 'YCT 2+ (汉字小达人)',
    hskEquivalent: 'HSK 2 预备',
    xpRequired: 450,
    nextLevelXp: 700,
    targetWordsCount: 70,
    badgeEmoji: '🏅',
    badgeGradient: 'from-rose-400 to-red-600',
    colorHex: '#ef4444',
    descriptionEn: 'Nature, weather conditions, space exploration words, and audio speed challenges.',
    descriptionZh: '大自然、天气变化、航天太空词汇以及正常语速听力理解。',
    descriptionIndo: 'Alam, kondisi cuaca, kosakata ruang angkasa, dan tantangan kecepatan audio.',
    skillsEn: ['Weather & nature vocabulary', 'Word builder puzzles', 'Rapid audio response'],
    skillsZh: ['天气与自然名词', '常见部首辨认', '拼字拼词挑战通关'],
  },
  {
    level: 5,
    titleEn: 'Language Hero',
    titleZh: '双语小勇士',
    titleIndo: 'Pahlawan Bahasa',
    cefrEquivalent: 'A2 Flyers',
    yctEquivalent: 'YCT 3 (飞跃级)',
    hskEquivalent: 'HSK 2 进阶',
    xpRequired: 700,
    nextLevelXp: 1000,
    targetWordsCount: 100,
    badgeEmoji: '💎',
    badgeGradient: 'from-sky-400 to-blue-600',
    colorHex: '#0ea5e9',
    descriptionEn: 'Comprehensive multi-topic mastery, quick memory pair matching, and sentence recognition.',
    descriptionZh: '多主题词汇融会贯通、快速翻牌记忆配对及简短双语句子理解。',
    descriptionIndo: 'Penguasaan multi-topik, pencocokan memori cepat, dan pemahaman frasa sederhana.',
    skillsEn: ['Cross-topic vocabulary retrieval', 'Memory flip pair accuracy ≥ 85%', 'Short sentence comprehension'],
    skillsZh: ['跨主题快速词汇提取', '记忆翻牌连击加成', '简单短句朗读与听力'],
  },
  {
    level: 6,
    titleEn: 'Master Explorer',
    titleZh: '卓越领航大师',
    titleIndo: 'Master Penjelajah',
    cefrEquivalent: 'A2+ Flyers Advanced',
    yctEquivalent: 'YCT 3+ (领航大师)',
    hskEquivalent: 'HSK 3 预备',
    xpRequired: 1000,
    nextLevelXp: 1400,
    targetWordsCount: 130,
    badgeEmoji: '👑',
    badgeGradient: 'from-purple-500 to-indigo-600',
    colorHex: '#8b5cf6',
    descriptionEn: 'Advanced word recognition, consistent daily streaks, high accuracy across all 4 mini games.',
    descriptionZh: '高阶汉字认读、连续每日打卡打榜、四大迷你小游戏全通关。',
    descriptionIndo: 'Pengenalan kata tingkat lanjut, streak harian konsisten, akurasi tinggi di 4 game.',
    skillsEn: ['Near-instant listening recognition', 'Flawless spelling tile construction', 'Multi-day learning streak'],
    skillsZh: ['无拼音生字准确认读', '拼音听辨零失误', '全主题成就徽章解锁'],
  },
  {
    level: 7,
    titleEn: 'Global Champion',
    titleZh: '全球双语冠军',
    titleIndo: 'Juara Global B1 / YCT 4',
    cefrEquivalent: 'B1 Preliminary (Junior Fluent)',
    yctEquivalent: 'YCT 4 / HSK 3 (精通级)',
    hskEquivalent: 'HSK 3 精通',
    xpRequired: 1400,
    nextLevelXp: 2000,
    targetWordsCount: 160,
    badgeEmoji: '🌟',
    badgeGradient: 'from-emerald-400 to-teal-600',
    colorHex: '#10b981',
    descriptionEn: 'Certified junior bilingual proficiency! Ready for elementary standard language assessments.',
    descriptionZh: '获得国际青少年语言评估标准证书，具备自信流畅的双语运用能力！',
    descriptionIndo: 'Tersertifikasi kemahiran bilingual anak! Siap untuk asesmen standar internasional.',
    skillsEn: ['Independent bilingual comprehension', 'Mastery of all core topics', 'Junior language ambassador'],
    skillsZh: ['自信流畅基础双语会话', '全词库核心词汇全掌握', '官方 YCT 4 / CEFR B1 荣誉证书'],
  },
];

export function getLevelTier(levelNumber: number): LevelTier {
  const boundedLevel = Math.max(1, levelNumber);
  const matched = LEVEL_TIERS.find((t) => t.level === boundedLevel);
  if (matched) return matched;
  // If level exceeds highest defined tier (Level 7+)
  const highest = LEVEL_TIERS[LEVEL_TIERS.length - 1];
  return {
    ...highest,
    level: boundedLevel,
    titleEn: `Global Champion Level ${boundedLevel}`,
    titleZh: `全球双语冠军 ${boundedLevel} 级`,
    titleIndo: `Juara Global Level ${boundedLevel}`,
  };
}

export function getLevelTierFromXp(xp: number): LevelTier {
  // Find highest tier where xp >= xpRequired
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].xpRequired) {
      const tier = LEVEL_TIERS[i];
      // For levels above level 7:
      if (i === LEVEL_TIERS.length - 1 && xp >= 2000) {
        const extraLevels = Math.floor((xp - 2000) / 600);
        const dynamicLevel = 7 + extraLevels + 1;
        return {
          ...tier,
          level: dynamicLevel,
          titleEn: `Global Champion Level ${dynamicLevel}`,
          titleZh: `全球双语冠军 ${dynamicLevel} 级`,
          titleIndo: `Juara Global Level ${dynamicLevel}`,
        };
      }
      return tier;
    }
  }
  return LEVEL_TIERS[0];
}

export function calculateLevelProgress(xp: number) {
  const currentTier = getLevelTierFromXp(xp);
  const nextTier = LEVEL_TIERS.find((t) => t.level === currentTier.level + 1) || null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      xpInCurrentLevel: xp - currentTier.xpRequired,
      xpNeededForNext: 0,
      totalLevelSpan: 600,
    };
  }

  const levelSpan = currentTier.nextLevelXp - currentTier.xpRequired;
  const currentXpInLevel = Math.max(0, xp - currentTier.xpRequired);
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / levelSpan) * 100));
  const xpNeededForNext = Math.max(0, currentTier.nextLevelXp - xp);

  return {
    currentTier,
    nextTier,
    progressPercent,
    xpInCurrentLevel: currentXpInLevel,
    xpNeededForNext,
    totalLevelSpan: levelSpan,
  };
}

export function getStandardBadgeInfo(lang: ActiveLanguage, levelNumber: number) {
  const tier = getLevelTier(levelNumber);
  if (lang === 'zh') {
    return {
      frameworkName: 'YCT / HSK 标准',
      standardCode: tier.yctEquivalent,
      subCode: tier.hskEquivalent,
      title: tier.titleZh,
      desc: tier.descriptionZh,
      skills: tier.skillsZh,
      badgeEmoji: tier.badgeEmoji,
      colorHex: tier.colorHex,
      badgeGradient: tier.badgeGradient,
    };
  }

  return {
    frameworkName: 'CEFR / Cambridge YLE',
    standardCode: tier.cefrEquivalent,
    subCode: 'Cambridge Starters/Movers/Flyers',
    title: tier.titleEn,
    desc: tier.descriptionEn,
    skills: tier.skillsEn,
    badgeEmoji: tier.badgeEmoji,
    colorHex: tier.colorHex,
    badgeGradient: tier.badgeGradient,
  };
}
