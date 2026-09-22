import React, { useState, useEffect } from 'react';
import { Volume2, ArrowLeft, RotateCcw, Delete, Sparkles } from 'lucide-react';
import { VocabularyItem, TopicId, ActiveLanguage, GameSession } from '../../types';
import { getVocabularyByTopic } from '../../data/vocabulary';
import { sound } from '../../utils/sound';
import { updateWordProgress, recordGameSession } from '../../utils/storage';
import { GameResultsModal } from './GameResultsModal';

interface WordBuilderGameProps {
  topicId: TopicId;
  activeLanguage: ActiveLanguage;
  childId: string;
  speechSpeed: number;
  onBackToMap: () => void;
}

interface TileItem {
  id: string;
  char: string;
  used: boolean;
}

export const WordBuilderGame: React.FC<WordBuilderGameProps> = ({
  topicId,
  activeLanguage,
  childId,
  speechSpeed,
  onBackToMap,
}) => {
  const [questions, setQuestions] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<TileItem[]>([]);
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

  const targetWord = activeLanguage === 'zh'
    ? targetItem?.chinese
    : targetItem?.english.toUpperCase().replace(/\s+/g, '');

  useEffect(() => {
    if (!targetWord) return;

    // Create character tiles
    const chars = targetWord.split('');
    const tileList: TileItem[] = chars.map((char, index) => ({
      id: `tile_${index}_${char}`,
      char,
      used: false,
    }));

    // Shuffle tiles
    const shuffled = [...tileList].sort(() => 0.5 - Math.random());
    setTiles(shuffled);
    setSelectedTiles([]);
    setFeedback(null);

    // Speak word
    const textToSpeak = activeLanguage === 'zh' ? targetItem.chinese : targetItem.english;
    sound.speak(textToSpeak, activeLanguage, speechSpeed);
  }, [currentIndex, targetWord, targetItem, activeLanguage, speechSpeed]);

  const handleTileClick = (tile: TileItem) => {
    if (tile.used || feedback === 'correct') return;
    sound.playClick();

    const updatedTiles = tiles.map((t) => (t.id === tile.id ? { ...t, used: true } : t));
    const updatedSelected = [...selectedTiles, tile];

    setTiles(updatedTiles);
    setSelectedTiles(updatedSelected);

    // Check if word complete
    if (updatedSelected.length === targetWord?.length) {
      const assembled = updatedSelected.map((t) => t.char).join('');
      if (assembled === targetWord) {
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
    }
  };

  const handleRemoveTile = (tile: TileItem) => {
    if (feedback === 'correct') return;
    sound.playClick();

    const updatedSelected = selectedTiles.filter((t) => t.id !== tile.id);
    const updatedTiles = tiles.map((t) => (t.id === tile.id ? { ...t, used: false } : t));

    setSelectedTiles(updatedSelected);
    setTiles(updatedTiles);
    setFeedback(null);
  };

  const handleClearAll = () => {
    if (feedback === 'correct') return;
    sound.playClick();
    setSelectedTiles([]);
    setTiles(tiles.map((t) => ({ ...t, used: false })));
    setFeedback(null);
  };

  const handlePlayAudio = () => {
    if (!targetItem) return;
    const textToSpeak = activeLanguage === 'zh' ? targetItem.chinese : targetItem.english;
    sound.speak(textToSpeak, activeLanguage, speechSpeed);
  };

  const finishGame = (finalScore: number) => {
    setIsFinished(true);
    const xp = finalScore * 10 + 20;
    const coins = finalScore * 5;
    const stars = finalScore >= 4 ? 3 : finalScore >= 2 ? 2 : 1;

    const session: GameSession = {
      id: `session_${Date.now()}`,
      childId,
      gameType: 'word_builder',
      language: activeLanguage,
      topicId,
      score: finalScore,
      totalQuestions: questions.length,
      xpEarned: xp,
      coinsEarned: coins,
      starsEarned: stars,
      accuracy: Math.round((finalScore / questions.length) * 100),
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
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-emerald-50 to-teal-100 p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-emerald-300 font-extrabold text-emerald-900 shadow-sm hover:bg-emerald-50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit</span>
        </button>

        <div className="flex-1 max-w-xs bg-emerald-200/80 h-4 rounded-full border-2 border-emerald-300 overflow-hidden shadow-inner">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-emerald-500 text-white font-black px-4 py-1.5 rounded-2xl text-sm border-2 border-emerald-600 shadow-sm">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Picture & Hint Station Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-xl text-center mb-6 relative">
        <div className="inline-block bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-3">
          Word Builder Challenge 🧩
        </div>

        <div className="text-6xl sm:text-7xl mb-3 animate-bounce">{targetItem.emoji}</div>

        <p className="text-sm font-bold text-gray-500 mb-2">
          Meaning: <span className="font-black text-gray-800">{targetItem.indonesian}</span>
        </p>

        {activeLanguage === 'zh' && (
          <p className="text-base font-black text-rose-600 mb-3">Pinyin: {targetItem.pinyin}</p>
        )}

        <button
          onClick={handlePlayAudio}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-extrabold rounded-2xl text-xs shadow-md border-2 border-sky-600 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen Word</span>
        </button>
      </div>

      {/* Target Word Slots (Selected Tiles) */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border-4 border-emerald-300 shadow-lg text-center mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[60px] mb-4">
          {Array.from({ length: targetWord?.length || 0 }).map((_, idx) => {
            const tile = selectedTiles[idx];
            return (
              <button
                key={idx}
                onClick={() => tile && handleRemoveTile(tile)}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 flex items-center justify-center text-2xl font-black shadow-md transition-all ${
                  tile
                    ? 'bg-amber-400 border-amber-500 text-amber-950 scale-105 cursor-pointer hover:bg-amber-300'
                    : 'bg-emerald-50 border-dashed border-emerald-300 text-transparent'
                }`}
              >
                {tile ? tile.char : ''}
              </button>
            );
          })}
        </div>

        {selectedTiles.length > 0 && feedback !== 'correct' && (
          <button
            onClick={handleClearAll}
            className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer"
          >
            <Delete className="w-4 h-4" />
            <span>Clear Letters</span>
          </button>
        )}
      </div>

      {/* Scrambled Tile Bank */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => handleTileClick(tile)}
            disabled={tile.used}
            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 font-black text-2xl shadow-md cursor-pointer transition-all ${
              tile.used
                ? 'bg-gray-100 border-gray-200 text-gray-300 opacity-40 cursor-not-allowed'
                : 'bg-white border-emerald-400 text-emerald-950 hover:bg-emerald-100 hover:scale-105 active:scale-95'
            }`}
          >
            {tile.char}
          </button>
        ))}
      </div>

      {/* Feedback Bar */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-black text-base animate-in fade-in zoom-in-95 ${
            feedback === 'correct'
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-rose-500 text-white border-rose-600'
          }`}
        >
          {feedback === 'correct'
            ? '🎉 Perfect Builder! Word assembled correctly!'
            : 'Not quite! Tap letters to fix spelling.'}
        </div>
      )}
    </div>
  );
};
