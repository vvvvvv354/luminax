import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  Upload,
  ArrowLeft,
  Timer,
  Target,
  Ruler,
  Weight,
  Activity,
  TrendingUp,
  Dumbbell,
  Zap,
  Heart,
  Play,
  ExternalLink
} from 'lucide-react';

interface TestInstructionsProps {
  testId: string;
  onStartTest: () => void;
  onUploadVideo: () => void;
  onBack: () => void;
}

const testInstructions = {
  height: {
    name: 'Height Measurement',
    icon: <Ruler className="size-6" />,
    duration: '1-2 minutes',
    accuracy: '±0.5cm',
    equipment: ['Measuring tape', 'Wall', 'Flat surface', 'Reference object (credit card)'],
    description: 'Measure your height accurately using computer vision and reference object calibration.',
    tutorialVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example tutorial video
    procedure: [
      'Remove shoes and stand barefoot',
      'Stand against a wall with heels together',
      'Keep your back straight and head level',
      'Place a credit card in view for scale reference',
      'Hold position until measurement is complete'
    ],
    dos: [
      'Stand on a flat, hard surface (not carpet)',
      'Keep your back flat against the wall',
      'Look straight ahead, not up or down',
      'Ensure good lighting in the room',
      'Hold the reference object steady in camera view',
      'Stand completely still during measurement'
    ],
    donts: [
      'Don\'t wear shoes or thick socks',
      'Don\'t stand on soft surfaces like carpet',
      'Don\'t look up or tilt your head',
      'Don\'t move during the measurement',
      'Don\'t use damaged or bent reference objects',
      'Don\'t measure in poor lighting conditions'
    ],
    tips: [
      'Take the measurement at the same time of day for consistency',
      'Have someone help position the camera if needed',
      'Ensure the camera captures your full height',
      'Use a standard credit card for best accuracy'
    ]
  },
  weight: {
    name: 'Weight Measurement',
    icon: <Weight className="size-6" />,
    duration: '30 seconds',
    accuracy: '±0.1kg',
    equipment: ['Digital scale', 'Flat surface'],
    description: 'Record your weight using a digital scale with manual input and tracking.',
    tutorialVideo: 'https://www.youtube.com/watch?v=body-weight-measurement',
    procedure: [
      'Place scale on firm, flat surface',
      'Remove shoes and heavy clothing',
      'Step onto scale center',
      'Wait for reading to stabilize',
      'Input weight into the app'
    ],
    dos: [
      'Use a firm, flat surface (not carpet)',
      'Weigh yourself at the same time daily',
      'Remove shoes and heavy clothing',
      'Stand still until reading stabilizes',
      'Zero/calibrate the scale before use',
      'Input weight to nearest 0.1kg'
    ],
    donts: [
      'Don\'t use the scale on carpet or soft surfaces',
      'Don\'t weigh yourself right after eating',
      'Don\'t move while the scale is reading',
      'Don\'t use damaged or uncalibrated scales',
      'Don\'t round the weight to whole numbers',
      'Don\'t weigh with wet feet or clothes'
    ],
    tips: [
      'Weigh yourself first thing in the morning',
      'Use the same scale consistently',
      'Track trends rather than daily fluctuations',
      'Ensure scale battery is good for accuracy'
    ]
  },
  sit_and_reach: {
    name: 'Sit and Reach Flexibility Test',
    icon: <Activity className="size-6" />,
    duration: '2-3 minutes',
    accuracy: '±0.5cm',
    equipment: ['Wall or sit-and-reach box', 'Measuring tape', 'Flat surface'],
    description: 'Test hamstring and lower back flexibility with computer vision angle measurement.',
    tutorialVideo: 'https://www.youtube.com/watch?v=sit-reach-flexibility-test',
    procedure: [
      'Sit with legs straight against wall/box',
      'Place hands on top of each other',
      'Reach forward slowly along measuring line',
      'Hold maximum reach position for 2 seconds',
      'Return to starting position'
    ],
    dos: [
      'Remove shoes before testing',
      'Keep legs completely straight',
      'Reach forward slowly and smoothly',
      'Hold the furthest position for 2 seconds',
      'Keep hands together and aligned',
      'Position camera to capture side view'
    ],
    donts: [
      'Don\'t bounce or use jerky movements',
      'Don\'t bend your knees during the reach',
      'Don\'t hold your breath',
      'Don\'t rush the movement',
      'Don\'t let your hands separate',
      'Don\'t twist your torso'
    ],
    tips: [
      'Warm up with light stretching first',
      'Breathe normally throughout the test',
      'Focus on gradual forward movement',
      'Take the best of 2-3 attempts'
    ]
  },
  vertical_jump: {
    name: 'Vertical Jump Test',
    icon: <TrendingUp className="size-6" />,
    duration: '2-3 minutes',
    accuracy: '±2-3cm',
    equipment: ['Phone secured to chest/waist', 'Clear jumping space'],
    description: 'Measure explosive lower body power using motion sensor analysis.',
    tutorialVideo: 'https://www.youtube.com/watch?v=vertical-jump-test-guide',
    procedure: [
      'Secure phone to chest or waist area',
      'Stand with feet shoulder-width apart',
      'Perform countermovement and jump vertically',
      'Land softly in same position',
      'Complete 3 attempts with rest between'
    ],
    dos: [
      'Secure phone tightly to your body',
      'Jump straight up, not forward',
      'Use your arms for momentum',
      'Land softly on both feet',
      'Take adequate rest between attempts',
      'Ensure phone sensors can detect movement'
    ],
    donts: [
      'Don\'t jump at an angle',
      'Don\'t land hard or off-balance',
      'Don\'t hold the phone in your hands',
      'Don\'t jump without arm swing',
      'Don\'t attempt if injured',
      'Don\'t jump on slippery surfaces'
    ],
    tips: [
      'Warm up with light jumping first',
      'Use a quick countermovement for best results',
      'Focus on explosive upward force',
      'Record the best of 3 attempts'
    ]
  },
  broad_jump: {
    name: 'Standing Broad Jump',
    icon: <Target className="size-6" />,
    duration: '3-4 minutes',
    accuracy: '±5-10cm',
    equipment: ['Measuring tape', 'Clear landing area', 'Reference object'],
    description: 'Measure horizontal jumping distance using computer vision.',
    tutorialVideo: 'https://www.youtube.com/watch?v=standing-broad-jump-technique',
    procedure: [
      'Stand behind the takeoff line',
      'Position feet shoulder-width apart',
      'Use countermovement and jump forward',
      'Land on both feet simultaneously',
      'Measure to closest heel mark'
    ],
    dos: [
      'Take off from behind the line',
      'Use both feet for takeoff and landing',
      'Swing arms for momentum',
      'Land with both feet together',
      'Place reference object for scale',
      'Ensure camera captures side view'
    ],
    donts: [
      'Don\'t step over the takeoff line',
      'Don\'t take off from one foot',
      'Don\'t fall backward after landing',
      'Don\'t attempt without proper warm-up',
      'Don\'t jump on hard surfaces without mats',
      'Don\'t rush between attempts'
    ],
    tips: [
      'Focus on horizontal distance, not height',
      'Use a vigorous arm swing',
      'Practice the landing technique',
      'Take the best of 2-3 attempts'
    ]
  },
  medicine_ball_throw: {
    name: 'Medicine Ball Throw',
    icon: <Dumbbell className="size-6" />,
    duration: '4-5 minutes',
    accuracy: '±10-15cm',
    equipment: ['2-3kg medicine ball', 'Wall', 'Measuring tape', 'Mat'],
    description: 'Test upper body power with trajectory tracking analysis.',
    tutorialVideo: 'https://www.youtube.com/watch?v=medicine-ball-throw-proper-form',
    procedure: [
      'Sit with back against wall',
      'Hold ball at chest level with both hands',
      'Throw ball forward explosively',
      'Maintain back contact with wall',
      'Measure to ball landing point'
    ],
    dos: [
      'Keep back firmly against the wall',
      'Hold ball with both hands at chest',
      'Throw with maximum effort',
      'Extend arms fully on release',
      'Position camera to capture throw path',
      'Warm up shoulders and arms first'
    ],
    donts: [
      'Don\'t lift back off the wall',
      'Don\'t throw with one hand',
      'Don\'t throw upward at an angle',
      'Don\'t hold back on effort',
      'Don\'t attempt if shoulder problems exist',
      'Don\'t use a ball that\'s too heavy'
    ],
    tips: [
      'Focus on explosive chest and arm extension',
      'Use proper 2-3kg medicine ball weight',
      'Ensure clear throw path',
      'Take the best of 3 attempts'
    ]
  },
  '30m_sprint': {
    name: '30m Sprint Test',
    icon: <Zap className="size-6" />,
    duration: '3-4 minutes',
    accuracy: '±0.01-0.02s',
    equipment: ['30m measured course', 'Cones for markers'],
    description: 'Measure sprint speed using GPS and motion tracking.',
    tutorialVideo: 'https://www.youtube.com/watch?v=30m-sprint-test-technique',
    procedure: [
      'Set up 30m straight course with markers',
      'Start from stationary position',
      'Sprint maximally through finish line',
      'Don\'t slow down before finish',
      'Complete 2 timed attempts'
    ],
    dos: [
      'Start from a stationary position',
      'Sprint through the finish line',
      'Use proper running form',
      'Ensure GPS signal is strong',
      'Run on a straight, measured course',
      'Take adequate rest between attempts'
    ],
    donts: [
      'Don\'t use a rolling start',
      'Don\'t slow down before the finish',
      'Don\'t run on slippery surfaces',
      'Don\'t attempt in poor weather',
      'Don\'t run if injured',
      'Don\'t forget to warm up properly'
    ],
    tips: [
      'Use an explosive start technique',
      'Maintain maximum effort throughout',
      'Choose optimal weather conditions',
      'Record the best of 2 attempts'
    ]
  },
  shuttle_run: {
    name: '4×10m Shuttle Run',
    icon: <Activity className="size-6" />,
    duration: '4-5 minutes',
    accuracy: '±0.2-0.3s',
    equipment: ['10m measured distance', 'Cones', 'Phone secured to body'],
    description: 'Test agility with motion sensor direction change detection.',
    tutorialVideo: 'https://www.youtube.com/watch?v=shuttle-run-agility-test',
    procedure: [
      'Set up 10m course with cones',
      'Secure phone to body',
      'Run between cones 4 times (40m total)',
      'Touch cone/line at each turn',
      'Complete course as fast as possible'
    ],
    dos: [
      'Touch the line or cone at each end',
      'Change direction quickly',
      'Secure phone tightly to body',
      'Maintain good running form',
      'Complete all 4 shuttles',
      'Sprint maximally throughout'
    ],
    donts: [
      'Don\'t skip touching the lines',
      'Don\'t make wide turns',
      'Don\'t hold the phone',
      'Don\'t pace yourself',
      'Don\'t attempt on slippery surface',
      'Don\'t forget to warm up'
    ],
    tips: [
      'Practice quick direction changes',
      'Use short, quick steps near turns',
      'Focus on acceleration out of turns',
      'Take the best of 2-3 attempts'
    ]
  },
  sit_ups: {
    name: 'Sit-ups Endurance Test',
    icon: <Target className="size-6" />,
    duration: '60 seconds',
    accuracy: '95%+ counting',
    equipment: ['Exercise mat', 'Assistant to hold feet (optional)'],
    description: 'Test core strength with AI pose detection and rep counting.',
    tutorialVideo: 'https://www.youtube.com/watch?v=proper-situp-form-technique',
    procedure: [
      'Lie on back with knees bent 90°',
      'Place hands behind head',
      'Perform sit-ups touching elbows to knees',
      'Return until shoulders touch floor',
      'Complete maximum reps in 60 seconds'
    ],
    dos: [
      'Keep knees bent at 90 degrees',
      'Touch elbows to knees each rep',
      'Return shoulders to floor',
      'Maintain steady breathing',
      'Position camera for side view',
      'Count only complete repetitions'
    ],
    donts: [
      'Don\'t pull on your neck',
      'Don\'t lift feet off the ground',
      'Don\'t bounce off the floor',
      'Don\'t hold your breath',
      'Don\'t count partial repetitions',
      'Don\'t stop before 60 seconds'
    ],
    tips: [
      'Warm up your core muscles first',
      'Focus on controlled movements',
      'Maintain consistent rhythm',
      'Use a comfortable exercise mat'
    ]
  },
  endurance_run: {
    name: 'Endurance Run (800m/1.6km)',
    icon: <Heart className="size-6" />,
    duration: '3-15 minutes',
    accuracy: '±10-20m distance',
    equipment: ['Measured track/course', 'GPS-enabled device'],
    description: 'Test cardiovascular fitness with GPS distance and time tracking.',
    tutorialVideo: 'https://www.youtube.com/watch?v=endurance-running-pacing-strategy',
    procedure: [
      'Choose measured 800m or 1.6km course',
      'Start GPS tracking',
      'Run at steady, sustainable pace',
      'Complete full distance without walking',
      'Stop GPS tracking at finish'
    ],
    dos: [
      'Warm up with light jogging',
      'Maintain steady pace throughout',
      'Run the complete distance',
      'Ensure GPS signal is strong',
      'Stay hydrated before/after',
      'Cool down after completion'
    ],
    donts: [
      'Don\'t start too fast',
      'Don\'t walk during the test',
      'Don\'t run in extreme weather',
      'Don\'t attempt if feeling unwell',
      'Don\'t forget to track accurately',
      'Don\'t skip warm-up or cool-down'
    ],
    tips: [
      'Practice pacing during training',
      'Choose familiar, safe running route',
      'Monitor effort level throughout',
      'Focus on consistent breathing'
    ]
  }
};

export function TestInstructions({ testId, onStartTest, onUploadVideo, onBack }: TestInstructionsProps) {
  const test = testInstructions[testId as keyof typeof testInstructions];

  if (!test) {
    return (
      <div className="text-center py-8">
        <p>Test instructions not found.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="size-4" />
                Back to Tests
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  {test.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{test.name}</h1>
                  <p className="text-sm text-muted-foreground">Test Instructions & Guidelines</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Timer className="size-3" />
                {test.duration}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Target className="size-3" />
                {test.accuracy}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {test.icon}
                {test.name}
              </CardTitle>
              <CardDescription className="text-base">{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Timer className="size-4 text-blue-600" />
                  <span className="text-sm">Duration: {test.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-green-600" />
                  <span className="text-sm">Accuracy: {test.accuracy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-purple-600" />
                  <span className="text-sm">AI Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="size-4 text-red-600" />
                  <a 
                    href={test.tutorialVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    Video Tutorial
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
              
              {/* Tutorial Video Card */}
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Play className="size-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-800">Watch Tutorial Video</p>
                        <p className="text-sm text-red-600">Learn proper technique before testing</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => window.open(test.tutorialVideo, '_blank')}
                    >
                      <Play className="size-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipment & Procedure */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-600" />
                    Equipment Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {test.equipment.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-5 text-blue-600" />
                    Test Procedure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {test.procedure.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="size-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Do's and Don'ts */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-600" />
                    DO's
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {test.dos.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="size-5 text-red-600" />
                    DON'Ts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {test.donts.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Tips & Safety */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-yellow-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {test.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="size-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-600" />
                  Safety Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="size-4" />
                  <AlertDescription className="text-sm">
                    Ensure you are physically capable of performing this test. Stop immediately if you experience pain, dizziness, or discomfort. 
                    Consult with a healthcare professional if you have any medical conditions or concerns about physical activity.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg" 
            onClick={onStartTest}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Camera className="size-5" />
            Start Live Camera Test
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            onClick={onUploadVideo}
            className="gap-2"
          >
            <Upload className="size-5" />
            Upload Recorded Video
          </Button>
        </motion.div>
      </div>
    </div>
  );
}