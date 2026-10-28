import { env } from 'cloudflare:workers';
import { requireChatGPTUser } from '../chatgpt-auth';
import Moderation from './moderation-client';
export const dynamic = 'force-dynamic';
export default async function ModerationPage() {
  const user = await requireChatGPTUser('/moderation');
  if (user.userId !== (env as unknown as {OWNER_ID:string}).OWNER_ID) return <main style={{padding:40}}><h1>Owner access required</h1></main>;
  return <Moderation />;
}
