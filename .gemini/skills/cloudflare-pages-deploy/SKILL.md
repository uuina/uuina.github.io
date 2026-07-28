---
name: cloudflare-pages-deploy
description: Instructions for deploying uuina's personal website d:\34728\uuina.github.io to Cloudflare Pages project uuina-home and handling asset cache busters.
---

# Cloudflare Pages Deployment & Cache Management Skill

## Deployment Command
This project (`d:\34728\uuina.github.io`) is associated with Cloudflare Pages project **`uuina-home`** (custom domain `hnnilovey.me`).
Because it uses Wrangler CLI deployment instead of GitHub Git Webhook triggers:

1. Always push to Git:
   ```bash
   git add .
   git commit -m "<commit message>"
   git push origin main
   ```
2. **ALWAYS** deploy directly using Wrangler CLI immediately after pushing to Git:
   ```bash
   npx wrangler pages deploy . --project-name uuina-home
   ```

## Asset Cache Busting Invariant
Whenever modifying `style.css` or `app.js`, bump the query string version in `index.html`:
```html
<link rel="stylesheet" href="style.css?v=6.0">
<script src="app.js?v=6.0"></script>
```
Increment the version number (e.g. `v6.0` -> `v7.0`) to force browsers and CDN edges to bypass local static file cache.
