import React, { useState } from 'react';
import { Award, BookOpen, Flame, Star, Sparkles, Volume2, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';
import { ChildProfile, VocabularyItem } from '../../types';
import { ACHIEVEMENTS } from '../../data/achievements';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { MASCOTS, SHOP_HATS, SHOP_BACKGROUNDS } from '../../data/avatars';
import { loadWordProgress, getUnlockedAchievements } from '../../utils/storage';
import { sound } from '../../utils/sound';

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
  const [activeTab, setActiveTab] = useState<'trophies' | 'vocabulary' | 'wardrobe'>('trophies');

  const wordProgressMap = loadWordProgress();
  const unlockedAchievementIds = getUnlockedAchievements();
  const currentMascot = MASCOTS.find((m) => m.id === profile.avatar.mascotId) || MASCOTS[0];

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
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-300 to-orange-400 flex items-center justify-center text-6xl shadow-md border-4 border-amber-200 relative">
            <span>{currentMascot.emoji}</span>
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full border border-emerald-300">
              Lvl {profile.level}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-gray-900">{profile.nickname}</h2>
            <p className="text-xs font-bold text-gray-500 mb-2">
              Language Explorer: <span className="text-amber-600 uppercase font-black">{profile.selectedLanguage}</span>
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
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenShop();
          }}
          className="px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black rounded-2xl shadow-md border-2 border-yellow-600 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          🛍️ Visit Avatar Shop
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/80 backdrop-blur p-1.5 rounded-2xl border-2 border-amber-200 max-w-md mx-auto shadow-sm">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('trophies');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'trophies'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          🏆 Achievements ({unlockedAchievementIds.length})
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('vocabulary');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'vocabulary'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          📚 Word Library
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('wardrobe');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'wardrobe'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-amber-100/50'
          }`}
        >
          🧢 Mascot Wardrobe
        </button>
      </div>

      {/* TAB 1: Achievements */}
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

      {/* TAB 2: Vocabulary Library */}
      {activeTab === 'vocabulary' && (
        <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">Vocabulary Collection</h3>
            <span className="text-xs font-bold text-amber-600 uppercase">
              Total Vocabulary: {VOCABULARY_LIST.length} Words
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
                    isMastered
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-amber-50/50 border-amber-200'
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

      {/* TAB 3: Mascot Wardrobe */}
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
    </div>
  );
};
