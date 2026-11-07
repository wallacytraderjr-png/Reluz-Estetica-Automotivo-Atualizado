import { NextResponse } from 'next/server';
import { getDb, saveDB, Product } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const db = getDb();
    const data = await request.json();
    
    const newProduct: Product = {
      ...data,
      id: `p-${Date.now()}`
    };
    
    db.products.push(newProduct);
    saveDB(db);
    
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const data = await request.json();
    
    const index = db.products.findIndex(p => p.id === data.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    db.products[index] = { ...db.products[index], ...data };
    saveDB(db);
    
    return NextResponse.json(db.products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const db = getDb();
    db.products = db.products.filter(p => p.id !== id);
    saveDB(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
