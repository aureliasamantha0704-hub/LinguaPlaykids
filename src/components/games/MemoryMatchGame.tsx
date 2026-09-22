import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { VocabularyItem, TopicId, ActiveLanguage, GameSession } from '../../types';
import { getVocabularyByTopic } from '../../data/vocabulary';
import { sound } from '../../utils/sound';
import { updateWordProgress, recordGameSession } from '../../utils/storage';
import { GameResultsModal } from './GameResultsModal';

interface MemoryMatchGameProps {
  topicId: TopicId;
  activeLanguage: ActiveLanguage;
  childId: string;
  onBackToMap: () => void;
}

interface MemoryCard {
  cardId: string;
  vocabId: string;
  type: 'picture' | 'text';
  content: string; // Emoji or Word string
  subContent?: string; // Pinyin if zh
  isFlipped: boolean;
  isMatched: boolean;
  vocabItem: VocabularyItem;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  topicId,
  activeLanguage,
  childId,
  onBackToMap,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [totalPairs, setTotalPairs] = useState(4);
  const [movesCount, setMovesCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewedWords, setReviewedWords] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    initGame();
  }, [topicId, activeLanguage]);

  const initGame = () => {
    const list = getVocabularyByTopic(topicId);
    const selected = [...list].sort(() => 0.5 - Math.random()).slice(0, 4); // 4 pairs = 8 cards
    setTotalPairs(selected.length);
    setReviewedWords(selected);

    const generatedCards: MemoryCard[] = [];

    selected.forEach((item) => {
      // Card A: Picture Card
      generatedCards.push({
        cardId: `pic_${item.id}`,
        vocabId: item.id,
        type: 'picture',
        content: item.emoji,
        isFlipped: false,
        isMatched: false,
        vocabItem: item,
      });

      // Card B: Text Word Card
      generatedCards.push({
        cardId: `txt_${item.id}`,
        vocabId: item.id,
        type: 'text',
        content: activeLanguage === 'zh' ? item.chinese : item.english,
        subContent: activeLanguage === 'zh' ? item.pinyin : item.indonesian,
        isFlipped: false,
        isMatched: false,
        vocabItem: item,
      });
    });

    const shuffled = [...generatedCards].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setFlippedCardIds([]);
    setMatchedPairsCount(0);
    setMovesCount(0);
    setIsFinished(false);
    setIsProcessing(false);
  };

  const handleCardClick = (card: MemoryCard) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;
    sound.playClick();

    // Flip card
    const updatedCards = cards.map((c) => (c.cardId === card.cardId ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlippedIds = [...flippedCardIds, card.cardId];
    setFlippedCardIds(newFlippedIds);

    // Speak card content
    const textToSpeak = activeLanguage === 'zh' ? card.vocabItem.chinese : card.vocabItem.english;
    sound.speak(textToSpeak, activeLanguage, 0.85);

    if (newFlippedIds.length === 2) {
      setIsProcessing(true);
      setMovesCount((m) => m + 1);

      const firstCard = updatedCards.find((c) => c.cardId === newFlippedIds[0])!;
      const secondCard = updatedCards.find((c) => c.cardId === newFlippedIds[1])!;

      if (firstCard.vocabId === secondCard.vocabId) {
        // MATCH!
        sound.playCorrect();
        updateWordProgress(firstCard.vocabId, true);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.vocabId === firstCard.vocabId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCardIds([]);
          setIsProcessing(false);

          const newMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchedCount);

          if (newMatchedCount === totalPairs) {
            finishGame(movesCount + 1, totalPairs);
          }
        }, 600);
      } else {
        // NO MATCH
        sound.playWrong();
        updateWordProgress(firstCard.vocabId, false);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlippedIds.includes(c.cardId) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCardIds([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const finishGame = (finalMoves: number, totalPairsCount: number) => {
    setIsFinished(true);
    const stars = finalMoves <= totalPairsCount + 2 ? 3 : finalMoves <= totalPairsCount + 5 ? 2 : 1;
    const xp = 30 + stars * 10;
    const coins = 15;

    const session: GameSession = {
      id: `session_${Date.now()}`,
      childId,
      gameType: 'memory_match',
      language: activeLanguage,
      topicId,
      score: totalPairsCount,
      totalQuestions: totalPairsCount,
      xpEarned: xp,
      coinsEarned: coins,
      starsEarned: stars,
      accuracy: Math.round((totalPairsCount / finalMoves) * 100),
      timestamp: Date.now(),
    };

    recordGameSession(session);
  };

  if (isFinished) {
    const stars = movesCount <= totalPairs + 2 ? 3 : movesCount <= totalPairs + 5 ? 2 : 1;
    return (
      <GameResultsModal
        score={totalPairs}
        totalQuestions={totalPairs}
        xpEarned={30 + stars * 10}
        coinsEarned={15}
        starsEarned={stars}
        wordsReviewed={reviewedWords}
        onPlayAgain={initGame}
        onBackToMap={onBackToMap}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-purple-50 to-indigo-100 p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-purple-300 font-extrabold text-purple-900 shadow-sm hover:bg-purple-50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="bg-purple-100 border border-purple-300 text-purple-900 px-3 py-1 rounded-2xl text-xs font-black uppercase">
            Pairs: {matchedPairsCount} / {totalPairs}
          </span>
          <span className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-2xl text-xs font-black uppercase">
            Moves: {movesCount}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">Memory Match Challenge 🃏</h2>
        <p className="text-xs font-bold text-purple-700">Flip cards to find picture & word pairs!</p>
      </div>

      {/* Memory Cards Grid (8 cards = 4x2 or 2x4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto w-full">
        {cards.map((card) => {
          const isShow = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              disabled={card.isMatched}
              className={`h-36 sm:h-44 rounded-3xl border-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-3 text-center shadow-lg transform active:scale-95 ${
                isShow
                  ? card.isMatched
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-98 opacity-90'
                    : 'bg-white border-purple-400 text-purple-950'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-700 border-purple-300 hover:scale-105 hover:brightness-110'
              }`}
            >
              {isShow ? (
                <>
                  {card.type === 'picture' ? (
                    <span className="text-5xl sm:text-6xl">{card.content}</span>
                  ) : (
                    <div>
                      <span className="text-xl sm:text-2xl font-black block text-purple-900">{card.content}</span>
                      {card.subContent && (
                        <span className="text-xs font-bold text-rose-600 block mt-1">{card.subContent}</span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-4xl">🌟</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
