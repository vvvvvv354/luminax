import React, { useState } from 'react';
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
  Pause
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
import type { Page, User } from '../App';

interface DashboardProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mentalTrainingActive, setMentalTrainingActive] = useState(false);
  const [socialPostText, setSocialPostText] = useState('');

  // Mock data for the enhanced features
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
    focusTime: 45 // minutes spent on mental training
  };

  // Wearable device data
  const wearableData = {
    steps: 12450,
    heartRate: 145,
    calories: 2340,
    sleepHours: 7.5,
    activeMinutes: 90,
    connected: true,
    devices: ['Apple Watch', 'Fitbit Charge']
  };

  // Social feed data
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
      liked: false
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
      liked: true
    },
    { 
      id: '3',
      user: 'Raj P.', 
      action: 'reached #50 on leaderboard', 
      score: '', 
      time: '6h ago', 
      avatar: 'RP',
      likes: 15,
      comments: 5,
      liked: false
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
    { name: 'Mindfulness', duration: '15 min', type: 'Relaxation', completed: true },
    { name: 'Focus Training', duration: '10 min', type: 'Cognitive', completed: false },
    { name: 'Visualization', duration: '20 min', type: 'Performance', completed: true },
    { name: 'Breathing Exercise', duration: '5 min', type: 'Recovery', completed: true }
  ];

  // AI recommendations based on wearable data
  const aiRecommendations = [
    {
      type: 'rest',
      title: 'Recovery Recommended',
      message: 'Your HRV suggests you may need extra recovery today. Consider light activity.',
      priority: 'high'
    },
    {
      type: 'hydration',
      title: 'Hydration Alert',
      message: 'You\'re 0.8L behind your daily water goal. Stay hydrated!',
      priority: 'medium'
    },
    {
      type: 'sleep',
      title: 'Sleep Optimization',
      message: 'Consider going to bed 30 minutes earlier tonight for optimal recovery.',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
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
                <Trophy className="size-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SportsTalent AI
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
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Overview</span>
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

          {/* Overview Tab - Enhanced */}
          <TabsContent value="overview" className="space-y-8">
            {/* Welcome Message with Wearable Status */}
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
                          {wearableData.devices.length} devices connected
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

            {/* Enhanced Stats with Wearable Data */}
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

            {/* AI Recommendations from Wearable Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="size-5 text-purple-600" />
                  AI Health Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your wearable data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {rec.type === 'rest' && <Clock className="size-4" />}
                        {rec.type === 'hydration' && <Heart className="size-4" />}
                        {rec.type === 'sleep' && <Moon className="size-4" />}
                        <span className="font-medium">{rec.title}</span>
                      </div>
                      <p className="text-sm">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-5 text-yellow-600" />
                  Active Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div>
                    <h3 className="font-semibold">{activeChallenge.test} vs {activeChallenge.opponent}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-green-600">You: {activeChallenge.yourScore}</span>
                      <span className="text-muted-foreground">{activeChallenge.opponent}: {activeChallenge.opponentScore}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Ends in {activeChallenge.endsIn}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Leading!</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mind Gym Tab - New Feature */}
          <TabsContent value="mind-gym" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Mental & Cognitive Training</h2>
                <p className="text-muted-foreground">Develop mental skills and track psychological wellness</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mental Wellness Tracking */}
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
                        <p className="text-xs text-muted-foreground">Mood</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="size-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-lg font-bold">{mentalWellness.sleep}h</p>
                        <p className="text-xs text-muted-foreground">Sleep</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stress Level</span>
                          <span>{mentalWellness.stress}/10</span>
                        </div>
                        <Progress value={(10 - mentalWellness.stress) * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Motivation</span>
                          <span>{mentalWellness.motivation}/10</span>
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

                {/* Cognitive Drills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="size-5 text-purple-600" />
                      Cognitive Drills
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
                          <Timer className="size-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Decision Making</p>
                            <p className="text-sm text-muted-foreground">Under pressure scenarios</p>
                          </div>
                          <Target className="size-5 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Spatial Awareness</p>
                            <p className="text-sm text-muted-foreground">3D positioning tasks</p>
                          </div>
                          <Eye className="size-5 text-purple-600" />
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
                              <p className="font-medium">{session.name}</p>
                              <p className="text-sm text-muted-foreground">{session.duration} • {session.type}</p>
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

          {/* Enhanced Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Social Feed */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="size-5" />
                        Community Feed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Post something */}
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
                        { rank: 4, name: 'You', score: 915, change: '+3' },
                        { rank: 5, name: 'Priya J.', score: 908, change: '+1' }
                      ].map((user) => (
                        <div key={user.rank} className={`flex items-center gap-3 p-2 rounded-lg ${user.name === 'You' ? 'bg-blue-50 border border-blue-200' : ''}`}>
                          <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            user.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.score} pts</p>
                          </div>
                          <Badge variant={user.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                            {user.change}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full gap-2" variant="outline">
                        <Target className="size-4" />
                        Challenge Friend
                      </Button>
                      <Button className="w-full gap-2" variant="outline">
                        <Users className="size-4" />
                        Join Group
                      </Button>
                      <Button className="w-full gap-2" variant="outline">
                        <MessageSquare className="size-4" />
                        Ask Question
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Wearables Tab - New Feature */}
          <TabsContent value="wearables" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Wearable Device Integration</h2>
                <p className="text-muted-foreground">Connect and sync your health and fitness trackers</p>
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
                      Add Device
                    </Button>
                  </CardContent>
                </Card>

                {/* Today's Data */}
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
                      <p className="text-sm text-green-700">Your HRV indicates you're ready for high intensity training</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Resting Heart Rate</span>
                        <span className="font-semibold">62 BPM</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Recovery Score</span>
                        <span className="font-semibold text-green-600">85%</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Training Load</span>
                        <span className="font-semibold text-yellow-600">Moderate</span>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      View Detailed Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Enhanced Tests Tab with only the 10 specific tests */}
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
                      { name: 'Height Measurement', difficulty: 'Easy', duration: '1-2 min', icon: <Activity className="size-8" />, category: 'Anthropometric' },
                      { name: 'Weight Measurement', difficulty: 'Easy', duration: '30 sec', icon: <Heart className="size-8" />, category: 'Anthropometric' },
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
                    <p className="text-sm text-muted-foreground">Combines camera, GPS, and motion sensors for accuracy</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">Offline Mode</h4>
                    <p className="text-sm text-muted-foreground">Upload videos for analysis without internet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other existing tabs would remain similar but enhanced */}
          {/* ... */}

        </Tabs>
      </div>
    </div>
  );
}

function Moon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}