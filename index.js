const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Example URL: /pick/bronze33/silver33/gold34
app.get('/pick/:prizes', (req, res) => {
  const input = req.params.prizes;

  // Parse input like bronze33/silver33/gold34
  const prizes = input.split('/').map(p => {
    const match = p.match(/([a-zA-Z]+)(\d+)%?/);
    if (!match) return null;
    return { name: match[1], prob: parseFloat(match[2]) };
  }).filter(Boolean);

  const total = prizes.reduce((sum, p) => sum + p.prob, 0);
  if (Math.abs(total - 100) > 0.01) {
    return res.status(400).json({ error: 'Percentages must total 100' });
  }

  const rand = Math.random() * total;
  let cumulative = 0;
  let winner = null;

  for (const prize of prizes) {
    cumulative += prize.prob;
    if (rand < cumulative) {
      winner = prize.name;
      break;
    }
  }

  res.json({ winner });
});

app.listen(PORT, () => console.log(`🎯 API running on port ${PORT}`));
