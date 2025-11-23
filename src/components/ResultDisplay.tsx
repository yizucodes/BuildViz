import React, { useRef } from 'react';
import type { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = async () => {
    // Simple export: open image in new tab
    // For production, use html2canvas to capture the whole result
    window.open(result.imageUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">BuildViz Result</h1>
        <p className="text-gray-600">Professional architectural visualization + cost breakdown</p>
      </div>

      {/* Main Content */}
      <div ref={resultRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-lg shadow-xl p-8">
        
        {/* Left: Rendering (2/3 width) */}
        <div className="lg:col-span-2">
          <img
            src={result.imageUrl}
            alt="Architectural rendering"
            className="w-full rounded-lg shadow-lg"
          />
          
          {/* Project Details */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Project Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>{' '}
                <span className="font-medium capitalize">{result.specs.buildingType}</span>
              </div>
              <div>
                <span className="text-gray-600">Stories:</span>{' '}
                <span className="font-medium">{result.specs.stories}</span>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>{' '}
                <span className="font-medium">{result.specs.squareFootage.toLocaleString()} sq ft</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>{' '}
                <span className="font-medium">{result.specs.location}</span>
              </div>
              <div>
                <span className="text-gray-600">Style:</span>{' '}
                <span className="font-medium capitalize">{result.specs.stylePreference.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-600">Quality:</span>{' '}
                <span className="font-medium capitalize">{result.specs.materialQuality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cost Breakdown (1/3 width) */}
        <div className="space-y-6">
          {result.costs ? (
            <>
              <div className="bg-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Project Cost</h3>
                <p className="text-4xl font-bold">{formatCurrency(result.costs.total)}</p>
                <p className="text-blue-100 mt-2">
                  {formatCurrency(result.costs.costPerSqFt)}/sq ft
                </p>
                <p className="text-blue-100 mt-2 text-sm">
                  Timeline: {result.costs.timeline}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                
                <CostItem
                  label="Foundation & Site Work"
                  amount={result.costs.foundation}
                  percentage={(result.costs.foundation / result.costs.total) * 100}
                />
                
                <CostItem
                  label="Structural System"
                  amount={result.costs.structure}
                  percentage={(result.costs.structure / result.costs.total) * 100}
                />
                
                <CostItem
                  label="Building Envelope"
                  amount={result.costs.envelope}
                  percentage={(result.costs.envelope / result.costs.total) * 100}
                />
                
                <CostItem
                  label="MEP Systems"
                  amount={result.costs.mep}
                  percentage={(result.costs.mep / result.costs.total) * 100}
                />
                
                <CostItem
                  label="Interior Finishes"
                  amount={result.costs.interiors}
                  percentage={(result.costs.interiors / result.costs.total) * 100}
                />
                
                <CostItem
                  label="Contingency (10%)"
                  amount={result.costs.contingency}
                  percentage={(result.costs.contingency / result.costs.total) * 100}
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-4">
                  *This is a preliminary estimate for feasibility analysis. Actual construction costs may vary by 20-40% based on market conditions, site conditions, and final design specifications.
                </p>
              </div>
            </>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600">Cost estimation is currently disabled</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleExport}
          className="bg-green-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-green-700 transition-colors"
        >
          Export Image
        </button>
        <button
          onClick={onReset}
          className="bg-gray-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-gray-700 transition-colors"
        >
          New Project
        </button>
      </div>
    </div>
  );
};

// Helper component for cost items
const CostItem: React.FC<{ label: string; amount: number; percentage: number }> = ({
  label,
  amount,
  percentage,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
      </div>
      <p className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</p>
    </div>
  );
};



