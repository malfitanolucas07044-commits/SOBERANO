import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: 'bottle' | '3ml' | '5ml' | '10ml') => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) setActiveImage(product.image);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentPrice = product.offerPrice || product.price;
  const descriptionParts = product.description.split('—');
  const mainDesc = descriptionParts[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in border border-slate-200 max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-slate-400 hover:text-navy-900 transition">
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col relative">
           <div className="flex-1 overflow-hidden relative group">
              <img src={activeImage} alt={product.name} className={`w-full h-full object-cover ${!product.isStock ? 'grayscale' : ''}`} />
              {!product.isStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                     <span className="bg-red-600 text-white text-xl font-bold px-6 py-2 uppercase tracking-widest shadow-lg">Agotado</span>
                  </div>
              )}
              {product.isStock && (
                <>
                    {product.isBestSeller ? (
                        <div className="absolute top-4 left-4 bg-gold text-white text-xs px-3 py-1.5 uppercase tracking-widest font-bold shadow-md z-10">
                          Más Vendido
                        </div>
                    ) : product.offerPrice ? (
                        <div className="absolute top-4 left-4 bg-navy-900 text-white text-xs px-3 py-1.5 uppercase tracking-widest font-bold shadow-md z-10">
                          Oferta
                        </div>
                    ) : null}
                </>
              )}
           </div>
           {product.gallery && product.gallery.length > 0 && (
              <div className="flex p-4 gap-2 overflow-x-auto border-t border-slate-200 bg-white">
                 <img src={product.image} className={`w-16 h-16 object-cover cursor-pointer border border-transparent hover:border-navy-900 ${!product.isStock ? 'grayscale' : ''}`} onClick={() => setActiveImage(product.image)} />
                 {product.gallery.map((img, i) => (
                    <img key={i} src={img} className={`w-16 h-16 object-cover cursor-pointer border border-transparent hover:border-navy-900 ${!product.isStock ? 'grayscale' : ''}`} onClick={() => setActiveImage(img)} />
                 ))}
              </div>
           )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
           <span className="text-gold-dim font-bold text-xs uppercase tracking-[0.2em] block mb-2">{product.brand}</span>
           <h2 className="text-3xl font-serif text-navy-900 mb-4 leading-tight">{product.name}</h2>
           
           <div className="flex items-baseline gap-4 mb-8 border-b border-slate-100 pb-6">
              <span className="text-2xl text-navy-900 font-bold">{currentPrice.toLocaleString('es-PY')} Gs</span>
              {product.offerPrice && <span className="text-slate-400 line-through text-sm">{product.price.toLocaleString('es-PY')}</span>}
           </div>

           <p className="text-slate-600 leading-relaxed mb-8 font-light text-sm">{mainDesc}</p>

           <div className="space-y-4 mb-8">
              <button 
                 onClick={() => { if(product.isStock) { onAddToCart(product, 'bottle'); onClose(); } }}
                 disabled={!product.isStock}
                 className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${product.isStock ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                 {product.isStock 
                    ? (product.category === ProductCategory.PERFUME ? 'Comprar Frasco Completo' : 'Agregar al Carrito')
                    : 'Agotado'}
              </button>

              {product.category === ProductCategory.PERFUME && product.isDecantAvailable && product.isStock && (
                 <div className="space-y-3">
                    <p className="text-xs uppercase font-bold text-navy-900 tracking-widest">Opciones de Decants:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {product.decantPrice3ml && (
                         <button onClick={() => { onAddToCart(product, '3ml'); onClose(); }} className="border border-slate-200 py-3 text-[10px] font-bold uppercase hover:border-navy-900 hover:bg-navy-900 hover:text-white text-slate-600 transition">
                            3ml <br/><span className="text-gold-dim">{product.decantPrice3ml.toLocaleString()} Gs</span>
                         </button>
                      )}
                      {product.decantPrice5ml && (
                         <button onClick={() => { onAddToCart(product, '5ml'); onClose(); }} className="border border-slate-200 py-3 text-[10px] font-bold uppercase hover:border-navy-900 hover:bg-navy-900 hover:text-white text-slate-600 transition">
                            5ml <br/><span className="text-gold-dim">{product.decantPrice5ml.toLocaleString()} Gs</span>
                         </button>
                      )}
                      {product.decantPrice10ml && (
                         <button onClick={() => { onAddToCart(product, '10ml'); onClose(); }} className="border border-slate-200 py-3 text-[10px] font-bold uppercase hover:border-navy-900 hover:bg-navy-900 hover:text-white text-slate-600 transition">
                            10ml <br/><span className="text-gold-dim">{product.decantPrice10ml.toLocaleString()} Gs</span>
                         </button>
                      )}
                    </div>
                 </div>
              )}
           </div>

           <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-navy-900"/> Garantía de autenticidad</div>
              <div className="flex items-center gap-3"><Truck size={16} className="text-navy-900"/> Envío seguro a todo el país</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;