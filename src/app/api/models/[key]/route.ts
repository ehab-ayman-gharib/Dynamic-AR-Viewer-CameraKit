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
        const r2Key = `3d-models/${key}`;
        const object = await env.MODELS_BUCKET.get(r2Key);

        if (!object) {
            return new NextResponse('Model not found', { status: 404 });
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
