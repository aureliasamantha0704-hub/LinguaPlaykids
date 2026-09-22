/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChildProfile,
  TopicId,
  GameType,
  ActiveLanguage,
  ParentSettings,
} from './types';
import {
  loadChildProfile,
  saveChildProfile,
  loadParentSettings,
  saveParentSettings,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { sound } from './utils/sound';

import { Header } from './components/common/Header';
import { ParentGateModal } from './components/common/ParentGateModal';
import { LandingPage } from './components/onboarding/LandingPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { WorldMap } from './components/world/WorldMap';
import { PictureMatchGame } from './components/games/PictureMatchGame';
import { ListenChooseGame } from './components/games/ListenChooseGame';
import { WordBuilderGame } from './components/games/WordBuilderGame';
import { MemoryMatchGame } from './components/games/MemoryMatchGame';
import { ChildProgressView } from './components/profile/ChildProgressView';
import { AvatarShopModal } from './components/shop/AvatarShopModal';
import { ParentDashboard } from './components/parent/ParentDashboard';

type ViewMode = 'landing' | 'onboarding' | 'world' | 'game' | 'progress' | 'parent';

export default function App() {
  const [profile, setProfile] = useState<ChildProfile>(DEFAULT_PROFILE);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(DEFAULT_SETTINGS);
  const [currentView, setCurrentView] = useState<ViewMode>('landing');

  // Game state
  const [activeTopicId, setActiveTopicId] = useState<TopicId>('animals');
  const [activeGameType, setActiveGameType] = useState<GameType>('picture_match');

  // Modals
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // Load stored profile and settings on mount
  useEffect(() => {
    const loadedProf = loadChildProfile();
    const loadedSett = loadParentSettings();
    setProfile(loadedProf);
    setParentSettings(loadedSett);
  }, []);

  const handleUpdateProfile = (updated: ChildProfile) => {
    setProfile(updated);
    saveChildProfile(updated);
  };

  const handleSelectLanguage = (lang: ActiveLanguage) => {
    const updated = { ...profile, activeLanguage: lang };
    handleUpdateProfile(updated);
  };

  const handleStartPlayFromLanding = () => {
    if (profile.nickname === DEFAULT_PROFILE.nickname) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('world');
    }
  };

  const handleOnboardingComplete = (updatedProfile: ChildProfile) => {
    handleUpdateProfile(updatedProfile);
    setCurrentView('world');
  };

  const handleSelectTopicGame = (topicId: TopicId, gameType: GameType) => {
    setActiveTopicId(topicId);
    setActiveGameType(gameType);
    setCurrentView('game');
  };

  const handleCompleteDailyChallenge = () => {
    const updated: ChildProfile = {
      ...profile,
      xp: profile.xp + 50,
      coins: profile.coins + 20,
      dailyChallengeCompleted: true,
      dailyChallengeDate: new Date().toISOString().split('T')[0],
    };
    handleUpdateProfile(updated);
  };

  const handleResetProgress = () => {
    const reset = { ...DEFAULT_PROFILE };
    setProfile(reset);
    saveChildProfile(reset);
    localStorage.removeItem('linguaplay_game_sessions');
    localStorage.removeItem('linguaplay_word_progress');
    setCurrentView('landing');
  };

  const getHeaderBackHandler = () => {
    if (currentView === 'game' || currentView === 'progress') {
      return () => setCurrentView('world');
    }
    if (currentView === 'world' || currentView === 'onboarding') {
      return () => setCurrentView('landing');
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-amber-300">
      {/* Sticky Top Header */}
      {currentView !== 'landing' && currentView !== 'parent' && (
        <Header
          profile={profile}
          soundEnabled={parentSettings.soundEnabled}
          currentView={currentView}
          onToggleSound={() => {
            const updated = { ...parentSettings, soundEnabled: !parentSettings.soundEnabled };
            setParentSettings(updated);
            saveParentSettings(updated);
          }}
          onSelectLanguage={handleSelectLanguage}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenProgress={() => setCurrentView('progress')}
          onOpenParentGate={() => setIsParentGateOpen(true)}
          onGoHome={() => setCurrentView('world')}
          onBack={getHeaderBackHandler()}
        />
      )}

      {/* Main View Router */}
      <main className="w-full">
        {currentView === 'landing' && (
          <LandingPage
            onStartPlay={handleStartPlayFromLanding}
            onOpenParentGate={() => setIsParentGateOpen(true)}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingFlow
            currentProfile={profile}
            onComplete={handleOnboardingComplete}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'world' && (
          <WorldMap
            profile={profile}
            onSelectTopicGame={handleSelectTopicGame}
            onCompleteDailyChallenge={handleCompleteDailyChallenge}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'game' && (
          <>
            {activeGameType === 'picture_match' && (
              <PictureMatchGame
                topicId={activeTopicId}
                activeLanguage={profile.activeLanguage}
                childId={profile.id}
                speechSpeed={parentSettings.speechSpeed}
                onBackToMap={() => setCurrentView('world')}
              />
            )}

            {activeGameType === 'listen_choose' && (
              <ListenChooseGame
                topicId={activeTopicId}
                activeLanguage={profile.activeLanguage}
                childId={profile.id}
                speechSpeed={parentSettings.speechSpeed}
                onBackToMap={() => setCurrentView('world')}
              />
            )}

            {activeGameType === 'word_builder' && (
              <WordBuilderGame
                topicId={activeTopicId}
                activeLanguage={profile.activeLanguage}
                childId={profile.id}
                speechSpeed={parentSettings.speechSpeed}
                onBackToMap={() => setCurrentView('world')}
              />
            )}

            {activeGameType === 'memory_match' && (
              <MemoryMatchGame
                topicId={activeTopicId}
                activeLanguage={profile.activeLanguage}
                childId={profile.id}
                onBackToMap={() => setCurrentView('world')}
              />
            )}
          </>
        )}

        {currentView === 'progress' && (
          <ChildProgressView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenShop={() => setIsShopOpen(true)}
            onBackToMap={() => setCurrentView('world')}
          />
        )}

        {currentView === 'parent' && (
          <ParentDashboard
            profile={profile}
            settings={parentSettings}
            onUpdateSettings={setParentSettings}
            onResetProgress={handleResetProgress}
            onBackToGame={() => setCurrentView('world')}
          />
        )}
      </main>

      {/* Parent Gate Protection Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => setCurrentView('parent')}
      />

      {/* Avatar Shop Store Modal */}
      <AvatarShopModal
        isOpen={isShopOpen}
        profile={profile}
        onClose={() => setIsShopOpen(false)}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
