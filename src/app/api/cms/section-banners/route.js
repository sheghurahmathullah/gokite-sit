import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "http";
import https from "https";

export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";
    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    const upstreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/cms/api/v2/list/custom/data/section-banners`;
    const isHttps = upstreamUrl.startsWith("https:");
    const res = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body || {}),
      agent: isHttps
        ? new https.Agent({ rejectUnauthorized: false })
        : new http.Agent(),
    });

    const text = await res.text();
    const contentType = res.headers.get("content-type") || "application/json";
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    console.error("API endpoint not working - section-banners:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      { error: "Failed to proxy section-banners", details: String(err) },
      { status: 500 }
    );
  }
}
