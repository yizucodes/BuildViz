import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingState } from './components/LoadingState';
import { InterpretationSelection } from './components/InterpretationSelection';
import { estimateConstructionCosts } from './services/claudeService';
import { generateArchitecturalRender, generateInterpretationImages } from './services/fluxService';
import { interpretVision } from './services/nemotronService';
import type { BuildingSpecs, GenerationResult, Interpretation } from './types';

type AppView = 'form' | 'loading' | 'interpretation-selection' | 'final-result';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Interpretation mode state
  const [isInterpretationMode, setIsInterpretationMode] = useState(false);
  const [interpretations, setInterpretations] = useState<Interpretation[]>([]);
  const [interpretationImages, setInterpretationImages] = useState<(string | null)[]>([]);
  const [currentSpecs, setCurrentSpecs] = useState<BuildingSpecs | null>(null);
  
  // Loading state messages
  const [loadingMessage, setLoadingMessage] = useState('Generating BuildViz...');
  const [loadingSubtext, setLoadingSubtext] = useState('This usually takes 30-60 seconds');
  const [loadingProgress, setLoadingProgress] = useState<string | undefined>(undefined);

  const handleGenerate = async (specs: BuildingSpecs) => {
    setCurrentView('loading');
    setError(null);
    setCurrentSpecs(specs);

    // Check if vision description exists and is not empty
    const hasVision = specs.visionDescription && specs.visionDescription.trim().length > 0;

    if (!hasVision) {
      // Normal flow: generate 1 image + costs
      setIsInterpretationMode(false);
      setLoadingMessage('Generating BuildViz...');
      setLoadingSubtext('This usually takes 30-60 seconds');
      setLoadingProgress(undefined);

      try {
        const [costs, imageUrl] = await Promise.all([
          estimateConstructionCosts(specs),
          generateArchitecturalRender(specs),
        ]);

        setResult({
          imageUrl,
          costs,
          specs,
          timestamp: new Date(),
        });
        setCurrentView('final-result');
      } catch (err) {
        console.error('Generation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate. Please try again.');
        setCurrentView('form');
      }
    } else {
      // Interpretation mode: generate 3 interpretations + images
      setIsInterpretationMode(true);
      
      try {
        // Step 1: Get interpretations from Nemotron
        setLoadingMessage('Analyzing your vision...');
        setLoadingSubtext('Generating 3 architectural interpretations');
        setLoadingProgress(undefined);

        const interpretationsResult = await interpretVision(specs.visionDescription!, specs);
        
        if (!interpretationsResult) {
          throw new Error('Failed to generate interpretations. Please try a different description.');
        }

        setInterpretations(interpretationsResult);

        // Step 2: Generate images for all 3 interpretations
        setLoadingMessage('Creating design options...');
        setLoadingSubtext('Generating photorealistic renders for each interpretation');
        setLoadingProgress('0 of 3 complete');

        const images = await generateInterpretationImages(
          interpretationsResult,
          specs,
          (completedCount) => {
            setLoadingProgress(`${completedCount} of 3 complete`);
          }
        );

        setInterpretationImages(images);

        // Check if at least one image was generated
        const successfulImages = images.filter(img => img !== null);
        if (successfulImages.length === 0) {
          throw new Error('Failed to generate any visualizations. Please try again.');
        }

        // Show selection view
        setCurrentView('interpretation-selection');
      } catch (err) {
        console.error('Interpretation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate interpretations. Please try again.');
        setCurrentView('form');
      }
    }
  };

  const handleInterpretationSelect = async (index: number) => {
    if (!interpretations[index] || !interpretationImages[index] || !currentSpecs) {
      setError('Invalid interpretation selection');
      return;
    }

    setCurrentView('loading');
    setLoadingMessage('Calculating construction costs...');
    setLoadingSubtext(`Analyzing ${interpretations[index].title}`);
    setLoadingProgress(undefined);

    try {
      const costs = await estimateConstructionCosts(currentSpecs);

      setResult({
        imageUrl: interpretationImages[index]!,
        costs,
        specs: currentSpecs,
        timestamp: new Date(),
        interpretation: interpretations[index],
      });
      setCurrentView('final-result');
    } catch (err) {
      console.error('Cost estimation error:', err);
      // Show result without costs
      setResult({
        imageUrl: interpretationImages[index]!,
        costs: null,
        specs: currentSpecs,
        timestamp: new Date(),
        interpretation: interpretations[index],
      });
      setCurrentView('final-result');
    }
  };

  const handleViewOtherInterpretations = () => {
    setCurrentView('interpretation-selection');
  };

  const handleReset = () => {
    setCurrentView('form');
    setResult(null);
    setError(null);
    setIsInterpretationMode(false);
    setInterpretations([]);
    setInterpretationImages([]);
    setCurrentSpecs(null);
  };

  const handleFallbackToNormal = async () => {
    if (!currentSpecs) return;

    // Remove vision description and try normal flow
    const specsWithoutVision = { ...currentSpecs, visionDescription: '' };
    setError(null);
    await handleGenerate(specsWithoutVision);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium mb-2">Error: {error}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
            {isInterpretationMode && currentSpecs && (
              <button
                onClick={handleFallbackToNormal}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Continue with Standard Generation
              </button>
            )}
          </div>
        </div>
      )}

      {currentView === 'form' && (
        <InputForm onSubmit={handleGenerate} isLoading={false} />
      )}

      {currentView === 'loading' && (
        <LoadingState
          message={loadingMessage}
          subtext={loadingSubtext}
          progress={loadingProgress}
        />
      )}

      {currentView === 'interpretation-selection' && (
        <InterpretationSelection
          visionDescription={currentSpecs?.visionDescription || ''}
          interpretations={interpretations}
          imageUrls={interpretationImages}
          onSelect={handleInterpretationSelect}
        />
      )}

      {currentView === 'final-result' && result && (
        <ResultDisplay
          result={result}
          onReset={handleReset}
          onViewOtherInterpretations={
            isInterpretationMode ? handleViewOtherInterpretations : undefined
          }
        />
      )}
    </div>
  );
}

export default App;
