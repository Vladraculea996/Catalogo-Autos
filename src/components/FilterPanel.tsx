import React, { useMemo } from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Car, FilterState, VehicleType } from '../types';

interface FilterPanelProps {
  cars: Car[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterPanel({ cars, filters, onFilterChange, onReset }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Dynamically obtain available brands in current vehicles
  const availableBrands = useMemo(() => {
    const brands = cars.map((car) => car.brand);
    return Array.from(new Set(brands)).sort();
  }, [cars]);

  // Handle individual filter updates
  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const vehicleTypes: { value: string; label: string }[] = [
    { value: '', label: 'Todos los tipos' },
    { value: 'auto', label: 'Auto' },
    { value: 'camioneta', label: 'Camioneta' },
    { value: 'SUV', label: 'SUV' },
    { value: 'híbrido', label: 'Híbrido' },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 mb-8 w-full">
      {/* Header of the Filters Area */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Buscador y Filtros Avanzados
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            id="btn-reset-filters"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-orange-500 hover:bg-slate-100 transition-all duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar Filtros
          </button>

          <button
            id="btn-toggle-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
            title={isExpanded ? 'Colapsar filtros' : 'Expandir filtros'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Search Bar (Always Visible) */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="search-input"
          type="text"
          placeholder="Buscar por modelo, marca o especificaciones..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-slate-800 text-sm transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Expandable Advanced Filters Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 pt-5 border-t border-slate-100">
          
          {/* Brand Selector */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-brand" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Marca
            </label>
            <select
              id="filter-brand"
              value={filters.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 outline-none text-slate-700 text-sm transition-all duration-200 cursor-pointer"
            >
              <option value="">Todas las marcas</option>
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Selector */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-type" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tipo de Vehículo
            </label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 outline-none text-slate-700 text-sm transition-all duration-200 cursor-pointer"
            >
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Years Range Inputs */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Rango de Año
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="filter-year-from"
                type="number"
                placeholder="Desde"
                min="2000"
                max="2027"
                value={filters.yearFrom || ''}
                onChange={(e) => handleChange('yearFrom', Number(e.target.value) || 0)}
                className="px-3 py-2 rounded-xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 outline-none text-slate-700 text-sm text-center font-mono"
              />
              <input
                id="filter-year-to"
                type="number"
                placeholder="Hasta"
                min="2000"
                max="2027"
                value={filters.yearTo || ''}
                onChange={(e) => handleChange('yearTo', Number(e.target.value) || 0)}
                className="px-3 py-2 rounded-xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 outline-none text-slate-700 text-sm text-center font-mono"
              />
            </div>
          </div>

          {/* Max Mileage Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Kilometraje Máx.</span>
              <span className="text-slate-600 font-mono font-medium">
                {filters.mileageMax === 200000 ? 'Sin límite' : `${new Intl.NumberFormat('es-MX').format(filters.mileageMax)} km`}
              </span>
            </div>
            <div className="pt-2">
              <input
                id="filter-mileage-range"
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={filters.mileageMax}
                onChange={(e) => handleChange('mileageMax', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0 km</span>
                <span>100k km</span>
                <span>200k+ km</span>
              </div>
            </div>
          </div>

          {/* Pricing range inputs */}
          <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Rango de Precio (USD)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                <input
                  id="filter-price-min"
                  type="number"
                  placeholder="Precio Mínimo"
                  value={filters.priceMin || ''}
                  onChange={(e) => handleChange('priceMin', Number(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 outline-none text-slate-700 text-sm font-mono"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                <input
                  id="filter-price-max"
                  type="number"
                  placeholder="Precio Máximo"
                  value={filters.priceMax || ''}
                  onChange={(e) => handleChange('priceMax', Number(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white/50 border border-slate-200/60 focus:bg-white focus:border-orange-500 outline-none text-slate-700 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Info snippet */}
          <div className="md:col-span-2 lg:col-span-2 flex items-end">
            <div className="bg-orange-500/5 rounded-2xl border border-orange-500/10 p-3 w-full flex items-center gap-3">
              <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <p className="text-xs text-slate-600 font-medium">
                Los resultados se filtran y actualizan automáticamente al cambiar cualquier parámetro de arriba.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
