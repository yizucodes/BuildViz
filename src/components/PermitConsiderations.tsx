import React from 'react';
import type { PermitConsideration, BuildingSpecs } from '../types';

interface PermitConsiderationsProps {
  permitData: PermitConsideration[];
  buildingSpecs: BuildingSpecs;
}

export const PermitConsiderations: React.FC<PermitConsiderationsProps> = ({ 
  permitData, 
  buildingSpecs 
}) => {
  const getRiskIcon = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'High':
        return '🔴';
      case 'Medium':
        return '⚠️';
      case 'Low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'High':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'Medium':
        return 'border-l-4 border-amber-500 bg-amber-50';
      case 'Low':
        return 'border-l-4 border-green-500 bg-green-50';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚦</span>
          <h2 className="text-2xl font-bold text-gray-900">PERMITTING CONSIDERATIONS</h2>
        </div>
        <p className="text-gray-600">
          AI Analysis based on typical {buildingSpecs.location} requirements
        </p>
      </div>

      {/* Considerations List */}
      <div className="space-y-4 mb-6">
        {permitData.map((consideration, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-r-lg ${getRiskColor(consideration['Potential risk level'])}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-1">
                {getRiskIcon(consideration['Potential risk level'])}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  {consideration['Issue category']}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  {consideration['Typical requirement']}
                </p>
                <p className="text-sm text-gray-600">
                  → {consideration['Common resolution approach']}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg mb-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-semibold text-gray-900 mb-2">RECOMMENDATION:</p>
            <p className="text-sm text-gray-700">
              Engage with {buildingSpecs.location} planning department early in design phase 
              to address these considerations before formal submission.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-5 rounded-r-lg mb-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">⏱️</span>
          <div>
            <p className="font-semibold text-gray-900 mb-2">TYPICAL TIMELINE:</p>
            <p className="text-sm text-gray-700">
              6-10 months for projects addressing these concerns proactively
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        *AI analysis based on typical requirements. Consult local planning department 
        for specific codes and regulations.
      </p>
    </div>
  );
};

