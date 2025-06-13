import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { Clock, Play, CheckCircle } from 'lucide-react';

interface Exercise {
  name: string;
  duration?: number;
  reps?: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  videoUrl?: string;
  imageUrl?: string;
  exercises: Exercise[];
}

export function WorkoutSection() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['/api/workouts', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all' ? '/api/workouts' : `/api/workouts?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return response.json();
    },
  });

  const { data: userWorkouts } = useQuery({
    queryKey: ['/api/workouts/history'],
    enabled: isAuthenticated,
  });

  const logWorkoutMutation = useMutation({
    mutationFn: async (workout: Workout) => {
      await apiRequest('POST', '/api/workouts/log', {
        workoutId: workout.id,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        mood: 'energetic'
      });
    },
    onSuccess: () => {
      toast({
        title: "Workout Logged!",
        description: "Great job completing your workout! 🔥",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/workouts/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workouts/stats'] });
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
        title: "Failed to log workout",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: 'all', label: 'All Workouts' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-orange-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getProgressForWorkout = (workoutId: string) => {
    if (!userWorkouts || !isAuthenticated) return { completed: 0, total: 5 };
    const completions = userWorkouts.filter((uw: any) => uw.workoutId === workoutId).length;
    return { completed: completions, total: 5 };
  };

  const handleStartWorkout = (workout: Workout) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to start workouts and track your progress.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    // Simulate workout completion and log it
    logWorkoutMutation.mutate(workout);
  };

  return (
    <section id="workouts" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Interactive <span className="gradient-text">Workout Hub</span>
          </h2>
          <p className="text-xl text-gray-300">Follow along with expert trainers and track your progress</p>
        </div>
        
        {/* Workout Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id 
                ? "bg-gradient-to-r from-electric to-neon-green text-dark-bg font-semibold"
                : "neon-border hover:bg-glass-bg transition-all"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* Workout Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-effect animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : workouts?.length > 0 ? (
            workouts.map((workout: Workout) => {
              const progress = getProgressForWorkout(workout.id);
              const progressPercentage = (progress.completed / progress.total) * 100;
              const isCompleted = progress.completed >= progress.total;
              
              return (
                <Card key={workout.id} className="glass-effect hover:scale-105 transition-transform overflow-hidden">
                  <img 
                    src={workout.imageUrl} 
                    alt={workout.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${getCategoryColor(workout.category)} text-xs`}>
                        {workout.category.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {workout.duration} min
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{workout.description}</p>
                    
                    {/* Progress tracker */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">
                        Progress: {progress.completed}/{progress.total} sessions
                      </span>
                      <div className="flex space-x-1">
                        {Array.from({ length: progress.total }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < progress.completed ? 'bg-electric' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartWorkout(workout)}
                      disabled={isCompleted || logWorkoutMutation.isPending}
                      className={
                        isCompleted 
                          ? "w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold"
                          : "w-full bg-gradient-to-r from-electric to-neon-green text-dark-bg font-semibold hover:shadow-lg transition-all"
                      }
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Workout
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg">No workouts found for this category</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
