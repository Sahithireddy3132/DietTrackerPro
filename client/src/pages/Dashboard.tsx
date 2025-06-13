import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Target, Trophy, Activity, TrendingUp, Flame } from 'lucide-react';

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: workoutStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/workouts/stats"],
    enabled: isAuthenticated,
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/goals"],
    enabled: isAuthenticated,
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: isAuthenticated,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your fitness dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = progress?.slice(0, 7).reverse().map((p: any, index: number) => ({
    day: `Day ${index + 1}`,
    calories: p.caloriesBurned || 0,
    water: parseFloat(p.waterIntake || 0),
  })) || [];

  const moodData = [
    { name: 'Energetic', value: 40, color: '#00FF88' },
    { name: 'Happy', value: 30, color: '#00D4FF' },
    { name: 'Motivated', value: 20, color: '#8B5CF6' },
    { name: 'Tired', value: 10, color: '#6B7280' },
  ];

  return (
    <div className="min-h-screen dark-bg text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Your Fitness <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-gray-400">Track your progress and achieve your goals</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="glass-effect border-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-effect border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-8 w-8 text-electric" />
                      <div>
                        <p className="text-sm text-gray-400">Total Workouts</p>
                        <p className="text-2xl font-bold">{workoutStats?.totalWorkouts || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Flame className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-400">Calories Burned</p>
                        <p className="text-2xl font-bold">{workoutStats?.totalCalories || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-8 w-8 text-neon-green" />
                      <div>
                        <p className="text-sm text-gray-400">Active Minutes</p>
                        <p className="text-2xl font-bold">{workoutStats?.totalMinutes || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                      <div>
                        <p className="text-sm text-gray-400">Achievements</p>
                        <p className="text-2xl font-bold">{achievements?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass-effect border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-electric" />
                      <span>Weekly Progress</span>
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

                <Card className="glass-effect border-gray-700">
                  <CardHeader>
                    <CardTitle>Mood Distribution</CardTitle>
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
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-electric" />
                    <span>Your Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {goals && goals.length > 0 ? (
                    <div className="space-y-4">
                      {goals.map((goal: any) => (
                        <div key={goal.id} className="p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{goal.title}</h3>
                            <Badge variant={goal.isCompleted ? "secondary" : "outline"}>
                              {goal.isCompleted ? "Completed" : "In Progress"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{goal.description}</p>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={(goal.currentValue / goal.targetValue) * 100} 
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-400">
                              {goal.currentValue}/{goal.targetValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No goals set yet</p>
                      <Button className="bg-gradient-to-r from-electric to-neon-green">
                        Set Your First Goal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workouts">
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle>Workout History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Complete your first workout to see your history here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition">
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle>Nutrition Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Start logging your meals to track nutrition progress</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
