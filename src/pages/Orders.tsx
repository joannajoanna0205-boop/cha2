import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle2, Coffee, XCircle, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock className="text-amber-500" />;
      case OrderStatus.PREPARING: return <Coffee className="text-blue-500" />;
      case OrderStatus.READY: return <CheckCircle2 className="text-purple-500" />;
      case OrderStatus.COMPLETED: return <CheckCircle2 className="text-green-500" />;
      case OrderStatus.CANCELLED: return <XCircle className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return '等待中';
      case OrderStatus.PREPARING: return '製作中';
      case OrderStatus.READY: return '請取餐';
      case OrderStatus.COMPLETED: return '已完成';
      case OrderStatus.CANCELLED: return '已取消';
    }
  };

  if (loading) return <div className="flex justify-center p-12">載入訂單中...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-black text-gray-900 px-2 flex items-center justify-between">
        我的訂單
        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{orders.length}</span>
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Coffee size={32} />
          </div>
          <p className="font-bold text-gray-400">目前還沒有訂單喔</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{getStatusLabel(order.status)}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : '剛剛'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-[#4a6741]">${order.totalAmount}</div>
                  <div className="text-[10px] text-gray-400 font-bold">訂單編號: {order.id?.slice(-6)}</div>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="text-gray-400 font-medium">{item.size} • {item.sugar} • {item.ice}</span>
                  </div>
                ))}
              </div>

              {order.status === OrderStatus.READY && (
                <div className="absolute inset-0 bg-[#4a6741]/10 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-white px-6 py-2 rounded-full shadow-lg border border-[#4a6741]/20 flex items-center gap-2">
                    <span className="text-[#4a6741] font-black text-lg">取餐中</span>
                    <ChevronRight size={20} className="text-[#4a6741]" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
