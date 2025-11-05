import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { packageCategoryId } = body;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";

    console.log("[Holiday-categories API] Access token:", token ? "Present" : "Missing");

    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    const upstreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/cms/api/v2/list/custom/data/cms-holiday-categories`;

    console.log(`[Holiday-categories API] Fetching from: ${upstreamUrl}`);
    console.log(`[Holiday-categories API] Package Category ID: ${packageCategoryId || 1}`);

    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        packageCategoryId: packageCategoryId || 1, // Default to 1 if not provided
      }),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    console.log(`[Holiday-categories API] Response status: ${response.status}`);

    const text = await response.text();
    console.log(`[Holiday-categories API] Response text: ${text.substring(0, 200)}...`);

    const contentType = response.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error("[Holiday-categories API] API endpoint not working:", error.message);
    console.error("[Holiday-categories API] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: "API endpoint not working - holiday-categories",
        details: error.message,
        errorType: error.name,
      },
      { status: 500 }
    );
  }
}
