export async function handler(event, context) {
  try {
    const url = process.env.NEWSLETTER_URL;
    const token = process.env.SECRET_TOKEN;
    if (!url || !token) {
      return { statusCode: 500, body: "Missing NEWSLETTER_URL or SECRET_TOKEN" };
    }

    const params = new URLSearchParams(event.queryStringParameters || {});
    const mode = params.get("mode") || "current";

    let action = "send_current";
    if (mode === "prev") action = "send_prev";
    if (mode === "next") action = "send_next";

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": token
      },
      body: JSON.stringify({ action })
    });

    const text = await resp.text();
    return { statusCode: resp.status, body: text };
  } catch (err) {
    return { statusCode: 500, body: (err && err.message) ? err.message : String(err) };
  }
}
