import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json(db.products || []);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    
    const newProduct = {
      id: `p-${Date.now()}`,
      ...body,
      active: true,
      stock: Number(body.stock) || 10
    };

    db.products = db.products || [];
    db.products.push(newProduct);
    saveDB(db);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}