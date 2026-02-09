import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;

    if (!key.endsWith('.glb')) {
        return new NextResponse('Only .glb files are allowed', { status: 400 });
    }

    try {
        const { env } = await getCloudflareContext();

        // Debug: Check if bucket binding exists
        if (!env.MODELS_BUCKET) {
            return new NextResponse('R2 bucket binding not found', { status: 500 });
        }

        const r2Key = `3d-models/${key}`;
        console.log(`Fetching R2 object: ${r2Key}`);

        const object = await env.MODELS_BUCKET.get(r2Key);

        if (!object) {
            return new NextResponse(`Model not found: ${r2Key}`, { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('content-type', 'model/gltf-binary');

        return new NextResponse(object.body, {
            headers,
        });
    } catch (e: any) {
        return new NextResponse(e.message || 'Error fetching model', { status: 500 });
    }
}
