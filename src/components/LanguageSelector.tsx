import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'grid' | 'compact';
  showLabel?: boolean;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  showLabel = true,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, languages, t } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 z-50"
            >
              <Card className="w-48 shadow-lg">
                <CardContent className="p-2">
                  <div className="max-h-64 overflow-y-auto">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 mb-1"
                      >
                        <span className="w-8 text-xs bg-muted rounded px-1">
                          {lang.code.toUpperCase()}
                        </span>
                        <span className="flex-1 text-left">{lang.nativeName}</span>
                        {language === lang.code && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <Card>
        <CardContent className="p-6">
          {showLabel && (
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t('language')}</h3>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => handleLanguageChange(lang.code)}
                  variant={language === lang.code ? "default" : "outline"}
                  className="w-full h-auto p-3 flex flex-col items-start gap-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{lang.nativeName}</span>
                    {language === lang.code && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-xs opacity-75">{lang.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default dropdown variant
  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && <span>{t('language')}:</span>}
          <span>{currentLanguage?.nativeName}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-full z-50"
            >
              <Card className="shadow-lg">
                <CardContent className="p-2">
                  <div className="max-h-64 overflow-y-auto">
                    {languages.map((lang) => (
                      <motion.div
                        key={lang.code}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        className="rounded-md"
                      >
                        <Button
                          onClick={() => handleLanguageChange(lang.code)}
                          variant="ghost"
                          className="w-full justify-start gap-3 p-3 h-auto"
                        >
                          <div className="w-8 h-6 bg-muted rounded text-xs flex items-center justify-center">
                            {lang.code.toUpperCase()}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{lang.nativeName}</div>
                            <div className="text-xs text-muted-foreground">{lang.name}</div>
                          </div>
                          {language === lang.code && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};