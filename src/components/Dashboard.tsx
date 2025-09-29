import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Play, 
  BarChart3, 
  Target, 
  Calendar, 
  Award,
  TrendingUp,
  Clock,
  Camera,
  Users,
  Settings,
  LogOut,
  Star,
  Zap,
  Medal,
  Heart,
  Brain,
  Activity,
  BookOpen,
  MessageCircle,
  Bell,
  MapPin,
  Timer,
  Flame,
  ShieldCheck,
  LineChart,
  Apple,
  Dumbbell,
  Video,
  Share2,
  Download,
  Gift,
  Crown,
  Sparkles,
  TrendingDown,
  Plus,
  Headphones,
  Smartphone,
  Wifi,
  Send,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Eye,
  MessageSquare,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Pause,
  Ruler,
  Weight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { SportRecommendationEngine } from './SportRecommendationEngine';
import type { Page, User } from '../App';

interface DashboardProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function Dashboard({ user, onNavigate, onLogout, onOpenProfile }: DashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [socialPostText, setSocialPostText] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');

  const stats = [
    { label: 'Tests Completed', value: '24', change: '+8 this month', icon: <Target className="size-5" />, color: 'text-blue-600' },
    { label: 'Current Rank', value: '#156', change: '+42 positions', icon: <Trophy className="size-5" />, color: 'text-yellow-600' },
    { label: 'Fitness Score', value: '92', change: '+15 points', icon: <Activity className="size-5" />, color: 'text-green-600' },
    { label: 'Streak Days', value: '45', change: 'Personal best!', icon: <Flame className="size-5" />, color: 'text-orange-600' }
  ];

  // Mental wellness data
  const mentalWellness = {
    mood: 8,
    stress: 3,
    sleep: 7.5,
    motivation: 9,
    focusTime: 45, // minutes spent on mental training
    sessionsCompleted: 12
  };

  // Wearable device data
  const wearableData = {
    steps: 12450,
    heartRate: 145,
    calories: 2340,
    sleepHours: 7.5,
    activeMinutes: 90,
    connected: true,
    devices: ['Apple Watch', 'Fitbit Charge'],
    hrv: 42,
    recoveryScore: 85
  };

  // Enhanced social feed with interaction
  const socialFeed = [
    { 
      id: '1',
      user: 'Arjun K.', 
      action: 'completed Vertical Jump test', 
      score: '95%', 
      time: '2h ago', 
      avatar: 'AK',
      likes: 12,
      comments: 3,
      liked: false,
      type: 'test_completion'
    },
    { 
      id: '2',
      user: 'Priya S.', 
      action: 'earned Speed Demon badge', 
      score: '', 
      time: '4h ago', 
      avatar: 'PS',
      likes: 8,
      comments: 1,
      liked: true,
      type: 'achievement'
    },
    { 
      id: '3',
      user: 'Raj P.', 
      action: 'asked: "What\'s the best warm-up for sprint training?"', 
      score: '', 
      time: '6h ago', 
      avatar: 'RP',
      likes: 15,
      comments: 5,
      liked: false,
      type: 'question'
    }
  ];

  // Active challenges
  const activeChallenge = {
    opponent: 'Priya S.',
    test: '30m Sprint',
    yourScore: '4.2s',
    opponentScore: 'Not completed',
    endsIn: '2 days',
    status: 'leading'
  };

  // Mental training sessions
  const mentalSessions = [
    { 
      name: 'Mindfulness Meditation', 
      duration: '15 min', 
      type: 'Relaxation', 
      completed: true,
      description: 'Reduce stress and improve focus'
    },
    { 
      name: 'Reaction Time Training', 
      duration: '10 min', 
      type: 'Cognitive', 
      completed: false,
      description: 'Enhance response speed and decision making'
    },
    { 
      name: 'Competition Visualization', 
      duration: '20 min', 
      type: 'Performance', 
      completed: true,
      description: 'Mental preparation for competitions'
    },
    { 
      name: 'Breathing Techniques', 
      duration: '8 min', 
      type: 'Recovery', 
      completed: true,
      description: 'Improve recovery and manage anxiety'
    }
  ];

  // AI recommendations based on wearable data
  const aiRecommendations = [
    {
      type: 'rest',
      title: 'Recovery Day Recommended',
      message: 'Your HRV is 15% below baseline. Consider active recovery today.',
      priority: 'high',
      icon: <Heart className="size-4" />
    },
    {
      type: 'hydration',
      title: 'Hydration Alert',
      message: 'You\'re 0.8L behind your daily water goal. Stay hydrated!',
      priority: 'medium',
      icon: <Activity className="size-4" />
    },
    {
      type: 'sleep',
      title: 'Sleep Optimization',
      message: 'Going to bed 30 minutes earlier could improve recovery by 12%.',
      priority: 'low',
      icon: <Clock className="size-4" />
    }
  ];

  const progressData = [
    { month: 'Jan', fitness: 65, endurance: 70, strength: 60, flexibility: 55 },
    { month: 'Feb', fitness: 70, endurance: 72, strength: 65, flexibility: 58 },
    { month: 'Mar', fitness: 75, endurance: 75, strength: 70, flexibility: 62 },
    { month: 'Apr', fitness: 80, endurance: 78, strength: 75, flexibility: 65 },
    { month: 'May', fitness: 85, endurance: 82, strength: 78, flexibility: 68 },
    { month: 'Jun', fitness: 92, endurance: 85, strength: 82, flexibility: 72 }
  ];

  const badges = [
    { name: 'First Test', icon: <Star className="size-4" />, earned: true, rarity: 'common' },
    { name: 'Speed Demon', icon: <Zap className="size-4" />, earned: true, rarity: 'rare' },
    { name: 'Endurance Pro', icon: <Clock className="size-4" />, earned: false, rarity: 'epic' },
    { name: 'Perfect Form', icon: <Target className="size-4" />, earned: true, rarity: 'rare' },
    { name: 'Rising Star', icon: <TrendingUp className="size-4" />, earned: true, rarity: 'epic' },
    { name: 'Champion', icon: <Crown className="size-4" />, earned: false, rarity: 'legendary' },
    { name: 'Mental Focus', icon: <Brain className="size-4" />, earned: true, rarity: 'rare' },
    { name: 'AI Verified', icon: <ShieldCheck className="size-4" />, earned: true, rarity: 'epic' }
  ];

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 border-gray-300';
      case 'rare': return 'bg-blue-100 border-blue-300';
      case 'epic': return 'bg-purple-100 border-purple-300';
      case 'legendary': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getMentalWellnessColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="size-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-white text-lg font-bold">⚡</div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LuminaX
                </h1>
                <p className="text-sm text-muted-foreground">Athlete Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="size-4" />
                <Badge variant="destructive" className="ml-1">3</Badge>
              </Button>
              
              <Button onClick={() => onNavigate('test-center')} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Camera className="size-4" />
                Start Test
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {getInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" />
                    {user?.profile?.location || 'India'}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-9 lg:w-auto lg:grid-cols-9 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 font-semibold">
              <Brain className="size-4" />
              <span className="hidden sm:inline">🎯 AI Sports</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="gap-2">
              <Play className="size-4" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <LineChart className="size-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <Dumbbell className="size-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2">
              <Apple className="size-4" />
              <span className="hidden sm:inline">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="mind-gym" className="gap-2">
              <Brain className="size-4" />
              <span className="hidden sm:inline">Mind Gym</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="wearables" className="gap-2">
              <Smartphone className="size-4" />
              <span className="hidden sm:inline">Wearables</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Welcome Message with Wearable Integration */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 🚀</h2>
                      <p className="text-blue-100 mb-4">Your wearables show you're ready for peak performance today!</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Flame className="size-4" />
                          45 day streak
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="size-4" />
                          {wearableData.heartRate} BPM
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className="size-4" />
                          {wearableData.devices.length} devices
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Trophy className="size-16 text-yellow-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-blue-50 ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <TrendingUp className="size-4 text-green-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Sparkles className="size-3" />
                          {stat.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* AI Health Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="size-5 text-purple-600" />
                  AI Health Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your wearable data and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {rec.icon}
                        <span className="font-medium">{rec.title}</span>
                      </div>
                      <p className="text-sm">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Challenge Display */}
            {activeChallenge && (
              <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="size-5 text-yellow-600" />
                    Active Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-yellow-200 bg-white/50">
                    <div>
                      <h3 className="font-semibold">{activeChallenge.test} vs {activeChallenge.opponent}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-green-600">You: {activeChallenge.yourScore}</span>
                        <span className="text-muted-foreground">{activeChallenge.opponent}: {activeChallenge.opponentScore}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Ends in {activeChallenge.endsIn}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">You're Leading!</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Sport Recommendations - Highlighted Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 via-white to-blue-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="size-5 text-purple-600" />
                    🎯 AI Sport Recommendations
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      New Analysis
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Based on your fitness test results and performance data, here are sports where you could excel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Top Recommendation */}
                    <div className="p-4 rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏃‍♂️</span>
                          <div>
                            <h4 className="font-semibold text-green-800">Athletics</h4>
                            <p className="text-xs text-green-600">Highly Recommended</p>
                          </div>
                        </div>
                        <Star className="size-5 text-yellow-500 fill-current" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className="font-semibold text-green-700">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">Speed</Badge>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">Agility</Badge>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">Power</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Second Recommendation */}
                    <div className="p-4 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏀</span>
                          <div>
                            <h4 className="font-semibold text-blue-800">Basketball</h4>
                            <p className="text-xs text-blue-600">Recommended</p>
                          </div>
                        </div>
                        <Trophy className="size-5 text-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className="font-semibold text-blue-700">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">Height</Badge>
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">Jumping</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Third Recommendation */}
                    <div className="p-4 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⚽</span>
                          <div>
                            <h4 className="font-semibold text-purple-800">Football</h4>
                            <p className="text-xs text-purple-600">Good Potential</p>
                          </div>
                        </div>
                        <Target className="size-5 text-purple-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className="font-semibold text-purple-700">82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">Endurance</Badge>
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">Agility</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/70 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Want detailed analysis?</h4>
                        <p className="text-sm text-gray-600">Get comprehensive sport recommendations with training plans tailored for each sport</p>
                      </div>
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Award className="size-4" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* AI Sports Recommendations Tab - Highlighted Main Feature */}
          <TabsContent value="ai-recommendations" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                <Brain className="size-6" />
                <h1 className="text-xl font-bold">🎯 AI Sports Recommendations</h1>
                <Star className="size-6" />
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Discover your perfect sport match! Our advanced AI analyzes your fitness test results, physical attributes, and performance data to recommend sports where you can excel.
              </p>
            </motion.div>

            {/* Comprehensive Sport Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top Recommendation - Featured */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-xl">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="size-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                          🏃‍♂️
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                          #1 Match
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-3xl text-green-800 mb-2">Athletics - Sprint Events</CardTitle>
                    <CardDescription className="text-lg">Your top recommended sport based on comprehensive analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-green-700 mb-2">94%</div>
                      <p className="text-lg font-semibold text-green-600">Perfect Match Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full shadow-sm" style={{width: '94%'}}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-800 mb-3">💪 Key Strengths</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">Explosive Speed</Badge>
                            <span className="text-sm font-medium">98%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">Power Output</Badge>
                            <span className="text-sm font-medium">96%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">Agility</Badge>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">Reaction Time</Badge>
                            <span className="text-sm font-medium">89%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-800 mb-3">🎯 Recommended Events</h4>
                        <div className="space-y-2">
                          <div className="p-2 bg-white rounded-lg border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">100m Sprint</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">Elite</Badge>
                            </div>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">200m Sprint</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">High</Badge>
                            </div>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Long Jump</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">High</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">🧠 AI Analysis Summary</h4>
                      <p className="text-sm text-green-700">
                        Your exceptional 30m sprint time (4.1s), outstanding vertical jump (78cm), and superior agility scores indicate elite-level sprinting potential. Your power-to-weight ratio and muscle fiber composition are ideal for explosive sprint events.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Trophy className="size-4 mr-2" />
                        Start Training Plan
                      </Button>
                      <Button variant="outline" className="flex-1 border-green-300 text-green-700">
                        <Award className="size-4 mr-2" />
                        View Full Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Other Recommendations */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🏀</div>
                          <div>
                            <h3 className="font-bold text-blue-800">Basketball</h3>
                            <p className="text-sm text-blue-600">#2 Recommendation</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">87%</div>
                          <Progress value={87} className="h-2 w-16" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">Height Advantage</Badge>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">Jumping Power</Badge>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">Hand-Eye Coordination</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-4 border-blue-300 text-blue-700">
                        Explore Basketball
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">⚽</div>
                          <div>
                            <h3 className="font-bold text-purple-800">Football</h3>
                            <p className="text-sm text-purple-600">#3 Recommendation</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-700">82%</div>
                          <Progress value={82} className="h-2 w-16" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">Endurance</Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">Agility</Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">Team Coordination</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-4 border-purple-300 text-purple-700">
                        Explore Football
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="border border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl">🏐</div>
                          <div>
                            <h3 className="font-bold text-orange-800">Volleyball</h3>
                            <p className="text-sm text-orange-600">#4 Recommendation</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-700">78%</div>
                          <Progress value={78} className="h-2 w-16" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs">Vertical Jump</Badge>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs">Reflexes</Badge>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs">Reach</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-4 border-orange-300 text-orange-700">
                        Explore Volleyball
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Detailed Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-blue-600" />
                      Physical Attribute Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { attribute: 'Speed & Acceleration', score: 98, color: 'bg-green-500' },
                        { attribute: 'Power & Explosiveness', score: 96, color: 'bg-green-500' },
                        { attribute: 'Agility & Coordination', score: 92, color: 'bg-blue-500' },
                        { attribute: 'Endurance', score: 78, color: 'bg-yellow-500' },
                        { attribute: 'Flexibility', score: 74, color: 'bg-orange-500' },
                        { attribute: 'Strength', score: 71, color: 'bg-orange-500' }
                      ].map((attr, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{attr.attribute}</span>
                            <span className="font-bold">{attr.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full ${attr.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${attr.score}%` }}
                              transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-5 text-purple-600" />
                      Training Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">🎯 Immediate Focus</h4>
                        <p className="text-sm text-green-700">Continue sprint-specific training. Work on starts and acceleration technique.</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">💪 Strength Areas</h4>
                        <p className="text-sm text-blue-700">Develop upper body strength for medicine ball throw improvement.</p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">🧘 Flexibility Work</h4>
                        <p className="text-sm text-orange-700">Regular stretching sessions to improve sit-and-reach performance.</p>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                        <BookOpen className="size-4 mr-2" />
                        Get Personalized Training Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Tests Tab - Only the 10 SAI Standard Tests */}
          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>SAI Standard Fitness Tests</CardTitle>
                  <CardDescription>10 scientifically validated assessments used by Sports Authority of India</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Height Measurement', difficulty: 'Easy', duration: '1-2 min', icon: <Ruler className="size-8" />, category: 'Anthropometric' },
                      { name: 'Weight Measurement', difficulty: 'Easy', duration: '30 sec', icon: <Weight className="size-8" />, category: 'Anthropometric' },
                      { name: 'Sit and Reach', difficulty: 'Easy', duration: '2-3 min', icon: <Activity className="size-8" />, category: 'Flexibility' },
                      { name: 'Vertical Jump', difficulty: 'Medium', duration: '2-3 min', icon: <TrendingUp className="size-8" />, category: 'Power' },
                      { name: 'Broad Jump', difficulty: 'Medium', duration: '3-4 min', icon: <Target className="size-8" />, category: 'Power' },
                      { name: 'Medicine Ball Throw', difficulty: 'Hard', duration: '4-5 min', icon: <Dumbbell className="size-8" />, category: 'Strength' },
                      { name: '30m Sprint', difficulty: 'Medium', duration: '3-4 min', icon: <Zap className="size-8" />, category: 'Speed' },
                      { name: '4×10m Shuttle Run', difficulty: 'Hard', duration: '4-5 min', icon: <Activity className="size-8" />, category: 'Agility' },
                      { name: 'Sit-ups Endurance', difficulty: 'Medium', duration: '60 sec', icon: <Target className="size-8" />, category: 'Endurance' },
                      { name: '800m/1.6km Run', difficulty: 'Hard', duration: '3-15 min', icon: <Timer className="size-8" />, category: 'Endurance' }
                    ].map((test) => (
                      <motion.div key={test.name} whileHover={{ scale: 1.02 }}>
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500" onClick={() => onNavigate('test-center')}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-blue-600">
                                {test.icon}
                              </div>
                              <div className="text-right">
                                <Badge variant={test.difficulty === 'Hard' ? 'destructive' : test.difficulty === 'Medium' ? 'default' : 'secondary'} className="mb-1">
                                  {test.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs block">
                                  {test.category}
                                </Badge>
                              </div>
                            </div>
                            <h3 className="font-semibold mb-2">{test.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">Duration: {test.duration}</p>
                            <Button size="sm" className="w-full">Start Test</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="size-5" />
                    AI-Powered Testing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Computer Vision</h4>
                    <p className="text-sm text-muted-foreground">Real-time movement analysis and form correction</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">SAI Standards</h4>
                    <p className="text-sm text-muted-foreground">Tests follow official Sports Authority of India protocols</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">Sensor Fusion</h4>
                    <p className="text-sm text-muted-foreground">Combines camera, GPS, and motion sensors</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">Offline Mode</h4>
                    <p className="text-sm text-muted-foreground">Upload videos for analysis without internet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mind Gym Tab - New Mental Training Feature */}
          <TabsContent value="mind-gym" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Mental & Cognitive Training</h2>
                <p className="text-muted-foreground">Develop mental skills that are as important as physical training</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mental Wellness Dashboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="size-5 text-red-600" />
                      Mental Wellness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Heart className="size-6 mx-auto mb-1 text-green-600" />
                        <p className="text-lg font-bold">{mentalWellness.mood}</p>
                        <p className="text-xs text-muted-foreground">Mood /10</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="size-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-lg font-bold">{mentalWellness.sleep}h</p>
                        <p className="text-xs text-muted-foreground">Sleep Quality</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stress Level</span>
                          <span className={getMentalWellnessColor(10 - mentalWellness.stress)}>{mentalWellness.stress}/10</span>
                        </div>
                        <Progress value={(10 - mentalWellness.stress) * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Motivation</span>
                          <span className={getMentalWellnessColor(mentalWellness.motivation)}>{mentalWellness.motivation}/10</span>
                        </div>
                        <Progress value={mentalWellness.motivation * 10} className="h-2" />
                      </div>
                    </div>

                    <Button className="w-full gap-2">
                      <Plus className="size-4" />
                      Log Today's Mood
                    </Button>
                  </CardContent>
                </Card>

                {/* Cognitive Training */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="size-5 text-purple-600" />
                      Cognitive Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Reaction Time</p>
                            <p className="text-sm text-muted-foreground">Visual stimulus response</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-blue-600">245ms</p>
                            <p className="text-xs text-muted-foreground">Best</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Decision Making</p>
                            <p className="text-sm text-muted-foreground">Under pressure scenarios</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-green-600">87%</p>
                            <p className="text-xs text-muted-foreground">Accuracy</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Spatial Awareness</p>
                            <p className="text-sm text-muted-foreground">3D positioning tasks</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-purple-600">92%</p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center pt-2">
                      <p className="text-sm text-muted-foreground mb-2">Focus Time Today</p>
                      <p className="text-2xl font-bold text-blue-600">{mentalWellness.focusTime} min</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Guided Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="size-5 text-green-600" />
                      Guided Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {mentalSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full flex items-center justify-center ${
                              session.completed ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {session.completed ? (
                                <CheckCircle className="size-5 text-green-600" />
                              ) : (
                                <Play className="size-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{session.name}</p>
                              <p className="text-xs text-muted-foreground">{session.duration} • {session.type}</p>
                            </div>
                          </div>
                          <Button size="sm" variant={session.completed ? "outline" : "default"}>
                            {session.completed ? 'Replay' : 'Start'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Enhanced Social Tab with Community Features */}
          <TabsContent value="social" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enhanced Social Feed */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="size-5" />
                        Community Feed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Create Post */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Share your progress, ask questions, or motivate others..."
                              value={socialPostText}
                              onChange={(e) => setSocialPostText(e.target.value)}
                              className="min-h-20"
                            />
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Camera className="size-4" />
                                  Photo
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Trophy className="size-4" />
                                  Achievement
                                </Button>
                              </div>
                              <Button size="sm" className="gap-2">
                                <Send className="size-4" />
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Feed Items */}
                      {socialFeed.map((post) => (
                        <div key={post.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <Avatar className="size-10">
                              <AvatarFallback>{post.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{post.user}</span>
                                <span className="text-sm text-muted-foreground">{post.time}</span>
                                {post.type === 'achievement' && <Star className="size-4 text-yellow-500" />}
                              </div>
                              <p className="text-sm mb-2">
                                {post.action} {post.score && <Badge variant="outline" className="ml-1">{post.score}</Badge>}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <button className={`flex items-center gap-1 hover:text-red-600 transition-colors ${post.liked ? 'text-red-600' : ''}`}>
                                  <Heart className={`size-4 ${post.liked ? 'fill-current' : ''}`} />
                                  {post.likes}
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                  <MessageCircle className="size-4" />
                                  {post.comments}
                                </button>
                                <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                                  <Share2 className="size-4" />
                                  Share
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Social Sidebar */}
                <div className="space-y-6">
                  {/* Challenge Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="size-5 text-yellow-600" />
                        Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full gap-2" variant="outline">
                        <Target className="size-4" />
                        Challenge Friend
                      </Button>
                      
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-900 text-sm">Active Challenge</p>
                        <p className="text-sm text-green-700">30m Sprint vs Priya S.</p>
                        <p className="text-xs text-muted-foreground">You're leading! Ends in 2 days</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Leaderboard */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="size-5 text-yellow-600" />
                        Leaderboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { rank: 1, name: 'Arjun K.', score: 945, change: '+5' },
                        { rank: 2, name: 'Meera S.', score: 932, change: '+2' },
                        { rank: 3, name: 'Rahul P.', score: 928, change: '-1' },
                        { rank: 156, name: 'You', score: 915, change: '+42' },
                        { rank: 157, name: 'Priya J.', score: 908, change: '+1' }
                      ].map((athlete) => (
                        <div key={athlete.rank} className={`flex items-center gap-3 p-2 rounded-lg ${athlete.name === 'You' ? 'bg-blue-50 border border-blue-200' : ''}`}>
                          <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            athlete.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {athlete.rank <= 3 ? <Crown className="size-4" /> : athlete.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{athlete.name}</p>
                            <p className="text-xs text-muted-foreground">{athlete.score} pts</p>
                          </div>
                          <Badge variant={athlete.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                            {athlete.change}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Community Groups */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        Groups
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full gap-2" variant="outline">
                        <Plus className="size-4" />
                        Create Group
                      </Button>
                      
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">Delhi Athletes</p>
                          <p className="text-xs text-muted-foreground">24 members • 12 active challenges</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">Sprint Training Club</p>
                          <p className="text-xs text-muted-foreground">56 members • 8 active challenges</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Wearables Integration Tab */}
          <TabsContent value="wearables" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Wearable Device Integration</h2>
                <p className="text-muted-foreground">Connect your health trackers for comprehensive performance insights</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Connected Devices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="size-5" />
                      Connected Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {wearableData.devices.map((device, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Wifi className="size-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{device}</p>
                              <p className="text-sm text-muted-foreground">Last sync: 5 min ago</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full gap-2">
                      <Plus className="size-4" />
                      Connect New Device
                    </Button>
                  </CardContent>
                </Card>

                {/* Today's Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="size-5" />
                      Today's Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{wearableData.steps.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Steps</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-lg font-bold text-red-600">{wearableData.calories}</p>
                        <p className="text-xs text-muted-foreground">Calories</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Daily Steps Goal</span>
                          <span>{wearableData.steps.toLocaleString()}/10,000</span>
                        </div>
                        <Progress value={(wearableData.steps / 10000) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Active Minutes</span>
                          <span>{wearableData.activeMinutes}/60 min</span>
                        </div>
                        <Progress value={(wearableData.activeMinutes / 60) * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sleep Quality</span>
                          <span>{wearableData.sleepHours}h / 8h</span>
                        </div>
                        <Progress value={(wearableData.sleepHours / 8) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="size-5" />
                      Health Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <Heart className="size-8 mx-auto mb-2 text-green-600" />
                      <p className="font-semibold text-green-900 mb-1">Excellent Recovery</p>
                      <p className="text-sm text-green-700">Your HRV indicates optimal training readiness</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">HRV Score</span>
                        <span className="font-semibold text-green-600">{wearableData.hrv}ms</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Recovery Score</span>
                        <span className="font-semibold text-green-600">{wearableData.recoveryScore}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Resting HR</span>
                        <span className="font-semibold">62 BPM</span>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      View Detailed Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Enhanced Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5" />
                    AI-Generated Training Plans
                  </CardTitle>
                  <CardDescription>Personalized training based on your performance data and wearables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      name: 'Strength & Power Focus', 
                      duration: '4 weeks', 
                      difficulty: 'Intermediate', 
                      progress: 65, 
                      icon: <Dumbbell className="size-5" />,
                      aiGenerated: true,
                      description: 'Based on your vertical jump and medicine ball results'
                    },
                    { 
                      name: 'Cardiovascular Enhancement', 
                      duration: '3 weeks', 
                      difficulty: 'Beginner', 
                      progress: 80, 
                      icon: <Heart className="size-5" />,
                      aiGenerated: true,
                      description: 'Tailored to your endurance test scores and HR data'
                    },
                    { 
                      name: 'Flexibility & Mobility', 
                      duration: '2 weeks', 
                      difficulty: 'All levels', 
                      progress: 45, 
                      icon: <Activity className="size-5" />,
                      aiGenerated: false,
                      description: 'Improve sit-and-reach performance'
                    }
                  ].map((plan) => (
                    <div key={plan.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            {plan.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{plan.name}</h4>
                              {plan.aiGenerated && (
                                <Badge variant="outline" className="text-xs">
                                  <Brain className="size-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{plan.duration} • {plan.difficulty}</p>
                            <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                          </div>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="size-5" />
                    Performance Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Focus on Endurance</h4>
                    <p className="text-sm text-blue-700 mb-3">Your cardiovascular metrics suggest 15% improvement potential with targeted training</p>
                    <Button size="sm" variant="outline">View Endurance Plan</Button>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Recovery Optimization</h4>
                    <p className="text-sm text-green-700 mb-3">Your sleep data shows room for improvement. Better recovery = better performance</p>
                    <Button size="sm" variant="outline">Sleep Guide</Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-2">Mental Training</h4>
                    <p className="text-sm text-purple-700 mb-3">Combine physical training with cognitive exercises for peak performance</p>
                    <Button size="sm" variant="outline">Mind Gym</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="size-5" />
                    Daily Nutrition Goals
                  </CardTitle>
                  <CardDescription>Track your nutrition targets with wearable integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { goal: 'Daily Calories', current: 2450, target: 2800, unit: 'kcal', source: 'wearable' },
                    { goal: 'Protein Intake', current: 85, target: 120, unit: 'g', source: 'manual' },
                    { goal: 'Water Intake', current: 2.2, target: 3.0, unit: 'L', source: 'app' },
                    { goal: 'Sleep Hours', current: wearableData.sleepHours, target: 8.0, unit: 'hrs', source: 'wearable' }
                  ].map((goal) => (
                    <div key={goal.goal} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{goal.goal}</span>
                          {goal.source === 'wearable' && (
                            <Badge variant="outline" className="text-xs">
                              <Wifi className="size-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="size-5" />
                    AI Meal Suggestions
                  </CardTitle>
                  <CardDescription>Personalized nutrition based on your training load and goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      meal: 'Pre-workout', 
                      suggestion: 'Banana + Almonds', 
                      calories: '200 kcal',
                      reason: 'Quick energy for your sprint training'
                    },
                    { 
                      meal: 'Post-workout', 
                      suggestion: 'Protein Shake + Berries', 
                      calories: '250 kcal',
                      reason: 'Optimal recovery window nutrition'
                    },
                    { 
                      meal: 'Lunch', 
                      suggestion: 'Quinoa Bowl + Chicken', 
                      calories: '450 kcal',
                      reason: 'Sustained energy for afternoon activities'
                    },
                    { 
                      meal: 'Dinner', 
                      suggestion: 'Salmon + Vegetables', 
                      calories: '400 kcal',
                      reason: 'Omega-3s for recovery and sleep'
                    }
                  ].map((item) => (
                    <div key={item.meal} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{item.meal}</p>
                          <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                        </div>
                        <span className="text-sm font-medium">{item.calories}</span>
                      </div>
                      <p className="text-xs text-blue-600">{item.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs remain similar with enhancements... */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="size-5 text-blue-600" />
                  Performance Trends with Wearable Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="fitness" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                    <Line type="monotone" dataKey="endurance" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                    <Line type="monotone" dataKey="strength" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                    <Line type="monotone" dataKey="flexibility" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}