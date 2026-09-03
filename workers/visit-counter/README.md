# Slice Master visit counter

Cloudflare Worker plus a SQLite-backed Durable Object used by the public Slice Master website.

- `POST /v1/visit` increments the anonymous site-visit count.
- `GET /v1/total` returns the current total.
- Requests are CORS-restricted to the public Slice Master origins.
- The browser deduplicates its own increment to once per calendar day. This is a public visit counter, not an identity or analytics system.

Deploy from this directory with `npx wrangler deploy` after authenticating to the intended Cloudflare account.
