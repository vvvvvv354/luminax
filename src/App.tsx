import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { TestCenter } from './components/TestCenter';
import { OfficialDashboard } from './components/OfficialDashboard';
import { CoachDashboard } from './components/CoachDashboard';
import { ProfileSetup } from './components/ProfileSetup';
import { GlobalAppControls } from './components/GlobalAppControls';
import { UserProfileManagement } from './components/UserProfileManagement';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

export type UserRole = 'athlete' | 'official' | 'coach' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileComplete?: boolean;
  profile?: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    location: string;
    phone: string;
    specialization?: string; // For coaches
    experience?: string; // For coaches
    certifications?: string[]; // For coaches
    parentConsent?: {
      parentName: string;
      parentEmail: string;
      parentPhone: string;
      relationship: string;
      consentDate: string;
      consentGiven: boolean;
    };
  };
}

export type Page = 'landing' | 'auth' | 'profile-setup' | 'dashboard' | 'test-center' | 'official-dashboard' | 'coach-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [showProfileManagement, setShowProfileManagement] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Add global error handling
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Don't set error state for every rejection to avoid breaking the app
      // Only log for debugging
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      // Only set error for critical failures
      if (event.error?.message?.includes('timeout') || event.error?.message?.includes('getPage')) {
        setAppError('Application timeout - please refresh the page');
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (!userData.profileComplete && (userData.role === 'athlete' || userData.role === 'coach')) {
      setCurrentPage('profile-setup');
    } else if (userData.role === 'official') {
      setCurrentPage('official-dashboard');
    } else if (userData.role === 'coach') {
      setCurrentPage('coach-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleProfileComplete = (profileData: User['profile']) => {
    if (user) {
      setUser({
        ...user,
        profile: profileData,
        profileComplete: true
      });
      if (user.role === 'coach') {
        setCurrentPage('coach-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleOpenProfileManagement = () => {
    setShowProfileManagement(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'profile-setup':
        return <ProfileSetup user={user} onComplete={handleProfileComplete} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} onOpenProfile={handleOpenProfileManagement} />;
      case 'test-center':
        return <TestCenter user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'official-dashboard':
        return <OfficialDashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} onOpenProfile={handleOpenProfileManagement} />;
      case 'coach-dashboard':
        return <CoachDashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} onOpenProfile={handleOpenProfileManagement} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // Show error state if there's a critical error
  if (appError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <p className="text-muted-foreground mb-6">{appError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <div className="min-h-screen bg-background">
          {renderPage()}
          
          {/* Global Controls - Show only when user is logged in and not on landing/auth pages */}
          {user && currentPage !== 'landing' && currentPage !== 'auth' && (
            <GlobalAppControls />
          )}

          {/* Profile Management Modal */}
          {showProfileManagement && (
            <UserProfileManagement
              user={user}
              onUpdate={handleUpdateUser}
              onClose={() => setShowProfileManagement(false)}
            />
          )}
        </div>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}