import fs from 'fs';
import path from 'path';

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

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  active?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  plate?: string;
  color?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  customerName?: string;
  clientName?: string;
  name?: string;
  phone: string;
  vehicle?: string;
  serviceId?: string;
  serviceName?: string;
  service?: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt?: string;
}

export function getDB() {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        products: [],
        services: [],
        customers: [],
        appointments: [],
        sales: [],
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
      services: [],
      customers: [],
      appointments: [],
      sales: [],
      gallery: [],
      settings: {}
    };
  }
}

// Alias para compatibilidade
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