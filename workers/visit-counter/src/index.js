import { DurableObject } from "cloudflare:workers";

const ALLOWED_ORIGINS = new Set([
  "https://www.slicemaster.com.cn",
  "https://slicemaster.com.cn"
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  if (!ALLOWED_ORIGINS.has(origin)) return null;

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(request, body, status = 200) {
  const cors = corsHeaders(request);
  return Response.json(body, {
    status,
    headers: {
      ...(cors ?? {}),
      "Cache-Control": "no-store"
    }
  });
}

export class VisitCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.storage.sql.exec(
      "CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, total INTEGER NOT NULL)"
    );
  }

  recordVisit() {
    this.ctx.storage.sql.exec(
      "INSERT INTO counters (name, total) VALUES ('site', 1) ON CONFLICT(name) DO UPDATE SET total = total + 1"
    );
    return this.total();
  }

  total() {
    const row = this.ctx.storage.sql
      .exec("SELECT total FROM counters WHERE name = 'site'")
      .toArray()[0];
    return row?.total ?? 0;
  }
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return cors
        ? new Response(null, { status: 204, headers: cors })
        : new Response(null, { status: 403 });
    }

    if (!cors) return new Response("Forbidden", { status: 403 });

    const counter = env.VISIT_COUNTER.getByName("slice-master-site");

    if (request.method === "POST" && url.pathname === "/v1/visit") {
      return json(request, { total: await counter.recordVisit() });
    }

    if (request.method === "GET" && url.pathname === "/v1/total") {
      return json(request, { total: await counter.total() });
    }

    return json(request, { error: "Not found" }, 404);
  }
};
