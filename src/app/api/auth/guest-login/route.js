import { NextResponse } from "next/server";
import https from "https";

const UPSTREAM_URL = "http://gokite-sit-b2c.convergentechnologies.com:30839/api/azp/api/auth/v1/guest-login?getTokenInCookie=true";

function extractCookieValue(setCookieHeader, name) {
    if (!setCookieHeader) return "";
    const match = setCookieHeader.match(new RegExp(`${name}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : "";
}

export async function POST(request) {
    try {
        const isProd = process.env.NODE_ENV === "production";
        const isHttpsUpstream = (() => {
            try {
                return new URL(UPSTREAM_URL).protocol === "https:";
            } catch {
                return false;
            }
        })();
        const insecureHttpsAgent = !isProd && isHttpsUpstream ? new https.Agent({ rejectUnauthorized: false }) : undefined;

        const body = await request.json().catch(() => ({}));

        const upstream = await fetch(UPSTREAM_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body || {}),
            cache: "no-store",
            // Use insecure HTTPS agent only in non-production when upstream is HTTPS
            ...(insecureHttpsAgent ? { agent: insecureHttpsAgent } : {}),
        });

        const text = await upstream.text();
        const contentType = upstream.headers.get("content-type") || "application/json";

        // Copy tokens into localhost cookies for dev
        const setCookie = upstream.headers.get("set-cookie") || "";
        const access = extractCookieValue(setCookie, "accesstoken");
        const refresh = extractCookieValue(setCookie, "refreshtoken");

        const response = new NextResponse(text, {
            status: upstream.status,
            headers: { "content-type": contentType },
        });

        if (access) {
            response.cookies.set("accesstoken", access, {
                httpOnly: true,
                sameSite: "lax",
                secure: isProd,
                path: "/",
            });
        }
        if (refresh) {
            response.cookies.set("refreshtoken", refresh, {
                httpOnly: true,
                sameSite: "lax",
                secure: isProd,
                path: "/",
            });
        }

        return response;
    } catch (err) {
        console.error("API endpoint not working - guest-login:", err);
        console.error("Error details:", {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        
        const details = {
            error: "Failed to proxy guest-login",
            message: String(err?.message || err),
            cause: String(err?.cause || ""),
        };
        return NextResponse.json(details, { status: 500 });
    }
}


