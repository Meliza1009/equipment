import React from 'react';
import { TrendingUp, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockAIRecommendations } from '../utils/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

export const AIRecommendations: React.FC = () => {
  const navigate = useNavigate();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'trending':
        return <Sparkles className="h-4 w-4 text-orange-600" />;
      case 'seasonal':
        return <Tag className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'up':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Rising Demand</Badge>;
      case 'trending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Trending Now</Badge>;
      case 'seasonal':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Seasonal Pick</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Recommendations
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Powered by AI
                </Badge>
              </CardTitle>
              <CardDescription>
                Personalized equipment suggestions based on your activity
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAIRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <ImageWithFallback
                  src={recommendation.image}
                  alt={recommendation.equipmentName}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900">{recommendation.equipmentName}</h4>
                        {getTrendBadge(recommendation.trend)}
                      </div>
                      <p className="text-gray-600">{recommendation.reason}</p>
                    </div>
                    <div className="flex items-center gap-1 text-purple-600">
                      {getTrendIcon(recommendation.trend)}
                      <span className="text-sm">{recommendation.confidence}% match</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-purple-700">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-sm">{recommendation.insight}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-gray-900">₹{recommendation.pricePerDay}/day</span>
                      </div>
                      {recommendation.discount > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {recommendation.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/equipment/${recommendation.equipmentId}`)}
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-gray-700">
                These recommendations are based on your booking history, location, and seasonal trends in your area.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
