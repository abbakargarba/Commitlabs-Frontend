import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/backend/rateLimit';
import { createCommitmentOnChain } from '@/lib/backend/services/contracts';
import {
    normalizeBackendError,
    toBackendErrorResponse
} from '@/lib/backend/errors';

interface CreateCommitmentRequestBody {
    ownerAddress: string;
    asset: string;
    amount: string;
    durationDays: number;
    maxLossBps: number;
    metadata?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
    // Get identifying key (IP address or user ID if authenticated)
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';

    // Apply rate limiting check
    const isAllowed = await checkRateLimit(ip, 'api/commitments');

    if (!isAllowed) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
        );
    }

    try {
        const body = (await req.json()) as CreateCommitmentRequestBody;
        const result = await createCommitmentOnChain({
            ownerAddress: body.ownerAddress,
            asset: body.asset,
            amount: body.amount,
            durationDays: body.durationDays,
            maxLossBps: body.maxLossBps,
            metadata: body.metadata
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        const normalized = normalizeBackendError(error, {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create commitment.',
            status: 500
        });

        return NextResponse.json(toBackendErrorResponse(normalized), {
            status: normalized.status
        });
    }
}
