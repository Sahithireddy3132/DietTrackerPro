import { useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  loginTime: string;
};

export function useSimpleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('fitness_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('fitness_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    const userData = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('fitness_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fitness_user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}