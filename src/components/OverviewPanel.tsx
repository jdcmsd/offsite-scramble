import { ScoreRing } from './ScoreRing';
import { TrendingUp, Search, Bot, Eye } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface OverviewPanelProps {
  data: AnalysisResult;
}

export function OverviewPanel({ data }: OverviewPanelProps) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{data.brand}</h2>
          <p className="text-sm text-text-secondary">{data.url}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-secondary px-3 py-1.5 rounded-full">
          <TrendingUp className="w-3 h-3" />
          Analyzed just now
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl">
          <ScoreRing score={data.overallScore} size={100} label="Overall" />
        </div>
        
        <div className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl group cursor-pointer hover:bg-bg-card-hover transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary">SEO</span>
          </div>
          <ScoreRing score={data.seoScore} size={80} color="var(--color-accent)" />
        </div>

        <div className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl group cursor-pointer hover:bg-bg-card-hover transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-text-secondary">GEO</span>
          </div>
          <ScoreRing score={data.geoScore} size={80} color="#a78bfa" />
        </div>

        <div className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl group cursor-pointer hover:bg-bg-card-hover transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-text-secondary">Visibility</span>
          </div>
          <ScoreRing score={data.brandVisibilityScore} size={80} color="#10b981" />
        </div>
      </div>
    </div>
  );
}


