import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { format, isToday, parseISO } from 'date-fns';

export async function GET() {
  try {
    const db = getDB();
    
    const sales = db.sales || [];
    const products = db.products || [];
    const appointments = db.appointments || [];
    const customers = db.customers || [];
    const services = db.services || [];

    // Simple calculations based on mock/stored data
    const today = new Date();
    
    const salesToday = sales.filter((s: any) => isToday(parseISO(s.date)));
    const totalSalesDay = salesToday.reduce((acc: number, s: any) => acc + (s.total || 0), 0);
    
    const totalSalesMonth = sales.reduce((acc: number, s: any) => acc + (s.total || 0), 0); // Simplified
    
    const lowStock = products.filter((p: any) => (p.stock || 0) <= 5);
    
    const recentSales = [...sales].sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);
    
    const nextAppointments = [...appointments]
      .filter((a: any) => a.status === 'PENDING' || a.status === 'CONFIRMED')
      .sort((a: any, b: any) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
      .slice(0, 5);

    return NextResponse.json({
      totalSalesDay,
      totalSalesMonth,
      customerCount: customers.length,
      productCount: products.length,
      serviceCount: services.length,
      appointmentCount: appointments.length,
      lowStock,
      recentSales,
      nextAppointments
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}