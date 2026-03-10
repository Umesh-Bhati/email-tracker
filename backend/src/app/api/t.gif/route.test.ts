import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
    },
}));

describe('Tracking Pixel API (/api/t.gif)', () => {
    const baseUrl = 'http://localhost:3000/api/t.gif';

    it('should return a 200 status and a GIF image', async () => {
        const request = new NextRequest(`${baseUrl}?email_id=test-email-id`);
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toBe('image/gif');
    });

    it('should set strict no-cache headers to ensure tracking accuracy', async () => {
        const request = new NextRequest(`${baseUrl}?email_id=test-email-id`);
        const response = await GET(request);

        const cacheControl = response.headers.get('cache-control');
        expect(cacheControl).toContain('no-store');
        expect(cacheControl).toContain('no-cache');
        expect(response.headers.get('pragma')).toBe('no-cache');
        expect(response.headers.get('expires')).toBe('0');
    });

    it('should return the GIF even if email_id is missing', async () => {
        const request = new NextRequest(baseUrl);
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toBe('image/gif');
    });
});
