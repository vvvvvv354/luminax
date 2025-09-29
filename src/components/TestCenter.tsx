import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Camera, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Eye,
  Timer,
  TrendingUp,
  Target,
  Zap,
  Trophy,
  Brain,
  Ruler,
  Weight,
  Dumbbell,
  Activity,
  Heart,
  MapPin,
  Settings,
  Shield,
  Smartphone,
  AlertCircle,
  Loader,
  Upload
} from 'lucide-react';
import { TestInstructions } from './TestInstructions';
import { CameraPermissions } from './CameraPermissions';
import { LiveTestInterface } from './LiveTestInterface';
import { VideoUploadInterface } from './VideoUploadInterface';
import { TestResult } from '../utils/mlModels';
import type { Page, User } from '../App';

interface TestCenterProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

type TestPhase = 'selection' | 'instructions' | 'permissions' | 'live-test' | 'video-upload' | 'results';

export function TestCenter({ user, onNavigate, onLogout }: TestCenterProps) {
  const [currentPhase, setCurrentPhase] = useState<TestPhase>('selection');
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only the 10 specific fitness tests from the document
  const availableTests = [
    {
      id: 'height',
      name: 'Height Measurement',
      description: 'Measure your height using AR technology and reference objects',
      duration: '1-2 minutes',
      icon: <Ruler className="size-6" />,
      difficulty: 'Easy',
      category: 'Anthropometric',
      accuracy: '±0.5cm',
      equipment: ['Wall', 'Reference object (credit card)', 'Good lighting']
    },
    {
      id: 'weight',
      name: 'Weight Measurement',
      description: 'Record your weight with digital scale tracking',
      duration: '30 seconds',
      icon: <Weight className="size-6" />,
      difficulty: 'Easy',
      category: 'Anthropometric',
      accuracy: '±0.1kg',
      equipment: ['Digital scale', 'Flat surface', 'Minimal clothing']
    },
    {
      id: 'sit_and_reach',
      name: 'Sit and Reach Flexibility',
      description: 'Test hamstring and lower back flexibility',
      duration: '2-3 minutes',
      icon: <Activity className="size-6" />,
      difficulty: 'Easy',
      category: 'Flexibility',
      accuracy: '±0.5cm',
      equipment: ['Wall or box', 'Measuring tape', 'Clear space']
    },
    {
      id: 'vertical_jump',
      name: 'Standing Vertical Jump',
      description: 'Measure explosive lower body power',
      duration: '2-3 minutes',
      icon: <TrendingUp className="size-6" />,
      difficulty: 'Medium',
      category: 'Power',
      accuracy: '±2-3cm',
      equipment: ['Phone mount', 'Clear jumping space', 'Motion sensors']
    },
    {
      id: 'broad_jump',
      name: 'Standing Broad Jump',
      description: 'Measure horizontal jumping distance',
      duration: '3-4 minutes',
      icon: <Target className="size-6" />,
      difficulty: 'Medium',
      category: 'Power',
      accuracy: '±5-10cm',
      equipment: ['Clear space', 'Reference object', 'Safe landing area']
    },
    {
      id: 'medicine_ball_throw',
      name: 'Medicine Ball Throw',
      description: 'Test upper body power and strength',
      duration: '4-5 minutes',
      icon: <Dumbbell className="size-6" />,
      difficulty: 'Hard',
      category: 'Strength',
      accuracy: '±10-15cm',
      equipment: ['2-3kg medicine ball', 'Wall', 'Clear throw path']
    },
    {
      id: '30m_sprint',
      name: '30m Standing Start Sprint',
      description: 'Measure sprint speed and acceleration',
      duration: '3-4 minutes',
      icon: <Zap className="size-6" />,
      difficulty: 'Medium',
      category: 'Speed',
      accuracy: '±0.01s',
      equipment: ['30m measured course', 'GPS access', 'Cones for markers']
    },
    {
      id: 'shuttle_run',
      name: '4×10m Shuttle Run',
      description: 'Test agility and direction change ability',
      duration: '4-5 minutes',
      icon: <Activity className="size-6" />,
      difficulty: 'Hard',
      category: 'Agility',
      accuracy: '±0.2s',
      equipment: ['10m course', 'Cones', 'Motion sensors']
    },
    {
      id: 'sit_ups',
      name: 'Sit-ups Endurance',
      description: 'Test core strength and muscular endurance',
      duration: '60 seconds',
      icon: <Target className="size-6" />,
      difficulty: 'Medium',
      category: 'Endurance',
      accuracy: '95%+ counting',
      equipment: ['Exercise mat', 'Clear space', 'Assistant optional']
    },
    {
      id: 'endurance_run',
      name: '800m/1.6km Endurance Run',
      description: 'Test cardiovascular fitness and endurance',
      duration: '3-15 minutes',
      icon: <Heart className="size-6" />,
      difficulty: 'Hard',
      category: 'Endurance',
      accuracy: '±10-20m',
      equipment: ['Measured track', 'GPS access', 'Heart rate monitor optional']
    }
  ];

  const getCurrentTest = () => availableTests.find(test => test.id === selectedTest);

  const handleTestSelect = (testId: string) => {
    setSelectedTest(testId);
    setCurrentPhase('instructions');
    setError(null);
  };

  const handleStartLiveTest = () => {
    setCurrentPhase('permissions');
  };

  const handleStartVideoUpload = () => {
    setCurrentPhase('video-upload');
  };

  const handlePermissionsGranted = () => {
    setCurrentPhase('live-test');
  };

  const handleTestComplete = (result: TestResult) => {
    setTestResults(result);
    setCurrentPhase('results');
  };

  const handleBackToSelection = () => {
    setCurrentPhase('selection');
    setSelectedTest('');
    setTestResults(null);
    setError(null);
  };

  const handleBackToInstructions = () => {
    setCurrentPhase('instructions');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Anthropometric': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Flexibility': return 'bg-green-100 text-green-800 border-green-200';
      case 'Power': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Strength': return 'bg-red-100 text-red-800 border-red-200';
      case 'Speed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Agility': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Endurance': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <AnimatePresence mode="wait">
        {/* Test Selection Phase */}
        {currentPhase === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="gap-2">
                      <ArrowLeft className="size-4" />
                      Back to Dashboard
                    </Button>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        AI Fitness Test Center
                      </h1>
                      <p className="text-sm text-muted-foreground">Scientific Fitness Assessment Platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="size-3" />
                      SAI Verified
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Brain className="size-3" />
                      AI Powered
                    </Badge>
                  </div>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-6 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Choose Your Fitness Test</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Select from 10 scientifically validated fitness assessments used by Sports Authority of India. 
                    Each test uses advanced AI and computer vision for accurate, real-time analysis.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {availableTests.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-100 h-full border-0 bg-white/80 backdrop-blur-sm"
                        onClick={() => handleTestSelect(test.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                              {test.icon}
                            </div>
                            <div className="text-right space-y-1">
                              <Badge className={`text-xs ${getDifficultyColor(test.difficulty)}`}>
                                {test.difficulty}
                              </Badge>
                              <Badge className={`text-xs ${getCategoryColor(test.category)}`}>
                                {test.category}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg leading-tight">{test.name}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">{test.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Timer className="size-4 text-blue-600" />
                              <span>{test.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Target className="size-4 text-green-600" />
                              <span>{test.accuracy} accuracy</span>
                            </div>
                            
                            <div className="pt-2">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Equipment:</p>
                              <div className="space-y-1">
                                {test.equipment.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CheckCircle className="size-3 text-green-600 flex-shrink-0" />
                                    <span className="truncate">{item}</span>
                                  </div>
                                ))}
                                {test.equipment.length > 2 && (
                                  <p className="text-xs text-blue-600 font-medium">
                                    +{test.equipment.length - 2} more items
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Info Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="mt-12"
                >
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="size-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Brain className="size-6 text-white" />
                          </div>
                          <h3 className="font-bold text-blue-900 mb-2">AI-Powered Analysis</h3>
                          <p className="text-sm text-blue-700">Advanced computer vision and machine learning for accurate measurements</p>
                        </div>
                        <div>
                          <div className="size-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="size-6 text-white" />
                          </div>
                          <h3 className="font-bold text-green-900 mb-2">SAI Standards</h3>
                          <p className="text-sm text-green-700">Tests follow Sports Authority of India protocols and standards</p>
                        </div>
                        <div>
                          <div className="size-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Eye className="size-6 text-white" />
                          </div>
                          <h3 className="font-bold text-purple-900 mb-2">Real-time Feedback</h3>
                          <p className="text-sm text-purple-700">Live form analysis and performance optimization during tests</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Test Instructions Phase */}
        {currentPhase === 'instructions' && selectedTest && (
          <TestInstructions
            testId={selectedTest}
            onStartTest={handleStartLiveTest}
            onUploadVideo={handleStartVideoUpload}
            onBack={handleBackToSelection}
          />
        )}

        {/* Camera Permissions Phase */}
        {currentPhase === 'permissions' && selectedTest && (
          <CameraPermissions
            testId={selectedTest}
            onPermissionsGranted={handlePermissionsGranted}
            onBack={handleBackToInstructions}
          />
        )}

        {/* Live Test Phase */}
        {currentPhase === 'live-test' && selectedTest && (
          <LiveTestInterface
            testId={selectedTest}
            onComplete={handleTestComplete}
            onBack={handleBackToInstructions}
          />
        )}

        {/* Video Upload Phase */}
        {currentPhase === 'video-upload' && selectedTest && (
          <VideoUploadInterface
            testId={selectedTest}
            onComplete={handleTestComplete}
            onBack={handleBackToInstructions}
          />
        )}

        {/* Results Phase */}
        {currentPhase === 'results' && testResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {/* Header */}
            <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Trophy className="size-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">Test Complete!</h1>
                      <p className="text-sm text-muted-foreground">{getCurrentTest()?.name} Results</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="size-3 text-green-600" />
                    Analysis Complete
                  </Badge>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{testResults.score}</div>
                      <div className="text-sm text-blue-700 font-medium">{testResults.unit}</div>
                      <Badge variant="outline" className="mt-2 border-blue-300 text-blue-700">Primary Score</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">{testResults.accuracy}%</div>
                      <div className="text-sm text-green-700 font-medium">AI Accuracy</div>
                      <Badge variant="outline" className="mt-2 border-green-300 text-green-700">Confidence</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{getCurrentTest()?.category}</div>
                      <div className="text-sm text-purple-700 font-medium">Test Category</div>
                      <Badge variant="outline" className="mt-2 border-purple-300 text-purple-700">Classification</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-bold text-orange-600 mb-2">
                        {new Date(testResults.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-orange-700 font-medium">Test Date</div>
                      <Badge variant="outline" className="mt-2 border-orange-300 text-orange-700">Completed</Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="size-5 text-blue-600" />
                        Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">AI Assessment</h4>
                        <p className="text-sm text-blue-700">{testResults.feedback}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Technical Accuracy</span>
                            <span className="text-sm font-medium">{testResults.accuracy}%</span>
                          </div>
                          <Progress value={testResults.accuracy} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Form Quality</span>
                            <span className="text-sm font-medium">87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Consistency</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="size-5 text-purple-600" />
                        AI Insights & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="size-4 text-green-600" />
                            <span className="font-medium text-green-900">Strengths</span>
                          </div>
                          <p className="text-sm text-green-700">Excellent form and consistent execution throughout the test</p>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="size-4 text-yellow-600" />
                            <span className="font-medium text-yellow-900">Areas for Improvement</span>
                          </div>
                          <p className="text-sm text-yellow-700">Focus on increasing range of motion for better results</p>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="size-4 text-blue-600" />
                            <span className="font-medium text-blue-900">Next Steps</span>
                          </div>
                          <p className="text-sm text-blue-700">Consider adding specific training exercises to improve your score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Button variant="outline" onClick={handleBackToSelection} className="gap-2">
                    <RotateCcw className="size-4" />
                    Try Another Test
                  </Button>
                  <Button onClick={() => onNavigate('dashboard')} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Trophy className="size-4" />
                    View Dashboard
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-50"
        >
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}