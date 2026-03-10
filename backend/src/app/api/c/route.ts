import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const emailId = searchParams.get('email_id');

    // 1. Basic Validation: If no URL provided, we can't redirect anyway.
    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // 2. Decode the target URL (it was encoded in the Chrome Extension)
    let targetUrl: string;
    try {
        targetUrl = decodeURIComponent(url);
    } catch (e) {
        targetUrl = url; // Fallback to raw URL
    }

    // 3. Log the Click Event (if email_id is present)
    if (emailId) {
        const ipAddress = request.headers.get('x-forwarded-for') || (request as any).ip || 'Unknown';
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        try {
            await supabase.from('tracking_logs').insert({
                email_id: emailId,
                event_type: 'click',
                ip_address: ipAddress,
                user_agent: userAgent,
            });
        } catch (err) {
            console.error('Error logging click event:', err);
            // We don't block the redirect if logging fails
        }
    }

    // 4. Perform the HTTP 302 (Temporary) Redirect
    // This ensures the browser asks the server every time the link is clicked.
    return NextResponse.redirect(targetUrl, 302);
}
