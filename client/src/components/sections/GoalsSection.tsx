import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Target, Plus, Trophy, Gift, Medal, Calendar, CheckCircle, Clock } from 'lucide-react';

interface Goal {
  id: string;
  type: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  targetDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
}

interface Achievement {
  id: string;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export function GoalsSection() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: '',
    title: '',
    description: '',
    targetValue: '',
    targetDate: '',
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/goals'],
    enabled: isAuthenticated,
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/achievements'],
    enabled: isAuthenticated,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      await apiRequest('POST', '/api/goals', goalData);
    },
    onSuccess: () => {
      toast({
        title: "Goal Created!",
        description: "Your new fitness goal has been set.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setIsCreateDialogOpen(false);
      setNewGoal({
        type: '',
        title: '',
        description: '',
        targetValue: '',
        targetDate: '',
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Failed to create goal",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGoal = () => {
    if (!newGoal.type || !newGoal.title || !newGoal.targetValue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate({
      type: newGoal.type,
      title: newGoal.title,
      description: newGoal.description,
      targetValue: parseInt(newGoal.targetValue),
      targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
    });
  };

  // Mock data for available rewards when no real achievements exist
  const availableRewards = [
    {
      id: 'cardio_master',
      title: 'Cardio Master',
      description: 'Complete 10 cardio sessions',
      icon: '🏃‍♀️',
      progress: { current: 8, target: 10 },
      color: 'text-electric',
    },
    {
      id: 'calorie_crusher',
      title: 'Calorie Crusher',
      description: 'Burn 10,000 calories total',
      icon: '🔥',
      progress: { current: 7240, target: 10000 },
      color: 'text-orange-400',
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Complete weekly goals 4 times',
      icon: '⚡',
      progress: { current: 4, target: 4 },
      color: 'text-electric',
      ready: true,
    },
  ];

  const recentAchievements = achievements?.slice(0, 3) || [
    {
      id: '1',
      title: 'Strength Seeker',
      description: 'Complete 5 strength workouts',
      icon: '💪',
      earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      color: 'border-yellow-500/30 bg-yellow-500/10',
      textColor: 'text-yellow-400',
    },
    {
      id: '2',
      title: 'Nutrition Ninja',
      description: 'Log meals for 7 consecutive days',
      icon: '🥗',
      earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      color: 'border-green-500/30 bg-green-500/10',
      textColor: 'text-green-400',
    },
    {
      id: '3',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water daily for a week',
      icon: '💧',
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      color: 'border-blue-500/30 bg-blue-500/10',
      textColor: 'text-blue-400',
    },
  ];

  // Mock weekly goals when no real goals exist
  const weeklyGoals = goals?.length > 0 ? goals : [
    {
      id: '1',
      title: 'Complete 5 Workouts',
      description: 'Finish 5 workout sessions this week',
      targetValue: 5,
      currentValue: 4,
      type: 'workout_count',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Burn 3000 Calories',
      description: 'Burn a total of 3000 calories through exercise',
      targetValue: 3000,
      currentValue: 2450,
      type: 'calories_burned',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Log Meals Daily',
      description: 'Log all your meals for 7 consecutive days',
      targetValue: 7,
      currentValue: 6,
      type: 'meal_logging',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Drink 8 Glasses of Water Daily',
      description: 'Stay hydrated by drinking 8 glasses of water every day',
      targetValue: 7,
      currentValue: 7,
      type: 'hydration',
      isCompleted: true,
    },
  ];

  const goalTypes = [
    { value: 'workout_count', label: 'Workout Count' },
    { value: 'calories_burned', label: 'Calories Burned' },
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'running_distance', label: 'Running Distance' },
    { value: 'strength_increase', label: 'Strength Increase' },
  ];

  const getTimeAgo = (date: Date) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week ago';
    return `${weeks} weeks ago`;
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Weekly <span className="gradient-text">Goals</span>
          </h2>
          <p className="text-xl text-gray-300">Set targets and earn rewards for your achievements</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Goals */}
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-electric" />
                    <span>This Week's Goals</span>
                  </div>
                  
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-electric to-neon-green text-dark-bg hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-effect border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Create New Goal</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="goal-type">Goal Type</Label>
                          <Select value={newGoal.type} onValueChange={(value) => setNewGoal(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select goal type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {goalTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="goal-title">Title</Label>
                          <Input
                            id="goal-title"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Complete 10 workouts"
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="goal-description">Description</Label>
                          <Textarea
                            id="goal-description"
                            value={newGoal.description}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your goal..."
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="goal-target">Target Value</Label>
                          <Input
                            id="goal-target"
                            type="number"
                            value={newGoal.targetValue}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                            placeholder="e.g., 10"
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="goal-date">Target Date (Optional)</Label>
                          <Input
                            id="goal-date"
                            type="date"
                            value={newGoal.targetDate}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleCreateGoal}
                          disabled={createGoalMutation.isPending}
                          className="w-full bg-gradient-to-r from-electric to-neon-green text-dark-bg"
                        >
                          {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyGoals && weeklyGoals.length > 0 ? (
                  <div className="space-y-6">
                    {weeklyGoals.map((goal: any) => {
                      const progressPercentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                      return (
                        <div key={goal.id} className="p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{goal.title}</h3>
                            <Badge variant={goal.isCompleted ? "secondary" : "outline"}>
                              {goal.isCompleted ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                              ) : (
                                <><Clock className="w-3 h-3 mr-1" /> In Progress</>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{goal.description}</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={progressPercentage} className="flex-1" />
                            <span className="text-sm text-gray-400">
                              {goal.currentValue}/{goal.targetValue}
                            </span>
                          </div>
                          {goal.isCompleted ? (
                            <div className="text-sm text-green-400 mt-2 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Great job! Goal completed! 🎉
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 mt-2">
                              {goal.targetValue - goal.currentValue} more to complete!
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No goals set yet</p>
                    <p className="text-sm text-gray-500">Create your first goal to start tracking progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Reward System */}
          <div className="space-y-6">
            {/* Available Rewards */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-neon-green" />
                  <span>Available Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableRewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{reward.icon}</div>
                        <div>
                          <div className="font-medium">{reward.title}</div>
                          <div className="text-sm text-gray-400">{reward.description}</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        {reward.ready ? (
                          <Badge className="bg-electric text-dark-bg font-semibold">
                            Ready!
                          </Badge>
                        ) : (
                          <span className={reward.color}>
                            {reward.progress.current}/{reward.progress.target}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Achievements */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Medal className="h-5 w-5 text-yellow-400" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement: any) => (
                    <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${achievement.color || 'bg-yellow-500/10 border-yellow-500/30'}`}>
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.textColor || 'text-yellow-400'}`}>
                          {achievement.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          Earned {getTimeAgo(achievement.earnedAt)}
                        </div>
                      </div>
                      <Trophy className={`h-5 w-5 ${achievement.textColor || 'text-yellow-400'}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
