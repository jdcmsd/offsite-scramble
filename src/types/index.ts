export interface SEOMetric {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'danger';
  recommendation?: string;
}

export interface GEOInsight {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implemented: boolean;
}

export interface BrandMention {
  source: string;
  context: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  aiPlatform: string;
}

export interface AnalysisResult {
  brand: string;
  url: string;
  analyzedAt: string;
  overallScore: number;
  seoScore: number;
  geoScore: number;
  brandVisibilityScore: number;
  seoMetrics: SEOMetric[];
  geoInsights: GEOInsight[];
  brandMentions: BrandMention[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'seo' | 'geo' | 'brand';
  title: string;
  description: string;
  effort: 'quick-win' | 'moderate' | 'significant';
}

export interface InlineRecommendation {
  id: string;
  elementType: 'title' | 'meta' | 'heading' | 'paragraph' | 'image' | 'link' | 'schema' | 'nav';
  selector: string; // CSS selector or description of the element
  location: {
    section: string; // e.g., "header", "hero", "content", "footer"
    lineNumber?: number;
  };
  issue: {
    type: 'missing' | 'improvement' | 'error' | 'opportunity';
    severity: 'critical' | 'high' | 'medium' | 'low';
  };
  currentValue?: string;
  suggestedValue?: string;
  htmlSnippet?: string;
  title: string;
  description: string;
  impact: string;
  category: 'seo' | 'geo' | 'brand';
}

export interface PageContent {
  url?: string;
  brand?: string;
  title: string;
  metaDescription?: string;
  sections: PageSection[];
  schemaMarkup?: string[];
}

export interface PageSection {
  id: string;
  type: 'header' | 'hero' | 'content' | 'features' | 'testimonials' | 'cta' | 'footer';
  heading?: string;
  content?: string;
  brand?: string;
  elements: PageElement[];
}

export interface PageElement {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'p' | 'img' | 'a' | 'ul' | 'blockquote';
  content: string;
  attributes?: Record<string, string>;
  hasIssue?: boolean;
  recommendationId?: string;
}

