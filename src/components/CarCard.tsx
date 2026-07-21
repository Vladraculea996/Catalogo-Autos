import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Gauge, Tag } from 'lucide-react';
import { Car } from '../types';

interface CarCardProps {
  key?: React.Key;
  car: Car;
  onSelect: (car: Car) => void;
}

export default function CarCard({ car, onSelect }: CarCardProps) {
  const hasDiscount = car.discount > 0;
  const discountedPrice = hasDiscount
    ? car.price * (1 - car.discount / 100)
    : car.price;

  // Format price helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format mileage helper
  const formatMileage = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value) + ' km';
  };

  // Badge configuration based on type or automatic discount
  let badgeText = '';
  let badgeColorClass = '';

  if (car.badgeType === 'discount' || (car.badgeType === 'none' && hasDiscount)) {
    badgeText = `-${car.discount}% DESCUENTO`;
    badgeColorClass = 'bg-emerald-600 text-white';
  } else if (car.badgeType === 'last_units') {
    badgeText = '¡ÚLTIMAS UNIDADES!';
    badgeColorClass = 'bg-rose-600 text-white animate-pulse';
  } else if (car.badgeType === 'new') {
    badgeText = 'RECIÉN LLEGADO';
    badgeColorClass = 'bg-blue-600 text-white';
  } else if (car.badgeType === 'custom' && car.badgeText) {
    badgeText = car.badgeText.toUpperCase();
    badgeColorClass = 'bg-amber-500 text-slate-900 font-bold';
  }

  // Cover image: first image or a beautiful placeholder
  const coverImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div
      id={`car-card-${car.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden rounded-3xl cursor-pointer group flex flex-col h-full relative"
      onClick={() => onSelect(car)}
    >
      {/* Marketing Badges */}
      {badgeText && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg ${badgeColorClass}`}>
            {badgeText}
          </span>
        </div>
      )}

      {/* Vehicle Type Badge (right corner) */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900/85 backdrop-blur-md text-white border border-white/10 shadow-lg capitalize">
          {car.type}
        </span>
      </div>

      {/* Car Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={`${car.brand} ${car.model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Subtle Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Car Info Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Brand, Model and Year */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase font-display">
              {car.brand}
            </p>
            <span className="flex items-center text-xs font-medium text-slate-400">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {car.year}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-200 mt-1 line-clamp-1 font-display">
            {car.model}
          </h3>
        </div>

        {/* Technical features (Year, Mileage) */}
        <div className="flex items-center gap-4 py-3 border-y border-slate-100 my-3 text-slate-600 text-sm">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-orange-500" />
            <span className="font-mono text-xs">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium capitalize">{car.specifications.transmission}</span>
          </div>
        </div>

        {/* Pricing Zone */}
        <div className="mt-auto pt-2 flex items-baseline justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through font-mono">
                {formatPrice(car.price)}
              </span>
            )}
            <span className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-1.5">
              {formatPrice(discountedPrice)}
              <span className="text-xs text-slate-500 font-normal">USD</span>
            </span>
          </div>
          
          <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-1">
            Ver Ficha →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
