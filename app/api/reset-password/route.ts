import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
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

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return new NextResponse(
      JSON.stringify({ error: 'Token y nueva contraseña son requeridos.' }),
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE reset_token = ?', [token]);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Token inválido o expirado.' }),
        { status: 400 }
      );
    }

    const tokenExpiry = new Date(user.reset_token_expiry);
    if (tokenExpiry < new Date()) {
      return new NextResponse(
        JSON.stringify({ error: 'Token ha expirado.' }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    return new NextResponse(
      JSON.stringify({ message: 'Contraseña restablecida correctamente.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Error al restablecer la contraseña.' }),
      { status: 500 }
    );
  }
}
