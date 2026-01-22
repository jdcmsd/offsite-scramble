import type { AnalysisResult, InlineRecommendation, PageContent } from '../types';

export const mockAnalysisResult: AnalysisResult = {
  brand: 'TechFlow',
  url: 'https://techflow.io',
  analyzedAt: new Date().toISOString(),
  overallScore: 72,
  seoScore: 78,
  geoScore: 65,
  brandVisibilityScore: 74,
  seoMetrics: [
    {
      name: 'Meta Descriptions',
      score: 85,
      maxScore: 100,
      status: 'good',
      recommendation: 'Consider adding more unique descriptions to product pages'
    },
    {
      name: 'Header Structure',
      score: 92,
      maxScore: 100,
      status: 'good',
    },
    {
      name: 'Internal Linking',
      score: 58,
      maxScore: 100,
      status: 'warning',
      recommendation: 'Add more contextual internal links between related content'
    },
    {
      name: 'Page Speed',
      score: 71,
      maxScore: 100,
      status: 'warning',
      recommendation: 'Optimize images and implement lazy loading'
    },
    {
      name: 'Mobile Usability',
      score: 88,
      maxScore: 100,
      status: 'good',
    },
    {
      name: 'Schema Markup',
      score: 42,
      maxScore: 100,
      status: 'danger',
      recommendation: 'Implement structured data for products, reviews, and FAQ'
    }
  ],
  geoInsights: [
    {
      category: 'Content Structure',
      title: 'Clear, Factual Statements',
      description: 'Content uses clear, quotable statements that AI can easily extract and cite',
      impact: 'high',
      implemented: true
    },
    {
      category: 'Content Structure',
      title: 'FAQ Sections',
      description: 'Comprehensive FAQ sections that directly answer common questions',
      impact: 'high',
      implemented: false
    },
    {
      category: 'Authority Signals',
      title: 'Expert Attribution',
      description: 'Content attributed to named experts with credentials',
      impact: 'high',
      implemented: false
    },
    {
      category: 'Authority Signals',
      title: 'Citation-Worthy Statistics',
      description: 'Original research or data that AI systems can reference',
      impact: 'medium',
      implemented: true
    },
    {
      category: 'Technical',
      title: 'Semantic HTML',
      description: 'Proper use of semantic HTML elements for content hierarchy',
      impact: 'medium',
      implemented: true
    },
    {
      category: 'Technical',
      title: 'Entity Clarity',
      description: 'Clear identification of the brand as a distinct entity',
      impact: 'high',
      implemented: false
    }
  ],
  brandMentions: [
    {
      source: 'Query: "best project management tools for startups"',
      context: 'TechFlow is mentioned as a notable option for small teams...',
      sentiment: 'positive',
      aiPlatform: 'ChatGPT'
    },
    {
      source: 'Query: "TechFlow vs Asana comparison"',
      context: 'Detailed comparison highlighting key differences...',
      sentiment: 'neutral',
      aiPlatform: 'Perplexity'
    },
    {
      source: 'Query: "project management software reviews"',
      context: 'Not mentioned in top results',
      sentiment: 'negative',
      aiPlatform: 'Claude'
    },
    {
      source: 'Query: "team collaboration tools 2026"',
      context: 'TechFlow noted for innovative approach to async work...',
      sentiment: 'positive',
      aiPlatform: 'Gemini'
    }
  ],
  recommendations: [
    {
      id: '1',
      priority: 'critical',
      category: 'geo',
      title: 'Add Expert Author Attribution',
      description: 'AI systems prioritize content from recognized experts. Add author bios with credentials to key content pieces.',
      effort: 'quick-win'
    },
    {
      id: '2',
      priority: 'critical',
      category: 'seo',
      title: 'Implement Comprehensive Schema Markup',
      description: 'Add Product, Review, FAQ, and Organization schema to improve both traditional and AI search visibility.',
      effort: 'moderate'
    },
    {
      id: '3',
      priority: 'high',
      category: 'geo',
      title: 'Create Question-Answer Content Hubs',
      description: 'Structure content to directly answer common queries in your space. AI systems favor definitive, quotable answers.',
      effort: 'significant'
    },
    {
      id: '4',
      priority: 'high',
      category: 'brand',
      title: 'Build Comparison Content',
      description: 'Create fair, detailed comparison pages against competitors. AI often synthesizes these for brand queries.',
      effort: 'moderate'
    },
    {
      id: '5',
      priority: 'medium',
      category: 'seo',
      title: 'Enhance Internal Linking Strategy',
      description: 'Create topic clusters with strong internal linking to establish topical authority.',
      effort: 'moderate'
    },
    {
      id: '6',
      priority: 'medium',
      category: 'geo',
      title: 'Publish Original Research',
      description: 'AI systems cite unique data points. Conduct and publish original research in your domain.',
      effort: 'significant'
    }
  ]
};

export const mockPageContent: PageContent = {
  url: 'techflow.io',
  brand: 'TechFlow',
  title: 'TechFlow - Project Management for Modern Teams',
  metaDescription: 'TechFlow helps teams collaborate and ship faster.',
  sections: [
    {
      id: 'header',
      type: 'header',
      elements: [
        { id: 'nav-1', type: 'a', content: 'Features' },
        { id: 'nav-2', type: 'a', content: 'Pricing' },
        { id: 'nav-3', type: 'a', content: 'About' },
        { id: 'nav-4', type: 'a', content: 'Blog' },
      ]
    },
    {
      id: 'hero',
      type: 'hero',
      heading: 'Ship faster with TechFlow',
      elements: [
        { 
          id: 'hero-h1', 
          type: 'h1', 
          content: 'Ship faster with TechFlow',
          hasIssue: true,
          recommendationId: 'inline-1'
        },
        { 
          id: 'hero-p', 
          type: 'p', 
          content: 'The all-in-one project management platform for agile teams.',
          hasIssue: true,
          recommendationId: 'inline-2'
        },
        { 
          id: 'hero-img', 
          type: 'img', 
          content: 'Dashboard screenshot',
          attributes: { alt: 'dashboard' },
          hasIssue: true,
          recommendationId: 'inline-3'
        },
      ]
    },
    {
      id: 'features',
      type: 'features',
      heading: 'Features',
      elements: [
        { id: 'feat-h2', type: 'h2', content: 'Features' },
        { 
          id: 'feat-1', 
          type: 'h3', 
          content: 'Real-time Collaboration',
          hasIssue: true,
          recommendationId: 'inline-4'
        },
        { id: 'feat-1-p', type: 'p', content: 'Work together in real-time with your team, no matter where they are.' },
        { id: 'feat-2', type: 'h3', content: 'Smart Automation' },
        { id: 'feat-2-p', type: 'p', content: 'Automate repetitive tasks and focus on what matters.' },
        { id: 'feat-3', type: 'h3', content: 'Analytics Dashboard' },
        { 
          id: 'feat-3-p', 
          type: 'p', 
          content: 'Get insights into your team\'s productivity.',
          hasIssue: true,
          recommendationId: 'inline-5'
        },
      ]
    },
    {
      id: 'social-proof',
      type: 'testimonials',
      heading: 'What our customers say',
      elements: [
        { id: 'testimonial-h2', type: 'h2', content: 'What our customers say' },
        { 
          id: 'quote-1', 
          type: 'blockquote', 
          content: '"TechFlow changed how we work. Amazing tool!"',
          hasIssue: true,
          recommendationId: 'inline-6'
        },
        { id: 'quote-1-attr', type: 'p', content: '— Happy Customer' },
      ]
    },
    {
      id: 'cta',
      type: 'cta',
      heading: 'Ready to get started?',
      elements: [
        { id: 'cta-h2', type: 'h2', content: 'Ready to get started?' },
        { 
          id: 'cta-p', 
          type: 'p', 
          content: 'Join thousands of teams using TechFlow.',
          hasIssue: true,
          recommendationId: 'inline-7'
        },
      ]
    },
    {
      id: 'footer',
      type: 'footer',
      elements: [
        { id: 'footer-p', type: 'p', content: '© 2026 TechFlow Inc.' },
        { 
          id: 'footer-links', 
          type: 'ul', 
          content: 'Privacy | Terms | Contact',
          hasIssue: true,
          recommendationId: 'inline-8'
        },
      ]
    }
  ]
};

export const mockInlineRecommendations: InlineRecommendation[] = [
  {
    id: 'inline-1',
    elementType: 'heading',
    selector: 'h1.hero-title',
    location: { section: 'hero', lineNumber: 12 },
    issue: { type: 'improvement', severity: 'high' },
    currentValue: 'Ship faster with TechFlow',
    suggestedValue: 'TechFlow: The #1 Project Management Platform for Agile Teams | Ship 2x Faster',
    htmlSnippet: '<h1 class="hero-title">Ship faster with TechFlow</h1>',
    title: 'Enhance H1 for GEO visibility',
    description: 'Your H1 is too brief. AI systems prefer descriptive, entity-rich headlines that clearly state what the product is and its primary benefit.',
    impact: 'AI search engines use H1 content heavily for understanding page topic. A clearer, more descriptive H1 increases chances of being cited.',
    category: 'geo'
  },
  {
    id: 'inline-2',
    elementType: 'paragraph',
    selector: 'p.hero-subtitle',
    location: { section: 'hero', lineNumber: 15 },
    issue: { type: 'improvement', severity: 'medium' },
    currentValue: 'The all-in-one project management platform for agile teams.',
    suggestedValue: 'TechFlow is a project management platform that helps agile teams plan sprints, track progress, and collaborate in real-time. Used by over 10,000 teams worldwide.',
    htmlSnippet: '<p class="hero-subtitle">The all-in-one project management platform...</p>',
    title: 'Add specific, citable facts',
    description: 'Include concrete details that AI can cite: specific features, user numbers, or unique differentiators.',
    impact: 'AI systems look for factual, quotable statements. Vague marketing copy is rarely cited.',
    category: 'geo'
  },
  {
    id: 'inline-3',
    elementType: 'image',
    selector: 'img.hero-image',
    location: { section: 'hero', lineNumber: 18 },
    issue: { type: 'error', severity: 'critical' },
    currentValue: 'alt="dashboard"',
    suggestedValue: 'alt="TechFlow project management dashboard showing sprint board, team velocity chart, and task assignments"',
    htmlSnippet: '<img src="dashboard.png" alt="dashboard" />',
    title: 'Improve image alt text',
    description: 'Alt text is too generic. Describe the specific content and context of the image for both accessibility and SEO.',
    impact: 'Descriptive alt text helps search engines understand image content and improves accessibility scores.',
    category: 'seo'
  },
  {
    id: 'inline-4',
    elementType: 'heading',
    selector: 'h3.feature-title',
    location: { section: 'features', lineNumber: 34 },
    issue: { type: 'opportunity', severity: 'medium' },
    currentValue: 'Real-time Collaboration',
    suggestedValue: 'Real-time Collaboration: Edit Documents Together with Zero Lag',
    htmlSnippet: '<h3>Real-time Collaboration</h3>',
    title: 'Make feature headings more descriptive',
    description: 'Feature headings should explain the benefit, not just name the feature. This helps AI understand what your product actually does.',
    impact: 'More descriptive headings create better content hierarchy for AI extraction.',
    category: 'geo'
  },
  {
    id: 'inline-5',
    elementType: 'paragraph',
    selector: 'p.feature-description',
    location: { section: 'features', lineNumber: 45 },
    issue: { type: 'improvement', severity: 'high' },
    currentValue: "Get insights into your team's productivity.",
    suggestedValue: "TechFlow's analytics dashboard tracks 15+ productivity metrics including cycle time, sprint velocity, and team utilization. Teams using TechFlow analytics report 23% faster project completion.",
    htmlSnippet: '<p>Get insights into your team\'s productivity.</p>',
    title: 'Add statistics and specifics',
    description: 'Replace vague benefits with specific, measurable claims. AI systems prioritize content with original data and statistics.',
    impact: 'Content with specific numbers and research is 3x more likely to be cited by AI assistants.',
    category: 'geo'
  },
  {
    id: 'inline-6',
    elementType: 'paragraph',
    selector: 'blockquote.testimonial',
    location: { section: 'testimonials', lineNumber: 52 },
    issue: { type: 'error', severity: 'critical' },
    currentValue: '"TechFlow changed how we work. Amazing tool!" — Happy Customer',
    suggestedValue: '"TechFlow reduced our sprint planning time from 4 hours to 45 minutes. Our team velocity increased 40% in the first quarter." — Sarah Chen, VP of Engineering at Stripe',
    htmlSnippet: '<blockquote>"TechFlow changed how we work..."</blockquote>\n<p>— Happy Customer</p>',
    title: 'Add credible attribution to testimonials',
    description: 'Anonymous testimonials have no authority. Use real names, titles, and company names. Include specific outcomes, not vague praise.',
    impact: 'AI systems evaluate source credibility. Named experts from known companies significantly boost content authority.',
    category: 'brand'
  },
  {
    id: 'inline-7',
    elementType: 'paragraph',
    selector: 'p.cta-text',
    location: { section: 'cta', lineNumber: 61 },
    issue: { type: 'missing', severity: 'medium' },
    currentValue: 'Join thousands of teams using TechFlow.',
    suggestedValue: 'Join 10,000+ teams at companies like Shopify, Notion, and Linear who use TechFlow to ship faster. Start free—no credit card required.',
    htmlSnippet: '<p>Join thousands of teams using TechFlow.</p>',
    title: 'Quantify and add social proof',
    description: 'Replace vague claims with specific numbers and named customers. This builds credibility for both users and AI systems.',
    impact: 'Specific social proof (named companies, exact numbers) increases conversion and AI citation likelihood.',
    category: 'brand'
  },
  {
    id: 'inline-8',
    elementType: 'schema',
    selector: 'footer',
    location: { section: 'footer', lineNumber: 72 },
    issue: { type: 'missing', severity: 'critical' },
    currentValue: undefined,
    suggestedValue: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "TechFlow",\n  "url": "https://techflow.io",\n  "logo": "https://techflow.io/logo.png",\n  "sameAs": [...]\n}',
    htmlSnippet: '<!-- No Organization schema found -->',
    title: 'Add Organization schema markup',
    description: 'No structured data found. Add Organization, Product, and FAQ schema to help search engines and AI systems understand your brand entity.',
    impact: 'Schema markup is essential for entity recognition. Without it, AI systems may not correctly identify your brand.',
    category: 'seo'
  }
];

