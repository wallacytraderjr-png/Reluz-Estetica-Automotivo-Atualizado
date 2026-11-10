import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

const defaultServices = [
  {
    id: '1',
    name: 'Lavagem Detalhada',
    description: 'Limpeza técnica minuciosa da carroçaria, caixas de roda, aplicação de protetor de plásticos e acabamento impecável.',
    price: 120.00,
    duration: '2h',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    active: true
  },
  {
    id: '2',
    name: 'Polimento Técnico',
    description: 'Remoção de micro-riscos, oxidação e revitalização profunda do brilho e cor da pintura do veículo.',
    price: 450.00,
    duration: '1 dia',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    active: true
  },
  {
    id: '4',
    name: 'Higienização Interna',
    description: 'Limpeza profunda de bancos de tecido/couro, alcatifas, teto e painel, eliminando ácaros, odores e manchas.',
    price: 200.00,
    duration: '3h',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935',
    active: true
  }
];

export async function GET() {
  try {
    const sqlite = new Database(dbPath);
    
    // Garantir que a tabela existe
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

    const services = sqlite.prepare('SELECT * FROM services').all();

    if (!services || services.length === 0) {
      const insert = sqlite.prepare(`
        INSERT INTO services (id, name, description, price, imageUrl, duration, active)
        VALUES (@id, @name, @description, @price, @imageUrl, @duration, @active)
      `);
      
      const insertMany = sqlite.transaction((items) => {
        for (const item of items) {
          insert.run({
            ...item,
            active: item.active ? 1 : 0
          });
        }
      });
      
      insertMany(defaultServices);
      
      const freshServices = sqlite.prepare('SELECT * FROM services').all();
      const formatted = freshServices.map((s: any) => ({ ...s, active: Boolean(s.active) }));
      return NextResponse.json(formatted);
    }

    const formatted = services.map((s: any) => ({ ...s, active: Boolean(s.active) }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar serviços na API pública:', error);
    return NextResponse.json(defaultServices);
  }
}