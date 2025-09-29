import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Trophy, 
  Star, 
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Settings,
  Shield,
  Bell,
  Eye,
  Lock,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Activity,
  Target,
  BarChart3,
  Heart,
  Zap,
  Timer
} from 'lucide-react';
import type { User as UserType } from '../App';

interface UserProfileManagementProps {
  user: UserType | null;
  onUpdate: (updatedUser: UserType) => void;
  onClose: () => void;
}

export function UserProfileManagement({ user, onUpdate, onClose }: UserProfileManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editData, setEditData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    age: user?.profile?.age?.toString() || '',
    height: user?.profile?.height?.toString() || '',
    weight: user?.profile?.weight?.toString() || '',
    bio: '',
    specialization: user?.profile?.specialization || '',
    experience: user?.profile?.experience || '',
    certifications: user?.profile?.certifications?.join(', ') || ''
  }));

  const [settings, setSettings] = useState({
    notifications: true,
    publicProfile: true,
    shareProgress: false,
    emailUpdates: true,
    smsNotifications: false
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    if (!user) return;

    const updatedProfile = {
      ...user.profile,
      phone: editData.phone,
      location: editData.location,
      age: parseInt(editData.age) || 0,
      height: parseInt(editData.height) || 0,
      weight: parseInt(editData.weight) || 0,
      specialization: editData.specialization,
      experience: editData.experience,
      certifications: editData.certifications.split(',').map(c => c.trim()).filter(c => c)
    };

    const updatedUser: UserType = {
      ...user,
      name: editData.name,
      email: editData.email,
      profile: updatedProfile
    };

    onUpdate(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      age: user?.profile?.age?.toString() || '',
      height: user?.profile?.height?.toString() || '',
      weight: user?.profile?.weight?.toString() || '',
      bio: '',
      specialization: user?.profile?.specialization || '',
      experience: user?.profile?.experience || '',
      certifications: user?.profile?.certifications?.join(', ') || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  const completionPercentage = useMemo(() => {
    const filledFields = Object.values(editData).filter(value => value && value !== '').length;
    const totalFields = Object.values(editData).length;
    return Math.round((filledFields / totalFields) * 100);
  }, [editData]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border-4 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">
                  {user.role === 'athlete' && 'Athlete Profile'}
                  {user.role === 'coach' && 'Coach Profile'}
                  {user.role === 'official' && 'SAI Official Profile'}
                </p>
                <Badge variant="secondary" className="mt-1">
                  Profile {completionPercentage}% Complete
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="size-5 text-yellow-600" />
                    Profile Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Complete your profile to unlock all features</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="size-5" />
                      Basic Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="size-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCancel}
                        >
                          <X className="size-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSave}
                        >
                          <Save className="size-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.profile?.phone || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      {isEditing ? (
                        <Input
                          value={editData.location}
                          onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.profile?.location || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Age</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editData.age}
                          onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.profile?.age || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <p className="text-sm py-2">{user.profile?.gender || 'Not provided'}</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editData.height}
                          onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.profile?.height || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editData.weight}
                          onChange={(e) => setEditData(prev => ({ ...prev, weight: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm py-2">{user.profile?.weight || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {user.role === 'coach' && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Coach Information</h4>
                      
                      <div className="space-y-2">
                        <Label>Specialization</Label>
                        {isEditing ? (
                          <Input
                            value={editData.specialization}
                            onChange={(e) => setEditData(prev => ({ ...prev, specialization: e.target.value }))}
                            placeholder="e.g., Track & Field, Swimming, Football"
                          />
                        ) : (
                          <p className="text-sm py-2">{user.profile?.specialization || 'Not provided'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Experience</Label>
                        {isEditing ? (
                          <Input
                            value={editData.experience}
                            onChange={(e) => setEditData(prev => ({ ...prev, experience: e.target.value }))}
                            placeholder="e.g., 5 years coaching experience"
                          />
                        ) : (
                          <p className="text-sm py-2">{user.profile?.experience || 'Not provided'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Certifications</Label>
                        {isEditing ? (
                          <Textarea
                            value={editData.certifications}
                            onChange={(e) => setEditData(prev => ({ ...prev, certifications: e.target.value }))}
                            placeholder="Enter certifications separated by commas"
                          />
                        ) : (
                          <div className="py-2">
                            {user.profile?.certifications?.length ? (
                              <div className="flex flex-wrap gap-1">
                                {user.profile.certifications.map((cert, index) => (
                                  <Badge key={index} variant="secondary">{cert}</Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No certifications added</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parent Consent Information - Show for users under 18 */}
              {user.profile?.parentConsent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="size-5 text-amber-600" />
                      Parent/Guardian Consent
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Parent/Guardian Name</Label>
                        <p className="font-medium">{user.profile.parentConsent.parentName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Relationship</Label>
                        <p className="font-medium capitalize">{user.profile.parentConsent.relationship}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Parent Email</Label>
                        <p className="font-medium">{user.profile.parentConsent.parentEmail}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Parent Phone</Label>
                        <p className="font-medium">{user.profile.parentConsent.parentPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Check className="size-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Consent Provided</p>
                        <p className="text-xs text-green-600">
                          Consent given on {new Date(user.profile.parentConsent.consentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="size-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="size-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Member Since</p>
                          <p className="font-medium">January 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Activity className="size-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Active</p>
                          <p className="font-medium">Today</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Trophy className="size-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Profile Status</p>
                          <p className="font-medium">{completionPercentage}% Complete</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Target className="size-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tests Completed</p>
                          <p className="font-medium">12</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <BarChart3 className="size-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Score</p>
                          <p className="font-medium">85%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Heart className="size-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fitness Level</p>
                          <p className="font-medium">Intermediate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="size-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="size-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Speed & Agility</p>
                          <p className="text-sm text-muted-foreground">Latest: 8.2/10</p>
                        </div>
                      </div>
                      <Progress value={82} className="w-24" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="size-5 text-green-600" />
                        <div>
                          <p className="font-medium">Endurance</p>
                          <p className="text-sm text-muted-foreground">Latest: 7.8/10</p>
                        </div>
                      </div>
                      <Progress value={78} className="w-24" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="size-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Strength</p>
                          <p className="text-sm text-muted-foreground">Latest: 9.1/10</p>
                        </div>
                      </div>
                      <Progress value={91} className="w-24" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Timer className="size-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Flexibility</p>
                          <p className="text-sm text-muted-foreground">Latest: 6.9/10</p>
                        </div>
                      </div>
                      <Progress value={69} className="w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Completed Sprint Test', date: '2 hours ago', score: '8.5/10' },
                      { action: 'Updated Profile Information', date: '1 day ago', score: null },
                      { action: 'Completed Endurance Test', date: '3 days ago', score: '7.8/10' },
                      { action: 'Received Sport Recommendation', date: '1 week ago', score: null }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                        {activity.score && (
                          <Badge variant="secondary">{activity.score}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="size-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about tests and updates</p>
                    </div>
                    <Switch 
                      checked={settings.notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Updates</p>
                      <p className="text-sm text-muted-foreground">Get weekly progress reports via email</p>
                    </div>
                    <Switch 
                      checked={settings.emailUpdates}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive important updates via SMS</p>
                    </div>
                    <Switch 
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="size-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                    </div>
                    <Switch 
                      checked={settings.publicProfile}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, publicProfile: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Share Progress</p>
                      <p className="text-sm text-muted-foreground">Share your test results with coaches</p>
                    </div>
                    <Switch 
                      checked={settings.shareProgress}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, shareProgress: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="size-5" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="size-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="size-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="size-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="size-4 mr-2" />
                    Export My Data
                  </Button>
                  
                  <Alert>
                    <AlertTriangle className="size-4" />
                    <AlertDescription>
                      <strong>Delete Account:</strong> This action cannot be undone. All your data will be permanently removed.
                    </AlertDescription>
                  </Alert>
                  
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="size-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}