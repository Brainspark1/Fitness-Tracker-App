'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from './components/Header';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Profile {
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
}

interface Workout {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const pathname = usePathname(); // 👈 Get current path

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Show popup 5 seconds after visiting if no profile is set
      const timer = setTimeout(() => {
        setShowProfilePopup(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }

    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  // 👇 Helper to style links dynamically
  const linkClass = (path: string) =>
    `text-green-400 hover:text-green-300 ${
      pathname === path ? "font-bold text-green-300" : ""
    }`;

  // Calculate workout progress for charts
  const workoutProgress = workouts.reduce((acc, workout) => {
    const date = workout.date;
    if (!acc[date]) {
      acc[date] = { totalWeight: 0, exercises: new Set() };
    }
    acc[date].totalWeight += workout.weight * workout.sets * workout.reps;
    acc[date].exercises.add(workout.exercise);
    return acc;
  }, {} as Record<string, { totalWeight: number; exercises: Set<string> }>);

  const workoutDates = Object.keys(workoutProgress).sort();

  // Calculate diet progress for charts
  const dietProgress = meals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) {
      acc[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    acc[date].calories += meal.calories;
    acc[date].protein += meal.protein;
    acc[date].carbs += meal.carbs;
    acc[date].fat += meal.fat;
    return acc;
  }, {} as Record<string, { calories: number; protein: number; carbs: number; fat: number }>);

  const dietDates = Object.keys(dietProgress).sort();

  // Chart data
  const workoutChartData = {
    labels: workoutDates.slice(-7), // Last 7 days
    datasets: [
      {
        label: 'Total Weight Lifted (lbs)',
        data: workoutDates.slice(-7).map(date => workoutProgress[date].totalWeight),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const dietChartData = {
    labels: dietDates.slice(-7), // Last 7 days
    datasets: [
      {
        label: 'Calories',
        data: dietDates.slice(-7).map(date => dietProgress[date].calories),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          meals.reduce((sum, m) => sum + m.protein, 0),
          meals.reduce((sum, m) => sum + m.carbs, 0),
          meals.reduce((sum, m) => sum + m.fat, 0),
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      {/* Profile Setup Popup */}
      {showProfilePopup && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 flex justify-between items-center">
          <div>
            <p className="font-semibold">Welcome! Set up your profile to get started.</p>
            <p className="text-sm">This will help personalize your fitness tracking experience.</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/profile"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 font-medium"
              onClick={() => setShowProfilePopup(false)}
            >
              Set Profile
            </Link>
            <button
              onClick={() => setShowProfilePopup(false)}
              className="text-white hover:text-gray-200 px-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingTop: showProfilePopup ? '5rem' : '3rem' }}>
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            {profile?.name
              ? `Hi ${profile.name}!`
              : "Welcome to Your Fitness Journey"}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Track your workouts, monitor your diet, and visualize your progress.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {/* Workouts */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Log Workouts</h3>
              <p className="text-gray-300">Record your exercises, sets, reps, and weights.</p>
              <Link href="/workouts" className="mt-4 inline-block text-green-400 hover:text-green-300">
                Get Started →
              </Link>
            </div>

            {/* Diet */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Track Diet</h3>
              <p className="text-gray-300">Log your meals and monitor your nutrition.</p>
              <Link href="/diet" className="mt-4 inline-block text-green-400 hover:text-green-300">
                Get Started →
              </Link>
            </div>

            {/* Progress */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">View Progress</h3>
              <p className="text-gray-300">See charts and graphs of your fitness journey.</p>
              <Link href="/progress" className="mt-4 inline-block text-green-400 hover:text-green-300">
                Get Started →
              </Link>
            </div>

            {/* Profile */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Manage Profile</h3>
              <p className="text-gray-300">Set goals and update your personal information.</p>
              <Link href="/profile" className="mt-4 inline-block text-green-400 hover:text-green-300">
                Get Started →
              </Link>
            </div>

            {/* Leaderboards */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Leaderboards</h3>
              <p className="text-gray-300">Compete with others and track your ranking.</p>
              <Link href="/leaderboards" className="mt-4 inline-block text-green-400 hover:text-green-300">
                View Rankings →
              </Link>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-8">Your Progress Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Workout Progress Chart */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Workout Progress</h4>
                <Line
                  data={workoutChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: {
                          color: 'white',
                        },
                      },
                      title: {
                        display: true,
                        text: 'Weight Lifted Over Time',
                        color: 'white',
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: 'white',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                      y: {
                        ticks: {
                          color: 'white',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Diet Progress Chart */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Calorie Intake</h4>
                <Bar
                  data={dietChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: {
                          color: 'white',
                        },
                      },
                      title: {
                        display: true,
                        text: 'Daily Calories',
                        color: 'white',
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: 'white',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                      y: {
                        ticks: {
                          color: 'white',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Macronutrient Breakdown */}
            <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Macronutrient Breakdown</h4>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Doughnut
                    data={macroChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            color: 'white',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}