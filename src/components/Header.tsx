import { Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function Header({ onAnalyze, isAnalyzing }: HeaderProps) {
  return (
    <header className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-bg-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="gradient-text">Offsite</span> Scramble
            </h1>
            <p className="text-xs text-text-muted">SEO & GEO Intelligence</p>
          </div>
        </div>
        
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-bg-primary font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? 'Analyzing...' : 'New Analysis'}
        </button>
      </div>
    </header>
  );
}


