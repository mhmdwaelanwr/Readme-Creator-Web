const express = require('express');
const compression = require('compression');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Enable gzip compression for better performance
app.use(compression());

// Serve static files from root (for landing page and general assets)
app.use(express.static(__dirname, {
    setHeaders: (res, filePath, stat) => {
        if (filePath.endsWith('index.html')) {
            // Never cache HTML files
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
            // Cache other static assets for a long time (1 year)
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Serve Flutter app assets only under /app
app.use('/app', express.static(__dirname));

// Main Landing Page (index.html is now landing)
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Redirect /releases to root
app.get('/releases', (req, res) => {
    res.redirect('/');
});

// Flutter App Entry Point
app.get(['/app', '/app/'], (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app.html'));
});

// Flutter App SPA Fallback (handle internal routes)
app.get('/app/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app.html'));
});

// Catch-all: Redirect unknown top-level routes to landing page
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
