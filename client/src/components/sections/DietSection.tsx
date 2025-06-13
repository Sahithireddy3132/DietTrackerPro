import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateDietPlan } from '@/lib/openai';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Brain, Loader2 } from 'lucide-react';

export function DietSection() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    fitnessGoal: '',
    allergies: ''
  });

  const { data: activeDietPlan, isLoading: planLoading } = useQuery({
    queryKey: ['/api/diet/active'],
    enabled: isAuthenticated,
  });

  const generateMutation = useMutation({
    mutationFn: generateDietPlan,
    onSuccess: () => {
      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized AI diet plan is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/diet/active'] });
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
        title: "Generation Failed",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to generate a personalized diet plan.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    
    if (!formData.age || !formData.weight || !formData.fitnessGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate({
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      fitnessGoal: formData.fitnessGoal,
      allergies: formData.allergies
    });
  };

  return (
    <section id="nutrition" className="py-20 bg-gradient-to-b from-dark-bg to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">AI-Powered</span> Nutrition Coach
          </h2>
          <p className="text-xl text-gray-300">Get personalized meal plans tailored to your goals and preferences</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Diet Input Form */}
            <Card className="glass-effect neon-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-electric" />
                  <span>Tell Us About Yourself</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age" className="text-gray-300">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        className="bg-gray-800 border-gray-700 focus:ring-electric focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-gray-300">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className="bg-gray-800 border-gray-700 focus:ring-electric focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="goal" className="text-gray-300">Fitness Goal</Label>
                    <Select value={formData.fitnessGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessGoal: value }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-electric focus:border-transparent">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="athletic_performance">Athletic Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies" className="text-gray-300">Allergies/Restrictions</Label>
                    <Textarea
                      id="allergies"
                      placeholder="e.g., Dairy-free, Gluten-free, Vegetarian..."
                      value={formData.allergies}
                      onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                      className="bg-gray-800 border-gray-700 focus:ring-electric focus:border-transparent h-20"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={generateMutation.isPending}
                    className="w-full bg-gradient-to-r from-electric to-neon-green text-dark-bg font-semibold hover:shadow-lg hover:shadow-electric/30 transition-all"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating AI Diet Plan...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Generate AI Diet Plan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Quick Nutrition Tips */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-effect text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-electric">2,200</div>
                  <div className="text-sm text-gray-400">Daily Calories</div>
                </CardContent>
              </Card>
              <Card className="glass-effect text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-green">150g</div>
                  <div className="text-sm text-gray-400">Protein Goal</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* AI-Generated Meal Plan */}
            <Card className="glass-effect neon-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <i className="fas fa-calendar-week text-neon-green"></i>
                  <span>Your AI Meal Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {planLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-electric" />
                    <p className="text-gray-400">Loading your meal plan...</p>
                  </div>
                ) : activeDietPlan ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-electric">{activeDietPlan.dailyCalories}</div>
                        <div className="text-xs text-gray-400">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-neon-green">{activeDietPlan.proteinGoal}g</div>
                        <div className="text-xs text-gray-400">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">{activeDietPlan.carbGoal}g</div>
                        <div className="text-xs text-gray-400">Carbs</div>
                      </div>
                    </div>
                    
                    {activeDietPlan.meals?.slice(0, 2).map((day: any, index: number) => (
                      <div key={index} className={`border-l-4 ${index === 0 ? 'border-electric' : 'border-neon-green'} pl-4`}>
                        <div className={`font-semibold ${index === 0 ? 'text-electric' : 'text-neon-green'}`}>{day.day}</div>
                        <div className="text-sm text-gray-300 mt-1">
                          <div><strong>Breakfast:</strong> {day.breakfast}</div>
                          <div><strong>Lunch:</strong> {day.lunch}</div>
                          <div><strong>Dinner:</strong> {day.dinner}</div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-4">
                      <Button variant="link" className="text-electric hover:text-neon-green transition-colors">
                        View Full Week Plan <i className="fas fa-arrow-right ml-1"></i>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No meal plan generated yet</p>
                    <p className="text-sm text-gray-500">Fill out the form and generate your personalized AI diet plan</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Nutritional breakdown visualization */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Today's Nutrition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protein</span>
                    <span>85g / 150g</span>
                  </div>
                  <Progress value={57} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carbs</span>
                    <span>180g / 220g</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fats</span>
                    <span>45g / 80g</span>
                  </div>
                  <Progress value={56} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
