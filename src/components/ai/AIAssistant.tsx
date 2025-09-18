import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCRM } from '../../contexts/CRMContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'recommendation' | 'alert';
}

interface AIAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen = false, 
  onToggle 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI agricultural assistant. I can help you with crop recommendations, weather insights, pest management, and farming best practices. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getModuleData } = useCRM();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Get current app data for context
    const parcelsData = getModuleData('parcelles');
    const culturesData = getModuleData('cultures');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple AI response logic based on keywords
    const message = userMessage.toLowerCase();
    
    if (message.includes('crop') || message.includes('plant') || message.includes('grow')) {
      return generateCropRecommendation(message, culturesData);
    } else if (message.includes('weather') || message.includes('rain') || message.includes('sun')) {
      return generateWeatherAdvice(message);
    } else if (message.includes('pest') || message.includes('disease') || message.includes('bug')) {
      return generatePestAdvice(message);
    } else if (message.includes('yield') || message.includes('harvest') || message.includes('production')) {
      return generateYieldAdvice(message, parcelsData);
    } else if (message.includes('soil') || message.includes('fertilizer') || message.includes('nutrition')) {
      return generateSoilAdvice(message);
    } else if (message.includes('water') || message.includes('irrigation')) {
      return generateWaterAdvice(message);
    } else {
      return generateGeneralAdvice(message);
    }
  };

  const generateCropRecommendation = (message: string, culturesData: any): string => {
    const recommendations = [
      "Based on your current climate and soil conditions, I recommend considering these crops: Yam, Banana, and Sugarcane. They're well-suited for tropical conditions and have good market demand.",
      "For diversification, consider adding Chayote to your crop rotation. It's a fast-growing vegetable that can provide quick returns while your main crops mature.",
      "Given the current season, it's an excellent time to plant root vegetables like Yam and Arrowroot. They store well and provide good nutrition security.",
      "Consider intercropping legumes with your main crops to improve soil nitrogen naturally and increase overall productivity."
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  };

  const generateWeatherAdvice = (message: string): string => {
    const advice = [
      "Current weather patterns suggest increased rainfall in the coming weeks. Ensure proper drainage in your fields and consider covering sensitive crops.",
      "The dry season is approaching. Start planning your irrigation schedule and consider drought-resistant crop varieties for new plantings.",
      "High humidity levels may increase fungal disease risk. Monitor your crops closely and ensure good air circulation.",
      "Strong winds are forecasted. Secure young plants and consider windbreaks for vulnerable crops like banana trees."
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  };

  const generatePestAdvice = (message: string): string => {
    const advice = [
      "For natural pest control, try companion planting with marigolds and basil. They repel many common agricultural pests.",
      "Regular inspection is key. Check the undersides of leaves weekly for early pest detection. Early intervention is always more effective.",
      "Consider introducing beneficial insects like ladybugs and lacewings to control aphid populations naturally.",
      "Neem oil spray is an effective organic treatment for many pests. Apply in the evening to avoid harming beneficial insects."
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  };

  const generateYieldAdvice = (message: string, parcelsData: any): string => {
    const advice = [
      "To maximize yield, focus on soil health through regular composting and crop rotation. Healthy soil produces healthier, more productive plants.",
      "Consider precision agriculture techniques like soil testing and targeted fertilization to optimize resource use and increase yields.",
      "Proper spacing and pruning can significantly increase yields. Ensure your plants have adequate space and light penetration.",
      "Harvest timing is crucial. Monitor your crops closely and harvest at peak ripeness for maximum quality and market value."
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  };

  const generateSoilAdvice = (message: string): string => {
    const advice = [
      "Regular soil testing is essential. Test pH levels and nutrient content at least twice a year to optimize fertilization.",
      "Organic matter is key to soil health. Add compost, aged manure, or green manure crops to improve soil structure and fertility.",
      "Avoid over-tilling, which can damage soil structure. Consider no-till or minimal tillage practices to preserve soil health.",
      "Cover crops during fallow periods help prevent erosion and add organic matter to the soil."
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  };

  const generateWaterAdvice = (message: string): string => {
    const advice = [
      "Drip irrigation is highly efficient for water conservation. It delivers water directly to plant roots, reducing waste and disease risk.",
      "Mulching around plants helps retain soil moisture and reduces watering needs. Use organic mulches like straw or wood chips.",
      "Water early morning or late evening to minimize evaporation losses. Avoid watering during the hottest part of the day.",
      "Collect rainwater during wet seasons for use during dry periods. This sustainable practice reduces water costs and dependency."
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  };

  const generateGeneralAdvice = (message: string): string => {
    const advice = [
      "Sustainable farming practices not only protect the environment but also improve long-term productivity and profitability.",
      "Keep detailed records of your farming activities. This data helps you make better decisions and track what works best for your specific conditions.",
      "Consider joining local farmer groups or cooperatives to share knowledge, resources, and access better markets.",
      "Stay updated with agricultural research and new techniques. Continuous learning is key to successful farming.",
      "Diversification reduces risk. Don't put all your resources into one crop - spread your investments across different crops and markets."
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'recommendation'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-agri-primary hover:bg-agri-primary-dark shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-96 shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      <CardHeader className="pb-3 bg-agri-primary text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">AI Farm Assistant</CardTitle>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-agri-primary-dark h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-agri-primary-dark h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-agri-primary text-white'
                        : message.type === 'recommendation'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && (
                        <Bot className="h-4 w-4 mt-0.5 text-agri-primary flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-agri-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-agri-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-agri-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-agri-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me about crops, weather, pests, or farming tips..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="bg-agri-primary hover:bg-agri-primary-dark"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("What crops should I plant this season?")}
                className="text-xs"
              >
                Crop advice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("How can I improve my soil health?")}
                className="text-xs"
              >
                Soil tips
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("What's the best pest control method?")}
                className="text-xs"
              >
                Pest control
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
