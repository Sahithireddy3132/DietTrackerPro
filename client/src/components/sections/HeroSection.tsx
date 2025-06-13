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
      window.location.href = '/api/login';
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
          {/* Hero fitness image showcasing strength training */}
          <img 
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800" 
            alt="Fitness transformation journey" 
            className="rounded-2xl shadow-2xl w-full h-auto animate-float" 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-electric/20 to-neon-green/20 rounded-2xl"></div>
          
          {/* Floating UI Elements */}
          <div className="absolute -top-6 -right-6 glass-effect rounded-2xl p-4 animate-float" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-electric to-neon-green rounded-full flex items-center justify-center">
                <i className="fas fa-fire text-white"></i>
              </div>
              <div>
                <div className="text-sm text-gray-400">Calories Burned</div>
                <div className="font-bold text-white">850 kcal</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -left-6 glass-effect rounded-2xl p-4 animate-float" style={{animationDelay: '1s'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <i className="fas fa-trophy text-white"></i>
              </div>
              <div>
                <div className="text-sm text-gray-400">Achievement</div>
                <div className="font-bold text-white">Cardio King 👑</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
