import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const data = getDB();

    const backup = {
      versao: '1.0',
      geradoEm: new Date().toISOString(),
      sistema: 'Reluz Estética Automotiva',
      dados: data,
    };

    const json = JSON.stringify(backup, null, 2);
    const dataHora = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19);
    const filename = `reluz-backup-${dataHora}.json`;

    return new NextResponse(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar backup:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar backup do sistema.' },
      { status: 500 }
    );
  }
}
