export type VehicleType = 'auto' | 'camioneta' | 'SUV' | 'híbrido';

export interface VehicleSpecifications {
  engine: string;       // e.g., "2.0L Turbo 4-Cilindros"
  transmission: string; // e.g., "Automática de 8 velocidades"
  color: string;        // e.g., "Gris Grafito"
  fuel: string;         // e.g., "Gasolina", "Híbrido", "Eléctrico"
  doors: number;        // e.g., 4, 5, 2
  traction?: string;    // e.g., "AWD", "FWD", "RWD"
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  discount: number; // Percentage (e.g., 15 for 15% off)
  mileage: number; // In kilometers
  type: VehicleType;
  images: string[]; // URLs or base64 data
  videoUrl: string; // YouTube or direct video URL (e.g., https://www.youtube.com/embed/...)
  specifications: VehicleSpecifications;
  badgeType: 'none' | 'discount' | 'last_units' | 'new' | 'custom';
  badgeText?: string; // Text to display if custom
}

export interface FilterState {
  search: string;
  brand: string;
  type: string;
  yearFrom: number;
  yearTo: number;
  mileageMax: number;
  priceMin: number;
  priceMax: number;
}
