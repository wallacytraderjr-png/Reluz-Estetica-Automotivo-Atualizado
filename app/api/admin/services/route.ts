import { NextResponse } from 'next/server';
import { getDB, saveDB, Service } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const db = getDB();
    const data = await request.json();
    
    const newService: Service = {
      ...data,
      id: `s-${Date.now()}`
    };
    
    if (!db.services) {
      db.services = [];
    }
    
    db.services.push(newService);
    saveDB(db);
    
    return NextResponse.json(newService);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDB();
    const data = await request.json();
    
    if (!db.services) {
      db.services = [];
    }
    
    const index = db.services.findIndex((s: any) => s.id === data.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    db.services[index] = { ...db.services[index], ...data };
    saveDB(db);
    
    return NextResponse.json(db.services[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}