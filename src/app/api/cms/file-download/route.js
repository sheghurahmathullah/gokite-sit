import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "http";
import https from "https";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageName = searchParams.get('image');

        if (!imageName) {
            return NextResponse.json(
                { error: "Image name parameter is required" },
                { status: 400 }
            );
        }

        console.log(`Fetching image: ${imageName}`);

        const cookieStore = await cookies();
        const token = cookieStore.get("accesstoken")?.value || "";

        const upstreamUrl = `http://gokite-sit-b2c.convergentechnologies.com:30839/api/cms/api/v1/file/download/${imageName}`;
        const isHttps = upstreamUrl.startsWith("https:");

        console.log(`Upstream URL: ${upstreamUrl}`);

        const res = await fetch(upstreamUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            agent: isHttps ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent(),
        });

        console.log(`Response status: ${res.status}`);

        if (!res.ok) {
            console.error(`Failed to fetch image ${imageName}: ${res.status} ${res.statusText}`);
            return NextResponse.json(
                { error: "Failed to fetch image", status: res.status },
                { status: res.status }
            );
        }

        // Get the image data
        const imageBuffer = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") || "image/jpeg";

        console.log(`Successfully fetched image ${imageName}, size: ${imageBuffer.byteLength} bytes`);

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                "content-type": contentType,
                "cache-control": "public, max-age=31536000", // Cache for 1 year
                "content-length": imageBuffer.byteLength.toString(),
            },
        });
    } catch (err) {
        console.error("API endpoint not working - file-download:", err);
        console.error("Error details:", {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        
        return NextResponse.json(
            { error: "Failed to proxy file download", details: String(err) },
            { status: 500 }
        );
    }
}
