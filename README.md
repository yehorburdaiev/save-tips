# Save tips — checkout prototype

Vite + React. Run locally: `npm install` → `npm run dev`.

## GitHub Pages (one-time setup)

If **Deploy to GitHub Pages** fails on the deploy job with **404 / Failed to create deployment**:

1. Open the repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Re-run the workflow: **Actions** → failed workflow → **Re-run all jobs**

After a green run, the site URL is shown under **Settings → Pages** (usually `https://<user>.github.io/<repo>/`).
