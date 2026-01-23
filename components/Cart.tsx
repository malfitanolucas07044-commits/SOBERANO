import React, { useState } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem, Order, PaymentMethod, ProductCategory } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (cartId: string) => void;
  onRecordOrder: (order: Order) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onRecordOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');

  if (!isOpen) return null;

  const getPrice = (item: CartItem) => {
    if (item.variant === '3ml' && item.decantPrice3ml) return item.decantPrice3ml;
    if (item.variant === '5ml' && item.decantPrice5ml) return item.decantPrice5ml;
    if (item.variant === '10ml' && item.decantPrice10ml) return item.decantPrice10ml;
    return item.offerPrice || item.price;
  };

  const total = items.reduce((sum, item) => sum + getPrice(item), 0);

  const paymentMethods: { id: PaymentMethod; label: string }[] = [
    { id: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
    { id: 'DEBIT_CARD', label: 'Tarjeta de Débito' },
    { id: 'TRANSFER', label: 'Transferencia Bancaria' },
    { id: 'CASH', label: 'Efectivo (Solo Asunción)' },
  ];

  const handleCheckout = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Por favor complete su nombre y teléfono.");
      return;
    }

    // Aggregate items for order record
    const aggregatedItems = items.map(item => ({
        productName: item.name,
        variant: item.variant,
        price: getPrice(item),
        quantity: 1
    }));

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      customerName,
      customerPhone,
      customerAddress,
      total,
      method: paymentMethod,
      status: 'PENDING_WHATSAPP',
      items: aggregatedItems
    };
    
    onRecordOrder(newOrder);

    // Group items for WhatsApp message
    const groupedItems: {[key: string]: {count: number, item: CartItem}} = {};
    items.forEach(item => {
        const key = `${item.id}-${item.variant}`;
        if (!groupedItems[key]) {
            groupedItems[key] = { count: 0, item };
        }
        groupedItems[key].count++;
    });

    let itemList = '';
    Object.values(groupedItems).forEach(({count, item}) => {
        const variantLabel = item.category === ProductCategory.WATCH 
            ? 'Unidad' 
            : item.variant === 'bottle' ? 'Frasco Completo' : 
            item.variant === '3ml' ? 'Decant 3ml' :
            item.variant === '5ml' ? 'Decant 5ml' : 'Decant 10ml';
        
        itemList += `- ${item.name} (${variantLabel}) x${count} - Gs. ${(getPrice(item) * count).toLocaleString()}\n`;
    });

    const paymentLabel = paymentMethods.find(p => p.id === paymentMethod)?.label;

    const msg = `Hola Lucas, quiero realizar el siguiente pedido:

${itemList}
Subtotal: Gs. ${total.toLocaleString()}
Total: Gs. ${total.toLocaleString()}

Método de pago seleccionado: ${paymentLabel}

Dirección de entrega: ${customerAddress || 'A coordinar'}

¡Gracias!`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex bg-white shadow-2xl animate-slide-in-right flex-col border-l border-gray-100">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-serif text-black tracking-widest uppercase font-bold">Tu Compra</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
             <div className="text-center py-20 text-gray-400">
               <ShoppingBag size={48} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
               <p>Tu carrito está vacío.</p>
             </div>
          ) : (
             <div className="space-y-6">
               {items.map(item => (
                 <div key={item.cartId} className="flex gap-4 items-center bg-white p-3 rounded border border-gray-100">
                   <div className="w-16 h-16 bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                     <img src={item.image} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="text-sm font-bold text-black font-serif truncate">{item.name}</h4>
                     <p className="text-xs text-gray-500 uppercase tracking-wider">
                         {item.category === ProductCategory.WATCH 
                           ? 'Unidad' 
                           : (item.variant === 'bottle' ? 'Frasco' : `Decant ${item.variant}`)}
                     </p>
                     <p className="text-gold font-bold text-sm mt-1">{getPrice(item).toLocaleString()} Gs</p>
                   </div>
                   <button onClick={() => onRemove(item.cartId)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                 </div>
               ))}
             </div>
          )}

          {items.length > 0 && (
             <div className="pt-8 border-t border-gray-100 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-navy mb-2">Datos para el pedido</h3>
                <input 
                  type="text" 
                  placeholder="Nombre Completo" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm bg-transparent text-black placeholder-gray-400"
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono" 
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm bg-transparent text-black placeholder-gray-400"
                />
                <input 
                  type="text" 
                  placeholder="Dirección de entrega (Opcional)" 
                  value={customerAddress} 
                  onChange={e => setCustomerAddress(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm bg-transparent text-black placeholder-gray-400"
                />

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-navy mb-3">Método de Pago</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded transition">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? 'border-gold' : 'border-gray-300'}`}>
                           {paymentMethod === method.id && <div className="w-2 h-2 bg-gold rounded-full" />}
                        </div>
                        <input 
                          type="radio" 
                          name="payment" 
                          value={method.id} 
                          checked={paymentMethod === method.id} 
                          onChange={() => setPaymentMethod(method.id)} 
                          className="hidden" 
                        />
                        <span className={`text-sm ${paymentMethod === method.id ? 'text-black font-bold' : 'text-gray-500'}`}>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
             </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
               <span className="text-gray-500 text-sm">Total Estimado</span>
               <span className="text-2xl font-serif text-black font-bold">{total.toLocaleString('es-PY')} Gs</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-navy transition-colors flex items-center justify-center gap-2 border border-black shadow-lg"
            >
              Finalizar pedido vía WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;