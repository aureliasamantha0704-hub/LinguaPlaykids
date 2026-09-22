import React, { useState, useEffect } from 'react';
import { Volume2, Volume1, ArrowLeft, RotateCcw, Check, X, Sparkles } from 'lucide-react';
import { VocabularyItem, TopicId, ActiveLanguage, GameSession } from '../../types';
import { getVocabularyByTopic, getRandomVocabulary } from '../../data/vocabulary';
import { sound } from '../../utils/sound';
import { updateWordProgress, recordGameSession } from '../../utils/storage';
import { GameResultsModal } from './GameResultsModal';

interface PictureMatchGameProps {
  topicId: TopicId;
  activeLanguage: ActiveLanguage;
  childId: string;
  speechSpeed: number;
  onBackToMap: () => void;
}

export const PictureMatchGame: React.FC<PictureMatchGameProps> = ({
  topicId,
  activeLanguage,
  childId,
  speechSpeed,
  onBackToMap,
}) => {
  const [questions, setQuestions] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewedWords, setReviewedWords] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    const list = getVocabularyByTopic(topicId);
    const shuffled = [...list].sort(() => 0.5 - Math.random()).slice(0, 5); // 5 questions per round
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setReviewedWords([]);
  }, [topicId]);

  const targetItem = questions[currentIndex];

  useEffect(() => {
    if (!targetItem) return;
    // Generate 3 options (1 target + 2 distractors)
    const topicPool = getVocabularyByTopic(topicId);
    const distractors = topicPool
      .filter((v) => v.id !== targetItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const merged = [targetItem, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(merged);
    setSelectedOptionId(null);
    setFeedback(null);

    // Auto play target sound on question load
    const textToSpeak = activeLanguage === 'zh' ? targetItem.chinese : targetItem.english;
    sound.speak(textToSpeak, activeLanguage, speechSpeed);
  }, [currentIndex, targetItem, topicId, activeLanguage, speechSpeed]);

  if (!targetItem && !isFinished) {
    return <div className="p-8 text-center text-lg font-bold">Loading Game...</div>;
  }

  const handlePlayAudio = (slow = false) => {
    if (!targetItem) return;
    const textToSpeak = activeLanguage === 'zh' ? targetItem.chinese : targetItem.english;
    sound.speak(textToSpeak, activeLanguage, slow ? 0.6 : speechSpeed);
  };

  const handleSelectOption = (item: VocabularyItem) => {
    if (feedback === 'correct') return; // Prevent double click when already correct
    setSelectedOptionId(item.id);

    if (item.id === targetItem.id) {
      sound.playCorrect();
      setFeedback('correct');
      setScore((s) => s + 1);
      updateWordProgress(targetItem.id, true);

      if (!reviewedWords.some((w) => w.id === targetItem.id)) {
        setReviewedWords((prev) => [...prev, targetItem]);
      }

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
        } else {
          finishGame(score + 1);
        }
      }, 1200);
    } else {
      sound.playWrong();
      setFeedback('incorrect');
      updateWordProgress(targetItem.id, false);
    }
  };

  const finishGame = (finalScore: number) => {
    setIsFinished(true);
    const xp = finalScore * 10 + 20; // 20 bonus for completing
    const coins = finalScore * 5;
    const stars = finalScore >= 4 ? 3 : finalScore >= 2 ? 2 : 1;
    const accuracy = Math.round((finalScore / questions.length) * 100);

    const session: GameSession = {
      id: `session_${Date.now()}`,
      childId,
      gameType: 'picture_match',
      language: activeLanguage,
      topicId,
      score: finalScore,
      totalQuestions: questions.length,
      xpEarned: xp,
      coinsEarned: coins,
      starsEarned: stars,
      accuracy,
      timestamp: Date.now(),
    };

    recordGameSession(session);
  };

  if (isFinished) {
    const finalStars = score >= 4 ? 3 : score >= 2 ? 2 : 1;
    return (
      <GameResultsModal
        score={score}
        totalQuestions={questions.length}
        xpEarned={score * 10 + 20}
        coinsEarned={score * 5}
        starsEarned={finalStars}
        wordsReviewed={reviewedWords}
        onPlayAgain={() => {
          const list = getVocabularyByTopic(topicId);
          const shuffled = [...list].sort(() => 0.5 - Math.random()).slice(0, 5);
          setQuestions(shuffled);
          setCurrentIndex(0);
          setScore(0);
          setIsFinished(false);
          setReviewedWords([]);
        }}
        onBackToMap={onBackToMap}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-amber-50 to-orange-100 p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-amber-300 font-extrabold text-amber-900 shadow-sm hover:bg-amber-50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit</span>
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs bg-amber-200/80 h-4 rounded-full border-2 border-amber-300 overflow-hidden shadow-inner">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-amber-500 text-white font-black px-4 py-1.5 rounded-2xl text-sm border-2 border-amber-600 shadow-sm">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Target Word Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl text-center mb-6 relative">
        <div className="inline-block bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-3">
          Picture Match Challenge
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
          {activeLanguage === 'zh' ? targetItem.chinese : targetItem.english}
        </h2>

        {activeLanguage === 'zh' && (
          <p className="text-lg font-black text-rose-600 mb-1">
            pinyin: <span className="underline">{targetItem.pinyin}</span>
          </p>
        )}

        <p className="text-xs font-bold text-gray-400 mb-4">
          Meaning: {targetItem.indonesian} ({targetItem.english})
        </p>

        {/* Audio Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handlePlayAudio(false)}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-extrabold rounded-2xl shadow-md border-2 border-sky-600 cursor-pointer active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <Volume2 className="w-5 h-5" />
            <span>Listen 🔊</span>
          </button>

          <button
            onClick={() => handlePlayAudio(true)}
            className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-2xl border-2 border-amber-300 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 text-xs"
            title="Slow Speech"
          >
            <span>🐢 Slow Speech</span>
          </button>
        </div>
      </div>

      {/* Options Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {options.map((item) => {
          const isSelected = selectedOptionId === item.id;
          const isTarget = item.id === targetItem.id;

          let cardStyle = 'bg-white border-amber-200 hover:border-amber-400 hover:scale-102';
          if (isSelected) {
            if (feedback === 'correct') {
              cardStyle = 'bg-emerald-100 border-emerald-500 scale-105 shadow-xl';
            } else if (feedback === 'incorrect') {
              cardStyle = 'bg-rose-100 border-rose-500 animate-shake';
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSelectOption(item)}
              className={`p-6 rounded-3xl border-4 text-center cursor-pointer transition-all shadow-md flex flex-col items-center justify-center ${cardStyle}`}
            >
              <span className="text-6xl sm:text-7xl block mb-3">{item.emoji}</span>
              <span className="font-extrabold text-gray-700 text-sm">{item.english}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Alert Bar */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-black text-base animate-in fade-in zoom-in-95 ${
            feedback === 'correct'
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-rose-500 text-white border-rose-600'
          }`}
        >
          {feedback === 'correct' ? (
            <span>🎉 Excellent! That is correct!</span>
          ) : (
            <span>Try again! You can do it! 🐱</span>
          )}
        </div>
      )}
    </div>
  );
};
