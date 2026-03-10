import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/emails - List tracked emails for a user
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ emails: data });
}

// POST /api/emails - Register a new email for tracking
export async function POST(request: NextRequest) {
    try {
        const { user_id, message_id, subject, recipient } = await request.json();

        if (!user_id || !message_id || !recipient) {
            return NextResponse.json({ error: 'User ID, Message ID, and Recipient are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('emails')
            .insert([{
                user_id,
                message_id,
                subject,
                recipient
            }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ email: data }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
