import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, cartItemCount, onOpenCart, wishlistCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navClass = (view: ViewState) => 
    `cursor-pointer transition-all duration-300 font-sans tracking-[0.15em] text-xs font-bold uppercase ${
      currentView === view ? 'text-navy-900 border-b-2 border-navy-900' : 'text-slate-500 hover:text-navy-900'
    }`;

  const handleLogoClick = () => {
    onNavigate('HOME');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer select-none" onClick={handleLogoClick}>
             <span className="font-header text-2xl md:text-3xl font-bold text-navy-900 tracking-[0.1em]">
              SOBERANO
            </span>
          </div>

          {/* CENTER: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <span onClick={() => onNavigate('HOME')} className={navClass('HOME')}>INICIO</span>
            <span onClick={() => onNavigate('WATCHES')} className={navClass('WATCHES')}>RELOJES</span>
            <span onClick={() => onNavigate('PERFUMES')} className={navClass('PERFUMES')}>PERFUMES</span>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center space-x-6">
            <button 
              className={`transition relative ${currentView === 'WISHLIST' ? 'text-navy-900' : 'text-slate-400 hover:text-navy-900'}`} 
              onClick={() => onNavigate('WISHLIST')}
              title="Lista de Deseos"
            >
              <Heart size={24} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-2.5 h-2.5 bg-navy-900 rounded-full"></span>
              )}
            </button>

            <button className="relative text-navy-900 hover:text-navy-800 transition" onClick={onOpenCart}>
              <ShoppingBag size={24} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-navy-900 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-navy-900 hover:text-navy-800">
                {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-50 border-b border-slate-200 animate-fade-in absolute w-full shadow-xl">
          <div className="px-4 py-6 space-y-4 text-center">
            <button onClick={() => { onNavigate('HOME'); setIsMobileMenuOpen(false); }} className="block w-full text-navy-900 hover:bg-slate-100 font-header tracking-widest text-sm font-bold py-3 border-b border-slate-200">INICIO</button>
            <button onClick={() => { onNavigate('WATCHES'); setIsMobileMenuOpen(false); }} className="block w-full text-navy-900 hover:bg-slate-100 font-header tracking-widest text-sm font-bold py-3 border-b border-slate-200">RELOJES</button>
            <button onClick={() => { onNavigate('PERFUMES'); setIsMobileMenuOpen(false); }} className="block w-full text-navy-900 hover:bg-slate-100 font-header tracking-widest text-sm font-bold py-3 border-b border-slate-200">PERFUMES</button>
            <button onClick={() => { onNavigate('WISHLIST'); setIsMobileMenuOpen(false); }} className="block w-full text-navy-900 hover:bg-slate-100 font-header tracking-widest text-sm font-bold py-3">LISTA DE DESEOS</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;