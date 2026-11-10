import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

export async function GET() {
  try {
    const sqlite = new Database(dbPath);
    // Garante a criação da tabela com a coluna address
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        address TEXT,
        vehicleBrand TEXT,
        vehicleModel TEXT,
        plate TEXT,
        color TEXT,
        createdAt TEXT
      );
    `);

    const customers = sqlite.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all();
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        address TEXT,
        vehicleBrand TEXT,
        vehicleModel TEXT,
        plate TEXT,
        color TEXT,
        createdAt TEXT
      );
    `);

    const newCustomer = {
      id: `cli-${Date.now()}`,
      name: body.name || body.customerName || 'Cliente',
      phone: body.phone || '',
      address: body.address || '',
      vehicleBrand: body.vehicleBrand || '',
      vehicleModel: body.vehicleModel || '',
      plate: body.plate || '',
      color: body.color || '',
      createdAt: new Date().toISOString()
    };

    const stmt = sqlite.prepare(`
      INSERT INTO customers (id, name, phone, address, vehicleBrand, vehicleModel, plate, color, createdAt)
      VALUES (@id, @name, @phone, @address, @vehicleBrand, @vehicleModel, @plate, @color, @createdAt)
    `);

    stmt.run(newCustomer);

    return NextResponse.json({ success: true, customer: newCustomer });
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        address TEXT,
        vehicleBrand TEXT,
        vehicleModel TEXT,
        plate TEXT,
        color TEXT,
        createdAt TEXT
      );
    `);

    const stmt = sqlite.prepare(`
      UPDATE customers 
      SET name = @name, phone = @phone, address = @address, vehicleBrand = @vehicleBrand, vehicleModel = @vehicleModel, plate = @plate, color = @color
      WHERE id = @id
    `);

    stmt.run({
      id: body.id,
      name: body.name || '',
      phone: body.phone || '',
      address: body.address || '',
      vehicleBrand: body.vehicleBrand || '',
      vehicleModel: body.vehicleModel || '',
      plate: body.plate || '',
      color: body.color || ''
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    const sqlite = new Database(dbPath);
    const stmt = sqlite.prepare('DELETE FROM customers WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}