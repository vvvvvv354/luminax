import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Trophy, Users, Smartphone, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Page, User, UserRole } from '../App';

interface AuthPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: Page) => void;
}

export function AuthPage({ onLogin, onNavigate }: AuthPageProps) {
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userRole, setUserRole] = useState<UserRole>('athlete');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Demo User',
      email: formData.email || 'demo@example.com',
      role: userRole,
      profileComplete: authMode === 'signin' // Assume existing users have complete profiles
    };

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Navigation */}
      <nav className="p-6">
        <Button variant="ghost" onClick={() => onNavigate('landing')} className="gap-2">
          <ArrowLeft className="size-4" />
          {t('back')}
        </Button>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-md">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="size-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="size-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('sai_title')}</h1>
            <p className="text-muted-foreground">{t('welcome')}</p>
          </div>

          <Card>
            <CardHeader>
              <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">{t('sign_in')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('sign_up')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>{t('choose_role')}</Label>
                  <Select value={userRole || ''} onValueChange={(value) => setUserRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('choose_role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="athlete">
                        <div className="flex items-center gap-2">
                          <Smartphone className="size-4" />
                          {t('athlete_role')}
                        </div>
                      </SelectItem>
                      <SelectItem value="coach">
                        <div className="flex items-center gap-2">
                          <Trophy className="size-4" />
                          {t('coach_role')}
                        </div>
                      </SelectItem>
                      <SelectItem value="official">
                        <div className="flex items-center gap-2">
                          <Users className="size-4" />
                          {t('official_role')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {authMode === 'signup' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {authMode === 'signup' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                {authMode === 'signup' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </motion.div>
                )}

                <Button type="submit" className="w-full">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-primary hover:underline"
                  >
                    {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {authMode === 'signin' && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
                  <p className="text-xs text-muted-foreground">Email: demo@athlete.com (Athlete)</p>
                  <p className="text-xs text-muted-foreground">Email: coach@sai.gov.in (Coach/Scout)</p>
                  <p className="text-xs text-muted-foreground">Email: official@sai.gov.in (Official)</p>
                  <p className="text-xs text-muted-foreground">Password: demo123</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}