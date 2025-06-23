// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/blocks', (req, res) => {
  res.json([
    { id: 'blockA', label: 'block A', color: '#a0e8af' },
    { id: 'blockB', label: 'block B', color: '#f9e076' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
