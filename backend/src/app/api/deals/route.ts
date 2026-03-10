import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/deals - Fetch deals for a specific pipeline
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pipelineId = searchParams.get('pipeline_id');

    if (!pipelineId) {
        return NextResponse.json({ error: 'Pipeline ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deals: data });
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
    try {
        const { pipeline_id, email_id, status, value } = await request.json();

        if (!pipeline_id || !status) {
            return NextResponse.json({ error: 'Pipeline ID and Status are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('deals')
            .insert([{
                pipeline_id,
                email_id: email_id || null,
                status,
                value: value || 0
            }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ deal: data }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
