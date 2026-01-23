import React from 'react';
import { Product } from '../types';
import { Trash2, Heart } from 'lucide-react';

interface WishlistProps {
  items: Product[];
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product, variant: 'bottle' | '3ml' | '5ml' | '10ml') => void;
  onNavigate: (view: any) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onRemove, onAddToCart, onNavigate }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 animate-fade-in pb-24 bg-white min-h-screen">
      <div className="text-center mb-12">
        <Heart className="mx-auto text-navy mb-4" size={32} />
        <h2 className="text-3xl font-serif text-black tracking-widest uppercase">Lista de Deseos</h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded">
          <p className="text-gray-500 mb-6">Tu lista está vacía.</p>
          <button onClick={() => onNavigate('WATCHES')} className="text-navy font-bold border-b border-navy pb-1 uppercase text-xs tracking-widest hover:text-black hover:border-black transition-all">Explorar Tienda</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map(product => (
            <div key={product.id} className="group bg-white border border-gray-100 p-4">
              <div className="relative aspect-square bg-gray-50 overflow-hidden mb-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button onClick={() => onRemove(product)} className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:text-red-500 text-gray-400 transition shadow-sm"><Trash2 size={16} /></button>
              </div>
              <div className="text-center">
                 <h3 className="text-sm font-serif font-bold text-black mb-1">{product.name}</h3>
                 <p className="text-gray-500 text-xs mb-3">{product.brand}</p>
                 <button onClick={() => onAddToCart(product, 'bottle')} className="text-gold text-xs font-bold uppercase tracking-wider hover:text-navy">Agregar al Carrito</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;