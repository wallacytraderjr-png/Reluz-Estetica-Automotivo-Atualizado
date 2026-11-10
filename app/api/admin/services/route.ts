import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    // Garante que a tabela de serviços existe
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        price REAL,
        imageUrl TEXT,
        duration TEXT,
        active INTEGER
      );
    `);

    const newService = {
      id: `s-${Date.now()}`,
      name: body.name || 'Novo Serviço',
      description: body.description || 'Serviço automotivo profissional.',
      price: Number(body.price) || 0,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      duration: '1h',
      active: body.active !== false ? 1 : 0
    };

    const stmt = sqlite.prepare(`
      INSERT INTO services (id, name, description, price, imageUrl, duration, active)
      VALUES (@id, @name, @description, @price, @imageUrl, @duration, @active)
    `);

    stmt.run(newService);

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    console.error('Erro detalhado no POST admin/services:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    const stmt = sqlite.prepare(`
      UPDATE services 
      SET name = @name, description = @description, price = @price, imageUrl = @imageUrl, active = @active 
      WHERE id = @id
    `);

    stmt.run({
      id: body.id,
      name: body.name || 'Serviço',
      description: body.description || '',
      price: Number(body.price) || 0,
      imageUrl: body.imageUrl || '',
      active: body.active !== false ? 1 : 0
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro detalhado no PUT admin/services:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}