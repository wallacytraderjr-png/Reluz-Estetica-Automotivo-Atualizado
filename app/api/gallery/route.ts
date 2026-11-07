import { NextResponse } from 'next/server';

const defaultGalleryItems = [
  {
    id: '1',
    title: 'Lavagem Detalhada - BMW M4',
    category: 'Lavagem',
    description: 'Lavagem Detalhada - BMW M4',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'
  },
  {
    id: '2',
    title: 'Polimento Técnico - Mercedes AMG',
    category: 'Polimento',
    description: 'Polimento Técnico - Mercedes AMG',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399'
  },
  {
    id: '3',
    title: 'Higienização Interna Completa',
    category: 'Higienização',
    description: 'Higienização Interna Completa',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935'
  }
];

export async function GET() {
  try {
    return NextResponse.json(defaultGalleryItems);
  } catch (error) {
    console.error('Erro ao buscar itens da galeria:', error);
    return NextResponse.json(defaultGalleryItems);
  }
}