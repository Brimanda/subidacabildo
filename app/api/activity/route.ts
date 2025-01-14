import { NextApiRequest } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { NextResponse } from 'next/server'; 

const dbFilePath = path.join(process.cwd(), 'data', 'municipio.db');

async function getDb() {
  return open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });
}

export async function GET(_req: NextApiRequest) {
  try {
    const db = await getDb();
    const activities = await db.all(`
      SELECT * FROM activities
      ORDER BY created_at DESC
      LIMIT 10
    `);

    return NextResponse.json(activities, { status: 200 }); 
  } catch (error) {
    console.error('Error obteniendo actividad reciente:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 }); 
  }
}
