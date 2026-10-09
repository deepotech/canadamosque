# Canada Mosque Near Me — Deployment Readiness Report

**Report Date**: 2026-10-09  
**Framework**: Next.js 15.5.27 (App Router, SSG)  
**Node.js**: v22.15.0 | **npm**: 11.5.1  
**Target Domain**: `https://canadamosquenearme.ca`

---

## 1. Changes Made During Deployment Preparation

### Assets Created (No data or code was altered)

| File | Action | Description |
| :--- | :--- | :--- |
| `public/og.jpg` | **Created** | Open Graph image (1376×768 px JPEG, 801 kB). Brand-consistent emerald green banner with gold crescent-dome-maple-leaf emblem. Referenced by `siteConfig.ogImage = "/og.jpg"`. |
| `public/favicon.ico` | **Created** | ICO file containing a valid 32×32 PNG payload for browser tab and bookmark icon. |
| `public/favicon.svg` | **Created** | Scalable SVG icon for modern browser tab rendering. |
| `public/icon.svg` | **Created** | Duplicate of `favicon.svg` for platforms that prefer `icon.svg`. |
| `public/apple-touch-icon.png` | **Created** | 180×180 px RGBA PNG for iOS home-screen icon (Apple Touch Icon). |

> [!NOTE]
> **Nothing else was changed.** All mosque data, prayer calculations, Iqamah/Jummah status, page content, SEO metadata, JSON-LD, and tests are untouched.

---

## 2. Assets — Status After Preparation

| Asset | Path | Size | Format Valid | Status |
| :--- | :--- | :--- | :---: | :---: |
| Open Graph Image | `public/og.jpg` | 801 kB | ✅ JPEG | ✅ Present |
| Browser Favicon | `public/favicon.ico` | 666 B | ✅ ICO+PNG | ✅ Present |
| SVG Icon | `public/favicon.svg` | 2.3 kB | ✅ SVG | ✅ Present |
| SVG Icon (alt) | `public/icon.svg` | 2.3 kB | ✅ SVG | ✅ Present |
| Apple Touch Icon | `public/apple-touch-icon.png` | 3.5 kB | ✅ PNG | ✅ Present |

> [!IMPORTANT]
> The `<head>` references in `src/domain/seo/metadata.ts` do **not** currently include explicit `<link rel="icon">` or `<link rel="apple-touch-icon">` tags — they rely on Next.js convention-based discovery from `public/`. Next.js 15 automatically serves `public/favicon.ico` at `/favicon.ico` and `public/apple-touch-icon.png` at `/apple-touch-icon.png`, so this is sufficient for all major browsers and iOS. No code change is required.

**The OG image** is referenced at `siteConfig.ogImage = "/og.jpg"`, which maps to `public/og.jpg`. The `metadata.ts` passes `metadataBase: new URL(siteConfig.url)` to Next.js, so the full absolute OG image URL will be resolved automatically by the framework as `https://canadamosquenearme.ca/og.jpg`.

---

## 3. Site Configuration Verified

| Check | Value | Status |
| :--- | :--- | :---: |
| **Canonical production URL** | `https://canadamosquenearme.ca` | ✅ Verified |
| **Env variable override** | `NEXT_PUBLIC_SITE_URL` (optional; falls back to hardcoded URL above) | ✅ Safe default |
| **Sitemap domain** | All 360 `<loc>` entries use `https://canadamosquenearme.ca` | ✅ Verified |
| **robots.txt Host** | `https://canadamosquenearme.ca` | ✅ Verified |
| **OG image path** | `/og.jpg` → resolves to `https://canadamosquenearme.ca/og.jpg` | ✅ Verified |
| **locale** | `en_CA` | ✅ Verified |

---

## 4. Hosting / Deployment Platform Configuration Found

**No platform-specific configuration file exists in the repository.** The following files were checked and were absent:

- `vercel.json` / `.vercelrc`
- `netlify.toml`
- `Dockerfile` / `docker-compose.yml`
- `fly.toml`
- `render.yaml`
- `railway.json`
- `amplify.yml`
- `.github/` (no CI/CD workflows)

**The `.gitignore` file is present** (standard Next.js template), but there is no Git repository initialized locally.

### What this means

The project is **platform-agnostic**. It is a standard Next.js 15 SSG application and can be deployed to any of the following without code changes:

| Platform | Notes |
| :--- | :--- |
| **Vercel** | Zero-config: detects Next.js automatically. Recommended for zero-ops. |
| **Netlify** | Works with `npm run build` + Next.js runtime plugin. |
| **Cloudflare Pages** | Requires `@cloudflare/next-on-pages` adapter. |
| **AWS Amplify** | Supported via Amplify Next.js adapter. |
| **Self-hosted VPS** | `npm run build && npm run start` on any Node.js 18+ server. |

---

## 5. Validation Results — Post Asset Addition

All checks were re-run **after** adding the `public/` assets:

| Check | Command | Exit Code | Result |
| :--- | :--- | :---: | :--- |
| TypeScript | `npm run typecheck` | **0** | ✅ 0 errors |
| ESLint | `npm run lint` | **0** | ✅ No warnings or errors |
| Unit & Integration Tests | `npm test` | **0** | ✅ **358/358 passed** — 25 suites |
| Raw Data Validation | `npm run validate:raw` | **0** | ✅ Toronto SHA-256 unchanged · All 9 cities VALID |
| Production Build | `npm run build` | **0** | ✅ **365 static pages prerendered** in 2.4s |
| Sitemap URL Count | Script check | **0** | ✅ **360 canonical URLs** · 0 duplicates |
| Sitemap Domain | Script check | **0** | ✅ All URLs use `canadamosquenearme.ca` |
| Asset File Integrity | Script check | **0** | ✅ All 5 assets present and format-valid |

**Toronto reference hash (SHA-256):**  
`0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9` — **UNCHANGED**

---

## 6. Required Deployment Steps and Commands

### Step 1 — Provide your Git hosting preference *(requires your approval first)*

> [!IMPORTANT]
> Per your rules, `git init` has **not** been run. Please confirm your preferred Git host (GitHub, GitLab, Bitbucket, other) and whether a remote repository already exists.

### Step 2 — Initialize Git and push (after your approval)
```bash
git init
git add .
git commit -m "feat: Canada Mosque Near Me v0.1.0 — pre-launch"
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

### Step 3 — Connect to deployment platform

**Option A — Vercel (recommended, zero-config)**
1. Log in at [vercel.com](https://vercel.com)  
2. "Add New Project" → Import Git repository  
3. Accept auto-detected Next.js settings  
4. Set `NEXT_PUBLIC_SITE_URL=https://canadamosquenearme.ca`  
5. Click Deploy

**Option B — Netlify**
1. "Add new site" → Import from Git  
2. Build command: `npm run build`  
3. Publish directory: `.next`  
4. Install Netlify Next.js Runtime plugin  
5. Set `NEXT_PUBLIC_SITE_URL=https://canadamosquenearme.ca`

**Option C — Self-hosted Node.js**
```bash
npm ci
npm run build
PORT=3000 npm run start   # or proxy via nginx/caddy
```

### Step 4 — Required Environment Variables

| Variable | Value | Required? |
| :--- | :--- | :---: |
| `NEXT_PUBLIC_SITE_URL` | `https://canadamosquenearme.ca` | Optional (safe hardcoded fallback) |
| `NODE_ENV` | `production` | Set automatically by all platforms |

No API keys, secrets, or third-party tokens are required.

### Step 5 — Post-deployment smoke checks (by you, in browser)
- [ ] `https://canadamosquenearme.ca/` loads the homepage  
- [ ] `https://canadamosquenearme.ca/sitemap.xml` returns 360 URLs  
- [ ] `https://canadamosquenearme.ca/robots.txt` shows `Allow: /`  
- [ ] `https://canadamosquenearme.ca/og.jpg` renders the OG image  
- [ ] `https://canadamosquenearme.ca/favicon.ico` returns the favicon  
- [ ] A mosque profile (e.g. `/mosque/birmingham-masjid-etobicoke`) loads  
- [ ] `/mosque-near-me` — geolocation prompt appears over HTTPS  
- [ ] Google Rich Results Test confirms JSON-LD valid

---

## 7. Remaining Prerequisites Requiring Your Action

| # | Prerequisite | Action Required |
| :--- | :--- | :--- |
| **1** | **Git repository initialization** | Confirm your preferred Git host and whether a remote already exists. I will not run `git init` until you approve. |
| **2** | **Deployment platform choice** | Confirm which platform: Vercel, Netlify, self-hosted, or other. |
| **3** | **Domain DNS configuration** | Point `canadamosquenearme.ca` DNS to the platform's IP/CNAME. Requires access to your DNS registrar. |
| **4** | **SSL/TLS certificate** | Auto-provisioned by Vercel/Netlify/Cloudflare. On VPS: use Let's Encrypt/Certbot/Caddy. |
| **5** | **OG image approval** | Review the generated `og.jpg` above (emerald green, gold emblem). If you want a different design, I can regenerate before committing. |

---

## Summary

The project is fully code-complete, test-complete, and now asset-complete. All 358 tests pass. The production build generates 365 static pages with 360 canonical sitemap URLs. The `public/` directory has been populated with all required brand assets. **Nothing has been deployed, pushed, published, or changed on DNS.** Awaiting your decisions on items 1–2 above before proceeding.
