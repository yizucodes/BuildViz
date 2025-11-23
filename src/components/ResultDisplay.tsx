import React, { useRef } from 'react';
import type { GenerationResult } from '../types';
import { PermitConsiderations } from './PermitConsiderations';
import { Logo } from './Logo';

interface ResultDisplayProps {
  result: GenerationResult;
  onReset: () => void;
  onViewOtherInterpretations?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, onViewOtherInterpretations }) => {
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
        <div className="flex items-center justify-center gap-3 mb-2">
          <Logo size="medium" showText={false} />
          <h1 className="text-4xl font-bold text-gray-900">BuildViz Result</h1>
        </div>
        <p className="text-gray-600">Professional architectural visualization + cost breakdown</p>
      </div>

      {/* Main Content */}
      <div ref={resultRef} className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow-xl p-8">
        
        {/* Left: Rendering (70% width) */}
        <div className="lg:w-[70%]">
          {result.interpretation && (
            <div className="mb-3">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Selected: {result.interpretation.title}
              </span>
            </div>
          )}
          <img
            src={result.imageUrl}
            alt="Architectural rendering"
            className="w-full rounded-lg shadow-lg"
          />
          
          {/* Project Details - Small text below image */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 text-center">
              {result.specs.stories} {result.specs.stories === 1 ? 'story' : 'stories'}, {result.specs.squareFootage.toLocaleString()} sq ft, {result.specs.location}, {result.specs.stylePreference.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
          </div>
        </div>

        {/* Right: Cost Breakdown (30% width) */}
        <div className="lg:w-[30%] space-y-6">
          {result.costs ? (
            <>
              <div className="bg-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 tracking-wide">TOTAL PROJECT COST</h3>
                <p className="text-4xl font-bold">{formatCurrency(result.costs.total)}</p>
                <p className="text-blue-100 mt-3 text-sm">
                  {formatCurrency(result.costs.costPerSqFt)}/sq ft
                </p>
                <p className="text-blue-100 mt-1 text-sm">
                  Timeline: {result.costs.timeline}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">BREAKDOWN</h3>
                
                <div className="space-y-3">
                  <CostItem
                    label="Foundation"
                    amount={result.costs.foundation}
                  />
                  
                  <CostItem
                    label="Structure"
                    amount={result.costs.structure}
                  />
                  
                  <CostItem
                    label="Envelope"
                    amount={result.costs.envelope}
                  />
                  
                  <CostItem
                    label="MEP"
                    amount={result.costs.mep}
                  />
                  
                  <CostItem
                    label="Interiors"
                    amount={result.costs.interiors}
                  />
                  
                  <CostItem
                    label="Contingency"
                    amount={result.costs.contingency}
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  *Preliminary estimate. Actual costs may vary ±30%
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

      {/* Permit Considerations - Full Width Below */}
      {result.permitConsiderations && result.permitConsiderations.length > 0 && (
        <PermitConsiderations
          permitData={result.permitConsiderations}
          buildingSpecs={result.specs}
        />
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        {onViewOtherInterpretations && (
          <button
            onClick={onViewOtherInterpretations}
            className="bg-purple-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-purple-700 transition-colors"
          >
            View Other Interpretations
          </button>
        )}
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
          Start Over
        </button>
      </div>
    </div>
  );
};

// Helper component for cost items
const CostItem: React.FC<{ label: string; amount: number }> = ({
  label,
  amount,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format to show abbreviated numbers (e.g., $2.9M, $850K)
  const formatAbbreviated = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="flex justify-between items-center py-2">
      <p className="text-sm text-gray-700">{label}:</p>
      <p className="text-sm font-semibold text-gray-900">{formatAbbreviated(amount)}</p>
    </div>
  );
};



