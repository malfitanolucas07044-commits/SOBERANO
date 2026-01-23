import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductCategory, PerfumeType, Order } from '../types';
import { Trash2, Edit, LogOut, Check, X as XIcon, Star, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { uploadImageToFirebase } from '../services/firebaseService';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
  heroWatchImages?: string[];
  heroPerfumeImages?: string[];
  onUpdateHeroImages?: (type: 'WATCH' | 'PERFUME', images: string[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, onAddProduct, onUpdateProduct, onDeleteProduct, onLogout,
  heroWatchImages = [], heroPerfumeImages = [], onUpdateHeroImages
}) => {
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'config'>('inventory');
  const [inventoryCategory, setInventoryCategory] = useState<'ALL' | ProductCategory>('ALL');

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Hero Image Edit State
  const [editWatchHero, setEditWatchHero] = useState(heroWatchImages[0] || '');
  const [editPerfumeHero, setEditPerfumeHero] = useState(heroPerfumeImages[0] || '');

  useEffect(() => {
    const savedOrders = localStorage.getItem('soberano_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const stats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.offerPrice || p.price), 0);
    return {
      totalItems: products.length,
      totalValue,
      totalWatches: products.filter(p => p.category === ProductCategory.WATCH).length,
      totalPerfumes: products.filter(p => p.category === ProductCategory.PERFUME).length,
      totalOrders: orders.length
    };
  }, [products, orders]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = inventoryCategory === 'ALL' || p.category === inventoryCategory;
        return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, inventoryCategory]);

  const initialFormState: Partial<Product> = {
    name: '', brand: '', price: 0, offerPrice: 0, category: ProductCategory.WATCH, description: '', image: '', gallery: [], 
    isStock: true, isBestSeller: false, isDecantAvailable: false, decantPrice3ml: 0, decantPrice5ml: 0, decantPrice10ml: 0, subCategory: PerfumeType.DESIGNER
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const productToSave = { 
        ...editingProduct, 
        id: editingProduct.id || Math.random().toString(36).substr(2, 9), 
        gallery: editingProduct.gallery || [],
        isStock: editingProduct.isStock ?? true,
        isBestSeller: editingProduct.isBestSeller ?? false
    } as Product;
    
    editingProduct.id ? onUpdateProduct(productToSave) : onAddProduct(productToSave);
    setIsFormOpen(false); setEditingProduct(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const urls = e.target.value.split('\n').map(url => url.trim()).filter(url => url.length > 0);
      setEditingProduct(prev => prev ? ({ ...prev, gallery: urls }) : null);
  };

  // --- FIREBASE UPLOAD HANDLERS ---

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
        const url = await uploadImageToFirebase(file, 'products');
        setEditingProduct(prev => prev ? ({ ...prev, image: url }) : null);
    } catch (error) {
        setUploadError('Error al subir imagen. Revisa la consola/configuración.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
        const url = await uploadImageToFirebase(file, 'products');
        setEditingProduct(prev => {
            if (!prev) return null;
            const currentGallery = prev.gallery || [];
            return { ...prev, gallery: [...currentGallery, url] };
        });
    } catch (error) {
        setUploadError('Error al subir a galería.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleHeroImageUpload = async (type: 'WATCH' | 'PERFUME', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
        const url = await uploadImageToFirebase(file, 'banners');
        if (type === 'WATCH') setEditWatchHero(url);
        else setEditPerfumeHero(url);
    } catch (error) {
        alert('Error subiendo banner');
    } finally {
        setIsUploading(false);
    }
  };

  const handleSaveConfig = () => {
    if (onUpdateHeroImages) {
        onUpdateHeroImages('WATCH', [editWatchHero, ...heroWatchImages.slice(1)]);
        onUpdateHeroImages('PERFUME', [editPerfumeHero, ...heroPerfumeImages.slice(1)]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 animate-fade-in bg-white min-h-screen text-black">
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-100">
        <div>
           <h2 className="text-3xl font-serif text-black">Administración</h2>
           <p className="text-gray-500 text-sm mt-1">Soberano E-commerce</p>
        </div>
        <button onClick={onLogout} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-2 text-sm uppercase tracking-wider"><LogOut size={16} /> Salir</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-50 p-6 border border-gray-100 rounded">
          <p className="text-navy-900 text-xs uppercase tracking-wider mb-2 font-bold">Productos</p>
          <h4 className="text-3xl text-black font-serif">{stats.totalItems}</h4>
        </div>
        <div className="bg-gray-50 p-6 border border-gray-100 rounded">
          <p className="text-navy-900 text-xs uppercase tracking-wider mb-2 font-bold">Pedidos</p>
          <h4 className="text-3xl text-black font-serif">{stats.totalOrders}</h4>
        </div>
        <div className="bg-gray-50 p-6 border border-gray-100 rounded">
          <p className="text-navy-900 text-xs uppercase tracking-wider mb-2 font-bold">Perfumes</p>
          <h4 className="text-3xl text-black font-serif">{stats.totalPerfumes}</h4>
        </div>
        <div className="bg-gray-50 p-6 border border-gray-100 rounded">
          <p className="text-navy-900 text-xs uppercase tracking-wider mb-2 font-bold">Valor Inventario</p>
          <h4 className="text-xl text-black font-bold">{stats.totalValue.toLocaleString('es-PY')}</h4>
        </div>
      </div>

      <div className="flex gap-8 mb-8 border-b border-gray-100">
        {['inventory', 'orders', 'config'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-navy-900'}`}
           >
             {tab === 'inventory' ? 'Inventario' : tab === 'orders' ? 'Pedidos' : 'Configuración Web'}
           </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <div>
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
             <div className="flex gap-4">
                 <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-gray-200 p-3 rounded w-full md:w-64 focus:border-black outline-none text-black placeholder-gray-400"
                 />
                 <div className="flex bg-gray-100 p-1 rounded">
                     <button onClick={() => setInventoryCategory('ALL')} className={`px-4 py-2 text-xs font-bold uppercase rounded ${inventoryCategory === 'ALL' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}>Todos</button>
                     <button onClick={() => setInventoryCategory(ProductCategory.WATCH)} className={`px-4 py-2 text-xs font-bold uppercase rounded ${inventoryCategory === ProductCategory.WATCH ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}>Relojes</button>
                     <button onClick={() => setInventoryCategory(ProductCategory.PERFUME)} className={`px-4 py-2 text-xs font-bold uppercase rounded ${inventoryCategory === ProductCategory.PERFUME ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}>Perfumes</button>
                 </div>
             </div>
             <button onClick={() => { setEditingProduct(initialFormState); setIsFormOpen(true); }} className="bg-navy-900 text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-navy-800 transition">
               + Nuevo Producto
             </button>
          </div>
          <div className="space-y-4">
            {filteredProducts.map(p => (
              <div key={p.id} className={`bg-white border p-4 flex items-center justify-between shadow-sm hover:border-gray-300 transition ${p.isStock ? 'border-gray-100' : 'border-red-200 bg-red-50/10'}`}>
                 <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100">
                        <img src={p.image} className={`w-full h-full object-cover ${!p.isStock ? 'grayscale opacity-70' : ''}`} />
                        {!p.isStock && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-[8px] font-bold uppercase">Agotado</span>}
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                         <h4 className="font-bold text-black">{p.name}</h4>
                         {p.isBestSeller && <Star size={12} className="text-gold fill-gold" />}
                       </div>
                       <p className="text-sm text-gray-500">{p.brand} - {p.category}</p>
                       <p className="text-navy-900 font-bold">{p.price.toLocaleString()} Gs</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-black" title="Editar"><Edit size={18} /></button>
                    <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500" title="Eliminar"><Trash2 size={18} /></button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
           {orders.slice().reverse().map(o => (
             <div key={o.id} className="bg-white border border-gray-100 p-6 rounded shadow-sm">
                <div className="flex justify-between mb-2">
                   <h4 className="font-bold text-black">{o.customerName}</h4>
                   <span className="text-navy-900 font-bold">{o.total.toLocaleString()} Gs</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{o.customerPhone} - {new Date(o.date).toLocaleDateString()}</p>
                <p className="text-gray-500 text-sm mb-4 font-bold">Pago: {o.method}</p>
                <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
                   {o.items.map((i, idx) => <div key={idx}>{i.productName} ({i.variant}) x{i.quantity}</div>)}
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Web Configuration Tab */}
      {activeTab === 'config' && (
         <div className="max-w-2xl">
             <h3 className="text-lg font-bold text-navy-900 mb-6 uppercase tracking-widest">Imágenes de Portada (Inicio)</h3>
             
             {isUploading && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded mb-4 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Subiendo imagen...
                </div>
             )}
             
             <div className="space-y-8">
                 <div className="bg-gray-50 p-6 rounded border border-gray-200">
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Portada Relojes</label>
                     <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <input 
                                value={editWatchHero} 
                                onChange={(e) => setEditWatchHero(e.target.value)} 
                                className="flex-1 border border-gray-200 p-2 text-sm focus:border-navy-900 outline-none bg-white text-black" 
                                placeholder="URL de la imagen"
                            />
                            {editWatchHero && <img src={editWatchHero} className="w-16 h-16 object-cover border border-gray-200" />}
                        </div>
                        <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-navy-900 text-xs font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition w-fit">
                            <Upload size={14} /> Subir Imagen
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHeroImageUpload('WATCH', e)} disabled={isUploading} />
                        </label>
                     </div>
                 </div>

                 <div className="bg-gray-50 p-6 rounded border border-gray-200">
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Portada Perfumes</label>
                     <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <input 
                                value={editPerfumeHero} 
                                onChange={(e) => setEditPerfumeHero(e.target.value)} 
                                className="flex-1 border border-gray-200 p-2 text-sm focus:border-navy-900 outline-none bg-white text-black" 
                                placeholder="URL de la imagen"
                            />
                            {editPerfumeHero && <img src={editPerfumeHero} className="w-16 h-16 object-cover border border-gray-200" />}
                        </div>
                        <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-navy-900 text-xs font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition w-fit">
                            <Upload size={14} /> Subir Imagen
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHeroImageUpload('PERFUME', e)} disabled={isUploading} />
                        </label>
                     </div>
                 </div>

                 <button 
                    onClick={handleSaveConfig}
                    className="px-8 py-3 bg-navy-900 text-white font-bold hover:bg-navy-800 uppercase tracking-widest text-xs flex items-center gap-2"
                 >
                    <Check size={16} /> Guardar Configuración
                 </button>
             </div>
         </div>
      )}

      {/* Modal for Edit */}
      {isFormOpen && editingProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded shadow-2xl border border-gray-200 text-black">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">{editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-black"><XIcon size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* ERROR MESSAGE */}
               {uploadError && (
                 <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                   {uploadError}
                 </div>
               )}
               {isUploading && (
                 <div className="bg-blue-50 text-blue-700 p-3 rounded text-sm mb-4 flex items-center gap-2">
                   <Loader2 className="animate-spin" size={16} /> Subiendo imagen a la nube...
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre</label>
                        <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Marca</label>
                        <input value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} className="w-full border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black" required />
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Precio Normal</label>
                      <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black" required />
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Precio Oferta (Opcional)</label>
                      <input type="number" value={editingProduct.offerPrice || ''} onChange={e => setEditingProduct({...editingProduct, offerPrice: Number(e.target.value)})} className="w-full border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black" />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Categoría</label>
                       <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black">
                          {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                   </div>
                   <div className="flex flex-col gap-2 pt-6">
                       <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-2 rounded w-full border border-gray-100 hover:bg-gray-100">
                          <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${editingProduct.isStock ? 'bg-navy-900 border-navy-900' : 'bg-white border-gray-300'}`}>
                              {editingProduct.isStock && <Check size={14} className="text-white" />}
                          </div>
                          <input type="checkbox" checked={editingProduct.isStock} onChange={e => setEditingProduct({...editingProduct, isStock: e.target.checked})} className="hidden" />
                          <span className="text-sm font-bold text-navy-900">Producto Disponible (Stock)</span>
                       </label>

                       <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-2 rounded w-full border border-gray-100 hover:bg-gray-100">
                          <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${editingProduct.isBestSeller ? 'bg-gold border-gold' : 'bg-white border-gray-300'}`}>
                              {editingProduct.isBestSeller && <Check size={14} className="text-white" />}
                          </div>
                          <input type="checkbox" checked={editingProduct.isBestSeller} onChange={e => setEditingProduct({...editingProduct, isBestSeller: e.target.checked})} className="hidden" />
                          <span className="text-sm font-bold text-gold">Producto "Más Vendido"</span>
                       </label>
                   </div>
               </div>

               {/* PERFUME SETTINGS */}
               {editingProduct.category === ProductCategory.PERFUME && (
                 <div className="bg-slate-50 p-6 rounded border border-slate-100 space-y-4">
                   <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-2">Configuración de Perfumes</h4>
                   
                   <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo de Perfume</label>
                       <select value={editingProduct.subCategory} onChange={e => setEditingProduct({...editingProduct, subCategory: e.target.value as any})} className="w-full border border-gray-200 p-2 bg-white text-black">
                          {Object.values(PerfumeType).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                   </div>

                   <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={editingProduct.isDecantAvailable} onChange={e => setEditingProduct({...editingProduct, isDecantAvailable: e.target.checked})} />
                      <span className="font-bold">Habilitar venta de Decants</span>
                   </label>

                   {editingProduct.isDecantAvailable && (
                     <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Precio 3ml</label>
                            <input type="number" value={editingProduct.decantPrice3ml || ''} onChange={e => setEditingProduct({...editingProduct, decantPrice3ml: Number(e.target.value)})} className="w-full border border-gray-200 p-2 text-sm bg-white text-black" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Precio 5ml</label>
                            <input type="number" value={editingProduct.decantPrice5ml || ''} onChange={e => setEditingProduct({...editingProduct, decantPrice5ml: Number(e.target.value)})} className="w-full border border-gray-200 p-2 text-sm bg-white text-black" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Precio 10ml</label>
                            <input type="number" value={editingProduct.decantPrice10ml || ''} onChange={e => setEditingProduct({...editingProduct, decantPrice10ml: Number(e.target.value)})} className="w-full border border-gray-200 p-2 text-sm bg-white text-black" />
                        </div>
                     </div>
                   )}
                 </div>
               )}

               {/* IMAGE MANAGEMENT */}
               <div className="space-y-4">
                    <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-2">Imágenes</h4>
                    
                    {/* MAIN IMAGE */}
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Imagen Principal (Portada)</label>
                        <div className="flex gap-4 items-center">
                            <input value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="flex-1 border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black" placeholder="URL" />
                            <label className="cursor-pointer bg-navy-900 text-white p-2 rounded hover:bg-navy-800 transition" title="Subir Imagen">
                                <Upload size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleProductImageUpload} disabled={isUploading} />
                            </label>
                        </div>
                        {editingProduct.image && <img src={editingProduct.image} className="w-20 h-20 object-cover mt-2 border border-gray-200" alt="Preview" />}
                    </div>

                    {/* GALLERY */}
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-xs font-bold uppercase text-gray-500">Galería de Imágenes</label>
                             <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-navy-900 text-[10px] font-bold py-1 px-3 rounded flex items-center gap-1">
                                <Upload size={12} /> Agregar Imagen
                                <input type="file" className="hidden" accept="image/*" onChange={handleGalleryImageUpload} disabled={isUploading} />
                            </label>
                        </div>
                        <textarea 
                            value={editingProduct.gallery?.join('\n') || ''} 
                            onChange={handleGalleryChange}
                            className="w-full border border-gray-200 p-2 h-32 focus:border-navy-900 outline-none text-sm font-mono bg-white text-black"
                            placeholder="https://ejemplo.com/img1.jpg&#10;https://ejemplo.com/img2.jpg"
                        ></textarea>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {editingProduct.gallery?.map((url, i) => (
                                <img key={i} src={url} className="w-16 h-16 object-cover border border-gray-200" title={`Galeria ${i+1}`} />
                            ))}
                        </div>
                    </div>
               </div>

               <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripción</label>
                   <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full border border-gray-200 p-2 focus:border-navy-900 outline-none bg-white text-black" rows={4}></textarea>
               </div>
               
               <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 text-gray-500 hover:text-black font-bold uppercase tracking-widest text-xs">Cancelar</button>
                  <button type="submit" disabled={isUploading} className="px-8 py-3 bg-navy-900 text-white font-bold hover:bg-navy-800 uppercase tracking-widest text-xs disabled:opacity-50">Guardar Cambios</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;