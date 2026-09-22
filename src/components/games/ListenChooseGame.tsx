import React, { useState, useEffect } from 'react';
import { Volume2, Volume1, ArrowLeft, RotateCcw } from 'lucide-react';
import { VocabularyItem, TopicId, ActiveLanguage, GameSession } from '../../types';
import { getVocabularyByTopic } from '../../data/vocabulary';
import { sound } from '../../utils/sound';
import { updateWordProgress, recordGameSession } from '../../utils/storage';
import { GameResultsModal } from './GameResultsModal';

interface ListenChooseGameProps {
  topicId: TopicId;
  activeLanguage: ActiveLanguage;
  childId: string;
  speechSpeed: number;
  onBackToMap: () => void;
}

export const ListenChooseGame: React.FC<ListenChooseGameProps> = ({
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
    const shuffled = [...list].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setReviewedWords([]);
  }, [topicId]);

  const targetItem = questions[currentIndex];

  useEffect(() => {
    if (!targetItem) return;
    const topicPool = getVocabularyByTopic(topicId);
    const distractors = topicPool
      .filter((v) => v.id !== targetItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3); // 4 choices total

    const merged = [targetItem, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(merged);
    setSelectedOptionId(null);
    setFeedback(null);

    // Auto play target speech
    const textToSpeak = activeLanguage === 'zh' ? targetItem.chinese : targetItem.english;
    sound.speak(textToSpeak, activeLanguage, speechSpeed);
  }, [currentIndex, targetItem, topicId, activeLanguage, speechSpeed]);

  const handlePlayAudio = (slow = false) => {
    if (!targetItem) return;
    const textToSpeak = activeLanguage === 'zh' ? targetItem.chinese : targetItem.english;
    sound.speak(textToSpeak, activeLanguage, slow ? 0.6 : speechSpeed);
  };

  const handleSelectOption = (item: VocabularyItem) => {
    if (feedback === 'correct') return;
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
    const xp = finalScore * 10 + 20;
    const coins = finalScore * 5;
    const stars = finalScore >= 4 ? 3 : finalScore >= 2 ? 2 : 1;
    const accuracy = Math.round((finalScore / questions.length) * 100);

    const session: GameSession = {
      id: `session_${Date.now()}`,
      childId,
      gameType: 'listen_choose',
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
    return (
      <GameResultsModal
        score={score}
        totalQuestions={questions.length}
        xpEarned={score * 10 + 20}
        coinsEarned={score * 5}
        starsEarned={score >= 4 ? 3 : score >= 2 ? 2 : 1}
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

  if (!targetItem) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-blue-100 p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-sky-300 font-extrabold text-sky-900 shadow-sm hover:bg-sky-50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit</span>
        </button>

        <div className="flex-1 max-w-xs bg-sky-200/80 h-4 rounded-full border-2 border-sky-300 overflow-hidden shadow-inner">
          <div
            className="bg-sky-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-sky-500 text-white font-black px-4 py-1.5 rounded-2xl text-sm border-2 border-sky-600 shadow-sm">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Audio Listening Station Card */}
      <div className="bg-white rounded-3xl p-8 border-4 border-sky-300 shadow-xl text-center mb-6">
        <div className="inline-block bg-sky-100 text-sky-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-4">
          Listen & Choose Challenge
        </div>

        <p className="text-base font-extrabold text-gray-700 mb-6">
          Listen closely to the audio. Which picture matches the sound?
        </p>

        {/* Big Audio Speaker Trigger */}
        <div className="flex flex-col items-center justify-center gap-4 mb-2">
          <button
            onClick={() => handlePlayAudio(false)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center text-5xl shadow-xl hover:scale-105 active:scale-95 transition-transform border-4 border-sky-200 cursor-pointer group"
          >
            <Volume2 className="w-12 h-12 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handlePlayAudio(false)}
              className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold rounded-2xl text-xs cursor-pointer"
            >
              🔊 Replay Sound
            </button>
            <button
              onClick={() => handlePlayAudio(true)}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-2xl text-xs cursor-pointer"
            >
              🐢 Slow Sound
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((item) => {
          const isSelected = selectedOptionId === item.id;

          let cardStyle = 'bg-white border-sky-200 hover:border-sky-400 hover:scale-102';
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
              className={`p-5 rounded-3xl border-4 text-center cursor-pointer transition-all shadow-md flex flex-col items-center justify-center ${cardStyle}`}
            >
              <span className="text-5xl sm:text-6xl block mb-2">{item.emoji}</span>
              <span className="font-extrabold text-gray-800 text-sm">{item.english}</span>
              {feedback === 'correct' && isSelected && (
                <span className="text-xs font-black text-emerald-600 mt-1">
                  {activeLanguage === 'zh' ? item.chinese : item.english}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-black text-base animate-in fade-in zoom-in-95 ${
            feedback === 'correct'
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-rose-500 text-white border-rose-600'
          }`}
        >
          {feedback === 'correct' ? '🎉 Great ears! That is the right match!' : 'Listen again and give it another try! 🐱'}
        </div>
      )}
    </div>
  );
};
