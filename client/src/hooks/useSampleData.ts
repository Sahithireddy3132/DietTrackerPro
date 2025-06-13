import { useState, useEffect } from 'react';

export function useSampleData() {
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 24,
    totalCalories: 5680,
    totalMinutes: 1440,
    avgCaloriesPerWorkout: 237
  });

  const [progressData, setProgressData] = useState([
    { date: '2024-12-07', weight: 75.2, calories: 320, mood: 'good' },
    { date: '2024-12-08', weight: 75.0, calories: 450, mood: 'excellent' },
    { date: '2024-12-09', weight: 74.8, calories: 380, mood: 'good' },
    { date: '2024-12-10', weight: 74.7, calories: 520, mood: 'excellent' },
    { date: '2024-12-11', weight: 74.5, calories: 410, mood: 'good' },
    { date: '2024-12-12', weight: 74.3, calories: 480, mood: 'excellent' },
    { date: '2024-12-13', weight: 74.1, calories: 360, mood: 'average' }
  ]);

  const [goals, setGoals] = useState([
    { id: '1', title: 'Lose 5kg', type: 'weight_loss', current: 2.1, target: 5, completed: false },
    { id: '2', title: 'Run 5K', type: 'cardio', current: 3200, target: 5000, completed: false },
    { id: '3', title: 'Bench Press 100kg', type: 'strength', current: 75, target: 100, completed: false },
    { id: '4', title: '30-Day Streak', type: 'consistency', current: 18, target: 30, completed: false }
  ]);

  const [achievements, setAchievements] = useState([
    { id: '1', title: 'First Workout', icon: '🏃', description: 'Completed your first workout session' },
    { id: '2', title: '7-Day Streak', icon: '🔥', description: 'Worked out for 7 consecutive days' },
    { id: '3', title: 'Calorie Crusher', icon: '💪', description: 'Burned over 500 calories in one session' }
  ]);

  const [workoutHistory, setWorkoutHistory] = useState([
    { id: '1', name: 'Full Body Cardio', date: '2024-12-13', duration: 45, calories: 380 },
    { id: '2', name: 'Upper Body Strength', date: '2024-12-12', duration: 60, calories: 420 },
    { id: '3', name: 'HIIT Training', date: '2024-12-11', duration: 30, calories: 480 },
    { id: '4', name: 'Yoga Flow', date: '2024-12-10', duration: 50, calories: 250 },
    { id: '5', name: 'Core Blast', date: '2024-12-09', duration: 25, calories: 180 }
  ]);

  return {
    workoutStats,
    progressData,
    goals,
    achievements,
    workoutHistory
  };
}