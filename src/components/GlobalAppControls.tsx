import React, { useState, Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MessageCircle, Languages, X, Mic, Send } from 'lucide-react';
import { ChatBot } from './ChatBot';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ChatBot Error:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

interface GlobalAppControlsProps {
  className?: string;
}

export function GlobalAppControls({ className = '' }: GlobalAppControlsProps) {
  const { t } = useLanguage();
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [chatbotError, setChatbotError] = useState(false);

  return (
    <>
      {/* Fixed Position Controls */}
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col gap-3 ${className}`}>
        {/* Language Selector Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            size="lg"
            variant="outline"
            className="size-14 rounded-full bg-white shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Languages className="size-6 text-blue-600" />
          </Button>
        </motion.div>

        {/* Chatbot Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            size="lg"
            className="size-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200 relative"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            <MessageCircle className="size-6" />
            
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="size-2 bg-white rounded-full"></div>
            </div>
          </Button>
        </motion.div>

        {/* Language Selector Dropdown */}
        <AnimatePresence>
          {showLanguageSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-32 right-0 mb-4"
            >
              <Card className="w-64 shadow-xl border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Select Language</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLanguageSelector(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <LanguageSelector compact={true} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex items-end justify-end p-6"
            onClick={() => setShowChatbot(false)}
          >
            <motion.div
              initial={{ x: 400, y: 100 }}
              animate={{ x: 0, y: 0 }}
              exit={{ x: 400, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chatbot Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">SAI Assistant</h3>
                      <p className="text-xs text-blue-100">Online • Ready to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatbot(false)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Chatbot Content */}
              <div className="h-[calc(600px-160px)] overflow-hidden">
                {chatbotError ? (
                  <div className="p-4 text-center text-red-600">
                    <p>Chat assistant is temporarily unavailable.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setChatbotError(false);
                        setShowChatbot(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <ErrorBoundary onError={() => setChatbotError(true)}>
                    <ChatBot compact={true} />
                  </ErrorBoundary>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}