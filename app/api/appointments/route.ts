import { NextResponse } from 'next/server';
import { getDB, saveDB, Appointment } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const db = getDB();
    const data = await request.json();
    
    // Find service name
    const services = db.services || [];
    const service = services.find((s: any) => s.id === data.serviceId);
    
    const newAppointment: Appointment = {
      id: `a-${Date.now()}`,
      customerName: data.customerName,
      phone: data.phone,
      vehicle: `${data.vehicleBrand} ${data.vehicleModel} (${data.plate})`,
      serviceId: data.serviceId,
      serviceName: service?.name || 'Serviço Personalizado',
      date: data.date,
      time: data.time,
      status: 'PENDING',
      notes: data.notes
    };
    
    // Also save customer if not exists
    const customers = db.customers || [];
    const existingCustomer = customers.find((c: any) => c.phone === data.phone);
    if (!existingCustomer) {
      if (!db.customers) db.customers = [];
      db.customers.push({
        id: `c-${Date.now()}`,
        name: data.customerName,
        phone: data.phone,
        address: '',
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        plate: data.plate,
        color: data.color,
        createdAt: new Date().toISOString()
      });
    }
    
    if (!db.appointments) db.appointments = [];
    db.appointments.push(newAppointment);
    saveDB(db);
    
    return NextResponse.json(newAppointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json(db.appointments || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}