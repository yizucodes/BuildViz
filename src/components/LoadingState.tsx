import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating BuildViz...</h2>
      <p className="text-gray-600 mb-4">This usually takes 30-60 seconds</p>
      <div className="space-y-2 text-sm text-gray-500">
        <p>⚙️ Analyzing specifications...</p>
        <p>💰 Calculating construction costs...</p>
        <p>🏗️ Generating photorealistic render...</p>
      </div>
    </div>
  );
};



