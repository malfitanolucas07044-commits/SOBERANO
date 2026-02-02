import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, PerfumeType } from '../types';
import { Search, Plus, Heart } from 'lucide-react';
import ProductModal from './ProductModal';

interface ProductListProps {
  products: Product[];
  category: string;
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
    // 1. Filter by Category AND Visibility (isVisible !== false handles undefined as true for legacy data)
    let filtered = products.filter(p => p.category === category && p.isVisible !== false);
    
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

  // Navigation Logic
  const handleNextProduct = () => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    const nextIndex = (currentIndex + 1) % filteredProducts.length;
    setSelectedProduct(filteredProducts[nextIndex]);
  };

  const handlePrevProduct = () => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    const prevIndex = (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
    setSelectedProduct(filteredProducts[prevIndex]);
  };

  return (
    <div className="w-full animate-fade-in pb-20 bg-slate-50">
      
      {/* Header & Promos */}
      <div className="pt-8 pb-6 md:pt-16 md:pb-12 text-center px-4">
        <h2 className="text-2xl md:text-4xl font-header font-bold text-navy-900 mb-2 md:mb-4 tracking-[0.1em] uppercase">
          {category}
        </h2>
        {category === ProductCategory.PERFUME && (
           <h3 className="text-gold-dim font-serif text-sm md:text-lg italic mb-4 md:mb-6">Fragancias Exclusivas</h3>
        )}
        
        {/* Category Specific Promos */}
        <div className="flex justify-center mb-6 md:mb-8">
           {category === ProductCategory.WATCH ? (
             <div className="text-center">
                <p className="text-navy-900 font-bold text-[10px] md:text-xs uppercase tracking-widest border border-navy-900 px-4 py-1.5 md:px-6 md:py-2 inline-block">Envío gratuito en Asunción</p>
             </div>
           ) : category === ProductCategory.PERFUME ? (
             <p className="text-slate-500 font-sans text-xs md:text-sm tracking-wide">Opciones en Frasco Completo o Decants</p>
           ) : null}
        </div>

        {/* Filters (Perfume only) */}
        {category === ProductCategory.PERFUME && (
           <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 md:mb-8 border-b border-slate-200 pb-4 max-w-3xl mx-auto px-2">
             {['TODOS', ...Object.values(PerfumeType)].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedPerfumeType(type as any)}
                  className={`text-[10px] md:text-xs uppercase tracking-[0.15em] transition-colors pb-1 ${
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
      <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
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

         <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
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
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
            <div key={product.id} className={`group flex flex-col bg-white border border-transparent hover:border-slate-200 transition-all p-3 md:p-4 shadow-sm hover:shadow-md h-full relative ${!product.isStock ? 'opacity-75' : ''}`}>
               
               {/* OUT OF STOCK OVERLAY */}
               {!product.isStock && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-full text-center">
                     <span className="bg-red-600/90 text-white text-[10px] md:text-sm font-bold px-2 py-1 md:px-4 md:py-2 uppercase tracking-widest shadow-lg backdrop-blur-sm">Agotado</span>
                  </div>
               )}

               {/* Image Container - Fixed Ratio */}
               <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100 mb-3 md:mb-4 cursor-pointer shrink-0" onClick={() => handleQuickView(product)}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!product.isStock ? 'grayscale' : ''}`}
                  />
                  
                  {/* BADGES: Priority to 'Más Vendido' then 'Oferta' */}
                  {product.isStock && (
                    <>
                      {product.isBestSeller ? (
                        <div className="absolute top-2 left-2 bg-gold text-white text-[8px] md:text-[10px] px-2 py-1 uppercase tracking-widest font-bold shadow-sm">
                          Top
                        </div>
                      ) : product.offerPrice ? (
                        <div className="absolute top-2 left-2 bg-navy-900 text-white text-[8px] md:text-[10px] px-2 py-1 uppercase tracking-widest font-bold">
                          Oferta
                        </div>
                      ) : null}
                    </>
                  )}

                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
                    className="absolute top-2 right-2 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white text-navy-900 hover:scale-110 transition-all duration-300 z-30 shadow-sm"
                    title={isWishlisted ? "Quitar de lista de deseos" : "Agregar a lista de deseos"}
                  >
                    <Heart size={14} className={`md:w-[18px] md:h-[18px] ${isWishlisted ? "fill-navy-900 text-navy-900" : "text-slate-400"}`} />
                  </button>
               </div>

               {/* Info & Actions - Flex Column for Vertical Alignment */}
               <div className="flex flex-col flex-grow w-full">
                  {/* Info Header (Brand + Name) - Fixed Minimum Heights for alignment */}
                  <div className="text-center mb-2">
                    <p className="text-slate-400 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-medium mb-1 h-3 md:h-4 overflow-hidden">{product.brand}</p>
                    <h3 className="text-navy-900 font-serif text-sm md:text-lg font-bold leading-tight cursor-pointer hover:text-navy-800 h-[2.5rem] md:h-[3.5rem] flex items-center justify-center overflow-hidden line-clamp-2" onClick={() => handleQuickView(product)}>
                        {product.name}
                    </h3>
                  </div>
                  
                  {/* WATCHES LAYOUT */}
                  {category === ProductCategory.WATCH && (
                    <div className="mt-auto w-full">
                        <div className="flex justify-center items-center gap-2 md:gap-3 mb-2 md:mb-4 h-6 md:h-8">
                            {product.offerPrice ? (
                            <>
                                <span className="text-slate-400 line-through text-[10px] md:text-xs">{product.price.toLocaleString('es-PY')}</span>
                                <span className="text-navy-900 font-bold text-sm md:text-lg">{product.offerPrice.toLocaleString('es-PY')} Gs</span>
                            </>
                            ) : (
                            <span className="text-navy-900 font-bold text-sm md:text-lg">{product.price.toLocaleString('es-PY')} Gs</span>
                            )}
                        </div>
                        <button 
                            onClick={() => product.isStock && onAddToCart(product, 'bottle')}
                            disabled={!product.isStock}
                            className={`w-full py-2 md:py-3 text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            {product.isStock ? 'Agregar' : 'Sin Stock'}
                        </button>
                    </div>
                  )}

                  {/* PERFUMES LAYOUT */}
                  {category === ProductCategory.PERFUME && (
                    <div className="mt-auto w-full">
                        {/* Main Bottle Price - Fixed Height */}
                        <div className="text-center mb-2 md:mb-3 h-6 md:h-8 flex items-center justify-center">
                            <span className="text-navy-900 font-bold text-sm md:text-lg block">
                                {product.offerPrice ? product.offerPrice.toLocaleString() : product.price.toLocaleString()} Gs
                            </span>
                        </div>

                        {/* Full Bottle Button */}
                        <button 
                            onClick={() => product.isStock && onAddToCart(product, 'bottle')}
                            disabled={!product.isStock}
                            className={`w-full py-2 md:py-3 text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all mb-2 md:mb-4 ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            {product.isStock ? 'Agregar' : 'Sin Stock'}
                        </button>

                        {/* Decant Split Row - Full Button Areas */}
                        <div className="h-[50px] md:h-[60px] w-full border-t border-slate-100 flex">
                          {product.isDecantAvailable && product.isStock ? (
                              <>
                                  {/* 5ml Button */}
                                  {product.decantPrice5ml ? (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onAddToCart(product, '5ml'); }}
                                      className="w-1/2 flex flex-col items-center justify-center border-r border-slate-100 hover:bg-navy-900 group/decant transition-colors relative"
                                    >
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase group-hover/decant:text-slate-300 transition-colors">5ml</span>
                                        <span className="text-[10px] md:text-xs font-bold text-navy-900 group-hover/decant:text-white transition-colors">{product.decantPrice5ml.toLocaleString()} Gs</span>
                                    </button>
                                  ) : <div className="w-1/2 border-r border-slate-100"></div>}

                                  {/* 10ml Button */}
                                  {product.decantPrice10ml ? (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onAddToCart(product, '10ml'); }}
                                      className="w-1/2 flex flex-col items-center justify-center hover:bg-navy-900 group/decant transition-colors relative"
                                    >
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase group-hover/decant:text-slate-300 transition-colors">10ml</span>
                                        <span className="text-[10px] md:text-xs font-bold text-navy-900 group-hover/decant:text-white transition-colors">{product.decantPrice10ml.toLocaleString()} Gs</span>
                                    </button>
                                  ) : <div className="w-1/2"></div>}
                              </>
                          ) : (
                             <div className="w-full flex items-center justify-center text-[10px] md:text-xs text-slate-300 italic">
                               {!product.isStock ? 'Agotado' : 'Solo Frasco'}
                             </div>
                          )}
                        </div>
                    </div>
                  )}

                  {/* GENERIC/OTHER LAYOUT (For Accesorios, etc) */}
                  {category !== ProductCategory.WATCH && category !== ProductCategory.PERFUME && (
                     <div className="mt-auto w-full">
                        <div className="text-center mb-4 h-8 flex items-center justify-center">
                             {product.offerPrice ? (
                                <div className="flex gap-2 items-center">
                                    <span className="text-slate-400 line-through text-xs">{product.price.toLocaleString('es-PY')}</span>
                                    <span className="text-navy-900 font-bold text-lg">{product.offerPrice.toLocaleString('es-PY')} Gs</span>
                                </div>
                                ) : (
                                <span className="text-navy-900 font-bold text-lg">{product.price.toLocaleString('es-PY')} Gs</span>
                                )}
                        </div>
                        <button 
                            onClick={() => product.isStock && onAddToCart(product, 'bottle')}
                            disabled={!product.isStock}
                            className={`w-full py-3 text-xs uppercase tracking-[0.2em] transition-all ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            {product.isStock ? 'Agregar al Carrito' : 'Sin Stock'}
                        </button>
                     </div>
                  )}
               </div>
            </div>
            );
          })}
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddToCart={onAddToCart}
        onNext={handleNextProduct}
        onPrev={handlePrevProduct}
      />
    </div>
  );
};

export default ProductList;