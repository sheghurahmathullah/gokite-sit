import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";

    console.log("Access token from privacy-policy route", token);

    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    const upstreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/cms/api/v2/list/custom/data/company-priv-policy`;

    console.log(`[Privacy Policy API] Fetching from: ${upstreamUrl}`);
    console.log(`[Privacy Policy API] Using token: ${token ? "Present" : "Missing"}`);

    try {
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

      console.log(`[Privacy Policy API] Response status: ${response.status}`);

      const text = await response.text();
      console.log(`[Privacy Policy API] Response text: ${text.substring(0, 200)}...`);

      const contentType = response.headers.get("content-type") || "application/json";

      return new NextResponse(text, {
        status: response.status,
        headers: { "content-type": contentType },
      });
    } catch (fetchError) {
      console.error(
        "[Privacy Policy API] API endpoint not working:",
        fetchError.message
      );
      console.error("[Privacy Policy API] Error details:", {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
      });

      return NextResponse.json(
        {
          error: "API endpoint not working - privacy-policy",
          details: fetchError.message,
          errorType: fetchError.name,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[Privacy Policy API] General Error:", err);
    console.error("[Privacy Policy API] Error name:", err.name);
    console.error("[Privacy Policy API] Error message:", err.message);

    return NextResponse.json(
      {
        error: "Failed to fetch privacy policy data",
        details: err.message,
        errorType: err.name,
      },
      { status: 500 }
    );
  }
}
