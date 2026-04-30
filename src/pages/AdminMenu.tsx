import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, Product } from '../types';
import { Plus, Trash2, Edit2, Check, X, Search } from 'lucide-react';

const AdminMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Product State
  const [newProd, setNewProd] = useState({
    name: '',
    categoryId: '',
    priceM: 30,
    priceL: 40,
    available: true,
    description: ''
  });

  useEffect(() => {
    const qCat = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    });

    const qProd = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setLoading(false);
    });

    return () => {
      unsubCat();
      unsubProd();
    };
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.categoryId) return;
    try {
      await addDoc(collection(db, 'products'), newProd);
      setNewProd({ name: '', categoryId: '', priceM: 30, priceL: 40, available: true, description: '' });
      setIsAddingProduct(false);
    } catch (error) {
      alert('新增失敗');
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'products', id), { available: !current });
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('確定要刪除此商品嗎？')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || 
    categories.find(c => c.id === p.categoryId)?.name.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">菜單品項管理</h2>
          <p className="text-sm text-gray-500 font-medium">調整價格、上下架或新增飲品</p>
        </div>
        <button 
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="bg-[#4a6741] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#4a6741]/20 hover:scale-105 transition-all"
        >
          {isAddingProduct ? <X size={20} /> : <Plus size={20} />}
          <span>{isAddingProduct ? '取消新增' : '新增飲品'}</span>
        </button>
      </div>

      {isAddingProduct && (
        <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-3xl border-2 border-[#4a6741]/20 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">商品名稱</label>
              <input 
                type="text" 
                required
                value={newProd.name}
                onChange={e => setNewProd({...newProd, name: e.target.value})}
                placeholder="例如: 珍珠奶茶"
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 font-bold focus:ring-2 focus:ring-[#4a6741] transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">所屬分類</label>
              <select 
                required
                value={newProd.categoryId}
                onChange={e => setNewProd({...newProd, categoryId: e.target.value})}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 font-bold focus:ring-2 focus:ring-[#4a6741] transition-all outline-none"
              >
                <option value="">請選擇分類</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">中杯價格 (M)</label>
              <input 
                type="number" 
                required
                value={newProd.priceM}
                onChange={e => setNewProd({...newProd, priceM: parseInt(e.target.value)})}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 font-bold focus:ring-2 focus:ring-[#4a6741] transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">大杯價格 (L)</label>
              <input 
                type="number" 
                required
                value={newProd.priceL}
                onChange={e => setNewProd({...newProd, priceL: parseInt(e.target.value)})}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 font-bold focus:ring-2 focus:ring-[#4a6741] transition-all outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">儲存商品</button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="搜尋商品或分類..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none font-medium text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-left">
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">商品名稱</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">分類</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">價格 (M/L)</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">狀態</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{p.name}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-[10px] font-black text-gray-500 uppercase">
                      {categories.find(c => c.id === p.categoryId)?.name || '未分類'}
                    </span>
                  </td>
                  <td className="p-4 font-black text-[#4a6741]">
                    ${p.priceM} / ${p.priceL}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleAvailability(p.id, p.available)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.available ? '販售中' : '已停售'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
