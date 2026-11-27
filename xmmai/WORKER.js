/**
 * XMM AI — Groq API proxy for Cloudflare Workers
 * 1. Cloudflare dashboard -> your Worker -> paste this file -> Deploy
 * 2. Settings -> Variables and Secrets, add:
 *      GROQ_API_KEY  (secret)   = your Groq API key (starts with gsk_)
 *      MAX_OUT       (optional) = max output tokens per request (default 16384 = the model's ceiling)
 * 3. The model is forced to qwen/qwen3.8-27b for every request.
 *
 * NOTE: the old version clamped max_tokens to 900, which cut every generated file off.
 * The browser now decides how much to ask for (it knows your Groq tier); this Worker
 * only enforces the model's real ceiling.
 */

const MODEL = "qwen/qwen3.8-27b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_MAX_OUT = 16384; // Groq's documented max completion tokens for this model

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(request) });
    }

    const ceiling = Math.min(Number(env.MAX_OUT) || MODEL_MAX_OUT, MODEL_MAX_OUT);

    // Image generation (Cloudflare Workers AI, free daily allowance, no extra key)
    if (new URL(request.url).pathname === "/image") return handleImage(request, env);

    // Weather proxy (free keyless services, fetched from Cloudflare so it works for users in Iran)
    if (new URL(request.url).pathname === "/weather") return handleWeather(request);

    // Health check: open the Worker URL in a browser to see how it is configured
    if (request.method === "GET") {
      return json(request, 200, {
        ok: true,
        has_key: !!(env.GROQ_API_KEY || env.API_KEY),
        api_url: GROQ_URL,
        model: MODEL,
        max_output_tokens: ceiling
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors(request) });
    }

    const origin = request.headers.get("Origin") || "";
    const allowed = [
      "https://xmm-ai.com",
      "https://www.xmm-ai.com",
      "https://xmmai.vercel.app",
      "https://xmm-ai.pages.dev",
      "https://xmmai.freedev.app",
      "https://app-xmmai.github.io",
      "https://xmmcraft.qzz.io",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];
    const ok =
      !origin ||
      allowed.includes(origin) ||
      origin.endsWith(".vercel.app") || origin.endsWith(".xmm-ai.com") || origin.endsWith(".pages.dev") ||
      origin.endsWith(".workers.dev");
    // origin check relaxed: a 403 here was blocking some users (e.g. Persian replies); the key never leaves the Worker anyway
    if (!ok && !origin.startsWith("http")) {
      return new Response("Forbidden", { status: 403, headers: cors(request) });
    }

    const KEY = env.GROQ_API_KEY || env.API_KEY;
    if (!KEY) {
      return json(request, 500, { error: { message: "GROQ_API_KEY missing on Worker" } });
    }

    let payload;
    try { payload = await request.json(); } catch { payload = {}; }
    if (!payload || typeof payload !== "object") payload = {};

    payload.model = MODEL;
    // Respect what the client asks for, but never exceed the model's real limit.
    payload.max_tokens = Math.max(16, Math.min(Number(payload.max_tokens) || 1024, ceiling));
    delete payload.max_completion_tokens;
    delete payload.response_format;
    delete payload.reasoning_format;
    // No hidden thinking = much faster first token (the client also sends /no_think).
    if (!payload.reasoning_effort) payload.reasoning_effort = "none";

    let groqRes = await callGroq(payload, KEY);

    // If this model/account rejects reasoning_effort, retry once without it.
    if (groqRes.status === 400 && payload.reasoning_effort) {
      const txt = await groqRes.clone().text();
      if (/reasoning/i.test(txt)) {
        delete payload.reasoning_effort;
        groqRes = await callGroq(payload, KEY);
      }
    }

    if (!groqRes.ok) {
      const txt = await groqRes.text();
      let msg = txt.slice(0, 300);
      try {
        const j = JSON.parse(txt);
        msg = (j.error && (j.error.message || j.error)) || j.message || msg;
      } catch {}
      return json(request, groqRes.status, {
        error: {
          message: `Upstream ${groqRes.status} from ${new URL(GROQ_URL).host} (model ${MODEL}): ${
            typeof msg === "string" ? msg : JSON.stringify(msg)
          }`
        }
      });
    }

    const headers = new Headers(groqRes.headers);
    Object.entries(cors(request)).forEach(([k, v]) => headers.set(k, v));
    return new Response(groqRes.body, { status: groqRes.status, headers });
  }
};

function callGroq(payload, key) {
  return fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload)
  });
}

function json(request, status, obj) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { ...cors(request), "Content-Type": "application/json" }
  });
}

function cors(request) {
  const origin = request.headers.get("Origin") || "https://xmmai.vercel.app";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}


/* ---------- IMAGES: Cloudflare Workers AI (free DAILY allowance, works from Iran) ----------
 * Setup: Worker -> Settings -> Bindings -> Add -> Workers AI -> Variable name: AI
 * Free plan: 10,000 neurons per day, resets every day (no monthly limit).
 * One image per 20 seconds per user IP address.
 */
const IMG_COOLDOWN = 20; // seconds, per user IP

async function handleImage(request, env) {
  if (request.method !== "POST") return json(request, 405, { error: "POST only" });
  const origin = request.headers.get("Origin") || "";
  const okOrigin =
    !origin ||
    origin.endsWith(".vercel.app") || origin.endsWith(".pages.dev") ||
    origin.endsWith(".workers.dev") ||
    origin.endsWith(".freedev.app") ||
    origin === "https://xmm-ai.com" || origin === "https://www.xmm-ai.com" || origin.endsWith(".xmm-ai.com") ||
    origin === "https://app-xmmai.github.io" ||
    origin === "https://xmmcraft.qzz.io" ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1");
  if (!okOrigin) return json(request, 403, { error: "Forbidden origin" });
  if (!env.AI) return json(request, 500, { error: "Workers AI binding missing: add a binding named AI" });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const cache = caches.default;
  const ckey = new Request("https://xmm-cooldown.local/" + encodeURIComponent(ip));
  const hit = await cache.match(ckey);
  if (hit) {
    const t = Number(hit.headers.get("X-Until")) || 0;
    const wait = Math.max(1, Math.ceil((t - Date.now()) / 1000));
    return json(request, 429, { error: "Cool down: wait " + wait + "s", wait });
  }
  await cache.put(ckey, new Response("1", {
    headers: { "Cache-Control": "max-age=" + IMG_COOLDOWN, "X-Until": String(Date.now() + IMG_COOLDOWN * 1000) }
  }));

  let b = {};
  try { b = await request.json(); } catch {}
  const prompt = String(b.prompt || "").slice(0, 1000);
  if (!prompt) return json(request, 400, { error: "No prompt" });
  const snap = (n) => Math.max(256, Math.min(1024, Math.round((Number(n) || 1024) / 64) * 64));
  const w = snap(b.width), h = snap(b.height);

  const flux = () => env.AI.run("@cf/black-forest-labs/flux-1-schnell", { prompt, steps: 6 });
  const sdxl = () => env.AI.run("@cf/bytedance/stable-diffusion-xl-lightning", { prompt, width: w, height: h });
  const dream = () => env.AI.run("@cf/lykon/dreamshaper-8-lcm", { prompt, width: Math.min(w, 768), height: Math.min(h, 768) });
  const runs = w === h ? [flux, sdxl, dream] : [sdxl, flux, dream];

  let lastErr = "";
  for (const run of runs) {
    try {
      const out = await run();
      let data;
      if (out && typeof out === "object" && out.image) data = "data:image/jpeg;base64," + out.image;
      else {
        const u8 = new Uint8Array(await new Response(out).arrayBuffer());
        let bin = "";
        for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
        data = "data:image/png;base64," + btoa(bin);
      }
      if (data.length > 2000) return json(request, 200, { image: data });
    } catch (e) {
      lastErr = String((e && e.message) || e).slice(0, 160);
    }
  }
  await cache.delete(ckey);
  return json(request, 502, { error: "Image engines failed: " + lastErr });
}


/* ---------- WEATHER: GET /weather?q=City or ?lat=..&lng=..&q=Label ----------
 * Uses Open-Meteo + OpenStreetMap (Nominatim) and falls back to wttr.in. No keys needed.
 * The browser calls this Worker, so users where those sites are blocked (Iran) still get weather. */
async function handleWeather(request) {
  const u = new URL(request.url);
  const q = (u.searchParams.get("q") || "").replace(/\s+/g, " ").trim().slice(0, 80);
  const lat = u.searchParams.get("lat"), lng = u.searchParams.get("lng");
  const get = async (url, ms = 8000) => {
    const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
    try {
      const r = await fetch(url, { signal: c.signal, headers: { "User-Agent": "xmm-ai.com weather proxy", Accept: "application/json" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  };
  let hit = null;
  if (lat && lng && !isNaN(+lat) && !isNaN(+lng)) hit = { lat: +lat, lng: +lng, label: q || "Weather" };
  else if (q) {
    const ws = q.replace(/[,،]/g, " ").split(" ").filter(Boolean);
    const cands = [q];
    for (let n = ws.length - 1; n >= 1; n--) cands.push(ws.slice(0, n).join(" "));
    for (const c of cands) {
      if (hit) break;
      try {
        const g = await get("https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=" + encodeURIComponent(c), 5000);
        const r = g.results && g.results[0];
        if (r) hit = { lat: r.latitude, lng: r.longitude, label: r.name + (r.admin1 ? ", " + r.admin1 : "") + (r.country ? ", " + r.country : "") };
      } catch {}
    }
    if (!hit) {
      try {
        const n = await get("https://nominatim.openstreetmap.org/search?format=json&accept-language=en&limit=1&q=" + encodeURIComponent(q), 6000);
        if (n && n[0]) hit = { lat: +n[0].lat, lng: +n[0].lon, label: String(n[0].display_name).split(",").slice(0, 3).join(",").trim() };
      } catch {}
    }
  }
  if (hit) {
    try {
      const om = await get("https://api.open-meteo.com/v1/forecast?latitude=" + hit.lat + "&longitude=" + hit.lng +
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7", 9000);
      return wjson(request, { label: hit.label, om });
    } catch {}
  }
  if (q) {
    for (const name of [q, q.split(/[ ,]+/)[0]]) {
      try { return wjson(request, { label: q, wttr: await get("https://wttr.in/" + encodeURIComponent(name) + "?format=j1", 9000) }); } catch {}
    }
  }
  return json(request, 404, { error: "Place not found" });
}

function wjson(request, obj) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { ...cors(request), "Content-Type": "application/json", "Cache-Control": "public, max-age=600" }
  });
}
