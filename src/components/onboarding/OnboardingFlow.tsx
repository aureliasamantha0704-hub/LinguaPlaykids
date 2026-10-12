import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, User, Globe, Smile } from 'lucide-react';
import { ChildProfile, Language } from '../../types';
import { MASCOTS } from '../../data/avatars';
import { sound } from '../../utils/sound';

interface OnboardingFlowProps {
  currentProfile: ChildProfile;
  onComplete: (updated: ChildProfile) => void;
  onBackToLanding?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  currentProfile,
  onComplete,
  onBackToLanding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [language, setLanguage] = useState<Language>(currentProfile.selectedLanguage);
  const [mascotId, setMascotId] = useState<string>(currentProfile.avatar.mascotId);
  const [nickname, setNickname] = useState<string>(currentProfile.nickname);

  const selectedMascotObj = MASCOTS.find((m) => m.id === mascotId) || MASCOTS[0];

  const handleFinish = () => {
    sound.playFanfare();
    const activeLang = language === 'zh' ? 'zh' : 'en';
    const updated: ChildProfile = {
      ...currentProfile,
      nickname: nickname.trim() || 'Hero Learner',
      selectedLanguage: language,
      activeLanguage: activeLang,
      avatar: {
        ...currentProfile.avatar,
        mascotId: mascotId,
        outfitColor: selectedMascotObj.color,
      },
    };
    onComplete(updated);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-amber-50/50 py-8 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-xl w-full shadow-2xl border-4 border-amber-300 relative">
        {/* Top Back to Landing Button */}
        {onBackToLanding && step === 1 && (
          <button
            onClick={() => {
              sound.playClick();
              onBackToLanding();
            }}
            className="mb-4 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home / Beranda</span>
          </button>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${
                  step === s
                    ? 'bg-amber-500 text-white border-amber-600 scale-110 shadow-md'
                    : step > s
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {step > s ? <Check className="w-5 h-5 stroke-[3]" /> : s}
              </div>
              {s < 3 && <div className={`w-12 sm:w-16 h-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Select Language */}
        {step === 1 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl border-2 border-amber-200">
              🌍
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">What languages do you want to learn?</h2>
            <p className="text-sm font-semibold text-gray-500 mb-6">Choose your language adventure pathway!</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => {
                  sound.playClick();
                  setLanguage('en');
                }}
                className={`p-5 rounded-3xl border-4 text-center cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-amber-100 border-amber-500 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-amber-300'
                }`}
              >
                <span className="text-4xl block mb-2">🇬🇧</span>
                <span className="font-black text-gray-800 text-base block">English</span>
                <span className="text-[11px] text-gray-500 font-bold block mt-1">Beginner & Fun</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setLanguage('zh');
                }}
                className={`p-5 rounded-3xl border-4 text-center cursor-pointer transition-all ${
                  language === 'zh'
                    ? 'bg-rose-100 border-rose-500 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-rose-300'
                }`}
              >
                <span className="text-4xl block mb-2">🇨🇳</span>
                <span className="font-black text-gray-800 text-base block">Mandarin</span>
                <span className="text-[11px] text-gray-500 font-bold block mt-1">Pinyin & Characters</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setLanguage('both');
                }}
                className={`p-5 rounded-3xl border-4 text-center cursor-pointer transition-all ${
                  language === 'both'
                    ? 'bg-purple-100 border-purple-500 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="text-4xl block mb-2">🌟</span>
                <span className="font-black text-gray-800 text-base block">Both!</span>
                <span className="text-[11px] text-purple-600 font-bold block mt-1">Switch Anytime</span>
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setStep(2);
              }}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-black text-lg rounded-2xl shadow-lg border-2 border-amber-600 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Choose Mascot</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Choose Mascot & Name */}
        {step === 2 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Pick your Explorer Mascot & Name!</h2>
            <p className="text-sm font-semibold text-gray-500 mb-6">Choose a mascot to guide you through mini games.</p>

            {/* Mascot Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
              {MASCOTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playClick();
                    setMascotId(m.id);
                  }}
                  className={`p-3 rounded-2xl border-3 text-center cursor-pointer transition-all ${
                    mascotId === m.id
                      ? 'bg-amber-100 border-amber-500 shadow-md scale-110'
                      : 'bg-gray-50 border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl block">{m.emoji}</span>
                </button>
              ))}
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 mb-6 flex items-center gap-3 text-left">
              <span className="text-4xl">{selectedMascotObj.emoji}</span>
              <div>
                <h4 className="font-black text-amber-900 text-base">{selectedMascotObj.name}</h4>
                <p className="text-xs text-amber-700 font-medium">{selectedMascotObj.description}</p>
              </div>
            </div>

            {/* Nickname Input */}
            <div className="mb-8 text-left">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Your Learner Nickname
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  placeholder="e.g. Leo Explorer"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-2xl font-black text-gray-800 text-base focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-200"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setStep(3);
                }}
                className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-white font-black text-lg rounded-2xl shadow-lg border-2 border-amber-600 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Next: Start Level</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm & Launch */}
        {step === 3 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl mx-auto mb-4 flex items-center justify-center text-5xl border-2 border-emerald-300">
              {selectedMascotObj.emoji}
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Ready to Start Your Adventure!</h2>
            <p className="text-sm font-semibold text-gray-600 mb-6">
              Welcome aboard, <span className="font-black text-amber-600">{nickname || 'Hero Learner'}</span>!
            </p>

            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200 text-left space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span className="text-sm font-bold text-gray-700">Language: {language.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span className="text-sm font-bold text-gray-700">Mascot: {selectedMascotObj.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span className="text-sm font-bold text-gray-700">Level: Beginner Start (+50 Welcome Coins 💰)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl rounded-2xl shadow-xl border-3 border-emerald-400 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6 animate-spin" />
                <span>Enter Game World!</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
