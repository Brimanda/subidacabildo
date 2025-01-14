import { Resend } from 'resend';
import { EmailTemplate } from '@/app/templates/components/email/email-template';
import { randomBytes } from 'crypto';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; 
import path from 'path';


const dbFilePath = path.join(process.cwd(), 'data', 'municipio.db'); 

async function getDb() {
  return open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Correo requerido' }), {
      status: 400,
    });
  }

  try {
    const db = await getDb(); 

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
      });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); 

    await db.run(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [token, expiresAt.toISOString(), email]
    );

    const resetLink = `http://localhost:3000/accounts/resetear-contrasena?token=${token}`;

    await resend.emails.send({
      from: 'Soporte Municipio <onboarding@resend.dev>',
      to: [email],
      subject: 'Restablecimiento de contraseña',
      react: await EmailTemplate({
        nombre: user.name,
        mensaje: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
      }),
    });

    return new Response(
      JSON.stringify({ message: 'Correo de recuperación enviado' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Error al enviar el correo' }),
      { status: 500 }
    );
  }
}
