import { openDb } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await openDb();

    res.status(200).json({ message: 'Conexión exitosa a la base de datos' });
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar con la base de datos', error });
  }
}