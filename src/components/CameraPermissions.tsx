import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Camera, 
  Mic, 
  MapPin, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';

interface CameraPermissionsProps {
  testId: string;
  onPermissionsGranted: () => void;
  onBack: () => void;
}

interface PermissionState {
  camera: 'pending' | 'granted' | 'denied' | 'checking';
  microphone: 'pending' | 'granted' | 'denied' | 'checking';
  location: 'pending' | 'granted' | 'denied' | 'checking' | 'not-required';
  motion: 'pending' | 'granted' | 'denied' | 'checking' | 'not-required';
}

const testRequirements = {
  height: { camera: true, microphone: false, location: false, motion: false },
  weight: { camera: false, microphone: false, location: false, motion: false },
  sit_and_reach: { camera: true, microphone: false, location: false, motion: false },
  vertical_jump: { camera: false, microphone: false, location: false, motion: true },
  broad_jump: { camera: true, microphone: false, location: false, motion: false },
  medicine_ball_throw: { camera: true, microphone: false, location: false, motion: false },
  '30m_sprint': { camera: false, microphone: false, location: true, motion: true },
  shuttle_run: { camera: false, microphone: false, location: false, motion: true },
  sit_ups: { camera: true, microphone: false, location: false, motion: false },
  endurance_run: { camera: false, microphone: false, location: true, motion: false }
};

export function CameraPermissions({ testId, onPermissionsGranted, onBack }: CameraPermissionsProps) {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'pending',
    microphone: 'pending',
    location: 'pending',
    motion: 'pending'
  });
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  const requirements = testRequirements[testId as keyof typeof testRequirements] || {
    camera: true, microphone: false, location: false, motion: false
  };

  useEffect(() => {
    // Set not-required status for permissions not needed for this test
    setPermissions(prev => ({
      ...prev,
      microphone: requirements.microphone ? 'pending' : 'not-required',
      location: requirements.location ? 'pending' : 'not-required',
      motion: requirements.motion ? 'pending' : 'not-required'
    }));
  }, [testId, requirements]);

  const requestCameraPermission = async () => {
    setPermissions(prev => ({ ...prev, camera: 'checking' }));
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Stop the stream immediately after permission is granted
      stream.getTracks().forEach(track => track.stop());
      
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
    } catch (err) {
      console.error('Camera permission denied:', err);
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      setError('Camera access is required for this test. Please allow camera permissions and try again.');
    }
  };

  const requestMicrophonePermission = async () => {
    setPermissions(prev => ({ ...prev, microphone: 'checking' }));
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      setError('Microphone access was denied. This may affect audio feedback during the test.');
    }
  };

  const requestLocationPermission = async () => {
    setPermissions(prev => ({ ...prev, location: 'checking' }));
    setError('');

    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      setPermissions(prev => ({ ...prev, location: 'granted' }));
    } catch (err) {
      console.error('Location permission denied:', err);
      setPermissions(prev => ({ ...prev, location: 'denied' }));
      setError('Location access is required for GPS-based distance measurements.');
    }
  };

  const requestMotionPermission = async () => {
    setPermissions(prev => ({ ...prev, motion: 'checking' }));
    setError('');

    try {
      // Check if DeviceMotionEvent requires permission (iOS 13+)
      if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissions(prev => ({ ...prev, motion: 'granted' }));
        } else {
          setPermissions(prev => ({ ...prev, motion: 'denied' }));
          setError('Motion sensor access is required for accurate movement detection.');
        }
      } else {
        // For non-iOS devices, assume permission is granted if the API exists
        setPermissions(prev => ({ ...prev, motion: 'granted' }));
      }
    } catch (err) {
      console.error('Motion permission denied:', err);
      setPermissions(prev => ({ ...prev, motion: 'denied' }));
      setError('Motion sensor access was denied. This will affect movement detection accuracy.');
    }
  };

  const checkAllPermissions = async () => {
    setIsChecking(true);
    setError('');

    const requests = [];

    if (requirements.camera && permissions.camera === 'pending') {
      requests.push(requestCameraPermission());
    }
    if (requirements.microphone && permissions.microphone === 'pending') {
      requests.push(requestMicrophonePermission());
    }
    if (requirements.location && permissions.location === 'pending') {
      requests.push(requestLocationPermission());
    }
    if (requirements.motion && permissions.motion === 'pending') {
      requests.push(requestMotionPermission());
    }

    await Promise.all(requests);
    setIsChecking(false);
  };

  const allRequiredPermissionsGranted = () => {
    return (
      (!requirements.camera || permissions.camera === 'granted') &&
      (!requirements.microphone || permissions.microphone === 'granted') &&
      (!requirements.location || permissions.location === 'granted') &&
      (!requirements.motion || permissions.motion === 'granted')
    );
  };

  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted': return <CheckCircle className="size-5 text-green-600" />;
      case 'denied': return <XCircle className="size-5 text-red-600" />;
      case 'checking': return <RefreshCw className="size-5 text-blue-600 animate-spin" />;
      case 'not-required': return <CheckCircle className="size-5 text-gray-400" />;
      default: return <AlertTriangle className="size-5 text-yellow-600" />;
    }
  };

  const getPermissionText = (status: string) => {
    switch (status) {
      case 'granted': return 'Granted';
      case 'denied': return 'Denied';
      case 'checking': return 'Checking...';
      case 'not-required': return 'Not Required';
      default: return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="size-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Camera className="size-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl">Device Permissions Required</CardTitle>
              <p className="text-muted-foreground mt-2">
                This test requires access to certain device features for accurate measurements.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Permission List */}
              <div className="space-y-4">
                {requirements.camera && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="size-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Camera Access</p>
                        <p className="text-sm text-muted-foreground">
                          Required for computer vision analysis and movement tracking
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPermissionIcon(permissions.camera)}
                      <span className="text-sm font-medium">
                        {getPermissionText(permissions.camera)}
                      </span>
                    </div>
                  </div>
                )}

                {requirements.microphone && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic className="size-6 text-green-600" />
                      <div>
                        <p className="font-medium">Microphone Access</p>
                        <p className="text-sm text-muted-foreground">
                          For audio feedback and voice instructions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPermissionIcon(permissions.microphone)}
                      <span className="text-sm font-medium">
                        {getPermissionText(permissions.microphone)}
                      </span>
                    </div>
                  </div>
                )}

                {requirements.location && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="size-6 text-red-600" />
                      <div>
                        <p className="font-medium">Location Access</p>
                        <p className="text-sm text-muted-foreground">
                          For GPS-based distance and speed measurements
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPermissionIcon(permissions.location)}
                      <span className="text-sm font-medium">
                        {getPermissionText(permissions.location)}
                      </span>
                    </div>
                  </div>
                )}

                {requirements.motion && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="size-6 text-purple-600" />
                      <div>
                        <p className="font-medium">Motion Sensors</p>
                        <p className="text-sm text-muted-foreground">
                          For accelerometer and gyroscope data collection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPermissionIcon(permissions.motion)}
                      <span className="text-sm font-medium">
                        {getPermissionText(permissions.motion)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Info Message */}
              <Alert>
                <Info className="size-4" />
                <AlertDescription>
                  Your privacy is important to us. All data processing happens locally on your device. 
                  No personal information is stored or transmitted without your consent.
                </AlertDescription>
              </Alert>

              {/* Permission Button */}
              {!allRequiredPermissionsGranted() && (
                <Button 
                  onClick={checkAllPermissions}
                  disabled={isChecking}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                  size="lg"
                >
                  {isChecking ? (
                    <RefreshCw className="size-5 animate-spin" />
                  ) : (
                    <CheckCircle className="size-5" />
                  )}
                  {isChecking ? 'Checking Permissions...' : 'Grant Permissions'}
                </Button>
              )}

              {/* Continue Button */}
              {allRequiredPermissionsGranted() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button 
                    onClick={onPermissionsGranted}
                    className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600"
                    size="lg"
                  >
                    <CheckCircle className="size-5" />
                    Continue to Test
                  </Button>
                </motion.div>
              )}

              {/* Manual Permission Instructions */}
              {Object.values(permissions).some(p => p === 'denied') && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Settings className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 mb-2">Manual Permission Setup</p>
                        <p className="text-sm text-yellow-700 mb-3">
                          If permissions were denied, you can manually enable them in your browser settings:
                        </p>
                        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                          <li>Click the lock icon in your browser's address bar</li>
                          <li>Enable the required permissions</li>
                          <li>Refresh the page and try again</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Go Back
                </Button>
                {!allRequiredPermissionsGranted() && (
                  <Button 
                    variant="outline" 
                    onClick={checkAllPermissions}
                    disabled={isChecking}
                    className="flex-1"
                  >
                    Retry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}