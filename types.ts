export enum ProductCategory {
  WATCH = 'Relojes',
  PERFUME = 'Perfumes'
}

export enum PerfumeType {
  DESIGNER = 'Diseñador',
  ARAB = 'Árabe',
  NICHE = 'Nicho',
  KITS = 'Kits'
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  offerPrice?: number;
  category: string; // Changed from ProductCategory to string to allow dynamic categories
  subCategory?: PerfumeType;
  description: string;
  image: string; // Main cover image
  gallery?: string[]; // Additional images (Max 3 total recommended)
  isStock: boolean; // New field for stock management
  isVisible?: boolean; // New field to show/hide product in store
  isBestSeller?: boolean; // New field for 'Más Vendido'
  isDecantAvailable?: boolean;
  decantPrice3ml?: number;
  decantPrice5ml?: number;
  decantPrice10ml?: number;
}

export interface CartItem extends Product {
  cartId: string;
  variant: 'bottle' | '3ml' | '5ml' | '10ml';
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: {
    productName: string;
    variant: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  method: string;
  status: 'PENDING_WHATSAPP';
}

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'CASH';

export type ViewState = 'HOME' | 'WATCHES' | 'PERFUMES' | 'ADMIN' | 'WISHLIST';