import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json(db.customers || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    const newCustomer = {
      id: Date.now().toString(),
      name: body.name,
      phone: body.phone,
      address: body.address || '',
      vehicleBrand: body.vehicleBrand,
      vehicleModel: body.vehicleModel,
      plate: body.plate.toUpperCase(),
      color: body.color,
      createdAt: new Date().toISOString()
    };

    if (!db.customers) {
      db.customers = [];
    }

    db.customers.unshift(newCustomer);

    // Caminho para o ficheiro JSON da base de dados (ajuste se o seu db.json estiver noutra pasta, ex: data/db.json)
    const filePath = path.join(process.cwd(), 'data', 'db.json');
    
    // Grava as alterações no disco físico
    if (fs.existsSync(path.dirname(filePath))) {
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
    }

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}