import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useSampleData } from '@/hooks/useSampleData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ProgressSection() {
  const { isAuthenticated } = useSimpleAuth();
  const { progressData, workoutStats } = useSampleData();

  if (!isAuthenticated) {
    return (
      <section id="progress" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text mb-4">Track Your Progress</h2>
            <p className="text-gray-400">Please log in to view your progress data.</p>
          </div>
        </div>
      </section>
    );
  }

  // Mood data from sample data
  const moodCounts = progressData?.reduce((acc: any, day: any) => {
    acc[day.mood] = (acc[day.mood] || 0) + 1;
    return acc;
  }, {}) || {};

  const moodData = [
    { name: 'Excellent', value: moodCounts.excellent || 0, color: '#10B981' },
    { name: 'Good', value: moodCounts.good || 0, color: '#3B82F6' },
    { name: 'Average', value: moodCounts.average || 0, color: '#F59E0B' },
    { name: 'Tired', value: moodCounts.tired || 0, color: '#EF4444' }
  ];

  const stats = [
    { label: 'Total Workouts', value: workoutStats.totalWorkouts, color: 'text-electric' },
    { label: 'Calories Burned', value: workoutStats.totalCalories.toLocaleString(), color: 'text-neon-green' },
    { label: 'Hours Trained', value: Math.round(workoutStats.totalMinutes / 60), color: 'text-electric' },
    { label: 'Avg Cal/Workout', value: workoutStats.avgCaloriesPerWorkout, color: 'text-neon-green' }
  ];

  return (
    <section id="progress" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold gradient-text mb-4">Track Your Progress</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor your fitness journey with detailed analytics and visual progress tracking
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="glass-effect rounded-xl p-6 text-center border border-electric/20 hover:border-electric/40 transition-all">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weight & Calories Chart */}
          <div className="glass-effect rounded-xl p-6 border border-electric/20">
            <h3 className="text-xl font-semibold gradient-text mb-6">Weight & Calories Progress</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #10B981',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(1) : value,
                      name === 'weight' ? 'Weight (kg)' : 'Calories Burned'
                    ]}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="glass-effect rounded-xl p-6 border border-electric/20">
            <h3 className="text-xl font-semibold gradient-text mb-6">Mood Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #10B981',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {moodData.map((mood, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: mood.color }}
                  ></div>
                  <span className="text-sm text-gray-300">{mood.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <div className="glass-effect rounded-xl p-6 border border-electric/20">
            <h3 className="text-xl font-semibold gradient-text mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {progressData.slice(-5).reverse().map((day, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-dark-bg/50 rounded-lg border border-gray-700">
                  <div>
                    <div className="font-medium text-white">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-gray-400">
                      Weight: {day.weight}kg • Mood: {day.mood}
                    </div>
                  </div>
                  <div className="text-electric font-semibold">
                    {day.calories} cal
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}