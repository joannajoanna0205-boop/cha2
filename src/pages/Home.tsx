import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, Product, OrderItem } from '../types';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import SelectionModal from '../components/SelectionModal';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid } from 'lucide-react';
import { OperationType, handleFirestoreError } from '../lib/firebase';

const Home: React.FC = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qCat = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    const qProd = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    });

    return () => {
      unsubCat();
      unsubProd();
    };
  }, []);

  const addToCart = (item: OrderItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  const seedData = async () => {
    if (!isAdmin) {
      alert('請先以管理者帳號登入');
      return;
    }
    setLoading(true);
    try {
      const menuData = [
        {
          category: '茶品系列',
          order: 1,
          items: [
            { name: '白毫綠茶', priceM: 15, priceL: 20 },
            { name: '茗山青茶', priceM: 15, priceL: 20 },
            { name: '雙芯茗青', priceM: 20, priceL: 25 },
            { name: '招牌烏龍', priceM: 15, priceL: 20 },
            { name: '一般般紅茶', priceM: 15, priceL: 20 },
            { name: '古早味紅茶', priceM: 15, priceL: 20 },
            { name: '大麥茶', priceM: 15, priceL: 20 },
            { name: '洛神花茶', priceM: 25, priceL: 30 },
            { name: '蜜香烏龍', priceM: 25, priceL: 30 },
            { name: '龍眼蜜茶', priceM: 30, priceL: 35 },
            { name: '蜂蜜綠茶', priceM: 35, priceL: 40 },
            { name: '蜂蜜青茶', priceM: 35, priceL: 40 },
            { name: '蜂蜜烏龍', priceM: 35, priceL: 40 },
            { name: '蜂蜜紅茶', priceM: 35, priceL: 40 },
          ]
        },
        {
          category: '特調奶香',
          order: 2,
          items: [
            { name: '豆漿紅茶', priceM: 30, priceL: 40 },
            { name: '奶茶(綠.青.烏.紅)', priceM: 30, priceL: 40 },
            { name: '印度奶茶', priceM: 35, priceL: 45 },
            { name: '麥芽巧克力', priceM: 35, priceL: 45 },
            { name: '焦糖奶茶', priceM: 35, priceL: 45 },
            { name: '咖啡奶茶', priceM: 35, priceL: 45 },
            { name: '阿華田', priceM: 35, priceL: 45 },
            { name: '漂浮阿華田', priceM: 45, priceL: 55 },
          ]
        },
        {
          category: '特調原汁',
          order: 3,
          items: [
            { name: '玫瑰花果茶', priceM: 35, priceL: 45 },
            { name: '百香果汁', priceM: 20, priceL: 25 },
            { name: '百香果綠茶', priceM: 25, priceL: 30 },
            { name: '百香果檸檬綠', priceM: 30, priceL: 40 },
            { name: '檸檬梅子', priceM: 35, priceL: 45 },
            { name: '蜂蜜檸檬', priceM: 35, priceL: 45 },
            { name: '檸檬綠茶', priceM: 35, priceL: 45 },
            { name: '檸檬青茶', priceM: 35, priceL: 45 },
            { name: '檸檬烏龍', priceM: 35, priceL: 45 },
            { name: '檸檬紅茶', priceM: 35, priceL: 45 },
            { name: '檸檬汁', priceM: 35, priceL: 45 },
            { name: '鮮桔茶', priceM: 35, priceL: 45 },
            { name: '鮮橙綠茶', priceM: 40, priceL: 50 },
            { name: '金桔檸檬', priceM: 35, priceL: 45 },
          ]
        },
        {
          category: '多多系列',
          order: 4,
          items: [
            { name: '金蘋果綠茶', priceM: 30, priceL: 40 },
            { name: '綠茶多酚', priceM: 40, priceL: 50 },
            { name: '檸檬多酚', priceM: 45, priceL: 55 },
            { name: '鮮奶多酚', priceM: 50, priceL: 60 },
            { name: '多多綠茶', priceM: 40, priceL: 50 },
            { name: '百香多多', priceM: 40, priceL: 50 },
            { name: '檸檬多多', priceM: 40, priceL: 50 },
            { name: '鮮桔多多', priceM: 50, priceL: 60 },
          ]
        },
        {
          category: '加工感區',
          order: 5,
          items: [
            { name: '珍珠綠茶', priceM: 20, priceL: 25 },
            { name: '珍珠青茶', priceM: 20, priceL: 25 },
            { name: '珍珠烏龍', priceM: 20, priceL: 25 },
            { name: '珍珠紅茶', priceM: 20, priceL: 25 },
            { name: '椰果綠茶', priceM: 25, priceL: 30 },
            { name: '椰果青茶', priceM: 25, priceL: 30 },
            { name: '脆梅冰綠', priceM: 30, priceL: 40 },
            { name: '冰淇淋紅茶', priceM: 35, priceL: 45 },
            { name: '仙草凍奶茶', priceM: 35, priceL: 45 },
            { name: '珍珠奶茶', priceM: 35, priceL: 45 },
            { name: '布丁奶茶', priceM: 40, priceL: 50 },
          ]
        },
        {
          category: '鮮奶/拿鐵',
          order: 6,
          items: [
            { name: '冬瓜鮮奶', priceM: 40, priceL: 50 },
            { name: '鮮奶茶', priceM: 40, priceL: 50 },
            { name: '咖啡鮮奶', priceM: 40, priceL: 50 },
            { name: '焦糖鮮奶茶', priceM: 40, priceL: 50 },
            { name: '珍珠鮮奶茶', priceM: 45, priceL: 55 },
            { name: '阿華田鮮奶', priceM: 45, priceL: 55 },
            { name: '布丁鮮奶茶', priceM: 50, priceL: 60 },
          ]
        },
        {
          category: '冬瓜系列',
          order: 7,
          items: [
            { name: '冬瓜茉綠', priceM: 15, priceL: 20 },
            { name: '冬瓜青茶', priceM: 15, priceL: 20 },
            { name: '冬瓜珍珠', priceM: 20, priceL: 25 },
            { name: '冬瓜檸檬', priceM: 30, priceL: 35 },
            { name: '冬瓜冰淇淋', priceM: 35, priceL: 45 },
            { name: '冬瓜仙草凍', priceM: 25, priceL: 30 },
          ]
        }
      ];

      for (const group of menuData) {
        const catRef = await addDoc(collection(db, 'categories'), {
          name: group.category,
          order: group.order
        });
        
        for (const item of group.items) {
          await addDoc(collection(db, 'products'), {
            ...item,
            categoryId: catRef.id,
            available: true,
            description: `${group.category}系列經典飲品`
          });
        }
      }
      alert('雙茶苑菜單初始化成功！');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20">載入中...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Category Sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 px-2 text-[#4a6741]">分類</h2>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === 'all' 
                ? 'bg-[#4a6741] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              全部商品
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-[#4a6741] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-grow">
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <LayoutGrid size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">菜單目前是空的</h3>
            
            {isAdmin ? (
              <>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
                  管理者您好，請點擊下方按鈕初始化「雙茶苑」的預設菜單資料。
                </p>
                <button 
                  onClick={seedData}
                  className="bg-[#4a6741] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-[#4a6741]/20 hover:scale-105 transition-all"
                >
                  初始化菜單資料
                </button>
              </>
            ) : (
              <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
                請等待管理員建立菜單，或請先登入後由管理員進行初始化。
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={() => setSelectedProduct(product)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      <div className="lg:w-80 flex-shrink-0">
        <CartSidebar cart={cart} onRemove={removeFromCart} clearCart={() => setCart([])} />
      </div>

      {/* Selection Modal */}
      {selectedProduct && (
        <SelectionModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onConfirm={addToCart} 
        />
      )}
    </div>
  );
};

export default Home;
