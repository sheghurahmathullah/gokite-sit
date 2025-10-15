import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import http from "http";
import https from "https";

export async function POST(request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const token = cookieStore.get("accesstoken")?.value || "";

        // Claims header for visa rules endpoint (primary authentication method)
        const claims = {
            "AUTHENTICATED": "true",
            "org_id": "0631f265-d8de-4608-9622-6b4e148793c4",
            "OTP_VERFICATION_REQD": "false",
            "USER_ID": "0af402d1-98f0-18ae-8198-f493454d0001",
            "refreshtoken": "false",
            "client_ip": "14.99.174.62",
            "USER_ID_LONG": "563",
            "USER_NAME": "codetezteam@gmail.com",
            "SESSION_ID": "88c31722-e2ef-4723-a2ce-20d797f7a1b8",
            "authorized-domains": "b603f35d-9242-11f0-b493-fea20be86931, b603edb7-9242-11f0-b493-fea20be86931, b603e748-9242-11f0-b493-fea20be86931, b603d5d9-9242-11f0-b493-fea20be86931",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
        };

        const upstreamUrl = "http://gokite.convergentechnologies.com:30839/api/cms/api/v2/list/custom/data/sections-visa-cards-rules";
        const isHttps = upstreamUrl.startsWith("https:");

        const res = await fetch(upstreamUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "claims": JSON.stringify(claims),
                // Include token if available, but claims are the primary auth method
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body || {}),
            agent: isHttps ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent(),
        });

        const text = await res.text();
        const contentType = res.headers.get("content-type") || "application/json";

        return new NextResponse(text, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (err) {
        console.error("API endpoint not working - sections-visa-cards-rules:", err);
        console.error("Error details:", {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        
        return NextResponse.json(
            { error: "Failed to proxy sections-visa-cards-rules", details: String(err) },
            { status: 500 }
        );
    }
}
