import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Flag,
  Settings,
  LogOut,
  Calendar,
  MapPin,
  User,
  Trophy,
  Clock,
  Mail,
  Phone,
  FileText,
  PieChart,
  Activity,
  Shield,
  Star,
  Zap,
  Brain,
  Globe,
  Monitor,
  Database,
  Bell,
  Plus,
  Edit,
  Trash,
  Send,
  Bookmark,
  Share2,
  Camera,
  Video,
  MessageSquare,
  ChevronDown,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Volume2,
  Languages,
  FilterX
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import type { Page, User as UserType } from '../App';
import { ChatBot } from './ChatBot';
import { VoiceAssistant } from './VoiceAssistant';
import { AccessibilityPanel } from './AccessibilityPanel';
import { LanguageSelector } from './LanguageSelector';
import { SportRecommendationEngine } from './SportRecommendationEngine';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface OfficialDashboardProps {
  user: UserType | null;
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

export function OfficialDashboard({ user, onNavigate, onLogout }: OfficialDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  
  const { t } = useLanguage();
  const { settings } = useAccessibility();

  // Enhanced mock data
  const athletes = [
    {
      id: '1',
      name: 'Arjun Kumar',
      age: 19,
      gender: 'Male',
      location: 'Delhi',
      testsCompleted: 18,
      averageScore: 89,
      lastActive: '2 hours ago',
      status: 'active',
      flagged: false,
      rank: 12,
      email: 'arjun.kumar@gmail.com',
      phone: '+91 9876543210',
      sport: 'Athletics',
      category: 'Sprints',
      potential: 'High',
      aiScore: 92
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 17,
      gender: 'Female',
      location: 'Mumbai',
      testsCompleted: 22,
      averageScore: 94,
      lastActive: '30 min ago',
      status: 'active',
      flagged: false,
      rank: 3,
      email: 'priya.sharma@gmail.com',
      phone: '+91 9876543211',
      sport: 'Swimming',
      category: 'Freestyle',
      potential: 'Elite',
      aiScore: 96
    },
    {
      id: '3',
      name: 'Raj Patel',
      age: 20,
      gender: 'Male',
      location: 'Gujarat',
      testsCompleted: 15,
      averageScore: 76,
      lastActive: '2 days ago',
      status: 'inactive',
      flagged: true,
      rank: 156,
      email: 'raj.patel@gmail.com',
      phone: '+91 9876543212',
      sport: 'Football',
      category: 'Midfielder',
      potential: 'Medium',
      aiScore: 78
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      age: 18,
      gender: 'Female',
      location: 'Hyderabad',
      testsCompleted: 25,
      averageScore: 91,
      lastActive: '1 hour ago',
      status: 'active',
      flagged: false,
      rank: 8,
      email: 'sneha.reddy@gmail.com',
      phone: '+91 9876543213',
      sport: 'Badminton',
      category: 'Singles',
      potential: 'High',
      aiScore: 93
    },
    {
      id: '5',
      name: 'Vikram Singh',
      age: 21,
      gender: 'Male',
      location: 'Punjab',
      testsCompleted: 20,
      averageScore: 97,
      lastActive: '15 min ago',
      status: 'active',
      flagged: false,
      rank: 1,
      email: 'vikram.singh@gmail.com',
      phone: '+91 9876543214',
      sport: 'Wrestling',
      category: 'Freestyle',
      potential: 'Elite',
      aiScore: 98
    }
  ];

  const dashboardStats = [
    { label: 'Total Athletes', value: '15,847', change: '+542 this month', icon: <Users className="size-5" />, color: 'text-blue-600', trend: 'up' },
    { label: 'Tests Today', value: '1,234', change: '+12% vs yesterday', icon: <Activity className="size-5" />, color: 'text-green-600', trend: 'up' },
    { label: 'Elite Talents', value: '1,847', change: '+127 identified', icon: <Star className="size-5" />, color: 'text-yellow-600', trend: 'up' },
    { label: 'AI Accuracy', value: '98.7%', change: '+0.3% improved', icon: <Brain className="size-5" />, color: 'text-purple-600', trend: 'up' },
    { label: 'Active States', value: '28/28', change: 'All states covered', icon: <Globe className="size-5" />, color: 'text-indigo-600', trend: 'stable' },
    { label: 'Flagged Results', value: '23', change: '-12 resolved today', icon: <Shield className="size-5" />, color: 'text-red-600', trend: 'down' }
  ];

  const monthlyData = [
    { month: 'Jan', athletes: 12000, tests: 45000, eliteFound: 180 },
    { month: 'Feb', athletes: 12500, tests: 48000, eliteFound: 195 },
    { month: 'Mar', athletes: 13200, tests: 52000, eliteFound: 210 },
    { month: 'Apr', athletes: 13800, tests: 58000, eliteFound: 235 },
    { month: 'May', athletes: 14500, tests: 62000, eliteFound: 260 },
    { month: 'Jun', athletes: 15847, tests: 68000, eliteFound: 295 }
  ];

  const regionData = [
    { state: 'Punjab', athletes: 1847, avgScore: 89, eliteTalents: 127, color: '#3b82f6' },
    { state: 'Haryana', athletes: 1756, avgScore: 87, eliteTalents: 115, color: '#10b981' },
    { state: 'Kerala', athletes: 1634, avgScore: 85, eliteTalents: 108, color: '#f59e0b' },
    { state: 'Karnataka', athletes: 1589, avgScore: 84, eliteTalents: 102, color: '#8b5cf6' },
    { state: 'Maharashtra', athletes: 2156, avgScore: 82, eliteTalents: 95, color: '#06b6d4' }
  ];

  const sportDistribution = [
    { name: 'Athletics', value: 35, color: '#3b82f6' },
    { name: 'Swimming', value: 20, color: '#10b981' },
    { name: 'Football', value: 15, color: '#f59e0b' },
    { name: 'Cricket', value: 12, color: '#8b5cf6' },
    { name: 'Badminton', value: 10, color: '#06b6d4' },
    { name: 'Others', value: 8, color: '#f43f5e' }
  ];

  const recentTests = [
    { athlete: 'Vikram Singh', test: 'Strength Assessment', score: 97, time: '15 min ago', status: 'verified', improvement: '+5%', location: 'Punjab' },
    { athlete: 'Priya Sharma', test: 'Endurance Test', score: 94, time: '30 min ago', status: 'verified', improvement: '+8%', location: 'Mumbai' },
    { athlete: 'Sneha Reddy', test: 'Agility Test', score: 91, time: '1 hour ago', status: 'verified', improvement: '+3%', location: 'Hyderabad' },
    { athlete: 'Arjun Kumar', test: 'Speed Test', score: 89, time: '2 hours ago', status: 'verified', improvement: '+12%', location: 'Delhi' },
    { athlete: 'Raj Patel', test: 'Flexibility Test', score: 45, time: '3 hours ago', status: 'flagged', improvement: '-2%', location: 'Gujarat' }
  ];

  const talentAlerts = [
    { type: 'elite_discovered', athlete: 'Kavya Menon', age: 16, sport: 'Swimming', location: 'Kerala', score: 96, time: '2 hours ago' },
    { type: 'breakthrough_performance', athlete: 'Rohit Sharma', age: 19, sport: 'Athletics', location: 'Haryana', score: 94, time: '4 hours ago' },
    { type: 'consistency_milestone', athlete: 'Ananya Singh', age: 17, sport: 'Badminton', location: 'Delhi', score: 92, time: '6 hours ago' }
  ];

  const upcomingEvents = [
    { name: 'National Youth Championship', date: 'Next week', participants: 2500, location: 'Delhi', priority: 'high' },
    { name: 'Regional Talent Hunt', date: '2 weeks', participants: 800, location: 'Mumbai', priority: 'medium' },
    { name: 'AI Assessment Training', date: '1 month', participants: 150, location: 'Online', priority: 'low' }
  ];

  // Enhanced filtering with sport preference
  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.sport.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'active' && athlete.status === 'active') ||
                         (selectedFilter === 'flagged' && athlete.flagged) ||
                         (selectedFilter === 'elite' && athlete.potential === 'Elite') ||
                         (selectedFilter === 'top' && athlete.rank <= 50);
    
    const matchesSport = selectedSport === 'all' || athlete.sport.toLowerCase() === selectedSport.toLowerCase();
    
    return matchesSearch && matchesFilter && matchesSport;
  });

  // Sport-specific analytics
  const sportAnalytics = athletes.reduce((acc, athlete) => {
    if (!acc[athlete.sport]) {
      acc[athlete.sport] = {
        count: 0,
        averageScore: 0,
        eliteCount: 0,
        totalScore: 0
      };
    }
    acc[athlete.sport].count++;
    acc[athlete.sport].totalScore += athlete.averageScore;
    acc[athlete.sport].averageScore = acc[athlete.sport].totalScore / acc[athlete.sport].count;
    if (athlete.potential === 'Elite') {
      acc[athlete.sport].eliteCount++;
    }
    return acc;
  }, {} as Record<string, any>);

  const uniqueSports = [...new Set(athletes.map(a => a.sport))].sort();

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'Elite': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Medium': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'elite_discovered': return <Star className="size-4 text-yellow-500" />;
      case 'breakthrough_performance': return <TrendingUp className="size-4 text-green-500" />;
      case 'consistency_milestone': return <Target className="size-4 text-blue-500" />;
      default: return <Bell className="size-4" />;
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
                <div className="text-white text-lg font-bold">⚡</div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LuminaX - SAI Official Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Sports Authority of India • AI-Powered Talent Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <LanguageSelector variant="compact" showLabel={false} />
              
              {/* Accessibility Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowAccessibility(!showAccessibility)}
              >
                <Volume2 className="size-4" />
                <span className="sr-only md:not-sr-only">{t('accessibility')}</span>
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="size-4" />
                <span className="sr-only md:not-sr-only">{t('alerts') || 'Alerts'}</span>
                <Badge variant="destructive" className="ml-1 size-2 p-0"></Badge>
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="size-4" />
                <span className="sr-only md:not-sr-only">{t('export') || 'Export'}</span>
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {getInitials(user?.name || 'Official')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">SAI Official • Level 5 Access</p>
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
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="athletes" className="gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Athletes</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="gap-2">
              <Activity className="size-4" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <PieChart className="size-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="talent" className="gap-2">
              <Star className="size-4" />
              <span className="hidden sm:inline">Talent</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="size-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Enhanced */}
          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardStats.map((stat, index) => (
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
                        {stat.trend === 'up' ? (
                          <TrendingUp className="size-4 text-green-500" />
                        ) : stat.trend === 'down' ? (
                          <TrendingDown className="size-4 text-red-500" />
                        ) : (
                          <div className="size-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className={`text-xs flex items-center gap-1 ${
                          stat.trend === 'up' ? 'text-green-600' : 
                          stat.trend === 'down' ? 'text-blue-600' : 'text-muted-foreground'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performance Trends */}
              <motion.div
                className="lg:col-span-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-blue-600" />
                      Platform Growth & Performance Trends
                    </CardTitle>
                    <CardDescription>Monthly statistics showing platform adoption and elite talent discovery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip />
                        <Line type="monotone" dataKey="athletes" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} name="Athletes" />
                        <Line type="monotone" dataKey="tests" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Tests" />
                        <Line type="monotone" dataKey="eliteFound" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} name="Elite Talents" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Talent Alerts */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="size-5 text-yellow-600" />
                      Talent Alerts
                    </CardTitle>
                    <CardDescription>Real-time notifications of exceptional performances</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {talentAlerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg border bg-gradient-to-r from-yellow-50 to-white hover:shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{alert.athlete}</p>
                            <p className="text-xs text-muted-foreground">{alert.age} years • {alert.sport} • {alert.location}</p>
                          </div>
                          <Badge variant="default">{alert.score}%</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="size-5 text-blue-600" />
                      Recent Test Results
                    </CardTitle>
                    <CardDescription>Latest performance assessments across the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentTests.slice(0, 5).map((test, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-white hover:shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="size-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{test.athlete}</p>
                            <p className="text-xs text-muted-foreground">{test.test} • {test.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={test.status === 'verified' ? 'default' : 'destructive'} className="mb-1">
                            {test.score}%
                          </Badge>
                          <p className="text-xs text-green-600">{test.improvement}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="size-5 text-blue-600" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Scheduled competitions and training programs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-white">
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{event.date}</span>
                            <span>{event.participants} participants</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={event.priority === 'high' ? 'destructive' : event.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {event.priority} priority
                          </Badge>
                          <Button size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Athletes Tab - Enhanced */}
          <TabsContent value="athletes" className="space-y-6">
            {/* Enhanced Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search athletes by name, location, or sport..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter athletes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Athletes</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="elite">Elite Potential</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="top">Top 50</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="w-full md:w-56 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                      <SelectValue placeholder="🎯 AI Sport Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      <SelectItem value="athletics">🏃‍♂️ Athletics Stars</SelectItem>
                      <SelectItem value="swimming">🏊‍♂️ Swimming Talents</SelectItem>
                      <SelectItem value="football">⚽ Football Prospects</SelectItem>
                      <SelectItem value="cricket">🏏 Cricket Players</SelectItem>
                      <SelectItem value="badminton">🏸 Badminton Aces</SelectItem>
                      <SelectItem value="wrestling">🤼‍♂️ Wrestling Champions</SelectItem>
                      <SelectItem value="basketball">🏀 Basketball Talents</SelectItem>
                      <SelectItem value="hockey">🏑 Hockey Players</SelectItem>
                      <SelectItem value="volleyball">🏐 Volleyball Stars</SelectItem>
                      <SelectItem value="tennis">🎾 Tennis Players</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="gap-2">
                    <Download className="size-4" />
                    Export
                  </Button>
                  
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <UserPlus className="size-4" />
                    Add Athlete
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Showing {filteredAthletes.length} of {athletes.length} athletes</span>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <RefreshCw className="size-3" />
                    Refresh
                  </Button>
                </div>

                {/* AI Sport-Specific Analysis */}
                {selectedSport !== 'all' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="size-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">
                        🎯 AI Analysis for {selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} Prospects
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-white rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-700 mb-1">Elite Prospects</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {filteredAthletes.filter(a => a.potential === 'Elite').length}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-700 mb-1">High Potential</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {filteredAthletes.filter(a => a.potential === 'High').length}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-700 mb-1">Avg AI Score</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {filteredAthletes.length > 0 ? Math.round(filteredAthletes.reduce((sum, a) => sum + a.aiScore, 0) / filteredAthletes.length) : 0}%
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-700 mb-1">Ready for Training</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {filteredAthletes.filter(a => a.aiScore >= 85).length}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-white/70 rounded-lg border border-purple-100">
                      <p className="text-sm text-purple-700">
                        <strong>🧠 AI Recommendation:</strong> 
                        {selectedSport === 'athletics' && ' Target athletes with outstanding sprint times and explosive power. Focus on 30m sprint and vertical jump champions for sprinting events.'}
                        {selectedSport === 'swimming' && ' Identify athletes with superior endurance and flexibility. Look for strong 800m run times and excellent sit-and-reach scores.'}
                        {selectedSport === 'football' && ' Focus on athletes with high endurance and agility scores. Prioritize consistent shuttle run and 800m performance with good ball control potential.'}
                        {selectedSport === 'cricket' && ' Seek well-rounded athletes with good hand-eye coordination and moderate fitness across all parameters. Look for balanced test scores.'}
                        {selectedSport === 'badminton' && ' Focus on athletes with exceptional agility and reaction time. Prioritize shuttle run champions and flexibility excellence.'}
                        {selectedSport === 'wrestling' && ' Target athletes with superior strength and power metrics. Look for medicine ball throw and broad jump excellence with good endurance.'}
                        {selectedSport === 'basketball' && ' Prioritize athletes with exceptional vertical jump and height advantage. Monitor power output and coordination skills.'}
                        {selectedSport === 'hockey' && ' Identify athletes with balanced endurance and agility. Focus on consistent performance across multiple fitness parameters.'}
                        {selectedSport === 'volleyball' && ' Look for outstanding vertical jump ability and reach. Monitor power and coordination metrics for net play potential.'}
                        {selectedSport === 'tennis' && ' Seek athletes with excellent agility and endurance combination. Look for strong shuttle run and moderate strength scores.'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Athletes Table */}
            <Card>
              <CardHeader>
                <CardTitle>Athlete Directory</CardTitle>
                <CardDescription>Comprehensive athlete management and monitoring system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Sport & Category</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Potential</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAthletes.map((athlete) => (
                      <TableRow key={athlete.id} className="hover:bg-blue-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-blue-100">
                              <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100">
                                {getInitials(athlete.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {athlete.name}
                                {athlete.flagged && <Flag className="size-3 text-red-500" />}
                                {athlete.potential === 'Elite' && <Star className="size-3 text-yellow-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                {athlete.gender}, {athlete.age} years
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3" />
                                  {athlete.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{athlete.sport}</p>
                            <p className="text-sm text-muted-foreground">{athlete.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={athlete.averageScore >= 90 ? 'default' : athlete.averageScore >= 80 ? 'secondary' : 'outline'}>
                                Avg: {athlete.averageScore}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">#{athlete.rank}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {athlete.testsCompleted} tests • AI Score: {athlete.aiScore}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPotentialColor(athlete.potential)}>
                            {athlete.potential}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className={`size-2 rounded-full ${
                                athlete.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                              <span className="text-sm capitalize">{athlete.status}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{athlete.lastActive}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Mail className="size-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="size-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="size-3" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Edit className="size-3" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab - Enhanced */}
          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Test Results
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="size-4" />
                      Refresh
                    </Button>
                  </CardTitle>
                  <CardDescription>Latest performance assessments requiring review and verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Test Details</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>AI Analysis</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTests.map((test, index) => (
                        <TableRow key={index} className="hover:bg-blue-50/50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{test.athlete}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="size-3" />
                                {test.location}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{test.test}</p>
                              <p className="text-sm text-muted-foreground">{test.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={test.score >= 85 ? 'default' : test.score >= 70 ? 'secondary' : 'destructive'}>
                                {test.score}%
                              </Badge>
                              <p className={`text-xs ${test.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {test.improvement}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Brain className="size-4 text-purple-500" />
                              <span className="text-sm">
                                {test.status === 'verified' ? 'Authentic' : 'Anomaly Detected'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={test.status === 'verified' ? 'default' : 'destructive'}>
                              {test.status === 'verified' ? (
                                <CheckCircle className="size-3 mr-1" />
                              ) : (
                                <AlertTriangle className="size-3 mr-1" />
                              )}
                              {test.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Eye className="size-3" />
                                Review
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Video className="size-3" />
                                Video
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    AI Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="size-4 text-green-600" />
                      <span className="font-medium text-green-900">System Health</span>
                    </div>
                    <p className="text-sm text-green-700">All AI models operating normally</p>
                    <p className="text-xs text-green-600 mt-1">98.7% accuracy maintained</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="size-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Pending Reviews</span>
                    </div>
                    <p className="text-sm text-yellow-700">23 flagged results awaiting manual review</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Review Queue
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="size-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Real-time Stats</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tests Today:</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified:</span>
                        <span className="font-medium text-green-600">1,211</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flagged:</span>
                        <span className="font-medium text-red-600">23</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab - Enhanced */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance Analysis</CardTitle>
                  <CardDescription>State-wise athlete performance and talent density</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="state" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
                      <Bar dataKey="eliteTalents" fill="#10b981" name="Elite Talents" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sport Distribution</CardTitle>
                  <CardDescription>Athlete participation across different sports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={sportDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}%`}
                      >
                        {sportDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution Analysis</CardTitle>
                <CardDescription>Breakdown of athlete performance levels across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Elite (95-100%)</span>
                      <span className="text-sm text-muted-foreground">8%</span>
                    </div>
                    <Progress value={8} className="h-3" />
                    <p className="text-xs text-muted-foreground">1,268 athletes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Excellent (90-94%)</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <Progress value={15} className="h-3" />
                    <p className="text-xs text-muted-foreground">2,377 athletes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Good (80-89%)</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <Progress value={42} className="h-3" />
                    <p className="text-xs text-muted-foreground">6,656 athletes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Average (60-79%)</span>
                      <span className="text-sm text-muted-foreground">35%</span>
                    </div>
                    <Progress value={35} className="h-3" />
                    <p className="text-xs text-muted-foreground">5,546 athletes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Talent Tab - New */}
          <TabsContent value="talent" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="size-5 text-yellow-600" />
                    Elite Talent Pipeline
                  </CardTitle>
                  <CardDescription>Athletes identified with exceptional potential for national teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {athletes.filter(athlete => athlete.potential === 'Elite').map((athlete) => (
                      <div key={athlete.id} className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-yellow-200">
                              <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-amber-100">
                                {getInitials(athlete.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{athlete.name}</p>
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Elite</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {athlete.sport} • {athlete.age} years • {athlete.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">#{athlete.rank}</p>
                            <p className="text-sm text-muted-foreground">AI Score: {athlete.aiScore}%</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" variant="outline">Schedule Assessment</Button>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            <Star className="size-3 mr-1" />
                            Mark for National Team
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="size-5 text-purple-600" />
                    AI Talent Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-2">Breakthrough Prediction</h4>
                    <p className="text-sm text-purple-700 mb-3">12 athletes showing rapid improvement trajectory</p>
                    <Button size="sm" variant="outline">View Predictions</Button>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Hidden Gems</h4>
                    <p className="text-sm text-blue-700 mb-3">AI identified 28 underrated talents with high potential</p>
                    <Button size="sm" variant="outline">Explore Talents</Button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Cross-Sport Analysis</h4>
                    <p className="text-sm text-green-700 mb-3">Athletes with transferable skills across multiple sports</p>
                    <Button size="sm" variant="outline">View Analysis</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab - Enhanced */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5 text-blue-600" />
                    Standard Reports
                  </CardTitle>
                  <CardDescription>Pre-configured reports for various stakeholders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Daily Performance Summary', desc: 'Daily test results and athlete activity', icon: <Activity className="size-4" /> },
                      { name: 'Weekly Talent Report', desc: 'Elite talents identified this week', icon: <Star className="size-4" /> },
                      { name: 'Regional Analysis', desc: 'State-wise performance breakdown', icon: <Globe className="size-4" /> },
                      { name: 'AI Accuracy Report', desc: 'AI model performance metrics', icon: <Brain className="size-4" /> },
                      { name: 'Athlete Progress Report', desc: 'Individual athlete improvement tracking', icon: <TrendingUp className="size-4" /> }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {report.icon}
                          </div>
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <p className="text-sm text-muted-foreground">{report.desc}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="size-3" />
                          Generate
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="size-5 text-purple-600" />
                    Custom Report Builder
                  </CardTitle>
                  <CardDescription>Create tailored reports with specific filters and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance Analysis</SelectItem>
                          <SelectItem value="talent">Talent Identification</SelectItem>
                          <SelectItem value="regional">Regional Comparison</SelectItem>
                          <SelectItem value="trends">Trend Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Time Period</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 3 months</SelectItem>
                          <SelectItem value="365d">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Filters</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Badge variant="outline" className="justify-center">Elite Only</Badge>
                        <Badge variant="outline" className="justify-center">Active Athletes</Badge>
                        <Badge variant="outline" className="justify-center">Top 100</Badge>
                        <Badge variant="outline" className="justify-center">By Sport</Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
                      <Plus className="size-4" />
                      Build Custom Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manage Tab - New */}
          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="size-5 text-blue-600" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Manage platform settings and AI parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">AI Model Settings</p>
                        <p className="text-sm text-muted-foreground">Configure AI accuracy thresholds</p>
                      </div>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Test Parameters</p>
                        <p className="text-sm text-muted-foreground">Manage test types and scoring</p>
                      </div>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">User Permissions</p>
                        <p className="text-sm text-muted-foreground">Control access levels and roles</p>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Data Export Settings</p>
                        <p className="text-sm text-muted-foreground">Configure export formats and schedules</p>
                      </div>
                      <Button size="sm" variant="outline">Setup</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="size-5 text-green-600" />
                    System Health
                  </CardTitle>
                  <CardDescription>Monitor platform performance and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>AI Model Performance</span>
                      <Badge variant="default">98.7% Accuracy</Badge>
                    </div>
                    <Progress value={98.7} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Server Uptime</span>
                      <Badge variant="default">99.9%</Badge>
                    </div>
                    <Progress value={99.9} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Database Health</span>
                      <Badge variant="default">Optimal</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>API Response Time</span>
                      <Badge variant="default">45ms avg</Badge>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  
                  <Button className="w-full gap-2 mt-4">
                    <Monitor className="size-4" />
                    View Detailed Metrics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}