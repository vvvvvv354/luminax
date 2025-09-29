import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Smartphone, 
  Camera, 
  Brain, 
  Shield, 
  Trophy, 
  Users, 
  BarChart3, 
  Zap,
  CheckCircle,
  Play,
  Star
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Page } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Camera className="size-6" />,
      title: t('ai_video_analysis'),
      description: t('ai_video_analysis_desc')
    },
    {
      icon: <Brain className="size-6" />,
      title: t('on_device_processing'),
      description: t('on_device_processing_desc')
    },
    {
      icon: <Shield className="size-6" />,
      title: t('cheat_detection'),
      description: t('cheat_detection_desc')
    },
    {
      icon: <BarChart3 className="size-6" />,
      title: t('performance_benchmarking'),
      description: t('performance_benchmarking_desc')
    },
    {
      icon: <Trophy className="size-6" />,
      title: t('gamified_experience'),
      description: t('gamified_experience_desc')
    },
    {
      icon: <Zap className="size-6" />,
      title: "Instant Results",
      description: "Get immediate performance metrics, form analysis, and improvement suggestions"
    }
  ];

  const tests = [
    "Vertical Jump Assessment",
    "Sit-ups Endurance Test", 
    "Shuttle Run Agility",
    "Endurance Run Analysis",
    "Height & Weight Measurements",
    "Custom Performance Tests"
  ];

  const stats = [
    { number: "500K+", label: "Athletes Assessed" },
    { number: "98.7%", label: "Accuracy Rate" },
    { number: "50+", label: "Test Categories" },
    { number: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <div className="text-white text-sm font-bold">⚡</div>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LuminaX</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavigate('auth')}>
              {t('sign_in')}
            </Button>
            <Button onClick={() => onNavigate('auth')}>
              {t('get_started')}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6">
              <Star className="size-3 mr-1" />
              {t('trusted_by_sai')}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              {t('sai_subtitle')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('sai_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => onNavigate('auth')}>
                <Play className="size-5 mr-2" />
                {t('get_started')}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Users className="size-5 mr-2" />
                {t('official_role')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Innovative Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology designed to make sports assessment accessible, accurate, and engaging for everyone.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-muted group hover:border-primary/20">
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Categories Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Comprehensive Test Suite</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade assessments covering all aspects of athletic performance and fitness evaluation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test, index) => (
              <motion.div
                key={test}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                <span className="font-medium">{test}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Potential?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of athletes who have already started their journey to professional sports recognition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => onNavigate('auth')}>
                <Smartphone className="size-5 mr-2" />
                Download App
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 SportsTalent AI. Empowering athletes across India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}