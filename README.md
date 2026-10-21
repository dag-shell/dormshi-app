# Dormshi 🛵

> Campus peer-to-peer food delivery and micro-escrow wallet Telegram Mini App.

Dormshi connects hungry students in campus dorms and libraries with fellow students who are already near dining halls, cafes, and campus food spots. It features an escrow-backed wallet system (ETB / Dormshi Coins) and runs entirely on **Telegram's Serverless Platform (`tgcloud`)** with a React + Vite frontend styled according to DoorDash Livery guidelines.

---

## 🚀 Quick Start & Local Development

Follow these steps to spin up the local development environment and test endpoints inside Telegram:

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Start the Frontend Development Server

Start Vite's local dev server:

```bash
npm run dev
```

By default, Vite will start serving the React application at `http://localhost:5173`.

---

### 3. Setup Local HTTPS with Caddy (`app.local`)

Telegram Mini Apps require an HTTPS connection to run inside Telegram Web and desktop clients. We use **Caddy** to provide automatic, locally-trusted SSL certificates and reverse-proxy traffic to Vite:

#### A. Add `app.local` to your hosts file (one-time setup)

Add `app.local` pointing to `127.0.0.1`:

```bash
# Linux / macOS:
echo "127.0.0.1 app.local" | sudo tee -a /etc/hosts
```

> On Windows, add `127.0.0.1 app.local` to `C:\Windows\System32\drivers\etc\hosts`.

#### B. Start Caddy on Your Device

Each developer sets up Caddy locally on their own machine to map `app.local` to Vite. In a separate terminal window, run:

```bash
caddy reverse-proxy --from app.local --to localhost:5173
```

*(Or configure your own local `Caddyfile` with `app.local { reverse_proxy localhost:5173 }` and run `caddy run`)*.

Now, opening `https://app.local` in your browser will securely load your local React app over HTTPS with local SSL.

---

### 4. Launch the Mini App in Telegram

1. Open Telegram (Desktop, Web, or Mobile).
2. Go to [@dormshibot](https://t.me/dormshibot).
3. Send `/start` or click the **"Open"** menu button at the bottom left of the chat window.
4. The Mini App will open within Telegram, loading your local code with authenticated `Telegram.WebApp.initData`.

---

### 5. Test Endpoints Using the Floating DevTool

Once the Mini App opens in Telegram:

1. Look for the floating **DevTool** button in the bottom-right corner of the screen.
2. Click the floating button to open the **Telegram Serverless DevTool Modal**.
3. Use the DevTool to:
   - Select and invoke any serverless endpoint (`users.me`, `orders.feed`, `orders.create`, `wallet.get`, `wallet.deposit`, etc.).
   - Edit the JSON `input` parameters on the fly.
   - Inspect the live responses, verified `ctx.initData`, and `EndpointError` output returned by the cloud isolate.

---

## 🛠 Project Architecture

| Folder | What it does |
| :--- | :--- |
| **`src/`** | Frontend React 18 + Vite + TanStack Router + Tailwind CSS Mini App. |
| **`src/devtool/`** | Floating DevTool component for testing serverless endpoints live in Telegram. |
| **`tgcloud/`** | Telegram serverless cloud code (V8 isolates running SQLite). |
| **`tgcloud/schema.js`** | Database schema definition using `@tgcloud/sdk` (`sdk/db`). |
| **`tgcloud/endpoints/`** | Flat directory of serverless functions called by the Mini App (`{resource}.{function}.js`). |
| **`tgcloud/handlers/`** | Telegram Bot API update handlers (`message.js`, etc.). |
| **`tgcloud.jsonc`** | Platform configuration pointing to the `dist` static build folder. |

---

## 📦 Deploying to Telegram Cloud

```bash
# 1. Build the frontend and push modules to tgcloud:
npm run deploy

# 2. If you modified tgcloud/schema.js, apply database migrations:
npx tgcloud migrate
```

---

## 📚 Documentation Reference

- **[Telegram Backend Guide](docs/tg-backend.md)**: Mental model, schema DSL, querying SQLite, `input`/`ctx` deep dive, and CLI workflow.
- **[Endpoints Specification](docs/endpoints.md)**: Full API contract, input/output schemas, and lifecycle sequence.
- **[Database Design & ERD](docs/db.md)**: Relational schema, normalization rules, and data dictionary.
- **[tgcloud SDK Reference](docs/tgcloud-sdk.md)**: Built-in `db`, `api`, `fetch`, and `console` API docs.
