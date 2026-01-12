import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing GraphQL query" }, { status: 400 });
    }

    const response = await fetch(`https://${process.env.SHOPIFY_SHOP}/admin/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    //return NextResponse.json(data);
    // set content security policy header
    const res = NextResponse.json(data);
    res.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'none'; object-src 'none';");
    return res;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy request failed" }, { status: 500 });
  }
}

