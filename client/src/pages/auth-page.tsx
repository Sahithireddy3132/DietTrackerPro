import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  if (user) {
    setLocation('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await loginMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        setLocation('/');
      } else {
        await registerMutation.mutateAsync({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        toast({
          title: "Account created!",
          description: "Welcome to your fitness journey.",
        });
        setLocation('/');
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      <div className="w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="glass-effect border-electric/20">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold gradient-text">
                {isLogin ? 'Welcome Back' : 'Join FitTracker'}
              </CardTitle>
              <p className="text-gray-400">
                {isLogin 
                  ? 'Sign in to continue your fitness journey' 
                  : 'Start your transformation today'
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 bg-dark-bg/50 border-gray-600 focus:border-electric"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-dark-bg/50 border-gray-600 focus:border-electric"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-dark-bg/50 border-gray-600 focus:border-electric"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-electric to-neon-green text-dark-bg font-semibold hover:opacity-90 transition-all"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {(loginMutation.isPending || registerMutation.isPending) 
                    ? 'Processing...' 
                    : isLogin ? 'Sign In' : 'Create Account'
                  }
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-gray-400 hover:text-electric transition-colors"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Hero content */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Your Fitness
            <span className="block gradient-text">Journey Awaits</span>
          </h1>
          <p className="text-xl text-gray-300">
            Transform your body and mind with AI-powered workouts, personalized nutrition, and smart progress tracking.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-electric to-neon-green rounded-xl flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-dumbbell text-dark-bg"></i>
              </div>
              <h3 className="font-semibold text-white">Smart Workouts</h3>
              <p className="text-sm text-gray-400">AI-powered routines</p>
            </div>
            
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-chart-line text-white"></i>
              </div>
              <h3 className="font-semibold text-white">Track Progress</h3>
              <p className="text-sm text-gray-400">Real-time analytics</p>
            </div>
            
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-apple-alt text-white"></i>
              </div>
              <h3 className="font-semibold text-white">Nutrition Plans</h3>
              <p className="text-sm text-gray-400">Personalized meals</p>
            </div>
            
            <div className="glass-effect rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-trophy text-white"></i>
              </div>
              <h3 className="font-semibold text-white">Achievements</h3>
              <p className="text-sm text-gray-400">Unlock rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}