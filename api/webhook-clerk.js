export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const svix_id        = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (payload.type !== 'user.created') {
    return new Response('Event ignored', { status: 200 });
  }

  const user      = payload.data;
  const email     = user.email_addresses?.[0]?.email_address;
  const firstName = user.first_name || 'Cliente';

  if (!email) {
    return new Response('No email found', { status: 400 });
  }

  const emailHtml = gerarEmailBoasVindas(firstName, email);

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CFO Agent <onboarding@resend.dev>',
        to: [email],
        subject: '🎉 Bem-vindo ao CFO Agent — Seu acesso está pronto!',
        html: emailHtml
      })
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', err);
      return new Response('Email send failed', { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response('Internal error', { status: 500 });
  }
}

function gerarEmailBoasVindas(nome, email) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bem-vindo ao CFO Agent</title>
</head>
<body style="margin:0;padding:0;background:#F6F8FD;font-family:'Plus Jakarta Sans',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0"
  style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;
    box-shadow:0 4px 32px rgba(14,47,122,0.10);">

  <tr><td style="background:linear-gradient(135deg,#08163A,#0E2F7A);padding:40px;text-align:center;">
    <div style="font-size:28px;font-weight:800;color:white;letter-spacing:0.04em;">CFO Agent</div>
    <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.16em;text-transform:uppercase;margin-top:4px;">Financial Intelligence</div>
  </td></tr>

  <tr><td style="padding:48px 48px 32px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">🎉</div>
    <h1 style="font-size:26px;font-weight:800;color:#08163A;margin:0 0 12px 0;line-height:1.2;">
      Olá, ${nome}! Seu acesso está pronto.
    </h1>
    <p style="font-size:16px;color:#8494B2;line-height:1.7;margin:0;">
      Seja muito bem-vindo ao CFO Agent. Seu painel financeiro está configurado e esperando por você.
    </p>
  </td></tr>

  <tr><td style="padding:0 48px 40px;text-align:center;">
    <a href="https://cfo-agent-five.vercel.app/login"
      style="display:inline-block;padding:16px 48px;
        background:linear-gradient(135deg,#1A4BBF,#2D63E0);
        color:white;text-decoration:none;font-size:16px;font-weight:700;
        border-radius:10px;letter-spacing:0.02em;">
      Acessar meu Dashboard →
    </a>
    <div style="font-size:13px;color:#8494B2;margin-top:12px;">Login: ${email}</div>
  </td></tr>

  <tr><td style="padding:0 48px;">
    <div style="height:1px;background:#EEF1F8;"></div>
  </td></tr>

  <tr><td style="padding:40px 48px;">
    <h2 style="font-size:18px;font-weight:800;color:#08163A;margin:0 0 24px 0;">Como começar em 3 passos</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td width="48" valign="top">
        <div style="width:40px;height:40px;background:#EBF0FC;border-radius:10px;text-align:center;line-height:40px;font-size:18px;">①</div>
      </td>
      <td style="padding-left:16px;">
        <div style="font-weight:700;color:#08163A;font-size:15px;margin-bottom:4px;">Acesse o Dashboard</div>
        <div style="color:#8494B2;font-size:14px;line-height:1.6;">Entre com o email cadastrado. Na primeira entrada, um assistente vai te guiar pela configuração inicial.</div>
      </td>
    </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td width="48" valign="top">
        <div style="width:40px;height:40px;background:#EBF0FC;border-radius:10px;text-align:center;line-height:40px;font-size:18px;">②</div>
      </td>
      <td style="padding-left:16px;">
        <div style="font-weight:700;color:#08163A;font-size:15px;margin-bottom:4px;">Insira seus primeiros dados</div>
        <div style="color:#8494B2;font-size:14px;line-height:1.6;">Vá em <strong style="color:#1A4BBF;">Entrada de Dados</strong> e adicione seu faturamento, custos e saldos bancários do mês atual. Leva menos de 15 minutos.</div>
      </td>
    </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="48" valign="top">
        <div style="width:40px;height:40px;background:#EBF0FC;border-radius:10px;text-align:center;line-height:40px;font-size:18px;">③</div>
      </td>
      <td style="padding-left:16px;">
        <div style="font-weight:700;color:#08163A;font-size:15px;margin-bottom:4px;">Leia a documentação completa</div>
        <div style="color:#8494B2;font-size:14px;line-height:1.6;">Preparamos um guia completo com tudo que você precisa saber.</div>
        <a href="https://cfo-agent-five.vercel.app/onboarding"
          style="display:inline-block;margin-top:10px;padding:8px 20px;border:1px solid #C4CEDE;border-radius:8px;color:#1A4BBF;text-decoration:none;font-size:13px;font-weight:600;">
          📖 Ver documentação →
        </a>
      </td>
    </tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 48px 40px;">
    <div style="background:#F6F8FD;border-radius:12px;padding:24px;text-align:center;">
      <div style="font-size:15px;font-weight:700;color:#08163A;margin-bottom:8px;">Precisa de ajuda?</div>
      <div style="font-size:14px;color:#8494B2;margin-bottom:16px;">Nossa equipe está disponível durante os 3 meses de suporte incluídos no seu plano.</div>
      <a href="https://wa.me/5519991848687"
        style="display:inline-block;padding:10px 28px;background:#25D366;border-radius:8px;color:white;text-decoration:none;font-size:14px;font-weight:700;">
        💬 Falar no WhatsApp
      </a>
    </div>
  </td></tr>

  <tr><td style="background:#F6F8FD;padding:24px 48px;text-align:center;">
    <div style="font-size:12px;color:#8494B2;line-height:1.7;">
      Você recebeu este email porque criamos seu acesso ao CFO Agent.<br>
      © 2026 CFO Agent · Todos os direitos reservados.
    </div>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}
