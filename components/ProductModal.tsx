import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: 'bottle' | '3ml' | '5ml' | '10ml') => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, onNext, onPrev }) => {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) setActiveImage(product.image);
  }, [product, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !product) return null;

  const currentPrice = product.offerPrice || product.price;
  const descriptionParts = product.description.split('—');
  const mainDesc = descriptionParts[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Navigation Arrows (Outside the card) */}
      {onPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-1 md:left-8 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-navy-900 hover:scale-110 transition-all cursor-pointer group"
          title="Anterior"
        >
          <ChevronLeft size={24} className="md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {onNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-1 md:right-8 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-navy-900 hover:scale-110 transition-all cursor-pointer group"
          title="Siguiente"
        >
          <ChevronRight size={24} className="md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      <div className="relative bg-white w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in border border-slate-200 max-h-[95vh] md:max-h-[90vh] z-40">
        <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 z-20 text-slate-400 hover:text-navy-900 transition bg-white/50 rounded-full p-1 md:p-0">
          <X size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col relative h-[40vh] md:h-auto">
           <div className="flex-1 overflow-hidden relative group">
              <img src={activeImage} alt={product.name} className={`w-full h-full object-cover ${!product.isStock ? 'grayscale' : ''}`} />
              {!product.isStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                     <span className="bg-red-600 text-white text-lg md:text-xl font-bold px-4 py-1 md:px-6 md:py-2 uppercase tracking-widest shadow-lg">Agotado</span>
                  </div>
              )}
              {product.isStock && (
                <>
                    {product.isBestSeller ? (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-gold text-white text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 uppercase tracking-widest font-bold shadow-md z-10">
                          Más Vendido
                        </div>
                    ) : product.offerPrice ? (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-navy-900 text-white text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 uppercase tracking-widest font-bold shadow-md z-10">
                          Oferta
                        </div>
                    ) : null}
                </>
              )}
           </div>
           {product.gallery && product.gallery.length > 0 && (
              <div className="flex p-2 md:p-4 gap-2 overflow-x-auto border-t border-slate-200 bg-white">
                 <img src={product.image} className={`w-12 h-12 md:w-16 md:h-16 object-cover cursor-pointer border border-transparent hover:border-navy-900 ${!product.isStock ? 'grayscale' : ''}`} onClick={() => setActiveImage(product.image)} />
                 {product.gallery.map((img, i) => (
                    <img key={i} src={img} className={`w-12 h-12 md:w-16 md:h-16 object-cover cursor-pointer border border-transparent hover:border-navy-900 ${!product.isStock ? 'grayscale' : ''}`} onClick={() => setActiveImage(img)} />
                 ))}
              </div>
           )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex-1">
           <span className="text-gold-dim font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] block mb-1 md:mb-2">{product.brand}</span>
           <h2 className="text-xl md:text-3xl font-serif text-navy-900 mb-2 md:mb-4 leading-tight">{product.name}</h2>
           
           <div className="flex items-baseline gap-3 md:gap-4 mb-4 md:mb-8 border-b border-slate-100 pb-4 md:pb-6">
              <span className="text-xl md:text-2xl text-navy-900 font-bold">{currentPrice.toLocaleString('es-PY')} Gs</span>
              {product.offerPrice && <span className="text-slate-400 line-through text-xs md:text-sm">{product.price.toLocaleString('es-PY')}</span>}
           </div>

           <p className="text-slate-600 leading-relaxed mb-6 md:mb-8 font-light text-xs md:text-sm">{mainDesc}</p>

           <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <button 
                 onClick={() => { if(product.isStock) { onAddToCart(product, 'bottle'); onClose(); } }}
                 disabled={!product.isStock}
                 className={`w-full py-3 md:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                 {product.isStock 
                    ? (product.category === ProductCategory.PERFUME ? 'Comprar Frasco Completo' : 'Agregar al Carrito')
                    : 'Agotado'}
              </button>

              {product.category === ProductCategory.PERFUME && product.isDecantAvailable && product.isStock && (
                 <div className="space-y-2 md:space-y-3">
                    <p className="text-[10px] md:text-xs uppercase font-bold text-navy-900 tracking-widest">Opciones de Decants:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {product.decantPrice3ml && (
                         <button onClick={() => { onAddToCart(product, '3ml'); onClose(); }} className="border border-slate-200 py-2 md:py-3 text-[9px] md:text-[10px] font-bold uppercase hover:border-navy-900 hover:bg-navy-900 hover:text-white text-slate-600 transition">
                            3ml <br/><span className="text-gold-dim">{product.decantPrice3ml.toLocaleString()} Gs</span>
                         </button>
                      )}
                      {product.decantPrice5ml && (
                         <button onClick={() => { onAddToCart(product, '5ml'); onClose(); }} className="border border-slate-200 py-2 md:py-3 text-[9px] md:text-[10px] font-bold uppercase hover:border-navy-900 hover:bg-navy-900 hover:text-white text-slate-600 transition">
                            5ml <br/><span className="text-gold-dim">{product.decantPrice5ml.toLocaleString()} Gs</span>
                         </button>
                      )}
                      {product.decantPrice10ml && (
                         <button onClick={() => { onAddToCart(product, '10ml'); onClose(); }} className="border border-slate-200 py-2 md:py-3 text-[9px] md:text-[10px] font-bold uppercase hover:border-navy-900 hover:bg-navy-900 hover:text-white text-slate-600 transition">
                            10ml <br/><span className="text-gold-dim">{product.decantPrice10ml.toLocaleString()} Gs</span>
                         </button>
                      )}
                    </div>
                 </div>
              )}
           </div>

           <div className="space-y-2 md:space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-3"><ShieldCheck size={14} className="md:w-4 md:h-4 text-navy-900"/> Garantía de autenticidad</div>
              <div className="flex items-center gap-3"><Truck size={14} className="md:w-4 md:h-4 text-navy-900"/> Envío seguro a todo el país</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;