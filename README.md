# DuoPrompt

A responsive product website and functional browser teleprompter, built with React, TypeScript, and Vite. Fonts are bundled locally; no external API, account, or secret is required.

## Development

Use Node.js 22 or newer (validated with Node.js 24.19.0).

```sh
npm ci
npm run dev
```

In the managed cloud environment, use `npm ci --cache /workspace/.npm` because the default home-directory cache is not writable. The existing checkout is `/workspace/DuoPrompt-Website`; each cloud task is already isolated, so no additional Git worktree is needed.

## Build and validation

```sh
npm run build
npm run preview
npm test
```

The browser tests use system Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to your Chromium or Chrome executable on another machine. Playwright starts the development server automatically unless one is already running on port 5173.

Tests exercise landing-page navigation, FAQs, modal focus restoration, local script persistence, import/export, playback and pause, speed and text settings, mirroring, keyboard shortcuts, and mobile layout.

## Studio capabilities

- Edit a script or import a plain text file (up to 100 KB).
- Automatically save the current script in this browser's local storage.
- Export a text backup; local storage does not sync across devices.
- Adjust approximate reading speed (40–240 WPM), text size, and mirror mode.
- Play, pause, restart, and enter fullscreen where supported.
- Press Space while the reader is focused to play/pause; Escape closes the studio outside fullscreen.

The studio displays scripts only. It does not record video, access a camera, synchronize devices, process payments, or create accounts. All product messaging describes the implemented browser workflow; customer endorsements and unverified business metrics are intentionally absent.

## Deployment

`npm run build` generates a static site in `dist/`. Asset URLs are relative, so the site works both at a domain root and at the GitHub Pages repository path. No backend environment variables are needed.

The `Deploy DuoPrompt to GitHub Pages` workflow builds and deploys pushes to `main`. It can also be run manually from the repository's Actions tab.

One-time repository setup:

1. Open **Settings → Pages** in `cosmicnaaman/DuoPrompt-Website`.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions → Deploy DuoPrompt to GitHub Pages → Run workflow** if the initial run happened before Pages was enabled.

Once GitHub reports a successful deployment, the expected address is `https://cosmicnaaman.github.io/DuoPrompt-Website/`. The existence of the workflow or a successful local build alone does not mean the public site is live. Repository visibility is not changed by the workflow; GitHub Pages availability for private repositories depends on the account plan.

The visual identity, copy, and UI are original to this implementation. The supplied competitor URL could not be inspected because outbound access to that domain was blocked by the cloud environment policy.
