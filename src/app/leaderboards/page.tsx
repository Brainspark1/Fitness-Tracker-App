'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import LoadingSkeleton from '../components/LoadingSkeleton';

interface UserStats {
  id: string;
  name: string;
  totalWorkouts: number;
  totalWeight: number;
  totalCalories: number;
  streak: number;
}

interface Workout {
  weight: number;
  sets: number;
  reps: number;
  date: string;
}

interface Meal {
  calories: number;
}

export default function Leaderboards() {
  const [leaderboards, setLeaderboards] = useState<UserStats[]>([]);
  const [currentUser, setCurrentUser] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate leaderboard data - in a real app, this would come from an API
      const mockData: UserStats[] = [
        { id: '1', name: 'Alex Johnson', totalWorkouts: 45, totalWeight: 12500, totalCalories: 8500, streak: 12 },
        { id: '2', name: 'Sarah Chen', totalWorkouts: 42, totalWeight: 11800, totalCalories: 9200, streak: 8 },
        { id: '3', name: 'Mike Rodriguez', totalWorkouts: 38, totalWeight: 15200, totalCalories: 7800, streak: 15 },
        { id: '4', name: 'Emma Davis', totalWorkouts: 35, totalWeight: 9800, totalCalories: 10200, streak: 6 },
        { id: '5', name: 'James Wilson', totalWorkouts: 32, totalWeight: 13600, totalCalories: 8900, streak: 10 },
      ];

      // Get current user's stats from localStorage
      const savedWorkouts = localStorage.getItem('workouts');
      const savedMeals = localStorage.getItem('meals');
      const savedProfile = localStorage.getItem('profile');

      let userName = 'You';
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        userName = profile.name || 'You';
      }

      const workouts = savedWorkouts ? JSON.parse(savedWorkouts) : [];
      const meals = savedMeals ? JSON.parse(savedMeals) : [];

      const userStats: UserStats = {
        id: 'current',
        name: userName,
        totalWorkouts: workouts.length,
        totalWeight: workouts.reduce((sum: number, w: Workout) => sum + (w.weight * w.sets * w.reps), 0),
        totalCalories: meals.reduce((sum: number, m: Meal) => sum + m.calories, 0),
        streak: calculateStreak(workouts),
      };

      setCurrentUser(userStats);

      // Add current user to leaderboard and sort
      const allUsers = [...mockData, userStats].sort((a, b) => b.totalWorkouts - a.totalWorkouts);
      setLeaderboards(allUsers);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const calculateStreak = (workouts: Workout[]) => {
    // Simple streak calculation - consecutive days with workouts
    if (workouts.length === 0) return 0;

    const dates = workouts.map(w => w.date).sort();
    let streak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays === 1) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return streak;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-8">Leaderboards</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Leaderboard */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">🏆 Overall Leaderboard</h3>
            <div className="space-y-3">
              {leaderboards.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.id === 'current' ? 'bg-green-900 border-2 border-green-500' : 'bg-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold">{getRankIcon(index)}</span>
                    <div>
                      <p className={`font-medium ${user.id === 'current' ? 'text-green-300' : 'text-white'}`}>
                        {user.name} {user.id === 'current' && '(You)'}
                      </p>
                      <p className="text-sm text-gray-300">{user.totalWorkouts} workouts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.totalWeight.toFixed(0)} lbs</p>
                    <p className="text-xs text-gray-300">total lifted</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streaks Leaderboard */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">🔥 Streak Leaderboard</h3>
            <div className="space-y-3">
              {[...leaderboards]
                .sort((a, b) => b.streak - a.streak)
                .map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.id === 'current' ? 'bg-green-900 border-2 border-green-500' : 'bg-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold">{getRankIcon(index)}</span>
                    <div>
                      <p className={`font-medium ${user.id === 'current' ? 'text-green-300' : 'text-white'}`}>
                        {user.name} {user.id === 'current' && '(You)'}
                      </p>
                      <p className="text-sm text-gray-300">{user.streak} day streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.totalWorkouts}</p>
                    <p className="text-xs text-gray-300">workouts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Leaderboard */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">🥗 Nutrition Leaderboard</h3>
            <div className="space-y-3">
              {[...leaderboards]
                .sort((a, b) => b.totalCalories - a.totalCalories)
                .map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.id === 'current' ? 'bg-green-900 border-2 border-green-500' : 'bg-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold">{getRankIcon(index)}</span>
                    <div>
                      <p className={`font-medium ${user.id === 'current' ? 'text-green-300' : 'text-white'}`}>
                        {user.name} {user.id === 'current' && '(You)'}
                      </p>
                      <p className="text-sm text-gray-300">{user.totalCalories} calories tracked</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.totalWorkouts}</p>
                    <p className="text-xs text-gray-300">meals logged</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Stats */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Your Stats</h3>
            {currentUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-900 rounded-lg border border-green-700">
                    <p className="text-2xl font-bold text-green-400">{currentUser.totalWorkouts}</p>
                    <p className="text-sm text-gray-300">Workouts</p>
                  </div>
                  <div className="text-center p-3 bg-green-900 rounded-lg border border-green-700">
                    <p className="text-2xl font-bold text-green-300">{currentUser.streak}</p>
                    <p className="text-sm text-gray-300">Day Streak</p>
                  </div>
                  <div className="text-center p-3 bg-green-900 rounded-lg border border-green-700">
                    <p className="text-2xl font-bold text-green-300">{currentUser.totalWeight.toFixed(0)}</p>
                    <p className="text-sm text-gray-300">lbs Lifted</p>
                  </div>
                  <div className="text-center p-3 bg-green-900 rounded-lg border border-green-700">
                    <p className="text-2xl font-bold text-green-300">{currentUser.totalCalories}</p>
                    <p className="text-sm text-gray-300">Calories</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-300 text-center">
                    Keep logging workouts and meals to climb the leaderboards!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
