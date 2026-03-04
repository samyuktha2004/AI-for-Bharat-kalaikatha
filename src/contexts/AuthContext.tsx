/**
 * Auth Context — AWS Cognito First
 * Priority: AWS Cognito → Mock (development fallback)
 * Firebase removed — all auth now goes through Cognito or mock.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  isCognitoConfigured,
  signUpUser,
  signInUser,
  signOutUser,
  getCurrentAuthUser,
  updateUserName,
} from '../services/AWSAuthService';
import { toast } from 'sonner@2.0.3';

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  type: 'buyer' | 'artisan';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'buyer' | 'artisan') => Promise<void>;
  signup: (email: string, password: string, type: 'buyer' | 'artisan', name?: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      if (isCognitoConfigured()) {
        try {
          const cognitoUser = await getCurrentAuthUser();
          if (cognitoUser) {
            const userType = (localStorage.getItem('kalaikatha_user_type') as 'buyer' | 'artisan') || 'buyer';
            const appUser: User = {
              id: cognitoUser.userId,
              name: cognitoUser.username,
              email: cognitoUser.signInDetails?.loginId || cognitoUser.username,
              type: userType,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cognitoUser.username)}&background=random`,
            };
            setUser(appUser);
            localStorage.setItem('kalaikatha_user', JSON.stringify(appUser));
          }
        } catch {
          setUser(null);
        }
      } else {
        const stored = localStorage.getItem('kalaikatha_user');
        if (stored) setUser(JSON.parse(stored));
      }
      setIsLoadingAuth(false);
    }
    restoreSession();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string, type: 'buyer' | 'artisan') => {
    if (isCognitoConfigured()) {
      try {
        const result = await signInUser(email, password);
        if (result.success && result.user) {
          const appUser: User = {
            id: result.user.userId,
            name: result.user.username,
            email,
            type,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.username)}&background=random`,
          };
          setUser(appUser);
          localStorage.setItem('kalaikatha_user', JSON.stringify(appUser));
          localStorage.setItem('kalaikatha_user_type', type);
          toast.success('Signed in successfully!');
        } else {
          throw new Error('Sign-in incomplete. Check your email for a verification code.');
        }
      } catch (error: any) {
        console.error('Cognito login error:', error);
        if (error.message?.includes('UserNotFoundException') || error.message?.includes('user-not-found')) {
          toast.error('No account found with this email. Please sign up first.');
          throw new Error('No account found. Please sign up.');
        } else if (error.message?.includes('NotAuthorizedException') || error.message?.includes('Incorrect username')) {
          toast.error('Incorrect password. Please try again.');
          throw new Error('Incorrect password');
        } else {
          toast.error(error.message || 'Failed to sign in. Please try again.');
          throw error;
        }
      }
    } else {
      // ── Mock login ───────────────────────────────────────────────────────
      await new Promise(resolve => setTimeout(resolve, 800));
      const extractedName = email.includes('@') ? email.split('@')[0] : email.slice(0, 10);
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: extractedName,
        email,
        type,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(extractedName)}&background=random`,
      };
      setUser(mockUser);
      localStorage.setItem('kalaikatha_user', JSON.stringify(mockUser));
      localStorage.setItem('kalaikatha_user_type', type);
      toast.success('Signed in! (Demo Mode — add AWS Cognito credentials to go live)');
    }
  };

  // ── Signup ───────────────────────────────────────────────────────────────
  const signup = async (email: string, password: string, type: 'buyer' | 'artisan', name?: string) => {
    if (isCognitoConfigured()) {
      try {
        const result = await signUpUser(email, password, type, name);
        localStorage.setItem('kalaikatha_user_type', type);
        if (name) localStorage.setItem('kalaikatha_name_confirmed', 'true');

        if (result.isSignUpComplete) {
          await login(email, password, type);
        } else {
          toast.info('Check your email for a verification code to complete signup.');
        }
        toast.success('Account created successfully!');
      } catch (error: any) {
        console.error('Cognito signup error:', error);
        if (error.message?.includes('UsernameExistsException')) {
          toast.error('This email is already registered. Please sign in instead.');
          throw new Error('Email already in use');
        } else if (error.message?.includes('InvalidPasswordException')) {
          toast.error('Password must be at least 8 characters with uppercase, lowercase and a number.');
          throw new Error('Weak password');
        } else {
          toast.error(error.message || 'Failed to create account. Please try again.');
          throw error;
        }
      }
    } else {
      // ── Mock signup ──────────────────────────────────────────────────────
      await new Promise(resolve => setTimeout(resolve, 800));
      const extractedName = name || (email.includes('@') ? email.split('@')[0] : '');
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: extractedName,
        email,
        type,
        avatar: extractedName
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(extractedName)}&background=random`
          : `https://ui-avatars.com/api/?name=User&background=random`,
      };
      setUser(mockUser);
      localStorage.setItem('kalaikatha_user', JSON.stringify(mockUser));
      localStorage.setItem('kalaikatha_user_type', type);
      if (name) localStorage.setItem('kalaikatha_name_confirmed', 'true');
      toast.success('Account created! (Demo Mode — add AWS Cognito credentials to go live)');
    }
  };

  // ── Update name ──────────────────────────────────────────────────────────
  const updateName = async (name: string) => {
    if (isCognitoConfigured()) {
      try {
        await updateUserName(name);
      } catch (err) {
        console.warn('Cognito name update failed, updating locally:', err);
      }
    }
    if (user) {
      const updatedUser = {
        ...user,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      };
      setUser(updatedUser);
      localStorage.setItem('kalaikatha_user', JSON.stringify(updatedUser));
      localStorage.setItem('kalaikatha_name_confirmed', 'true');
      toast.success('Name updated successfully!');
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    if (isCognitoConfigured()) {
      signOutUser()
        .then(() => toast.success('Signed out successfully!'))
        .catch(() => toast.error('Failed to sign out.'));
    } else {
      toast.success('Signed out successfully!');
    }
    setUser(null);
    localStorage.removeItem('kalaikatha_user');
    localStorage.removeItem('kalaikatha_user_type');
  };

  if (isLoadingAuth) return null;

  return (
    <AuthContext.Provider value={{ user, login, signup, updateName, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}