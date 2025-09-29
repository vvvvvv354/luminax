import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, TrendingUp, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useLanguage } from '../contexts/LanguageContext';

export interface TestResult {
  testName: string;
  score: number;
  percentile: number;
  unit: string;
}

export interface SportRecommendation {
  sport: string;
  matchPercentage: number;
  reasoning: string[];
  keyStrengths: string[];
  areasToImprove: string[];
  icon: string;
  category: 'highly_recommended' | 'recommended' | 'potential';
}

interface SportRecommendationEngineProps {
  testResults: TestResult[];
  onSportSelect?: (sport: string) => void;
}

const analyzeTestResults = (results: TestResult[]): SportRecommendation[] => {
  const recommendations: SportRecommendation[] = [];
  
  // Extract key metrics
  const metrics = results.reduce((acc, result) => {
    acc[result.testName] = result.percentile;
    return acc;
  }, {} as Record<string, number>);

  // Athletics - based on sprint, jump, and endurance
  const athleticsScore = (
    (metrics['30m Sprint'] || 0) * 0.3 +
    (metrics['Vertical Jump'] || 0) * 0.2 +
    (metrics['Broad Jump'] || 0) * 0.2 +
    (metrics['Endurance Run'] || 0) * 0.3
  );
  
  if (athleticsScore > 50) {
    recommendations.push({
      sport: 'athletics',
      matchPercentage: Math.min(95, athleticsScore),
      reasoning: [
        'Excellent speed and agility scores',
        'Strong jumping ability',
        'Good endurance capacity'
      ],
      keyStrengths: ['Speed', 'Explosive power', 'Endurance'],
      areasToImprove: ['Strength training', 'Technique refinement'],
      icon: '🏃‍♂️',
      category: athleticsScore > 80 ? 'highly_recommended' : 'recommended'
    });
  }

  // Weightlifting - based on strength metrics
  const weightliftingScore = (
    (metrics['Medicine Ball Throw'] || 0) * 0.4 +
    (metrics['Sit-ups'] || 0) * 0.3 +
    (100 - (metrics['Weight'] || 50)) * 0.3 // Lower weight can be advantageous in certain categories
  );
  
  if (weightliftingScore > 50) {
    recommendations.push({
      sport: 'weightlifting',
      matchPercentage: Math.min(95, weightliftingScore),
      reasoning: [
        'High upper body strength',
        'Good core stability',
        'Explosive power potential'
      ],
      keyStrengths: ['Upper body strength', 'Power'],
      areasToImprove: ['Technique', 'Flexibility'],
      icon: '🏋️‍♂️',
      category: weightliftingScore > 75 ? 'highly_recommended' : 'recommended'
    });
  }

  // Gymnastics - based on flexibility and bodyweight strength
  const gymnasticsScore = (
    (metrics['Flexibility Test'] || 0) * 0.4 +
    (metrics['Sit-ups'] || 0) * 0.2 +
    (metrics['Vertical Jump'] || 0) * 0.2 +
    (100 - Math.min(80, metrics['Weight'] || 50)) * 0.2
  );
  
  if (gymnasticsScore > 50) {
    recommendations.push({
      sport: 'gymnastics',
      matchPercentage: Math.min(95, gymnasticsScore),
      reasoning: [
        'Exceptional flexibility',
        'Good body control',
        'Optimal strength-to-weight ratio'
      ],
      keyStrengths: ['Flexibility', 'Body control', 'Balance'],
      areasToImprove: ['Strength training', 'Artistic expression'],
      icon: '🤸‍♂️',
      category: gymnasticsScore > 80 ? 'highly_recommended' : 'recommended'
    });
  }

  // Swimming - based on endurance and full-body coordination
  const swimmingScore = (
    (metrics['Endurance Run'] || 0) * 0.4 +
    (metrics['Flexibility Test'] || 0) * 0.2 +
    (metrics['Medicine Ball Throw'] || 0) * 0.2 +
    (metrics['Height'] || 0) * 0.2
  );
  
  if (swimmingScore > 50) {
    recommendations.push({
      sport: 'swimming',
      matchPercentage: Math.min(95, swimmingScore),
      reasoning: [
        'Strong cardiovascular endurance',
        'Good flexibility for stroke technique',
        'Balanced upper body strength'
      ],
      keyStrengths: ['Endurance', 'Flexibility', 'Coordination'],
      areasToImprove: ['Swimming technique', 'Stroke efficiency'],
      icon: '🏊‍♂️',
      category: swimmingScore > 75 ? 'highly_recommended' : 'recommended'
    });
  }

  // Basketball - height, jumping, agility
  const basketballScore = (
    (metrics['Height'] || 0) * 0.3 +
    (metrics['Vertical Jump'] || 0) * 0.3 +
    (metrics['Shuttle Run'] || 0) * 0.2 +
    (metrics['30m Sprint'] || 0) * 0.2
  );
  
  if (basketballScore > 50) {
    recommendations.push({
      sport: 'basketball',
      matchPercentage: Math.min(95, basketballScore),
      reasoning: [
        'Good height advantage',
        'Excellent vertical leap',
        'Quick lateral movement'
      ],
      keyStrengths: ['Height', 'Jumping', 'Agility'],
      areasToImprove: ['Ball handling', 'Shooting technique'],
      icon: '🏀',
      category: basketballScore > 80 ? 'highly_recommended' : 'recommended'
    });
  }

  // Football (Soccer) - endurance, agility, leg strength
  const footballScore = (
    (metrics['Endurance Run'] || 0) * 0.3 +
    (metrics['Shuttle Run'] || 0) * 0.3 +
    (metrics['30m Sprint'] || 0) * 0.2 +
    (metrics['Broad Jump'] || 0) * 0.2
  );
  
  if (footballScore > 50) {
    recommendations.push({
      sport: 'football',
      matchPercentage: Math.min(95, footballScore),
      reasoning: [
        'Excellent endurance for 90-minute games',
        'Quick directional changes',
        'Good leg power for kicking'
      ],
      keyStrengths: ['Endurance', 'Agility', 'Leg strength'],
      areasToImprove: ['Ball control', 'Tactical awareness'],
      icon: '⚽',
      category: footballScore > 75 ? 'highly_recommended' : 'recommended'
    });
  }

  // Sort by match percentage
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export const SportRecommendationEngine: React.FC<SportRecommendationEngineProps> = ({
  testResults,
  onSportSelect
}) => {
  const { t } = useLanguage();
  const recommendations = analyzeTestResults(testResults);

  const getCategoryIcon = (category: SportRecommendation['category']) => {
    switch (category) {
      case 'highly_recommended':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'recommended':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      case 'potential':
        return <Target className="h-5 w-5 text-green-500" />;
    }
  };

  const getCategoryColor = (category: SportRecommendation['category']) => {
    switch (category) {
      case 'highly_recommended':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'recommended':
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
      case 'potential':
        return 'bg-gradient-to-r from-green-400 to-green-600';
    }
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('no_recommendations')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">{t('sport_recommendations')}</h2>
        <p className="text-muted-foreground">{t('ai_analyzed_recommendations')}</p>
      </div>

      <div className="grid gap-4">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.sport}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4"
              style={{ borderLeftColor: recommendation.category === 'highly_recommended' ? '#f59e0b' : recommendation.category === 'recommended' ? '#3b82f6' : '#10b981' }}
              onClick={() => onSportSelect?.(recommendation.sport)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{recommendation.icon}</div>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {t(recommendation.sport)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(recommendation.category)}
                        <Badge 
                          variant="secondary"
                          className={`text-white ${getCategoryColor(recommendation.category)}`}
                        >
                          {recommendation.matchPercentage}% {t('match')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Match Percentage */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('compatibility')}</span>
                    <span>{recommendation.matchPercentage}%</span>
                  </div>
                  <Progress value={recommendation.matchPercentage} className="h-2" />
                </div>

                {/* Key Strengths */}
                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-700">{t('key_strengths')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.keyStrengths.map((strength, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Areas to Improve */}
                <div>
                  <h4 className="font-medium text-sm mb-2 text-orange-700">{t('areas_to_improve')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.areasToImprove.map((area, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Reasoning */}
                <div>
                  <h4 className="font-medium text-sm mb-2">{t('why_recommended')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {recommendation.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg"
      >
        <Award className="h-12 w-12 text-primary mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{t('next_steps')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('consult_coach_recommendations')}
        </p>
      </motion.div>
    </div>
  );
};