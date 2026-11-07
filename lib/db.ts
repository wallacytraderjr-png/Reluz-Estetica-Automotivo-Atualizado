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