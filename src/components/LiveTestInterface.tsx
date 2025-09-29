import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
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
  Target,
  Brain,
  Zap,
  Upload
} from 'lucide-react';
import { FitnessTestManager } from '../utils/fitnessTests';
import { TestResult, CalibrationData } from '../utils/mlModels';

interface LiveTestInterfaceProps {
  testId: string;
  onComplete: (result: TestResult) => void;
  onBack: () => void;
}

export function LiveTestInterface({ testId, onComplete, onBack }: LiveTestInterfaceProps) {
  const [phase, setPhase] = useState<'setup' | 'calibration' | 'countdown' | 'testing' | 'analysis'>('setup');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [testDuration, setTestDuration] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    reps: 0,
    form: 'good' as 'good' | 'needs improvement',
    confidence: 95,
    height: 0,
    distance: 0,
    speed: 0
  });
  const [calibration, setCalibration] = useState<CalibrationData>({});
  const [error, setError] = useState<string>('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fitnessManager = useRef(new FitnessTestManager());

  // Test-specific configurations
  const testConfigs = {
    height: {
      name: 'Height Measurement',
      instructions: 'Stand straight against the wall. Hold reference object in view.',
      duration: 0, // No time limit
      needsCalibration: true,
      liveMetrics: ['height', 'confidence']
    },
    weight: {
      name: 'Weight Recording',
      instructions: 'Step on the scale and input your weight.',
      duration: 0,
      needsCalibration: false,
      liveMetrics: []
    },
    sit_and_reach: {
      name: 'Flexibility Test',
      instructions: 'Sit with legs straight. Reach forward slowly and hold.',
      duration: 0,
      needsCalibration: false,
      liveMetrics: ['distance', 'form', 'confidence']
    },
    vertical_jump: {
      name: 'Vertical Jump',
      instructions: 'Secure phone to chest. Jump straight up with maximum effort.',
      duration: 10,
      needsCalibration: false,
      liveMetrics: ['height', 'confidence']
    },
    broad_jump: {
      name: 'Standing Broad Jump',
      instructions: 'Jump forward as far as possible. Land on both feet.',
      duration: 0,
      needsCalibration: true,
      liveMetrics: ['distance', 'confidence']
    },
    medicine_ball_throw: {
      name: 'Medicine Ball Throw',
      instructions: 'Sit against wall. Throw ball forward with maximum effort.',
      duration: 0,
      needsCalibration: true,
      liveMetrics: ['distance', 'confidence']
    },
    '30m_sprint': {
      name: '30m Sprint',
      instructions: 'Sprint 30 meters at maximum speed.',
      duration: 15,
      needsCalibration: false,
      liveMetrics: ['speed', 'distance']
    },
    shuttle_run: {
      name: '4×10m Shuttle Run',
      instructions: 'Run between cones 4 times. Touch each line.',
      duration: 30,
      needsCalibration: false,
      liveMetrics: ['reps', 'speed']
    },
    sit_ups: {
      name: 'Sit-ups Endurance',
      instructions: 'Perform maximum sit-ups in 60 seconds.',
      duration: 60,
      needsCalibration: false,
      liveMetrics: ['reps', 'form', 'confidence']
    },
    endurance_run: {
      name: 'Endurance Run',
      instructions: 'Run 800m or 1.6km at steady pace.',
      duration: 600, // 10 minutes max
      needsCalibration: false,
      liveMetrics: ['distance', 'speed']
    }
  };

  const currentTest = testConfigs[testId as keyof typeof testConfigs];

  useEffect(() => {
    initializeCamera();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && phase === 'testing') {
      interval = setInterval(() => {
        setTestDuration(prev => prev + 1);
        updateLiveMetrics();
        
        // Auto-stop for timed tests
        if (currentTest.duration > 0 && testDuration >= currentTest.duration) {
          stopTest();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, phase, testDuration, currentTest.duration]);

  const initializeCamera = async () => {
    try {
      // Only request camera for visual tests
      const needsCamera = ['height', 'sit_and_reach', 'broad_jump', 'medicine_ball_throw', 'sit_ups'].includes(testId);
      
      if (needsCamera) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
      
      // Move to calibration if needed, otherwise ready to test
      if (currentTest.needsCalibration && needsCamera) {
        setPhase('calibration');
      } else {
        setPhase('countdown');
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
    }
  };

  const completeCalibration = () => {
    // Simulate calibration completion
    setCalibration({ 
      pixelsPerCm: 5, 
      referenceObject: 'credit_card',
      cameraHeight: 1.5 
    });
    setPhase('countdown');
  };

  const startCountdown = async () => {
    setPhase('countdown');
    
    // 3-2-1 countdown for action tests
    if (['vertical_jump', 'broad_jump', 'sit_ups', '30m_sprint', 'shuttle_run'].includes(testId)) {
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setCountdown(0);
    startTest();
  };

  const startTest = () => {
    setPhase('testing');
    setIsRecording(true);
    setTestDuration(0);
    setError('');
  };

  const stopTest = async () => {
    setIsRecording(false);
    setPhase('analysis');
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        return Math.min(newProgress, 100);
      });
    }, 300);

    try {
      // Execute the actual test based on type
      const result = await executeTest();
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onComplete(result);
    } catch (err) {
      clearInterval(progressInterval);
      setError(`Test analysis failed: ${err.message}`);
      setPhase('testing');
    }
  };

  const executeTest = async (): Promise<TestResult> => {
    const testManager = fitnessManager.current;

    switch (testId) {
      case 'height':
        if (!videoRef.current) throw new Error('Camera not available');
        return await testManager.measureHeight(videoRef.current, calibration);

      case 'weight':
        const weight = await promptForWeight();
        return testManager.recordWeight(weight);

      case 'sit_and_reach':
        if (!videoRef.current) throw new Error('Camera not available');
        return await testManager.measureSitAndReach(videoRef.current);

      case 'vertical_jump':
        return await testManager.measureVerticalJump();

      case 'broad_jump':
        if (!videoRef.current) throw new Error('Camera not available');
        return await testManager.measureBroadJump(videoRef.current, calibration);

      case 'medicine_ball_throw':
        if (!videoRef.current) throw new Error('Camera not available');
        return await testManager.measureMedicineBallThrow(videoRef.current, calibration);

      case '30m_sprint':
        return await testManager.measure30mSprint();

      case 'shuttle_run':
        return await testManager.measureShuttleRun();

      case 'sit_ups':
        if (!videoRef.current) throw new Error('Camera not available');
        return await testManager.measureSitUps(videoRef.current, 60);

      case 'endurance_run':
        return await testManager.measureEnduranceRun(800);

      default:
        throw new Error('Unknown test type');
    }
  };

  const promptForWeight = (): Promise<number> => {
    return new Promise((resolve) => {
      const weight = prompt('Enter your weight in kg (e.g., 70.5):');
      const weightNum = parseFloat(weight || '70');
      resolve(isNaN(weightNum) ? 70 : weightNum);
    });
  };

  const updateLiveMetrics = () => {
    // Simulate live metric updates based on test type
    setLiveMetrics(prev => {
      const updates: any = {};
      
      if (testId === 'sit_ups') {
        updates.reps = prev.reps + (Math.random() > 0.7 ? 1 : 0);
        updates.form = Math.random() > 0.8 ? 'needs improvement' : 'good';
      }
      
      if (testId === 'shuttle_run') {
        updates.reps = Math.floor(testDuration / 8); // Approximate shuttles completed
        updates.speed = 3 + Math.random() * 2; // m/s
      }
      
      if (['30m_sprint', 'endurance_run'].includes(testId)) {
        updates.distance = testDuration * (2 + Math.random() * 3); // meters
        updates.speed = 2 + Math.random() * 4; // m/s
      }
      
      updates.confidence = 90 + Math.random() * 10;
      
      return { ...prev, ...updates };
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverlayGuides = () => {
    switch (testId) {
      case 'height':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-4 border-2 border-blue-500 border-dashed">
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                Stand Here
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded text-sm">
              Show Reference Object
            </div>
          </div>
        );
      
      case 'sit_and_reach':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-500">
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                Reach Line
              </div>
            </div>
          </div>
        );
      
      case 'sit_ups':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded">
              Reps: {liveMetrics.reps}
            </div>
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded">
              Form: {liveMetrics.form}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{currentTest.name}</h1>
                <p className="text-sm text-muted-foreground">Live AI Analysis Active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isRecording && (
                <Badge variant="destructive" className="gap-1">
                  <div className="size-2 bg-white rounded-full animate-pulse" />
                  Recording
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Brain className="size-3" />
                AI Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Setup Phase */}
        {phase === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card>
              <CardContent className="p-8">
                <div className="size-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="size-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Setting Up Camera</h2>
                <p className="text-muted-foreground">Initializing camera and sensors for the test...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Calibration Phase */}
        {phase === 'calibration' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Camera Calibration</h2>
              <p className="text-muted-foreground">{currentTest.instructions}</p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-black">
                  <video
                    ref={videoRef}
                    className="w-full aspect-video object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  {getOverlayGuides()}
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <Button size="lg" onClick={completeCalibration} className="gap-2">
                <CheckCircle className="size-5" />
                Calibration Complete
              </Button>
            </div>
          </motion.div>
        )}

        {/* Countdown Phase */}
        {phase === 'countdown' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card>
              <CardContent className="p-12">
                {countdown > 0 ? (
                  <>
                    <div className="text-8xl font-bold text-blue-600 mb-4 animate-pulse">
                      {countdown}
                    </div>
                    <p className="text-xl text-muted-foreground">Get Ready!</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold mb-4">Ready to Start</h2>
                    <p className="text-muted-foreground mb-6">{currentTest.instructions}</p>
                    <Button size="lg" onClick={startCountdown} className="gap-2">
                      <Play className="size-5" />
                      Begin Test
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Testing Phase */}
        {phase === 'testing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Video Feed */}
              <div className="lg:col-span-3">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative bg-black">
                      {videoRef.current && (
                        <video
                          ref={videoRef}
                          className="w-full aspect-video object-cover"
                          autoPlay
                          muted
                          playsInline
                        />
                      )}
                      
                      {/* Test-specific overlays */}
                      {getOverlayGuides()}
                      
                      {/* Timer overlay */}
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded">
                        {currentTest.duration > 0 ? (
                          `${formatTime(currentTest.duration - testDuration)}`
                        ) : (
                          formatTime(testDuration)
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsRecording(!isRecording)}
                    className="gap-2"
                  >
                    {isRecording ? <Pause className="size-4" /> : <Play className="size-4" />}
                    {isRecording ? 'Pause' : 'Resume'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={stopTest}
                    className="gap-2"
                  >
                    <Square className="size-4" />
                    Stop & Analyze
                  </Button>
                </div>
              </div>

              {/* Live Metrics */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="size-5" />
                      Live Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Confidence</span>
                        <span>{Math.round(liveMetrics.confidence)}%</span>
                      </div>
                      <Progress value={liveMetrics.confidence} className="h-2" />
                    </div>

                    {currentTest.liveMetrics.includes('reps') && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{liveMetrics.reps}</div>
                        <div className="text-sm text-muted-foreground">Repetitions</div>
                      </div>
                    )}

                    {currentTest.liveMetrics.includes('form') && (
                      <div className={`p-3 rounded-lg text-center ${
                        liveMetrics.form === 'good' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <div className="font-medium">Form</div>
                        <div className="text-sm">{liveMetrics.form}</div>
                      </div>
                    )}

                    {currentTest.liveMetrics.includes('distance') && liveMetrics.distance > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{liveMetrics.distance.toFixed(1)}m</div>
                        <div className="text-sm text-muted-foreground">Distance</div>
                      </div>
                    )}

                    {currentTest.liveMetrics.includes('speed') && liveMetrics.speed > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{liveMetrics.speed.toFixed(1)} m/s</div>
                        <div className="text-sm text-muted-foreground">Speed</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{currentTest.instructions}</p>
                    
                    {currentTest.duration > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">
                          Time Remaining: {formatTime(Math.max(0, currentTest.duration - testDuration))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Phase */}
        {phase === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card>
              <CardContent className="p-12">
                <div className="size-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="size-10 text-white animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Analyzing Performance</h2>
                <p className="text-muted-foreground mb-8">
                  AI is processing your test data and calculating results...
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Progress</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
            <AlertTriangle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}