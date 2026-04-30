import React, { useState } from 'react';
import { ShoppingBag, Trash2, Send, AlertCircle } from 'lucide-react';
import { OrderItem, Order, OrderStatus } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface CartSidebarProps {
  cart: OrderItem[];
  onRemove: (index: number) => void;
  clearCart: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ cart, onRemove, clearCart }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState('');

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const guestId = localStorage.getItem('tea_guest_id') || `guest_${Math.random().toString(36).slice(2, 11)}`;
      if (!localStorage.getItem('tea_guest_id')) {
        localStorage.setItem('tea_guest_id', guestId);
      }

      const order: Order = {
        userId: user?.uid || guestId,
        userName: user?.displayName || '訪客外帶',
        items: cart,
        totalAmount: total,
        status: OrderStatus.PENDING,
        createdAt: serverTimestamp(),
        notes: notes
      };

      await addDoc(collection(db, 'orders'), order);
      setSuccess(true);
      clearCart();
      setNotes('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Checkout failed:', error);
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
      <div className="bg-[#4a6741] p-6 text-white">
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} className="opacity-80" />
          <h2 className="text-xl font-black">購物車</h2>
        </div>
        <p className="text-[#c9d6c5] text-xs font-bold uppercase tracking-widest mt-1">你的精選飲品</p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {cart.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-300 gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={32} />
            </div>
            <p className="font-bold text-gray-400">購物車還是空的</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {cart.map((item, index) => (
              <motion.div 
                key={`${item.productId}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group bg-gray-50 p-4 rounded-2xl relative border border-transparent hover:border-gray-200 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-gray-800 line-clamp-1 flex-grow pr-6">{item.name}</span>
                  <span className="font-black text-[#4a6741] text-sm">${item.price * item.quantity}</span>
                </div>
                <div className="flex flex-wrap gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{item.size}</span>
                  <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{item.sugar}</span>
                  <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{item.ice}</span>
                  {item.toppings.map(t => (
                    <span key={t} className="bg-[#4a6741]/5 text-[#4a6741] px-1.5 py-0.5 rounded border border-[#4a6741]/20">{t}</span>
                  ))}
                  <span className="ml-auto text-[#4a6741]">x{item.quantity}</span>
                </div>
                
                <button 
                  onClick={() => onRemove(index)}
                  className="absolute right-2 top-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t bg-gray-50/50 space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">備註</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="有什麼想告訴我們的嗎？"
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#4a6741] focus:border-transparent outline-none transition-all resize-none h-20"
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-gray-400">預計總計</span>
            <span className="text-2xl font-black text-[#4a6741]">${total}</span>
          </div>

          <button 
            disabled={loading}
            onClick={handleCheckout}
            className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              loading ? 'bg-gray-200 text-gray-400 cursor-wait' : 'bg-[#4a6741] text-white hover:bg-[#3d5535] shadow-lg shadow-[#4a6741]/20'
            }`}
          >
            {loading ? '處理中...' : (
              <>
                <span>送出訂單</span>
                <Send size={18} />
              </>
            )}
          </button>
        </div>
      )}

      {success && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Send size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">訂單已送出!</h3>
          <p className="text-gray-500 text-sm mb-6">我們已收到您的訂單，正在為您準備中。</p>
          <button 
            onClick={() => setSuccess(false)}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase"
          >
            繼續點餐
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CartSidebar;
