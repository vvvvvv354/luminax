import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Camera, Square, Play, Pause, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  testType: string;
  onVideoReady: (video: HTMLVideoElement) => void;
  onCapture: (video: HTMLVideoElement) => void;
  isRecording: boolean;
  countdown?: number;
  feedback?: string;
  accuracy?: number;
}

export function CameraCapture({ 
  testType, 
  onVideoReady, 
  onCapture, 
  isRecording, 
  countdown = 0,
  feedback,
  accuracy
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      setError(null);
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        videoRef.current.onloadedmetadata = () => {
          setIsInitialized(true);
          if (videoRef.current) {
            onVideoReady(videoRef.current);
          }
        };
      }
    } catch (err) {
      console.error('Camera initialization failed:', err);
      setError('Camera access denied or not available. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsInitialized(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    onCapture(video);
  };

  const getTestInstructions = (testType: string): string => {
    switch (testType) {
      case 'height':
        return 'Stand straight against a wall. Place a credit card in view for scale reference.';
      case 'sit_and_reach':
        return 'Sit with legs straight, position camera to side view. Reach forward slowly.';
      case 'vertical_jump':
        return 'Secure phone to your chest/waist. Prepare to jump vertically.';
      case 'broad_jump':
        return 'Position camera to capture side view. Use reference object for scale.';
      case 'medicine_ball_throw':
        return 'Position camera to capture throw trajectory from the side.';
      case 'sit_ups':
        return 'Position camera to capture full body from the side. Prepare for 60-second test.';
      default:
        return 'Position yourself in the camera view and follow the on-screen instructions.';
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="size-5" />
            Camera Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{error}</p>
          <div className="space-y-2">
            <p className="text-sm">To use camera features:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Allow camera permissions when prompted</li>
              <li>• Ensure your device has a working camera</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
          <Button onClick={initializeCamera} className="gap-2">
            <RotateCcw className="size-4" />
            Retry Camera Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Camera View */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="size-5 text-blue-600" />
              {testType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Test
            </CardTitle>
            <div className="flex items-center gap-2">
              {isInitialized && (
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="size-3 text-green-600" />
                  Camera Ready
                </Badge>
              )}
              {accuracy && (
                <Badge variant="default">
                  {accuracy}% Accuracy
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-96 object-cover bg-gray-900"
              autoPlay
              muted
              playsInline
            />
            
            {/* Overlay elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="size-2 bg-white rounded-full animate-pulse" />
                  Recording
                </div>
              )}

              {/* Countdown */}
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-6xl font-bold text-white animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Test-specific overlays */}
              {testType === 'height' && (
                <div className="absolute inset-0 border-2 border-blue-500 border-dashed m-4">
                  <div className="absolute top-2 left-2 text-blue-500 text-sm bg-white/90 px-2 py-1 rounded">
                    Stand here
                  </div>
                </div>
              )}

              {testType === 'sit_and_reach' && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="h-1 w-32 bg-blue-500 rounded" />
                  <div className="text-center text-blue-500 text-sm mt-1 bg-white/90 px-2 py-1 rounded">
                    Reach line
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {getTestInstructions(testType)}
            </p>
            
            {/* Test-specific tips */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                <span>Ensure good lighting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                <span>Keep phone steady</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                <span>Follow the on-screen guides</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={captureFrame}
                disabled={!isInitialized}
                className="flex-1 gap-2"
              >
                {isRecording ? <Pause className="size-4" /> : <Play className="size-4" />}
                {isRecording ? 'Stop Test' : 'Start Test'}
              </Button>
              
              <Button
                variant="outline"
                onClick={switchCamera}
                disabled={!isInitialized}
                className="gap-2"
              >
                <RotateCcw className="size-4" />
                Flip
              </Button>
            </div>

            {feedback && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{feedback}</p>
              </div>
            )}

            {accuracy && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Detection Accuracy</span>
                  <span>{accuracy}%</span>
                </div>
                <Progress value={accuracy} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}