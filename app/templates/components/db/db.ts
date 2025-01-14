import path from 'path';
import sqlite3 from 'sqlite3';

const dbFilePath = path.join(process.cwd(), 'data', 'users.json')
const db = new sqlite3.Database(dbFilePath);

interface User {
    id: number;
    name: string;
    email: string;
  }
  
  interface Ticket {
    id: number;
    title: string;
    description: string;
  }

  
  import path from 'path';
  import sqlite3 from 'sqlite3';
  
  const dbFilePath = path.join(process.cwd(), 'data', 'users.json');
  const db = new sqlite3.Database(dbFilePath);
  
  export function getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', [], (err, rows: User[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  export function deleteUser(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  export function getTickets(): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tickets', [], (err, rows: Ticket[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  