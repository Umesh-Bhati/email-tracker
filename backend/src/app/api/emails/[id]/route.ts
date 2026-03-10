import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/emails/[id] - Fetch a specific email and its tracking history
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // We fetch the email AND its child tracking_logs in a single relational query
    // System Design: This is an efficient way to reduce round-trips to the DB.
    const { data, error } = await supabase
        .from('emails')
        .select('*, tracking_logs(*)')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ email: data });
}

// DELETE /api/emails/[id] - Delete a tracked email record (cascades to logs)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
