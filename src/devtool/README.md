# Telegram Serverless DevTool

A floating, interactive DevTool widget designed to test serverless endpoints in Telegram Mini Apps.

---

## How it works

1. **Auto-Discovered Endpoints**:
   - Directly scans `tgcloud/endpoints/*.js` (e.g. `hello.js`, `ping.js`).
   - Populates them into a clean dropdown selector.
   - Hot-reloads whenever you add a new `.js` file to `tgcloud/endpoints/`.

2. **Calling Endpoints**:
   - In production on Telegram Cloud (`tgcloud`), calls `Telegram.WebApp.Serverless.call(name, payload, cb)`.
   - In local development or webview, calls the endpoint with verified `initData` from `@tma.js/sdk` via Vite's dev server runner.

3. **No extra config needed**:
   - Mount `<DevTool />` at root (`src/app/__root.tsx`).
   - Active automatically in development or with `?devtool=true` in Telegram test bots.
