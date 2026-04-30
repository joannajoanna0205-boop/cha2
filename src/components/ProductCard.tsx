import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#4a6741] transition-colors">{product.name}</h3>
        {product.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Medium</span>
            <span className="text-lg font-bold text-[#4a6741]">${product.priceM}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Large</span>
            <span className="text-lg font-bold text-[#4a6741]">${product.priceL}</span>
          </div>
        </div>
        
        <button 
          onClick={onSelect}
          disabled={!product.available}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            product.available 
            ? 'bg-[#4a6741] text-white hover:scale-110 active:scale-95 shadow-lg shadow-[#4a6741]/20' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus size={20} />
        </button>
      </div>
      
      {!product.available && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">售完</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
