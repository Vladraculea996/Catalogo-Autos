import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Gauge, Fuel, Disc, Settings, Paintbrush, ArrowRight, Eye, Video } from 'lucide-react';
import { Car } from '../types';

interface CarModalProps {
  car: Car | null;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  if (!car) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  // Convert regular YouTube link to embed url if needed
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    
    try {
      // Handle watch?v= format
      if (url.includes('watch?v=')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      
      // Handle share link format: youtu.be/videoId
      if (url.includes('youtu.be/')) {
        const parts = url.split('/');
        const videoId = parts[parts.length - 1].split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
    } catch (e) {
      console.warn('Could not parse YouTube URL, using original:', e);
    }
    
    return url;
  };

  const videoEmbedUrl = useMemo(() => getEmbedVideoUrl(car.videoUrl), [car.videoUrl]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 cursor-default"
          onClick={onClose}
        />

        {/* Modal content container */}
        <motion.div
          id={`car-detail-modal-${car.id}`}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="glass-modal relative w-full max-w-5xl rounded-3xl overflow-hidden z-10 flex flex-col max-h-[90vh] shadow-2xl"
        >
          {/* Header Close button */}
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white transition-all duration-200 backdrop-blur-md shadow-lg"
            title="Cerrar Ficha"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-grow p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT SIDE: Image Gallery & Video (7 columns on large screens) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                
                {/* Main Large Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-100/10 group shadow-md">
                  <img
                    src={car.images[activeImageIndex] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'}
                    alt={`${car.brand} ${car.model}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Floating index */}
                  <div className="absolute bottom-4 right-4 px-3.5 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-sm text-white">
                    {activeImageIndex + 1} / {car.images.length}
                  </div>
                </div>

                {/* Thumbnails list */}
                {car.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto py-1 scrollbar-thin">
                    {car.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          activeImageIndex === index 
                            ? 'border-orange-500 scale-95 shadow' 
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${car.brand} ${car.model} thumbnail ${index}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Embedded Video (only if exists) */}
                {videoEmbedUrl && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="w-5 h-5 text-orange-500" />
                      <h4 className="text-sm font-bold text-slate-800 font-display">
                        Video del Vehículo
                      </h4>
                    </div>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow border border-slate-200/50">
                      <iframe
                        src={videoEmbedUrl}
                        title={`Video de presentación ${car.brand} ${car.model}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Specifications & Key Data (5 columns on large screens) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  {/* Category Type */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-widest text-orange-500 uppercase font-display">
                      {car.brand}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                      {car.type}
                    </span>
                  </div>

                  {/* Brand and Model */}
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-1">
                    {car.model}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mb-5">
                    Año de fabricación: {car.year}
                  </p>

                  {/* Pricing zone */}
                  <div className="bg-slate-100/50 rounded-2xl p-5 mb-6 border border-slate-200/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Precio de Lista
                      </span>
                      {hasDiscount && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {car.discount}% AHORRO
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-display">
                        {formatPrice(discountedPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-base text-slate-400 line-through font-mono">
                          {formatPrice(car.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* High level quick details badges */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-slate-100">
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                        <Gauge className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Recorrido</p>
                        <p className="text-sm font-bold text-slate-800 font-mono">{formatMileage(car.mileage)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-slate-100">
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Modelo</p>
                        <p className="text-sm font-bold text-slate-800 font-mono">{car.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Specifications Table */}
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display">
                    Especificaciones Técnicas
                  </h3>
                  
                  <div className="flex flex-col gap-2 bg-white/55 rounded-2xl p-4 border border-slate-150">
                    {/* Engine */}
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                        <Disc className="w-3.5 h-3.5 text-slate-400" /> Motor
                      </span>
                      <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{car.specifications.engine}</span>
                    </div>

                    {/* Transmission */}
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                        <Settings className="w-3.5 h-3.5 text-slate-400" /> Transmisión
                      </span>
                      <span className="font-medium text-slate-800 text-right">{car.specifications.transmission}</span>
                    </div>

                    {/* Fuel type */}
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                        <Fuel className="w-3.5 h-3.5 text-slate-400" /> Combustible
                      </span>
                      <span className="font-medium text-slate-800">{car.specifications.fuel}</span>
                    </div>

                    {/* Traction */}
                    {car.specifications.traction && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                          <Settings className="w-3.5 h-3.5 text-slate-400 rotate-45" /> Tracción
                        </span>
                        <span className="font-medium text-slate-800">{car.specifications.traction}</span>
                      </div>
                    )}

                    {/* Exterior Color */}
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                        <Paintbrush className="w-3.5 h-3.5 text-slate-400" /> Color Exterior
                      </span>
                      <span className="font-medium text-slate-800">{car.specifications.color}</span>
                    </div>

                    {/* Doors count */}
                    <div className="flex justify-between items-center py-1 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> Puertas
                      </span>
                      <span className="font-medium text-slate-800">{car.specifications.doors} puertas</span>
                    </div>
                  </div>
                </div>

                {/* Footer action buttons inside modal */}
                <div className="mt-8 pt-4 border-t border-slate-200/50 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ubicación del Auto</span>
                    <span className="text-xs text-slate-700 font-semibold">Exhibición Central (Showroom)</span>
                  </div>
                  
                  <button
                    id="btn-close-modal-bottom"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-150"
                  >
                    Volver al Catálogo
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
