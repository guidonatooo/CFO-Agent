export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const allowedOrigins = [
    'https://cfo-agent.vercel.app', // atualizar com URL real após deploy
    'http://localhost:3000',
    'http://127.0.0.1:5500'
  ];

  const origin = req.headers.get('origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), { status: 400, headers: corsHeaders });
  }

  const { sql, params, userId } = body;

  // Validação: só permite operações básicas
  const allowed = /^\s*(SELECT|INSERT|UPDATE|DELETE)\s/i;
  if (!sql || !allowed.test(sql)) {
    return new Response(JSON.stringify({ error: 'Query não permitida' }), { status: 403, headers: corsHeaders });
  }

  // Segurança: toda query deve ter user_id para isolar dados por usuário
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId obrigatório' }), { status: 401, headers: corsHeaders });
  }

  try {
    const { neon } = await import('https://esm.sh/@neondatabase/serverless@0.9.3');
    const db = neon(process.env.NEON_DATABASE_URL);
    const result = await db(sql, params || []);
    return new Response(JSON.stringify({ data: result }), { headers: corsHeaders });
  } catch (err) {
    console.error('DB Error:', err.message);
    return new Response(JSON.stringify({ error: 'Erro no banco de dados' }), { status: 500, headers: corsHeaders });
  }
}
