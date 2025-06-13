import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Droplets, Flame } from 'lucide-react';

export function ProgressSection() {
  const { isAuthenticated } = useAuth();

  const { data: workoutStats } = useQuery({
    queryKey: ['/api/workouts/stats'],
    enabled: isAuthenticated,
  });

  const { data: progress } = useQuery({
    queryKey: ['/api/progress'],
    enabled: isAuthenticated,
  });

  const { data: achievements } = useQuery({
    queryKey: ['/api/achievements'],
    enabled: isAuthenticated,
  });

  // Mock data for charts when user is not authenticated or no data
  const chartData = progress?.slice(0, 7).reverse().map((p: any, index: number) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    workouts: 1,
    calories: p.caloriesBurned || Math.floor(Math.random() * 400) + 200,
  })) || [
    { day: 'Mon', workouts: 1, calories: 320 },
    { day: 'Tue', workouts: 2, calories: 450 },
    { day: 'Wed', workouts: 1, calories: 280 },
    { day: 'Thu', workouts: 3, calories: 580 },
    { day: 'Fri', workouts: 2, calories: 420 },
    { day: 'Sat', workouts: 1, calories: 300 },
    { day: 'Sun', workouts: 2, calories: 480 },
  ];

  const moodData = [
    { name: 'Energetic', value: 40, color: '#00FF88' },
    { name: 'Happy', value: 30, color: '#00D4FF' },
    { name: 'Motivated', value: 20, color: '#8B5CF6' },
    { name: 'Tired', value: 10, color: '#6B7280' },
  ];

  const defaultAchievements = [
    { icon: '🏃‍♀️', title: 'Cardio King', description: '5 cardio sessions' },
    { icon: '💪', title: 'Strength Warrior', description: '10 strength workouts' },
    { icon: '🔥', title: 'Calorie Crusher', description: '5000 calories burned' },
    { icon: '🏆', title: 'Consistency Champion', description: '7 days streak', locked: true },
    { icon: '🧘‍♀️', title: 'Zen Master', description: '20 meditation sessions', locked: true },
    { icon: '⚡', title: 'Energy Boost', description: '30 HIIT workouts', locked: true },
  ];

  return (
    <section id="progress" className="py-20 bg-gradient-to-b from-dark-bg to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Track Your <span className="gradient-text">Progress</span>
          </h2>
          <p className="text-xl text-gray-300">Monitor your fitness journey with real-time analytics</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Weekly Stats Cards */}
          <Card className="glass-effect text-center">
            <CardContent className="p-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="progress-ring w-full h-full">
                  <circle 
                    className="progress-ring-circle stroke-electric" 
                    strokeWidth="4" 
                    fill="transparent" 
                    r="45" 
                    cx="48" 
                    cy="48" 
                    style={{ strokeDashoffset: 'calc(283 - (283 * 85) / 100)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">85%</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Weekly Goal</h3>
              <p className="text-gray-400">{workoutStats?.totalWorkouts || 4}/5 workouts completed</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect text-center">
            <CardContent className="p-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="progress-ring w-full h-full">
                  <circle 
                    className="progress-ring-circle stroke-neon-green" 
                    strokeWidth="4" 
                    fill="transparent" 
                    r="45" 
                    cx="48" 
                    cy="48" 
                    style={{ strokeDashoffset: 'calc(283 - (283 * 92) / 100)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">92%</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calories</h3>
              <p className="text-gray-400">{workoutStats?.totalCalories || 2024} / 2,200 kcal</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect text-center">
            <CardContent className="p-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="progress-ring w-full h-full">
                  <circle 
                    className="progress-ring-circle stroke-purple-500" 
                    strokeWidth="4" 
                    fill="transparent" 
                    r="45" 
                    cx="48" 
                    cy="48" 
                    style={{ strokeDashoffset: 'calc(283 - (283 * 76) / 100)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">76%</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hydration</h3>
              <p className="text-gray-400">6.1 / 8.0 liters</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workout Progress Chart */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-electric" />
                <span>Workout Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="calories" fill="var(--electric)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Mood Tracker */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-neon-green" />
                <span>Mood & Energy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Achievement Badges */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-8 text-center">Recent Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(achievements && achievements.length > 0 ? achievements : defaultAchievements).map((achievement: any, index: number) => (
              <Card 
                key={achievement.id || index} 
                className={`glass-effect text-center hover:scale-110 transition-transform cursor-pointer ${
                  achievement.locked ? 'opacity-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-sm font-semibold">{achievement.title}</div>
                  <div className="text-xs text-gray-400">{achievement.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
