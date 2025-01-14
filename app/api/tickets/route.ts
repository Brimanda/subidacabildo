import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'data', 'municipio.db'); 
const db = new sqlite3.Database(dbFilePath);
export const runtime = 'nodejs';

export async function GET() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM tickets', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(new NextResponse(JSON.stringify(rows), { status: 200 }));
            }
        });
    });
}

export async function POST(req: NextRequest) {
  const { user_id, name, area, problema, description, status, n_ticket, resolution, hour_resolution } = await req.json();

  const resolutionValue = resolution || null;
  const hourResolutionValue = hour_resolution || null;

  return new Promise((resolve, reject) => {
      db.run(
          'INSERT INTO tickets (user_id, name, area, problema, description, status, n_ticket, resolution, hour_resolution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [user_id, name, area, problema, description, status, n_ticket, resolutionValue, hourResolutionValue], 
          function (err) {
              if (err) {
                  reject(err);
              } else {
                  resolve(new NextResponse(JSON.stringify({ message: 'Ticket created successfully', userId: this.lastID }), { status: 201 }));
              }
          }
      );
  });
}


export async function PUT(req: NextRequest) {
  const { ID, STATUS, RESOLUTION, HOUR_RESOLUTION } = await req.json();

  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE tickets SET STATUS = ?, RESOLUTION = ?, HOUR_RESOLUTION = ? WHERE ID = ?',
      [STATUS, RESOLUTION, HOUR_RESOLUTION, ID],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(new NextResponse(JSON.stringify({ message: 'Ticket updated successfully' }), { status: 200 }));
        }
      }
    );
  });
}