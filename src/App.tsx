import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Wrench, Shield, Car as CarIcon, RefreshCw, Layers } from 'lucide-react';
import { Car, FilterState } from './types';
import { loadCars, saveCars } from './mockData';
import CarCard from './components/CarCard';
import FilterPanel from './components/FilterPanel';
import CarModal from './components/CarModal';
import AdminPanel from './components/AdminPanel';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  brand: '',
  type: '',
  yearFrom: 0,
  yearTo: 0,
  mileageMax: 200000, // 200,000 is considered "no limit"
  priceMin: 0,
  priceMax: 0,
};

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Initialize data from localStorage on load
  useEffect(() => {
    const loaded = loadCars();
    setCars(loaded);
  }, []);

  // Sync state modifications back to localStorage
  const handleSaveCars = (updatedCars: Car[]) => {
    setCars(updatedCars);
    saveCars(updatedCars);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filter cars list in real-time based on current filters state
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Calculate active discounted price
      const activePrice = car.discount > 0 
        ? car.price * (1 - car.discount / 100) 
        : car.price;

      // 1. Search text (matches Brand, Model, Engine, or Color)
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesBrand = car.brand.toLowerCase().includes(query);
        const matchesModel = car.model.toLowerCase().includes(query);
        const matchesEngine = car.specifications.engine.toLowerCase().includes(query);
        const matchesColor = car.specifications.color.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel && !matchesEngine && !matchesColor) {
          return false;
        }
      }

      // 2. Brand dropdown
      if (filters.brand && car.brand !== filters.brand) {
        return false;
      }

      // 3. Vehicle Type dropdown
      if (filters.type && car.type !== filters.type) {
        return false;
      }

      // 4. Years Range (From)
      if (filters.yearFrom && car.year < filters.yearFrom) {
        return false;
      }

      // 5. Years Range (To)
      if (filters.yearTo && car.year > filters.yearTo) {
        return false;
      }

      // 6. Max Mileage Range
      if (filters.mileageMax < 200000 && car.mileage > filters.mileageMax) {
        return false;
      }

      // 7. Price Range (Min)
      if (filters.priceMin && activePrice < filters.priceMin) {
        return false;
      }

      // 8. Price Range (Max)
      if (filters.priceMax && activePrice > filters.priceMax) {
        return false;
      }

      return true;
    });
  }, [cars, filters]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Dynamic Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title (Left) */}
          <div 
            onClick={() => setIsAdminMode(false)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-all duration-300 shadow-md group-hover:scale-105 shadow-orange-500/25">
              <CarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight font-display group-hover:text-orange-500 transition-colors duration-200">
                Catálogo de Autos
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">
                Demo Showroom Estático
              </p>
            </div>
          </div>

          {/* Quick Stats or Navigation Actions (Right) */}
          <div className="flex items-center gap-4">
            
            {/* View Mode Swapper */}
            <button
              id="btn-toggle-view"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border ${
                isAdminMode
                  ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {isAdminMode ? (
                <>
                  <LayoutGrid className="w-4 h-4" />
                  Ir al Catálogo
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-orange-500" />
                  Panel Administrador
                </>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Main View Area Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* A. ADMIN / MANAGER VIEW */}
          {isAdminMode ? (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPanel
                cars={cars}
                onSaveCars={handleSaveCars}
                onClose={() => setIsAdminMode(false)}
              />
            </motion.div>
          ) : (
            
            // B. PUBLIC VEHICLE CATALOG VIEW
            <motion.div
              key="catalog-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col"
            >
              {/* Introduction Banner */}
              <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                {/* Background graphic elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                  <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Showroom Premium 2026
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display mt-4 mb-3">
                    Encuentra tu próximo auto de ensueño
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    Navega a través de nuestro selecto inventario de vehículos deportivos, camionetas de alta gama y SUVs híbridos. Todo se gestiona localmente en tu navegador.
                  </p>
                </div>
              </div>

              {/* Advanced Real-time Filter component */}
              <FilterPanel
                cars={cars}
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />

              {/* Dynamic Grid Results */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-slate-500">
                  Mostrando <span className="text-slate-900 font-bold">{filteredCars.length}</span> de <span className="text-slate-900 font-bold">{cars.length}</span> vehículos disponibles
                </p>
                {filteredCars.length < cars.length && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>

              {filteredCars.length === 0 ? (
                /* Empty Results State */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-slate-200/50 text-center shadow-xs"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <CarIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-display">
                    No se encontraron autos coincidentes
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 max-w-md">
                    Prueba ajustando los rangos de precio, kilometraje o buscando otra marca para encontrar lo que necesitas.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-150"
                  >
                    Restablecer todos los filtros
                  </button>
                </motion.div>
              ) : (
                /* Grid list layout */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onSelect={setSelectedCar}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detailed Sheet Modal */}
      <CarModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
      />

      {/* Simple, Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/25 flex items-center justify-center text-orange-500">
                <CarIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight font-display">
                Catálogo de Autos (Demo)
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
              <span>Tecnología: React + Tailwind CSS v4</span>
              <span>•</span>
              <span>100% Estático (Listo para GitHub Pages)</span>
              <span>•</span>
              <span>Persistencia local en el Navegador</span>
            </div>

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Exhibición Central. Diseñado con precisión.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
