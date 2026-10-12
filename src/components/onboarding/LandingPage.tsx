import React from 'react';
import { Play, Sparkles, Shield, Heart, Volume2, Globe, Star, Award, CheckCircle } from 'lucide-react';
import { sound } from '../../utils/sound';

import { ChildProfile } from '../../types';
import { DEFAULT_PROFILE } from '../../utils/storage';
import { MASCOTS } from '../../data/avatars';

interface LandingPageProps {
  profile?: ChildProfile;
  onStartPlay: () => void;
  onStartNewAdventure?: () => void;
  onOpenParentGate: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  profile,
  onStartPlay,
  onStartNewAdventure,
  onOpenParentGate,
}) => {
  const hasCustomProfile = profile && profile.nickname !== DEFAULT_PROFILE.nickname;
  const currentMascot = profile ? (MASCOTS.find((m) => m.id === profile.avatar.mascotId) || MASCOTS[0]) : MASCOTS[0];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-amber-50 via-sky-50 to-purple-50 py-8 px-4 sm:px-8 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center py-6 sm:py-12">
        {/* Floating Mascot Badges */}
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-2 rounded-full text-amber-900 text-xs sm:text-sm font-black shadow-sm mb-6 animate-bounce">
          <span>🦁 Leo & 🐼 Mianmian • Aligned with CEFR (Pre-A1 to B1) & YCT 1–4 Standards 🌟</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Learn Languages By{' '}
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Playing Fun Games!
          </span>
        </h1>

        <p className="text-base sm:text-xl font-bold text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          The colorful English & Mandarin adventure web app for kids aged 6–12. Structured into 7 international proficiency levels with mini-games, diplomas, and rewards!
        </p>

        {/* Hero Character Card Visual */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
          <div className="p-4 sm:p-6 bg-white/80 backdrop-blur rounded-3xl border-4 border-amber-300 shadow-xl flex items-center gap-4 transform -rotate-2 hover:rotate-0 transition-transform">
            <span className="text-5xl sm:text-6xl">🦁</span>
            <div className="text-left">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">English</span>
              <p className="text-lg font-black text-gray-800">Apple 🍎</p>
              <p className="text-xs text-gray-500 font-bold">"I eat an apple."</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white/80 backdrop-blur rounded-3xl border-4 border-rose-300 shadow-xl flex items-center gap-4 transform rotate-2 hover:rotate-0 transition-transform">
            <span className="text-5xl sm:text-6xl">🐼</span>
            <div className="text-left">
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Mandarin</span>
              <p className="text-lg font-black text-gray-800">猫 <span className="text-xs font-semibold text-rose-600">māo</span> 🐱</p>
              <p className="text-xs text-gray-500 font-bold">Cat / Kucing</p>
            </div>
          </div>
        </div>

        {/* Main CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-12">
          {hasCustomProfile ? (
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => {
                  sound.playFanfare();
                  onStartPlay();
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xl rounded-3xl shadow-xl border-4 border-amber-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <span className="text-2xl">{currentMascot.emoji}</span>
                <span>Continue as {profile.nickname} (Lvl {profile.level})</span>
                <Play className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
              </button>

              {onStartNewAdventure && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onStartNewAdventure();
                  }}
                  className="text-xs font-black text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  Create New Child Profile / Setup Again 🔄
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playFanfare();
                onStartPlay();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xl rounded-3xl shadow-xl border-4 border-amber-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Play className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
              <span>Play Now! (Start Adventure)</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onOpenParentGate();
            }}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-gray-50 text-purple-700 font-black text-base rounded-3xl shadow-md border-3 border-purple-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5 text-purple-600" />
            <span>Parent & Teacher Access</span>
          </button>
        </div>

        {/* Key Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur p-4 rounded-2xl border-2 border-amber-200 text-center shadow-sm">
            <div className="text-3xl mb-1">🎮</div>
            <h4 className="font-black text-gray-800 text-sm">4 Mini Games</h4>
            <p className="text-xs text-gray-500 font-medium">Picture Match, Audio, Builder & Memory</p>
          </div>

          <div className="bg-white/70 backdrop-blur p-4 rounded-2xl border-2 border-emerald-200 text-center shadow-sm">
            <div className="text-3xl mb-1">📈</div>
            <h4 className="font-black text-gray-800 text-sm">7 Level Standards</h4>
            <p className="text-xs text-gray-500 font-medium">CEFR Pre-A1 to B1 & YCT 1–4 HSK Milestones</p>
          </div>

          <div className="bg-white/70 backdrop-blur p-4 rounded-2xl border-2 border-sky-200 text-center shadow-sm">
            <div className="text-3xl mb-1">📜</div>
            <h4 className="font-black text-gray-800 text-sm">Official Diplomas</h4>
            <p className="text-xs text-gray-500 font-medium">Accredited printable certificates of achievement</p>
          </div>

          <div className="bg-white/70 backdrop-blur p-4 rounded-2xl border-2 border-purple-200 text-center shadow-sm">
            <div className="text-3xl mb-1">🛡️</div>
            <h4 className="font-black text-gray-800 text-sm">Parent Dashboard</h4>
            <p className="text-xs text-gray-500 font-medium">Math gate, speech speed & progress tracking</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full border-t border-amber-200 pt-4 text-center text-xs text-gray-500 font-medium">
        <p>LinguaPlay Kids — Fun English & Mandarin Chinese Web Learning Game</p>
      </footer>
    </div>
  );
};
