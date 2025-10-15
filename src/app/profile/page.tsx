'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Head } from 'next/document';
import Header from '../components/Header';

interface Profile {
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    goal: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveProfile = (newProfile: Profile) => {
    localStorage.setItem('profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const heightInMeters = profile.height / 100;
      return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMICategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight':
      case 'Overweight':
        return 'text-yellow-400';
      case 'Obese':
        return 'text-red-400';
      case 'Normal weight':
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Your Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Height (cm)</label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Fitness Goal</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select a goal</option>
                    <option value="Lose Weight">Lose Weight</option>
                    <option value="Gain Muscle">Gain Muscle</option>
                    <option value="Maintain Weight">Maintain Weight</option>
                    <option value="Improve Fitness">Improve Fitness</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Name</p>
                  <p className="text-lg text-white">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Age</p>
                  <p className="text-lg text-white">{profile.age || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Height</p>
                  <p className="text-lg text-white">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Weight</p>
                  <p className="text-lg text-white">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Fitness Goal</p>
                  <p className="text-lg text-white">{profile.goal || 'Not set'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Health Metrics */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Health Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300">BMI</p>
                <p className="text-2xl font-bold text-green-400">{calculateBMI()}</p>
                {profile.height && profile.weight && (
                  <p className={`text-sm ${getBMICategoryColor(getBMICategory(parseFloat(calculateBMI())))}`}>
                    Category: {getBMICategory(parseFloat(calculateBMI()))}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Recommended Daily Calories</p>
                <p className="text-2xl font-bold text-green-400">
                  {profile.weight && profile.height && profile.age ? (
                    profile.goal === 'lose-weight' ? Math.round(profile.weight * 24 * 0.8) :
                    profile.goal === 'gain-muscle' ? Math.round(profile.weight * 24 * 1.2) :
                    Math.round(profile.weight * 24)
                  ) : 'Set profile first'}
                </p>
                <p className="text-sm text-gray-300">Based on your profile and goal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h3>
          <p className="text-gray-300 mb-6">
            These actions are irreversible. Please be certain before proceeding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all workout history? This action cannot be undone.')) {
                  localStorage.removeItem('workouts');
                  alert('Workout history cleared successfully.');
                }
              }}
              className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Clear Workout History
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all diet history? This action cannot be undone.')) {
                  localStorage.removeItem('meals');
                  alert('Diet history cleared successfully.');
                }
              }}
              className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Clear Diet History
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your profile? This will reset all your personal information. This action cannot be undone.')) {
                  localStorage.removeItem('profile');
                  setProfile({
                    name: '',
                    age: 0,
                    height: 0,
                    weight: 0,
                    goal: '',
                  });
                  alert('Profile cleared successfully.');
                }
              }}
              className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Clear Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
