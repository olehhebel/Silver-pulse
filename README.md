# Silver-pulse

Static mobile-first onboarding web app built with plain HTML, CSS, and vanilla JavaScript.

## Project Structure

- `index.html` - full shell preview with progress and navigation chrome
- `launch.html` - clean mobile launch entry for production publishing
- `styles.css` - responsive layout and base styling
- `script.js` - onboarding state, rendering, and navigation
- `assets/` - local PNG artwork used by the onboarding screens
- `manifest.webmanifest` - standalone mobile web app metadata
- `.github/workflows/deploy-pages.yml` - GitHub Pages deployment workflow

## Getting Started

Open `index.html` in a browser to preview the full shell.

Open `launch.html` in a browser to preview the published mobile-only launch mode.

## Status

This repository is self-contained and no longer depends on temporary Figma localhost asset URLs. The visuals are served from local PNG files in `assets/` and can be replaced with final product artwork later.

The production launch page hides the onboarding shell UI and opens directly into the adapted mobile app view while preserving the existing visuals, transitions, and interactions.