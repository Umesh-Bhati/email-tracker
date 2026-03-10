import { vi, describe, it, expect } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
    },
}));

describe('Link Click API (/api/c)', () => {
    const baseUrl = 'http://localhost:3000/api/c';

    it('should redirect with status 302 to the target URL', async () => {
        const target = 'https://google.com/';
        const encodedTarget = encodeURIComponent(target);
        const request = new NextRequest(`${baseUrl}?url=${encodedTarget}&email_id=123`);

        const response = await GET(request);

        expect(response.status).toBe(302); // 302 Found (Temporary Redirect)
        expect(response.headers.get('location')).toBe(target);
    });

    it('should handle complex encoded URLs correctly', async () => {
        const complexUrl = 'https://example.com/path?query=1&other=2';
        const encodedUrl = encodeURIComponent(complexUrl);
        const request = new NextRequest(`${baseUrl}?url=${encodedUrl}`);

        const response = await GET(request);
        expect(response.headers.get('location')).toBe(complexUrl);
    });

    it('should return 400 if no URL is provided', async () => {
        const request = new NextRequest(baseUrl);
        const response = await GET(request);

        expect(response.status).toBe(400);
    });
});
