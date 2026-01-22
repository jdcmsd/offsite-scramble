import type { AnalysisResult, InlineRecommendation, PageContent } from '../types';

const API_BASE = 'http://localhost:3001';

export interface FullAnalysisResult extends AnalysisResult {
  inlineRecommendations: InlineRecommendation[];
  pageContent: PageContent;
}

export interface AnalysisError {
  error: string;
  message?: string;
}

/**
 * Analyze a URL for SEO/GEO insights
 */
export async function analyzeUrl(url: string, brand: string): Promise<FullAnalysisResult> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, brand }),
  });

  if (!response.ok) {
    const error: AnalysisError = await response.json();
    throw new Error(error.message || error.error || 'Analysis failed');
  }

  return response.json();
}

/**
 * Check if the API server is running
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}


