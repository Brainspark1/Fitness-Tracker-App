'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAchievements } from '../components/AchievementProvider';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export default function Diet() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { triggerAchievementCheck } = useAchievements();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const savedMeals = localStorage.getItem('meals');
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  const saveMeals = (newMeals: Meal[]) => {
    localStorage.setItem('meals', JSON.stringify(newMeals));
    setMeals(newMeals);
  };

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories || !protein || !carbs || !fat) return;

    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
      date: new Date().toISOString().split('T')[0],
    };

    const newMeals = [...meals, newMeal];
    saveMeals(newMeals);

    // Check for achievements
    const savedProfile = localStorage.getItem('profile');
    const savedWorkouts = localStorage.getItem('workouts');
    const workouts = savedWorkouts ? JSON.parse(savedWorkouts) : [];
    const data = { workouts, meals: newMeals, profile: savedProfile ? JSON.parse(savedProfile) : {} };
    triggerAchievementCheck(data);

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const deleteMeal = (id: string) => {
    const newMeals = meals.filter(m => m.id !== id);
    saveMeals(newMeals);
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCalories = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = filteredMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = filteredMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = filteredMeals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-8">Track Your Diet</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search meals by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-600 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white"
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
          <h3 className="text-gray-300 font-semibold mb-4">Daily Totals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{totalCalories}</p>
              <p className="text-sm text-gray-300">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{totalProtein}g</p>
              <p className="text-sm text-gray-300">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{totalCarbs}g</p>
              <p className="text-sm text-gray-300">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{totalFat}g</p>
              <p className="text-sm text-gray-300">Fat</p>
            </div>
          </div>
        </div>

        <form onSubmit={addMeal} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Meal Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-600 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="border border-gray-600 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="border border-gray-600 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="border border-gray-600 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              placeholder="Fat (g)"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="border border-gray-600 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Meal
            </button>
          </div>
        </form>

        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Calories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Protein</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Carbs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {filteredMeals.map((meal) => (
                <tr key={meal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{meal.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{meal.calories}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{meal.protein}g</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{meal.carbs}g</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{meal.fat}g</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{meal.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
