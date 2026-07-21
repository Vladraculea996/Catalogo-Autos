import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, RotateCcw, Image as ImageIcon, Video, FileText, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { Car, VehicleType, VehicleSpecifications } from '../types';
import { INITIAL_CARS } from '../mockData';

interface AdminPanelProps {
  cars: Car[];
  onSaveCars: (cars: Car[]) => void;
  onClose: () => void;
}

const DEFAULT_SPECS: VehicleSpecifications = {
  engine: '2.0L Turbo 4-Cilindros',
  transmission: 'Automática',
  color: 'Blanco',
  fuel: 'Gasolina',
  doors: 4,
  traction: 'FWD',
};

const EMPTY_CAR: Omit<Car, 'id'> = {
  brand: '',
  model: '',
  year: 2024,
  price: 25000,
  discount: 0,
  mileage: 0,
  type: 'auto',
  images: [],
  videoUrl: '',
  specifications: { ...DEFAULT_SPECS },
  badgeType: 'none',
  badgeText: '',
};

export default function AdminPanel({ cars, onSaveCars, onClose }: AdminPanelProps) {
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Omit<Car, 'id'>>({ ...EMPTY_CAR });
  
  // Custom manual URL input field state
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear success messages after a few seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Set form state when switching to EDIT mode
  const handleEditClick = (car: Car) => {
    setEditingCarId(car.id);
    setFormState({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      discount: car.discount,
      mileage: car.mileage,
      type: car.type,
      images: [...car.images],
      videoUrl: car.videoUrl,
      specifications: { ...car.specifications },
      badgeType: car.badgeType || 'none',
      badgeText: car.badgeText || '',
    });
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form to default empty state
  const handleCancelEdit = () => {
    setEditingCarId(null);
    setFormState({ ...EMPTY_CAR, specifications: { ...DEFAULT_SPECS } });
    setImageUrlInput('');
    setErrorMessage(null);
  };

  // Remove car helper
  const handleDeleteClick = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo permanentemente?')) {
      const updated = cars.filter((c) => c.id !== id);
      onSaveCars(updated);
      setSuccessMessage('Vehículo eliminado con éxito.');
      if (editingCarId === id) {
        handleCancelEdit();
      }
    }
  };

  // Specs object handler
  const handleSpecChange = (key: keyof VehicleSpecifications, value: any) => {
    setFormState((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  // Direct base64 file upload helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setErrorMessage(null);
    const fileListArray = Array.from(files) as File[];
    const validFiles = fileListArray.filter((file: File) => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setErrorMessage('Por favor selecciona archivos de imagen válidos (.png, .jpg, .jpeg, .webp).');
      return;
    }

    let loadedCount = 0;
    const newBase64Images: string[] = [];

    validFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          newBase64Images.push(event.target.result);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setFormState((prev) => ({
            ...prev,
            images: [...prev.images, ...newBase64Images],
          }));
          setSuccessMessage(`Se cargaron ${validFiles.length} imágenes locales correctamente.`);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Ocurrió un error leyendo algunos de tus archivos.');
      };
      reader.readAsDataURL(file);
    });
  };

  // Add manually pasted URL helper
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (!imageUrlInput.startsWith('http://') && !imageUrlInput.startsWith('https://')) {
      setErrorMessage('La URL de la imagen debe comenzar con http:// o https://');
      return;
    }

    setFormState((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
    setErrorMessage(null);
    setSuccessMessage('URL de imagen añadida al carrusel.');
  };

  // Remove individual photo from current queue
  const handleRemoveImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Form submit handler (Insert or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!formState.brand.trim()) {
      setErrorMessage('La marca es requerida (ej. Nissan, Toyota).');
      return;
    }
    if (!formState.model.trim()) {
      setErrorMessage('El modelo es requerido (ej. GT-R, Civic).');
      return;
    }
    if (formState.images.length === 0) {
      setErrorMessage('Debes agregar al menos una imagen (subiendo archivo o agregando URL).');
      return;
    }

    if (editingCarId) {
      // Update action
      const updated = cars.map((c) =>
        c.id === editingCarId
          ? { ...formState, id: editingCarId } as Car
          : c
      );
      onSaveCars(updated);
      setSuccessMessage('Vehículo actualizado correctamente.');
      setEditingCarId(null);
    } else {
      // Create action
      const newId = `${formState.brand.toLowerCase().replace(/\s+/g, '-')}-${formState.model.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const newCar: Car = {
        ...formState,
        id: newId,
      } as Car;
      onSaveCars([newCar, ...cars]);
      setSuccessMessage('Nuevo vehículo añadido al catálogo.');
    }

    // Reset form
    setFormState({ ...EMPTY_CAR, specifications: { ...DEFAULT_SPECS } });
    setImageUrlInput('');
  };

  return (
    <div className="w-full">
      {/* Admin Title Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Módulo Administrador (Demostración)
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-1">
            Panel de Inventario
          </h1>
        </div>
        <button
          id="btn-close-admin"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all duration-150 shadow-sm"
        >
          ← Volver al Catálogo
        </button>
      </div>

      {/* Status Alerts */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main vehicle form (7 columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 font-display">
            <Plus className="w-5 h-5 text-orange-500" />
            {editingCarId ? 'Editar Detalles del Vehículo' : 'Añadir Nuevo Vehículo al Catálogo'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Brand */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-brand" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Marca *
              </label>
              <input
                id="form-brand"
                type="text"
                placeholder="Ej. Nissan, Ford, Chevrolet"
                required
                value={formState.brand}
                onChange={(e) => setFormState({ ...formState, brand: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm transition-all duration-150"
              />
            </div>

            {/* Model */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-model" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Modelo *
              </label>
              <input
                id="form-model"
                type="text"
                placeholder="Ej. GT-R, Bronco Sport"
                required
                value={formState.model}
                onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm transition-all duration-150"
              />
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-year" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Año de Fabricación *
              </label>
              <input
                id="form-year"
                type="number"
                min="2000"
                max="2027"
                required
                value={formState.year}
                onChange={(e) => setFormState({ ...formState, year: Number(e.target.value) || 2024 })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm font-mono"
              />
            </div>

            {/* Vehicle Type dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-type" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tipo de Vehículo *
              </label>
              <select
                id="form-type"
                value={formState.type}
                onChange={(e) => setFormState({ ...formState, type: e.target.value as VehicleType })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm transition-all duration-150"
              >
                <option value="auto">Auto</option>
                <option value="camioneta">Camioneta</option>
                <option value="SUV">SUV</option>
                <option value="híbrido">Híbrido</option>
              </select>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-price" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Precio de Lista (USD) *
              </label>
              <input
                id="form-price"
                type="number"
                min="1000"
                required
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) || 0 })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm font-mono"
              />
            </div>

            {/* Discount Percentage */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-discount" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Descuento (%) *
              </label>
              <input
                id="form-discount"
                type="number"
                min="0"
                max="90"
                required
                value={formState.discount}
                onChange={(e) => setFormState({ ...formState, discount: Number(e.target.value) || 0 })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm font-mono"
              />
            </div>

            {/* Mileage */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-mileage" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kilometraje (km) *
              </label>
              <input
                id="form-mileage"
                type="number"
                min="0"
                required
                value={formState.mileage}
                onChange={(e) => setFormState({ ...formState, mileage: Number(e.target.value) || 0 })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm font-mono"
              />
            </div>

            {/* Video Url */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-video" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3 h-3 text-slate-400" /> URL de Video (YouTube)
              </label>
              <input
                id="form-video"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formState.videoUrl}
                onChange={(e) => setFormState({ ...formState, videoUrl: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-none text-slate-800 text-sm"
              />
            </div>
          </div>

          {/* Marketing Badge details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Pegatina de Marketing (Esquina)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="form-badgetype" className="text-[11px] font-semibold text-slate-500">Tipo de Etiqueta</label>
                <select
                  id="form-badgetype"
                  value={formState.badgeType}
                  onChange={(e) => setFormState({ ...formState, badgeType: e.target.value as any })}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                >
                  <option value="none">Sin pegatina especial (automático)</option>
                  <option value="discount">Verde (Porcentaje Descuento)</option>
                  <option value="last_units">Roja (¡Últimas Unidades!)</option>
                  <option value="new">Azul (Recién Llegado)</option>
                  <option value="custom">Dorada (Texto Personalizado)</option>
                </select>
              </div>

              {formState.badgeType === 'custom' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-badgetext" className="text-[11px] font-semibold text-slate-500">Texto de Pegatina</label>
                  <input
                    id="form-badgetext"
                    type="text"
                    maxLength={16}
                    placeholder="Ej. ¡Impecable!, Edición Lux"
                    value={formState.badgeText}
                    onChange={(e) => setFormState({ ...formState, badgeText: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Especificaciones Técnicas Detalladas
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Engine */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form-spec-engine" className="text-[11px] font-semibold text-slate-500">Motor</label>
                <input
                  id="form-spec-engine"
                  type="text"
                  value={formState.specifications.engine}
                  onChange={(e) => handleSpecChange('engine', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Transmission */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form-spec-transmission" className="text-[11px] font-semibold text-slate-500">Transmisión</label>
                <input
                  id="form-spec-transmission"
                  type="text"
                  value={formState.specifications.transmission}
                  onChange={(e) => handleSpecChange('transmission', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Color */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form-spec-color" className="text-[11px] font-semibold text-slate-500">Color Exterior</label>
                <input
                  id="form-spec-color"
                  type="text"
                  value={formState.specifications.color}
                  onChange={(e) => handleSpecChange('color', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Fuel Type */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form-spec-fuel" className="text-[11px] font-semibold text-slate-500">Combustible</label>
                <input
                  id="form-spec-fuel"
                  type="text"
                  value={formState.specifications.fuel}
                  onChange={(e) => handleSpecChange('fuel', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Doors */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form-spec-doors" className="text-[11px] font-semibold text-slate-500">Número de Puertas</label>
                <input
                  id="form-spec-doors"
                  type="number"
                  min="2"
                  max="6"
                  value={formState.specifications.doors}
                  onChange={(e) => handleSpecChange('doors', Number(e.target.value) || 4)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none font-mono"
                />
              </div>

              {/* Traction */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form-spec-traction" className="text-[11px] font-semibold text-slate-500">Tracción</label>
                <input
                  id="form-spec-traction"
                  type="text"
                  placeholder="Ej. AWD, FWD, 4x4"
                  value={formState.specifications.traction || ''}
                  onChange={(e) => handleSpecChange('traction', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              Fotos del Vehículo (Mínimo 1)
            </h3>

            {/* Option A: Paste URL */}
            <div className="flex flex-col gap-1 mb-4">
              <label htmlFor="form-img-url" className="text-[10px] font-bold text-slate-400 uppercase">A. Pegar URL de Imagen</label>
              <div className="flex gap-2">
                <input
                  id="form-img-url"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-grow px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs outline-none"
                />
                <button
                  id="btn-add-img-url"
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Option B: Upload Base64 File */}
            <div className="flex flex-col gap-1.5 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">B. Subir archivo local (Se convertirá a Base64)</span>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-white hover:bg-orange-500/5 p-5 rounded-xl cursor-pointer text-center transition flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-6 h-6 text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">Arrastra tus fotos o haz click para seleccionar</p>
                <p className="text-[10px] text-slate-400">Archivos JPG, PNG, WEBP aceptados</p>
                <input
                  id="form-img-upload"
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Current Images Queue preview list */}
            {formState.images.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Imágenes en Cola ({formState.images.length})</p>
                <div className="flex gap-3 overflow-x-auto py-1.5">
                  {formState.images.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                      <img
                        src={img}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150"
                        title="Quitar imagen"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            {editingCarId && (
              <button
                id="btn-cancel-form"
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all duration-150"
              >
                Cancelar Edición
              </button>
            )}
            <button
              id="btn-submit-form"
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-150"
            >
              {editingCarId ? 'Guardar Cambios' : 'Registrar Auto en Catálogo'}
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: Current inventory table (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 font-display">
              Vehículos en Inventario ({cars.length})
            </h2>
            
            {/* Quick action to restore default mock data */}
            <button
              id="btn-restore-mock-data"
              onClick={() => {
                if (window.confirm('¿Deseas restaurar el catálogo completo a los autos demo por defecto? Se perderán las modificaciones personalizadas.')) {
                  onSaveCars(INITIAL_CARS);
                  setSuccessMessage('Catálogo restaurado a valores por defecto.');
                }
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-orange-500 transition-colors"
              title="Restaurar Autos por Defecto"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3.5 max-h-[600px] overflow-y-auto pr-1">
            {cars.map((car) => (
              <div
                key={car.id}
                id={`admin-item-${car.id}`}
                className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-150 ${
                  editingCarId === car.id 
                    ? 'border-orange-500/50 bg-orange-500/5' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="w-16 aspect-video rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/40">
                  <img
                    src={car.images[0]}
                    alt={car.model}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate font-display">
                    {car.brand} {car.model}
                  </h4>
                  <div className="flex gap-2 items-center text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>{car.year}</span>
                    <span>•</span>
                    <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(car.price)}</span>
                    {car.discount > 0 && <span className="text-emerald-600 font-bold">-{car.discount}%</span>}
                  </div>
                </div>

                {/* Operations buttons */}
                <div className="flex items-center gap-1">
                  <button
                    id={`btn-edit-${car.id}`}
                    onClick={() => handleEditClick(car)}
                    className="p-2 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-150"
                    title="Editar auto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-delete-${car.id}`}
                    onClick={() => handleDeleteClick(car.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-150"
                    title="Eliminar auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
