import React from 'react';
import { motion } from 'motion/react';
import { 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  Keyboard, 
  MousePointer, 
  Contrast,
  Zap,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface AccessibilityPanelProps {
  onVoiceAssistantToggle?: () => void;
  isVoiceAssistantActive?: boolean;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  onVoiceAssistantToggle,
  isVoiceAssistantActive = false
}) => {
  const { t } = useLanguage();
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const accessibilityFeatures = [
    {
      id: 'highContrast',
      title: t('high_contrast'),
      description: t('high_contrast_desc'),
      icon: <Contrast className="h-5 w-5" />,
      enabled: settings.highContrast,
      category: 'visual'
    },
    {
      id: 'largeText',
      title: t('large_text'),
      description: t('large_text_desc'),
      icon: <Type className="h-5 w-5" />,
      enabled: settings.largeText,
      category: 'visual'
    },
    {
      id: 'screenReader',
      title: t('screen_reader'),
      description: t('screen_reader_desc'),
      icon: <Volume2 className="h-5 w-5" />,
      enabled: settings.screenReader,
      category: 'audio'
    },
    {
      id: 'keyboardNavigation',
      title: t('keyboard_navigation'),
      description: t('keyboard_navigation_desc'),
      icon: <Keyboard className="h-5 w-5" />,
      enabled: settings.keyboardNavigation,
      category: 'motor'
    },
    {
      id: 'voiceCommands',
      title: t('voice_commands'),
      description: t('voice_commands_desc'),
      icon: <Zap className="h-5 w-5" />,
      enabled: settings.voiceCommands,
      category: 'motor'
    },
    {
      id: 'reduceMotion',
      title: t('reduce_motion'),
      description: t('reduce_motion_desc'),
      icon: <MousePointer className="h-5 w-5" />,
      enabled: settings.reduceMotion,
      category: 'visual'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visual': return 'bg-blue-500';
      case 'audio': return 'bg-green-500';
      case 'motor': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'audio': return <Volume2 className="h-4 w-4" />;
      case 'motor': return <MousePointer className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Accessibility className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">{t('accessibility_settings')}</h2>
        </div>
        <p className="text-muted-foreground">{t('accessibility_settings_desc')}</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('quick_actions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                updateSetting('highContrast', !settings.highContrast);
                updateSetting('largeText', !settings.largeText);
              }}
              variant="outline"
              size="sm"
            >
              {t('visual_mode')}
            </Button>
            <Button
              onClick={() => {
                updateSetting('screenReader', true);
                updateSetting('voiceCommands', true);
                updateSetting('keyboardNavigation', true);
              }}
              variant="outline"
              size="sm"
            >
              {t('audio_mode')}
            </Button>
            <Button
              onClick={() => {
                updateSetting('keyboardNavigation', true);
                updateSetting('voiceCommands', true);
                updateSetting('reduceMotion', true);
              }}
              variant="outline"
              size="sm"
            >
              {t('motor_assistance')}
            </Button>
            <Button
              onClick={resetSettings}
              variant="outline"
              size="sm"
            >
              {t('reset_all')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Assistant Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Volume2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('voice_assistant')}</h3>
                <p className="text-sm text-muted-foreground">{t('voice_assistant_status_desc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isVoiceAssistantActive ? "default" : "secondary"}>
                {isVoiceAssistantActive ? t('active') : t('inactive')}
              </Badge>
              <Button
                onClick={onVoiceAssistantToggle}
                variant="outline"
                size="sm"
              >
                {isVoiceAssistantActive ? t('disable') : t('enable')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <div className="grid gap-4">
        {accessibilityFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full text-white ${getCategoryColor(feature.category)}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{feature.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(feature.category)}
                          <span className="ml-1 capitalize">{t(feature.category)}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(checked) => 
                      updateSetting(feature.id as keyof typeof settings, checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            {t('keyboard_shortcuts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {[
              { keys: 'Alt + C', action: t('toggle_contrast') },
              { keys: 'Alt + T', action: t('toggle_large_text') },
              { keys: 'Alt + V', action: t('toggle_voice_assistant') },
              { keys: 'Tab', action: t('navigate_elements') },
              { keys: 'Enter / Space', action: t('activate_element') },
              { keys: 'Esc', action: t('close_dialog') }
            ].map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/50">
                <span className="text-sm">{shortcut.action}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.keys}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Resources */}
      <Card>
        <CardHeader>
          <CardTitle>{t('accessibility_resources')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">{t('screen_reader_compatibility')}</h4>
              <p className="text-sm text-blue-800">
                {t('screen_reader_compatibility_desc')}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">{t('voice_control_tips')}</h4>
              <p className="text-sm text-green-800">
                {t('voice_control_tips_desc')}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-1">{t('motor_assistance_help')}</h4>
              <p className="text-sm text-purple-800">
                {t('motor_assistance_help_desc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};