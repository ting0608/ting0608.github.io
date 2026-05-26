# tingcccc Portfolio

React + Vite static portfolio. **No backend required** — hosted on **GitHub Pages**.

## Local development

```bash
npm install
npm run dev
```

## Customize

| What | Where |
|------|--------|
| Typing taglines | `src/data/typingLines.ts` |
| Carousel images | `public/carousel/` + `src/data/carousel.json` |
| Quotes (daily rotation) | `src/data/quotes.json` |
| Work / projects section | `src/sections/WorkSection.tsx` |
| Firebase Analytics | `.env` + [docs/FIREBASE_ANALYTICS.md](docs/FIREBASE_ANALYTICS.md) |

## Deploy to GitHub Pages

Deploys automatically on push to `main` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

1. Repo → **Settings** → **Pages** → Source: **GitHub Actions**.
2. Push to `main` (or run the workflow manually).
3. For **Firebase Analytics** on the live site, add `VITE_*` [repository secrets](docs/FIREBASE_ANALYTICS.md#4-deploy-on-github-pages) and redeploy.

## When you might want a backend later

Not needed now. Consider it only if you add:

- Contact form with email delivery
- Admin UI to edit quotes/projects without redeploying
- User accounts or a blog CMS

Options: serverless functions, a small API, or keep content in Git and redeploy (simplest).
