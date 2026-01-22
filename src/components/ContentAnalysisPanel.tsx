import { useState } from 'react';
import { 
  FileCode, 
  AlertCircle, 
  Lightbulb, 
  XCircle, 
  Sparkles,
  ChevronRight,
  X,
  ArrowRight,
  Code,
  Eye,
  Copy,
  Check,
  Database,
  FileWarning
} from 'lucide-react';
import type { InlineRecommendation, PageContent, PageElement } from '../types';

interface ContentAnalysisPanelProps {
  pageContent: PageContent;
  recommendations: InlineRecommendation[];
}

// Copy to clipboard hook
function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return { copiedId, copy };
}

const IssueIcon = ({ type }: { type: InlineRecommendation['issue']['type'] }) => {
  switch (type) {
    case 'error':
      return <XCircle className="w-4 h-4" />;
    case 'missing':
      return <AlertCircle className="w-4 h-4" />;
    case 'improvement':
      return <Lightbulb className="w-4 h-4" />;
    case 'opportunity':
      return <Sparkles className="w-4 h-4" />;
  }
};

const SeverityColors = {
  critical: 'bg-danger text-white border-danger',
  high: 'bg-warning text-bg-primary border-warning',
  medium: 'bg-accent text-bg-primary border-accent',
  low: 'bg-text-muted text-white border-text-muted'
};

const SeverityBgColors = {
  critical: 'bg-danger/10 border-danger/30 hover:border-danger/60',
  high: 'bg-warning/10 border-warning/30 hover:border-warning/60',
  medium: 'bg-accent/10 border-accent/30 hover:border-accent/60',
  low: 'bg-text-muted/10 border-text-muted/30 hover:border-text-muted/60'
};

const CategoryColors = {
  seo: 'text-accent',
  geo: 'text-purple-400',
  brand: 'text-emerald-400'
};

interface AnnotationMarkerProps {
  recommendation: InlineRecommendation;
  onClick: () => void;
  isActive: boolean;
  index: number;
}

function AnnotationMarker({ recommendation, onClick, isActive, index }: AnnotationMarkerProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
        transition-all cursor-pointer ml-2 shrink-0
        ${isActive ? 'scale-110 ring-2 ring-offset-2 ring-offset-bg-card' : 'hover:scale-110'}
        ${SeverityColors[recommendation.issue.severity]}
      `}
      title={recommendation.title}
    >
      {index + 1}
    </button>
  );
}

interface CopyButtonProps {
  text: string;
  id: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

function CopyButton({ text, id, copiedId, onCopy }: CopyButtonProps) {
  const isCopied = copiedId === id;
  
  return (
    <button
      onClick={() => onCopy(text, id)}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
        transition-all
        ${isCopied 
          ? 'bg-success/20 text-success' 
          : 'bg-bg-card hover:bg-bg-card-hover text-text-secondary hover:text-text-primary'
        }
      `}
    >
      {isCopied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

interface DetailsPanelProps {
  recommendation: InlineRecommendation;
  onClose: () => void;
}

function DetailsPanel({ recommendation, onClose }: DetailsPanelProps) {
  const [showHtml, setShowHtml] = useState(false);
  const { copiedId, copy } = useCopyToClipboard();

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-bg-card border-l border-border shadow-2xl z-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 bg-bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${SeverityBgColors[recommendation.issue.severity]}`}>
            <IssueIcon type={recommendation.issue.type} />
          </div>
          <div>
            <span className={`text-xs font-medium ${CategoryColors[recommendation.category]}`}>
              {recommendation.category.toUpperCase()}
            </span>
            <h3 className="font-semibold">{recommendation.title}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Location */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-muted">Location:</span>
          <code className="px-2 py-1 bg-bg-secondary rounded text-accent font-mono text-xs">
            {recommendation.selector}
          </code>
          {recommendation.location.lineNumber && (
            <span className="text-text-muted">
              Line {recommendation.location.lineNumber}
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Issue</h4>
          <p className="text-text-primary">{recommendation.description}</p>
        </div>

        {/* Impact */}
        <div className="p-4 bg-bg-secondary rounded-lg border border-border">
          <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warning" />
            Impact
          </h4>
          <p className="text-sm text-text-primary">{recommendation.impact}</p>
        </div>

        {/* Current vs Suggested */}
        {recommendation.currentValue && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-danger">Current</h4>
              </div>
              <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg">
                <p className="text-sm font-mono text-text-primary whitespace-pre-wrap">
                  {recommendation.currentValue}
                </p>
              </div>
            </div>

            {recommendation.suggestedValue && (
              <div className="flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </div>
            )}

            {recommendation.suggestedValue && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-success">Suggested</h4>
                  <CopyButton 
                    text={recommendation.suggestedValue} 
                    id={`suggested-${recommendation.id}`}
                    copiedId={copiedId}
                    onCopy={copy}
                  />
                </div>
                <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                  <p className="text-sm font-mono text-text-primary whitespace-pre-wrap">
                    {recommendation.suggestedValue}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HTML Snippet */}
        {recommendation.htmlSnippet && (
          <div>
            <button
              onClick={() => setShowHtml(!showHtml)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Code className="w-4 h-4" />
              {showHtml ? 'Hide' : 'Show'} HTML Context
              <ChevronRight className={`w-4 h-4 transition-transform ${showHtml ? 'rotate-90' : ''}`} />
            </button>
            
            {showHtml && (
              <div className="mt-3">
                <div className="flex items-center justify-end mb-2">
                  <CopyButton 
                    text={recommendation.htmlSnippet} 
                    id={`html-${recommendation.id}`}
                    copiedId={copiedId}
                    onCopy={copy}
                  />
                </div>
                <pre className="p-4 bg-bg-primary rounded-lg border border-border overflow-x-auto">
                  <code className="text-xs font-mono text-text-secondary">
                    {recommendation.htmlSnippet}
                  </code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ElementRenderer({ 
  element, 
  recommendations,
  onSelectRecommendation,
  activeRecommendationId,
  recommendationIndex 
}: { 
  element: PageElement;
  recommendations: InlineRecommendation[];
  onSelectRecommendation: (id: string) => void;
  activeRecommendationId: string | null;
  recommendationIndex: Map<string, number>;
}) {
  const recommendation = element.recommendationId 
    ? recommendations.find(r => r.id === element.recommendationId)
    : null;
  
  const isActive = activeRecommendationId === element.recommendationId;
  const hasIssue = element.hasIssue && recommendation;
  const index = element.recommendationId ? recommendationIndex.get(element.recommendationId) ?? 0 : 0;

  const baseClasses = `
    relative transition-all rounded px-2 py-1 -mx-2
    ${hasIssue ? `border-l-2 ${SeverityBgColors[recommendation.issue.severity]} cursor-pointer` : ''}
    ${isActive ? 'ring-2 ring-accent' : ''}
  `;

  const handleClick = () => {
    if (element.recommendationId) {
      onSelectRecommendation(element.recommendationId);
    }
  };

  switch (element.type) {
    case 'h1':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{element.content}</h1>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    case 'h2':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-text-primary">{element.content}</h2>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    case 'h3':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-medium text-text-primary">{element.content}</h3>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    case 'p':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-text-secondary text-sm">{element.content}</p>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    case 'img':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <div className="w-16 h-12 bg-bg-primary rounded flex items-center justify-center border border-border">
                <Eye className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs">{element.content}</span>
            </div>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    case 'blockquote':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-start justify-between gap-2">
            <blockquote className="italic text-text-secondary border-l-2 border-text-muted pl-3 text-sm">
              {element.content}
            </blockquote>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    case 'a':
      return (
        <span className="text-accent text-sm hover:underline cursor-pointer">{element.content}</span>
      );
    case 'ul':
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-muted text-sm">{element.content}</span>
            {hasIssue && (
              <AnnotationMarker 
                recommendation={recommendation} 
                onClick={() => onSelectRecommendation(element.recommendationId!)}
                isActive={isActive}
                index={index}
              />
            )}
          </div>
        </div>
      );
    default:
      return <span>{element.content}</span>;
  }
}

interface MetaTagRowProps {
  label: string;
  value: string | undefined;
  htmlTag: string;
  recommendation?: InlineRecommendation;
  onSelect: (id: string) => void;
  isActive: boolean;
  index?: number;
}

function MetaTagRow({ label, value, htmlTag, recommendation, onSelect, isActive, index }: MetaTagRowProps) {
  const hasIssue = !!recommendation;
  
  return (
    <div 
      className={`
        p-2 rounded-lg transition-all
        ${hasIssue 
          ? `border-l-2 ${SeverityBgColors[recommendation.issue.severity]} cursor-pointer` 
          : 'hover:bg-bg-card'
        }
        ${isActive ? 'ring-2 ring-accent' : ''}
      `}
      onClick={() => recommendation && onSelect(recommendation.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-text-muted block mb-1">{label}</span>
          <code className="text-sm font-mono text-text-primary block truncate">
            <span className="text-purple-400">&lt;{htmlTag}</span>
            {value ? (
              <span className="text-text-secondary">&gt;{value}&lt;/{htmlTag}&gt;</span>
            ) : (
              <span className="text-danger"> — missing</span>
            )}
          </code>
        </div>
        {hasIssue && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recommendation.id);
            }}
            className={`
              inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
              transition-all shrink-0
              ${isActive ? 'scale-110 ring-2 ring-offset-2 ring-offset-bg-card' : 'hover:scale-110'}
              ${SeverityColors[recommendation.issue.severity]}
            `}
          >
            {(index ?? 0) + 1}
          </button>
        )}
      </div>
    </div>
  );
}

interface SchemaAnalysisProps {
  schemas: string[] | undefined;
  recommendation?: InlineRecommendation;
  onSelect: (id: string) => void;
  isActive: boolean;
  index?: number;
}

function SchemaAnalysis({ schemas, recommendation, onSelect, isActive, index }: SchemaAnalysisProps) {
  const hasSchemas = schemas && schemas.length > 0;
  const hasIssue = !!recommendation;

  return (
    <div 
      className={`
        p-3 rounded-lg border transition-all
        ${hasIssue 
          ? `border-l-2 ${SeverityBgColors[recommendation.issue.severity]} cursor-pointer` 
          : 'border-border bg-bg-secondary'
        }
        ${isActive ? 'ring-2 ring-accent' : ''}
      `}
      onClick={() => recommendation && onSelect(recommendation.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Database className="w-3 h-3" />
          <span>Structured Data (Schema.org)</span>
        </div>
        {hasIssue && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recommendation.id);
            }}
            className={`
              inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
              transition-all shrink-0
              ${isActive ? 'scale-110 ring-2 ring-offset-2 ring-offset-bg-card' : 'hover:scale-110'}
              ${SeverityColors[recommendation.issue.severity]}
            `}
          >
            {(index ?? 0) + 1}
          </button>
        )}
      </div>
      
      {hasSchemas ? (
        <div className="flex flex-wrap gap-2">
          {schemas.map((schema, i) => (
            <span key={i} className="px-2 py-1 bg-success/10 text-success text-xs rounded-full border border-success/20">
              {schema}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-danger">
          <FileWarning className="w-4 h-4" />
          <span>No structured data detected</span>
        </div>
      )}
    </div>
  );
}

export function ContentAnalysisPanel({ pageContent, recommendations }: ContentAnalysisPanelProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  
  const activeRecommendation = selectedRecommendation 
    ? recommendations.find(r => r.id === selectedRecommendation)
    : null;

  // Create index map for numbered markers
  const recommendationIndex = new Map<string, number>();
  recommendations.forEach((r, i) => recommendationIndex.set(r.id, i));

  const issueCount = recommendations.length;
  const criticalCount = recommendations.filter(r => r.issue.severity === 'critical').length;

  // Find meta-related recommendations
  const titleRec = recommendations.find(r => r.elementType === 'title');
  const metaDescRec = recommendations.find(r => r.elementType === 'meta' && r.selector.includes('description'));
  const schemaRec = recommendations.find(r => r.elementType === 'schema');

  return (
    <>
      <div className="card p-6 animate-fade-in stagger-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Content Analysis</h3>
              <p className="text-sm text-text-muted">Inline recommendations for your page</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-danger/20 text-danger rounded-full font-medium">
                {criticalCount} critical
              </span>
              <span className="px-2 py-1 bg-bg-secondary text-text-secondary rounded-full">
                {issueCount} total issues
              </span>
            </div>
          </div>
        </div>

        {/* Page Preview */}
        <div className="bg-bg-primary rounded-xl border border-border overflow-hidden">
          {/* Browser Chrome */}
          <div className="bg-bg-secondary px-4 py-2 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger/60"></div>
              <div className="w-3 h-3 rounded-full bg-warning/60"></div>
              <div className="w-3 h-3 rounded-full bg-success/60"></div>
            </div>
            <div className="flex-1 ml-4">
              <div className="bg-bg-card px-3 py-1 rounded text-xs text-text-muted font-mono max-w-md">
                {pageContent.url || 'example.com'}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {/* Document Head Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Code className="w-3 h-3" />
                <span className="font-medium">Document Head</span>
              </div>
              
              <div className="space-y-2 bg-bg-secondary p-3 rounded-lg border border-border">
                <MetaTagRow 
                  label="Title Tag"
                  value={pageContent.title}
                  htmlTag="title"
                  recommendation={titleRec}
                  onSelect={setSelectedRecommendation}
                  isActive={selectedRecommendation === titleRec?.id}
                  index={titleRec ? recommendationIndex.get(titleRec.id) : undefined}
                />
                
                <MetaTagRow 
                  label="Meta Description"
                  value={pageContent.metaDescription}
                  htmlTag="meta name=&quot;description&quot;"
                  recommendation={metaDescRec}
                  onSelect={setSelectedRecommendation}
                  isActive={selectedRecommendation === metaDescRec?.id}
                  index={metaDescRec ? recommendationIndex.get(metaDescRec.id) : undefined}
                />

                <SchemaAnalysis 
                  schemas={pageContent.schemaMarkup}
                  recommendation={schemaRec}
                  onSelect={setSelectedRecommendation}
                  isActive={selectedRecommendation === schemaRec?.id}
                  index={schemaRec ? recommendationIndex.get(schemaRec.id) : undefined}
                />
              </div>
            </div>

            {/* Sections */}
            {pageContent.sections.map((section) => (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wide">
                  <div className="h-px flex-1 bg-border"></div>
                  <span>{section.type}</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                
                {section.type === 'header' ? (
                  <nav className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                    <span className="font-bold text-accent">
                      {section.brand || pageContent.brand || 'Brand'}
                    </span>
                    {section.elements.map((el) => (
                      <ElementRenderer
                        key={el.id}
                        element={el}
                        recommendations={recommendations}
                        onSelectRecommendation={setSelectedRecommendation}
                        activeRecommendationId={selectedRecommendation}
                        recommendationIndex={recommendationIndex}
                      />
                    ))}
                  </nav>
                ) : (
                  <div className="space-y-2 pl-2">
                    {section.elements.map((el) => (
                      <ElementRenderer
                        key={el.id}
                        element={el}
                        recommendations={recommendations}
                        onSelectRecommendation={setSelectedRecommendation}
                        activeRecommendationId={selectedRecommendation}
                        recommendationIndex={recommendationIndex}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-xs text-text-muted">
          <span className="font-medium">Issue Severity:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-danger text-white flex items-center justify-center text-[10px] font-bold">!</div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-warning text-bg-primary flex items-center justify-center text-[10px] font-bold">!</div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-accent text-bg-primary flex items-center justify-center text-[10px] font-bold">!</div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-text-muted text-white flex items-center justify-center text-[10px] font-bold">!</div>
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Details Slide-out Panel */}
      {activeRecommendation && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedRecommendation(null)}
          />
          <DetailsPanel 
            recommendation={activeRecommendation} 
            onClose={() => setSelectedRecommendation(null)} 
          />
        </>
      )}
    </>
  );
}
