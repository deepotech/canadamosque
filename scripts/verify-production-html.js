const fs = require('fs');
const path = require('path');

const testPages = [
  { url: '/', file: '.next/server/app/index.html' },
  { url: '/provinces', file: '.next/server/app/provinces.html' },
  { url: '/provinces/ontario', file: '.next/server/app/provinces/ontario.html' },
  { url: '/cities/toronto', file: '.next/server/app/cities/toronto.html' },
  { url: '/cities/surrey', file: '.next/server/app/cities/surrey.html' },
  { url: '/mosques/toronto', file: '.next/server/app/mosques/toronto.html' },
  { url: '/mosque/birmingham-masjid-etobicoke', file: '.next/server/app/mosque/birmingham-masjid-etobicoke.html' },
  { url: '/mosque-near-me', file: '.next/server/app/mosque-near-me.html' }
];

testPages.forEach(({ url, file }) => {
  console.log('======================================================================');
  console.log(`PAGE: ${url}`);
  console.log(`FILE: ${file}`);
  if (!fs.existsSync(file)) {
    console.log(`FILE STATUS: NOT GENERATED (HTTP 404 / dynamic / not in SSG)`);
    return;
  }
  const html = fs.readFileSync(file, 'utf8');

  // Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  console.log(`TITLE: ${titleMatch ? titleMatch[1] : 'NONE'}`);

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  console.log(`DESCRIPTION: ${descMatch ? descMatch[1] : 'NONE'}`);

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  console.log(`CANONICAL: ${canonicalMatch ? canonicalMatch[1] : 'NONE'}`);

  // Robots
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  console.log(`ROBOTS: ${robotsMatch ? robotsMatch[1] : 'DEFAULT (index, follow)'}`);

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const cleanH1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE';
  console.log(`H1: ${cleanH1}`);

  // Extract JSON-LD scripts
  const regex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let schemas = [];
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      schemas.push(parsed);
    } catch (e) {
      console.error(`Invalid JSON-LD syntax in ${url}:`, e.message);
    }
  }

  console.log(`JSON-LD BLOCKS (${schemas.length}):`);
  schemas.forEach((s, idx) => {
    console.log(`  [${idx}] @type: ${JSON.stringify(s['@type'])}, name: ${s.name || s.title || '(no name)'}`);
    if (s.itemListElement) {
      console.log(`       itemListElement: ${s.itemListElement.length} items (type: ${s['@type']})`);
      if (s['@type'] === 'BreadcrumbList') {
        s.itemListElement.forEach(item => {
          console.log(`         pos ${item.position}: ${item.name} -> ${item.item}`);
        });
      }
    }
    if (s.mainEntity) {
      console.log(`       mainEntity @type: ${s.mainEntity['@type']}, numberOfItems: ${s.mainEntity.numberOfItems}`);
    }
  });

  // Visible Breadcrumbs
  const navMatch = html.match(/<nav\s+aria-label=["']Breadcrumb["'][^>]*>([\s\S]*?)<\/nav>/i);
  if (navMatch) {
    const text = navMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`VISIBLE BREADCRUMBS: ${text}`);
  }
});
