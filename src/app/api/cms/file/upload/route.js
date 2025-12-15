import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "http";
import https from "https";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value || "";

    if (!token) {
      return NextResponse.json(
        { error: "Missing accesstoken cookie" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Create form data for upstream API
    const upstreamFormData = new FormData();
    upstreamFormData.append("file", file);

    const upstreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/cms/api/v1/file/upload`;
    const isHttps = upstreamUrl.startsWith("https:");

    const res = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header, let fetch set it with boundary for multipart/form-data
      },
      body: upstreamFormData,
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
    console.error("API endpoint not working - file upload:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      { error: "Failed to upload file", details: String(err) },
      { status: 500 }
    );
  }
}

