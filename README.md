# Comfone — Beyond borders

An editorial redesign proposal for Comfone, with 23 internal pages and a responsive homepage.

## Development

No dependencies are required. Use Node.js 24 or later to regenerate the pages:

```sh
node build-pages.mjs
python3 -m http.server 4173 --directory dist
```

Edit the homepage in `source/home.html`, page content in `source/content.mjs`, shared page templates in `build-pages.mjs`, and CSS/JavaScript in `dist`.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` generates pages, adjusts URLs for `/comfone-site/`, and deploys `_site` on pushes to `main`.

```sh
node build-pages.mjs
node scripts/build-github-pages.mjs /comfone-site
```

Full articles and job applications link to Comfone's official channels. Content is adapted from https://www.comfone.com/ and satellite imagery is credited to NASA / NOAA. This repository is a redesign proposal, not the official Comfone website.
