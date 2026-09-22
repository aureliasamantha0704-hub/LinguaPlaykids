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
  switchProfileLanguage,
  isSessionActive,
  setSessionActive,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { sound } from './utils/sound';

import { Header } from './components/common/Header';
import { ParentGateModal } from './components/common/ParentGateModal';
import { LogoutModal } from './components/common/LogoutModal';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Game state
  const [activeTopicId, setActiveTopicId] = useState<TopicId>('animals');
  const [activeGameType, setActiveGameType] = useState<GameType>('picture_match');

  // Modals
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Load stored profile and settings on mount
  useEffect(() => {
    const loadedProf = loadChildProfile();
    const loadedSett = loadParentSettings();
    const active = isSessionActive();
    setProfile(loadedProf);
    setParentSettings(loadedSett);
    setIsAuthenticated(active);
  }, []);

  const handleUpdateProfile = (updated: ChildProfile) => {
    setProfile(updated);
    saveChildProfile(updated);
  };

  const handleSelectLanguage = (lang: ActiveLanguage) => {
    if (lang === profile.activeLanguage) return;
    const switched = switchProfileLanguage(profile, lang);
    setProfile({ ...switched });
  };

  const handleStartPlayFromLanding = () => {
    setSessionActive(true);
    setIsAuthenticated(true);
    if (profile.nickname === DEFAULT_PROFILE.nickname) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('world');
    }
  };

  const handleOnboardingComplete = (updatedProfile: ChildProfile) => {
    handleUpdateProfile(updatedProfile);
    setSessionActive(true);
    setIsAuthenticated(true);
    setCurrentView('world');
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setSessionActive(false);
    setIsAuthenticated(false);
    setCurrentView('landing');
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
    localStorage.removeItem('linguaplay_word_progress_en');
    localStorage.removeItem('linguaplay_word_progress_zh');
    localStorage.removeItem('linguaplay_word_progress');
    setSessionActive(false);
    setIsAuthenticated(false);
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

  // Guard protected views against unauthorized back button navigation after logout
  const renderCurrentView = () => {
    // Landing page is always viewable
    if (currentView === 'landing') {
      return (
        <LandingPage
          onStartPlay={handleStartPlayFromLanding}
          onOpenParentGate={() => setIsParentGateOpen(true)}
        />
      );
    }

    // Onboarding flow
    if (currentView === 'onboarding') {
      return (
        <OnboardingFlow
          currentProfile={profile}
          onComplete={handleOnboardingComplete}
          onBackToLanding={() => setCurrentView('landing')}
        />
      );
    }

    // Protected routes: if user is not authenticated, fallback to LandingPage
    if (!isAuthenticated) {
      return (
        <LandingPage
          onStartPlay={handleStartPlayFromLanding}
          onOpenParentGate={() => setIsParentGateOpen(true)}
        />
      );
    }

    // World map
    if (currentView === 'world') {
      return (
        <WorldMap
          profile={profile}
          onSelectTopicGame={handleSelectTopicGame}
          onCompleteDailyChallenge={handleCompleteDailyChallenge}
          onBackToLanding={() => setCurrentView('landing')}
        />
      );
    }

    // Game view
    if (currentView === 'game') {
      return (
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
      );
    }

    // Progress / Profile view
    if (currentView === 'progress') {
      return (
        <ChildProgressView
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onOpenShop={() => setIsShopOpen(true)}
          onBackToMap={() => setCurrentView('world')}
        />
      );
    }

    // Parent dashboard
    if (currentView === 'parent') {
      return (
        <ParentDashboard
          profile={profile}
          settings={parentSettings}
          onUpdateSettings={setParentSettings}
          onResetProgress={handleResetProgress}
          onBackToGame={() => setCurrentView('world')}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-amber-300">
      {/* Sticky Top Header */}
      {currentView !== 'landing' && currentView !== 'parent' && isAuthenticated && (
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
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="w-full">
        {renderCurrentView()}
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

      {/* Logout Confirmation Dialog */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />
    </div>
  );
}
