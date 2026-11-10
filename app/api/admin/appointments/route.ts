import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'db.json');

function readDB() {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      const initialData = { customers: [], products: [], services: [], appointments: [], sales: [] };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler a base de dados:', error);
    return { customers: [], products: [], services: [], appointments: [], sales: [] };
  }
}

function writeDB(data: any) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao escrever na base de dados:', error);
  }
}

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.appointments || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    const db = readDB();

    if (!db.appointments) {
      db.appointments = [];
    }

    const index = db.appointments.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.appointments[index].status = status;
    writeDB(db);

    return NextResponse.json(db.appointments[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}