# Slice Master visit counter

Cloudflare Worker plus a SQLite-backed Durable Object used by the public Slice Master website.

- `POST /v1/visit` increments the anonymous total and the current China (UTC+8) calendar day's count.
- `GET /v1/total` returns `{ total, today }`.
- `POST /v1/event` accepts only a fixed, anonymous conversion event label. It never accepts images, file names, crop coordinates, visitor IDs, or free-form metadata. The aggregate is written to the Cloudflare Analytics Engine dataset `slice_master_funnel`.
- Requests are CORS-restricted to the public Slice Master origins.
- The browser deduplicates its own increment to once per calendar day. This is a public visit counter, not an identity or analytics system.
- The first public counter version is seeded from Cloudflare Web Analytics' 30-day, bot-excluded page-view total (220 on 2026-09-03); future Worker counts add to that baseline.

Deploy from this directory with `npx wrangler deploy` after authenticating to the intended Cloudflare account.

## Funnel metrics

The page records these event labels: `upload_started`, `detection_completed`, `export_single_png`, `export_selected_pngs`, `download_contact_sheet`, `bookmark_opened`, `share_opened`, and `site_link_copy_requested`.

Create an Account API Token with **Account Analytics: Read** only when you are ready to query the data; do not place that token in this repository or the public website. In Cloudflare Analytics Engine, the following SQL is a useful first report:

```sql
SELECT
  blob1 AS event,
  SUM(double1) AS events
FROM slice_master_funnel
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY event
ORDER BY events DESC;
```

This report is intentionally separate from Cloudflare Web Analytics: Web Analytics measures visits/page views, while this dataset measures actions inside the tool.
