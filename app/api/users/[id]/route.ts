import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';

const dbFilePath = path.join(process.cwd(), 'data', 'municipio.db');
const db = new sqlite3.Database(dbFilePath);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(new NextResponse(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 }));
            } else {
                resolve(new NextResponse(JSON.stringify(row), { status: 200 }));
            }
        });
    });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const { name, email, password, role } = await req.json();

    const updateFields: string[] = [];
    const paramsToUpdate: (string | number)[] = [];

    if (name) {
        updateFields.push('name = ?');
        paramsToUpdate.push(name);
    }
    if (email) {
        updateFields.push('email = ?');
        paramsToUpdate.push(email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        paramsToUpdate.push(hashedPassword);
    }
    if (role) {
        updateFields.push('role = ?');
        paramsToUpdate.push(role);
    }
    paramsToUpdate.push(id);

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            paramsToUpdate,
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new NextResponse(JSON.stringify({ message: 'Usuario actualizado' }), { status: 200 }));
                }
            }
        );
    });
}
