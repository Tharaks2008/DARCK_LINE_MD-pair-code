const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const codes = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate pair code
app.post('/get-code', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes.set(code, { phone, expires: Date.now() + 3 * 60 * 1000 }); // 3 mins

  res.json({ pairCode: code });
});

// Verify code
app.post('/verify-code', (req, res) => {
  const { code } = req.body;
  const entry = codes.get(code);

if (!entry || entry.expires < Date.now()) {
    return res.status(400).json({ error: 'Code invalid or expired' });
  }

  res.json({ success: true, phone: entry.phone });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
