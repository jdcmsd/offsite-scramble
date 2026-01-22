import { Bot, Check, X, Sparkles, BookOpen, Shield, Code } from 'lucide-react';
import type { GEOInsight } from '../types';

interface GEOPanelProps {
  insights: GEOInsight[];
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Content Structure':
      return <BookOpen className="w-4 h-4" />;
    case 'Authority Signals':
      return <Shield className="w-4 h-4" />;
    case 'Technical':
      return <Code className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const ImpactBadge = ({ impact }: { impact: GEOInsight['impact'] }) => {
  const colors = {
    high: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors[impact]}`}>
      {impact}
    </span>
  );
};

export function GEOPanel({ insights }: GEOPanelProps) {
  const implemented = insights.filter(i => i.implemented).length;
  const total = insights.length;
  const percentage = Math.round((implemented / total) * 100);

  // Group by category
  const categories = insights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, GEOInsight[]>);

  return (
    <div className="card p-6 animate-fade-in stagger-3">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">GEO Readiness</h3>
            <p className="text-sm text-text-muted">Generative Engine Optimization</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-mono font-semibold text-purple-400">{percentage}%</span>
          <p className="text-xs text-text-muted">{implemented}/{total} implemented</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, categoryInsights]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3 text-text-secondary">
              <CategoryIcon category={category} />
              <span className="text-sm font-medium">{category}</span>
            </div>
            
            <div className="space-y-2">
              {categoryInsights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border transition-colors ${
                    insight.implemented 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-bg-secondary border-border hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                        insight.implemented 
                          ? 'bg-success text-bg-primary' 
                          : 'bg-bg-card border border-border'
                      }`}>
                        {insight.implemented ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3 text-text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{insight.title}</p>
                        <p className="text-sm text-text-muted mt-0.5">{insight.description}</p>
                      </div>
                    </div>
                    <ImpactBadge impact={insight.impact} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


