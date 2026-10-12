import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Flame,
  Star,
  Sparkles,
  Volume2,
  CheckCircle2,
  Shield,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  FileText,
  Lock,
} from 'lucide-react';
import { ChildProfile, VocabularyItem } from '../../types';
import { ACHIEVEMENTS } from '../../data/achievements';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { MASCOTS } from '../../data/avatars';
import { LEVEL_TIERS, getLevelTier, calculateLevelProgress, getStandardBadgeInfo } from '../../data/levels';
import { loadWordProgress, getUnlockedAchievements } from '../../utils/storage';
import { sound } from '../../utils/sound';
import { LevelCertificateModal } from './LevelCertificateModal';

interface ChildProgressViewProps {
  profile: ChildProfile;
  onUpdateProfile: (updated: ChildProfile) => void;
  onOpenShop: () => void;
  onBackToMap: () => void;
}

export const ChildProgressView: React.FC<ChildProgressViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenShop,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'levels' | 'trophies' | 'vocabulary' | 'wardrobe'>('levels');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedRoadmapLevel, setSelectedRoadmapLevel] = useState<number>(profile.level);

  const wordProgressMap = loadWordProgress(profile.activeLanguage);
  const unlockedAchievementIds = getUnlockedAchievements(profile.activeLanguage);
  const currentMascot = MASCOTS.find((m) => m.id === profile.avatar.mascotId) || MASCOTS[0];

  const currentTier = getLevelTier(profile.level);
  const progressData = calculateLevelProgress(profile.xp);
  const standardBadge = getStandardBadgeInfo(profile.activeLanguage, profile.level);
  const isZh = profile.activeLanguage === 'zh';

  const masteredWordsCount = Object.values(wordProgressMap).filter((w) => w.masteryScore >= 70).length;

  const handleSpeakVocab = (item: VocabularyItem) => {
    const textToSpeak = profile.activeLanguage === 'zh' ? item.chinese : item.english;
    sound.speak(textToSpeak, profile.activeLanguage, 0.85);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-amber-900 font-extrabold text-xs sm:text-sm rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer active:scale-95 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to World Map / Kembali ke Peta</span>
        </button>

        {/* Certificate Quick Button */}
        <button
          onClick={() => {
            sound.playFanfare();
            setIsCertificateOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer active:scale-95 transition-all flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>📜 View Diploma / Sertifikat</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-300 to-orange-400 flex items-center justify-center text-6xl shadow-md border-4 border-amber-200 relative shrink-0">
            <span>{currentMascot.emoji}</span>
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
              Lvl {profile.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h2 className="text-3xl font-black text-gray-900">{profile.nickname}</h2>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full">
                {standardBadge.standardCode}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-500 mb-2">
              Official Track: <span className="text-amber-600 uppercase font-black">{isZh ? 'Mandarin (YCT/HSK)' : 'English (CEFR)'}</span>
            </p>

            {/* Stats Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-orange-100 text-orange-800 text-xs font-black px-3 py-1 rounded-xl border border-orange-300 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>{profile.streakDays} Day Streak</span>
              </span>
              <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-xl border border-amber-300 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{profile.stars} Stars</span>
              </span>
              <span className="bg-yellow-100 text-yellow-900 text-xs font-black px-3 py-1 rounded-xl border border-yellow-300 flex items-center gap-1">
                <span>💰</span>
                <span>{profile.coins} Coins</span>
              </span>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
                <span>⚡</span>
                <span>{profile.xp} XP</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              sound.playFanfare();
              setIsCertificateOpen(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black rounded-2xl shadow-md border-2 border-purple-400 text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Official Diploma</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="px-5 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black rounded-2xl shadow-md border-2 border-yellow-600 hover:brightness-105 active:scale-95 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
          >
            <span>🛍️</span>
            <span>Avatar Shop</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white/80 backdrop-blur p-1.5 rounded-2xl border-2 border-amber-200 max-w-2xl mx-auto shadow-sm overflow-x-auto">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('levels');
          }}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'levels' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          📈 Levels & Standards
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('trophies');
          }}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'trophies' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          🏆 Trophies ({unlockedAchievementIds.length})
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('vocabulary');
          }}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'vocabulary' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          📚 Word Library
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('wardrobe');
          }}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'wardrobe' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          🧢 Wardrobe
        </button>
      </div>

      {/* TAB 1: LEVELS & INTERNATIONAL STANDARDS */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          {/* Active Level Spotlight Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${currentTier.badgeGradient} flex items-center justify-center text-4xl shadow-lg border-2 border-white`}>
                  {currentTier.badgeEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      Level {currentTier.level}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      {standardBadge.standardCode}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      {standardBadge.frameworkName}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {isZh ? currentTier.titleZh : currentTier.titleEn}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 max-w-xl">
                    {isZh ? currentTier.descriptionZh : currentTier.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Next Milestone XP Progress Card */}
              <div className="w-full lg:w-72 bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-200">
                <div className="flex items-center justify-between text-xs font-black text-amber-900 mb-1.5">
                  <span>Progress to Next Tier</span>
                  <span>{progressData.progressPercent}%</span>
                </div>
                <div className="w-full bg-amber-200 h-3.5 rounded-full overflow-hidden border border-amber-300 shadow-inner mb-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressData.progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] font-bold text-amber-800 text-right">
                  {progressData.nextTier
                    ? `${progressData.xpNeededForNext} XP to Level ${progressData.nextTier.level} (${isZh ? progressData.nextTier.yctEquivalent : progressData.nextTier.cefrEquivalent})`
                    : 'Maximum Level Attained! 🌟'}
                </p>
              </div>
            </div>

            {/* Core Competencies & Skills for Current Level */}
            <div className="pt-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                Key International Language Competencies for this Level:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(isZh ? currentTier.skillsZh : currentTier.skillsEn).map((skill, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Standard Roadmap: CEFR & YCT 7 Levels */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {isZh ? '国际少儿汉语等级体系 (YCT / HSK 阶梯)' : 'CEFR & Cambridge English Level Roadmap'}
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  {isZh
                    ? '根据教育部中外语言交流合作中心 YCT 1-4 级及新 HSK 标准设计。'
                    : 'Aligned with Cambridge English Young Learners (Starters, Movers, Flyers) and CEFR Pre-A1 to B1.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                  {isZh ? '共 7 个国际进阶梯度' : '7 Standard Milestones'}
                </span>
              </div>
            </div>

            {/* Roadmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
              {LEVEL_TIERS.map((tierItem) => {
                const isAchieved = profile.level >= tierItem.level;
                const isCurrent = profile.level === tierItem.level;

                return (
                  <div
                    key={tierItem.level}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRoadmapLevel(tierItem.level);
                    }}
                    className={`p-5 rounded-3xl border-3 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-amber-50/90 border-amber-500 shadow-lg scale-102 ring-4 ring-amber-200'
                        : isAchieved
                        ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-sm'
                        : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Header Level & Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tierItem.badgeGradient} flex items-center justify-center text-2xl shadow-sm text-white`}>
                          {tierItem.badgeEmoji}
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isCurrent
                              ? 'bg-amber-500 text-white'
                              : isAchieved
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCurrent ? 'Current 🚀' : isAchieved ? 'Achieved ✅' : 'Locked 🔒'}
                        </span>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-gray-900">Level {tierItem.level}</span>
                          <span className="text-[10px] font-extrabold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded border border-sky-200">
                            {isZh ? tierItem.yctEquivalent : tierItem.cefrEquivalent}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-gray-800 leading-tight">
                          {isZh ? tierItem.titleZh : tierItem.titleEn}
                        </h4>
                      </div>

                      <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-3 line-clamp-2">
                        {isZh ? tierItem.descriptionZh : tierItem.descriptionEn}
                      </p>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-600">
                      <span>Requirement:</span>
                      <span className="text-amber-600 font-extrabold">{tierItem.xpRequired} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACHIEVEMENTS / TROPHIES */}
      {activeTab === 'trophies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchievementIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border-4 transition-all text-center ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-md'
                    : 'bg-gray-100 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-5xl mb-2">{ach.icon}</div>
                <h4 className="font-black text-gray-900 text-base mb-1">
                  {profile.activeLanguage === 'zh' ? ach.titleZh : ach.titleEn}
                </h4>
                <p className="text-xs font-semibold text-gray-500 mb-3">{ach.description}</p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isUnlocked ? 'Unlocked ✅' : 'Locked 🔒'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: VOCABULARY LIBRARY */}
      {activeTab === 'vocabulary' && (
        <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">Vocabulary Collection</h3>
            <span className="text-xs font-bold text-amber-600 uppercase">
              Total Vocabulary: {VOCABULARY_LIST.length} Words ({masteredWordsCount} Mastered)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {VOCABULARY_LIST.map((item) => {
              const prog = wordProgressMap[item.id];
              const isMastered = prog && prog.masteryScore >= 70;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border-2 text-left relative transition-all ${
                    isMastered ? 'bg-emerald-50 border-emerald-300 shadow-xs' : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-3xl">{item.emoji}</span>
                    <button
                      onClick={() => handleSpeakVocab(item)}
                      className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-xl cursor-pointer"
                      title="Pronounce Word"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-black text-gray-900 text-sm">{item.english}</p>
                  <p className="text-xs font-bold text-rose-600">
                    {item.chinese} <span className="font-normal text-gray-500">({item.pinyin})</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold">{item.indonesian}</p>

                  {isMastered && (
                    <span className="absolute top-2 right-2 text-emerald-600 text-xs" title="Mastered Word">
                      ⭐
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MASCOT WARDROBE */}
      {activeTab === 'wardrobe' && (
        <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl text-center space-y-6">
          <h3 className="text-2xl font-black text-gray-900">Select Your Mascot Character</h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {MASCOTS.map((m) => {
              const isSelected = profile.avatar.mascotId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playClick();
                    onUpdateProfile({
                      ...profile,
                      avatar: { ...profile.avatar, mascotId: m.id },
                    });
                  }}
                  className={`p-4 rounded-3xl border-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <span className="text-5xl block mb-2">{m.emoji}</span>
                  <span className="font-black text-gray-800 text-xs block">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Certificate / Diploma Modal */}
      <LevelCertificateModal
        isOpen={isCertificateOpen}
        profile={profile}
        onClose={() => setIsCertificateOpen(false)}
      />
    </div>
  );
};
