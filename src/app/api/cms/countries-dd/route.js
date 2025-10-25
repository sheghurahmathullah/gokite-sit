import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";

    console.log("Access token from countries-dd route", token);

    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    const upstreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/cms/api/v2/list/custom/data/cms-section-visa-country-all`;

    console.log(`[Countries-dd API] Fetching from: ${upstreamUrl}`);
    console.log(`[Countries-dd API] Using token: ${token ? "Present" : "Missing"}`);

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    console.log(`[Countries-dd API] Response status: ${response.status}`);

    const text = await response.text();
    console.log(`[Countries-dd API] Response text: ${text.substring(0, 200)}...`);

    const contentType = response.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error("[Countries-dd API] API endpoint not working:", error.message);
    console.error("[Countries-dd API] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: "API endpoint not working - countries-dd",
        details: error.message,
        errorType: error.name,
      },
      { status: 500 }
    );
  }
}
