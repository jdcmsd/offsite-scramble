import http from 'http';
import https from 'https';
import { analyzeContent } from './analyzer.js';

const PORT = 3001;

/**
 * Fetch URL content
 * @param {string} url 
 * @returns {Promise<string>}
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OffsiteScrambleBot/1.0; +https://offsite-scramble.io)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    };

    const req = protocol.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        fetchUrl(redirectUrl).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Parse request body
 * @param {http.IncomingMessage} req 
 * @returns {Promise<object>}
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 * @param {http.ServerResponse} res 
 * @param {number} status 
 * @param {object} data 
 */
function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

/**
 * Request handler
 */
async function handleRequest(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  // Analyze endpoint
  if (req.method === 'POST' && req.url === '/api/analyze') {
    try {
      const { url, brand } = await parseBody(req);

      if (!url || !brand) {
        sendJson(res, 400, { error: 'Missing url or brand parameter' });
        return;
      }

      // Validate URL
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        sendJson(res, 400, { error: 'Invalid URL format' });
        return;
      }

      console.log(`Analyzing: ${url} for brand: ${brand}`);

      // Fetch the page
      const html = await fetchUrl(url);
      
      // Analyze content
      const analysis = analyzeContent(html, url, brand);

      console.log(`Analysis complete: ${url} - Overall score: ${analysis.overallScore}`);

      sendJson(res, 200, analysis);

    } catch (error) {
      console.error('Analysis error:', error.message);
      sendJson(res, 500, { 
        error: 'Failed to analyze URL', 
        message: error.message 
      });
    }
    return;
  }

  // 404 for unknown routes
  sendJson(res, 404, { error: 'Not found' });
}

// Create server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🚀 Offsite Scramble API Server                 ║
║                                                  ║
║   Running on: http://localhost:${PORT}              ║
║                                                  ║
║   Endpoints:                                     ║
║   • GET  /health       - Health check            ║
║   • POST /api/analyze  - Analyze URL             ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});
