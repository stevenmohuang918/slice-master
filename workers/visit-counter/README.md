# Slice Master visit counter

Cloudflare Worker plus a SQLite-backed Durable Object used by the public Slice Master website.

- `POST /v1/visit` increments the anonymous total and the current China (UTC+8) calendar day's count.
- `GET /v1/total` returns `{ total, today }`.
- Requests are CORS-restricted to the public Slice Master origins.
- The browser deduplicates its own increment to once per calendar day. This is a public visit counter, not an identity or analytics system.
- The first public counter version is seeded from Cloudflare Web Analytics' 30-day, bot-excluded page-view total (220 on 2026-09-03); future Worker counts add to that baseline.

Deploy from this directory with `npx wrangler deploy` after authenticating to the intended Cloudflare account.
