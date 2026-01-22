import { useState, useEffect } from 'react';
import {
  Header,
  AnalysisInput,
  OverviewPanel,
  SEOPanel,
  GEOPanel,
  BrandPanel,
  RecommendationsPanel,
  ContentAnalysisPanel,
} from './components';
import { mockAnalysisResult, mockPageContent, mockInlineRecommendations } from './data/mockData';
import { analyzeUrl, checkApiHealth, type FullAnalysisResult } from './services/api';
import type { AnalysisResult, InlineRecommendation, PageContent } from './types';
import { AlertCircle, Server, Wifi, WifiOff } from 'lucide-react';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [inlineRecommendations, setInlineRecommendations] = useState<InlineRecommendation[]>(mockInlineRecommendations);
  const [pageContent, setPageContent] = useState<PageContent>(mockPageContent);
  const [showInput, setShowInput] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth().then(available => {
      setApiAvailable(available);
      if (!available) {
        console.log('API server not available, will use mock data for demo');
      }
    });
  }, []);

  const handleAnalyze = async (url: string, brand: string) => {
    setIsAnalyzing(true);
    setError(null);

    // If API is available and not using mock mode, do real analysis
    if (apiAvailable && !useMockData) {
      try {
        const result: FullAnalysisResult = await analyzeUrl(url, brand);
        setAnalysisResult(result);
        setInlineRecommendations(result.inlineRecommendations);
        setPageContent(result.pageContent);
        setShowInput(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed');
        // Fall back to mock data on error
        setAnalysisResult({
          ...mockAnalysisResult,
          brand,
          url,
          analyzedAt: new Date().toISOString(),
        });
        setInlineRecommendations(mockInlineRecommendations);
        setPageContent({ ...mockPageContent, url });
        setShowInput(false);
      }
    } else {
      // Use mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisResult({
        ...mockAnalysisResult,
        brand,
        url,
        analyzedAt: new Date().toISOString(),
      });
      setInlineRecommendations(mockInlineRecommendations);
      setPageContent({ ...mockPageContent, url });
      setShowInput(false);
    }

    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setShowInput(true);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <Header onAnalyze={handleNewAnalysis} isAnalyzing={isAnalyzing} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* API Status Banner */}
        {apiAvailable !== null && (
          <div className={`mb-6 p-3 rounded-lg border flex items-center justify-between ${
            apiAvailable 
              ? 'bg-success/10 border-success/30' 
              : 'bg-warning/10 border-warning/30'
          }`}>
            <div className="flex items-center gap-3">
              {apiAvailable ? (
                <>
                  <Wifi className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">
                    API server connected — Real URL analysis enabled
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning">
                    API server offline — Using demo mode with mock data
                  </span>
                </>
              )}
            </div>
            {apiAvailable && (
              <button
                onClick={() => setUseMockData(!useMockData)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  useMockData 
                    ? 'bg-warning/20 text-warning' 
                    : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                {useMockData ? 'Demo Mode' : 'Live Mode'}
              </button>
            )}
          </div>
        )}

        {/* Server Instructions */}
        {apiAvailable === false && showInput && (
          <div className="mb-6 p-4 bg-bg-card rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Server className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-text-primary mb-1">Start the API server for live analysis</h4>
                <p className="text-sm text-text-muted mb-2">
                  Run this command in a new terminal to enable real URL analysis:
                </p>
                <code className="block px-3 py-2 bg-bg-primary rounded text-sm font-mono text-accent">
                  npm run server
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-danger shrink-0" />
            <div>
              <p className="text-danger font-medium">Analysis Error</p>
              <p className="text-sm text-text-secondary">{error}</p>
              <p className="text-sm text-text-muted mt-1">Showing demo data instead.</p>
            </div>
          </div>
        )}

        {showInput && (
          <div className="max-w-2xl mx-auto mb-8">
            <AnalysisInput onSubmit={handleAnalyze} isLoading={isAnalyzing} />
          </div>
        )}

        {analysisResult && !showInput && (
          <div className="space-y-6">
            {/* Overview */}
            <OverviewPanel data={analysisResult} />

            {/* Content Analysis with Inline Recommendations */}
            <ContentAnalysisPanel 
              pageContent={pageContent} 
              recommendations={inlineRecommendations} 
            />

            {/* Two column layout for detailed panels */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* SEO Panel */}
              <SEOPanel metrics={analysisResult.seoMetrics} />
              
              {/* GEO Panel */}
              <GEOPanel insights={analysisResult.geoInsights} />
            </div>

            {/* Brand Visibility and Recommendations */}
            <div className="grid lg:grid-cols-2 gap-6">
              <BrandPanel 
                mentions={analysisResult.brandMentions} 
                score={analysisResult.brandVisibilityScore}
              />
              <RecommendationsPanel recommendations={analysisResult.recommendations} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!analysisResult && !showInput && (
          <div className="text-center py-20">
            <p className="text-text-muted">
              Click "New Analysis" to get started
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-text-muted">
          <p>Offsite Scramble — SEO & GEO Intelligence Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
