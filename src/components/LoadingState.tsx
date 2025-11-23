import React from 'react';
import { Logo } from './Logo';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  progress?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Generating BuildViz...',
  subtext = 'This usually takes 30-60 seconds',
  progress
}) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Logo size="small" showText={false} />
        <span className="text-lg font-semibold text-gray-700">BuildViz</span>
      </div>
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
      <p className="text-gray-600 mb-4">{subtext}</p>
      {progress && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-blue-600">{progress}</p>
        </div>
      )}
      {!progress && (
        <div className="space-y-2 text-sm text-gray-500">
          <p>⚙️ Analyzing specifications...</p>
          <p>💰 Calculating construction costs...</p>
          <p>🏗️ Generating photorealistic render...</p>
        </div>
      )}
    </div>
  );
};



