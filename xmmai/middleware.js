// Host router (Vercel Routing Middleware).
//   xmm-ai.com / www.xmm-ai.com -> main site (normal)
//   app.xmm-ai.com     -> Chat    (/chat/index.html)   [rewrite on "/"]
//   auth.xmm-ai.com    -> Login   (/login/index.html)  [rewrite on "/"]
//   support.xmm-ai.com -> Support (/support/index.html)[rewrite on "/"]
//   status.xmm-ai.com  -> Status  (/status/index.html) [rewrite on "/"]
//   ANY OTHER host (other domains, unknown subdomains, *.vercel.app) -> 307 redirect to https://xmm-ai.com (same path + query)
export const config = { matcher: ['/((?!_vercel).*)'] };

const ROOT = 'xmm-ai.com';
const MAIN = 'https://' + ROOT;
const PAGES = {
  app: '/chat/index.html',
  auth: '/login/index.html',
  support: '/support/index.html',
  status: '/status/index.html',
};
const LOCAL = ['localhost', '127.0.0.1', '[::1]'];

export default function middleware(request) {
  let url;
  try { url = new URL(request.url); } catch (e) { return new Response(null, { headers: { 'x-middleware-next': '1' } }); }

  const host = String(request.headers.get('x-forwarded-host') || request.headers.get('host') || url.hostname)
    .toLowerCase().split(',')[0].trim().replace(/:\d+$/, '').replace(/\.$/, '');

  // local dev
  if (LOCAL.includes(host)) return new Response(null, { headers: { 'x-middleware-next': '1' } });

  // main domain
  if (host === ROOT || host === 'www.' + ROOT) {
    if (host === 'www.' + ROOT) return redirect(url);
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  // official subdomains
  const sub = host.endsWith('.' + ROOT) ? host.slice(0, -(ROOT.length + 1)) : '';
  if (PAGES[sub]) {
    if (url.pathname === '/') {
      return new Response(null, { headers: { 'x-middleware-rewrite': new URL(PAGES[sub], request.url).toString() } });
    }
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  // everything else -> main site
  return redirect(url);
}

function redirect(url) {
  return new Response(null, {
    status: 307,
    headers: { Location: MAIN + url.pathname + url.search, 'Cache-Control': 'no-store' },
  });
}
