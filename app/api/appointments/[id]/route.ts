import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
    const sqlite = new Database(dbPath);

    const stmt = sqlite.prepare('UPDATE appointments SET status = ? WHERE id = ?');
    stmt.run(status, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}