import { Eye, MessageSquare, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import type { BrandMention } from '../types';

interface BrandPanelProps {
  mentions: BrandMention[];
  score: number;
}

const SentimentIcon = ({ sentiment }: { sentiment: BrandMention['sentiment'] }) => {
  switch (sentiment) {
    case 'positive':
      return <ThumbsUp className="w-4 h-4 text-success" />;
    case 'neutral':
      return <Minus className="w-4 h-4 text-text-muted" />;
    case 'negative':
      return <ThumbsDown className="w-4 h-4 text-danger" />;
  }
};

const PlatformBadge = ({ platform }: { platform: string }) => {
  const colors: Record<string, string> = {
    'ChatGPT': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Perplexity': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Claude': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Gemini': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colors[platform] || 'bg-slate-500/20 text-slate-300'}`}>
      {platform}
    </span>
  );
};

export function BrandPanel({ mentions, score }: BrandPanelProps) {
  const positiveCount = mentions.filter(m => m.sentiment === 'positive').length;
  const neutralCount = mentions.filter(m => m.sentiment === 'neutral').length;
  const negativeCount = mentions.filter(m => m.sentiment === 'negative').length;

  return (
    <div className="card p-6 animate-fade-in stagger-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Brand Visibility</h3>
            <p className="text-sm text-text-muted">AI platform mentions</p>
          </div>
        </div>
      </div>

      {/* Sentiment Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-success/10 rounded-lg text-center border border-success/20">
          <div className="flex items-center justify-center gap-2">
            <ThumbsUp className="w-4 h-4 text-success" />
            <span className="text-xl font-mono font-semibold text-success">{positiveCount}</span>
          </div>
          <p className="text-xs text-text-muted mt-1">Positive</p>
        </div>
        <div className="p-3 bg-bg-secondary rounded-lg text-center border border-border">
          <div className="flex items-center justify-center gap-2">
            <Minus className="w-4 h-4 text-text-muted" />
            <span className="text-xl font-mono font-semibold text-text-secondary">{neutralCount}</span>
          </div>
          <p className="text-xs text-text-muted mt-1">Neutral</p>
        </div>
        <div className="p-3 bg-danger/10 rounded-lg text-center border border-danger/20">
          <div className="flex items-center justify-center gap-2">
            <ThumbsDown className="w-4 h-4 text-danger" />
            <span className="text-xl font-mono font-semibold text-danger">{negativeCount}</span>
          </div>
          <p className="text-xs text-text-muted mt-1">Missing</p>
        </div>
      </div>

      {/* Mentions List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Recent Queries</span>
        </div>
        
        {mentions.map((mention, index) => (
          <div 
            key={index}
            className="p-4 bg-bg-secondary rounded-lg hover:bg-bg-card-hover transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="text-sm font-medium text-accent">{mention.source}</p>
              <div className="flex items-center gap-2 shrink-0">
                <SentimentIcon sentiment={mention.sentiment} />
                <PlatformBadge platform={mention.aiPlatform} />
              </div>
            </div>
            <p className="text-sm text-text-muted">{mention.context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


