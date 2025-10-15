'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AchievementPopup from './AchievementPopup';
import { ACHIEVEMENTS, checkAchievements, saveAchievements, AchievementData } from '../utils/achievements';

interface AchievementContextType {
  triggerAchievementCheck: (data: AchievementData) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}

interface AchievementProviderProps {
  children: ReactNode;
}

export default function AchievementProvider({ children }: AchievementProviderProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [pendingAchievements, setPendingAchievements] = useState<any[]>([]);

  const triggerAchievementCheck = (data: AchievementData) => {
    const newAchievements = checkAchievements(data);
    if (newAchievements.length > 0) {
      saveAchievements(newAchievements);
      setPendingAchievements(newAchievements);
      showNextAchievement();
    }
  };

  const showNextAchievement = () => {
    if (pendingAchievements.length > 0) {
      const achievement = ACHIEVEMENTS.find(a => a.id === pendingAchievements[0].id);
      if (achievement) {
        setCurrentAchievement(achievement);
        setShowPopup(true);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentAchievement(null);
    setPendingAchievements(prev => {
      const remaining = prev.slice(1);
      // Show next achievement after a delay if there are more
      if (remaining.length > 0) {
        setTimeout(() => {
          showNextAchievement();
        }, 500);
      }
      return remaining;
    });
  };

  return (
    <AchievementContext.Provider value={{ triggerAchievementCheck }}>
      {children}
      {showPopup && currentAchievement && (
        <AchievementPopup
          title={currentAchievement.title}
          description={currentAchievement.description}
          icon={currentAchievement.icon}
          onClose={handleClosePopup}
        />
      )}
    </AchievementContext.Provider>
  );
}
