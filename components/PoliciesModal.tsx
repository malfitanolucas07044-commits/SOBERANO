import React from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded shadow-2xl animate-fade-in border border-slate-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-serif font-bold text-navy-900 uppercase tracking-widest">Políticas de Garantía</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-8 text-slate-700">
          
          <div className="bg-slate-50 p-6 rounded border-l-4 border-navy-900">
            <p className="text-sm italic font-serif text-slate-600">
              "En Soberano, la confianza es nuestro activo más valioso. Nos comprometemos a entregar piezas auténticas y en perfecto estado."
            </p>
          </div>

          <section>
            <h3 className="flex items-center gap-2 font-bold text-navy-900 mb-3 uppercase text-sm tracking-wider">
              <ShieldCheck size={18} /> Garantía en Relojería
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Todos nuestros relojes cuentan con una <strong>Garantía de 30 días</strong> contra defectos de fábrica comprobados.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 marker:text-gold">
              <li><strong>Cobertura:</strong> Fallas en el mecanismo interno, desprendimiento de agujas sin impacto previo, o defectos de ensamblaje visibles al momento de la entrega.</li>
              <li><strong>Exclusiones:</strong> La garantía no cubre daños por uso indebido, golpes, caídas, ralladuras en el cristal o caja, desgaste natural de la correa (cuero/goma), ni daños por agua si el reloj no fue utilizado según su clasificación de resistencia (ATM).</li>
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-bold text-navy-900 mb-3 uppercase text-sm tracking-wider">
              <AlertCircle size={18} /> Políticas de Devolución
            </h3>
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <strong className="text-black block mb-1">Para Relojes:</strong>
                <p>Se aceptan cambios o devoluciones únicamente dentro de las 48 horas de recibido el producto, siempre y cuando el reloj <strong>no haya sido utilizado</strong>, conserve todos sus plásticos protectores intactos, etiquetas y caja original en perfecto estado. Si se detecta uso, la devolución será rechazada.</p>
              </div>
              <div>
                <strong className="text-black block mb-1">Para Perfumes y Decants:</strong>
                <p>Por estrictas normas de higiene y calidad, <strong>no se aceptan cambios ni devoluciones en perfumes ni decants</strong> una vez abiertos o atomizados. Garantizamos que el producto sale de nuestro depósito sellado y auténtico. Recomendamos adquirir decants (muestras) si no conoce la fragancia antes de comprar el frasco completo.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-navy-900 mb-2 uppercase text-xs tracking-wider">Proceso de Reclamo</h3>
            <p className="text-sm">
              Si su producto presenta una falla de fábrica al recibirlo, por favor contáctenos inmediatamente vía WhatsApp al <strong>+595 984 508 348</strong> enviando un video detallado del problema. Nuestro equipo técnico evaluará el caso en un plazo máximo de 24 horas hábiles.
            </p>
          </section>

        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <button onClick={onClose} className="text-xs font-bold uppercase tracking-widest text-navy-900 hover:text-black">Entendido</button>
        </div>
      </div>
    </div>
  );
};

export default PoliciesModal;