import { NextResponse } from 'next/server';

const defaultProducts = [
  {
    id: '1',
    name: 'Cera Ceramic Pro Vonixx',
    description: 'Cera de alta performance à base de SiO2 que protege e dá brilho intenso à pintura.',
    price: 149.90,
    category: 'limpeza',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738',
    stock: 15,
    active: true
  },
  {
    id: '2',
    name: 'Shampoo Automotivo High Tech',
    description: 'Shampoo de alto rendimento com ph neutro e excelente poder de lubrificação.',
    price: 59.90,
    category: 'limpeza',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f',
    stock: 25,
    active: true
  },
  
  
  
];

export async function GET() {
  try {
    // Retorna sempre um array limpo garantindo que o .filter funcione em qualquer página
    return NextResponse.json(defaultProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(defaultProducts);
  }
}