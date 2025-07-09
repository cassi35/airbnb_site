export const templateEmailVerify = (token:string):string => {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verificação de E-mail</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color:#3b82f6; color:#ffffff; text-align:center; padding:20px; border-top-left-radius:12px; border-top-right-radius:12px;">
                <h2 style="margin:0;">Easy English</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 20px; text-align:center; color:#111827;">
                <h1 style="font-size:24px; margin-bottom:16px;">Verifique seu e-mail</h1>
                <p style="font-size:16px; color:#4b5563; margin-bottom:30px;">Use o código abaixo para concluir sua verificação de e-mail.</p>
                <div style="display:inline-block; background-color:#e0f2fe; color:#0284c7; padding:14px 24px; border-radius:8px; font-size:20px; letter-spacing:2px; font-weight:bold;">
                  ${token}
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align:center; font-size:12px; color:#9ca3af; padding:20px; border-bottom-left-radius:12px; border-bottom-right-radius:12px;">
                © ${new Date().getFullYear()} Easy English. Todos os direitos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export const templateEmailWelcome = (name:string):string => {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Bem-vindo à Easy English</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f0f4f8; font-family: 'Segoe UI', sans-serif; color: #1f2937;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f4f8; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
            <tr>
              <td style="background: linear-gradient(135deg, #3b82f6, #60a5fa); padding: 30px; text-align: center; color: white;">
                <h1 style="margin:0; font-size:28px;">Easy English</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 20px; text-align: center;">
                <h2 style="font-size: 22px; margin-bottom: 15px; color: #111827;">Bem-vindo, ${name}!</h2>
                <p style="font-size:16px; color:#4b5563; line-height:1.6; margin:0 0 10px 0;">
                  Estamos muito felizes por ter você na <span style="color:#3b82f6; font-weight:bold;">Easy English</span>!
                </p>
                <p style="font-size:16px; color:#4b5563; line-height:1.6; margin:0 0 10px 0;">
                  Aqui, você vai aprender inglês de um jeito leve, rápido e eficiente. 💡
                </p>
                <p style="font-size:16px; color:#4b5563; line-height:1.6; margin:0;">
                  Prepare-se para uma jornada incrível rumo à fluência. E o melhor: você não está sozinho nessa.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center; font-size:12px; color:#9ca3af; padding: 20px;">
                © ${new Date().getFullYear()} Easy English. Todos os direitos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}