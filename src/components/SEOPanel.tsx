import { Search, CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import type { SEOMetric } from '../types';

interface SEOPanelProps {
  metrics: SEOMetric[];
}

const StatusIcon = ({ status }: { status: SEOMetric['status'] }) => {
  switch (status) {
    case 'good':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case 'danger':
      return <XCircle className="w-5 h-5 text-danger" />;
  }
};

export function SEOPanel({ metrics }: SEOPanelProps) {
  const sortedMetrics = [...metrics].sort((a, b) => {
    const order = { danger: 0, warning: 1, good: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="card p-6 animate-fade-in stagger-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Search className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">SEO Health</h3>
          <p className="text-sm text-text-muted">Traditional search optimization</p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedMetrics.map((metric, index) => (
          <div 
            key={metric.name}
            className="group p-4 bg-bg-secondary rounded-lg hover:bg-bg-card-hover transition-colors cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={metric.status} />
                <div>
                  <p className="font-medium">{metric.name}</p>
                  {metric.recommendation && (
                    <p className="text-sm text-text-muted mt-0.5 max-w-md">
                      {metric.recommendation}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono font-semibold">{metric.score}</span>
                  <span className="text-text-muted font-mono">/{metric.maxScore}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  metric.status === 'good' ? 'bg-success' :
                  metric.status === 'warning' ? 'bg-warning' : 'bg-danger'
                }`}
                style={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


