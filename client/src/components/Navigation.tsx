import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, User, Menu, X } from 'lucide-react';

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/#home", label: "Home" },
    { href: "/#workouts", label: "Workouts" },
    { href: "/#nutrition", label: "Nutrition" },
    { href: "/#progress", label: "Progress" },
    { href: "/#ai-chat", label: "AI Coach" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-electric to-neon-green rounded-full animate-pulse-electric"></div>
            <span className="text-xl font-bold gradient-text">FitZone Pro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-electric transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = item.href.split('#')[1];
                  const element = document.getElementById(targetId);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-electric" />
              ) : (
                <Moon className="h-5 w-5 text-electric" />
              )}
            </Button>

            {/* User actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-electric to-neon-green hover:shadow-lg hover:shadow-electric/50 transition-all">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/api/logout'}
                  className="neon-border hover:bg-glass-bg"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-electric to-neon-green hover:shadow-lg hover:shadow-electric/50 transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-electric transition-colors py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    const targetId = item.href.split('#')[1];
                    const element = document.getElementById(targetId);
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
