import { env } from 'cloudflare:workers';
import { handleCommunity } from '../../../lib/community-api.mjs';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) => handleCommunity(request, env);
export const POST = (request: Request) => handleCommunity(request, env);
export const OPTIONS = (request: Request) => handleCommunity(request, env);
