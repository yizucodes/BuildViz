import React from 'react';
import type { Interpretation } from '../types';
import { Logo } from './Logo';

interface InterpretationSelectionProps {
  visionDescription: string;
  interpretations: Interpretation[];
  imageUrls: (string | null)[];
  onSelect: (index: number) => void;
}

export const InterpretationSelection: React.FC<InterpretationSelectionProps> = ({
  visionDescription,
  interpretations,
  imageUrls,
  onSelect,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Logo size="medium" showText={false} />
          <h1 className="text-4xl font-bold text-gray-900">
            Which interpretation matches your vision?
          </h1>
        </div>
        <div className="max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 italic">"{visionDescription}"</p>
        </div>
        <p className="text-gray-600 mt-4">
          Select the design that best represents what you meant
        </p>
      </div>

      {/* Grid of interpretations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {interpretations.map((interpretation, index) => (
          <InterpretationCard
            key={index}
            interpretation={interpretation}
            imageUrl={imageUrls[index]}
            index={index}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
};

interface InterpretationCardProps {
  interpretation: Interpretation;
  imageUrl: string | null;
  index: number;
  onSelect: () => void;
}

const InterpretationCard: React.FC<InterpretationCardProps> = ({
  interpretation,
  imageUrl,
  index,
  onSelect,
}) => {
  const optionLabel = String.fromCharCode(65 + index); // A, B, C

  if (!imageUrl) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-500 font-medium mb-2">Generation Failed</p>
          <p className="text-sm text-gray-400">
            This interpretation could not be visualized
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 min-h-[500px] flex flex-col">
      {/* Image */}
      <div className="h-[300px] overflow-hidden">
        <img
          src={imageUrl}
          alt={`Architectural interpretation: ${interpretation.title}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">
            {interpretation.title}
          </h3>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
            Option {optionLabel}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Approach:</h4>
            <p className="text-sm text-gray-600">{interpretation.approach}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Materials:</h4>
            <p className="text-xs text-gray-500">{interpretation.materials}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Aesthetic:</h4>
            <p className="text-sm text-gray-600">{interpretation.aesthetic}</p>
          </div>
        </div>

        {/* Select Button */}
        <button
          onClick={onSelect}
          className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Select This Design
        </button>
      </div>
    </div>
  );
};

