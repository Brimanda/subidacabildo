import { NextResponse, NextRequest } from 'next/server';
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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    console.error('Token de sesión no proporcionado');
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const db = await getDb();

  try {
    const session = await db.get('SELECT * FROM sessions WHERE token = ?', [token]);

    if (!session) {
      console.error('Token de sesión no válido');
      return NextResponse.json({ message: 'Sesión inválida' }, { status: 401 });
    }

    console.log('Sesión válida:', session);

    return NextResponse.json({
      message: 'Sesión válida',
      role: session.role,
      userId: session.user_id,
    });
  } catch (error) {
    console.error('Error al validar sesión en la base de datos:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await db.close();
  }
}
