import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accesstoken")?.value || "";

        console.log("Access token from pages route", token);


        if (!token) {
            return NextResponse.json(
                { error: "Missing accesstoken cookie" },
                { status: 401 }
            );
        }

        const upstreamUrl = "http://gokite-sit-b2c.convergentechnologies.com:30839/api/cms/api/v2/list/custom/data/pages";

        console.log(`[Pages API] Fetching from: ${upstreamUrl}`);
        console.log(`[Pages API] Using token: ${token ? 'Present' : 'Missing'}`);

        try {
            // First attempt with standard fetch
            const res = await fetch(upstreamUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
                signal: AbortSignal.timeout(15000), // 15 second timeout
            });

            console.log(`[Pages API] Response status: ${res.status}`);

            const text = await res.text();
            console.log(`[Pages API] Response text: ${text.substring(0, 200)}...`);

            const contentType = res.headers.get("content-type") || "application/json";

            return new NextResponse(text, {
                status: res.status,
                headers: { "content-type": contentType },
            });

        } catch (fetchError) {
            console.error('[Pages API] API endpoint not working:', fetchError.message);
            console.error('[Pages API] Error details:', {
                name: fetchError.name,
                message: fetchError.message,
                stack: fetchError.stack
            });

            return NextResponse.json(
                {
                    error: "API endpoint not working - pages",
                    details: fetchError.message,
                    errorType: fetchError.name
                },
                { status: 500 }
            );
        }

    } catch (err) {
        console.error('[Pages API] General Error:', err);
        console.error('[Pages API] Error name:', err.name);
        console.error('[Pages API] Error message:', err.message);

        return NextResponse.json(
            {
                error: "Failed to fetch pages",
                details: err.message,
                errorType: err.name
            },
            { status: 500 }
        );
    }
}