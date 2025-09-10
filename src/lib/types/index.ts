// Tipos para el sistema 4AMotos

export interface Repuesto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  stock: number;
  disponible: boolean;
  imagen_url?: string;
  marca?: string;
  codigo_producto: string;
  created: string;
  updated: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  created: string;
}

export interface CartItem {
  repuesto: Repuesto;
  cantidad: number;
}

export interface SearchFilters {
  nombre?: string;
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  disponible?: boolean;
}
