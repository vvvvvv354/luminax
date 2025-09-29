import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Users, 
  Trophy, 
  Target, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Eye,
  Star,
  Plus,
  Send,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Activity,
  Clock,
  Heart,
  Zap,
  Brain,
  Video,
  UserPlus,
  BookOpen,
  Bell,
  Settings,
  BarChart3,
  Medal,
  Award,
  Timer,
  FileText,
  Camera,
  PlayCircle,
  Headphones,
  Shield,
  Smartphone,
  Wifi,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Page, User } from '../App';

interface CoachDashboardProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

interface Athlete {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: string;
  joinDate: string;
  lastActive: string;
  stats: {
    testsCompleted: number;
    averageScore: number;
    improvement: number;
    injuryRisk: 'low' | 'medium' | 'high';
  };
  mentalWellness: {
    mood: number;
    stress: number;
    sleep: number;
    motivation: number;
  };
  wearableData: {
    steps: number;
    heartRate: number;
    calories: number;
    sleepHours: number;
  };
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: string[];
  assignedTo: string[];
  completionRate: number;
}

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Mock data - moved outside component to prevent re-creation on every render
const mockRoster: Athlete[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      avatar: '/api/placeholder/40/40',
      position: 'Sprinter',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      stats: {
        testsCompleted: 24,
        averageScore: 87,
        improvement: 12,
        injuryRisk: 'low'
      },
      mentalWellness: {
        mood: 8,
        stress: 3,
        sleep: 7,
        motivation: 9
      },
      wearableData: {
        steps: 12450,
        heartRate: 145,
        calories: 2340,
        sleepHours: 7.5
      }
    },
    {
      id: '2',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@email.com',
      avatar: '/api/placeholder/40/40',
      position: 'Long Jump',
      joinDate: '2024-02-01',
      lastActive: '5 hours ago',
      stats: {
        testsCompleted: 18,
        averageScore: 92,
        improvement: 8,
        injuryRisk: 'medium'
      },
      mentalWellness: {
        mood: 6,
        stress: 7,
        sleep: 6,
        motivation: 7
      },
      wearableData: {
        steps: 8960,
        heartRate: 152,
        calories: 1890,
        sleepHours: 6.2
      }
    },
    {
      id: '3',
      name: 'Anjali Patel',
      email: 'anjali.patel@email.com',
      avatar: '/api/placeholder/40/40',
      position: 'Distance Runner',
      joinDate: '2024-01-20',
      lastActive: '1 hour ago',
      stats: {
        testsCompleted: 31,
        averageScore: 89,
        improvement: 15,
        injuryRisk: 'low'
      },
      mentalWellness: {
        mood: 9,
        stress: 2,
        sleep: 8,
        motivation: 9
      },
      wearableData: {
        steps: 15780,
        heartRate: 138,
        calories: 2890,
        sleepHours: 8.1
      }
    }
  ];

const mockTrainingPlans: TrainingPlan[] = [
  {
    id: '1',
    name: 'Sprint Power Development',
    description: 'Focused on explosive power and acceleration',
    duration: '4 weeks',
    difficulty: 'Advanced',
    exercises: ['30m Sprint', 'Vertical Jump', 'Medicine Ball Throw'],
    assignedTo: ['1', '2'],
    completionRate: 75
  },
  {
    id: '2',
    name: 'Endurance Base Building',
    description: 'Building cardiovascular foundation',
    duration: '6 weeks',
    difficulty: 'Intermediate',
    exercises: ['800m Run', 'Sit-ups', 'Flexibility'],
    assignedTo: ['3'],
    completionRate: 60
  }
];

const mockWatchlist = [
  { id: '4', name: 'Arjun Singh', potential: 'High', lastTest: '2 days ago', score: 94 },
  { id: '5', name: 'Meera Joshi', potential: 'Medium', lastTest: '1 week ago', score: 78 }
];

// Helper functions
const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getMentalWellnessColor = (score: number) => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
};

export function CoachDashboard({ user, onNavigate, onLogout, onOpenProfile }: CoachDashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showPersonalPlan, setShowPersonalPlan] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedAthleteForAction, setSelectedAthleteForAction] = useState<string>('');

  // Use the mock data (moved outside component)
  const roster = mockRoster;
  const trainingPlans = mockTrainingPlans;
  const watchlist = mockWatchlist;
  
  const recentMessages: Message[] = [
    {
      id: '1',
      from: '1',
      to: user?.id || '',
      content: 'Coach, I need help with my sprint technique. Can we schedule a session?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      from: '3',
      to: user?.id || '',
      content: 'Thank you for the training plan. My endurance has improved significantly!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true
    }
  ];

  // Handler functions for coaching features
  const handleViewAthleteProfile = (athleteId: string) => {
    setSelectedAthlete(athleteId);
    // In a real app, this would navigate to detailed athlete profile
    alert(`Opening profile for athlete ${athleteId}`);
  };

  const handleMessageAthlete = (athleteId: string) => {
    setSelectedAthleteForAction(athleteId);
    setShowMessaging(true);
  };

  const handleCreatePersonalPlan = (athleteId: string) => {
    setSelectedAthleteForAction(athleteId);
    setShowPersonalPlan(true);
  };

  const handleScheduleSession = (athleteId: string) => {
    setSelectedAthleteForAction(athleteId);
    setShowScheduleModal(true);
  };

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      // In a real app, this would send the message to the athlete
      alert(`Message sent to athlete ${selectedAthleteForAction}: ${messageContent}`);
      setMessageContent('');
      setShowMessaging(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="size-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-lg font-bold">⚡</div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  LuminaX - Coach Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Athlete Development • {user?.name} • {roster.length} {t('athletes')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <Bell className="size-4" />
                {t('notifications')}
                <Badge variant="destructive" className="ml-1">3</Badge>
              </Button>
              <Button variant="outline" onClick={() => setShowAddAthlete(true)} className="gap-2">
                <UserPlus className="size-4" />
                {t('add_athlete')}
              </Button>
              <Button variant="outline" onClick={onLogout} className="gap-2">
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-12 w-full max-w-6xl bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="gap-1 flex-col py-2">
              <BarChart3 className="size-4" />
              <span className="text-xs">{t('overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="roster" className="gap-1 flex-col py-2">
              <Users className="size-4" />
              <span className="text-xs">{t('roster')}</span>
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="gap-1 flex-col py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 font-semibold">
              <Brain className="size-4" />
              <span className="text-xs">🎯 AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-1 flex-col py-2">
              <Trophy className="size-4" />
              <span className="text-xs">{t('training_plans')}</span>
            </TabsTrigger>
            <TabsTrigger value="messaging" className="gap-1 flex-col py-2">
              <MessageSquare className="size-4" />
              <span className="text-xs">{t('messaging')}</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1 flex-col py-2">
              <TrendingUp className="size-4" />
              <span className="text-xs">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1 flex-col py-2">
              <BarChart3 className="size-4" />
              <span className="text-xs">{t('analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="video-analysis" className="gap-1 flex-col py-2">
              <Video className="size-4" />
              <span className="text-xs">Video Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="mental-training" className="gap-1 flex-col py-2">
              <Brain className="size-4" />
              <span className="text-xs">Mind Gym</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-1 flex-col py-2">
              <Heart className="size-4" />
              <span className="text-xs">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-1 flex-col py-2">
              <Calendar className="size-4" />
              <span className="text-xs">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="wearables" className="gap-1 flex-col py-2">
              <Smartphone className="size-4" />
              <span className="text-xs">Wearables</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('total_athletes')}</p>
                        <p className="text-3xl font-bold text-blue-600">{roster.length}</p>
                      </div>
                      <Users className="size-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('average_score')}</p>
                        <p className="text-3xl font-bold text-green-600">89.3%</p>
                      </div>
                      <Trophy className="size-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('training_plans')}</p>
                        <p className="text-3xl font-bold text-purple-600">{trainingPlans.length}</p>
                      </div>
                      <Target className="size-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('watchlist')}</p>
                        <p className="text-3xl font-bold text-orange-600">{watchlist.length}</p>
                      </div>
                      <Eye className="size-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="size-5" />
{t('recent_activity')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {roster.slice(0, 3).map((athlete) => (
                      <div key={athlete.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="size-10">
                          <AvatarImage src={athlete.avatar} />
                          <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{athlete.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed {athlete.stats.testsCompleted} tests • {athlete.lastActive}
                          </p>
                        </div>
                        <Badge variant="outline">{athlete.stats.averageScore}%</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="size-5" />
                      {t('recent_messages')}
                      {recentMessages.filter(m => !m.read).length > 0 && (
                        <Badge variant="destructive">{recentMessages.filter(m => !m.read).length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentMessages.slice(0, 3).map((message) => {
                      const athlete = roster.find(a => a.id === message.from);
                      return (
                        <div key={message.id} className={`p-3 rounded-lg ${message.read ? 'bg-muted/30' : 'bg-blue-50 border border-blue-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{athlete?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleDateString()}
                            </span>
                            {!message.read && <Badge variant="default" className="text-xs">{t('new')}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{message.content}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* AI Insights Tab - New Enhanced Feature */}
          <TabsContent value="ai-insights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                <Brain className="size-6" />
                <h1 className="text-xl font-bold">🎯 AI Coaching Insights</h1>
                <Zap className="size-6" />
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Advanced AI analysis of your athletes' performance, training optimization, and personalized recommendations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Performance Analytics */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-purple-600" />
                      Team Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-3xl font-bold text-green-600">89.3%</div>
                        <p className="text-sm text-muted-foreground">Team Average</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-3xl font-bold text-blue-600">+12.5%</div>
                        <p className="text-sm text-muted-foreground">Improvement</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Strength Training</span>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="w-20 h-2" />
                          <span className="text-sm font-bold">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Endurance</span>
                        <div className="flex items-center gap-2">
                          <Progress value={87} className="w-20 h-2" />
                          <span className="text-sm font-bold">87%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Speed & Agility</span>
                        <div className="flex items-center gap-2">
                          <Progress value={94} className="w-20 h-2" />
                          <span className="text-sm font-bold">94%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Flexibility</span>
                        <div className="flex items-center gap-2">
                          <Progress value={76} className="w-20 h-2" />
                          <span className="text-sm font-bold">76%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Individual Athlete Insights */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="size-5 text-yellow-600" />
                      Top Performers This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roster.slice(0, 3).map((athlete, index) => (
                        <div key={athlete.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-500 text-white">#{index + 1}</Badge>
                            <Avatar className="size-10">
                              <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{athlete.name}</p>
                            <p className="text-sm text-muted-foreground">{athlete.position}</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">+{athlete.stats.improvement}%</div>
                            <p className="text-xs text-muted-foreground">improvement</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="size-5 text-green-600" />
                    🧠 AI Training Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-4 text-green-600" />
                        <h4 className="font-semibold text-green-800">Strength Focus</h4>
                      </div>
                      <p className="text-sm text-green-700">3 athletes showing strength improvement potential. Recommend adding power training sessions.</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="size-4 text-blue-600" />
                        <h4 className="font-semibold text-blue-800">Endurance Boost</h4>
                      </div>
                      <p className="text-sm text-blue-700">Team endurance below target. Consider increasing cardio training by 20%.</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="size-4 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">Mental Training</h4>
                      </div>
                      <p className="text-sm text-purple-700">Add visualization sessions. 2 athletes showing stress indicators above optimal.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      <Trophy className="size-4 mr-2" />
                      Generate Training Plan
                    </Button>
                    <Button variant="outline">
                      <FileText className="size-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Roster Management Tab */}
          <TabsContent value="roster" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('roster')}</h2>
                  <p className="text-muted-foreground">{t('manage_athletes_progress')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={t('search_athletes')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="size-4" />
{t('filter')}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {roster.map((athlete) => (
                  <Card key={athlete.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-12">
                            <AvatarImage src={athlete.avatar} />
                            <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{athlete.name}</h3>
                            <p className="text-sm text-muted-foreground">{athlete.position}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{athlete.stats.testsCompleted}</p>
                          <p className="text-xs text-muted-foreground">{t('tests')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{athlete.stats.averageScore}%</p>
                          <p className="text-xs text-muted-foreground">{t('average_score')}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('improvement')}</span>
                          <span className="text-green-600">+{athlete.stats.improvement}%</span>
                        </div>
                        <Progress value={athlete.stats.improvement * 5} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getRiskColor(athlete.stats.injuryRisk)}`}>
                          {athlete.stats.injuryRisk.toUpperCase()} RISK
                        </Badge>
                        <span className="text-xs text-muted-foreground">• {t('last_active')} {athlete.lastActive}</span>
                      </div>

                      {/* Mental Wellness Indicators */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <Heart className={`size-4 mx-auto ${getMentalWellnessColor(athlete.mentalWellness.mood)}`} />
                          <p className="text-xs mt-1">{t('mood')}</p>
                          <p className="text-xs font-medium">{athlete.mentalWellness.mood}/10</p>
                        </div>
                        <div>
                          <Zap className={`size-4 mx-auto ${getMentalWellnessColor(10 - athlete.mentalWellness.stress)}`} />
                          <p className="text-xs mt-1">{t('stress')}</p>
                          <p className="text-xs font-medium">{athlete.mentalWellness.stress}/10</p>
                        </div>
                        <div>
                          <Clock className={`size-4 mx-auto ${getMentalWellnessColor(athlete.mentalWellness.sleep)}`} />
                          <p className="text-xs mt-1">{t('sleep_quality')}</p>
                          <p className="text-xs font-medium">{athlete.mentalWellness.sleep}/10</p>
                        </div>
                        <div>
                          <Trophy className={`size-4 mx-auto ${getMentalWellnessColor(athlete.mentalWellness.motivation)}`} />
                          <p className="text-xs mt-1">{t('motivation')}</p>
                          <p className="text-xs font-medium">{athlete.mentalWellness.motivation}/10</p>
                        </div>
                      </div>

                      {/* Wearable Data */}
                      <div className="border-t pt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">{t('todays_wearable_data')}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>{t('steps')}: <span className="font-medium">{athlete.wearableData.steps.toLocaleString()}</span></div>
                          <div>{t('heart_rate')}: <span className="font-medium">{athlete.wearableData.heartRate} bpm</span></div>
                          <div>{t('calories')}: <span className="font-medium">{athlete.wearableData.calories}</span></div>
                          <div>{t('sleep')}: <span className="font-medium">{athlete.wearableData.sleepHours}h</span></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewAthleteProfile(athlete.id)}
                        >
{t('view_profile')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleMessageAthlete(athlete.id)}
                        >
{t('message')}
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-1"
                          onClick={() => handleCreatePersonalPlan(athlete.id)}
                        >
                          <Target className="size-3" />
{t('personal_plan')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-1"
                          onClick={() => handleScheduleSession(athlete.id)}
                        >
                          <Calendar className="size-3" />
                          {t('schedule')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Training Plans Tab */}
          <TabsContent value="training" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('training_plans')}</h2>
                  <p className="text-muted-foreground">{t('create_manage_training_programs')}</p>
                </div>
                <Button className="gap-2">
                  <Plus className="size-4" />
{t('create_new_plan')}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {trainingPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription className="mt-1">{plan.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{plan.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📅 {plan.duration}</span>
                        <span>👥 {plan.assignedTo.length} {t('athletes')}</span>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">{t('exercises')}:</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.exercises.map((exercise, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {exercise}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('completion_rate')}</span>
                          <span>{plan.completionRate}%</span>
                        </div>
                        <Progress value={plan.completionRate} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">{t('edit_plan')}</Button>
                        <Button size="sm" variant="outline" className="flex-1">{t('assign')}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Messaging Tab */}
          <TabsContent value="messaging" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('athlete_communication_center')}</h2>
                  <p className="text-muted-foreground">{t('direct_communication_athletes')}</p>
                </div>
                <Button className="gap-2">
                  <MessageSquare className="size-4" />
{t('new_group_message')}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="size-5" />
{t('conversations')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {roster.map((athlete) => (
                      <div 
                        key={athlete.id} 
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedAthlete(athlete.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarImage src={athlete.avatar} />
                            <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{athlete.name}</p>
                            <p className="text-sm text-muted-foreground">{t('last_active')}: {athlete.lastActive}</p>
                          </div>
                          {Math.random() > 0.5 && (
                            <Badge variant="destructive" className="text-xs">1</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="size-5" />
                      {selectedAthlete ? 
                        roster.find(a => a.id === selectedAthlete)?.name || t('select_athlete') 
                        : t('select_athlete_messaging')
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedAthlete ? (
                      <>
                        {/* Messages */}
                        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-muted/20 rounded-lg">
                          <div className="flex gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback>
                                {roster.find(a => a.id === selectedAthlete)?.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-white p-3 rounded-lg flex-1">
                              <p className="text-sm">Coach, I need help with my sprint technique. Can we schedule a session?</p>
                              <p className="text-xs text-muted-foreground mt-1">2 {t('hours')} {t('ago')}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 justify-end">
                            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                              <p className="text-sm">Sure! Let's schedule a session for tomorrow at 3 PM. I'll focus on your acceleration phase.</p>
                              <p className="text-xs opacity-70 mt-1">1 {t('hour')} {t('ago')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input 
                            placeholder={t('type_message')} 
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage}>
                            <Send className="size-4" />
                          </Button>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Calendar className="size-3" />
{t('schedule_session')}
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <FileText className="size-3" />
{t('send_plan')}
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Video className="size-3" />
{t('video_call')}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <MessageSquare className="size-12 mx-auto mb-2" />
                          <p>{t('select_athlete_messaging')}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Personal Training Tab */}
          <TabsContent value="personal-training" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('personal_training_guidance')}</h2>
                  <p className="text-muted-foreground">{t('one_on_one_coaching')}</p>
                </div>
                <Button className="gap-2">
                  <Plus className="size-4" />
{t('create_personal_plan')}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Personal Plans */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-5" />
{t('active_personal_plans')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {roster.map((athlete) => (
                      <div key={athlete.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="size-10">
                            <AvatarImage src={athlete.avatar} />
                            <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{athlete.name}</p>
                            <p className="text-sm text-muted-foreground">{athlete.position} • {t('focus')}: {t('speed_agility')}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{t('active')}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t('progress')}</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 gap-1">
                            <Eye className="size-3" />
{t('view_plan')}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 gap-1">
                            <Settings className="size-3" />
{t('modify')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Scheduled Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="size-5" />
{t('scheduled_sessions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{t('sprint_technique_session')}</span>
                          <Badge>{t('today')} 3:00 PM</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t('with')} Priya Sharma • {t('focus')}: {t('acceleration_phase')}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">{t('join_session')}</Button>
                          <Button size="sm" variant="outline">{t('reschedule')}</Button>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{t('endurance_assessment')}</span>
                          <Badge variant="outline">{t('tomorrow')} 10:00 AM</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t('with')} Anjali Patel • {t('vo2_max_testing')}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">{t('view_details')}</Button>
                          <Button size="sm" variant="outline">{t('modify')}</Button>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{t('technique_review')}</span>
                          <Badge variant="outline">{t('wed')} 2:00 PM</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t('with')} Rahul Kumar • {t('long_jump_form_analysis')}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">{t('view_details')}</Button>
                          <Button size="sm" variant="outline">{t('modify')}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Guidance & Resources */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="size-5" />
{t('coaching_resources_guidance')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                        <Video className="size-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-semibold mb-1">{t('video_analysis_tools')}</h4>
                        <p className="text-sm text-muted-foreground">{t('record_analyze_movements')}</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                        <FileText className="size-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-semibold mb-1">{t('training_templates')}</h4>
                        <p className="text-sm text-muted-foreground">{t('prebuilt_workout_templates')}</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                        <Brain className="size-8 mx-auto mb-2 text-purple-600" />
                        <h4 className="font-semibold mb-1">{t('mental_training')}</h4>
                        <p className="text-sm text-muted-foreground">{t('psychology_motivation_tools')}</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                        <Target className="size-8 mx-auto mb-2 text-red-600" />
                        <h4 className="font-semibold mb-1">{t('goal_setting')}</h4>
                        <p className="text-sm text-muted-foreground">{t('smart_goal_frameworks')}</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                        <BarChart3 className="size-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold mb-1">{t('progress_tracking')}</h4>
                        <p className="text-sm text-muted-foreground">{t('performance_metrics_dashboard')}</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                        <Shield className="size-8 mx-auto mb-2 text-indigo-600" />
                        <h4 className="font-semibold mb-1">{t('injury_prevention')}</h4>
                        <p className="text-sm text-muted-foreground">{t('risk_assessment_tools')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{t('advanced_analytics_insights')}</h2>
                <p className="text-muted-foreground">{t('comprehensive_data_analysis')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Performance Trends */}
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="size-5" />
{t('team_performance_trends')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <BarChart3 className="size-12 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">{t('performance_chart')}</p>
                        <p className="text-xs text-muted-foreground">{t('six_month_comparison')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-green-600">+15.3%</p>
                        <p className="text-xs text-muted-foreground">{t('avg_improvement')}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">92.1%</p>
                        <p className="text-xs text-muted-foreground">{t('training_adherence')}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">0.8%</p>
                        <p className="text-xs text-muted-foreground">{t('injury_rate')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Talent Identification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="size-5" />
                      Talent Discovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="size-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Rising Star Alert</span>
                      </div>
                      <p className="text-sm text-yellow-700">Arjun Singh shows 94% potential for Athletics</p>
                      <Button size="sm" className="mt-2 w-full">Add to Watchlist</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Scouting Recommendations</h4>
                      {watchlist.map((prospect) => (
                        <div key={prospect.id} className="p-2 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{prospect.name}</span>
                            <Badge variant={prospect.potential === 'High' ? 'default' : 'secondary'}>
                              {prospect.potential}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Score: {prospect.score}% • {prospect.lastTest}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sport-Specific Analysis */}
                <Card className="xl:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="size-5" />
                      Sport-Specific Performance Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { sport: 'Athletics', athletes: 8, avgScore: 87, trend: '+12%', icon: '🏃‍♂️' },
                        { sport: 'Basketball', athletes: 5, avgScore: 83, trend: '+8%', icon: '🏀' },
                        { sport: 'Football', athletes: 12, avgScore: 89, trend: '+15%', icon: '⚽' },
                        { sport: 'Swimming', athletes: 4, avgScore: 91, trend: '+6%', icon: '🏊‍♂️' },
                        { sport: 'Gymnastics', athletes: 3, avgScore: 86, trend: '+18%', icon: '🤸‍♂️' }
                      ].map((sport) => (
                        <div key={sport.sport} className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
                          <div className="text-2xl mb-2">{sport.icon}</div>
                          <h4 className="font-semibold mb-2">{sport.sport}</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">{sport.athletes}</span> athletes</p>
                            <p><span className="font-medium">{sport.avgScore}%</span> avg score</p>
                            <p className="text-green-600 font-medium">{sport.trend}</p>
                          </div>
                          <Button size="sm" variant="outline" className="mt-2 w-full">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="size-5" />
                      AI Coach Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="size-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Training Optimization</span>
                        </div>
                        <p className="text-sm text-blue-700">Your athletes show 23% faster improvement with morning training sessions. Consider scheduling key workouts before 10 AM.</p>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="size-4 text-green-600" />
                          <span className="font-medium text-green-800">Recovery Patterns</span>
                        </div>
                        <p className="text-sm text-green-700">Athletes who use the mental training module show 15% better recovery metrics and reduced injury risk.</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="size-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Talent Pipeline</span>
                        </div>
                        <p className="text-sm text-purple-700">3 new athletes in your region show high potential based on recent test results. Consider outreach.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="size-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full gap-2">
                      <FileText className="size-4" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="size-4" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Calendar className="size-4" />
                      Schedule Review
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <UserPlus className="size-4" />
                      Scout Talent
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Advanced Video Analysis Tab */}
          <TabsContent value="video-analysis" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Advanced Video Analysis & Biomechanics</h2>
                <p className="text-muted-foreground">AI-powered video analysis with 3D pose estimation and injury risk assessment</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="size-5" />
                      Side-by-Side Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="size-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Athlete Video</p>
                        </div>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <PlayCircle className="size-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Professional Reference</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Upload Video</Button>
                      <Button variant="outline" className="flex-1">Select Reference</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3D Pose Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="size-12 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">3D Model</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Joint Angles</span>
                          <span className="text-green-600">Optimal</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Movement Velocity</span>
                          <span className="text-blue-600">Good</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Force Production</span>
                          <span className="text-purple-600">Excellent</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="size-5 text-red-600" />
                      Injury Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="size-4" />
                      <AlertDescription>
                        <strong>Medium Risk Detected:</strong> Knee valgus pattern observed during jump landing phase.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Risk Score</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Knee Stability</span>
                          <span className="text-yellow-600">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Movement Quality</span>
                          <span className="text-green-600">82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Fatigue Indicators</span>
                          <span className="text-red-600">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Recommended Corrective Exercises:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Single-leg glute bridges</li>
                        <li>• Lateral band walks</li>
                        <li>• Eccentric landing drills</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5" />
                      Biomechanical Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">2.4m</p>
                        <p className="text-xs text-muted-foreground">Jump Distance</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">0.8s</p>
                        <p className="text-xs text-muted-foreground">Flight Time</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Takeoff Angle</p>
                        <p className="text-2xl font-bold">23°</p>
                        <p className="text-xs text-muted-foreground">Optimal range: 20-25°</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Peak Velocity</p>
                        <p className="text-2xl font-bold">4.2 m/s</p>
                        <p className="text-xs text-muted-foreground">Above average for age group</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Ground Contact Time</p>
                        <p className="text-2xl font-bold">0.18s</p>
                        <p className="text-xs text-muted-foreground">Excellent power transfer</p>
                      </div>
                    </div>

                    <Button className="w-full gap-2">
                      <Download className="size-4" />
                      Export Full Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Mental Training Tab */}
          <TabsContent value="mental-training" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Mental & Cognitive Training Module</h2>
                <p className="text-muted-foreground">Develop mental skills and track psychological wellness</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="size-5 text-purple-600" />
                      Cognitive Drills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Reaction Time</p>
                            <p className="text-sm text-muted-foreground">Visual stimulus response</p>
                          </div>
                          <Timer className="size-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Decision Making</p>
                            <p className="text-sm text-muted-foreground">Under pressure scenarios</p>
                          </div>
                          <Target className="size-5 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Spatial Awareness</p>
                            <p className="text-sm text-muted-foreground">3D positioning tasks</p>
                          </div>
                          <Eye className="size-5 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">Assign to Athletes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="size-5 text-red-600" />
                      Mental Wellness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Heart className="size-6 mx-auto mb-1 text-red-600" />
                        <p className="text-lg font-bold">7.2</p>
                        <p className="text-xs text-muted-foreground">Avg Mood</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <Zap className="size-6 mx-auto mb-1 text-yellow-600" />
                        <p className="text-lg font-bold">4.1</p>
                        <p className="text-xs text-muted-foreground">Avg Stress</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sleep Quality</span>
                          <span>7.1/10</span>
                        </div>
                        <Progress value={71} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Motivation Level</span>
                          <span>8.3/10</span>
                        </div>
                        <Progress value={83} className="h-2" />
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="size-4" />
                      <AlertDescription className="text-sm">
                        2 athletes reporting high stress levels this week.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="size-5 text-green-600" />
                      Guided Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Heart className="size-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Mindfulness</p>
                            <p className="text-sm text-muted-foreground">15 min • Beginner</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Eye className="size-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Visualization</p>
                            <p className="text-sm text-muted-foreground">20 min • Competition prep</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Activity className="size-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Breathing</p>
                            <p className="text-sm text-muted-foreground">10 min • Recovery</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">Create Custom Session</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Community Features Tab */}
          <TabsContent value="community" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Community & Social Features</h2>
                <p className="text-muted-foreground">Foster team spirit and friendly competition</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="size-5" />
                      Team Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full gap-2 mb-4">
                      <Plus className="size-4" />
                      Create New Group
                    </Button>
                    
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mumbai Sprinters Club</p>
                            <p className="text-sm text-muted-foreground">8 members • 24 active challenges</p>
                          </div>
                          <Badge>Private</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Distance Runners Elite</p>
                            <p className="text-sm text-muted-foreground">12 members • 18 active challenges</p>
                          </div>
                          <Badge variant="outline">Public</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="size-5" />
                      Direct Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full gap-2 mb-4">
                      <Target className="size-4" />
                      Create Challenge
                    </Button>
                    
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">30m Sprint Challenge</span>
                          <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Priya vs Rahul • Ends in 2 days
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-green-600">Priya: 4.2s</span> vs <span className="text-blue-600">Rahul: 4.5s</span>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Vertical Jump Battle</span>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Anjali vs Priya • Waiting for acceptance
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    Community Q&A Forum
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Ask a question or share knowledge..." className="flex-1" />
                    <Button>Post</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="size-8">
                          <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Priya Sharma</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm mb-2">What's the best warm-up routine for sprint training?</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👍 5 likes</span>
                        <span>💬 3 replies</span>
                        <span>🏷️ Training</span>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="size-8">
                          <AvatarFallback>RK</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Rahul Kumar</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm mb-2">Tips for improving landing technique in long jump?</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👍 8 likes</span>
                        <span>💬 6 replies</span>
                        <span>🏷️ Technique</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Wearable Integration Tab */}
          <TabsContent value="wearables" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Wearable Device Integration</h2>
                <p className="text-muted-foreground">Connect health trackers for comprehensive data insights</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="size-5" />
                      Connected Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="size-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Apple Health</p>
                            <p className="text-sm text-muted-foreground">12 athletes connected</p>
                          </div>
                        </div>
                        <Wifi className="size-5 text-green-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="size-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Google Fit</p>
                            <p className="text-sm text-muted-foreground">8 athletes connected</p>
                          </div>
                        </div>
                        <Wifi className="size-5 text-green-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Watch className="size-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">Garmin Connect</p>
                            <p className="text-sm text-muted-foreground">3 athletes connected</p>
                          </div>
                        </div>
                        <Wifi className="size-5 text-green-600" />
                      </div>
                    </div>
                    
                    <Button className="w-full gap-2">
                      <Plus className="size-4" />
                      Add Integration
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5" />
                      Data Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">11,250</p>
                        <p className="text-xs text-muted-foreground">Avg Daily Steps</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-lg font-bold text-red-600">145</p>
                        <p className="text-xs text-muted-foreground">Avg Resting HR</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sleep Quality</span>
                          <span>7.2/10</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Recovery Score</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Training Load</span>
                          <span>Moderate</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>

                    <Alert>
                      <Heart className="size-4" />
                      <AlertDescription className="text-sm">
                        Priya's HRV suggests she may be overtraining. Consider rest day.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="size-5" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="size-4 text-yellow-600" />
                          <span className="text-sm font-medium">Overtraining Alert</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Rahul's HRV has dropped 15% this week. Recommend active recovery.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="size-4 text-green-600" />
                          <span className="text-sm font-medium">Optimal Training</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Anjali's metrics show she's ready for high-intensity training.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="size-4 text-blue-600" />
                          <span className="text-sm font-medium">Sleep Optimization</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Team average sleep: 7.1h. Recommend 8+ hours for optimal recovery.
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      View Detailed Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Team Health Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Athlete</th>
                          <th className="text-left p-2">Sleep</th>
                          <th className="text-left p-2">HRV</th>
                          <th className="text-left p-2">Steps</th>
                          <th className="text-left p-2">Readiness</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roster.map((athlete) => (
                          <tr key={athlete.id} className="border-b">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="size-6">
                                  <AvatarFallback className="text-xs">
                                    {athlete.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                {athlete.name}
                              </div>
                            </td>
                            <td className="p-2">{athlete.wearableData.sleepHours}h</td>
                            <td className="p-2">
                              <span className={athlete.wearableData.heartRate < 150 ? 'text-green-600' : 'text-yellow-600'}>
                                {athlete.wearableData.heartRate}
                              </span>
                            </td>
                            <td className="p-2">{athlete.wearableData.steps.toLocaleString()}</td>
                            <td className="p-2">
                              <Progress value={Math.random() * 40 + 60} className="h-2 w-16" />
                            </td>
                            <td className="p-2">
                              <Badge className={getRiskColor(athlete.stats.injuryRisk)}>
                                {athlete.stats.injuryRisk}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {/* Messaging Modal */}
      {showMessaging && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Send Message</span>
                <Button variant="ghost" size="sm" onClick={() => setShowMessaging(false)}>×</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  To: {roster.find(a => a.id === selectedAthleteForAction)?.name}
                </p>
                <Textarea
                  placeholder="Type your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowMessaging(false)}>Cancel</Button>
                <Button onClick={handleSendMessage}>Send Message</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personal Plan Modal */}
      {showPersonalPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Create Personal Training Plan</span>
                <Button variant="ghost" size="sm" onClick={() => setShowPersonalPlan(false)}>×</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  For: {roster.find(a => a.id === selectedAthleteForAction)?.name}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Plan Name</label>
                    <Input placeholder="e.g., Sprint Speed Development" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <Input placeholder="e.g., 4 weeks" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium">Focus Areas</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Speed', 'Strength', 'Endurance', 'Agility', 'Technique', 'Mental'].map(area => (
                      <label key={area} className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium">Training Notes</label>
                  <Textarea placeholder="Special instructions, goals, considerations..." rows={3} />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPersonalPlan(false)}>Cancel</Button>
                <Button onClick={() => {
                  alert('Personal training plan created successfully!');
                  setShowPersonalPlan(false);
                }}>
                  Create Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Schedule Training Session</span>
                <Button variant="ghost" size="sm" onClick={() => setShowScheduleModal(false)}>×</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  With: {roster.find(a => a.id === selectedAthleteForAction)?.name}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Session Type</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Technique Training</option>
                      <option>Fitness Assessment</option>
                      <option>Video Analysis</option>
                      <option>Mental Training</option>
                      <option>Recovery Session</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>30 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                      <option>120 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="Training facility, online, etc." />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                <Button onClick={() => {
                  alert('Training session scheduled successfully!');
                  setShowScheduleModal(false);
                }}>
                  Schedule Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Watch({ className, ...props }: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="6" />
      <polyline points="12,10 12,12 13,13" />
      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
    </svg>
  );
}