import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH /api/pipelines/[id] - Update a pipeline's name
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('pipelines')
            .update({ name })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ pipeline: data });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

// DELETE /api/pipelines/[id] - Delete a pipeline (will cascade as per DB schema)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { error } = await supabase
        .from('pipelines')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
