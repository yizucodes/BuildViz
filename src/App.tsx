import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingState } from './components/LoadingState';
// import { estimateConstructionCosts } from './services/claudeService';
import { generateArchitecturalRender } from './services/fluxService';
import type { BuildingSpecs, GenerationResult } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (specs: BuildingSpecs) => {
    setIsLoading(true);
    setError(null);

    try {
      // Run both API calls in parallel for speed
      // const [costs, imageUrl] = await Promise.all([
      //   estimateConstructionCosts(specs),
      //   generateArchitecturalRender(specs),
      // ]);
      
      const imageUrl = await generateArchitecturalRender(specs);

      setResult({
        imageUrl,
        costs: null, // Commented out: estimateConstructionCosts(specs)
        specs,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
      </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : result ? (
        <ResultDisplay result={result} onReset={handleReset} />
      ) : (
        <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
      )}
      </div>
  );
}

export default App;
