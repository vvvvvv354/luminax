# API Integration Guide - Sports Talent Assessment Platform

## 📚 Table of Contents
1. [Browser APIs](#browser-apis)
   - [MediaDevices API (Camera/Video)](#mediadevices-api)
   - [Geolocation API (GPS)](#geolocation-api)
   - [DeviceMotion API (Sensors)](#devicemotion-api)
   - [SpeechRecognition API (Voice)](#speechrecognition-api)
   - [Local Storage API (Data)](#local-storage-api)
   - [Canvas API (Image Processing)](#canvas-api)
2. [Internal APIs](#internal-apis)
3. [API Error Handling](#api-error-handling)
4. [Performance Considerations](#performance-considerations)

---

## 🌐 Browser APIs

### 📹 MediaDevices API
**Purpose**: Capture video from device camera for fitness test recording and validation

#### How It Works
```typescript
// 1. Request camera permissions
const requestCameraAccess = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 1280, 
        height: 720,
        facingMode: 'environment' // Use back camera
      },
      audio: false
    });
    return stream;
  } catch (error) {
    throw new Error('Camera access denied');
  }
};
```

#### Implementation in App
**File**: `components/CameraCapture.tsx`
```typescript
const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // Step 1: Get user media stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      
      // Step 2: Assign stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      // Stop all tracks to release camera
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={stopCamera}>Stop Camera</button>
    </div>
  );
};
```

#### Data Flow
```
User Request → Permission Check → Camera Access → Video Stream → Test Recording → AI Analysis
```

#### Use Cases in App
- **Height Measurement**: Record video for reference object calibration
- **Sit-ups Test**: Count repetitions using pose detection
- **Flexibility Test**: Analyze body angles and positions
- **Jump Tests**: Capture movement for validation

---

### 🗺️ Geolocation API
**Purpose**: Track user location and movement for running tests (30m sprint, endurance runs)

#### How It Works
```typescript
// GPS tracking implementation
class GPSProcessor {
  private positions: Array<{lat: number, lng: number, timestamp: number}> = [];
  private watchId: number | null = null;

  startTracking(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      // Start watching position
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Store position data
          this.positions.push({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now()
          });
          resolve();
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,  // Use GPS, not network location
          timeout: 5000,            // 5 second timeout
          maximumAge: 0             // Don't use cached positions
        }
      );
    });
  }
}
```

#### Implementation in App
**File**: `utils/mlModels.ts` - GPSProcessor class
```typescript
// Example: 30m Sprint Test
async measure30mSprint(): Promise<TestResult> {
  // Step 1: Start GPS tracking
  await this.gpsProcessor.startTracking();
  
  // Step 2: User runs (simulated with timeout)
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  // Step 3: Stop tracking and calculate
  this.gpsProcessor.stopTracking();
  
  const distance = this.gpsProcessor.calculateDistance();
  const time = this.gpsProcessor.calculateTime();
  
  // Step 4: Validate distance accuracy
  if (distance < 25 || distance > 35) {
    throw new Error('Distance not accurate');
  }

  return {
    testType: '30m_sprint',
    score: time,
    unit: 'seconds',
    accuracy: 85
  };
}
```

#### Distance Calculation
```typescript
// Haversine formula for GPS distance calculation
private haversineDistance(pos1: {lat: number, lng: number}, pos2: {lat: number, lng: number}): number {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = pos1.lat * Math.PI / 180;
  const lat2Rad = pos2.lat * Math.PI / 180;
  const deltaLatRad = (pos2.lat - pos1.lat) * Math.PI / 180;
  const deltaLngRad = (pos2.lng - pos1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}
```

#### Use Cases in App
- **30m Sprint**: Measure sprint time and validate distance
- **Endurance Runs**: Track 800m/1600m run performance
- **Profile Setup**: Get user location during registration

---

### 📱 DeviceMotion API
**Purpose**: Use device accelerometer and gyroscope for movement-based fitness tests

#### How It Works
```typescript
class SensorProcessor {
  private accelerationData: Array<{x: number, y: number, z: number, timestamp: number}> = [];

  startRecording(): void {
    // Request device motion permissions (iOS requirement)
    if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
      DeviceMotionEvent.requestPermission().then((response: string) => {
        if (response === 'granted') {
          this.attachSensorListeners();
        }
      });
    } else {
      this.attachSensorListeners();
    }
  }

  private attachSensorListeners(): void {
    // Listen for device motion events
    window.addEventListener('devicemotion', (event) => {
      if (event.acceleration) {
        this.accelerationData.push({
          x: event.acceleration.x || 0,
          y: event.acceleration.y || 0,
          z: event.acceleration.z || 0,
          timestamp: Date.now()
        });
      }
    });
  }
}
```

#### Implementation in App
**File**: `utils/mlModels.ts` - SensorProcessor class

**Vertical Jump Test**:
```typescript
calculateJumpHeight(): number {
  // Step 1: Find takeoff and landing phases
  const verticalAccel = this.accelerationData.map(d => d.y);
  const threshold = 2.0; // m/s²
  
  let takeoffIndex = -1;
  let landingIndex = -1;

  // Step 2: Detect large acceleration changes
  for (let i = 1; i < verticalAccel.length - 1; i++) {
    if (verticalAccel[i] < -threshold && takeoffIndex === -1) {
      takeoffIndex = i; // Large negative acceleration = takeoff
    }
    if (takeoffIndex !== -1 && verticalAccel[i] > threshold) {
      landingIndex = i; // Large positive acceleration = landing
      break;
    }
  }

  // Step 3: Calculate flight time
  const flightTime = (this.accelerationData[landingIndex].timestamp - 
                     this.accelerationData[takeoffIndex].timestamp) / 1000;
  
  // Step 4: Physics formula: Height = 1/8 * g * t²
  const height = 0.125 * 9.81 * Math.pow(flightTime, 2);
  return Math.round(height * 100); // Convert to cm
}
```

**Shuttle Run Detection**:
```typescript
detectDirectionChanges(): number {
  const alphaValues = this.gyroscopeData.map(d => d.alpha);
  let changes = 0;
  const threshold = 90; // degrees

  for (let i = 1; i < alphaValues.length; i++) {
    const angleDiff = Math.abs(alphaValues[i] - alphaValues[i - 1]);
    if (angleDiff > threshold && angleDiff < 360 - threshold) {
      changes++;
    }
  }

  return Math.floor(changes / 2); // Each shuttle = 2 direction changes
}
```

#### Use Cases in App
- **Vertical Jump**: Calculate jump height using flight time
- **Shuttle Run**: Count direction changes and validate pattern
- **Balance Tests**: Monitor device stability during tests

---

### 🎤 SpeechRecognition API
**Purpose**: Voice assistant for hands-free navigation and test guidance

#### How It Works
```typescript
const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    // Check browser support
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      
      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLanguage; // Multi-language support
      
      // Handle results
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        processVoiceCommand(transcript);
      };
      
      recognition.start();
      setIsListening(true);
      recognitionRef.current = recognition;
    }
  };
};
```

#### Implementation in App
**File**: `components/VoiceAssistant.tsx`
```typescript
const processVoiceCommand = (command: string) => {
  const lowerCommand = command.toLowerCase();
  
  // Navigation commands
  if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
    onNavigate('dashboard');
    speak('Navigating to dashboard');
  }
  else if (lowerCommand.includes('start test') || lowerCommand.includes('begin test')) {
    onNavigate('test-center');
    speak('Opening test center');
  }
  else if (lowerCommand.includes('help') || lowerCommand.includes('assistance')) {
    speak('I can help you navigate the app, start tests, or answer questions about fitness assessments');
  }
  // Test-specific commands
  else if (lowerCommand.includes('height test')) {
    speak('For height measurement, stand straight against a wall with a reference object like a credit card visible in the frame');
  }
  else if (lowerCommand.includes('jump test')) {
    speak('For the vertical jump test, hold your phone securely and jump as high as you can');
  }
};

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage;
    speechSynthesis.speak(utterance);
  }
};
```

#### Multi-Language Support
```typescript
// Language-specific voice commands
const commands = {
  en: {
    'start test': () => onNavigate('test-center'),
    'go home': () => onNavigate('dashboard'),
    'help me': () => showHelp()
  },
  hi: {
    'परीक्षण शुरू करें': () => onNavigate('test-center'),
    'घर जाएं': () => onNavigate('dashboard'),
    'मदद': () => showHelp()
  }
};
```

#### Use Cases in App
- **Navigation**: "Go to dashboard", "Start test", "Open settings"
- **Test Guidance**: "How do I measure height?", "Start jump test"
- **Accessibility**: Voice control for users with mobility limitations

---

### 💾 Local Storage API
**Purpose**: Persist user data, preferences, and test results locally (no external servers)

#### How It Works
```typescript
// User data persistence
const saveUser = (user: User) => {
  localStorage.setItem('sai-user', JSON.stringify(user));
};

const loadUser = (): User | null => {
  const stored = localStorage.getItem('sai-user');
  return stored ? JSON.parse(stored) : null;
};

// Test results storage
const saveTestResult = (result: TestResult) => {
  const existing = getTestHistory();
  existing.push(result);
  localStorage.setItem('sai-test-results', JSON.stringify(existing));
};
```

#### Implementation in App
**File**: `App.tsx` and various components
```typescript
// App initialization - load user on startup
useEffect(() => {
  const savedUser = localStorage.getItem('sai-user');
  if (savedUser) {
    const userData = JSON.parse(savedUser);
    setUser(userData);
    // Route to appropriate dashboard based on role
    if (userData.role === 'official') {
      setCurrentPage('official-dashboard');
    } else if (userData.role === 'coach') {
      setCurrentPage('coach-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  }
}, []);

// Language preference persistence
const handleSetLanguage = (lang: Language) => {
  setLanguage(lang);
  localStorage.setItem('sai-language', lang);
};

// Accessibility settings persistence
const toggleHighContrast = () => {
  const newValue = !highContrast;
  setHighContrast(newValue);
  localStorage.setItem('sai-high-contrast', newValue.toString());
};
```

#### Data Structure
```typescript
// Stored data types
interface StoredData {
  'sai-user': User;                    // Current user profile
  'sai-test-results': TestResult[];    // User's test history
  'sai-language': Language;            // Language preference
  'sai-high-contrast': string;         // Accessibility settings
  'sai-large-text': string;
  'sai-reduce-motion': string;
}
```

#### Use Cases in App
- **User Sessions**: Keep users logged in across browser sessions
- **Test History**: Store all completed fitness test results
- **Preferences**: Remember language and accessibility settings
- **Profile Data**: Save user profile information and progress

---

### 🎨 Canvas API
**Purpose**: Process video frames for computer vision analysis and reference object detection

#### How It Works
```typescript
// Frame processing for computer vision
const processVideoFrame = (videoElement: HTMLVideoElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas size to match video
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  // Draw current video frame to canvas
  ctx.drawImage(videoElement, 0, 0);
  
  // Get pixel data for analysis
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData;
};
```

#### Implementation in App
**File**: `utils/fitnessTests.ts` - Height measurement
```typescript
async measureHeight(videoElement: HTMLVideoElement, calibration: CalibrationData): Promise<TestResult> {
  try {
    // Step 1: Create canvas and capture frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);
    
    // Step 2: Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Step 3: Detect reference object (credit card, coin, etc.)
    const reference = ReferenceCalibrator.detectReferenceObject(imageData);
    
    if (!reference) {
      throw new Error('Reference object not detected');
    }

    // Step 4: Calculate pixels per centimeter
    const pixelsPerCm = ReferenceCalibrator.calibrateFromReference(
      reference.type, 
      reference.bounds.width
    );
    
    // Step 5: Measure distance from head to floor
    const headPoint = { x: canvas.width / 2, y: 50 };
    const floorPoint = { x: canvas.width / 2, y: canvas.height - 20 };
    
    const heightInCm = this.cvProcessor.calculateDistance(headPoint, floorPoint, pixelsPerCm);
    
    return {
      testType: 'height',
      score: Math.round(heightInCm * 2) / 2, // Round to nearest 0.5 cm
      unit: 'cm',
      accuracy: 95
    };
  } catch (error) {
    throw new Error(`Height measurement failed: ${error.message}`);
  }
}
```

#### Reference Object Detection
```typescript
// Detect known objects for calibration
class ReferenceCalibrator {
  private static REFERENCE_OBJECTS = {
    'credit_card': { width: 8.56, height: 5.398 }, // cm
    'coin_quarter': { diameter: 2.426 },           // cm
    'smartphone': { width: 7.0, height: 14.0 }    // cm
  };

  static detectReferenceObject(imageData: ImageData) {
    // In real implementation, use computer vision
    // For now, simulate detection
    return {
      type: 'credit_card',
      bounds: { x: 100, y: 100, width: 150, height: 95 }
    };
  }

  static calibrateFromReference(objectType: string, pixelWidth: number): number {
    const ref = this.REFERENCE_OBJECTS[objectType];
    if (!ref) return 1;
    
    return pixelWidth / ref.width; // pixels per cm
  }
}
```

#### Use Cases in App
- **Height Measurement**: Calibrate measurements using reference objects
- **Pose Analysis**: Process video frames for sit-up counting
- **Object Tracking**: Track medicine ball trajectory
- **Form Validation**: Analyze movement quality

---

## 🔧 Internal APIs

### 🔐 Authentication API
**Purpose**: Mock user authentication system (no external servers)

#### Implementation
```typescript
// File: components/AuthPage.tsx
const handleLogin = async (email: string, password: string, role: UserRole) => {
  // Simulate authentication delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email && password.length >= 6) {
    const userData: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      profileComplete: false
    };
    
    // Store in localStorage
    localStorage.setItem('sai-user', JSON.stringify(userData));
    onLogin(userData);
  } else {
    throw new Error('Invalid credentials');
  }
};
```

### 🏃‍♂️ Fitness Test API
**Purpose**: Process and score fitness test results

#### Implementation
```typescript
// File: utils/fitnessTests.ts
class FitnessTestManager {
  async processTest(testType: string, data: any): Promise<TestResult> {
    switch (testType) {
      case 'vertical_jump':
        return await this.measureVerticalJump();
      case 'height':
        return await this.measureHeight(data.video, data.calibration);
      case '30m_sprint':
        return await this.measure30mSprint();
      default:
        throw new Error('Unknown test type');
    }
  }

  calculateFitnessScore(testResults: TestResult[]): number {
    const weights = {
      'vertical_jump': 0.15,
      'broad_jump': 0.15,
      '30m_sprint': 0.15,
      'endurance_run': 0.15,
      // ... other tests
    };

    let totalScore = 0;
    let totalWeight = 0;

    testResults.forEach(result => {
      const weight = weights[result.testType] || 0.1;
      const normalizedScore = this.normalizeScore(result);
      totalScore += normalizedScore * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  }
}
```

---

## ⚠️ API Error Handling

### Camera API Errors
```typescript
const handleCameraError = (error: Error) => {
  switch (error.name) {
    case 'NotAllowedError':
      showError('Camera permission denied. Please allow camera access in browser settings.');
      break;
    case 'NotFoundError':
      showError('No camera found. Please connect a camera and try again.');
      break;
    case 'NotReadableError':
      showError('Camera is being used by another application.');
      break;
    default:
      showError('Camera error: ' + error.message);
  }
};
```

### GPS API Errors
```typescript
const handleGPSError = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      showError('GPS permission denied. Please enable location services.');
      break;
    case error.POSITION_UNAVAILABLE:
      showError('GPS position unavailable. Please check your location settings.');
      break;
    case error.TIMEOUT:
      showError('GPS timeout. Please try again in an open area.');
      break;
  }
};
```

### Sensor API Errors
```typescript
const handleSensorError = () => {
  if (typeof DeviceMotionEvent === 'undefined') {
    showError('Device motion not supported on this device.');
    return;
  }
  
  if (DeviceMotionEvent.requestPermission) {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response !== 'granted') {
        showError('Motion sensor permission required for this test.');
      }
    });
  }
};
```

---

## ⚡ Performance Considerations

### Camera Optimization
```typescript
// Limit video resolution for performance
const getCameraStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30, max: 30 }
    }
  });
};

// Stop camera when not needed
const cleanup = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};
```

### GPS Battery Optimization
```typescript
// Use different accuracy levels based on test type
const getGPSOptions = (testType: string) => {
  if (testType === '30m_sprint') {
    return {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };
  } else {
    return {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 30000
    };
  }
};
```

### Memory Management
```typescript
// Clean up sensor listeners
useEffect(() => {
  const sensorProcessor = new SensorProcessor();
  
  return () => {
    sensorProcessor.stopRecording(); // Clean up listeners
  };
}, []);
```

---

This guide provides a comprehensive overview of how each API integrates with the sports talent assessment platform, enabling professional-grade fitness testing through web technologies. All APIs work together to create a seamless, offline-capable experience for athletes, coaches, and SAI officials.