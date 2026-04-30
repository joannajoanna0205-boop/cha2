import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, Loader2, XCircle, Coffee, AlertCircle } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date().toISOString() });
    } catch (error) {
      alert('更新失敗');
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case OrderStatus.PREPARING: return 'bg-blue-100 text-blue-700 border-blue-200';
      case OrderStatus.READY: return 'bg-purple-100 text-purple-700 border-purple-200';
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case OrderStatus.CANCELLED: return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#4a6741]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">即時訂單管理</h2>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">{orders.length} 筆訂單</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {orders.map(order => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusStyle(order.status)} border`}>
                    {order.status === OrderStatus.PENDING && <Clock size={24} />}
                    {order.status === OrderStatus.PREPARING && <Coffee size={24} />}
                    {order.status === OrderStatus.READY && <CheckCircle2 size={24} />}
                    {order.status === OrderStatus.COMPLETED && <div className="text-sm font-bold">OK</div>}
                    {order.status === OrderStatus.CANCELLED && <XCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{order.userName}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                      <span>OrderID: {order.id?.slice(-6)}</span>
                      <span>•</span>
                      <span>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 h-fit">
                  {Object.values(OrderStatus).map(status => (
                    <button 
                      key={status}
                      onClick={() => updateStatus(order.id!, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        order.status === status 
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-[#4a6741] border border-gray-100">
                        {item.quantity}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-800">{item.name} ({item.size})</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase flex gap-2">
                          <span>{item.sugar}</span>
                          <span>|</span>
                          <span>{item.ice}</span>
                          {item.toppings.length > 0 && (
                            <>
                              <span>|</span>
                              <span className="text-[#4a6741]">{item.toppings.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="bg-amber-50 p-3 rounded-xl mb-6 flex gap-2">
                  <AlertCircle size={16} className="text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700 font-medium italic">備註: {order.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">Total Items: <span className="font-bold text-gray-900">{order.items.length}</span></div>
                <div className="text-xl font-black text-[#4a6741]">Total Amount: ${order.totalAmount}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminOrders;
