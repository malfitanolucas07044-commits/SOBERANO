import React from 'react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <div className="w-full bg-white py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-black tracking-widest uppercase mb-4">Experiencia Soberano</h2>
          <div className="w-12 h-0.5 bg-navy mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {REVIEWS.map((review) => (
            <div key={review.id} className="text-center relative p-6 bg-gray-50 border border-gray-100">
              <Quote className="text-gray-200 absolute top-2 left-2" size={60} />
              <div className="relative z-10">
                <p className="text-gray-600 italic mb-6 leading-relaxed font-light text-sm">"{review.text}"</p>
                <div className="flex justify-center mb-3 text-gold gap-1">
                   {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                </div>
                <p className="text-black font-bold text-xs uppercase tracking-widest">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;