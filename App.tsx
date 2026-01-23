import React, { useState, useEffect } from 'react';
import { PRODUCTS, WATCH_HERO_IMAGES, PERFUME_HERO_IMAGES, WHATSAPP_NUMBER } from './constants';
import { Product, CartItem, ViewState, ProductCategory, Order } from './types';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Wishlist from './components/Wishlist';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Toast from './components/Toast';
import Preloader from './components/Preloader';
import PoliciesModal from './components/PoliciesModal';
import { Instagram, Mail, Phone, Truck, Award, CreditCard, Lock, Loader2 } from 'lucide-react';
import { getProductsFromFirebase, saveProductToFirebase, deleteProductFromFirebase } from './services/firebaseService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  
  // Hero Images State (Keep simpler for now or move to DB later)
  const [watchHeroImages, setWatchHeroImages] = useState<string[]>(WATCH_HERO_IMAGES);
  const [perfumeHeroImages, setPerfumeHeroImages] = useState<string[]>(PERFUME_HERO_IMAGES);

  // Toast State
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'wishlist' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });
  
  // Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Initialize Data - LOAD FROM FIREBASE
  useEffect(() => {
    const initData = async () => {
      // 1. Load Products from Firestore
      try {
        const dbProducts = await getProductsFromFirebase();
        if (dbProducts.length > 0) {
          setProducts(dbProducts);
        } else {
          // Fallback to constants if DB is empty
          setProducts(PRODUCTS);
        }
      } catch (e) {
        console.log("Using local constants due to connection error");
        setProducts(PRODUCTS);
      }

      // 2. Load LocalStorage items (Cart, Wishlist, Orders can remain local for now)
      const savedWishlist = localStorage.getItem('soberano_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('soberano_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const auth = sessionStorage.getItem('soberano_admin_auth');
      if (auth === 'true') setIsAdminAuthenticated(true);
    };

    initData();
  }, []);

  // Persistence (Only for user-local data like Wishlist/Orders)
  // Note: We removed products from localStorage because we want them from Firebase
  useEffect(() => { localStorage.setItem('soberano_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('soberano_orders', JSON.stringify(orders)); }, [orders]);

  const showToast = (message: string, type: 'success' | 'wishlist' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Auth Handlers
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('soberano_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('soberano_admin_auth');
    setView('HOME');
  };

  // --- CRUD HANDLERS (Connected to Firebase) ---

  const handleAddProduct = async (newProduct: Product) => {
    try {
      showToast('Guardando en la nube...', 'info');
      const savedProduct = await saveProductToFirebase(newProduct);
      setProducts(prev => [...prev, savedProduct]);
      showToast('Producto guardado correctamente', 'success');
    } catch (error) {
      showToast('Error al guardar. Verifica tu conexión.', 'info');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      showToast('Actualizando...', 'info');
      await saveProductToFirebase(updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      showToast('Producto actualizado', 'success');
    } catch (error) {
      showToast('Error al actualizar.', 'info');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Confirmar eliminación definitiva?')) {
      try {
        await deleteProductFromFirebase(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Producto eliminado', 'info');
      } catch (error) {
        showToast('Error al eliminar.', 'info');
      }
    }
  };

  const handleUpdateHeroImages = (type: 'WATCH' | 'PERFUME', images: string[]) => {
    type === 'WATCH' ? setWatchHeroImages(images) : setPerfumeHeroImages(images);
    showToast('Galería actualizada (Localmente)', 'info');
  };

  // Cart Handlers
  const addToCart = (product: Product, variant: 'bottle' | '3ml' | '5ml' | '10ml') => {
    const newItem: CartItem = { ...product, cartId: Math.random().toString(36).substr(2, 9), variant };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
    showToast(`Añadido al carrito`, 'success');
  };

  const removeFromCart = (cartId: string) => setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  
  const recordOrder = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
    setCartItems([]);
    setIsCartOpen(false);
    showToast('Procesando pedido en WhatsApp...', 'success');
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast('Eliminado de lista de deseos', 'info');
        return prev.filter(p => p.id !== product.id);
      }
      showToast('Guardado en lista de deseos', 'wishlist');
      return [...prev, product];
    });
  };

  const openWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  const openInstagram = () => window.open('https://www.instagram.com/soberano.py/', '_blank');

  const renderContent = () => {
    if (view === 'HOME') {
      return (
        <div className="flex flex-col animate-fade-in bg-slate-50">
          <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-96px)]">
            
            {/* Watches Section */}
            <div 
              className="relative flex-1 group cursor-pointer overflow-hidden border-b border-slate-200 md:border-b-0 md:border-r"
              onClick={() => setView('WATCHES')}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${watchHeroImages[0]}')` }}
              />
              <div className="absolute inset-0 bg-navy-900/30 group-hover:bg-navy-900/10 transition-all duration-700" />
              
              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/20 group-hover:bg-black/30 transition-colors">
                <h2 className="text-3xl md:text-6xl font-header text-white mb-6 md:mb-8 tracking-[0.1em] font-bold drop-shadow-xl">RELOJES</h2>
                <button className="text-white text-xs md:text-base tracking-[0.2em] font-bold border border-white/60 px-6 py-3 md:px-10 md:py-4 hover:bg-navy-900 hover:border-navy-900 hover:text-white transition-all duration-500 uppercase">
                  Ver Colección
                </button>
              </div>
            </div>

            {/* Perfumes Section */}
            <div 
              className="relative flex-1 group cursor-pointer overflow-hidden"
              onClick={() => setView('PERFUMES')}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${perfumeHeroImages[0]}')` }}
              />
              <div className="absolute inset-0 bg-navy-900/30 group-hover:bg-navy-900/10 transition-all duration-700" />

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/20 group-hover:bg-black/30 transition-colors">
                <h2 className="text-3xl md:text-6xl font-header text-white mb-6 md:mb-8 tracking-[0.1em] font-bold drop-shadow-xl">PERFUMES</h2>
                <button className="text-white text-xs md:text-base tracking-[0.2em] font-bold border border-white/60 px-6 py-3 md:px-10 md:py-4 hover:bg-navy-900 hover:border-navy-900 hover:text-white transition-all duration-500 uppercase">
                  Descubrir Aromas
                </button>
              </div>
            </div>
          </div>
          
          <Testimonials />
        </div>
      );
    }

    if (view === 'WATCHES' || view === 'PERFUMES') {
      return (
        <ProductList 
          products={products} 
          category={view === 'WATCHES' ? ProductCategory.WATCH : ProductCategory.PERFUME} 
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlistIds={wishlist.map(p => p.id)}
        />
      );
    }

    if (view === 'WISHLIST') {
      return (
        <Wishlist 
          items={wishlist}
          onRemove={toggleWishlist}
          onAddToCart={addToCart}
          onNavigate={setView}
        />
      );
    }

    if (view === 'ADMIN') {
      if (!isAdminAuthenticated) return <Login onLoginSuccess={handleLoginSuccess} />;
      return (
        <AdminPanel 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onLogout={handleLogout}
          heroWatchImages={watchHeroImages}
          heroPerfumeImages={perfumeHeroImages}
          onUpdateHeroImages={handleUpdateHeroImages}
        />
      );
    }
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoading(false)} />
      <PoliciesModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
      
      {!isLoading && (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-navy-900 selection:text-white animate-fade-in flex flex-col">
          <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />

          <Navbar 
            currentView={view} 
            onNavigate={setView} 
            cartItemCount={cartItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            wishlistCount={wishlist.length}
          />

          <Cart 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            items={cartItems} 
            onRemove={removeFromCart}
            onRecordOrder={recordOrder} 
          />

          <main className="pt-16 md:pt-24 flex-grow">
            {renderContent()}
          </main>

          {/* Detailed Footer */}
          {view !== 'ADMIN' && (
            <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
              {/* Footer content unchanged */}
              <div className="max-w-7xl mx-auto py-10 md:py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-b border-slate-200">
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-navy-900 mb-4 shadow-sm group-hover:bg-navy-900 group-hover:text-white transition-colors duration-500">
                    <Truck size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-header font-bold text-navy-900 uppercase tracking-widest mb-2 text-sm md:text-base">ENVÍOS RÁPIDOS</h4>
                  <p className="text-slate-500 text-xs md:text-sm font-light">¡Comprás hoy, lo disfrutás hoy!</p>
                </div>
                
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-navy-900 mb-4 shadow-sm group-hover:bg-navy-900 group-hover:text-white transition-colors duration-500">
                    <Award size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-header font-bold text-navy-900 uppercase tracking-widest mb-2 text-sm md:text-base">PRODUCTOS ORIGINALES</h4>
                  <p className="text-slate-500 text-xs md:text-sm font-light">Perfumes originales, de distribuidores legales y certificados.</p>
                </div>

                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-navy-900 mb-4 shadow-sm group-hover:bg-navy-900 group-hover:text-white transition-colors duration-500">
                    <CreditCard size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-header font-bold text-navy-900 uppercase tracking-widest mb-2 text-sm md:text-base">FACILIDADES DE PAGO</h4>
                  <p className="text-slate-500 text-xs md:text-sm font-light">En efectivo, transferencia bancaria, tarjeta de crédito o débito.</p>
                </div>
              </div>

              <div className="max-w-7xl mx-auto py-8 md:py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-slate-600">
                <div className="text-center md:text-left">
                   <h5 className="text-navy-900 font-bold text-xs tracking-[0.2em] uppercase mb-4 md:mb-6">Contacto</h5>
                   <div className="space-y-3 text-sm">
                     <p className="flex items-center justify-center md:justify-start gap-3"><Mail size={16} className="text-navy-900"/> contacto@soberano.com.py</p>
                     <p className="flex items-center justify-center md:justify-start gap-3"><Phone size={16} className="text-navy-900"/> +595 984 508 348</p>
                     <p className="flex items-center justify-center md:justify-start gap-3 cursor-pointer hover:text-navy-900 transition" onClick={openInstagram}>
                       <Instagram size={16} className="text-navy-900"/> @soberano.py
                     </p>
                   </div>
                </div>

                <div className="text-center">
                   <h5 className="text-navy-900 font-bold text-xs tracking-[0.2em] uppercase mb-4 md:mb-6">Filosofía</h5>
                   <div className="space-y-4 text-sm font-serif italic text-slate-500">
                      <p>"El tiempo es el único lujo verdadero que poseemos."</p>
                      <p>"Una fragancia es una firma invisible, un rastro de elegancia eterna."</p>
                      <button onClick={() => setIsPolicyOpen(true)} className="text-navy-900 font-bold uppercase text-[10px] tracking-widest border-b border-navy-900 pb-1 mt-4 hover:text-black">
                        Garantías y Devoluciones
                      </button>
                   </div>
                </div>

                <div className="text-center md:text-right flex flex-col justify-between">
                   <div>
                     <h3 className="font-header text-xl md:text-2xl font-bold text-navy-900 tracking-widest mb-2">SOBERANO</h3>
                     <p className="text-xs text-slate-400">Paraguay</p>
                   </div>
                   <p className="text-slate-400 text-xs tracking-wider mt-6">&copy; 2026 SOBERANO PARAGUAY.</p>
                </div>
              </div>
              
              {view === 'HOME' && (
                <div className="bg-slate-200 py-2 text-center">
                    <button onClick={() => setView('ADMIN')} className="text-slate-400 hover:text-navy-900 text-[10px] transition-colors" title="Admin">
                      <Lock size={10} />
                    </button>
                </div>
              )}
            </footer>
          )}

          <button onClick={openWhatsApp} className="fixed bottom-6 right-6 z-40 bg-navy-900 hover:bg-navy-800 text-white p-3 rounded-full shadow-lg shadow-navy-900/30 border border-white/20 transition-transform duration-300 hover:scale-110 flex items-center justify-center" title="Contactar por WhatsApp">
             <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
             </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default App;