import { NextRequest, NextResponse } from 'next/server';

const JWT = process.env.PINATA_JWT;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const INTERNAL_API_KEY_HEADER = 'X-Internal-API-Key';

function authorizeRequest(request: NextRequest) {
    const providedApiKey = request.headers.get(INTERNAL_API_KEY_HEADER);
    // Browser clients cannot set internal headers reliably. Only reject when an
    // explicit internal key is provided but does not match.
    if (INTERNAL_API_KEY && providedApiKey && providedApiKey !== INTERNAL_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return null;
}

function buildProxyResponse(responseText: string, status: number, contentType: string | null) {
    const shouldTryJson = contentType?.includes('application/json') || contentType?.includes('+json');

    if (shouldTryJson || responseText.length > 0) {
        try {
            const parsed = JSON.parse(responseText);
            return NextResponse.json(parsed, { status });
        } catch (_error) {
            // Return plain text when upstream response is not JSON.
        }
    }

    return new NextResponse(responseText, {
        status,
        headers: {
            'content-type': contentType || 'text/plain; charset=utf-8',
        },
    });
}

export async function POST(request: NextRequest) {
    const authError = authorizeRequest(request);
    if (authError) return authError;

    if (!JWT) {
        return NextResponse.json({ error: 'PINATA_JWT not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        const response = await fetch(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${JWT}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        const responseText = await response.text();
        return buildProxyResponse(responseText, response.status, response.headers.get('content-type'));
    } catch (err) {
        console.error('Error pinning to IPFS:', err);
        return NextResponse.json({ error: 'Failed to pin to IPFS' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authError = authorizeRequest(request);
    if (authError) return authError;

    if (!JWT) {
        return NextResponse.json({ error: 'PINATA_JWT not configured' }, { status: 500 });
    }

    try {
        const { cid } = await request.json();
        if (typeof cid !== 'string' || cid.trim() === '') {
            return NextResponse.json({ error: 'CID is required' }, { status: 400 });
        }

        const safeCid = cid.trim();
        const encodedCid = encodeURIComponent(safeCid);

        const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${encodedCid}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${JWT}` },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            return buildProxyResponse(errorBody, response.status, response.headers.get('content-type'));
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error unpinning from IPFS:', err);
        return NextResponse.json({ error: 'Failed to unpin from IPFS' }, { status: 500 });
    }
}
