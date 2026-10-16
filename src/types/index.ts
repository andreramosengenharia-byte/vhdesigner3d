export type ProductCategory = 
  | 'all'
  | 'arvores'
  | 'enfeites'
  | 'guardanapos'
  | 'iluminacao'
  | 'presepios'
  | 'personalizados';

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
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  fullDescription: string;
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
  imageTheme:
    | 'baubles'
    | 'spiral_tree'
    | 'lantern'
    | 'nativity'
    | 'star'
    | 'napkin_ring'
    | 'reindeer'
    | 'snowflakes'
    | 'village'
    | 'snowman'
    | 'cookie_cutter'
    | 'custom_ball'
    | 'personalized_tree_sign'
    | 'napkin_rings_set'
    | 'snowflake_name_mandala'
    | 'decorative_tree'
    | 'nativity_lamp';
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
