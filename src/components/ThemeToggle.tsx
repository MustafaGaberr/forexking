import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div
      onClick={toggleTheme}
      className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      } ${className}`}
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6' : ''
        }`}
      />
      <Sun className="absolute left-2 text-yellow-400 h-4 w-4" />
      <Moon className="absolute right-2 text-indigo-400 h-4 w-4" />
    </div>
  );
};

export default ThemeToggle;
