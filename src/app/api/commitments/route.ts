import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/backend/rateLimit';
import { logCommitmentCreated } from '@/lib/backend/logger';

export const POST = withApiHandler(async (req: NextRequest) => {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';

    const isAllowed = await checkRateLimit(ip, 'api/commitments');
    if (!isAllowed) {
        throw new TooManyRequestsError();
    }

    // TODO: validate request body, interact with Soroban smart contract,
    //       store commitment record in database, mint NFT, etc.

    // analytics hook
    try {
        const body = await req.json();
        logCommitmentCreated({ ip, ...body });
    } catch (e) {
        // body might be empty or invalid; still log IP
        logCommitmentCreated({ ip, error: 'failed to parse request body' });
    }

    return NextResponse.json({
        message: 'Commitments creation endpoint stub - rate limiting applied',
        ip: ip
    });
}
