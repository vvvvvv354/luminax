import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface VoiceCommand {
  command: string;
  action: string;
  description: string;
}

interface VoiceAssistantProps {
  onNavigate?: (page: string) => void;
  onStartTest?: (testName: string) => void;
  onAccessibilityToggle?: (setting: string) => void;
  currentPage?: string;
}

const voiceCommands: VoiceCommand[] = [
  { command: 'home', action: 'navigate_home', description: 'Go to home page' },
  { command: 'dashboard', action: 'navigate_dashboard', description: 'Go to dashboard' },
  { command: 'tests', action: 'navigate_tests', description: 'Go to fitness tests' },
  { command: 'start height test', action: 'start_height_test', description: 'Start height measurement' },
  { command: 'start weight test', action: 'start_weight_test', description: 'Start weight measurement' },
  { command: 'start flexibility test', action: 'start_flexibility_test', description: 'Start flexibility test' },
  { command: 'start jump test', action: 'start_jump_test', description: 'Start vertical jump test' },
  { command: 'start sprint test', action: 'start_sprint_test', description: 'Start 30m sprint test' },
  { command: 'help', action: 'show_help', description: 'Show help information' },
  { command: 'high contrast', action: 'toggle_contrast', description: 'Toggle high contrast mode' },
  { command: 'large text', action: 'toggle_large_text', description: 'Toggle large text mode' },
  { command: 'read results', action: 'read_results', description: 'Read test results aloud' },
  { command: 'repeat', action: 'repeat_last', description: 'Repeat last instruction' }
];

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onNavigate,
  onStartTest,
  onAccessibilityToggle,
  currentPage = 'dashboard'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const lastUtteranceRef = useRef<string>('');
  
  const { t, language } = useLanguage();
  const { settings, updateSetting } = useAccessibility();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(language);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak(t('voice_recognition_error'));
      };

      recognitionRef.current.onend = () => {
        if (isEnabled && isListening) {
          // Restart listening if still enabled
          setTimeout(() => {
            if (isEnabled) {
              recognitionRef.current.start();
            }
          }, 1000);
        } else {
          setIsListening(false);
        }
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language, isEnabled, isListening]);

  const getLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN'
    };
    return langMap[lang] || 'en-US';
  };

  const speak = async (text: string, interrupt: boolean = true) => {
    if (!synthRef.current) return;

    if (interrupt) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    lastUtteranceRef.current = text;
    synthRef.current.speak(utterance);
  };

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    setFeedbackMessage(`${t('processing_command')}: "${command}"`);

    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || 
      command.includes(cmd.command.replace(' ', ''))
    );

    if (matchedCommand) {
      executeCommand(matchedCommand);
    } else {
      // Try to understand context-based commands
      if (command.includes('start') && command.includes('test')) {
        const testName = extractTestName(command);
        if (testName) {
          onStartTest?.(testName);
          speak(`${t('starting')} ${t(testName)}`);
          setFeedbackMessage(`${t('starting')} ${t(testName)}`);
        } else {
          speak(t('test_not_recognized'));
          setFeedbackMessage(t('test_not_recognized'));
        }
      } else if (command.includes('go to') || command.includes('navigate')) {
        const page = extractPageName(command);
        if (page) {
          onNavigate?.(page);
          speak(`${t('navigating_to')} ${t(page)}`);
          setFeedbackMessage(`${t('navigating_to')} ${t(page)}`);
        } else {
          speak(t('page_not_recognized'));
          setFeedbackMessage(t('page_not_recognized'));
        }
      } else {
        speak(t('command_not_recognized'));
        setFeedbackMessage(t('command_not_recognized'));
      }
    }

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const executeCommand = (command: VoiceCommand) => {
    switch (command.action) {
      case 'navigate_home':
        onNavigate?.('dashboard');
        speak(t('going_home'));
        break;
      case 'navigate_dashboard':
        onNavigate?.('dashboard');
        speak(t('opening_dashboard'));
        break;
      case 'navigate_tests':
        onNavigate?.('test-center');
        speak(t('opening_tests'));
        break;
      case 'start_height_test':
        onStartTest?.('height');
        speak(t('starting_height_test'));
        break;
      case 'start_weight_test':
        onStartTest?.('weight');
        speak(t('starting_weight_test'));
        break;
      case 'start_flexibility_test':
        onStartTest?.('flexibility');
        speak(t('starting_flexibility_test'));
        break;
      case 'start_jump_test':
        onStartTest?.('vertical_jump');
        speak(t('starting_jump_test'));
        break;
      case 'start_sprint_test':
        onStartTest?.('sprint_30m');
        speak(t('starting_sprint_test'));
        break;
      case 'toggle_contrast':
        updateSetting('highContrast', !settings.highContrast);
        speak(settings.highContrast ? t('contrast_disabled') : t('contrast_enabled'));
        break;
      case 'toggle_large_text':
        updateSetting('largeText', !settings.largeText);
        speak(settings.largeText ? t('large_text_disabled') : t('large_text_enabled'));
        break;
      case 'show_help':
        setShowCommands(true);
        speak(t('showing_voice_commands'));
        break;
      case 'repeat_last':
        if (lastUtteranceRef.current) {
          speak(lastUtteranceRef.current);
        }
        break;
      default:
        speak(t('command_not_implemented'));
    }
  };

  const extractTestName = (command: string): string | null => {
    const testMappings = [
      { keywords: ['height', 'tall'], test: 'height' },
      { keywords: ['weight', 'scale'], test: 'weight' },
      { keywords: ['flexibility', 'stretch'], test: 'flexibility' },
      { keywords: ['jump', 'vertical'], test: 'vertical_jump' },
      { keywords: ['broad', 'long', 'distance'], test: 'broad_jump' },
      { keywords: ['medicine', 'ball', 'throw'], test: 'medicine_ball_throw' },
      { keywords: ['sprint', '30', 'thirty'], test: 'sprint_30m' },
      { keywords: ['shuttle', 'agility'], test: 'shuttle_run' },
      { keywords: ['sit', 'ups', 'situps'], test: 'sit_ups' },
      { keywords: ['endurance', 'run', 'cardio'], test: 'endurance_run' }
    ];

    for (const mapping of testMappings) {
      if (mapping.keywords.some(keyword => command.includes(keyword))) {
        return mapping.test;
      }
    }
    return null;
  };

  const extractPageName = (command: string): string | null => {
    if (command.includes('home') || command.includes('dashboard')) return 'dashboard';
    if (command.includes('test') || command.includes('fitness')) return 'test-center';
    if (command.includes('profile')) return 'profile';
    if (command.includes('result')) return 'results';
    return null;
  };

  const toggleVoiceAssistant = () => {
    if (isEnabled) {
      // Disable
      setIsEnabled(false);
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setFeedbackMessage(t('voice_assistant_disabled'));
    } else {
      // Enable
      if (!recognitionRef.current) {
        setFeedbackMessage(t('voice_not_supported'));
        return;
      }
      setIsEnabled(true);
      setIsListening(true);
      recognitionRef.current.start();
      speak(t('voice_assistant_enabled'));
      setFeedbackMessage(t('voice_assistant_enabled'));
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Assistant Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{t('voice_assistant')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('voice_assistant_description')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleVoiceAssistant}
                variant={isEnabled ? "default" : "outline"}
                size="sm"
                className={isListening ? 'animate-pulse' : ''}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {isEnabled ? t('disable') : t('enable')}
              </Button>
              
              {isSpeaking && (
                <Button onClick={stopSpeaking} variant="outline" size="sm">
                  <VolumeX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Status and Feedback */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={isEnabled ? "default" : "secondary"}>
                {isEnabled ? t('active') : t('inactive')}
              </Badge>
              {isListening && (
                <Badge variant="outline" className="animate-pulse">
                  <Mic className="h-3 w-3 mr-1" />
                  {t('listening')}
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="outline">
                  <Volume2 className="h-3 w-3 mr-1" />
                  {t('speaking')}
                </Badge>
              )}
            </div>

            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm p-2 bg-primary/10 text-primary rounded"
              >
                {feedbackMessage}
              </motion.div>
            )}

            {lastCommand && (
              <div className="text-xs text-muted-foreground">
                {t('last_command')}: "{lastCommand}"
              </div>
            )}
          </div>

          {/* Show Commands Button */}
          <Button
            onClick={() => setShowCommands(!showCommands)}
            variant="ghost"
            size="sm"
            className="mt-3"
          >
            {showCommands ? t('hide_commands') : t('show_commands')}
          </Button>
        </CardContent>
      </Card>

      {/* Voice Commands Reference */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">{t('available_commands')}</h4>
                <div className="grid gap-2">
                  {voiceCommands.map((cmd, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="font-mono text-sm">"{cmd.command}"</span>
                      <span className="text-xs text-muted-foreground">{cmd.description}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">{t('voice_tips')}</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {t('speak_clearly')}</li>
                    <li>• {t('wait_for_beep')}</li>
                    <li>• {t('use_exact_commands')}</li>
                    <li>• {t('adjust_microphone')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};