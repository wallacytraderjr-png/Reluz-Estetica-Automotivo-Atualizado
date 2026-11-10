import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

export async function GET() {
  try {
    const sqlite = new Database(dbPath);
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        clientName TEXT,
        items TEXT,
        paymentMethod TEXT,
        total REAL,
        createdAt TEXT
      );
    `);

    const sales = sqlite.prepare('SELECT * FROM sales ORDER BY createdAt DESC').all();
    return NextResponse.json(sales);
  } catch (error: any) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        clientName TEXT,
        items TEXT,
        paymentMethod TEXT,
        total REAL,
        createdAt TEXT
      );
    `);

    const saleId = `VEND-${Math.floor(100 + Math.random() * 900)}`;
    const newSale = {
      id: saleId,
      clientName: body.clientName || 'Cliente Balcão',
      items: body.items || 'Item Balcão',
      paymentMethod: body.paymentMethod || 'Pix',
      total: Number(body.total || 0),
      createdAt: new Date().toISOString()
    };

    const stmt = sqlite.prepare(`
      INSERT INTO sales (id, clientName, items, paymentMethod, total, createdAt)
      VALUES (@id, @clientName, @items, @paymentMethod, @total, @createdAt)
    `);

    stmt.run(newSale);

    // Baixa de estoque exata e direta pelo ID do produto no SQLite
    if (body.type === 'product' && body.productId) {
      const qtyToSubtract = Number(body.quantity || 1);
      try {
        const updateStock = sqlite.prepare(`
          UPDATE products 
          SET stock = stock - ? 
          WHERE id = ?
        `);
        updateStock.run(qtyToSubtract, body.productId);
      } catch (stockErr) {
        console.error('Erro ao abater estoque:', stockErr);
      }
    }

    return NextResponse.json({ success: true, sale: newSale });
  } catch (error: any) {
    console.error('Erro ao registar venda:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}