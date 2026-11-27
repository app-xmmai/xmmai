// Public settings. API key is NEVER stored here — it lives only in Cloudflare Worker secrets.
window.XMM_CONFIG = {
  // Leave empty. The real key is on Cloudflare Worker.
  GROQ_KEY: "",

  // Your Cloudflare Worker URL (the proxy).
  GROQ_PROXY: "https://xmmai.xbm-bayat.workers.dev",

  // Which Groq plan the Worker's key is on. This sets how big each request may be.
  //   "free" = ~8K tokens/minute (long sites are built in chunks, a few chunks per minute)
  //   "dev"  = Developer plan, 250K tokens/minute (big files in one go, no waiting)
  // Switch to "dev" after you upgrade at console.groq.com — that is the single biggest speed-up.
  TIER: "free",

  // Your Cloudflare image Worker (FLUX). If it fails or hits its daily limit, the site falls back to Pollinations.
  IMAGE_PROXY: "https://xmmai-image.xbm-bayat.workers.dev",

  // Optional: free Hugging Face token (huggingface.co/settings/tokens, type "Read", starts with hf_).
  // Gives your visitors a bigger free image allowance. Leave empty to run without it.
  HF_TOKEN: "",

  // Free community AIs, no API key. Requests rotate through this list; a server that is full or failing
  // sits out for a while and the next one takes over. If all fail the app says "Server 1 failed, using server 2" and uses Groq.
  // rpm = max requests per minute we allow ourselves, conc = max at once.
  // Box requests (quiz, chart, compare, recipe, table...) get up to 5000 tokens and only use servers whose tpm (estimated tokens per minute)
  // is at least BOX_MIN_TPM, biggest first. tpm = rpm x ~4000 tokens, a rough estimate: edit it if you learn the real limit.
  BOX_MIN_TPM: 8000,
  // Keyless community image generators for the header picture of every box (quiz, recipe, compare...). Rotated; a failing one rests for a while.
  // type "gradio" = a Hugging Face Space (base + fn), type "post" = POST {prompt,width,height} returning an image or JSON with a url.
  IMG_AI: [
    { name: "FLUX Space", type: "gradio", base: "https://black-forest-labs-flux-1-schnell.hf.space", fn: "infer" },
    { name: "ZSky",       type: "post",   url: "https://api.zsky.ai/v1/generate" }
  ],
  FREE_AI: [
    { name: "LLM7",         url: "https://api.llm7.io/v1/chat/completions", model: "gpt-4.1-nano-2025-04-14", key: "unused", rpm: 25, tpm: 100000 },
    { name: "Pollinations", url: "https://text.pollinations.ai/openai", model: "openai-fast", key: "", conc: 1, tpm: 8000 },
    { name: "Airforce",     url: "https://api.airforce/v1/chat/completions", model: "step-3.5-flash:free", key: "", rpm: 10, tpm: 40000 },
    { name: "OVH gpt-oss",  url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions", model: "gpt-oss-120b", key: "", rpm: 2, tpm: 8000 },
    { name: "OVH llama",    url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions", model: "meta-llama-3_3-70b-instruct", key: "", rpm: 2, tpm: 8000 },
    { name: "Airforce grok",url: "https://api.airforce/v1/chat/completions", model: "grok-4.1-mini:free", key: "", rpm: 10, tpm: 40000 }
  ],

  // Optional extra models to try if the main one fails
  FALLBACK_MODELS: [],

  TEXT_MODEL: "openai/gpt-oss-120b",
  FAST_MODEL: "openai/gpt-oss-20b",
  SMART_MODEL: "openai/gpt-oss-120b",
  CODE_MODEL: "openai/gpt-oss-120b",
  VISION_MODEL: "qwen/qwen3.8-27b"
};
