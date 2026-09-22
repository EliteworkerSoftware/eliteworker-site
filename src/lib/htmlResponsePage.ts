import { NextResponse } from "next/server";

// Shared branded chrome for the small standalone HTML pages rendered by
// unauthenticated email-link routes (demo-confirm, booking cancel) — a human
// clicks these from an email client, so they get a page, not JSON. `bodyHtml`
// is trusted markup built by the caller from fixed strings, never raw user
// input.
export function htmlResponsePage(title: string, bodyHtml: string): NextResponse {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${title}</title><style>` +
      `body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;` +
      `background:#f7f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a}` +
      `.card{background:#fff;border-radius:16px;padding:40px;max-width:420px;margin:24px;text-align:center;` +
      `box-shadow:0 20px 60px rgba(15,23,42,0.12)}h1{font-size:20px;margin:0 0 8px}p{color:#5b6472;margin:0 0 16px;font-size:14px;line-height:1.5}` +
      `textarea{width:100%;box-sizing:border-box;border:1px solid #e3e8f0;border-radius:8px;padding:10px;font:inherit;margin-bottom:12px;resize:vertical}` +
      `button{width:100%;border:none;border-radius:999px;background:#f59e0b;color:#fff;font-weight:600;font-size:14px;padding:12px 20px;cursor:pointer}` +
      `button:hover{filter:brightness(1.05)}` +
      `</style></head><body><div class="card"><h1>${title}</h1>${bodyHtml}</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
