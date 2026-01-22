import { useState } from 'react';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';

interface AnalysisInputProps {
  onSubmit: (url: string, brand: string) => void;
  isLoading: boolean;
}

export function AnalysisInput({ onSubmit, isLoading }: AnalysisInputProps) {
  const [url, setUrl] = useState('');
  const [brand, setBrand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && brand) {
      onSubmit(url, brand);
    }
  };

  return (
    <div className="card p-8 animate-fade-in animate-pulse-glow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Globe className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Analyze Your Brand</h2>
          <p className="text-sm text-text-secondary">Get SEO & GEO insights for your website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g., TechFlow"
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!url || !brand || isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-bg-primary font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Run Analysis
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-text-muted text-center">
          We'll analyze SEO fundamentals, GEO readiness for AI search, and brand visibility across AI platforms.
        </p>
      </div>
    </div>
  );
}


