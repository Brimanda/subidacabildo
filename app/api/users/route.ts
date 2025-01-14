import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';

const dbFilePath = path.join(process.cwd(), 'data', 'municipio.db'); 
const db = new sqlite3.Database(dbFilePath);
export const runtime = 'nodejs';

export async function GET() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(new NextResponse(JSON.stringify(rows), { status: 200 }));
            }
        });
    });
}

export async function POST(req: NextRequest) {
    const { name, email, password, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(new NextResponse(JSON.stringify({ message: 'Usuario creado correctamente', userId: this.lastID }), { status: 201 }));
            }
        });

        db.run(
            `INSERT INTO activities (user_id, action) VALUES (?, ?)`,
            ['2',`Se creó un nuevo usuario: ${name}`]
          );
    });
}

export async function DELETE(req: NextRequest) {
    const { userId } = await req.json(); 

    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(new NextResponse(JSON.stringify({ message: 'Usuario eliminado correctamente' }), { status: 200 }));
            }
        });
    });
}

export async function PUT(req: NextRequest) {
    const { userId, name, email, password, role } = await req.json();

    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const updateFields: string[] = [];
    const params: string[] = [];

    if (name) {
        updateFields.push('name = ?');
        params.push(name);
    }
    if (email) {
        updateFields.push('email = ?');
        params.push(email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        params.push(hashedPassword);
    }
    if (role) {
        updateFields.push('role = ?');
        params.push(role);
    }
    params.push(userId); 

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            params,
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new NextResponse(JSON.stringify({ message: 'User updated successfully' }), { status: 200 }));
                }
            }
        );
    });
}
