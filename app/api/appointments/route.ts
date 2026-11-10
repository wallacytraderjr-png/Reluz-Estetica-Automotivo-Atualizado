import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

export async function GET() {
  try {
    const sqlite = new Database(dbPath);
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        clientName TEXT,
        phone TEXT,
        vehicleBrand TEXT,
        vehicleModel TEXT,
        plate TEXT,
        color TEXT,
        serviceId TEXT,
        date TEXT,
        time TEXT,
        notes TEXT,
        status TEXT,
        createdAt TEXT
      );
    `);

    const appointments = sqlite.prepare('SELECT * FROM appointments ORDER BY createdAt DESC').all();
    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        clientName TEXT,
        phone TEXT,
        vehicleBrand TEXT,
        vehicleModel TEXT,
        plate TEXT,
        color TEXT,
        serviceId TEXT,
        date TEXT,
        time TEXT,
        notes TEXT,
        status TEXT,
        createdAt TEXT
      );
    `);

    const newAppointment = {
      id: `ag-${Date.now()}`,
      clientName: body.customerName || body.clientName || 'Cliente',
      phone: body.phone || '',
      vehicleBrand: body.vehicleBrand || '',
      vehicleModel: body.vehicleModel || '',
      plate: body.plate || '',
      color: body.color || '',
      serviceId: body.serviceId || '',
      date: body.date || '',
      time: body.time || '',
      notes: body.notes || '',
      status: 'Pendente',
      createdAt: new Date().toISOString()
    };

    const stmt = sqlite.prepare(`
      INSERT INTO appointments (id, clientName, phone, vehicleBrand, vehicleModel, plate, color, serviceId, date, time, notes, status, createdAt)
      VALUES (@id, @clientName, @phone, @vehicleBrand, @vehicleModel, @plate, @color, @serviceId, @date, @time, @notes, @status, @createdAt)
    `);

    stmt.run(newAppointment);

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error: any) {
    console.error('Erro detalhado na API de agendamentos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sqlite = new Database(dbPath);

    const stmt = sqlite.prepare(`
      UPDATE appointments 
      SET status = @status 
      WHERE id = @id
    `);

    stmt.run({
      id: body.id,
      status: body.status
    });

    if (body.status === 'Concluído') {
      try {
        const appt = sqlite.prepare('SELECT * FROM appointments WHERE id = ?').get(body.id) as any;
        if (appt) {
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

          const saleId = `VEND-AG-${Math.floor(100 + Math.random() * 900)}`;
          const insertSale = sqlite.prepare(`
            INSERT INTO sales (id, clientName, items, paymentMethod, total, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
          `);
          insertSale.run(
            saleId,
            appt.clientName || 'Cliente Agendamento',
            appt.serviceId || 'Serviço Estético Automotivo',
            'Pix / Agendamento',
            150.00,
            new Date().toISOString()
          );
        }
      } catch (saleErr) {
        console.error('Erro ao gerar venda automática:', saleErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao atualizar status do agendamento:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}