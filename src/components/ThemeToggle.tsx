import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Ensure we have a theme value
  const currentTheme = theme || resolvedTheme || 'light';

  useEffect(() => {
    // Set default theme to light if not set
    if (!theme) {
      setTheme('light');
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      onClick={toggleTheme}
      className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      } ${className}`}
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          currentTheme === 'dark' ? 'translate-x-6' : ''
        }`}
      />
      <Sun className="absolute left-2 text-yellow-400 h-4 w-4" />
      <Moon className="absolute right-2 text-indigo-400 h-4 w-4" />
    </div>
  );
};

export default ThemeToggle;
