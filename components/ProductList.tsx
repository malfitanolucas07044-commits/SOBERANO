import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, PerfumeType } from '../types';
import { Search, Plus } from 'lucide-react';
import ProductModal from './ProductModal';

interface ProductListProps {
  products: Product[];
  category: ProductCategory;
  onAddToCart: (product: Product, variant: 'bottle' | '3ml' | '5ml' | '10ml') => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

type SortOption = 'default' | 'price-asc' | 'price-desc';

const ProductList: React.FC<ProductListProps> = ({ products, category, onAddToCart, onToggleWishlist, wishlistIds }) => {
  const [selectedPerfumeType, setSelectedPerfumeType] = useState<PerfumeType | 'TODOS'>('TODOS');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.category === category);
    
    if (category === ProductCategory.PERFUME && selectedPerfumeType !== 'TODOS') {
      filtered = filtered.filter(p => p.subCategory === selectedPerfumeType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    }

    if (sortOption !== 'default') {
      filtered.sort((a, b) => {
        const priceA = a.offerPrice || a.price;
        const priceB = b.offerPrice || b.price;
        return sortOption === 'price-asc' ? priceA - priceB : priceB - priceA;
      });
    }
    
    return filtered;
  }, [products, category, selectedPerfumeType, sortOption, searchQuery]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full animate-fade-in pb-20 bg-slate-50">
      
      {/* Header & Promos */}
      <div className="pt-16 pb-12 text-center px-4">
        <h2 className="text-4xl font-header font-bold text-navy-900 mb-4 tracking-[0.1em] uppercase">
          {category === ProductCategory.WATCH ? 'Relojes' : 'Perfumes'}
        </h2>
        {category === ProductCategory.PERFUME && (
           <h3 className="text-gold-dim font-serif text-lg italic mb-6">Fragancias Exclusivas</h3>
        )}
        
        {/* Category Specific Promos */}
        <div className="flex justify-center mb-8">
           {category === ProductCategory.WATCH ? (
             <div className="text-center">
                <p className="text-navy-900 font-bold text-xs uppercase tracking-widest border border-navy-900 px-6 py-2 inline-block">Envío gratuito en Asunción</p>
             </div>
           ) : (
             <p className="text-slate-500 font-sans text-sm tracking-wide">Opciones en Frasco Completo o Decants</p>
           )}
        </div>

        {/* Filters (Perfume only) */}
        {category === ProductCategory.PERFUME && (
           <div className="flex flex-wrap justify-center gap-8 mb-8 border-b border-slate-200 pb-4 max-w-3xl mx-auto">
             {['TODOS', ...Object.values(PerfumeType)].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedPerfumeType(type as any)}
                  className={`text-xs uppercase tracking-[0.15em] transition-colors pb-1 ${
                    selectedPerfumeType === type 
                      ? 'text-navy-900 border-b-2 border-navy-900 font-bold' 
                      : 'text-slate-400 hover:text-navy-900'
                  }`}
                >
                  {type}
                </button>
             ))}
           </div>
        )}
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="relative w-full md:w-64">
             <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Buscar..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full pl-8 pr-2 py-2 border-b border-slate-200 focus:border-navy-900 outline-none bg-transparent text-sm placeholder-slate-400 text-slate-800 transition-colors"
             />
         </div>

         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500">
               <span>Ordenar por:</span>
               <select 
                 value={sortOption}
                 onChange={e => setSortOption(e.target.value as SortOption)}
                 className="bg-transparent border-none outline-none text-navy-900 font-bold cursor-pointer hover:text-navy-800"
               >
                 <option value="default">Relevancia</option>
                 <option value="price-asc">Precio: Bajo a Alto</option>
                 <option value="price-desc">Precio: Alto a Bajo</option>
               </select>
             </div>
         </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className={`group flex flex-col bg-white border border-transparent hover:border-slate-200 transition-all p-4 shadow-sm hover:shadow-md h-full relative ${!product.isStock ? 'opacity-75' : ''}`}>
               
               {/* OUT OF STOCK OVERLAY */}
               {!product.isStock && (
                  <div className="absolute top-4 right-4 z-10 pointer-events-none">
                     <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-sm">Agotado</span>
                  </div>
               )}

               {/* Image Container - Fixed Ratio */}
               <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100 mb-4 cursor-pointer shrink-0" onClick={() => handleQuickView(product)}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!product.isStock ? 'grayscale' : ''}`}
                  />
                  
                  {/* BADGES: Priority to 'Más Vendido' then 'Oferta' */}
                  {product.isStock && (
                    <>
                      {product.isBestSeller ? (
                        <div className="absolute top-2 left-2 bg-gold text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold shadow-sm">
                          Más Vendido
                        </div>
                      ) : product.offerPrice ? (
                        <div className="absolute top-2 left-2 bg-navy-900 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">
                          Oferta
                        </div>
                      ) : null}
                    </>
                  )}
               </div>

               {/* Info & Actions - Flex Column for Vertical Alignment */}
               <div className="flex flex-col flex-grow w-full">
                  {/* Info Header (Brand + Name) - Fixed Minimum Heights for alignment */}
                  <div className="text-center mb-2">
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-medium mb-1 h-4 overflow-hidden">{product.brand}</p>
                    <h3 className="text-navy-900 font-serif text-lg font-bold leading-tight cursor-pointer hover:text-navy-800 h-[3.5rem] flex items-center justify-center overflow-hidden line-clamp-2" onClick={() => handleQuickView(product)}>
                        {product.name}
                    </h3>
                  </div>
                  
                  {/* WATCHES LAYOUT */}
                  {category === ProductCategory.WATCH && (
                    <div className="mt-auto w-full">
                        <div className="flex justify-center items-center gap-3 mb-4 h-8">
                            {product.offerPrice ? (
                            <>
                                <span className="text-slate-400 line-through text-xs">{product.price.toLocaleString('es-PY')}</span>
                                <span className="text-navy-900 font-bold text-lg">{product.offerPrice.toLocaleString('es-PY')} Gs</span>
                            </>
                            ) : (
                            <span className="text-navy-900 font-bold text-lg">{product.price.toLocaleString('es-PY')} Gs</span>
                            )}
                        </div>
                        <button 
                            onClick={() => product.isStock && onAddToCart(product, 'bottle')}
                            disabled={!product.isStock}
                            className={`w-full py-3 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            {product.isStock ? 'Agregar al Carrito' : 'Agotado'}
                        </button>
                    </div>
                  )}

                  {/* PERFUMES LAYOUT */}
                  {category === ProductCategory.PERFUME && (
                    <div className="mt-auto w-full">
                        {/* Main Bottle Price - Fixed Height */}
                        <div className="text-center mb-3 h-8 flex items-center justify-center">
                            <span className="text-navy-900 font-bold text-lg block">
                                {product.offerPrice ? product.offerPrice.toLocaleString() : product.price.toLocaleString()} Gs
                            </span>
                        </div>

                        {/* Full Bottle Button */}
                        <button 
                            onClick={() => product.isStock && onAddToCart(product, 'bottle')}
                            disabled={!product.isStock}
                            className={`w-full py-3 text-xs uppercase tracking-[0.2em] transition-all mb-4 ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            {product.isStock ? 'Agregar al Carrito' : 'Agotado'}
                        </button>

                        {/* Decant Split Row - Fixed Height Container */}
                        <div className="h-[70px] w-full">
                          {product.isDecantAvailable && product.isStock ? (
                              <div className="flex justify-between items-start pt-3 border-t border-slate-100 h-full">
                                  {/* Left: 5ml */}
                                  <div className="w-1/2 pr-2 border-r border-slate-100 flex flex-col items-center justify-between h-full pb-1">
                                      <div className="text-center">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">5ml</span>
                                          {product.decantPrice5ml && <span className="text-xs font-bold text-navy-900">{product.decantPrice5ml.toLocaleString()} Gs</span>}
                                      </div>
                                      {product.decantPrice5ml && (
                                          <button 
                                              onClick={() => onAddToCart(product, '5ml')}
                                              className="w-full bg-slate-100 text-navy-900 text-[9px] py-1.5 uppercase font-bold hover:bg-navy-900 hover:text-white transition-colors flex items-center justify-center gap-1 rounded-sm"
                                          >
                                              <Plus size={10} /> Agregar
                                          </button>
                                      )}
                                  </div>

                                  {/* Right: 10ml */}
                                  <div className="w-1/2 pl-2 flex flex-col items-center justify-between h-full pb-1">
                                      <div className="text-center">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">10ml</span>
                                          {product.decantPrice10ml && <span className="text-xs font-bold text-navy-900">{product.decantPrice10ml.toLocaleString()} Gs</span>}
                                      </div>
                                      {product.decantPrice10ml && (
                                          <button 
                                              onClick={() => onAddToCart(product, '10ml')}
                                              className="w-full bg-slate-100 text-navy-900 text-[9px] py-1.5 uppercase font-bold hover:bg-navy-900 hover:text-white transition-colors flex items-center justify-center gap-1 rounded-sm"
                                          >
                                              <Plus size={10} /> Agregar
                                          </button>
                                      )}
                                  </div>
                              </div>
                          ) : (
                             <div className="flex items-center justify-center h-full border-t border-transparent text-xs text-slate-300 italic pt-3">
                               {!product.isStock ? 'Sin Stock' : 'Solo Frasco Completo'}
                             </div>
                          )}
                        </div>
                    </div>
                  )}
               </div>
            </div>
          ))}
        </div>
      </div>

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToCart={onAddToCart} />
    </div>
  );
};

export default ProductList;