import React, { useState } from 'react';
import type { BuildingSpecs } from '../types';

interface InputFormProps {
  onSubmit: (specs: BuildingSpecs) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [specs, setSpecs] = useState<BuildingSpecs>({
    buildingType: 'office',
    stories: 3,
    squareFootage: 50000,
    location: 'San Francisco, CA',
    materialQuality: 'standard',
    stylePreference: 'modern-glass',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(specs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">BuildViz</h1>
        <p className="text-gray-600">Architectural visualization + cost estimation in 60 seconds</p>
      </div>

      {/* Building Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Building Type
        </label>
        <select
          value={specs.buildingType}
          onChange={(e) => setSpecs({ ...specs, buildingType: e.target.value as any })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="office">Office Building</option>
          <option value="warehouse">Warehouse / Industrial</option>
          <option value="residential">Multi-Family Residential</option>
          <option value="retail">Retail / Commercial</option>
          <option value="hotel">Hotel / Hospitality</option>
        </select>
      </div>

      {/* Stories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Stories
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={specs.stories}
          onChange={(e) => setSpecs({ ...specs, stories: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Square Footage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Square Footage
        </label>
        <input
          type="number"
          min="5000"
          max="500000"
          step="5000"
          value={specs.squareFootage}
          onChange={(e) => setSpecs({ ...specs, squareFootage: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">{specs.squareFootage.toLocaleString()} sq ft</p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={specs.location}
          onChange={(e) => setSpecs({ ...specs, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="San Francisco, CA">San Francisco, CA</option>
          <option value="New York, NY">New York, NY</option>
          <option value="Los Angeles, CA">Los Angeles, CA</option>
          <option value="Austin, TX">Austin, TX</option>
          <option value="Miami, FL">Miami, FL</option>
          <option value="Seattle, WA">Seattle, WA</option>
          <option value="Boston, MA">Boston, MA</option>
          <option value="Denver, CO">Denver, CO</option>
        </select>
      </div>

      {/* Style Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Architectural Style
        </label>
        <select
          value={specs.stylePreference}
          onChange={(e) => setSpecs({ ...specs, stylePreference: e.target.value as any })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="modern-glass">Modern Glass & Steel</option>
          <option value="traditional-brick">Traditional Brick</option>
          <option value="industrial">Industrial / Warehouse</option>
          <option value="brutalist">Brutalist</option>
          <option value="futuristic">Futuristic</option>
        </select>
      </div>

      {/* Material Quality */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material Quality
        </label>
        <select
          value={specs.materialQuality}
          onChange={(e) => setSpecs({ ...specs, materialQuality: e.target.value as any })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="basic">Basic (-15% cost)</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium (+25% cost)</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate BuildViz'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        *Estimates are preliminary and for feasibility purposes only. Actual costs may vary by 20-40%.
      </p>
    </form>
  );
};



