import { NextResponse } from 'next/server';
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
    const { token } = await req.json();

    if (!token) {
      console.error('Token no proporcionado');
      return NextResponse.json(
        { message: 'Token es requerido' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const deleteQuery = 'DELETE FROM sessions WHERE token = ?';
    await db.run(deleteQuery, token);

    console.log(`Sesión con token ${token} eliminada correctamente.`);

    return NextResponse.json({ message: 'Logout exitoso' }, { status: 200 });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
