import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Award, Coins, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { VocabularyItem } from '../../types';
import { sound } from '../../utils/sound';

interface GameResultsModalProps {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  coinsEarned: number;
  starsEarned: number;
  wordsReviewed: VocabularyItem[];
  onPlayAgain: () => void;
  onBackToMap: () => void;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  score,
  totalQuestions,
  xpEarned,
  coinsEarned,
  starsEarned,
  wordsReviewed,
  onPlayAgain,
  onBackToMap,
}) => {
  useEffect(() => {
    sound.playFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 relative text-center animate-in zoom-in-90 duration-300">
        {/* Celebration Header Emoji */}
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl mx-auto -mt-12 mb-3 flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce">
          🎉
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-1">Lesson Complete!</h2>
        <p className="text-sm font-bold text-gray-500 mb-6">Great effort! You are getting smarter every day!</p>

        {/* Stars Banner */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`p-3 rounded-2xl border-2 transition-all ${
                s <= starsEarned
                  ? 'bg-amber-100 border-amber-400 scale-110 shadow-md text-amber-500'
                  : 'bg-gray-100 border-gray-200 text-gray-300'
              }`}
            >
              <Star className={`w-8 h-8 ${s <= starsEarned ? 'fill-amber-400 text-amber-500' : ''}`} />
            </div>
          ))}
        </div>

        {/* Rewards Summary Box */}
        <div className="grid grid-cols-3 gap-3 bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 mb-6">
          <div>
            <span className="text-xs font-black text-amber-800 uppercase block">Score</span>
            <span className="text-xl font-black text-amber-900">{score}/{totalQuestions}</span>
          </div>
          <div className="border-x border-amber-200">
            <span className="text-xs font-black text-amber-800 uppercase block">XP Earned</span>
            <span className="text-xl font-black text-emerald-600">+{xpEarned} XP</span>
          </div>
          <div>
            <span className="text-xs font-black text-amber-800 uppercase block font-sans">Coins</span>
            <span className="text-xl font-black text-yellow-600">+{coinsEarned} 💰</span>
          </div>
        </div>

        {/* Words Mastered Quick List */}
        {wordsReviewed.length > 0 && (
          <div className="mb-6 text-left">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
              Words Reviewed ({wordsReviewed.length}):
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
              {wordsReviewed.map((item) => (
                <span
                  key={item.id}
                  className="bg-white border border-gray-300 text-gray-800 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <span>{item.emoji}</span>
                  <span>{item.english}</span>
                  <span className="text-rose-600 font-normal">({item.chinese})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-gray-300"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onBackToMap();
            }}
            className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-2xl shadow-lg border-2 border-amber-600 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>World Map</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
