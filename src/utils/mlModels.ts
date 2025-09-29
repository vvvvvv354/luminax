// ML Models and Computer Vision Utilities for Fitness Tests
export interface TestResult {
  testType: string;
  score: number;
  unit: string;
  accuracy: number;
  timestamp: Date;
  rawData: any;
  feedback: string;
}

export interface CalibrationData {
  referenceObject?: string;
  pixelsPerCm?: number;
  deviceOrientation?: string;
  cameraHeight?: number;
}

// Computer Vision utilities using MediaPipe/TensorFlow.js
export class ComputerVisionProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // Pose detection for sit-ups and flexibility tests
  async detectPose(videoElement: HTMLVideoElement): Promise<any> {
    // Simulate pose detection - in real implementation, use MediaPipe or PoseNet
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          keypoints: [
            { name: 'nose', x: 320, y: 240, confidence: 0.9 },
            { name: 'leftShoulder', x: 280, y: 300, confidence: 0.85 },
            { name: 'rightShoulder', x: 360, y: 300, confidence: 0.85 },
            { name: 'leftHip', x: 290, y: 400, confidence: 0.8 },
            { name: 'rightHip', x: 350, y: 400, confidence: 0.8 },
            { name: 'leftKnee', x: 280, y: 500, confidence: 0.75 },
            { name: 'rightKnee', x: 360, y: 500, confidence: 0.75 }
          ]
        });
      }, 100);
    });
  }

  // Object tracking for medicine ball trajectory
  async trackObject(videoElement: HTMLVideoElement, objectType: 'ball'): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          trajectory: [
            { x: 100, y: 400, time: 0 },
            { x: 200, y: 300, time: 0.1 },
            { x: 300, y: 250, time: 0.2 },
            { x: 400, y: 280, time: 0.3 },
            { x: 500, y: 350, time: 0.4 },
            { x: 600, y: 400, time: 0.5 }
          ],
          landingPoint: { x: 600, y: 400 }
        });
      }, 200);
    });
  }

  // Distance measurement using reference objects
  calculateDistance(point1: {x: number, y: number}, point2: {x: number, y: number}, pixelsPerCm: number): number {
    const pixelDistance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    return pixelDistance / pixelsPerCm;
  }

  // Angle calculation for flexibility tests
  calculateAngle(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}): number {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
  }
}

// Sensor data processing for accelerometer/gyroscope tests
export class SensorProcessor {
  private accelerationData: Array<{x: number, y: number, z: number, timestamp: number}> = [];
  private gyroscopeData: Array<{alpha: number, beta: number, gamma: number, timestamp: number}> = [];

  startRecording(): void {
    this.accelerationData = [];
    this.gyroscopeData = [];

    // Request device motion permissions
    if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response === 'granted') {
          this.attachSensorListeners();
        }
      });
    } else {
      this.attachSensorListeners();
    }
  }

  private attachSensorListeners(): void {
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

    window.addEventListener('deviceorientation', (event) => {
      this.gyroscopeData.push({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
        timestamp: Date.now()
      });
    });
  }

  stopRecording(): void {
    // Remove event listeners
    window.removeEventListener('devicemotion', () => {});
    window.removeEventListener('deviceorientation', () => {});
  }

  // Calculate jump height from acceleration data
  calculateJumpHeight(): number {
    if (this.accelerationData.length < 10) return 0;

    // Find takeoff and landing phases
    const verticalAccel = this.accelerationData.map(d => d.y); // Assuming Y is vertical
    const threshold = 2.0; // m/s²
    
    let takeoffIndex = -1;
    let landingIndex = -1;

    // Find takeoff (large negative acceleration)
    for (let i = 1; i < verticalAccel.length - 1; i++) {
      if (verticalAccel[i] < -threshold && takeoffIndex === -1) {
        takeoffIndex = i;
      }
      if (takeoffIndex !== -1 && verticalAccel[i] > threshold) {
        landingIndex = i;
        break;
      }
    }

    if (takeoffIndex === -1 || landingIndex === -1) return 0;

    // Calculate flight time
    const flightTime = (this.accelerationData[landingIndex].timestamp - this.accelerationData[takeoffIndex].timestamp) / 1000;
    
    // Height = 1/8 * g * t²
    const height = 0.125 * 9.81 * Math.pow(flightTime, 2);
    return Math.round(height * 100); // Convert to cm
  }

  // Detect direction changes for shuttle run
  detectDirectionChanges(): number {
    if (this.gyroscopeData.length < 10) return 0;

    const alphaValues = this.gyroscopeData.map(d => d.alpha);
    let changes = 0;
    const threshold = 90; // degrees

    for (let i = 1; i < alphaValues.length; i++) {
      const angleDiff = Math.abs(alphaValues[i] - alphaValues[i - 1]);
      if (angleDiff > threshold && angleDiff < 360 - threshold) {
        changes++;
      }
    }

    return Math.floor(changes / 2); // Each shuttle is two direction changes
  }
}

// GPS processor for running tests
export class GPSProcessor {
  private positions: Array<{lat: number, lng: number, timestamp: number, accuracy: number}> = [];
  private watchId: number | null = null;

  startTracking(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      this.positions = [];
      
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.positions.push({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy
          });
          
          if (this.positions.length === 1) {
            resolve();
          }
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  calculateDistance(): number {
    if (this.positions.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < this.positions.length; i++) {
      totalDistance += this.haversineDistance(
        this.positions[i - 1],
        this.positions[i]
      );
    }

    return totalDistance;
  }

  calculateTime(): number {
    if (this.positions.length < 2) return 0;
    return (this.positions[this.positions.length - 1].timestamp - this.positions[0].timestamp) / 1000;
  }

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
    return R * c;
  }
}

// Reference object calibration for AR measurements
export class ReferenceCalibrator {
  private static REFERENCE_OBJECTS = {
    'credit_card': { width: 8.56, height: 5.398 }, // cm
    'coin_quarter': { diameter: 2.426 }, // cm
    'coin_penny': { diameter: 1.955 }, // cm
    'smartphone': { width: 7.0, height: 14.0 }, // average cm
    'a4_paper': { width: 21.0, height: 29.7 } // cm
  };

  static calibrateFromReference(objectType: string, pixelWidth: number, pixelHeight?: number): number {
    const ref = this.REFERENCE_OBJECTS[objectType as keyof typeof this.REFERENCE_OBJECTS];
    if (!ref) return 1;

    if ('diameter' in ref) {
      return pixelWidth / ref.diameter;
    } else {
      return pixelWidth / ref.width;
    }
  }

  static detectReferenceObject(imageData: ImageData): {type: string, bounds: {x: number, y: number, width: number, height: number}} | null {
    // Simulate object detection - in real implementation, use computer vision
    return {
      type: 'credit_card',
      bounds: { x: 100, y: 100, width: 150, height: 95 }
    };
  }
}