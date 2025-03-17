import { useTheme } from "../hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="relative flex items-center justify-center mx-3 w-5 h-5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 overflow-hidden group"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900 transition-colors duration-300"></div>
        <div className="relative z-10 transition-all duration-500 ease-out">
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400 transform transition-transform duration-500 group-hover:rotate-45" />
          ) : (
            <Moon className="h-5 w-5 text-blue-600 transform transition-transform duration-500 group-hover:-rotate-12" />
          )}
        </div>
        <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
      </button>
    );
};