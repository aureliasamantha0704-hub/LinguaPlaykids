import React, { useState } from 'react';
import { Play, Star, Flame, Trophy, Sparkles, Volume2, ArrowRight, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { ChildProfile, Topic, TopicId, GameType, ActiveLanguage } from '../../types';
import { TOPICS } from '../../data/vocabulary';
import { sound } from '../../utils/sound';

interface WorldMapProps {
  profile: ChildProfile;
  onSelectTopicGame: (topicId: TopicId, gameType: GameType) => void;
  onCompleteDailyChallenge: () => void;
  onBackToLanding?: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  profile,
  onSelectTopicGame,
  onCompleteDailyChallenge,
  onBackToLanding,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const activeLang: ActiveLanguage = profile.activeLanguage;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Back & Quick Action Navigation */}
        {onBackToLanding && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                sound.playClick();
                onBackToLanding();
              }}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-amber-900 font-extrabold text-xs sm:text-sm rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to Landing / Beranda</span>
            </button>
          </div>
        )}

        {/* Daily Challenge Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-4 sm:p-6 rounded-3xl text-white shadow-xl border-4 border-amber-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl border border-white/40 shadow-inner shrink-0">
              🌟
            </div>
            <div>
              <div className="inline-block bg-white/30 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                Daily Quest
              </div>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Play Any 2 Mini Games Today!
              </h3>
              <p className="text-xs sm:text-sm font-semibold opacity-90">
                Reward: <span className="font-extrabold text-yellow-200">+50 XP & +20 Coins 💰</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!profile.dailyChallengeCompleted) {
                sound.playFanfare();
                onCompleteDailyChallenge();
              }
            }}
            disabled={profile.dailyChallengeCompleted}
            className={`px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all shrink-0 cursor-pointer ${
              profile.dailyChallengeCompleted
                ? 'bg-emerald-600 text-white opacity-90 border-2 border-emerald-300'
                : 'bg-white text-orange-600 hover:bg-orange-50 active:scale-95 border-2 border-orange-300'
            }`}
          >
            {profile.dailyChallengeCompleted ? '✅ Quest Claimed!' : '⚡ Claim Daily Quest'}
          </button>
        </div>

        {/* World Map Section Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Select A Learning World 🗺️
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-600">
            Current Path:{' '}
            <span className="font-extrabold text-amber-600">
              {activeLang === 'zh' ? 'Mandarin Chinese 🇨🇳' : 'English 🇬🇧'}
            </span>
          </p>
        </div>

        {/* Interactive World Map Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic, index) => {
            const isUnlocked = index <= 6;
            return (
              <div
                key={topic.id}
                className={`group relative rounded-3xl border-4 p-6 shadow-lg transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-white hover:-translate-y-2 hover:shadow-2xl cursor-pointer border-amber-300'
                    : 'bg-gray-100 border-gray-300 opacity-60'
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    setSelectedTopic(topic);
                  }
                }}
              >
                {/* Topic Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${topic.bgGradient} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                    {topic.icon}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-black text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Topic {index + 1}</span>
                  </div>
                </div>

                {/* Topic Title */}
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  {activeLang === 'zh' ? `${topic.nameZh} (${topic.nameEn})` : topic.nameEn}
                </h3>
                <p className="text-xs font-bold text-gray-500 mb-6 leading-relaxed">
                  {topic.description}
                </p>

                {/* Action CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
                    4 Mini Games
                  </span>
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md group-hover:bg-amber-400 transition-colors">
                    <Play className="w-5 h-5 fill-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Selector Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 relative text-center animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedTopic(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-black text-xl p-2 cursor-pointer flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2.5 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${selectedTopic.bgGradient} mx-auto mb-3 flex items-center justify-center text-4xl shadow-md`}>
              {selectedTopic.icon}
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-1">
              {activeLang === 'zh' ? selectedTopic.nameZh : selectedTopic.nameEn}
            </h3>
            <p className="text-xs text-gray-500 font-bold mb-6">Choose a mini game to play now!</p>

            {/* 4 Mini Games Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Game 1: Picture Match */}
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTopicGame(selectedTopic.id, 'picture_match');
                  setSelectedTopic(null);
                }}
                className="p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-2xl text-left cursor-pointer active:scale-95 transition-all group"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🖼️</div>
                <h4 className="font-black text-amber-900 text-sm">Picture Match</h4>
                <p className="text-[10px] font-bold text-amber-700">Match word to correct image</p>
              </button>

              {/* Game 2: Listen & Choose */}
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTopicGame(selectedTopic.id, 'listen_choose');
                  setSelectedTopic(null);
                }}
                className="p-4 bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 rounded-2xl text-left cursor-pointer active:scale-95 transition-all group"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🔊</div>
                <h4 className="font-black text-sky-900 text-sm">Listen & Choose</h4>
                <p className="text-[10px] font-bold text-sky-700">Listen to pronunciation</p>
              </button>

              {/* Game 3: Word Builder */}
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTopicGame(selectedTopic.id, 'word_builder');
                  setSelectedTopic(null);
                }}
                className="p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-left cursor-pointer active:scale-95 transition-all group"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🧩</div>
                <h4 className="font-black text-emerald-900 text-sm">Word Builder</h4>
                <p className="text-[10px] font-bold text-emerald-700">Assemble spelling tiles</p>
              </button>

              {/* Game 4: Memory Match */}
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTopicGame(selectedTopic.id, 'memory_match');
                  setSelectedTopic(null);
                }}
                className="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-2xl text-left cursor-pointer active:scale-95 transition-all group"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🃏</div>
                <h4 className="font-black text-purple-900 text-sm">Memory Match</h4>
                <p className="text-[10px] font-bold text-purple-700">Flip card matching pairs</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
