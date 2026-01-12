import { NextRequest, NextResponse } from "next/server";

// 1. Define common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Shopify-Access-Token",
};

// 2. Handle the Preflight (OPTIONS) request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing GraphQL query" },
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await fetch(
      `https://${process.env.SHOPIFY_SHOP}/admin/api/2024-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();

    // 3. Return the data with CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500, headers: corsHeaders }
    );
  }
}
