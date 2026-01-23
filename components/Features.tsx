import React from 'react';
import { ShieldCheck, Truck, Lock, MessageCircle } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    { icon: <ShieldCheck size={28} />, title: "AUTENTICIDAD", description: "Garantía de originalidad." },
    { icon: <Truck size={28} />, title: "ENVÍOS", description: "Seguros a todo el país." },
    { icon: <Lock size={28} />, title: "PAGO SEGURO", description: "Transacciones protegidas." },
    { icon: <MessageCircle size={28} />, title: "SOPORTE", description: "Atención personalizada." }
  ];

  return (
    <div className="w-full bg-gray-50 py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="text-navy mb-4 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-black font-serif tracking-[0.15em] text-sm font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-xs font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;