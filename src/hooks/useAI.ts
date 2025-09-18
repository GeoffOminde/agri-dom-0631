import { useState, useCallback } from 'react';
import { aiService, AIRequest, AIResponse } from '../services/aiService';

export interface UseAIReturn {
  query: (request: AIRequest) => Promise<AIResponse>;
  analyzeImage: (file: File, type: 'pest' | 'disease' | 'crop_health') => Promise<AIResponse>;
  getWeatherRecommendations: (location: string, days?: number) => Promise<AIResponse>;
  isLoading: boolean;
  error: string | null;
  lastResponse: AIResponse | null;
}

export const useAI = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);

  const query = useCallback(async (request: AIRequest): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.query(request);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeImage = useCallback(async (
    file: File, 
    type: 'pest' | 'disease' | 'crop_health'
  ): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.analyzeImage(file, type);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while analyzing the image';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWeatherRecommendations = useCallback(async (
    location: string, 
    days: number = 7
  ): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.getWeatherRecommendations(location, days);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while getting weather recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    query,
    analyzeImage,
    getWeatherRecommendations,
    isLoading,
    error,
    lastResponse
  };
};
