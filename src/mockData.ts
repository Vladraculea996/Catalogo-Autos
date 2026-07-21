import { Car } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: 'ford-bronco-2023',
    brand: 'Ford',
    model: 'Bronco Sport Wildtrak',
    year: 2023,
    price: 48900,
    discount: 10,
    mileage: 12000,
    type: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1610647752607-3c816d628520?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/S_8q8g7vG3s',
    specifications: {
      engine: '2.0L EcoBoost Turbo',
      transmission: 'Automática de 8 velocidades',
      color: 'Gris Cemento',
      fuel: 'Gasolina',
      doors: 5,
      traction: '4x4 AWD'
    },
    badgeType: 'discount'
  },
  {
    id: 'porsche-911-2022',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2022,
    price: 135000,
    discount: 5,
    mileage: 4500,
    type: 'auto',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/m6_b1lCsk5U',
    specifications: {
      engine: '3.0L Twin-Turbo Flat-6',
      transmission: 'PDK Doble Embrague 8 vel',
      color: 'Azul Tiburón',
      fuel: 'Gasolina',
      doors: 2,
      traction: 'RWD Tracción Trasera'
    },
    badgeType: 'last_units'
  },
  {
    id: 'toyota-rav4-2024',
    brand: 'Toyota',
    model: 'RAV4 Limited Hybrid',
    year: 2024,
    price: 42500,
    discount: 0,
    mileage: 2500,
    type: 'híbrido',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1625217527288-93919c99650a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1621007947382-cc34aa8668c2?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/j_8YgZcW21Q',
    specifications: {
      engine: '2.5L 4-Cilindros + Motor Eléctrico',
      transmission: 'eCVT Electrónica',
      color: 'Blanco Perlado',
      fuel: 'Híbrido',
      doors: 5,
      traction: 'AWD inteligente'
    },
    badgeType: 'new'
  },
  {
    id: 'chevrolet-silverado-2021',
    brand: 'Chevrolet',
    model: 'Silverado Trail Boss Z71',
    year: 2021,
    price: 58000,
    discount: 15,
    mileage: 42000,
    type: 'camioneta',
    images: [
      'https://images.unsplash.com/photo-1533557837482-55d8d893f961?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/Ure2X3xUjLg',
    specifications: {
      engine: '5.3L EcoTec3 V8',
      transmission: 'Automática de 10 velocidades',
      color: 'Negro Obsidiana',
      fuel: 'Gasolina',
      doors: 4,
      traction: '4x4 con reductora'
    },
    badgeType: 'custom',
    badgeText: '¡Impecable!'
  },
  {
    id: 'nissan-gtr-2020',
    brand: 'Nissan',
    model: 'GT-R Nismo',
    year: 2020,
    price: 210000,
    discount: 0,
    mileage: 15000,
    type: 'auto',
    images: [
      'https://images.unsplash.com/photo-1611245801314-e0e54a01053c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1562141961-b5d1442a7eed?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/9t97XshvF5w',
    specifications: {
      engine: '3.8L Twin-Turbo V6 VR38DETT',
      transmission: 'Doble Embrague de 6 velocidades',
      color: 'Gris Mate Nismo',
      fuel: 'Gasolina',
      doors: 2,
      traction: 'ATTESA E-TS AWD'
    },
    badgeType: 'last_units'
  },
  {
    id: 'jeep-wrangler-2022',
    brand: 'Jeep',
    model: 'Wrangler Rubicon Unlimited',
    year: 2022,
    price: 65900,
    discount: 8,
    mileage: 23000,
    type: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/HqfI1pW_FkQ',
    specifications: {
      engine: '2.0L Turbo 4-Cilindros eTorque',
      transmission: 'Automática de 8 velocidades',
      color: 'Verde Sarge',
      fuel: 'Gasolina',
      doors: 5,
      traction: 'Rock-Trac 4x4 Part-Time'
    },
    badgeType: 'none'
  }
];

const LOCAL_STORAGE_KEY = 'car_catalog_vehicles';

export const loadCars = (): Car[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CARS));
    return INITIAL_CARS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading localStorage data, resetting to defaults.', e);
    return INITIAL_CARS;
  }
};

export const saveCars = (cars: Car[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cars));
};
