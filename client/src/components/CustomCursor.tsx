import { useEffect, useState } from 'react';

const motivationQuotes = [
  "Stay Strong! 💪",
  "You Got This! 🔥", 
  "Push Harder! ⚡",
  "Beast Mode! 🦁",
  "Never Give Up! 🚀",
  "Calories: -50 kcal 🔥"
];

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', updateCursor);

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .workout-card, .glass-effect');
    
    const handleMouseEnter = () => {
      setIsHovering(true);
      setShowMotivation(true);
      setCurrentQuote(prev => (prev + 1) % motivationQuotes.length);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setShowMotivation(false);
    };

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        className={`custom-cursor ${isHovering ? 'hover' : ''}`}
        style={{
          left: position.x - 10,
          top: position.y - 10,
        }}
      />
      <div 
        className={`motivation-text ${showMotivation ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: position.x,
          top: position.y - 40,
        }}
      >
        {motivationQuotes[currentQuote]}
      </div>
    </>
  );
}
