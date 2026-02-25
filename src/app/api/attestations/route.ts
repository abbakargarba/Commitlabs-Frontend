import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/backend/rateLimit';
import { withApiHandler } from '@/lib/backend/withApiHandler';
import { ok } from '@/lib/backend/apiResponse';
import { TooManyRequestsError } from '@/lib/backend/errors';
import { logAttestation } from '@/lib/backend/logger';

export const POST = withApiHandler(async (req: NextRequest) => {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';

    const isAllowed = await checkRateLimit(ip, 'api/attestations');
    if (!isAllowed) {
        throw new TooManyRequestsError();
    }

    // TODO: verify on-chain data, store attestation in database, etc.

    // analytics hook
    try {
        const body = await req.json();
        logAttestation({ ip, ...body });
    } catch (e) {
        logAttestation({ ip, error: 'failed to parse request body' });
    }

    return ok({ message: 'Attestation recorded successfully.' }, 201);
});
