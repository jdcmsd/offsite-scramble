/**
 * HTML Page Analyzer for SEO/GEO insights
 */

/**
 * Parse HTML and extract page structure
 * @param {string} html 
 * @param {string} url 
 * @returns {object}
 */
function parseHTML(html, url) {
  // Simple regex-based parsing (production would use a proper DOM parser)
  const getMatch = (regex) => {
    const match = html.match(regex);
    return match ? match[1]?.trim() : null;
  };

  const getAllMatches = (regex) => {
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push(match[1]?.trim());
    }
    return matches;
  };

  // Extract basic meta info
  const title = getMatch(/<title[^>]*>([^<]+)<\/title>/i) || '';
  const metaDescription = getMatch(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          getMatch(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) || '';
  
  // Extract headings
  const h1s = getAllMatches(/<h1[^>]*>([^<]+)<\/h1>/gi);
  const h2s = getAllMatches(/<h2[^>]*>([^<]+)<\/h2>/gi);
  const h3s = getAllMatches(/<h3[^>]*>([^<]+)<\/h3>/gi);

  // Extract images and their alt texts
  const imgRegex = /<img[^>]*>/gi;
  const images = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const imgTag = imgMatch[0];
    const alt = imgTag.match(/alt=["']([^"']*)["']/i)?.[1] || '';
    const src = imgTag.match(/src=["']([^"']+)["']/i)?.[1] || '';
    images.push({ alt, src, hasAlt: alt.length > 0 });
  }

  // Extract links
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  const links = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    links.push({ href: linkMatch[1], text: linkMatch[2] });
  }

  // Check for schema markup
  const schemaScripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const schemas = [];
  schemaScripts.forEach(script => {
    try {
      const jsonContent = script.replace(/<script[^>]*>|<\/script>/gi, '');
      const parsed = JSON.parse(jsonContent);
      if (parsed['@type']) {
        schemas.push(parsed['@type']);
      } else if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          if (item['@type']) schemas.push(item['@type']);
        });
      }
    } catch (e) {
      // Invalid JSON in schema
    }
  });

  // Extract paragraphs (first few for analysis)
  const paragraphs = getAllMatches(/<p[^>]*>([^<]+)<\/p>/gi).slice(0, 10);

  // Check for FAQ sections
  const hasFAQ = /faq|frequently asked|questions/i.test(html);

  // Check for author attribution
  const hasAuthor = /author|written by|posted by/i.test(html);

  // Extract canonical URL
  const canonical = getMatch(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);

  // Extract Open Graph tags
  const ogTitle = getMatch(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const ogDescription = getMatch(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

  return {
    url,
    title,
    metaDescription,
    h1s,
    h2s,
    h3s,
    images,
    links,
    schemas,
    paragraphs,
    hasFAQ,
    hasAuthor,
    canonical,
    ogTitle,
    ogDescription,
    htmlLength: html.length
  };
}

/**
 * Generate SEO metrics based on parsed content
 * @param {object} parsed 
 * @returns {object[]}
 */
function generateSEOMetrics(parsed) {
  const metrics = [];

  // Title tag analysis
  let titleScore = 0;
  if (parsed.title) {
    titleScore = 50;
    if (parsed.title.length >= 30 && parsed.title.length <= 60) titleScore += 30;
    else if (parsed.title.length > 0) titleScore += 15;
    if (parsed.title.length > 10) titleScore += 20;
  }
  metrics.push({
    name: 'Title Tag',
    score: titleScore,
    maxScore: 100,
    status: titleScore >= 80 ? 'good' : titleScore >= 50 ? 'warning' : 'danger',
    recommendation: titleScore < 80 ? 'Optimize title tag to be 30-60 characters with primary keyword' : undefined
  });

  // Meta description
  let metaScore = 0;
  if (parsed.metaDescription) {
    metaScore = 50;
    if (parsed.metaDescription.length >= 120 && parsed.metaDescription.length <= 160) metaScore += 35;
    else if (parsed.metaDescription.length > 50) metaScore += 20;
    if (parsed.metaDescription.length > 0) metaScore += 15;
  }
  metrics.push({
    name: 'Meta Description',
    score: metaScore,
    maxScore: 100,
    status: metaScore >= 80 ? 'good' : metaScore >= 50 ? 'warning' : 'danger',
    recommendation: metaScore < 80 ? 'Add a compelling meta description (120-160 characters)' : undefined
  });

  // Header structure
  let headerScore = 0;
  if (parsed.h1s.length === 1) headerScore += 40;
  else if (parsed.h1s.length > 0) headerScore += 20;
  if (parsed.h2s.length > 0) headerScore += 30;
  if (parsed.h3s.length > 0) headerScore += 20;
  if (parsed.h1s.length <= 1) headerScore += 10;
  metrics.push({
    name: 'Header Structure',
    score: headerScore,
    maxScore: 100,
    status: headerScore >= 80 ? 'good' : headerScore >= 50 ? 'warning' : 'danger',
    recommendation: headerScore < 80 ? 'Ensure single H1 and logical H2/H3 hierarchy' : undefined
  });

  // Image optimization
  const imagesWithAlt = parsed.images.filter(img => img.hasAlt && img.alt.length > 5).length;
  const totalImages = parsed.images.length;
  let imageScore = totalImages === 0 ? 70 : Math.round((imagesWithAlt / totalImages) * 100);
  metrics.push({
    name: 'Image Optimization',
    score: imageScore,
    maxScore: 100,
    status: imageScore >= 80 ? 'good' : imageScore >= 50 ? 'warning' : 'danger',
    recommendation: imageScore < 80 ? `Add descriptive alt text to ${totalImages - imagesWithAlt} images` : undefined
  });

  // Internal linking
  const internalLinks = parsed.links.filter(l => {
    try {
      const linkUrl = new URL(l.href, parsed.url);
      const pageUrl = new URL(parsed.url);
      return linkUrl.hostname === pageUrl.hostname;
    } catch {
      return l.href.startsWith('/') || l.href.startsWith('#');
    }
  }).length;
  let linkScore = Math.min(100, internalLinks * 10);
  metrics.push({
    name: 'Internal Linking',
    score: linkScore,
    maxScore: 100,
    status: linkScore >= 80 ? 'good' : linkScore >= 50 ? 'warning' : 'danger',
    recommendation: linkScore < 80 ? 'Add more internal links to related content' : undefined
  });

  // Schema markup
  let schemaScore = parsed.schemas.length > 0 ? 60 : 0;
  if (parsed.schemas.includes('Organization')) schemaScore += 20;
  if (parsed.schemas.includes('WebSite')) schemaScore += 10;
  if (parsed.schemas.includes('Article') || parsed.schemas.includes('Product')) schemaScore += 10;
  schemaScore = Math.min(100, schemaScore);
  metrics.push({
    name: 'Schema Markup',
    score: schemaScore,
    maxScore: 100,
    status: schemaScore >= 80 ? 'good' : schemaScore >= 50 ? 'warning' : 'danger',
    recommendation: schemaScore < 80 ? 'Add structured data (Organization, Product, FAQ schema)' : undefined
  });

  return metrics;
}

/**
 * Generate GEO insights based on parsed content
 * @param {object} parsed 
 * @returns {object[]}
 */
function generateGEOInsights(parsed) {
  return [
    {
      category: 'Content Structure',
      title: 'Clear, Factual Statements',
      description: 'Content uses clear, quotable statements that AI can easily extract and cite',
      impact: 'high',
      implemented: parsed.paragraphs.some(p => p.length > 50 && !/[?!]$/.test(p))
    },
    {
      category: 'Content Structure',
      title: 'FAQ Sections',
      description: 'Comprehensive FAQ sections that directly answer common questions',
      impact: 'high',
      implemented: parsed.hasFAQ
    },
    {
      category: 'Authority Signals',
      title: 'Expert Attribution',
      description: 'Content attributed to named experts with credentials',
      impact: 'high',
      implemented: parsed.hasAuthor
    },
    {
      category: 'Authority Signals',
      title: 'Citation-Worthy Statistics',
      description: 'Original research or data that AI systems can reference',
      impact: 'medium',
      implemented: parsed.paragraphs.some(p => /\d+%|\d+\s*(million|billion|thousand)/i.test(p))
    },
    {
      category: 'Technical',
      title: 'Semantic HTML',
      description: 'Proper use of semantic HTML elements for content hierarchy',
      impact: 'medium',
      implemented: parsed.h1s.length > 0 && parsed.h2s.length > 0
    },
    {
      category: 'Technical',
      title: 'Entity Clarity',
      description: 'Clear identification of the brand as a distinct entity',
      impact: 'high',
      implemented: parsed.schemas.includes('Organization') || parsed.schemas.includes('WebSite')
    }
  ];
}

/**
 * Generate inline recommendations
 * @param {object} parsed 
 * @returns {object[]}
 */
function generateInlineRecommendations(parsed) {
  const recommendations = [];
  let id = 1;

  // Title analysis
  if (!parsed.title || parsed.title.length < 30) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'title',
      selector: 'title',
      location: { section: 'head', lineNumber: 5 },
      issue: { type: parsed.title ? 'improvement' : 'missing', severity: 'critical' },
      currentValue: parsed.title || '(missing)',
      suggestedValue: `${parsed.title || 'Brand Name'} | Primary Keyword - Compelling Value Proposition`,
      htmlSnippet: `<title>${parsed.title || ''}</title>`,
      title: 'Enhance Title Tag',
      description: 'Title tag is missing or too short. A good title should be 30-60 characters and include your brand and primary keyword.',
      impact: 'Title tags are critical for both SEO and AI understanding. AI systems often use titles to categorize and describe content.',
      category: 'seo'
    });
  }

  // Meta description analysis
  if (!parsed.metaDescription || parsed.metaDescription.length < 100) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'meta',
      selector: 'meta[name="description"]',
      location: { section: 'head', lineNumber: 6 },
      issue: { type: parsed.metaDescription ? 'improvement' : 'missing', severity: 'high' },
      currentValue: parsed.metaDescription || '(missing)',
      suggestedValue: 'Write a compelling 120-160 character description that includes your primary keyword and a clear value proposition. Include specific benefits and a call to action.',
      htmlSnippet: `<meta name="description" content="${parsed.metaDescription || ''}" />`,
      title: 'Optimize Meta Description',
      description: 'Meta description is missing or too short. It should be 120-160 characters with a clear value proposition.',
      impact: 'Meta descriptions influence click-through rates and help AI understand page purpose.',
      category: 'seo'
    });
  }

  // H1 analysis
  if (parsed.h1s.length === 0) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'heading',
      selector: 'h1',
      location: { section: 'hero', lineNumber: 20 },
      issue: { type: 'missing', severity: 'critical' },
      currentValue: '(no H1 found)',
      suggestedValue: 'Add a clear, descriptive H1 that states what the page is about',
      htmlSnippet: '<!-- No H1 tag found -->',
      title: 'Add H1 Heading',
      description: 'Page is missing an H1 heading. Every page should have exactly one H1 that clearly describes the main topic.',
      impact: 'H1 is the most important heading for SEO and AI content understanding.',
      category: 'seo'
    });
  } else if (parsed.h1s[0] && parsed.h1s[0].length < 20) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'heading',
      selector: 'h1',
      location: { section: 'hero', lineNumber: 20 },
      issue: { type: 'improvement', severity: 'high' },
      currentValue: parsed.h1s[0],
      suggestedValue: `${parsed.h1s[0]}: Add More Descriptive Context Here`,
      htmlSnippet: `<h1>${parsed.h1s[0]}</h1>`,
      title: 'Enhance H1 for GEO visibility',
      description: 'Your H1 is too brief. AI systems prefer descriptive, entity-rich headlines that clearly state what the product/page is about.',
      impact: 'AI search engines use H1 content heavily for understanding page topic. A clearer, more descriptive H1 increases chances of being cited.',
      category: 'geo'
    });
  }

  // Schema markup analysis
  if (parsed.schemas.length === 0) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'schema',
      selector: 'script[type="application/ld+json"]',
      location: { section: 'head', lineNumber: 10 },
      issue: { type: 'missing', severity: 'critical' },
      currentValue: undefined,
      suggestedValue: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Brand",
  "url": "${parsed.url}",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://twitter.com/...", "https://linkedin.com/..."]
}`,
      htmlSnippet: '<!-- No structured data found -->',
      title: 'Add Organization Schema Markup',
      description: 'No structured data found. Add Organization, Product, and FAQ schema to help search engines and AI systems understand your brand entity.',
      impact: 'Schema markup is essential for entity recognition. Without it, AI systems may not correctly identify your brand.',
      category: 'seo'
    });
  }

  // Image alt text analysis
  const badImages = parsed.images.filter(img => !img.hasAlt || img.alt.length < 10);
  if (badImages.length > 0) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'image',
      selector: 'img',
      location: { section: 'content', lineNumber: 45 },
      issue: { type: 'error', severity: 'high' },
      currentValue: `${badImages.length} images with missing or poor alt text`,
      suggestedValue: 'Add descriptive alt text that explains the image content and context. Example: "TechFlow dashboard showing sprint board with 5 active tasks and team velocity chart"',
      htmlSnippet: badImages[0] ? `<img src="${badImages[0].src}" alt="${badImages[0].alt || ''}" />` : '<img src="..." alt="" />',
      title: 'Improve Image Alt Text',
      description: `${badImages.length} images are missing or have inadequate alt text. Describe what's in each image for accessibility and SEO.`,
      impact: 'Descriptive alt text helps search engines understand image content and improves accessibility scores.',
      category: 'seo'
    });
  }

  // FAQ section check
  if (!parsed.hasFAQ) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'paragraph',
      selector: 'section.faq',
      location: { section: 'content', lineNumber: 100 },
      issue: { type: 'opportunity', severity: 'medium' },
      currentValue: '(no FAQ section found)',
      suggestedValue: 'Add a FAQ section with common questions and clear, direct answers. Structure with FAQ schema markup for rich results.',
      htmlSnippet: '<!-- Consider adding:\n<section itemscope itemtype="https://schema.org/FAQPage">\n  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n    <h3 itemprop="name">What is [Product]?</h3>\n    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n      <p itemprop="text">Answer here...</p>\n    </div>\n  </div>\n</section> -->',
      title: 'Add FAQ Section',
      description: 'No FAQ section detected. FAQ pages are highly valued by AI systems because they provide direct answers to common questions.',
      impact: 'AI assistants frequently pull from FAQ content when answering user queries about products and services.',
      category: 'geo'
    });
  }

  // Author attribution check
  if (!parsed.hasAuthor) {
    recommendations.push({
      id: `inline-${id++}`,
      elementType: 'paragraph',
      selector: '.author-bio',
      location: { section: 'content', lineNumber: 150 },
      issue: { type: 'opportunity', severity: 'high' },
      currentValue: '(no author attribution found)',
      suggestedValue: 'Add author bios with names, credentials, and links to author pages. Example: "Written by Jane Smith, VP of Product at TechFlow with 10+ years in SaaS"',
      htmlSnippet: '<!-- Add author markup:\n<div itemscope itemtype="https://schema.org/Person">\n  <span itemprop="name">Author Name</span>\n  <span itemprop="jobTitle">Title</span>\n</div> -->',
      title: 'Add Expert Author Attribution',
      description: 'No author attribution found. AI systems prioritize content from recognized experts.',
      impact: 'Content with named, credentialed authors is considered more authoritative by AI systems.',
      category: 'geo'
    });
  }

  return recommendations;
}

/**
 * Generate page content structure
 * @param {object} parsed 
 * @param {object[]} recommendations 
 * @param {string} brand
 * @returns {object}
 */
function generatePageContent(parsed, recommendations, brand) {
  const sections = [];
  
  // Extract nav links from parsed content if available
  const navLinks = parsed.links
    .filter(l => l.text && l.text.length < 20)
    .slice(0, 4)
    .map((l, i) => ({ id: `nav-${i}`, type: 'a', content: l.text }));

  // Header section
  sections.push({
    id: 'header',
    type: 'header',
    brand: brand,
    elements: navLinks.length > 0 ? navLinks : [
      { id: 'nav-1', type: 'a', content: 'Home' },
      { id: 'nav-2', type: 'a', content: 'About' },
      { id: 'nav-3', type: 'a', content: 'Contact' },
    ]
  });

  // Hero section with H1
  const heroElements = [];
  if (parsed.h1s[0]) {
    const h1Rec = recommendations.find(r => r.elementType === 'heading' && r.selector === 'h1');
    heroElements.push({
      id: 'hero-h1',
      type: 'h1',
      content: parsed.h1s[0],
      hasIssue: !!h1Rec,
      recommendationId: h1Rec?.id
    });
  }
  
  // Add first paragraph if exists
  if (parsed.paragraphs[0]) {
    heroElements.push({
      id: 'hero-p',
      type: 'p',
      content: parsed.paragraphs[0].substring(0, 150) + (parsed.paragraphs[0].length > 150 ? '...' : '')
    });
  }

  // Add hero image if exists
  if (parsed.images[0]) {
    const imgRec = recommendations.find(r => r.elementType === 'image');
    heroElements.push({
      id: 'hero-img',
      type: 'img',
      content: parsed.images[0].alt || 'Image',
      attributes: { alt: parsed.images[0].alt || '' },
      hasIssue: !!imgRec,
      recommendationId: imgRec?.id
    });
  }

  sections.push({
    id: 'hero',
    type: 'hero',
    heading: parsed.h1s[0] || 'Hero Section',
    elements: heroElements
  });

  // Features/Content section with H2s
  if (parsed.h2s.length > 0) {
    const featureElements = [];
    featureElements.push({
      id: 'feat-h2',
      type: 'h2',
      content: parsed.h2s[0] || 'Features'
    });
    
    parsed.h3s.slice(0, 3).forEach((h3, i) => {
      featureElements.push({
        id: `feat-${i}`,
        type: 'h3',
        content: h3
      });
    });

    parsed.paragraphs.slice(1, 4).forEach((p, i) => {
      featureElements.push({
        id: `feat-p-${i}`,
        type: 'p',
        content: p.substring(0, 100) + (p.length > 100 ? '...' : '')
      });
    });

    sections.push({
      id: 'features',
      type: 'features',
      heading: 'Features',
      elements: featureElements
    });
  }

  // CTA section
  const ctaElements = [];
  const ctaRec = recommendations.find(r => r.elementType === 'paragraph' && r.title.includes('FAQ'));
  ctaElements.push({
    id: 'cta-h2',
    type: 'h2',
    content: 'Get Started Today'
  });
  ctaElements.push({
    id: 'cta-p',
    type: 'p',
    content: 'Join thousands of users',
    hasIssue: !!ctaRec,
    recommendationId: ctaRec?.id
  });

  sections.push({
    id: 'cta',
    type: 'cta',
    heading: 'Call to Action',
    elements: ctaElements
  });

  // Footer
  const footerRec = recommendations.find(r => r.elementType === 'schema');
  sections.push({
    id: 'footer',
    type: 'footer',
    elements: [
      { id: 'footer-p', type: 'p', content: `© 2026 ${brand}` },
      { 
        id: 'footer-links', 
        type: 'ul', 
        content: 'Privacy | Terms | Contact',
        hasIssue: !!footerRec,
        recommendationId: footerRec?.id
      }
    ]
  });

  return {
    url: parsed.url,
    brand: brand,
    title: parsed.title,
    metaDescription: parsed.metaDescription,
    sections,
    schemaMarkup: parsed.schemas.length > 0 ? parsed.schemas : undefined
  };
}

/**
 * Calculate overall scores
 * @param {object[]} seoMetrics 
 * @param {object[]} geoInsights 
 * @returns {object}
 */
function calculateScores(seoMetrics, geoInsights) {
  const seoScore = Math.round(
    seoMetrics.reduce((sum, m) => sum + m.score, 0) / seoMetrics.length
  );

  const implementedCount = geoInsights.filter(g => g.implemented).length;
  const geoScore = Math.round((implementedCount / geoInsights.length) * 100);

  // Brand visibility is a composite score
  const brandVisibilityScore = Math.round((seoScore * 0.4 + geoScore * 0.6));

  const overallScore = Math.round((seoScore + geoScore + brandVisibilityScore) / 3);

  return { overallScore, seoScore, geoScore, brandVisibilityScore };
}

/**
 * Generate general recommendations based on analysis
 * @param {object[]} seoMetrics 
 * @param {object[]} geoInsights 
 * @param {object[]} inlineRecs 
 * @returns {object[]}
 */
function generateRecommendations(seoMetrics, geoInsights, inlineRecs) {
  const recommendations = [];
  let id = 1;

  // From SEO metrics
  seoMetrics
    .filter(m => m.status !== 'good')
    .sort((a, b) => a.score - b.score)
    .forEach(m => {
      recommendations.push({
        id: String(id++),
        priority: m.status === 'danger' ? 'critical' : 'high',
        category: 'seo',
        title: `Improve ${m.name}`,
        description: m.recommendation || `Current score: ${m.score}/100. Needs improvement.`,
        effort: m.score < 30 ? 'significant' : 'moderate'
      });
    });

  // From GEO insights
  geoInsights
    .filter(g => !g.implemented)
    .forEach(g => {
      recommendations.push({
        id: String(id++),
        priority: g.impact === 'high' ? 'high' : 'medium',
        category: 'geo',
        title: `Implement: ${g.title}`,
        description: g.description,
        effort: g.impact === 'high' ? 'moderate' : 'quick-win'
      });
    });

  return recommendations.slice(0, 8);
}

/**
 * Main analysis function
 * @param {string} html 
 * @param {string} url 
 * @param {string} brand 
 * @returns {object}
 */
export function analyzeContent(html, url, brand) {
  const parsed = parseHTML(html, url);
  const seoMetrics = generateSEOMetrics(parsed);
  const geoInsights = generateGEOInsights(parsed);
  const inlineRecommendations = generateInlineRecommendations(parsed);
  const pageContent = generatePageContent(parsed, inlineRecommendations, brand);
  const scores = calculateScores(seoMetrics, geoInsights);
  const recommendations = generateRecommendations(seoMetrics, geoInsights, inlineRecommendations);

  // Mock brand mentions (would come from AI API in production)
  const brandMentions = [
    {
      source: `Query: "best ${brand.toLowerCase()} alternatives"`,
      context: `${brand} is mentioned as a leading option...`,
      sentiment: 'positive',
      aiPlatform: 'ChatGPT'
    },
    {
      source: `Query: "${brand.toLowerCase()} reviews"`,
      context: 'Detailed analysis of features and pricing...',
      sentiment: 'neutral',
      aiPlatform: 'Perplexity'
    },
    {
      source: `Query: "what is ${brand.toLowerCase()}"`,
      context: scores.geoScore > 60 ? `${brand} is described accurately...` : 'Limited information available',
      sentiment: scores.geoScore > 60 ? 'positive' : 'negative',
      aiPlatform: 'Claude'
    }
  ];

  return {
    brand,
    url,
    analyzedAt: new Date().toISOString(),
    ...scores,
    seoMetrics,
    geoInsights,
    brandMentions,
    recommendations,
    inlineRecommendations,
    pageContent
  };
}

export { parseHTML };
