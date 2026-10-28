// Optional local preview: node serve.cjs (no packages required).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
http.createServer((req, res) => {
  let filename;
  try { filename = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Invalid URL'); return; }
  const file = path.resolve(root, '.' + (filename === '/' ? '/index.html' : filename));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'})[path.extname(file)] || 'text/plain; charset=utf-8');
    res.end(content);
  });
}).listen(8123, '127.0.0.1', () => console.log('Bakery preview: http://127.0.0.1:8123'));
