import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';

export default function SimpleAuth() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Store user in localStorage for simple auth
      localStorage.setItem('fitness_user', JSON.stringify({
        id: `user_${Date.now()}`,
        username: username.trim(),
        loginTime: new Date().toISOString()
      }));
      
      // Redirect to main app
      setLocation('/');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="glass-effect rounded-2xl p-8 border border-electric/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome to FitTracker
            </h1>
            <p className="text-gray-400">
              Enter your name to start your fitness journey
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-bg/50 border-gray-600 focus:border-electric text-lg p-4"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-electric to-neon-green text-dark-bg font-semibold text-lg p-4 hover:opacity-90 transition-all"
            >
              Start Your Journey
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold gradient-text">500+</div>
                <div className="text-xs text-gray-400">Workouts</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">24/7</div>
                <div className="text-xs text-gray-400">AI Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">Track</div>
                <div className="text-xs text-gray-400">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}