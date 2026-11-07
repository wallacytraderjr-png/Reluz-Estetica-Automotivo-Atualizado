import fs from 'fs';
import path from 'path';

// Define a estrutura e o caminho do ficheiro JSON de dados
const filePath = path.join(process.cwd(), 'data', 'db.json');

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  active: boolean;
}

export function getDB() {
  try {
    if (!fs.existsSync(filePath)) {
      // Retorna uma estrutura base vazia caso o ficheiro ainda não exista
      return {
        products: [],
        customers: [],
        appointments: [],
        gallery: [],
        settings: {}
      };
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Erro ao ler a base de dados:', error);
    return {
      products: [],
      customers: [],
      appointments: [],
      gallery: [],
      settings: {}
    };
  }
}

// Cria um alias para aceitar tanto getDB quanto getDb (evita erros de maiúsculas/minúsculas)
export const getDb = getDB;

export function saveDB(data: any) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar a base de dados:', error);
  }
}