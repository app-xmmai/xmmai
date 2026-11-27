<div align="center">

<img src="chat/icon-512.png" alt="XMM AI icon" width="120" height="120" />

# XMM AI

**Your smart assistant. Instantly.**

Chat, analyze images, create images, write code and more, all in one fast, private AI app that runs in your browser and installs like a native app.

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://xmm-ai.com)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)](#-install-as-an-app)
[![Cloudflare Workers](https://img.shields.io/badge/backend-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](#-architecture)
[![No build step](https://img.shields.io/badge/build-none-brightgreen)](#-getting-started)
[![Languages](https://img.shields.io/badge/languages-5-blue)](#-languages)

[**Live site**](https://xmm-ai.com) · [**Open the chat**](https://xmm-ai.com/chat/) · [**Install on your phone**](https://app.xmm-ai.com/?install=1) · [**Report a bug**](../../issues)

</div>

---

## Table of contents

- [About](#-about)
- [Features](#-features)
- [Screens and pages](#-screens-and-pages)
- [Architecture](#-architecture)
- [Project structure](#-project-structure)
- [Getting started](#-getting-started)
- [Configuration](#-configuration)
- [Deploying the backend (Cloudflare Workers)](#-deploying-the-backend-cloudflare-workers)
- [Deploying the site](#-deploying-the-site) (Vercel, GitHub Pages, Cloudflare Pages)
- [Install as an app](#-install-as-an-app)
- [Languages](#-languages)
- [Privacy and your data](#-privacy-and-your-data)
- [Security notes](#-security-notes)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About

XMM AI is a complete AI assistant that lives in a plain static website. There is no framework, no bundler and no build step: you upload the files and it works.

The browser talks to two small **Cloudflare Workers** that act as proxies. One hides the text model API key, and the other generates images. Because the keys never reach the browser, the site stays safe to host publicly on any static host.

Everything a user creates (chats, profile, settings, notebooks, projects) is stored **on their own device**, not on a server.

## ✨ Features

### 🎬 Cinematic UI
- Short film-style intro (letterbox curtain, lens flare, title card). Cold start ~1.7s, warm start ~0.65s, tap or press Enter to skip, plain fade with reduced motion
- Orange and teal colour grade, light film grain, soft vignette and a pointer spotlight on desktop
- Messages, dialogs and the greeting animate in like shots; everything is transform/opacity only so it stays fast (see `chat/cinema.css`, `chat/cinema.js`)

### 💬 Chat
- Fast streaming chat with a clean, modern interface
- Markdown rendering, code blocks and rich interactive reply cards (the AI can answer with `xmm-TYPE` JSON blocks that are rendered as widgets)
- Per-conversation history, search and a chat sidebar
- "AI memory" setting and a per-user display name
- Long answers are summarized into collapsible steps, and long sent messages collapse to keep the thread tidy

### 🖼️ Imagine (image generation)
- Describe an image in chat and it gets generated, with no separate tab required
- Studio with style presets (Auto, Realistic, Anime, 3D, Painting, Neon, Minimal) and aspect ratios (1:1, 16:9, 9:16, 4:3)
- Powered by **FLUX.1-schnell on Cloudflare Workers AI**, with an automatic fallback to **Pollinations** when the daily allowance runs out or the Worker fails
- Built-in cooldown of one image per 20 seconds per user to protect the free allowance
- Animated loading state while an image is being made

### 👁️ Analyze
- Upload photos, screenshots, charts or documents and ask questions about them
- Drag and drop files anywhere, or use the **+** upload dialog (Images or Code)
- Accepts a wide range of code and text formats (JS/TS, HTML/CSS, Python, JSON, Java, C/C++, Go, Rust, SQL, YAML, Markdown, CSV and many more)

### 🧑‍💻 Code agent
- Describe a website or app and XMM AI builds a **multi-file project**
- **Live preview** while it builds
- **Auto-fix** when generated code has errors
- Export as **ZIP** or a single **.html** file
- Large projects are written in chunks and stitched together automatically, so long files are not cut off

### 📓 Notebooks
- Quick notes next to your chats, with search and a "New note" button

### 🎙️ Voice mode
- Full-screen live voice space with an animated orb, a live words pill and an end button
- Uses the browser's built-in speech recognition

### 🌐 Multilingual
- Full UI and AI reply language switching in five languages (see [Languages](#-languages))
- Right-to-left layouts for Persian and Arabic

### 🫧 Liquid glass interface
- Glass surfaces with real refraction on Chromium browsers (Chrome, Edge, Brave, Opera, Android Chrome)
- Safari, Firefox and iOS get the same look through a CSS fallback with blur, saturation, specular rim and a faked lens falloff
- Springy tap animations, a selection pill that glides to the button you tap, and smooth transitions between screens
- Reduced-motion preferences are respected

### 📱 Installable and offline-friendly
- Full **Progressive Web App**: add it to your home screen on iPhone, iPad, Android or desktop
- Service worker with a network-first strategy and a cached fallback
- **Auto-update**: installed apps and open tabs keep themselves in sync with the latest site files
- Maskable icons, Apple touch icon, favicons from 48px to 192px

### 🔒 Privacy first
- Chats, profile and settings stay on the device
- No ads, no tracking
- Cookie banner with **Accept all** and **Accept only necessary**
- Logging out also deletes chats
- Dedicated **Privacy Policy** and **Terms of Use** pages

## 🗺️ Screens and pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, feature sections, desktop downloads (Linux, Windows, Mac), mobile install, FAQ ("Did you know?") |
| `/chat/` | The main app: chats, Imagine, Code, Notebooks, settings, voice mode |
| `/login/` | Simple sign-in: pick a name and start. Everything stays on the device |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |

`/privacy.html` and `/terms.html` automatically redirect (permanently) to the clean URLs.

## 🏗️ Architecture

```
                    ┌──────────────────────────────┐
                    │        Browser / PWA         │
                    │  index.html  ·  /chat/ app   │
                    │  chats, notes, settings are  │
                    │  stored in local storage     │
                    └───────┬───────────────┬──────┘
                            │               │
                  text / chat│               │image requests
                            ▼               ▼
              ┌──────────────────┐   ┌────────────────────────┐
              │  Cloudflare      │   │  Cloudflare image      │
              │  Worker          │   │  Worker                │
              │  (WORKER.js)     │   │  (WORKER-IMAGE.js)     │
              │  holds the key   │   │  Workers AI · FLUX     │
              └────────┬─────────┘   └───────────┬────────────┘
                       │                         │ on failure / daily limit
                       ▼                         ▼
              ┌──────────────────┐   ┌────────────────────────┐
              │  Groq API        │   │  Pollinations (free)   │
              │  (text model)    │   │  fallback              │
              └──────────────────┘   └────────────────────────┘
```

**Why this design?**

- **Static front end.** Nothing to compile. Any static host works.
- **Keys stay secret.** The Groq key lives only in a Cloudflare Worker secret. The front end ships with `GROQ_KEY: ""` on purpose.
- **Origin checks.** Both Workers only accept requests from approved origins (your Vercel / Pages / Workers domains and localhost for development).
- **Graceful degradation.** If the image Worker fails or runs out of free daily allowance, the site falls back to Pollinations automatically.

## 📁 Project structure

```
xmmai/
├── index.html                 # Landing page
├── login/index.html           # Sign-in page
├── privacy/index.html         # Privacy Policy
├── terms/index.html           # Terms of Use
│   ├── index.html
├── chat/                      # The app
│   ├── index.html             # App shell
│   ├── app.js                 # Core chat logic
│   ├── config.js              # Public settings (Worker URLs, models, tier)
│   ├── code.js / code-ui.css  # Code agent: multi-file projects, preview, auto-fix, export
│   ├── img.js / imgrace.js    # Image studio and image engine (Worker, then fallback)
│   ├── limit.js               # Per-user image cooldown
│   ├── upload.js              # Upload dialog and drag-and-drop
│   ├── widgets.js / .css      # Rich interactive reply cards
│   ├── voice-ui.js / .css     # Voice mode
│   ├── video-ui.js / .css     # Top bar, pill composer, menus, animations
│   ├── liquid.js / .css       # Liquid glass behavior and styling
│   ├── glass.js               # Glass refraction engine
│   ├── redesign.js / .css     # Sidebar and layout redesign
│   ├── pro.js / .css          # Settings (tabbed UI)
│   ├── settings-ui.css        # Settings styling
│   ├── companion.js / .css    # Phone tweaks, update popup
│   ├── summary.js             # Step summaries
│   ├── grow.js / fx.js        # Tap and transition animations, selection pill
│   ├── space.js               # Animated space background on login
│   ├── lang.js                # Translations (de, en, fa, ar, es)
│   ├── update.js              # Auto-update logic
│   ├── sw.js                  # Service worker (chat scope)
│   ├── manifest.webmanifest   # PWA manifest
│   ├── styles.css             # Base styles
│   └── icon-*.png / icon.svg  # App icons (any + maskable)
├── media/                     # Hero video and poster
├── sw.js                      # Root service worker
├── mcp.json                   # MCP server config
├── vercel.json                # Redirects and cache headers
├── sitemap.xml · robots.txt   # SEO
├── favicon*.png · favicon.ico · apple-touch-icon.png · icon.svg
├── WORKER.js                  # Text proxy Worker (Cloudflare)
├── WORKER-IMAGE.js            # Image Worker (Cloudflare Workers AI)
└── SETUP-CLOUDFLARE.txt       # Short setup notes for the Workers
```

## 🚀 Getting started

You only need a static file server. There is no `npm install` and no build step.

### Run locally

```bash
# 1. Clone
git clone https://github.com/xmmcraft/xmmai.git
cd xmmai

# 2. Serve the folder (pick one)
python3 -m http.server 5500
# or
npx serve -l 5500 .
```

Open **http://localhost:5500** for the landing page and **http://localhost:5500/chat/** for the app.

> Port `5500` (and `3000`) is used on purpose: the Workers already allow `localhost:5500` and `localhost:3000` as development origins.

> Note: `/privacy` and `/terms` use clean URLs. A plain static server may need `/privacy/` (with the trailing slash) or a host that supports clean URLs, such as Vercel.

## ⚙️ Configuration

All public settings live in [`chat/config.js`](chat/config.js):

```js
window.XMM_CONFIG = {
  GROQ_KEY: "",                       // Leave empty. The real key is a Worker secret.
  GROQ_PROXY: "https://YOUR-TEXT-WORKER.workers.dev",
  TIER: "free",                       // "free" or "dev" (see below)
  IMAGE_PROXY: "https://YOUR-IMAGE-WORKER.workers.dev",
  HF_TOKEN: "",                       // Optional Hugging Face read token (hf_...)
  FALLBACK_MODELS: [],                // Optional extra models to try if the main one fails

  TEXT_MODEL:   "qwen/qwen3.8-27b",
  FAST_MODEL:   "qwen/qwen3.8-27b",
  SMART_MODEL:  "qwen/qwen3.8-27b",
  CODE_MODEL:   "qwen/qwen3.8-27b",
  VISION_MODEL: "qwen/qwen3.8-27b"
};
```

| Option | What it does |
| --- | --- |
| `GROQ_KEY` | **Keep empty.** Never put a real key in front-end files. |
| `GROQ_PROXY` | URL of your text Worker (`WORKER.js`). |
| `IMAGE_PROXY` | URL of your image Worker (`WORKER-IMAGE.js`). |
| `TIER` | `"free"` is about 8K tokens/minute, so big sites are built in chunks with short waits. `"dev"` is for the Groq Developer plan (about 250K tokens/minute) and lets big files stream in one go. Switch to `"dev"` after upgrading for the biggest speed-up. |
| `HF_TOKEN` | Optional free Hugging Face token that gives visitors a bigger free image allowance. |
| `*_MODEL` | Which model is used for each task. The Worker currently forces `qwen/qwen3.8-27b` for every request. |

## ☁️ Deploying the backend (Cloudflare Workers)

You need a free [Cloudflare](https://dash.cloudflare.com) account and a [Groq](https://console.groq.com) API key.

### 1. Text Worker (hides your Groq key)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → create a Worker.
2. Paste the contents of [`WORKER.js`](WORKER.js) and **Deploy**.
3. Go to **Settings → Variables and Secrets** and add a secret:
   - `GROQ_API_KEY` = your Groq key (starts with `gsk_`)
   - *(optional)* `MAX_OUT` = lower ceiling for output tokens (default `16384`, the model's maximum)
4. Copy the Worker URL and put it in `chat/config.js` as `GROQ_PROXY`.
5. Open the Worker URL in a browser. It shows a health check with `has_key` and `max_output_tokens`, so you can confirm it is configured.

### 2. Image Worker (FLUX on Workers AI)

1. Create a second Worker and paste [`WORKER-IMAGE.js`](WORKER-IMAGE.js).
2. **Settings → Bindings → Add → Workers AI**, variable name exactly **`AI`**.
3. Deploy and copy the URL into `chat/config.js` as `IMAGE_PROXY`.

**Limits to know about**

- Free plan: 10,000 neurons per **day** (resets daily). FLUX at 4 steps gives well over 100 images a day.
- Each user can generate 1 image every 20 seconds.
- When the daily allowance is used up, the site falls back to Pollinations automatically.

### 3. Allowed origins

Both Workers check the request origin. By default they accept your `*.vercel.app`, `*.pages.dev` and `*.workers.dev` domains, `https://app-xmmai.github.io`, `https://xmmcraft.qzz.io` and `localhost:5500` / `localhost:3000`. If you host on another domain, add it to the allowed list in both Workers (`WORKER.js` has two places, `WORKER-IMAGE.js` has one) and redeploy them.

## 🌍 Deploying the site

### Vercel (recommended)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Other**. No build command, no output directory.
4. Deploy. `vercel.json` already handles the redirects and icon caching.

### GitHub Pages

The site uses root-absolute paths (`/chat/`, `/privacy`, `/icon.svg`, the PWA manifest and the service worker scope), so it must be served from the **root of a domain**, not from a sub-path like `username.github.io/xmmai/`.

**Option A: user site (free, simplest).** Name the repo `app-xmmai.github.io` (your GitHub account or organization name + `.github.io`), put the files at the repo root, and the site is live at `https://app-xmmai.github.io`.

**Option B: any repo name + custom domain.** In the repo go to **Settings → Pages**, set the source to your branch (`main`, folder `/ (root)`), and under **Custom domain** enter your domain (for example `xmmcraft.qzz.io`). GitHub creates a `CNAME` file for you. Add a DNS `CNAME` record pointing the domain to `app-xmmai.github.io`, then tick **Enforce HTTPS**.

Then:

1. Push the files to the repo (`index.html` must be at the root, with `chat/` next to it).
2. **Settings → Pages → Build and deployment → Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
3. Wait a minute or two. The URL appears at the top of the Pages settings.
4. Make sure both Workers accept your Pages origin (see [Allowed origins](#3-allowed-origins)). Without this the chat gets a `403 Forbidden`.

Notes for GitHub Pages:

- `vercel.json` is ignored there. That is fine: `/privacy` and `/terms` still work because GitHub Pages redirects `/privacy` to `/privacy/` automatically.
- Update the domain in `sitemap.xml` and `robots.txt` to your Pages address.
- Pages caches files for about 10 minutes. If an installed app looks stale after an update, bump the cache name in `chat/sw.js`.

### Cloudflare Pages / any static host

Upload the folder contents so that `index.html` is at the root and `chat/` is a sub-folder (the app must be reachable at `/chat/`).

After deploying, update the domain in [`sitemap.xml`](sitemap.xml) and [`robots.txt`](robots.txt) if it differs from `xmmai.vercel.app`.

## 📲 Install as an app

XMM AI is a PWA, so no app store is needed.

**iPhone / iPad**
1. Open XMM AI in **Safari**.
2. Tap **Share**.
3. Tap **Add to Home Screen**, then **Add**.

**Android**
1. Open XMM AI in **Chrome**.
2. Tap the **⋮** menu.
3. Tap **Install app** (or **Add to Home screen**), then **Install**.

**Desktop**
Use the install icon in the address bar of Chrome or Edge to open XMM AI in its own focused window.

Tap **Install the App** on the landing page. It opens app.xmm-ai.com and shows the install popup.

## 🌐 Languages

The interface and the AI's reply language can be switched live:

| Language | Code | Direction |
| --- | --- | --- |
| English | `en` | LTR |
| Deutsch | `de` | LTR |
| فارسی (Persian) | `fa` | RTL |
| العربية (Arabic) | `ar` | RTL |
| Español | `es` | LTR |

Translations live in [`chat/lang.js`](chat/lang.js). To add a language, add a new key with the translated strings and a button in the language picker.

## 🔐 Privacy and your data

- Chats, profile, notes and settings are stored in the browser's local storage **on the user's device**.
- There are no user accounts, emails or passwords. Sign-in is just a display name.
- **Log out** also deletes chats. **Delete all chats** is available in settings.
- No advertising and no tracking. Optional storage only remembers language and display preferences.
- Messages are sent through the Workers to the AI provider to generate replies. See the [Privacy Policy](privacy/index.html) page for the full text.

## 🛡️ Security notes

- **Never commit real API keys.** The front end is public. Keep `GROQ_KEY` empty and store the key only as a Cloudflare Worker secret.
- If a key was ever shipped in front-end code in an older build, **revoke it** in the Groq console and create a new one.
- Restrict the Workers' allowed origins to the domains you actually use.
- If you add a `.env` file for any local tooling, make sure it is listed in `.gitignore`.

## 🧯 Troubleshooting

| Problem | Fix |
| --- | --- |
| Chat replies never arrive | Open your text Worker URL in a browser. If `has_key` is `false`, the `GROQ_API_KEY` secret is missing. Also check that `GROQ_PROXY` in `chat/config.js` is correct. |
| `Forbidden` (403) from a Worker | Your site's domain is not in the Worker's allowed origins. Add it and redeploy the Worker. |
| Long files get cut off | Re-paste the latest `WORKER.js`. It no longer clamps output to 900 tokens. If you are on the free tier, big sites are built in chunks, so expect short waits between them. |
| Images fail or are slow | Check the image Worker has the `AI` binding. After the daily free allowance is used, images come from the Pollinations fallback. |
| "Cool down: wait Ns" | Expected. Each user can make 1 image per 20 seconds. |
| Installed app shows old version | The app auto-updates when online. Close and reopen it, or bump the cache name in `chat/sw.js`. |
| Voice mode does nothing | The browser needs speech recognition support and microphone permission. |
| `/privacy` returns 404 locally | Use `/privacy/` with a trailing slash on a plain static server, or deploy to a host with clean URLs. |

## 🧭 Roadmap

- [ ] More models selectable from settings
- [ ] Optional cloud sync for chats (opt-in)
- [ ] Image editing and variations
- [ ] More languages
- [ ] Desktop builds for Linux, Windows and Mac

*Have an idea? Open an [issue](../../issues).*

## 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Make your changes and test them locally
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Open a Pull Request

Please keep the project dependency-free (plain HTML, CSS and JavaScript) and never include secrets in a commit.

## 📄 License

Copyright © XMMAI. All rights reserved.

If you want others to be able to reuse the code, add a `LICENSE` file (for example MIT) and replace this section with a license badge.

---

<div align="center">

**XMM AI**: Your smart assistant. Instantly.

[Live site](https://xmm-ai.com) · [Chat](https://xmm-ai.com/chat/) · [Privacy](https://xmm-ai.com/privacy) · [Terms](https://xmm-ai.com/terms)

</div>
<!-- XMM AI v4.0.2 -->
