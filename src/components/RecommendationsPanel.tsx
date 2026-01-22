import { Lightbulb, Zap, Clock, Wrench, Search, Bot, Eye } from 'lucide-react';
import type { Recommendation } from '../types';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const PriorityBadge = ({ priority }: { priority: Recommendation['priority'] }) => {
  const styles = {
    critical: 'bg-danger/20 text-danger border-danger/30',
    high: 'bg-warning/20 text-warning border-warning/30',
    medium: 'bg-accent/20 text-accent border-accent/30',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  };

  const labels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
};

const EffortBadge = ({ effort }: { effort: Recommendation['effort'] }) => {
  const icons = {
    'quick-win': <Zap className="w-3 h-3" />,
    'moderate': <Clock className="w-3 h-3" />,
    'significant': <Wrench className="w-3 h-3" />
  };

  const labels = {
    'quick-win': 'Quick Win',
    'moderate': 'Moderate',
    'significant': 'Significant'
  };

  return (
    <span className="flex items-center gap-1 px-2 py-0.5 text-xs text-text-muted bg-bg-primary rounded-full">
      {icons[effort]}
      {labels[effort]}
    </span>
  );
};

const CategoryIcon = ({ category }: { category: Recommendation['category'] }) => {
  switch (category) {
    case 'seo':
      return <Search className="w-4 h-4 text-accent" />;
    case 'geo':
      return <Bot className="w-4 h-4 text-purple-400" />;
    case 'brand':
      return <Eye className="w-4 h-4 text-emerald-400" />;
  }
};

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedRecs = [...recommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="card p-6 animate-fade-in stagger-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Recommendations</h3>
          <p className="text-sm text-text-muted">Prioritized action items</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRecs.map((rec, index) => (
          <div 
            key={rec.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer hover:scale-[1.01] ${
              rec.priority === 'critical' 
                ? 'bg-danger/5 border-danger/20 hover:border-danger/40' 
                : 'bg-bg-secondary border-border hover:border-accent/30'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CategoryIcon category={rec.category} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <PriorityBadge priority={rec.priority} />
                  <EffortBadge effort={rec.effort} />
                </div>
                <p className="text-sm text-text-muted">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


