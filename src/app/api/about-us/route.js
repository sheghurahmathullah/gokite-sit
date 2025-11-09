import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";

    console.log("Access token from about-us route", token);

    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    const upstreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/cms/api/v2/list/custom/data/company-about-us`;

    console.log(`[About Us API] Fetching from: ${upstreamUrl}`);
    console.log(`[About Us API] Using token: ${token ? "Present" : "Missing"}`);

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

      console.log(`[About Us API] Response status: ${response.status}`);

      const text = await response.text();
      console.log(`[About Us API] Response text: ${text.substring(0, 200)}...`);

      const contentType = response.headers.get("content-type") || "application/json";

      return new NextResponse(text, {
        status: response.status,
        headers: { "content-type": contentType },
      });
    } catch (fetchError) {
      console.error(
        "[About Us API] API endpoint not working:",
        fetchError.message
      );
      console.error("[About Us API] Error details:", {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
      });

      return NextResponse.json(
        {
          error: "API endpoint not working - about-us",
          details: fetchError.message,
          errorType: fetchError.name,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[About Us API] General Error:", err);
    console.error("[About Us API] Error name:", err.name);
    console.error("[About Us API] Error message:", err.message);

    return NextResponse.json(
      {
        error: "Failed to fetch about us data",
        details: err.message,
        errorType: err.name,
      },
      { status: 500 }
    );
  }
}

