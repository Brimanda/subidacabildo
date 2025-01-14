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

export async function GET(req: Request) {
  try {
    const db = await getDb();

    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    const totalTickets = await db.get('SELECT COUNT(*) as count FROM tickets');
    const openTickets = await db.get('SELECT COUNT(*) as count FROM tickets WHERE status = ?', 'Abierto');
    const resolvedTickets = await db.get('SELECT COUNT(*) as count FROM tickets WHERE status = ?', 'Cerrado');

    const response = {
      totalUsers: totalUsers.count,
      totalTickets: totalTickets.count,
      openTickets: openTickets.count,
      resolvedTickets: resolvedTickets.count,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);

    return new Response(
      JSON.stringify({ message: 'Error al obtener datos del dashboard' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
