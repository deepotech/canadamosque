# Canada Mosque Near Me — Live Production Verification Report

**Verification Date & Time**: 2026-10-24T10:26:55Z  
**Auditor**: Antigravity AI Assistant  
**Production Domain**: `https://canadamosquenearme.ca`  
**Hosting Infrastructure**: Railway Edge (`railway-hikari`, POP: `cdg1`)  
**Evaluation Scope**: Active HTTP/TLS Network Trace, Live Prerendered HTML & SEO Inspection, Sitemap & Robots Validation  
**Document Output**: `docs/LIVE_PRODUCTION_VERIFICATION.md`  

---

## Executive Verdict

### **VERDICT: READY WITH WARNINGS**

The live production deployment on `https://canadamosquenearme.ca` is healthy, fully operational, and correctly serving the static Next.js application:
- **Canonical Apex Domain**: `https://canadamosquenearme.ca` returns HTTP `200 OK` with valid TLS, optimal caching (`s-maxage=31536000`), and strict security headers (HSTS `max-age=31536000; includeSubDomains`).
- **HTTP-to-HTTPS Redirection**: `http://canadamosquenearme.ca/` returns an immediate HTTP `301 Moved Permanently` redirecting to `https://canadamosquenearme.ca/`.
- **Live HTML SEO & Metadata**: All tested pages (Homepage, `/mosques`, `/prayer-times`, `/jummah`, `/mosque-near-me`, and multiple published mosque profiles) render valid canonical tags, titles, descriptions, Open Graph metadata, and syntax-valid JSON-LD structured data with zero schema parse errors.
- **Sitemap & Robots Verification**: `robots.txt` and `sitemap.xml` return HTTP `200 OK`. The live sitemap contains exactly **360 URLs**, matching the local repository inventory (360/360 exact match, 0 missing, 0 extra, 0 duplicates, 0 non-HTTPS, 0 review-required/excluded records).

> [!WARNING]
> **Warning 1: Missing DNS Record for `www` Subdomain (`ENOTFOUND`)**  
> `https://www.canadamosquenearme.ca/` and `http://www.canadamosquenearme.ca/` fail DNS resolution with `ENOTFOUND` (no DNS A or CNAME record exists). While all canonical tags, sitemaps, and internal links strictly use the apex domain (`canadamosquenearme.ca`), external visitors or search engine bots attempting to reach the `www` hostname will encounter an address resolution error until a DNS CNAME record pointing `www` to the apex or host edge is created.
> 
> **Warning 2: Search Engine Indexation Verification Scope**  
> Successful live HTTP requests confirm server availability and crawlability, but **do not constitute proof of Google indexation or ranking**. Complete index status can only be confirmed via authenticated Google Search Console access.

---

## Section A: Live Domain & HTTP Endpoint Trace

Network probes were executed directly against live production endpoints using Node.js TLS/HTTP clients and `curl`. Strict TLS certificate validation was enforced (`rejectUnauthorized: true`).

### Summary of Live Endpoint Probes

| Endpoint Tested | Initial HTTP Status | Redirect Chain | Final Status | Final URL | Server / CDN | Result |
| :--- | :---: | :--- | :---: | :--- | :--- | :---: |
| `http://canadamosquenearme.ca/` | **301** | `http://canadamosquenearme.ca/` → (301) → `https://canadamosquenearme.ca/` | **200 OK** | `https://canadamosquenearme.ca/` | `railway-hikari` | ✅ PASS |
| `https://canadamosquenearme.ca/` | **200** | Direct (0 redirects) | **200 OK** | `https://canadamosquenearme.ca/` | `railway-hikari` | ✅ PASS |
| `https://www.canadamosquenearme.ca/` | **DNS Fail** | None (`getaddrinfo ENOTFOUND`) | **N/A** | N/A | N/A | ⚠️ **FAIL (No DNS)** |
| `http://www.canadamosquenearme.ca/` | **DNS Fail** | None (`getaddrinfo ENOTFOUND`) | **N/A** | N/A | N/A | ⚠️ **FAIL (No DNS)** |
| `https://canadamosquenearme.ca/robots.txt` | **200** | Direct (0 redirects) | **200 OK** | `https://canadamosquenearme.ca/robots.txt` | `railway-hikari` | ✅ PASS |
| `https://canadamosquenearme.ca/sitemap.xml` | **200** | Direct (0 redirects) | **200 OK** | `https://canadamosquenearme.ca/sitemap.xml` | `railway-hikari` | ✅ PASS |
| `https://canadamosquenearme.ca/mosque-near-me` | **200** | Direct (0 redirects) | **200 OK** | `https://canadamosquenearme.ca/mosque-near-me` | `railway-hikari` | ✅ PASS |

### Detailed Redirect & Response Headers Trace

#### 1. Plain HTTP Root (`http://canadamosquenearme.ca/`)
- **Hop 1**:
  ```http
  HTTP/1.1 301 Moved Permanently
  Location: https://canadamosquenearme.ca/
  Content-Length: 0
  Date: Sat, 24 Oct 2026 10:26:33 GMT
  Connection: keep-alive
  ```
- **Hop 2**:
  ```http
  HTTP/1.1 200 OK
  Content-Type: text/html; charset=utf-8
  Cache-Control: s-maxage=31536000
  Server: railway-hikari
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(self)
  X-Nextjs-Prerender: 1
  Content-Length: 102947
  ```
- **Verdict**: The live edge host actively and permanently redirects HTTP to HTTPS with status `301 Moved Permanently`.

#### 2. Canonical HTTPS Root (`https://canadamosquenearme.ca/`)
- **TLS Status**: Valid TLS handshake; no certificate revocation or chain errors.
- **Cache Policy**: `s-maxage=31536000` (optimal for static SSG edge caching).
- **Security Headers**: HSTS configured with 1-year duration (`max-age=31536000`) and `includeSubDomains`.

#### 3. Subdomain Probing (`www.canadamosquenearme.ca`)
- **Error**: `getaddrinfo ENOTFOUND www.canadamosquenearme.ca`
- **Cause**: Domain registrar/DNS host lacks an `A`, `AAAA`, or `CNAME` record for `www`.
- **Impact**: Any traffic or backlink directing to `www` fails to connect rather than redirecting to `https://canadamosquenearme.ca`.

---

## Section B: Live HTML SEO Inspection

Live HTML payloads were retrieved over HTTPS and parsed for SEO elements, canonical declarations, Open Graph metadata, and JSON-LD structured data.

### Live HTML SEO Inspection Matrix

| Route | Live HTTP Status & Final URL | Canonical URL (`<link rel="canonical">`) | `<title>` | Robots Directives | Open Graph URL | JSON-LD Types Detected |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **Homepage (`/`)** | `200` · `https://canadamosquenearme.ca/` | `https://canadamosquenearme.ca` | `Mosque Near Me in Canada \| Find Mosques & Prayer Times \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca` | `WebSite`, `Organization`, `WebPage`, `FAQPage` |
| **`/mosques`** | `200` · `https://canadamosquenearme.ca/mosques` | `https://canadamosquenearme.ca/mosques` | `Mosques in Canada \| Canadian Mosque Finder & Directory \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/mosques` | `WebSite`, `Organization`, `WebPage`, `BreadcrumbList` |
| **`/prayer-times`** | `200` · `https://canadamosquenearme.ca/prayer-times` | `https://canadamosquenearme.ca/prayer-times` | `Canadian Daily Prayer Times Engine \| Accurate Local Times \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/prayer-times` | `WebSite`, `Organization`, `WebPage`, `BreadcrumbList` |
| **`/jummah`** | `200` · `https://canadamosquenearme.ca/jummah` | `https://canadamosquenearme.ca/jummah` | `Jummah Prayer Times in Canada \| Friday Prayer Schedules \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/jummah` | `WebSite`, `Organization`, `WebPage`, `BreadcrumbList` |
| **`/mosque-near-me`** | `200` · `https://canadamosquenearme.ca/mosque-near-me` | `https://canadamosquenearme.ca/mosque-near-me` | `Mosque Near Me \| Find Mosques & Masjids in Canada \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/mosque-near-me` | `WebSite`, `Organization`, `WebPage`, `BreadcrumbList` |
| **Mosque 1**: `10-teesdale-musallah-1806-scarborough` | `200` · `https://canadamosquenearme.ca/mosque/10-teesdale-musallah-1806-scarborough` | `https://canadamosquenearme.ca/mosque/10-teesdale-musallah-1806-scarborough` | `10 Teesdale Musallah @ 1806 in Scarborough, ON \| Address & Prayer Times \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/mosque/10-teesdale-musallah-1806-scarborough` | `WebSite`, `Organization`, `PlaceOfWorship`, `BreadcrumbList` |
| **Mosque 2**: `230-oak-musalla-toronto` | `200` · `https://canadamosquenearme.ca/mosque/230-oak-musalla-toronto` | `https://canadamosquenearme.ca/mosque/230-oak-musalla-toronto` | `230 Oak Musalla in Toronto, ON \| Address & Prayer Times \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/mosque/230-oak-musalla-toronto` | `WebSite`, `Organization`, `PlaceOfWorship`, `BreadcrumbList` |
| **Mosque 3**: `463-gerrard-st-e-musallah-toronto` | `200` · `https://canadamosquenearme.ca/mosque/463-gerrard-st-e-musallah-toronto` | `https://canadamosquenearme.ca/mosque/463-gerrard-st-e-musallah-toronto` | `463 Gerrard St E Musallah in Toronto, ON \| Address & Prayer Times \| Canada Mosque Near Me` | `index, follow` | `https://canadamosquenearme.ca/mosque/463-gerrard-st-e-musallah-toronto` | `WebSite`, `Organization`, `PlaceOfWorship`, `BreadcrumbList` |

### Detailed SEO Quality Findings

1. **Canonical URLs**: Every canonical URL explicitly declares `https://canadamosquenearme.ca` with zero relative paths or protocol mismatches.
2. **Robots Meta**: `<meta name="robots" content="index, follow"/>` and `<meta name="googlebot" content="index, follow"/>` are present on all indexed pages. No unintentional `noindex` was found.
3. **Structured Data (JSON-LD)**:
   - **Syntax Validation**: All extracted JSON-LD blocks were parsed via strict JSON parser (`JSON.parse`). **0 syntax errors** were detected across all pages.
   - **Content Consistency**: Mosque profiles declare `PlaceOfWorship` or `Mosque` schemas containing exact physical addresses, real coordinates, and canonical URLs matching visible on-page text.
   - **Anti-Fabrication Compliance**: Verified that zero aggregate ratings, fake reviews, or speculative Iqamah schedules are emitted into live structured data.

---

## Section C: Live Sitemap & Robots Verification

### 1. Live `robots.txt` Verification

Retrieved directly from `https://canadamosquenearme.ca/robots.txt`:
```txt
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /data/

Host: https://canadamosquenearme.ca
Sitemap: https://canadamosquenearme.ca/sitemap.xml
```
- Status: **200 OK**
- Disallow rules correctly protect internal routes (`/api/`, `/_next/`, `/data/`) while leaving public pages fully crawlable.
- `Sitemap` declaration points directly to the canonical HTTPS sitemap URL.

### 2. Live `sitemap.xml` Inventory & Comparison

The live payload from `https://canadamosquenearme.ca/sitemap.xml` was downloaded and compared against the expected local repository inventory ([`src/app/sitemap.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/app/sitemap.ts) / `.next/server/app/sitemap.xml.body`).

| Sitemap Dimension | Local Expected | Live Production | Variance | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Total URLs in Sitemap** | 360 | 360 | 0 | ✅ Exact Match |
| **Non-HTTPS URLs** | 0 | 0 | 0 | ✅ 100% HTTPS |
| **Duplicate URLs** | 0 | 0 | 0 | ✅ 0 Duplicates |
| **Missing from Live** | — | — | 0 | ✅ None Missing |
| **Extra in Live** | — | — | 0 | ✅ None Extra |
| **Review-Required Mosques Leaked** | 0 | 0 | 0 | ✅ Zero Leakage |
| **Excluded Mosques Leaked** | 0 | 0 | 0 | ✅ Zero Leakage |

### Category Breakdown of Live Sitemap URLs

- **Core Static Routes (6)**: `/`, `/mosque-near-me`, `/mosques`, `/prayer-times`, `/jummah`, `/jummah/toronto`
- **Metropolitan Prayer Routes (9)**: `/prayer-times/toronto`, `/prayer-times/ottawa`, `/prayer-times/mississauga`, `/prayer-times/brampton`, `/prayer-times/calgary`, `/prayer-times/edmonton`, `/prayer-times/montreal`, `/prayer-times/vancouver`, `/prayer-times/winnipeg`
- **Area / District Directory Routes (14)**: `/mosques/toronto`, `/mosques/scarborough`, `/mosques/north-york`, `/mosques/etobicoke`, `/mosques/downtown-toronto`, etc.
- **Published Mosque Profile Routes (331)**: All 331 verified mosque profiles across Canada.

---

## Section D: Checks Requiring Authenticated GSC Access (Unperformed Locally)

The following operational checks require authenticated access to the Google Search Console dashboard or DNS management console and **were not performed** during this automated HTTP audit:

| Check Item | Required Interface | Description | Status |
| :--- | :--- | :--- | :---: |
| **GSC URL Inspection Tool** | Search Console UI | Confirm that Google's indexer evaluates `https://canadamosquenearme.ca` as both "User-declared canonical" and "Google-selected canonical". | ⏳ Pending GSC Access |
| **GSC Sitemap Processing** | Search Console UI | Confirm that `https://canadamosquenearme.ca/sitemap.xml` was submitted in GSC and displays "Success" with 360 discovered URLs. | ⏳ Pending GSC Access |
| **GSC Indexing Coverage** | Search Console UI | Review counts of "Indexed" vs. "Not Indexed" (e.g. "Discovered - currently not indexed", "Crawled - currently not indexed"). | ⏳ Pending GSC Access |
| **DNS CNAME for `www`** | DNS Management Portal | Add DNS CNAME record `www` pointing to `canadamosquenearme.ca` so the `www` hostname resolves and redirects cleanly. | ⏳ Pending DNS Admin |

---

## Prioritized Recommended Actions

1. **Resolve DNS for `www` (High Priority - Infrastructure)**:
   - Configure a CNAME record at your DNS provider: `www.canadamosquenearme.ca CNAME canadamosquenearme.ca`.
   - Ensure the host edge (Railway / CDN) redirects `www` to non-`www` with a 301 permanent redirect.
2. **Surface `/mosque-near-me` in Navigation (High Priority - SEO)**:
   - As identified in the diagnostic report, `mosque near me` generates **31.97% of all search impressions** (position 13.3).
   - In a future update, add a direct navigation link to `/mosque-near-me` in [`src/components/layout/Header.tsx`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/components/layout/Header.tsx) and [`src/components/layout/Footer.tsx`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/components/layout/Footer.tsx) to concentrate internal link equity onto the intent-matching landing page.
3. **Submit Sitemap in Google Search Console (Medium Priority - GSC Operations)**:
   - In Search Console under "Sitemaps", submit `https://canadamosquenearme.ca/sitemap.xml` to accelerate crawling across all 360 URLs.
4. **Align Homepage Trailing Slash in Sitemap (Low Priority - Cleanup)**:
   - Standardize `sitemap.ts` root URL from `https://canadamosquenearme.ca/` to `https://canadamosquenearme.ca` to match the exact string produced by Next.js metadata normalization.

---

### Audit Compliance Certification

- **Read-Only Verification**: No application code or datasets were modified.
- **Data Integrity**: Toronto reference dataset SHA-256 and all 501 raw records remain cryptographically intact.
- **No Deployments or Commits**: No commits were made, and no deployments were triggered.
- **Final Verdict**: **READY WITH WARNINGS** (due to missing DNS record for `www.canadamosquenearme.ca`).
