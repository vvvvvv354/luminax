import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { User, MapPin, Ruler, Weight, Calendar, Navigation, Loader2, Shield, Users, Phone, Mail, FileText, Check } from 'lucide-react';
import type { Page, User as UserType } from '../App';

interface ProfileSetupProps {
  user: UserType | null;
  onComplete: (profileData: UserType['profile']) => void;
  onNavigate: (page: Page) => void;
}

export function ProfileSetup({ user, onComplete, onNavigate }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    location: '',
    phone: ''
  });
  const [parentConsentData, setParentConsentData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    relationship: '',
    consentGiven: false
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [needsParentConsent, setNeedsParentConsent] = useState(false);

  const totalSteps = useMemo(() => needsParentConsent ? 4 : 3, [needsParentConsent]);
  const progress = useMemo(() => (currentStep / totalSteps) * 100, [currentStep, totalSteps]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Check if user is under 18 when age is entered
    if (field === 'age') {
      const age = parseInt(value);
      setNeedsParentConsent(age < 18 && age > 0);
    }
  };

  const handleParentConsentChange = (field: string, value: string | boolean) => {
    setParentConsentData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Using a public geocoding API to get location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            const locationString = `${data.city || data.locality || 'Unknown City'}, ${data.principalSubdivision || data.countryName || 'Unknown State'}`;
            handleInputChange('location', locationString);
          } catch (error) {
            console.error('Error getting location name:', error);
            handleInputChange('location', `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`);
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const profile: UserType['profile'] = {
      age: parseInt(profileData.age),
      gender: profileData.gender,
      height: parseInt(profileData.height),
      weight: parseInt(profileData.weight),
      location: profileData.location,
      phone: profileData.phone,
      ...(needsParentConsent && {
        parentConsent: {
          parentName: parentConsentData.parentName,
          parentEmail: parentConsentData.parentEmail,
          parentPhone: parentConsentData.parentPhone,
          relationship: parentConsentData.relationship,
          consentDate: new Date().toISOString(),
          consentGiven: parentConsentData.consentGiven
        }
      })
    };
    onComplete(profile);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.age && profileData.gender;
      case 2:
        return profileData.height && profileData.weight;
      case 3:
        if (needsParentConsent) {
          return parentConsentData.parentName && 
                 parentConsentData.parentEmail && 
                 parentConsentData.parentPhone && 
                 parentConsentData.relationship && 
                 parentConsentData.consentGiven;
        } else {
          return profileData.location && profileData.phone;
        }
      case 4:
        return profileData.location && profileData.phone;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-6">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="size-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help us personalize your sports assessment experience</p>
        </div>

        <Card>
          <CardHeader>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Calendar className="size-12 text-primary mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                  <p className="text-muted-foreground text-sm">Tell us about yourself</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={profileData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min="10"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-4 mb-2">
                    <Ruler className="size-6 text-primary" />
                    <Weight className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Physical Measurements</h3>
                  <p className="text-muted-foreground text-sm">For accurate performance analysis</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height in cm"
                    value={profileData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    min="100"
                    max="250"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight in kg"
                    value={profileData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    min="20"
                    max="200"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && needsParentConsent && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Shield className="size-12 text-amber-600 mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">Parent/Guardian Consent</h3>
                  <p className="text-muted-foreground text-sm">Required for users under 18 years old</p>
                </div>

                <Alert>
                  <Users className="size-4" />
                  <AlertDescription>
                    Since you are under 18, we need consent from your parent or guardian to create your account and participate in sports assessments.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Full Name</Label>
                  <Input
                    id="parentName"
                    placeholder="Enter parent/guardian full name"
                    value={parentConsentData.parentName}
                    onChange={(e) => handleParentConsentChange('parentName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select 
                    value={parentConsentData.relationship} 
                    onValueChange={(value) => handleParentConsentChange('relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Legal Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    placeholder="parent@example.com"
                    value={parentConsentData.parentEmail}
                    onChange={(e) => handleParentConsentChange('parentEmail', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent/Guardian Phone Number</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="Enter parent/guardian phone number"
                    value={parentConsentData.parentPhone}
                    onChange={(e) => handleParentConsentChange('parentPhone', e.target.value)}
                  />
                </div>

                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="parentConsent"
                    checked={parentConsentData.consentGiven}
                    onCheckedChange={(checked) => handleParentConsentChange('consentGiven', checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor="parentConsent" 
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I, as the parent/guardian, give consent for my child to:
                      <ul className="mt-2 ml-4 list-disc text-xs text-muted-foreground space-y-1">
                        <li>Create an account on the SAI Sports Assessment Platform</li>
                        <li>Participate in fitness tests and sports assessments</li>
                        <li>Have their performance data analyzed by AI systems</li>
                        <li>Receive sport recommendations and training guidance</li>
                        <li>Be contacted by certified coaches and SAI officials</li>
                      </ul>
                    </Label>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && !needsParentConsent && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <MapPin className="size-12 text-primary mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <p className="text-muted-foreground text-sm">Stay connected with opportunities</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className="flex-shrink-0"
                    >
                      {locationLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Navigation className="size-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click the GPS icon to auto-detect your location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 4 && needsParentConsent && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <MapPin className="size-12 text-primary mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <p className="text-muted-foreground text-sm">Stay connected with opportunities</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className="flex-shrink-0"
                    >
                      {locationLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Navigation className="size-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click the GPS icon to auto-detect your location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious} className="flex-1">
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!isStepValid()}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  disabled={!isStepValid()}
                  className="flex-1"
                >
                  Complete Profile
                </Button>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => onNavigate('landing')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}