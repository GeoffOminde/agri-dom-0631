import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { AIAssistant } from '../components/ai/AIAssistant';
import { ImageAnalysis } from '../components/ai/ImageAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Bot, 
  Camera, 
  CloudRain, 
  TrendingUp, 
  Leaf, 
  Brain,
  Zap,
  Target,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { useCRM } from '../contexts/CRMContext';
import { toast } from 'sonner';

const AIPage = () => {
  const [activeAIFeature, setActiveAIFeature] = useState('assistant');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const { query, getWeatherRecommendations, isLoading } = useAI();
  const { getModuleData } = useCRM();

  const handleQuickAnalysis = async (type: string) => {
    const parcelsData = getModuleData('parcelles');
    const culturesData = getModuleData('cultures');

    try {
      let response;
      switch (type) {
        case 'crop_recommendation':
          response = await query({
            message: "What crops should I plant based on my current conditions?",
            context: { parcels: parcelsData, crops: culturesData },
            type: 'crop_recommendation'
          });
          break;
        case 'yield_prediction':
          response = await query({
            message: "Predict my crop yields for this season",
            context: { parcels: parcelsData, crops: culturesData },
            type: 'yield_prediction'
          });
          break;
        case 'weather_analysis':
          response = await getWeatherRecommendations('Guadeloupe', 7);
          break;
        default:
          return;
      }

      toast.success("AI Analysis Complete", {
        description: response.message.substring(0, 100) + "..."
      });
    } catch (error) {
      toast.error("Analysis Failed", {
        description: "Unable to complete AI analysis. Please try again."
      });
    }
  };

  const aiFeatures = [
    {
      id: 'assistant',
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your farming questions',
      icon: <MessageSquare className="h-6 w-6" />,
      status: 'active',
      color: 'bg-blue-500'
    },
    {
      id: 'image_analysis',
      title: 'Image Analysis',
      description: 'Detect pests, diseases, and assess crop health',
      icon: <Camera className="h-6 w-6" />,
      status: 'active',
      color: 'bg-green-500'
    },
    {
      id: 'crop_recommendations',
      title: 'Crop Recommendations',
      description: 'AI-powered crop selection and rotation advice',
      icon: <Leaf className="h-6 w-6" />,
      status: 'active',
      color: 'bg-emerald-500'
    },
    {
      id: 'weather_insights',
      title: 'Weather Intelligence',
      description: 'Smart weather analysis and farming recommendations',
      icon: <CloudRain className="h-6 w-6" />,
      status: 'active',
      color: 'bg-sky-500'
    },
    {
      id: 'yield_prediction',
      title: 'Yield Prediction',
      description: 'Forecast your harvest yields with ML models',
      icon: <TrendingUp className="h-6 w-6" />,
      status: 'active',
      color: 'bg-orange-500'
    },
    {
      id: 'market_analysis',
      title: 'Market Intelligence',
      description: 'Price predictions and market trend analysis',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'coming_soon',
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    {
      title: 'Get Crop Recommendations',
      description: 'AI analysis of best crops for your conditions',
      action: () => handleQuickAnalysis('crop_recommendation'),
      icon: <Target className="h-5 w-5" />,
      color: 'bg-green-600'
    },
    {
      title: 'Predict Yields',
      description: 'Forecast your expected harvest yields',
      action: () => handleQuickAnalysis('yield_prediction'),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    {
      title: 'Weather Analysis',
      description: 'Get 7-day weather insights and recommendations',
      action: () => handleQuickAnalysis('weather_analysis'),
      icon: <CloudRain className="h-5 w-5" />,
      color: 'bg-sky-600'
    }
  ];

  return (
    <PageLayout title="AI Agricultural Intelligence" userName="Farmer">
      <div className="space-y-6">
        {/* AI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-agri-primary" />
                <span>AI-Powered Agriculture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Harness the power of artificial intelligence to optimize your farming operations. 
                Our AI system provides intelligent insights, predictions, and recommendations 
                tailored to your specific crops and conditions.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time Analysis
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Bot className="h-3 w-3 mr-1" />
                  Machine Learning
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Target className="h-3 w-3 mr-1" />
                  Precision Agriculture
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick AI Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={action.action}
                  disabled={isLoading}
                >
                  <div className={`${action.color} p-2 rounded-md mr-3`}>
                    {React.cloneElement(action.icon, { className: "h-4 w-4 text-white" })}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiFeatures.map((feature) => (
            <Card 
              key={feature.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeAIFeature === feature.id ? 'ring-2 ring-agri-primary' : ''
              }`}
              onClick={() => setActiveAIFeature(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`${feature.color} p-2 rounded-lg text-white`}>
                    {feature.icon}
                  </div>
                  <Badge 
                    variant={feature.status === 'active' ? 'default' : 'secondary'}
                    className={feature.status === 'active' ? 'bg-green-600' : ''}
                  >
                    {feature.status === 'active' ? 'Active' : 'Coming Soon'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Feature Details */}
        <Card>
          <CardHeader>
            <CardTitle>AI Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeAIFeature} onValueChange={setActiveAIFeature}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="assistant">Assistant</TabsTrigger>
                <TabsTrigger value="image_analysis">Image Analysis</TabsTrigger>
                <TabsTrigger value="crop_recommendations">Crops</TabsTrigger>
                <TabsTrigger value="weather_insights">Weather</TabsTrigger>
                <TabsTrigger value="yield_prediction">Yields</TabsTrigger>
              </TabsList>

              <TabsContent value="assistant" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">AI Chat Assistant</h3>
                      <p className="text-gray-600">
                        Get instant answers to your farming questions from our AI agricultural expert.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setAiAssistantOpen(true)}
                      className="bg-agri-primary hover:bg-agri-primary-dark"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Assistant
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">What you can ask:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "What crops should I plant this season?"</li>
                      <li>• "How do I control pests naturally?"</li>
                      <li>• "When is the best time to harvest?"</li>
                      <li>• "How can I improve my soil health?"</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image_analysis" className="mt-6">
                <ImageAnalysis onAnalysisComplete={(result) => {
                  toast.success("Image Analysis Complete", {
                    description: `Analysis confidence: ${Math.round(result.confidence * 100)}%`
                  });
                }} />
              </TabsContent>

              <TabsContent value="crop_recommendations" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">AI Crop Recommendations</h3>
                  <p className="text-gray-600">
                    Get personalized crop recommendations based on your soil, climate, and market conditions.
                  </p>
                  <Button 
                    onClick={() => handleQuickAnalysis('crop_recommendation')}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Leaf className="h-4 w-4 mr-2" />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="weather_insights" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Weather Intelligence</h3>
                  <p className="text-gray-600">
                    AI-powered weather analysis with farming-specific recommendations.
                  </p>
                  <Button 
                    onClick={() => handleQuickAnalysis('weather_analysis')}
                    disabled={isLoading}
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CloudRain className="h-4 w-4 mr-2" />
                        Get Weather Insights
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="yield_prediction" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Yield Prediction</h3>
                  <p className="text-gray-600">
                    Machine learning models predict your expected harvest yields.
                  </p>
                  <Button 
                    onClick={() => handleQuickAnalysis('yield_prediction')}
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Predicting...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Predict Yields
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Assistant Component */}
        <AIAssistant 
          isOpen={aiAssistantOpen} 
          onToggle={() => setAiAssistantOpen(!aiAssistantOpen)} 
        />
      </div>
    </PageLayout>
  );
};

export default AIPage;
