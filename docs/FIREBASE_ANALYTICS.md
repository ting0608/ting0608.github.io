# Firebase Analytics setup

This portfolio uses **Firebase Analytics** (Google Analytics 4) with **no backend**. Events are sent from the browser only.

## 1. Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/).
2. **Add project** (or use an existing one).
3. Enable **Google Analytics** when prompted and pick or create a GA4 property.

## 2. Register a Web app

1. In the project overview, click the **Web** icon (`</>`).
2. App nickname: e.g. `portfolio`.
3. Copy the `firebaseConfig` object values.

## 3. Local environment variables

1. Copy `.env.example` to `.env` in the repo root.
2. Fill in each value from Firebase **Project settings → General → Your apps → SDK setup**:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Restart the dev server: `npm run dev`.

If env vars are missing, the app still runs; analytics calls are skipped.

## 4. Deploy on GitHub Pages

Vite bakes `VITE_*` variables into the build at **build time**. Your site is built by GitHub Actions (`.github/workflows/deploy-pages.yml`).

### A. Add repository secrets

GitHub → your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add one secret for each key (same names as in `.env`):

| Secret name |
|-------------|
| `VITE_FIREBASE_API_KEY` |
| `VITE_FIREBASE_AUTH_DOMAIN` |
| `VITE_FIREBASE_PROJECT_ID` |
| `VITE_FIREBASE_STORAGE_BUCKET` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `VITE_FIREBASE_APP_ID` |
| `VITE_FIREBASE_MEASUREMENT_ID` |

Values can match your local `.env` (same Firebase web app).

### B. Redeploy

Push to `main` or run **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

The workflow passes these secrets into `npm run build` so analytics works on the live site.

> Never commit `.env` to Git (it is in `.gitignore`).

### C. Allow your GitHub Pages domain in Firebase

Firebase Console → **Project settings** → **General** → your web app → **Authorized domains**

Add your live host, for example:

- `yourusername.github.io` (user/org site)
- Or your custom domain if you use one

## 5. Verify events

1. Run the site locally with `.env` configured.
2. Open the site, click **Fist bump**, sidebar icons, scroll hints, roadmap years.
3. On the **live GitHub Pages** site, repeat after secrets are set and a new deploy finished.
4. In Firebase Console → **Analytics** → **DebugView** (with [GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjpiihkd)) or wait for **Events** (can take hours).

## Events tracked in this app

| Event | When | Parameters |
|-------|------|------------|
| `page_view` | App load | `page_path`, `page_title`, `page_location` |
| `like_clicked` | Hero fist bump | `location` (e.g. `hero`) |
| `button_click` | Nav, scroll hints, roadmap years, LinkedIn | `button_id` (e.g. `nav_roadmap`, `roadmap_year_2024`) |

### View counts in Firebase / GA4

1. **Analytics → Events** — event name and count (`like_clicked`, `button_click`).
2. **Explore** — build a report grouped by `button_id` custom parameter.
3. For fist bumps only, filter event name = `like_clicked`.

No database or “likes” storage: each click is only counted as an analytics event.

## 6. Optional: Google Analytics 4 UI

Firebase Analytics and GA4 share the same property if you enabled GA during setup. You can also use [analytics.google.com](https://analytics.google.com).

## Troubleshooting

- **No events locally** — Check `.env`, restart `npm run dev`, disable ad blockers, confirm `measurementId` starts with `G-`.
- **Works locally, not on GitHub Pages** — Add all seven `VITE_*` **repository secrets**, redeploy, and add `*.github.io` to Firebase **Authorized domains**.
- **Duplicate page views** — Normal in React Strict Mode during dev; production build fires once.
