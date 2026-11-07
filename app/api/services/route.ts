import { NextResponse } from 'next/server';

const defaultServices = [
  {
    id: '1',
    name: 'Lavagem Detalhada',
    description: 'Limpeza técnica minuciosa da carroçaria, caixas de roda, aplicação de protetor de plásticos e acabamento impecável.',
    price: 120.00,
    duration: '2h',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    active: true
  },
  {
    id: '2',
    name: 'Polimento Técnico',
    description: 'Remoção de micro-riscos, oxidação e revitalização profunda do brilho e cor da pintura do veículo.',
    price: 450.00,
    duration: '1 dia',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    active: true
  },
  {
    id: '4',
    name: 'Higienização Interna',
    description: 'Limpeza profunda de bancos de tecido/couro, alcatifas, teto e painel, eliminando ácaros, odores e manchas.',
    price: 200.00,
    duration: '3h',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935',
    active: true
  }
];

export async function GET() {
  try {
    return NextResponse.json(defaultServices);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(defaultServices);
  }
}