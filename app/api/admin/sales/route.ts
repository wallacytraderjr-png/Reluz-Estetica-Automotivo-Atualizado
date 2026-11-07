import { NextResponse } from 'next/server';

const defaultSales = [
  {
    id: 'VEND-001',
    customerName: 'Carlos Silva',
    customerEmail: 'carlos@email.com',
    items: [{ name: 'Cera Ceramic Pro Vonixx', quantity: 1, price: 149.90 }],
    total: 149.90,
    status: 'Concluído',
    createdAt: new Date().toISOString()
  },
  {
    id: 'VEND-002',
    customerName: 'Mariana Souza',
    customerEmail: 'mariana@email.com',
    items: [{ name: 'Shampoo Automotivo High Tech', quantity: 2, price: 59.90 }],
    total: 119.80,
    status: 'Processando',
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Retorna sempre um array limpo para evitar erros no .filter()
    return NextResponse.json(defaultSales);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json(defaultSales);
  }
}