import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { format, isToday, parseISO } from 'date-fns';

export async function GET() {
  try {
    const db = getDB();
    
    // Simple calculations based on mock/stored data
    const today = new Date();
    
    const salesToday = db.sales.filter(s => isToday(parseISO(s.date)));
    const totalSalesDay = salesToday.reduce((acc, s) => acc + s.total, 0);
    
    const totalSalesMonth = db.sales.reduce((acc, s) => acc + s.total, 0); // Simplified
    
    const lowStock = db.products.filter(p => p.stock <= 5);
    
    const recentSales = [...db.sales].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);
    
    const nextAppointments = [...db.appointments]
      .filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED')
      .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
      .slice(0, 5);

    return NextResponse.json({
      totalSalesDay,
      totalSalesMonth,
      customerCount: db.customers.length,
      productCount: db.products.length,
      serviceCount: db.services.length,
      appointmentCount: db.appointments.length,
      lowStock,
      recentSales,
      nextAppointments
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
