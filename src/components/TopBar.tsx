import { Moon, Sun, User, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import logoIcon from 'figma:asset/47690a220b997aa35549fe419decf1f499e5d1e2.png';
import logoText from 'figma:asset/839d5fc81266cc945ac41643b120ebf74a13775a.png';

interface TopBarProps {
  onLoginClick: () => void;
  onArtisanPortalClick: () => void;
}

export function TopBar({ onLoginClick, onArtisanPortalClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const isArtisan = user?.type === 'artisan';
  const buttonBaseClass = "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0";
  const iconClass = "w-4 h-4 md:w-5 md:h-5";

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between gap-2 max-w-[100vw]">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img 
            src={logoIcon} 
            alt="Kalaikatha" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />
          <img 
            src={logoText} 
            alt="Kalaikatha" 
            className="h-5 md:h-6 w-auto object-contain hidden sm:block dark:brightness-0 dark:invert"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 md:p-3 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className={`${iconClass} text-gray-700 dark:text-gray-300`} />
            ) : (
              <Sun className={`${iconClass} text-amber-400`} />
            )}
          </button>

          {/* Artisan Portal Button */}
          <button
            onClick={onArtisanPortalClick}
            className={`${buttonBaseClass} ${
              isArtisan
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            title={isArtisan ? 'Artisan Dashboard' : 'Login as Artisan'}
          >
            <Palette className={iconClass} />
            <span className="text-xs md:text-sm hidden sm:inline">
              {isArtisan ? 'Dashboard' : 'Artisan'}
            </span>
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pl-2 pr-3 py-1.5 shadow-sm flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full"
              />
              <span className="text-xs md:text-sm text-gray-900 dark:text-white hidden md:inline truncate max-w-[100px]">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className={`${buttonBaseClass} bg-gradient-to-r from-indigo-600 to-purple-600 text-white`}
            >
              <User className={iconClass} />
              <span className="text-xs md:text-sm">Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}