import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

function ensureProductsTable(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      category TEXT,
      price REAL,
      stock INTEGER,
      imageUrl TEXT,
      createdAt TEXT
    );
  `);

  const columns = sqlite.prepare('PRAGMA table_info(products)').all() as Array<{ name: string }>;
  if (!columns.some(column => column.name === 'createdAt')) {
    sqlite.exec('ALTER TABLE products ADD COLUMN createdAt TEXT');
  }
}

export async function GET() {
  try {
    const sqlite = new Database(dbPath);
    ensureProductsTable(sqlite);

    const products = sqlite.prepare('SELECT * FROM products').all();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);
    ensureProductsTable(sqlite);

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name || 'Produto',
      description: body.description || '',
      category: body.category || 'Geral',
      price: Number(body.price || 0),
      stock: Number(body.stock || 0),
      imageUrl: body.imageUrl || '',
      createdAt: new Date().toISOString()
    };

    const stmt = sqlite.prepare(`
      INSERT INTO products (id, name, description, category, price, stock, imageUrl, createdAt)
      VALUES (@id, @name, @description, @category, @price, @stock, @imageUrl, @createdAt)
    `);

    stmt.run(newProduct);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    const stmt = sqlite.prepare(`
      UPDATE products 
      SET name = ?, description = ?, category = ?, price = ?, stock = ?, imageUrl = ?
      WHERE id = ?
    `);

    stmt.run(
      body.name,
      body.description || '',
      body.category,
      Number(body.price || 0),
      Number(body.stock || 0),
      body.imageUrl || '',
      body.id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
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
    const stmt = sqlite.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}