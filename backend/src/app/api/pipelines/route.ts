import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/pipelines - Fetch all pipelines for a user
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pipelines: data });
}

// POST /api/pipelines - Create a new pipeline
export async function POST(request: NextRequest) {
    try {
        const { name, user_id } = await request.json();

        if (!name || !user_id) {
            return NextResponse.json({ error: 'Name and User ID are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('pipelines')
            .insert([{ name, user_id }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ pipeline: data }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
