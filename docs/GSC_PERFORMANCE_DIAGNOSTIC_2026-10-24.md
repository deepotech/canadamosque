# Canada Mosque Near Me — Google Search Console Performance Diagnostic

**Diagnostic Date**: October 24, 2026  
**Auditor**: Antigravity AI Assistant  
**Repository Working Directory**: `c:\Users\HP\Desktop\Canada Mosque Near Me`  
**Target Domain**: `https://canadamosquenearme.ca`  
**Evaluation Scope**: Google Search Console Performance Export (October 8–22, 2026) & Local Codebase Architecture  
**Document Output**: `docs/GSC_PERFORMANCE_DIAGNOSTIC_2026-10-24.md`  

---

## Executive Summary

A diagnostic audit was conducted combining the Google Search Console (GSC) performance export dated October 24, 2026 (tracking October 8–22, 2026) with the production codebase.

### GSC Performance Export Summary

| Metric / Dimension | Value | Interpretation |
| :--- | :--- | :--- |
| **Total Impressions (Oct 8–22)** | **147** | Initial organic search footprint recorded across the first 14 days post-launch. |
| **Total Clicks (Oct 8–22)** | **1** | Organic CTR of 0.68%, typical for early indexation stages where impressions sit on Page 2+. |
| **HTTPS Homepage (`https://canadamosquenearme.ca`)** | 105 impressions · 1 click · Avg Pos: **21.85** | Main landing page serving the majority of search appearances (Page 3). |
| **HTTP Homepage (`http://canadamosquenearme.ca`)** | 42 impressions · 0 clicks · Avg Pos: **14.26** | Non-secure URL surfaced during initial crawl/discovery (Page 2). |
| **High-Impression Query (`mosque near me`)** | 47 impressions · 0 clicks · Avg Pos: **13.30** | Represents **31.97% of all impressions**; ranks on Page 2 (positions 11–20), right at the threshold of Page 1. |

### Key Diagnostic Findings

1. **Canonical URLs**: Verified 100% compliant in code and generated HTML. Canonical tags across the Homepage, directory hubs, prayer engines, Jummah schedules, and all 331 published mosque profiles explicitly use `https://canadamosquenearme.ca`.
2. **Sitemap Integrity**: Verified 360/360 canonical URLs in `sitemap.xml` strictly use HTTPS and the target domain. Zero HTTP URLs.
3. **Internal Links**: Verified 0 accidental HTTP internal links across the codebase and prerendered HTML. All navigation and content links use root-relative paths or canonical HTTPS.
4. **HTTP vs. HTTPS Coexistence**: Explaining the GSC export showing both protocols reflects standard search engine discovery behavior, asynchronous indexing pipelines, and canonicalization consolidation lag during the first 14 days of a new domain, rather than demonstrating a codebase failure.
5. **Redirect Architecture**: `Strict-Transport-Security` (HSTS) is active in `next.config.ts`, but application-layer HTTP-to-HTTPS redirect logic does not exist in Next.js code; redirection relies on edge CDN / hosting infrastructure, which requires live verification.
6. **Primary Growth Bottleneck**: The top query `mosque near me` (47 impressions, position 13.3) currently lands on the homepage, while the specialized client utility `/mosque-near-me` is under-linked from top-level site navigation (`Header.tsx` and `Footer.tsx`).

---

## 1. Production URL & Canonical Configuration Audit

### Configuration Files Inspected

- [`src/config/site.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/config/site.ts):
  ```typescript
  export const siteConfig: SiteConfig = {
    name: "Canada Mosque Near Me",
    shortName: "Mosque Near Me CA",
    description: "Find authentic Canadian mosques, daily calculated prayer times, and mosque-verified Iqamah and Jummah schedules across Canada.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://canadamosquenearme.ca",
    ogImage: "/og.jpg",
    locale: "en_CA",
    supportedCountry: "CA",
    links: {},
  };
  ```
- [`src/domain/seo/metadata.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/domain/seo/metadata.ts):
  ```typescript
  export function constructMetadata({
    title,
    description = siteConfig.description,
    canonicalPath = "/",
    noIndex = false,
  }: PageMetadataProps = {}): Metadata {
    const fullTitle = title
      ? `${title} | ${siteConfig.name}`
      : `${siteConfig.name} | Canadian Mosque Discovery & Prayer Times`;

    const canonicalUrl = `${siteConfig.url}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;

    return {
      title: fullTitle,
      description,
      metadataBase: new URL(siteConfig.url),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: fullTitle,
        description,
        url: canonicalUrl,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        type: "website",
      },
      // ...
    };
  }
  ```
- [`src/domain/seo/schema.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/domain/seo/schema.ts):
  - WebSite JSON-LD: `@id: "https://canadamosquenearme.ca/#website"`, `url: "https://canadamosquenearme.ca"`
  - WebPage JSON-LD: `@id: "https://canadamosquenearme.ca${url}#webpage"`
  - Organization JSON-LD: `@id: "https://canadamosquenearme.ca/#organization"`
  - Mosque JSON-LD: `@id: "https://canadamosquenearme.ca/mosque/${slug}#${schemaType}"`

### Verification Result

- Production domain is hardcoded as fallback to `https://canadamosquenearme.ca` with optional environment override `NEXT_PUBLIC_SITE_URL`.
- All canonical meta tags and JSON-LD schemas resolve strictly to `https://canadamosquenearme.ca`.

---

## 2. HTTP-to-HTTPS Redirect Behavior Analysis

### Codebase & Hosting Inspection

1. **Application Layer (`next.config.ts`)**:
   [`next.config.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/next.config.ts) sets the following security header on all routes:
   ```typescript
   {
     key: "Strict-Transport-Security",
     value: "max-age=31536000; includeSubDomains",
   }
   ```
   - **HSTS Enforcement**: Compliant web browsers that have established at least one successful HTTPS connection will automatically upgrade any subsequent HTTP requests to HTTPS locally on the client.
   - **Limitation**: Per RFC 6797, HSTS headers sent over plain HTTP are ignored. HSTS does not convert the very first HTTP request from a crawler or user who has never visited over HTTPS before, nor does it affect crawlers that do not maintain HSTS caches.
2. **Next.js Server / Middleware**:
   - `next.config.ts` does **not** declare an `async redirects()` block for protocol upgrades.
   - There is **no Next.js middleware file** (`src/middleware.ts` or `middleware.ts`) intercepting `x-forwarded-proto !== "https"` to issue HTTP 301/308 redirects.
3. **Platform Hosting Configuration**:
   - As documented in [`docs/DEPLOYMENT_READINESS_REPORT.md`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/docs/DEPLOYMENT_READINESS_REPORT.md), the repository contains no platform-specific configuration files (no `vercel.json`, `netlify.toml`, `render.yaml`, `Dockerfile`, or reverse-proxy `nginx.conf`).

> [!IMPORTANT]
> **Operational Distinction**: Next.js App Router applications running in SSG mode do not manage port 80 HTTP listener redirects in application code. HTTP-to-HTTPS 301/308 redirection is delegated to the host platform (e.g., Vercel, Cloudflare, AWS CloudFront, Nginx reverse proxy).
> 
> **Finding**: We **cannot determine or guarantee** that HTTP requests are actively redirecting to HTTPS in the live production environment from local code alone. This requires an external network test (`curl -IL http://canadamosquenearme.ca`).

---

## 3. Prerendered HTML Inspection (Canonical Tags & Metadata)

Prerendered production artifacts located in `.next/server/app` were examined across key routes and published profiles.

### Audit Matrix

| Page / Route | Generated HTML File | `<title>` | `<link rel="canonical">` | Robots | Structured Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Homepage (`/`)** | `index.html` | `Mosque Near Me in Canada \| Find Mosques & Prayer Times \| Canada Mosque Near Me` | `https://canadamosquenearme.ca` | `index, follow` | WebSite, Organization, WebPage, FAQPage |
| **National Directory (`/mosques`)** | `mosques.html` | `Mosques in Canada \| Canadian Mosque Finder & Directory \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/mosques` | `index, follow` | WebPage, BreadcrumbList |
| **Prayer Engine (`/prayer-times`)** | `prayer-times.html` | `Canadian Daily Prayer Times Engine \| Accurate Local Times \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/prayer-times` | `index, follow` | WebPage, BreadcrumbList |
| **Jummah Directory (`/jummah`)** | `jummah.html` | `Jummah Prayer Times in Canada \| Friday Prayer Schedules \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/jummah` | `index, follow` | WebPage, BreadcrumbList |
| **Near Me Finder (`/mosque-near-me`)** | `mosque-near-me.html` | `Mosque Near Me \| Find Mosques & Masjids in Canada \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/mosque-near-me` | `index, follow` | WebPage, BreadcrumbList |
| **Profile 1**: `10-teesdale-musallah-1806-scarborough` | `mosque/10-teesdale-musallah-1806-scarborough.html` | `10 Teesdale Musallah @ 1806 in Scarborough, ON \| Address & Prayer Times \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/mosque/10-teesdale-musallah-1806-scarborough` | `index, follow` | PlaceOfWorship, BreadcrumbList |
| **Profile 2**: `230-oak-musalla-toronto` | `mosque/230-oak-musalla-toronto.html` | `230 Oak Musalla in Toronto, ON \| Address & Prayer Times \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/mosque/230-oak-musalla-toronto` | `index, follow` | PlaceOfWorship, BreadcrumbList |
| **Profile 3**: `463-gerrard-st-e-musallah-toronto` | `mosque/463-gerrard-st-e-musallah-toronto.html` | `463 Gerrard St E Musallah in Toronto, ON \| Address & Prayer Times \| Canada Mosque Near Me` | `https://canadamosquenearme.ca/mosque/463-gerrard-st-e-musallah-toronto` | `index, follow` | PlaceOfWorship, BreadcrumbList |

### Key Observations

- All canonical tags are fully-qualified absolute HTTPS URLs matching the production domain.
- There are no unintentional `noindex` directives on any of the canonical routes.
- **Subtle Trailing Slash Variance**:
  - In `src/app/page.tsx`, `constructMetadata({ canonicalPath: "/" })` produces `canonicalUrl = "https://canadamosquenearme.ca/"`. However, Next.js metadata normalization outputs `<link rel="canonical" href="https://canadamosquenearme.ca"/>` (without a trailing slash) on the homepage.
  - In `src/app/sitemap.ts`, the root route is listed as `https://canadamosquenearme.ca/` (with a trailing slash). While search engines treat the root domain with or without trailing slash as identical, exact string alignment is recommended for pristine canonical hygiene.

---

## 4. Sitemap URL Audit

The build output `.next/server/app/sitemap.xml.body` and generator source [`src/app/sitemap.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/app/sitemap.ts) were evaluated against canonical criteria.

### Verification Results

- **Total Sitemap URLs**: **360**
- **Non-HTTPS URLs**: **0** (100% start with `https://canadamosquenearme.ca`)
- **HTTP URLs**: **0**
- **Non-Canonical Hosts**: **0** (no `localhost`, staging, or IP references)
- **URL Breakdown**:
  - **Core Static Routes** (6): `/`, `/mosque-near-me`, `/mosques`, `/prayer-times`, `/jummah`, `/jummah/toronto`
  - **Metropolitan Prayer Routes** (9): `/prayer-times/toronto`, `/prayer-times/ottawa`, `/prayer-times/mississauga`, `/prayer-times/brampton`, `/prayer-times/calgary`, `/prayer-times/edmonton`, `/prayer-times/montreal`, `/prayer-times/vancouver`, `/prayer-times/winnipeg`
  - **Area / District Directory Routes** (14): `/mosques/toronto`, `/mosques/scarborough`, `/mosques/north-york`, `/mosques/etobicoke`, `/mosques/downtown-toronto`, etc.
  - **Published Mosque Profile Routes** (331): `/mosque/[slug]` for all 331 validated mosques across 9 Canadian metropolises.

The sitemap contains exclusively valid HTTPS canonical URLs and zero excluded/review-required records.

---

## 5. Internal Links Audit

All source code files and 361 prerendered production HTML pages were scanned for accidental internal `http://` links.

### Findings

- **Internal HTTP Links in Prerendered HTML**: **0**
- **Internal HTTP Links in Source Code**: **0**
- **Root-Relative Navigation**: All internal links across navigation headers, footers, breadcrumbs, nearby mosque widgets, and directory grids use either root-relative paths (e.g., `<Link href="/mosques">`, `<Link href="/mosque/slug">`) or canonical HTTPS URLs.
- **External Links Clarification**: The 125 instances of `http://` found across the generated HTML pages correspond exclusively to external third-party URLs belonging to individual mosques (e.g., `<a href="http://www.65musalla.com/" rel="noopener noreferrer">`). These are accurate external data values, not internal links.

---

## 6. Reasons Why GSC Reports Both HTTP and HTTPS Homepage URLs

The export displays:
- `https://canadamosquenearme.ca/`: 105 impressions, 1 click, avg position 21.85
- `http://canadamosquenearme.ca/`: 42 impressions, 0 clicks, avg position 14.26

The presence of both URLs in Search Console is a common phenomenon and does not inherently prove a defect in the code. Legitimate causes include:

1. **Search Console Domain Property vs. URL-Prefix Property**:
   - In a GSC **Domain Property** (`canadamosquenearme.ca`), Search Console aggregates search performance across all protocols (HTTP and HTTPS) and all subdomains (`www` and non-`www`). If Googlebot crawls or tests both variants, both appear in the URL breakdown.
2. **Initial Crawling and Discovery Timing**:
   - The domain was launched in early October 2026 (the launch audit is dated October 9, 2026), and the GSC reporting window spans October 8–22, 2026.
   - When a domain is freshly registered or newly active, Googlebot frequently attempts to fetch the root `http://` address first as part of standard protocol discovery.
3. **Canonical Indexing Consolidation Lag**:
   - Search engines crawl, parse, and index pages across distributed data centers. Consolidating canonical signals (canonical tags, sitemaps, internal links, 301 redirects) from HTTP to HTTPS takes time—often 2 to 6 weeks for a new domain. During this transition, Google maintains impressions for both variants before folding them into the HTTPS canonical entity.
4. **External Inbound Links & Direct Query Behavior**:
   - Third-party websites, social networks, local directories, or index aggregators linking to `http://canadamosquenearme.ca` prompt Google to crawl and evaluate the HTTP URL.
5. **Edge Redirect Timing & Verification**:
   - If the edge CDN (e.g., Vercel, Cloudflare, host proxy) was not enforcing an immediate 301 redirect on day 1, or if it briefly served 200 OK on port 80 during initial DNS propagation, Googlebot would have cached both variants.

---

## 7. Google Search Console Verification Configuration Check

A non-intrusive scan was conducted for GSC verification methods in the codebase:

### Codebase Findings

- **HTML Meta Tag (`google-site-verification`)**:
  - Inspected `src/domain/seo/metadata.ts` and `src/app/layout.tsx`.
  - Result: **Not present** in the metadata configuration or `<head>`.
- **HTML Verification File**:
  - Inspected `public/` directory for any `google*.html` verification files.
  - Result: **Not present**.
- **Google Analytics Integration**:
  - Located in [`src/app/layout.tsx`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/app/layout.tsx#L41-L56):
    ```tsx
    <Script
      strategy="afterInteractive"
      src="https://www.googletagmanager.com/gtag/js?id=G-46P0Y5V0V2"
    />
    ```
  - **GSC Verification Link**: Google Analytics 4 (Measurement ID `G-46P0Y5V0V2`) is actively embedded. If the owner of the GSC property has Edit/Admin permissions on this GA4 property, GSC can automatically verify ownership via the Google Analytics method.
- **DNS TXT Record**:
  - Search Console Domain properties are verified externally via DNS TXT records (`google-site-verification=...`) at the DNS registrar. This requires no repository code.

---

## 8. Separate Checklist for Live Production & GSC Verification

The following checks cannot be executed locally within this repository and require live network access, DNS access, or authenticated Google Search Console access. **These checks are explicitly marked UNPERFORMED / PENDING LIVE ACCESS.**

| # | Verification Check | Purpose / Action | Status |
| :-: | :--- | :--- | :---: |
| **L-1** | **Live HTTP-to-HTTPS 301 Redirect Check** | Run `curl -IL http://canadamosquenearme.ca` to verify that port 80 issues an immediate `301 Moved Permanently` or `308 Permanent Redirect` to `https://canadamosquenearme.ca/`. | ⏳ Requires Live Network |
| **L-2** | **Live `www` vs. Non-`www` Redirect Check** | Run `curl -IL https://www.canadamosquenearme.ca` to confirm that `www` redirects to apex non-`www` (or vice versa) with a 301 status code. | ⏳ Requires Live Network |
| **L-3** | **Live SSL/TLS Certificate & Cipher Check** | Inspect production TLS handshake to ensure validity, issuer authenticity, and absence of certificate chain errors. | ⏳ Requires Live Network |
| **L-4** | **GSC URL Inspection Tool: Homepage** | Inspect `http://canadamosquenearme.ca` and `https://canadamosquenearme.ca` in GSC: confirm "Google-selected canonical" matches "User-declared canonical" (`https://canadamosquenearme.ca`). | ⏳ Requires GSC Access |
| **L-5** | **GSC Page Indexing Status Report** | Review the "Pages" report in GSC to inspect the count of "Indexed" vs "Not Indexed" pages and identify any exclusions (e.g., "Crawled - currently not indexed" or "Duplicate without user-selected canonical"). | ⏳ Requires GSC Access |
| **L-6** | **GSC Sitemap Processing Status** | Inspect the "Sitemaps" tab in GSC: confirm `https://canadamosquenearme.ca/sitemap.xml` has been submitted, shows status "Success", and all 360 discovered URLs are recognized. | ⏳ Requires GSC Access |
| **L-7** | **DNS TXT Verification Record Query** | Query DNS TXT records (`nslookup -q=TXT canadamosquenearme.ca`) to verify the presence of active GSC domain verification tokens and SPF records. | ⏳ Requires Live DNS |

---

## 9. Prioritized SEO Recommendations Based on Export Data

### Analysis of the Query Opportunity

- **High-Impression Query**: `mosque near me`
  - **47 impressions** out of 147 total (representing **31.97%** of site-wide search visibility).
  - **Average Position: 13.30** (Page 2, 3rd result from top of page 2).
  - **Clicks: 0** (Expected: CTR on Page 2 is typically <0.5%).
- **Homepage Disparity**:
  - `https://canadamosquenearme.ca`: 105 impressions, 1 click, average position 21.85 (Page 3).
  - `http://canadamosquenearme.ca`: 42 impressions, 0 clicks, average position 14.26 (Page 2).
  - Total homepage impressions: $105 + 42 = 147$, matching the daily chart total exactly. This confirms that **all current search visibility is concentrated on the homepage**.

### Prioritized Action Plan

#### Priority 1: Elevate and Interlink the `/mosque-near-me` Landing Page
- **Finding**: The site has a dedicated, interactive, geolocation-powered landing page at `/mosque-near-me` ([`src/app/mosque-near-me/page.tsx`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/app/mosque-near-me/page.tsx)) designed explicitly for the keyword `mosque near me`. However:
  - It is currently missing from the primary desktop navigation ([`src/components/layout/Header.tsx`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/components/layout/Header.tsx)).
  - It is currently missing from the footer links ([`src/components/layout/Footer.tsx`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/components/layout/Footer.tsx)).
  - As a result, search engines have channeled `mosque near me` search queries to the homepage rather than the specialized landing page.
- **Action**:
  1. Add a direct link to `/mosque-near-me` in `Header.tsx` (e.g., "Near Me" navigation item or primary action button).
  2. Add `/mosque-near-me` under "Discovery & Utility" in `Footer.tsx`.
  3. Feature `/mosque-near-me` prominently in hero banners across `/mosques` and `/prayer-times`.

#### Priority 2: Consolidate HTTP to HTTPS via Live Edge 301 Redirect
- **Finding**: 42 impressions are currently registered on the insecure HTTP variant at position 14.26.
- **Action**:
  1. Verify in host/CDN settings (Cloudflare, Vercel, or reverse proxy) that `http://canadamosquenearme.ca` returns an immediate HTTP 301 redirect to `https://canadamosquenearme.ca/`.
  2. This will prompt Googlebot to consolidate the 42 impressions and link signals directly into the HTTPS canonical URL, lifting its average position.

#### Priority 3: Align Homepage Canonical Trailing Slash in Sitemap
- **Finding**: In [`src/app/sitemap.ts`](file:///c:/Users/HP/Desktop/Canada%20Mosque%20Near%20Me/src/app/sitemap.ts#L13), the homepage entry is `${siteConfig.url}/` (`https://canadamosquenearme.ca/`), while Next.js metadata generates `<link rel="canonical" href="https://canadamosquenearme.ca"/>`.
- **Action**: Adjust `sitemap.ts` to output `${siteConfig.url}` for the root entry, ensuring character-for-character consistency across the sitemap and HTML `<link rel="canonical">` tag.

#### Priority 4: Optimize SERP Title & Description for "Near Me" Intent
- **Finding**: Current homepage title is `"Mosque Near Me in Canada | Find Mosques & Prayer Times | Canada Mosque Near Me"`.
- **Action**:
  - Keep the primary keyword `"Mosque Near Me in Canada"` at the very beginning of `<title>`.
  - Refine meta descriptions on both the Homepage and `/mosque-near-me` to include clear value propositions: *"Find mosques near your current location across Canada. Instant GPS directions, daily prayer times, and verified Jummah schedules in 9 Canadian metropolises."*

#### Priority 5: City & Regional Intent Hubs
- **Finding**: Search queries for "mosque near me" carry localized intent.
- **Action**:
  - Strengthen the existing regional hubs (`/mosques/toronto`, `/mosques/montreal`, `/mosques/calgary`, etc.) by adding contextual anchor text such as *"Find Mosques Near Me in Toronto"* or *"Calgary Mosque Directory"*.

---

## 10. Audit Summary & Compliance Verification

| Constraint / Directive | Compliance Status | Evidence |
| :--- | :---: | :--- |
| **No mosque data modified** | ✅ Fully Compliant | Zero modifications to JSON datasets in `src/data/`. |
| **No changes published or deployed** | ✅ Fully Compliant | Zero git commits, zero deployments triggered. |
| **No DNS changes made** | ✅ Fully Compliant | Audit conducted strictly within local filesystem. |
| **No broad refactoring** | ✅ Fully Compliant | Zero application code modifications. Read-only audit. |
| **Existing test suite verified** | ✅ Fully Compliant | `vitest run` passed: **358/358 tests passed** across 25 suites. |
| **Typecheck verified** | ✅ Fully Compliant | `tsc --noEmit` passed with 0 errors. |
