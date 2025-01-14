import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
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
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      console.error('Faltan las credenciales: correo y/o contraseña.');
      return NextResponse.json(
        { message: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      console.error(`No se encontró un usuario con el correo: ${email}`);
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error('Contraseña incorrecta.');
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = randomUUID();

    await db.run(
      `INSERT INTO sessions (token, user_id, role, created_at) 
       VALUES (?, ?, ?, datetime('now'))`,
      [token, user.id, user.role]
    );

    console.log(`Usuario ${user.email} inició sesión correctamente.`);

    return NextResponse.json(
      { message: 'Login exitoso', token, username: user.username, role: user.role },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
