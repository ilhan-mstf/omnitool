# 🚀 Release Checklist: Omnitool

Follow these steps rigorously before pushing a new version tag (e.g., `v0.1.2`).

## 1. Code Quality & Stability
- [ ] Run backend tests: `cd omnitool/src-tauri && cargo test`
- [ ] Run frontend tests: `cd omnitool && npm run test`
- [ ] Run production build locally: `cd omnitool && npm run build`
- [ ] Clean up `console.log` statements and unused imports (`npm run build` will catch these).

## 2. Version Synchronization
- [ ] Update version in `omnitool/src-tauri/Cargo.toml`
- [ ] Update version in `omnitool/src-tauri/tauri.conf.json`
- [ ] Update hardcoded version in `omnitool/src/App.tsx` (sidebar footer).

## 3. Homebrew Tap (External)
- [ ] Update version in your `homebrew-tap` repo (`Casks/omnitool.rb`).
- [ ] Verify the download URLs in the Ruby file match the new tag.

## 4. Distribution & Landing Page
- [ ] Update version badge in `README.md`.
- [ ] Update "Latest Release" links in `landing-page/index.html`.
- [ ] Update the "Features" section if new tools were added.

## 5. Deployment
- [ ] Commit all changes: `git add . && git commit -m "chore: prepare for vX.Y.Z release"`
- [ ] Push to main: `git push origin main`
- [ ] Create and push tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
- [ ] Verify GitHub Actions build success for all platforms (Windows, macOS, Linux).

---
*Note: This checklist ensures we never have a "version desync" error again.*
