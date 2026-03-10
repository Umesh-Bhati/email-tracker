import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH /api/deals/[id] - Update a deal's status or value
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const allowedUpdates = ['status', 'value', 'pipeline_id'];
        const updates: Record<string, any> = {};

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'At least one valid update field required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('deals')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ deal: data });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

// DELETE /api/deals/[id] - Delete a deal
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
