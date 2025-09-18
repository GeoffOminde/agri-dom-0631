import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { useAI } from '../../hooks/useAI';
import { AIResponse } from '../../services/aiService';

interface ImageAnalysisProps {
  onAnalysisComplete?: (result: AIResponse) => void;
}

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'pest' | 'disease' | 'crop_health'>('pest');
  const [analysisResult, setAnalysisResult] = useState<AIResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeImage, isLoading, error } = useAI();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setAnalysisResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      const result = await analyzeImage(selectedImage, analysisType);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getSeverityColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-red-100 text-red-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSeverityIcon = (confidence: number) => {
    if (confidence >= 0.8) return <AlertTriangle className="h-4 w-4" />;
    if (confidence >= 0.6) return <Info className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <span>AI Image Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Analysis Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Analysis Type</label>
            <div className="flex space-x-2">
              {[
                { value: 'pest', label: 'Pest Detection' },
                { value: 'disease', label: 'Disease Detection' },
                { value: 'crop_health', label: 'Crop Health' }
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={analysisType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAnalysisType(type.value as any)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg"
                  />
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Image
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="bg-agri-primary hover:bg-agri-primary-dark"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 mr-2" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-gray-600">Upload an image of your crop for AI analysis</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports JPG, PNG, and WebP formats
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing image...</span>
                <span>Processing</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <Badge className={getSeverityColor(analysisResult.confidence)}>
                {getSeverityIcon(analysisResult.confidence)}
                <span className="ml-1">
                  {Math.round(analysisResult.confidence * 100)}% Confidence
                </span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Analysis Message */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{analysisResult.message}</AlertDescription>
            </Alert>

            {/* Detailed Data */}
            {analysisResult.data && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Detailed Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {Object.entries(analysisResult.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommended Actions</h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources */}
            {analysisResult.sources && analysisResult.sources.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500">
                  Analysis based on: {analysisResult.sources.join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
