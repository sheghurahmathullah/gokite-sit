import { NextResponse } from 'next/server';

export async function GET() {
    try {
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

        const resp = await fetch(
            'http://gokite-sit-b2c.convergentechnologies.com:30839/api/cms/api/v2/list/custom/data/cms-countries-dd',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'claims': JSON.stringify(claims)
                },
                cache: 'no-store'
            }
        );

        if (!resp.ok) {
            const text = await resp.text();
            return NextResponse.json(
                { success: false, message: 'Upstream error', status: resp.status, body: text },
                { status: resp.status }
            );
        }

        const data = await resp.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("API endpoint not working - countries-dd-proxy:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        return NextResponse.json(
            { success: false, message: 'Proxy failed', error: String(error) },
            { status: 500 }
        );
    }
}


