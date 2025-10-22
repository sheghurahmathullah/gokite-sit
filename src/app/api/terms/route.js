import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "http";
import https from "https";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";

    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    const upstreamUrl = 'http://gokite-sit-b2c.convergentechnologies.com:30839/api/cms/api/v2/list/custom/data/company-tandc';
    const isHttps = upstreamUrl.startsWith("https:");
    
    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      agent: isHttps
        ? new https.Agent({ rejectUnauthorized: false })
        : new http.Agent(),
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") || "application/json";
    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    console.error("API endpoint not working - terms:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      { error: "Failed to proxy terms and conditions", details: String(err) },
      { status: 500 }
    );
  }
}
