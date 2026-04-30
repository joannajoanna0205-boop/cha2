import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Product, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SelectionModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (item: OrderItem) => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ product, onClose, onConfirm }) => {
  const [size, setSize] = useState<'M' | 'L'>('L');
  const [sugar, setSugar] = useState('正常糖');
  const [ice, setIce] = useState('正常冰');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const sugarOptions = ['正常糖', '七分糖', '五分糖', '三分糖', '微糖', '無糖'];
  const iceOptions = ['正常冰', '少冰', '微冰', '去冰', '完全去冰', '常溫', '溫', '熱'];
  const toppingOptions = [
    { name: '珍珠', price: 10 },
    { name: '椰果', price: 10 },
    { name: '仙草', price: 10 },
    { name: '布丁', price: 15 },
    { name: '蘆薈', price: 10 }
  ];

  const totalItemPrice = (size === 'M' ? product.priceM : product.priceL) + 
    toppings.reduce((acc, t) => acc + (toppingOptions.find(o => o.name === t)?.price || 0), 0);

  const handleConfirm = () => {
    onConfirm({
      productId: product.id,
      name: product.name,
      size,
      sugar,
      ice,
      toppings,
      price: totalItemPrice,
      quantity
    });
    onClose();
  };

  const toggleTopping = (name: string) => {
    setToppings(prev => prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{product.name}</h2>
            <p className="text-gray-500 text-sm mt-1">請選擇您的飲品喜好</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-grow scrollbar-hide">
          {/* Size */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">規格尺寸</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSize('M')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                  size === 'M' ? 'border-[#4a6741] bg-[#4a6741]/5 text-[#4a6741]' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <span className="font-bold">中杯 (M)</span>
                <span className="text-sm font-medium opacity-70">${product.priceM}</span>
              </button>
              <button 
                onClick={() => setSize('L')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                  size === 'L' ? 'border-[#4a6741] bg-[#4a6741]/5 text-[#4a6741]' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <span className="font-bold">大杯 (L)</span>
                <span className="text-sm font-medium opacity-70">${product.priceL}</span>
              </button>
            </div>
          </section>

          {/* Sugar */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">甜度</h3>
            <div className="flex flex-wrap gap-2">
              {sugarOptions.map(opt => (
                <button 
                  key={opt}
                  onClick={() => setSugar(opt)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    sugar === opt ? 'bg-[#4a6741] text-white border-[#4a6741]' : 'bg-gray-50 text-gray-600 border-gray-50 hover:border-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* Ice */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">冰塊</h3>
            <div className="flex flex-wrap gap-2">
              {iceOptions.map(opt => (
                <button 
                  key={opt}
                  onClick={() => setIce(opt)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    ice === opt ? 'bg-[#4a6741] text-white border-[#4a6741]' : 'bg-gray-50 text-gray-600 border-gray-50 hover:border-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* Toppings */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">加料 (可多選)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {toppingOptions.map(opt => (
                <button 
                  key={opt.name}
                  onClick={() => toggleTopping(opt.name)}
                  className={`p-3 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-between ${
                    toppings.includes(opt.name) ? 'bg-[#4a6741]/5 border-[#4a6741] text-[#4a6741]' : 'bg-gray-50 text-gray-600 border-gray-50 hover:border-gray-200'
                  }`}
                >
                  <span>{opt.name}</span>
                  <span className="text-[10px] font-black opacity-50">+${opt.price}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t flex items-center justify-between gap-6">
          <div className="flex items-center bg-gray-100 rounded-2xl p-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-lg"
            >
              -
            </button>
            <span className="w-12 text-center font-black text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-lg"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleConfirm}
            className="flex-grow bg-[#4a6741] text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#3d5535] shadow-lg shadow-[#4a6741]/20 transition-all uppercase tracking-widest"
          >
            <span>確認加入</span>
            <span className="text-white/40 font-black">|</span>
            <span>${totalItemPrice * quantity}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectionModal;
