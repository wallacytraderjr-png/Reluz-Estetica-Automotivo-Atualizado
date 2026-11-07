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
    return NextResponse.json(db.customers || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDB();

    const newCustomer = {
      id: Date.now().toString(),
      name: body.name || '',
      phone: body.phone || '',
      address: body.address || '',
      vehicleBrand: body.vehicleBrand || '',
      vehicleModel: body.vehicleModel || '',
      plate: (body.plate || '').toUpperCase(),
      color: body.color || '',
      createdAt: new Date().toISOString()
    };

    if (!db.customers) {
      db.customers = [];
    }

    db.customers.unshift(newCustomer);
    writeDB(db);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}