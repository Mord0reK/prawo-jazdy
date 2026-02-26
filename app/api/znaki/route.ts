import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare('SELECT * FROM znaki').all();
  return Response.json(results);
}
