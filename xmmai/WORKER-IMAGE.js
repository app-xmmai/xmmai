/**
 * XMM AI — image Worker (Cloudflare Workers AI, FLUX.1-schnell)
 * Deploy as https://xmmai-image.xbm-bayat.workers.dev
 *  1. Worker -> Settings -> Bindings -> Add -> Workers AI -> Variable name: AI   (exactly "AI")
 *  2. Paste this file, Deploy. No API key needed.
 * Free plan: 10,000 neurons per DAY (resets daily). 4 steps keeps the cost low so
 * you get well over 100 images a day at 1024x1024.
 * When the daily allowance is used up this returns an error and the site
 * automatically falls back to Pollinations.
 */
const COOLDOWN = 20; // seconds per user IP
const STEPS = 4;     // FLUX schnell's native setting; more steps = fewer images per day

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request) });
    if (request.method === "GET") return json(request, 200, { ok: true, ai_binding: !!env.AI, model: "flux-1-schnell", steps: STEPS });
    if (request.method !== "POST") return json(request, 405, { error: "POST only" });

    const origin = request.headers.get("Origin") || "";
    const okOrigin = !origin || origin.endsWith(".vercel.app") || origin.endsWith(".xmm-ai.com") || origin.endsWith(".pages.dev") || origin.endsWith(".workers.dev") ||
      origin.endsWith(".freedev.app") || origin==="https://xmm-ai.com" || origin==="https://www.xmm-ai.com" ||
      origin === "https://app-xmmai.github.io" || origin === "https://xmmcraft.qzz.io" || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
    if (!okOrigin) return json(request, 403, { error: "Forbidden origin" });
    if (!env.AI) return json(request, 500, { error: "Workers AI binding missing: add a binding named AI" });

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const cache = caches.default;
    const ckey = new Request("https://xmm-cooldown.local/" + encodeURIComponent(ip));
    const hit = await cache.match(ckey);
    if (hit) {
      const wait = Math.max(1, Math.ceil(((Number(hit.headers.get("X-Until")) || 0) - Date.now()) / 1000));
      return json(request, 429, { error: "Cool down: wait " + wait + "s", wait });
    }
    await cache.put(ckey, new Response("1", {
      headers: { "Cache-Control": "max-age=" + COOLDOWN, "X-Until": String(Date.now() + COOLDOWN * 1000) }
    }));

    let b = {};
    try { b = await request.json(); } catch {}
    const prompt = String(b.prompt || "").slice(0, 1000);
    if (!prompt) { await cache.delete(ckey); return json(request, 400, { error: "No prompt" }); }

    let lastErr = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const out = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", { prompt, steps: STEPS });
        if (out && out.image && out.image.length > 1000)
          return json(request, 200, { image: "data:image/jpeg;base64," + out.image });
        lastErr = "empty image";
      } catch (e) {
        lastErr = String((e && e.message) || e).slice(0, 200);
        if (/allocation|quota|limit|4006/i.test(lastErr)) break; // daily allowance used up: no point retrying
      }
    }
    await cache.delete(ckey);
    return json(request, 502, { error: "Cloudflare image failed: " + lastErr });
  }
};

function json(request, status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors(request), "Content-Type": "application/json" } });
}
function cors(request) {
  return {
    "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}
