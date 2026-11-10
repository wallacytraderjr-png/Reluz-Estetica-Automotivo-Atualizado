import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
const jsonPath = path.join(process.cwd(), 'data', 'db.json');

const defaultGalleryItems = [
  {
    id: 'g1',
    category: 'Vitrificações',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    description: 'BMW com Vitrificação 9H'
  },
  {
    id: 'g2',
    category: 'Polimentos',
    imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop',
    description: 'Correção de pintura em Mercedes'
  },
  {
    id: 'g3',
    category: 'Lavagens',
    imageUrl: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?q=80&w=800&auto=format&fit=crop',
    description: 'Lavagem detalhada em SUV'
  },
  {
    id: 'g4',
    category: 'Nossa Loja',
    imageUrl: '/assets/aistudio/loja_6d7bc3b4.jpg',
    description: 'Fachada da Reluz Estética Automotiva'
  }
];

function ensureGalleryTable(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      category TEXT,
      imageUrl TEXT,
      description TEXT
    );
  `);
}

function syncDbJson(items: any[]) {
  try {
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw);
      data.gallery = items;
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Erro ao sincronizar db.json:', error);
  }
}

export async function GET() {
  try {
    const sqlite = new Database(dbPath);
    ensureGalleryTable(sqlite);

    let items = sqlite.prepare('SELECT * FROM gallery ORDER BY rowid DESC').all();

    if (!items || items.length === 0) {
      const insert = sqlite.prepare(`
        INSERT INTO gallery (id, category, imageUrl, description)
        VALUES (@id, @category, @imageUrl, @description)
      `);

      const insertMany = sqlite.transaction((rows: any[]) => {
        for (const row of rows) {
          insert.run(row);
        }
      });

      insertMany(defaultGalleryItems);
      items = sqlite.prepare('SELECT * FROM gallery ORDER BY rowid DESC').all();
      syncDbJson(items);
    }

    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Erro ao buscar itens da galeria:', error);
    return NextResponse.json(defaultGalleryItems);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.imageUrl) {
      return NextResponse.json({ error: 'A URL da imagem é obrigatória.' }, { status: 400 });
    }

    const sqlite = new Database(dbPath);
    ensureGalleryTable(sqlite);

    const newItem = {
      id: body.id || `g-${Date.now()}`,
      category: body.category || 'Lavagens',
      imageUrl: body.imageUrl,
      description: body.description || ''
    };

    const stmt = sqlite.prepare(`
      INSERT INTO gallery (id, category, imageUrl, description)
      VALUES (@id, @category, @imageUrl, @description)
    `);

    stmt.run(newItem);

    const allItems = sqlite.prepare('SELECT * FROM gallery ORDER BY rowid DESC').all();
    syncDbJson(allItems);

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao adicionar foto na galeria:', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar imagem.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // ignore
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'ID da imagem não fornecido.' }, { status: 400 });
    }

    const sqlite = new Database(dbPath);
    ensureGalleryTable(sqlite);

    const stmt = sqlite.prepare('DELETE FROM gallery WHERE id = ?');
    stmt.run(id);

    const allItems = sqlite.prepare('SELECT * FROM gallery ORDER BY rowid DESC').all();
    syncDbJson(allItems);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('Erro ao excluir foto da galeria:', error);
    return NextResponse.json({ error: error.message || 'Erro ao excluir imagem.' }, { status: 500 });
  }
}
