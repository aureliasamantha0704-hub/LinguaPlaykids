import React, { useState } from 'react';
import {
  Shield,
  Clock,
  Target,
  BarChart3,
  Award,
  Settings,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Volume2,
} from 'lucide-react';
import { ChildProfile, ParentSettings, GameSession } from '../../types';
import { loadGameSessions, loadWordProgress, getTodayLearningMinutes, saveParentSettings } from '../../utils/storage';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { sound } from '../../utils/sound';

interface ParentDashboardProps {
  profile: ChildProfile;
  settings: ParentSettings;
  onUpdateSettings: (updated: ParentSettings) => void;
  onResetProgress: () => void;
  onBackToGame: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  settings,
  onUpdateSettings,
  onResetProgress,
  onBackToGame,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  const sessions = loadGameSessions();
  const wordProgressMap = loadWordProgress();
  const todayMinutes = getTodayLearningMinutes();

  // Accuracy calculation
  const totalGames = sessions.length;
  const avgAccuracy =
    totalGames > 0
      ? Math.round(sessions.reduce((acc, curr) => acc + curr.accuracy, 0) / totalGames)
      : 100;

  // Mastered vs Needs Review words
  const masteredWords = Object.values(wordProgressMap).filter((w) => w.masteryScore >= 70);
  const reviewWords = Object.values(wordProgressMap).filter((w) => w.masteryScore < 50 && w.incorrectCount > 0);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-4 bg-purple-100 text-purple-700 rounded-2xl border border-purple-200">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Parent & Teacher Dashboard</h2>
            <p className="text-xs font-semibold text-slate-500">
              Monitoring progress for <span className="font-extrabold text-purple-700">{profile.nickname}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onBackToGame();
          }}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Child Game</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl max-w-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Learning Overview
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Settings & Safety
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-sky-600 text-xs font-bold mb-1">
                <Clock className="w-4 h-4" />
                <span>Today's Time</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{todayMinutes} min</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Goal: {settings.dailyGoalMinutes} min</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Games Completed</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{totalGames}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Total play sessions</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mb-1">
                <Target className="w-4 h-4" />
                <span>Accuracy</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{avgAccuracy}%</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Average correct answers</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-purple-600 text-xs font-bold mb-1">
                <Award className="w-4 h-4" />
                <span>Words Mastered</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{masteredWords.length}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Score ≥70%</p>
            </div>
          </div>

          {/* Recommended Review Area */}
          {reviewWords.length > 0 && (
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
              <h3 className="text-lg font-black text-amber-900 mb-2">Recommended Practice Words</h3>
              <p className="text-xs font-medium text-amber-800 mb-4">
                These words were missed recently and could benefit from extra review in mini games:
              </p>

              <div className="flex flex-wrap gap-2">
                {reviewWords.map((prog) => {
                  const item = VOCABULARY_LIST.find((v) => v.id === prog.wordId);
                  if (!item) return null;
                  return (
                    <span
                      key={item.id}
                      className="bg-white border border-amber-300 text-amber-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.english}</span>
                      <span className="text-rose-600">({item.chinese})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Session Logs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Recent Learning Sessions</h3>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-4">No completed game sessions yet. Play a game to see logs!</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 uppercase tracking-wider">
                        {s.gameType.replace('_', ' ')} — Topic: {s.topicId}
                      </p>
                      <p className="text-slate-400 text-[10px]">{new Date(s.timestamp).toLocaleString()}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">{s.accuracy}% Accuracy</span>
                      <span className="text-slate-400 text-[10px]">+{s.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900">App Controls & Safety</h3>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Daily Learning Goal (Minutes)
              </label>
              <select
                value={settings.dailyGoalMinutes}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const updated = { ...settings, dailyGoalMinutes: val };
                  onUpdateSettings(updated);
                  saveParentSettings(updated);
                }}
                className="w-full p-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes (Recommended)</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Pronunciation Speech Speed: {Math.round(settings.speechSpeed * 100)}%
              </label>
              <input
                type="range"
                min={0.6}
                max={1.0}
                step={0.05}
                value={settings.speechSpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const updated = { ...settings, speechSpeed: val };
                  onUpdateSettings(updated);
                  saveParentSettings(updated);
                }}
                className="w-full accent-purple-600"
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2">Reset Child Progress</h4>
              <p className="text-xs text-slate-500 mb-3 font-medium">
                Resets earned XP, stars, coins, and learned words back to beginner baseline.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset learning progress?')) {
                    onResetProgress();
                  }
                }}
                className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Child Progress</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
