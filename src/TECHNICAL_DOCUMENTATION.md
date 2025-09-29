# Technical Documentation - AI-Powered Sports Talent Assessment Platform

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Feature Implementation Details](#feature-implementation-details)
4. [API Documentation](#api-documentation)
5. [Data Flow & State Management](#data-flow--state-management)
6. [Component Architecture](#component-architecture)
7. [Machine Learning Implementation](#machine-learning-implementation)
8. [Security & Performance](#security--performance)

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                      │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Tailwind CSS v4                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Components  │  │ Contexts    │  │ Utils       │         │
│  │             │  │             │  │             │         │
│  │ • Dashboard │  │ • Language  │  │ • ML Models │         │
│  │ • TestCenter│  │ • A11y      │  │ • Fitness   │         │
│  │ • AuthPage  │  │             │  │   Tests     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    Browser APIs                             │
│  • MediaDevices API (Camera/Microphone)                    │
│  • Geolocation API (GPS tracking)                          │
│  • DeviceMotion API (Accelerometer/Gyroscope)              │
│  • SpeechRecognition API (Voice Assistant)                 │
│  • Local Storage (Data persistence)                        │
├─────────────────────────────────────────────────────────────┤
│                Desktop Wrapper (Flutter)                   │
│  • Windows Desktop App                                     │
│  • macOS Desktop App                                       │
│  • Linux Desktop App                                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Architecture
```
User Data (Local Storage)
├── Authentication State
├── Profile Information
├── Test Results History
├── Language Preferences
├── Accessibility Settings
└── Performance Analytics

State Management (React Context)
├── LanguageContext (Multi-language support)
├── AccessibilityContext (A11y features)
└── User State (Component level)
```

## Technology Stack

### Core Technologies
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Frontend | React | 18+ | Component-based UI |
| Language | TypeScript | Latest | Type safety |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| Animation | Motion (Framer Motion) | Latest | Smooth animations |
| UI Components | shadcn/ui | Latest | Pre-built components |
| Icons | Lucide React | Latest | Icon system |
| Charts | Recharts | Latest | Data visualization |

### Browser APIs
| API | Purpose | Implementation |
|-----|---------|----------------|
| MediaDevices | Camera/video capture | Test recording & validation |
| Geolocation | GPS tracking | Running tests & location |
| DeviceMotion | Accelerometer/gyroscope | Jump tests & movement |
| SpeechRecognition | Voice commands | Voice assistant |
| Web Storage | Data persistence | User data & preferences |

### Development Tools
| Tool | Purpose |
|------|---------|
| Node.js 18+ | Runtime environment |
| npm | Package management |
| Flutter | Cross-platform desktop apps |
| Git | Version control |

## Feature Implementation Details

### 1. Authentication System (`AuthPage.tsx`)

**Technology Stack:**
- React functional components with hooks
- Local Storage for session persistence
- Form validation with controlled inputs

**Implementation:**
```typescript
// Mock authentication - no external APIs
const handleLogin = (email: string, password: string, role: UserRole) => {
  // Simulate user validation
  const userData: User = {
    id: generateUserId(),
    name: extractNameFromEmail(email),
    email,
    role,
    profileComplete: false
  };
  
  // Store in localStorage
  localStorage.setItem('sai-user', JSON.stringify(userData));
  onLogin(userData);
};
```

**Data Flow:**
1. User enters credentials
2. Client-side validation
3. Mock authentication check
4. Store user data in localStorage
5. Redirect to appropriate dashboard

### 2. Multi-Language Support (`LanguageContext.tsx`)

**Technology Stack:**
- React Context API
- LocalStorage for persistence
- Static translation objects

**Implementation:**
```typescript
// Language translations stored in memory
const translations: Record<Language, Record<string, string>> = {
  en: { 'welcome': 'Welcome', ... },
  hi: { 'welcome': 'स्वागत है', ... },
  // 10 languages total
};

// Context provider with translation function
const t = (key: string): string => {
  return translations[language]?.[key] || translations['en'][key] || key;
};
```

**Supported Languages:**
- English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Gujarati, Marathi, Punjabi

### 3. Fitness Testing System (`TestCenter.tsx`, `fitnessTests.ts`)

**Technology Stack:**
- Computer Vision simulation (MediaPipe/TensorFlow.js ready)
- Browser sensor APIs
- Canvas API for image processing
- GPS API for running tests

**Test Implementations:**

#### Height Measurement
```typescript
async measureHeight(videoElement: HTMLVideoElement, calibration: CalibrationData): Promise<TestResult> {
  // 1. Reference object detection for calibration
  const reference = ReferenceCalibrator.detectReferenceObject(imageData);
  const pixelsPerCm = ReferenceCalibrator.calibrateFromReference(reference.type, reference.bounds.width);
  
  // 2. Head-to-floor distance calculation
  const heightInCm = this.cvProcessor.calculateDistance(headPoint, floorPoint, pixelsPerCm);
  
  return {
    testType: 'height',
    score: roundedHeight,
    unit: 'cm',
    accuracy: 95,
    timestamp: new Date()
  };
}
```

#### Vertical Jump (Accelerometer)
```typescript
async measureVerticalJump(): Promise<TestResult> {
  // 1. Start accelerometer recording
  this.sensorProcessor.startRecording();
  
  // 2. Detect takeoff and landing phases
  const jumpHeight = this.sensorProcessor.calculateJumpHeight();
  
  // 3. Calculate height using flight time: h = 1/8 * g * t²
  const height = 0.125 * 9.81 * Math.pow(flightTime, 2);
  
  return { testType: 'vertical_jump', score: height, unit: 'cm' };
}
```

#### 30m Sprint (GPS)
```typescript
async measure30mSprint(): Promise<TestResult> {
  // 1. Start GPS tracking
  await this.gpsProcessor.startTracking();
  
  // 2. Track user movement
  const distance = this.gpsProcessor.calculateDistance();
  const time = this.gpsProcessor.calculateTime();
  
  // 3. Validate distance accuracy
  if (distance < 25 || distance > 35) {
    throw new Error('Distance not accurate');
  }
  
  return { testType: '30m_sprint', score: time, unit: 'seconds' };
}
```

### 4. AI/ML Computer Vision (`mlModels.ts`)

**Technology Stack:**
- MediaPipe simulation (pose detection)
- Canvas API for image processing
- TensorFlow.js ready architecture
- Computer vision algorithms

**Pose Detection:**
```typescript
async detectPose(videoElement: HTMLVideoElement): Promise<any> {
  // Simulated pose detection - ready for MediaPipe integration
  return {
    keypoints: [
      { name: 'nose', x: 320, y: 240, confidence: 0.9 },
      { name: 'leftShoulder', x: 280, y: 300, confidence: 0.85 },
      // ... more keypoints
    ]
  };
}
```

**Object Tracking:**
```typescript
async trackObject(videoElement: HTMLVideoElement, objectType: 'ball'): Promise<any> {
  // Ball trajectory tracking for medicine ball throw
  return {
    trajectory: [
      { x: 100, y: 400, time: 0 },
      { x: 200, y: 300, time: 0.1 },
      // ... trajectory points
    ],
    landingPoint: { x: 600, y: 400 }
  };
}
```

### 5. Sport Recommendation Engine (`SportRecommendationEngine.tsx`)

**Technology Stack:**
- Algorithm-based recommendations
- Performance data analysis
- Statistical calculations

**Implementation:**
```typescript
const calculateSportFitness = (testResults: TestResult[], sport: Sport): number => {
  const relevantTests = sport.requirements.filter(req => 
    testResults.some(result => result.testType === req.testType)
  );
  
  let totalScore = 0;
  relevantTests.forEach(req => {
    const result = testResults.find(r => r.testType === req.testType);
    if (result) {
      const normalizedScore = normalizeScore(result, req.ideal);
      totalScore += normalizedScore * req.weight;
    }
  });
  
  return totalScore / relevantTests.length;
};
```

### 6. Voice Assistant (`VoiceAssistant.tsx`)

**Technology Stack:**
- Web Speech API (SpeechRecognition)
- Speech Synthesis API
- Natural language processing (basic)

**Implementation:**
```typescript
const startListening = () => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      processVoiceCommand(transcript);
    };
    
    recognition.start();
  }
};
```

### 7. Accessibility System (`AccessibilityContext.tsx`)

**Technology Stack:**
- CSS custom properties
- ARIA attributes
- Keyboard event handling
- Screen reader support

**Features:**
- High contrast mode (`filter: contrast(150%)`)
- Large text scaling (`font-size: 1.25em`)
- Motion reduction (`animation-duration: 0.01ms`)
- Keyboard navigation support

### 8. Real-time Camera Integration (`CameraCapture.tsx`)

**Technology Stack:**
- MediaDevices API
- Canvas API for frame processing
- WebRTC for video streaming

**Implementation:**
```typescript
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 1280, 
        height: 720,
        facingMode: 'environment' 
      },
      audio: false
    });
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error) {
    setError('Camera access denied');
  }
};
```

## API Documentation

### Internal APIs (Mock/Simulated)

#### Authentication API
```typescript
interface AuthAPI {
  login(email: string, password: string, role: UserRole): Promise<User>;
  register(userData: Partial<User>): Promise<User>;
  logout(): Promise<void>;
}

// Implementation: Client-side mock with localStorage
```

#### Fitness Test API
```typescript
interface FitnessTestAPI {
  startTest(testType: string): Promise<TestSession>;
  submitTestData(sessionId: string, data: any): Promise<TestResult>;
  getTestHistory(userId: string): Promise<TestResult[]>;
  calculateFitnessScore(results: TestResult[]): Promise<number>;
}

// Implementation: Client-side calculations with ML models
```

#### User Management API
```typescript
interface UserAPI {
  getProfile(userId: string): Promise<User>;
  updateProfile(userId: string, data: Partial<User>): Promise<User>;
  getRecommendations(userId: string): Promise<SportRecommendation[]>;
}

// Implementation: localStorage-based mock data
```

### External Browser APIs

#### MediaDevices API
```typescript
// Camera access for test recording
navigator.mediaDevices.getUserMedia({
  video: { width: 1280, height: 720 },
  audio: false
});

// Camera permissions check
navigator.permissions.query({ name: 'camera' });
```

#### Geolocation API
```typescript
// GPS tracking for running tests
navigator.geolocation.watchPosition(
  position => {
    // Track user location during runs
    recordPosition(position.coords);
  },
  error => handleGPSError(error),
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);
```

#### DeviceMotion API
```typescript
// Accelerometer for jump tests
window.addEventListener('devicemotion', event => {
  if (event.acceleration) {
    recordAcceleration({
      x: event.acceleration.x,
      y: event.acceleration.y,
      z: event.acceleration.z,
      timestamp: Date.now()
    });
  }
});
```

#### SpeechRecognition API
```typescript
// Voice commands
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = currentLanguage;

recognition.onresult = event => {
  const command = event.results[event.results.length - 1][0].transcript;
  processVoiceCommand(command);
};
```

## Data Flow & State Management

### Application State Flow
```
1. App Initialization
   ├── Load user from localStorage
   ├── Initialize language context
   ├── Setup accessibility context
   └── Route to appropriate page

2. Authentication Flow
   ├── User enters credentials
   ├── Mock validation
   ├── Store user data
   ├── Update app state
   └── Navigate to dashboard

3. Test Execution Flow
   ├── Select test type
   ├── Show instructions
   ├── Request permissions
   ├── Start recording/tracking
   ├── Process data with ML
   ├── Calculate results
   └── Store and display

4. Data Persistence
   ├── User data → localStorage
   ├── Test results → localStorage
   ├── Preferences → localStorage
   └── Settings → localStorage
```

### Context Providers

#### LanguageContext
```typescript
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: LanguageInfo[];
}

// Usage: const { t } = useLanguage();
```

#### AccessibilityContext
```typescript
interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReduceMotion: () => void;
}
```

## Component Architecture

### Page Components
- `LandingPage.tsx` - Homepage with hero section
- `AuthPage.tsx` - Login/registration
- `Dashboard.tsx` - Athlete dashboard
- `CoachDashboard.tsx` - Coach interface
- `OfficialDashboard.tsx` - SAI official interface
- `TestCenter.tsx` - Fitness testing interface

### Feature Components
- `TestInstructions.tsx` - Step-by-step guides
- `CameraCapture.tsx` - Video recording
- `LiveTestInterface.tsx` - Real-time test execution
- `SportRecommendationEngine.tsx` - AI recommendations
- `VoiceAssistant.tsx` - Voice interaction
- `ChatBot.tsx` - AI chatbot
- `UserProfileManagement.tsx` - Profile editing

### UI Components (shadcn/ui)
- Complete set of accessible, customizable components
- Button, Card, Dialog, Form, Input, Select, etc.
- Consistent design system with Tailwind CSS

## Machine Learning Implementation

### Computer Vision Pipeline
```typescript
1. Video Frame Capture
   ├── MediaDevices API
   ├── Canvas processing
   └── Frame extraction

2. Pose Detection (Ready for MediaPipe)
   ├── Keypoint detection
   ├── Skeleton tracking
   └── Movement analysis

3. Object Tracking
   ├── Ball trajectory
   ├── Reference objects
   └── Distance calculation

4. Performance Analysis
   ├── Movement quality
   ├── Form validation
   └── Score calculation
```

### Sensor Data Processing
```typescript
1. Accelerometer Data
   ├── Jump height calculation
   ├── Movement intensity
   └── Direction changes

2. GPS Data
   ├── Distance measurement
   ├── Speed calculation
   └── Route tracking

3. Gyroscope Data
   ├── Orientation tracking
   ├── Rotation detection
   └── Balance analysis
```

### Sport Recommendation Algorithm
```typescript
const algorithm = {
  // 1. Collect test results
  collectResults: (userId: string) => TestResult[],
  
  // 2. Normalize scores across different tests
  normalizeScores: (results: TestResult[]) => NormalizedScore[],
  
  // 3. Calculate sport fitness based on requirements
  calculateSportFitness: (scores: NormalizedScore[], sport: Sport) => number,
  
  // 4. Rank sports by fitness score
  rankSports: (sportScores: SportScore[]) => RankedSport[],
  
  // 5. Generate personalized recommendations
  generateRecommendations: (rankedSports: RankedSport[]) => Recommendation[]
};
```

## Security & Performance

### Security Measures
- **Data Privacy**: All data stored locally, no external servers
- **Input Validation**: Form validation and sanitization
- **Permission Handling**: Proper browser permission requests
- **HTTPS Only**: Production deployment requires HTTPS

### Performance Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data lists
- **Image Optimization**: Compressed images and lazy loading
- **Bundle Splitting**: Code splitting for faster loads

### Accessibility Compliance
- **WCAG 2.1 AA**: Full compliance with accessibility standards
- **Screen Reader**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: High contrast mode available
- **Motion Sensitivity**: Reduced motion options

## Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run with specific browser
npm run dev -- --host 0.0.0.0 --port 3000

# Enable HTTPS for device testing
npm run dev:https
```

### Building for Production
```bash
# Build web application
npm run build

# Build desktop applications
cd flutter_wrapper
flutter build windows
flutter build macos
flutter build linux
```

### Testing Strategy
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: User flow testing
- **Performance Tests**: Lighthouse audits
- **Accessibility Tests**: axe-core automated testing
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge

This technical documentation provides a comprehensive overview of the implementation details, technologies used, and architectural decisions for the AI-powered sports talent assessment platform.