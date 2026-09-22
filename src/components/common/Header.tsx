import React from 'react';
import { Volume2, VolumeX, Shield, ShoppingBag, Award, Sparkles, Flame, Coins, Star, ArrowLeft, LogOut } from 'lucide-react';
import { ChildProfile, ActiveLanguage } from '../../types';
import { sound } from '../../utils/sound';
import { MASCOTS } from '../../data/avatars';

interface HeaderProps {
  profile: ChildProfile;
  soundEnabled: boolean;
  currentView?: string;
  onToggleSound: () => void;
  onSelectLanguage: (lang: ActiveLanguage) => void;
  onOpenShop: () => void;
  onOpenProgress: () => void;
  onOpenParentGate: () => void;
  onGoHome: () => void;
  onBack?: () => void;
  onOpenLogoutModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  soundEnabled,
  currentView,
  onToggleSound,
  onSelectLanguage,
  onOpenShop,
  onOpenProgress,
  onOpenParentGate,
  onGoHome,
  onBack,
  onOpenLogoutModal,
}) => {
  const currentMascot = MASCOTS.find((m) => m.id === profile.avatar.mascotId) || MASCOTS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-200 px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Back / Home Buttons */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
              title="Kembali / Back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span>Back</span>
            </button>
          )}

          {/* Logo & Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:rotate-6 transition-transform">
              🌟
            </div>
            <div className="hidden min-[400px]:block">
              <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent leading-tight">
                LinguaPlay
              </h1>
              <p className="text-[9px] sm:text-[10px] font-extrabold text-amber-600 tracking-wider uppercase">
                Kids Learning
              </p>
            </div>
          </button>
        </div>

        {/* Center: Accessible Language Switcher (EN / ZH Switchable Anytime) */}
        <div className="flex bg-amber-100 p-1 rounded-2xl border-2 border-amber-300 shadow-inner">
          <button
            onClick={() => {
              sound.playClick();
              onSelectLanguage('en');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              profile.activeLanguage === 'en'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'text-amber-800 hover:bg-amber-200/60'
            }`}
            title="Switch learning to English 🇬🇧"
          >
            <span>🇬🇧</span>
            <span className="hidden sm:inline">English</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectLanguage('zh');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              profile.activeLanguage === 'zh'
                ? 'bg-rose-500 text-white shadow-md scale-105'
                : 'text-rose-800 hover:bg-rose-200/60'
            }`}
            title="Switch learning to Mandarin Chinese 🇨🇳"
          >
            <span>🇨🇳</span>
            <span className="hidden sm:inline">中文</span>
          </button>
        </div>

        {/* Right Stats & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Stats Bar */}
          <div className="hidden lg:flex items-center gap-2 bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
            {/* Streak */}
            <div className="flex items-center gap-1 text-orange-600" title="Daily Streak">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{profile.streakDays}d</span>
            </div>
            <div className="w-px h-4 bg-amber-200" />
            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-600" title="Total Stars">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{profile.stars}</span>
            </div>
            <div className="w-px h-4 bg-amber-200" />
            {/* Coins */}
            <div className="flex items-center gap-1 text-yellow-600" title="Coins">
              <Coins className="w-4 h-4 fill-yellow-400 text-yellow-600" />
              <span>{profile.coins}</span>
            </div>
          </div>

          {/* Avatar Profile / Level Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProgress();
            }}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border-2 border-teal-300"
            title="View Progress & Trophies"
          >
            <span className="text-xl sm:text-2xl leading-none">{currentMascot.emoji}</span>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black leading-tight max-w-[80px] truncate">{profile.nickname}</p>
              <p className="text-[10px] font-extrabold text-teal-100 uppercase">Lvl {profile.level}</p>
            </div>
            <Award className="w-4 h-4 text-teal-100 hidden sm:block" />
          </button>

          {/* Shop Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="p-2 sm:p-2.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 rounded-2xl shadow-md border-2 border-yellow-500 cursor-pointer active:scale-95 transition-all relative group"
            title="Avatar Shop & Wardrobe"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
              Shop
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sound.playClick();
            }}
            className="p-2 sm:p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-2xl border-2 border-sky-300 cursor-pointer active:scale-95 transition-all"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
          </button>

          {/* Parent Zone Protection Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenParentGate();
            }}
            className="p-2 sm:p-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-2xl border-2 border-purple-300 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
            title="Parent Area Settings"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-xs font-bold hidden lg:inline">Parents</span>
          </button>

          {/* Logout Button */}
          {onOpenLogoutModal && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenLogoutModal();
              }}
              className="p-2 sm:p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-2xl border-2 border-rose-300 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
              title="Log Out / Keluar"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
              <span className="text-xs font-bold hidden lg:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
