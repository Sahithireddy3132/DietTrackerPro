import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  const handleStartJourney = () => {
    if (isAuthenticated) {
      // Scroll to workout section
      const workoutSection = document.getElementById('workouts');
      workoutSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/auth';
    }
  };

  return (
    <section id="home" className="pt-20 min-h-screen flex items-center relative overflow-hidden">
      {/* Dynamic background particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-electric rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon-green rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Transform Your
            <span className="gradient-text block">Fitness Journey</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Experience the future of fitness with AI-powered personalization, smart coaching, and real-time progress tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleStartJourney}
              className="bg-gradient-to-r from-electric to-neon-green text-dark-bg font-semibold hover:shadow-xl hover:shadow-electric/30 transition-all transform hover:scale-105 px-8 py-4 text-lg"
            >
              <i className="fas fa-rocket mr-2"></i>
              {isAuthenticated ? 'Continue Journey' : 'Start Your Journey'}
            </Button>
            <Button 
              variant="outline"
              className="neon-border hover:bg-glass-bg transition-all px-8 py-4 text-lg"
              onClick={() => {
                // Scroll to features
                const dietSection = document.getElementById('nutrition');
                dietSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <i className="fas fa-play mr-2"></i>
              Explore Features
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">500+</div>
              <div className="text-sm text-gray-400">Workouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-gray-400">AI Support</div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          {/* Geometric fitness visualization */}
          <div className="relative w-full max-w-md mx-auto h-96">
            {/* Central fitness hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-electric to-neon-green rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <i className="fas fa-dumbbell text-2xl text-dark-bg"></i>
            </div>
            
            {/* Orbiting fitness elements */}
            <div className="absolute top-16 left-8 w-16 h-16 glass-effect rounded-xl flex items-center justify-center animate-float">
              <i className="fas fa-heart text-red-400 text-xl"></i>
            </div>
            
            <div className="absolute top-20 right-12 w-14 h-14 glass-effect rounded-full flex items-center justify-center animate-float" style={{animationDelay: '0.8s'}}>
              <i className="fas fa-fire text-orange-400 text-lg"></i>
            </div>
            
            <div className="absolute bottom-20 left-16 w-18 h-18 glass-effect rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '1.2s'}}>
              <i className="fas fa-chart-line text-electric text-xl"></i>
            </div>
            
            <div className="absolute bottom-16 right-8 w-16 h-16 glass-effect rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '1.6s'}}>
              <i className="fas fa-trophy text-yellow-400 text-xl"></i>
            </div>
            
            <div className="absolute top-1/3 right-4 w-12 h-12 glass-effect rounded-full flex items-center justify-center animate-float" style={{animationDelay: '2s'}}>
              <i className="fas fa-apple-alt text-green-400"></i>
            </div>
            
            <div className="absolute bottom-1/3 left-4 w-14 h-14 glass-effect rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '2.4s'}}>
              <i className="fas fa-stopwatch text-blue-400 text-lg"></i>
            </div>
          </div>
          
          {/* Performance cards */}
          <div className="absolute -top-4 -right-4 glass-effect rounded-xl p-3 animate-float" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-electric to-neon-green rounded-lg flex items-center justify-center">
                <i className="fas fa-fire text-dark-bg text-sm"></i>
              </div>
              <div>
                <div className="text-xs text-gray-400">Daily Goal</div>
                <div className="font-bold text-white text-sm">850 kcal</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -left-4 glass-effect rounded-xl p-3 animate-float" style={{animationDelay: '1s'}}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-trophy text-white text-sm"></i>
              </div>
              <div>
                <div className="text-xs text-gray-400">Streak</div>
                <div className="font-bold text-white text-sm">7 Days</div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/4 -left-6 glass-effect rounded-xl p-3 animate-float" style={{animationDelay: '1.5s'}}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-sm"></i>
              </div>
              <div>
                <div className="text-xs text-gray-400">Progress</div>
                <div className="font-bold text-white text-sm">+12%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
