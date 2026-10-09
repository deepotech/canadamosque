const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'toronto', 'published.json');
const d = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const cities = [...new Set(d.map(m => m.address.city))].sort();
console.log('CITIES:', JSON.stringify(cities, null, 2));

const r = {};
d.forEach(m => {
  if (!r[m.address.city]) r[m.address.city] = { total: 0, types: {} };
  r[m.address.city].total++;
  const c = m.classification || 'unknown';
  r[m.address.city].types[c] = (r[m.address.city].types[c] || 0) + 1;
});
console.log('STATS:', JSON.stringify(r, null, 2));
