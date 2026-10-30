export type ProductCategory = 
  | 'all'
  | 'arvores'
  | 'enfeites'
  | 'guardanapos'
  | 'iluminacao'
  | 'presepios'
  | 'personalizados'
  | 'festivas';

export interface ProductColorOption {
  name: string; // 'Dourado' | 'Vermelho' | 'Branco' | 'Verde'
  hex: string;
  finish?: string;
}

export interface VolumePriceTier {
  qty: number;
  price: number;
  label?: string;
}

export interface Product {
  id: string;
  name: string;
  title?: string; // Standard e-commerce alias for name
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  fullDescription: string;
  description?: string; // Standard e-commerce alias for fullDescription
  dimensions?: string;
  weight?: string;
  layerResolution?: string;
  material?: string;
  printTime?: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  colors: ProductColorOption[];
  tags: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  colorImages?: Record<string, string>; // Maps color name (e.g. 'Dourado') to image URL
  imageTheme?: string;
  isCustomizable?: boolean;
  customTextPlaceholder?: string;
  minQuantity?: number;
  quantityStep?: number;
  volumePricing?: VolumePriceTier[];
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColorOption;
  quantity: number;
  customText?: string;
}

export interface CustomOrderState {
  itemType: string;
  customText: string;
  color: string;
  urgentHoliday: boolean;
  clientName: string;
  clientPhone: string;
  notes: string;
}
