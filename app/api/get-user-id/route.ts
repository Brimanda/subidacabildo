import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { token } = body;

    if (!token) {
        return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
    }

    try {
        const db = await getDb();
        const query = 'SELECT user_id FROM sessions WHERE token = ?';

        const row = await db.get(query, token);

        if (!row) {
            return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ user_id: row.user_id });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        return NextResponse.json(
            { error: 'Error al consultar la base de datos' },
            { status: 500 }
        );
    }
}
