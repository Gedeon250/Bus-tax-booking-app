const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes would go here
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// All other routes should serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
