import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, Mic, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  compact?: boolean;
}

const generateBotResponse = (message: string, language: string): string => {
  const responses: Record<string, Record<string, string[]>> = {
    en: {
      greeting: [
        "Hello! I'm LuminaX AI, your intelligent sports talent assistant. How can I help unlock your athletic potential today?",
        "Hi there! Welcome to LuminaX! I'm here to guide you through your fitness journey and help you discover your sporting strengths.",
        "Greetings, athlete! I'm your AI-powered fitness companion. Ready to explore what makes you shine in sports?"
      ],
      tests: [
        "LuminaX features 10 scientifically validated SAI fitness tests: height, weight, sit-and-reach flexibility, vertical jump, broad jump, medicine ball throw, 30m sprint, 4×10m shuttle run, sit-ups endurance, and 800m/1.6km run.",
        "Each test is powered by advanced AI analysis that measures your performance in real-time. Our computer vision technology ensures accurate results and prevents any form of cheating.",
        "Would you like me to explain the technique for any specific test? I can provide detailed instructions and tips for optimal performance!"
      ],
      recommendations: [
        "🎯 Our AI analyzes your fitness test results to recommend the perfect sports for you! Based on your speed, power, endurance, and agility scores, I can identify sports where you're most likely to excel.",
        "Your sport recommendations are generated using machine learning algorithms that consider over 50 performance parameters. Want to see what sports match your athletic profile?",
        "Different sports require different physical attributes. Athletics needs explosive power, swimming requires endurance, basketball benefits from height and jumping ability. Let me find your perfect match!"
      ],
      training: [
        "I can create personalized training plans based on your test results and target sport. Each plan is AI-optimized for maximum improvement.",
        "Need training advice? I analyze your strengths and weaknesses to suggest specific exercises that will boost your performance in target areas.",
        "Our AI tracks your progress over time and adjusts training recommendations accordingly. Consistency is key to athletic development!"
      ],
      nutrition: [
        "Proper nutrition is crucial for athletic performance! I can suggest meal plans based on your sport, training intensity, and body composition goals.",
        "Hydration and recovery nutrition are just as important as pre-workout meals. Would you like specific nutrition guidance for your sport?",
        "Each sport has unique nutritional demands. Endurance athletes need different fuel than power athletes. Let me help optimize your diet!"
      ],
      injury: [
        "Injury prevention is vital for athletes. Our AI monitors your training load and can suggest rest periods to prevent overuse injuries.",
        "If you're experiencing pain or discomfort, it's important to consult a healthcare professional. I can help you understand when to rest vs. when to push through.",
        "Recovery is part of training! Proper sleep, stretching, and rest days are essential for athletic development and injury prevention."
      ],
      mental: [
        "Mental training is crucial for peak performance! Our platform includes visualization techniques, breathing exercises, and focus training.",
        "Competition anxiety is normal. I can guide you through mental preparation techniques used by elite athletes worldwide.",
        "Building mental resilience is like building physical strength - it takes consistent practice. Would you like to try some mental training exercises?"
      ],
      accessibility: [
        "LuminaX is designed for everyone! We support voice commands, screen readers, high contrast modes, and have special features for athletes with disabilities.",
        "Our inclusive design ensures that every athlete, regardless of ability, can participate fully in fitness testing and training.",
        "You can enable accessibility features in the settings menu. We also offer voice-guided test instructions and audio feedback."
      ],
      lumina: [
        "LuminaX represents the 'light' (Lumina) of talent discovery! Our AI illuminates your athletic potential and guides you toward sporting excellence.",
        "The 'X' in LuminaX stands for the unknown variable - your unique athletic potential waiting to be discovered through our advanced AI analysis.",
        "LuminaX is revolutionizing sports talent identification by making advanced AI technology accessible to athletes across India, democratizing sports development."
      ],
      default: [
        "I'm LuminaX AI, your comprehensive sports talent assistant! I can help with fitness tests, sport recommendations, training plans, nutrition advice, injury prevention, and mental preparation.",
        "I'm equipped with advanced AI to help you discover and develop your athletic potential. What aspect of your sports journey would you like to explore?",
        "From technical test guidance to personalized sport recommendations, I'm here to light up your path to athletic success. How can I assist you today?"
      ]
    },
    hi: {
      greeting: [
        "नमस्ते! मैं SAI में आपकी फिटनेस यात्रा में मदद करने के लिए यहाँ हूँ।",
        "हैलो! आज मैं आपके फिटनेस टेस्ट में कैसे सहायता कर सकता हूँ?",
        "स्वागत है! मैं आपका SAI फिटनेस सहायक हूँ। आप क्या जानना चाहते हैं?"
      ],
      tests: [
        "हमारे पास 10 मानकीकृत फिटनेस टेस्ट हैं जिनमें ऊंचाई, वजन, लचीलापन, और अन्य शामिल हैं।",
        "प्रत्येक टेस्ट आपकी शारीरिक फिटनेस के विशिष्ट पहलुओं को मापने के लिए डिज़ाइन किया गया है।"
      ],
      default: [
        "मैं फिटनेस टेस्ट, खेल सिफारिशों और प्लेटफॉर्म नेवीगेशन में मदद कर सकता हूँ।",
        "कृपया बताएं कि आप क्या जानना चाहते हैं?"
      ]
    }
  };

  const lang = responses[language] || responses['en'];
  const lowerMessage = message.toLowerCase();

  // Greeting detection
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('नमस्ते')) {
    return lang.greeting[Math.floor(Math.random() * lang.greeting.length)];
  }
  
  // Test-related queries
  if (lowerMessage.includes('test') || lowerMessage.includes('fitness') || lowerMessage.includes('measurement') || lowerMessage.includes('टेस्ट')) {
    return lang.tests[Math.floor(Math.random() * lang.tests.length)];
  }
  
  // Sport recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('sport') || lowerMessage.includes('best') || lowerMessage.includes('suitable') || lowerMessage.includes('सिफारिश')) {
    return lang.recommendations?.[Math.floor(Math.random() * lang.recommendations.length)] || lang.default[0];
  }
  
  // Training queries
  if (lowerMessage.includes('train') || lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('improve') || lowerMessage.includes('practice')) {
    return lang.training?.[Math.floor(Math.random() * lang.training.length)] || lang.default[0];
  }
  
  // Nutrition queries
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('meal')) {
    return lang.nutrition?.[Math.floor(Math.random() * lang.nutrition.length)] || lang.default[0];
  }
  
  // Injury/health queries
  if (lowerMessage.includes('injury') || lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('recover') || lowerMessage.includes('rest')) {
    return lang.injury?.[Math.floor(Math.random() * lang.injury.length)] || lang.default[0];
  }
  
  // Mental training queries
  if (lowerMessage.includes('mental') || lowerMessage.includes('mind') || lowerMessage.includes('anxiety') || lowerMessage.includes('stress') || lowerMessage.includes('focus') || lowerMessage.includes('confidence')) {
    return lang.mental?.[Math.floor(Math.random() * lang.mental.length)] || lang.default[0];
  }
  
  // LuminaX specific queries
  if (lowerMessage.includes('lumina') || lowerMessage.includes('what is this') || lowerMessage.includes('about lumina') || lowerMessage.includes('app')) {
    return lang.lumina?.[Math.floor(Math.random() * lang.lumina.length)] || lang.default[0];
  }
  
  // Accessibility queries
  if (lowerMessage.includes('accessibility') || lowerMessage.includes('voice') || lowerMessage.includes('disabled') || lowerMessage.includes('blind') || lowerMessage.includes('deaf')) {
    return lang.accessibility?.[Math.floor(Math.random() * lang.accessibility.length)] || lang.default[0];
  }

  return lang.default[Math.floor(Math.random() * lang.default.length)];
};

export const ChatBot: React.FC<ChatBotProps> = ({ compact = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const { t, language } = useLanguage();
  const { settings } = useAccessibility();

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: t('chat_welcome'),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [t, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition with timeout protection
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        
        // Add timeout to prevent hanging
        const initTimeout = setTimeout(() => {
          console.warn('Speech recognition initialization timeout');
          setIsListening(false);
        }, 5000);
        
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          clearTimeout(initTimeout);
          try {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            setIsListening(false);
          } catch (error) {
            console.error('Speech recognition result error:', error);
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          clearTimeout(initTimeout);
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          clearTimeout(initTimeout);
          setIsListening(false);
        };
        
        // Clear timeout if initialization succeeds
        clearTimeout(initTimeout);
      }
    } catch (error) {
      console.error('Speech recognition setup error:', error);
      setIsListening(false);
    }
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue, language);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Text-to-speech for accessibility with error handling
      if (settings.voiceCommands && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(botResponse);
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          
          // Add timeout for speech synthesis
          const speechTimeout = setTimeout(() => {
            console.warn('Speech synthesis timeout');
            speechSynthesis.cancel();
          }, 15000);
          
          utterance.onend = () => {
            clearTimeout(speechTimeout);
          };
          
          utterance.onerror = (event) => {
            clearTimeout(speechTimeout);
            console.error('Speech synthesis error:', event);
          };
          
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Text-to-speech error:', error);
        }
      }
    }, 1000 + Math.random() * 1000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true);
        
        // Add timeout for listening session
        const listeningTimeout = setTimeout(() => {
          console.warn('Speech recognition listening timeout');
          setIsListening(false);
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (error) {
              console.error('Error stopping speech recognition:', error);
            }
          }
        }, 10000); // 10 second timeout for listening
        
        recognitionRef.current.start();
        
        // Store timeout reference to clear it if recognition ends normally
        const originalOnEnd = recognitionRef.current.onend;
        recognitionRef.current.onend = () => {
          clearTimeout(listeningTimeout);
          if (originalOnEnd) originalOnEnd();
          setIsListening(false);
        };
        
        const originalOnResult = recognitionRef.current.onresult;
        recognitionRef.current.onresult = (event: any) => {
          clearTimeout(listeningTimeout);
          if (originalOnResult) originalOnResult(event);
        };
        
        const originalOnError = recognitionRef.current.onerror;
        recognitionRef.current.onerror = (event: any) => {
          clearTimeout(listeningTimeout);
          if (originalOnError) originalOnError(event);
        };
        
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Only render the chat content (without toggle button) for compact mode
  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground max-w-[70%] p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat_placeholder')}
            className="flex-1"
          />
          
          {/* Voice Input Button */}
          {recognitionRef.current && (
            <Button
              onClick={startListening}
              variant="outline"
              size="sm"
              disabled={isListening}
              className={isListening ? 'bg-red-100 text-red-600' : ''}
              aria-label={t('voice_assistant')}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isListening && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Volume2 className="h-3 w-3" />
            {t('voice_listening')}
          </p>
        )}
      </div>
    </div>
  );
};