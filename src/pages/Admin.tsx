import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutGrid, ClipboardList, PlusCircle } from 'lucide-react';
import AdminOrders from './AdminOrders';
import AdminMenu from './AdminMenu';

const Admin: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-900">後台管理</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">管理菜單與訂單</p>
          </div>
          <div className="p-2">
            <Link 
              to="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive('orders') ? 'bg-[#4a6741] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ClipboardList size={20} />
              <span>訂單管理</span>
            </Link>
            <Link 
              to="/admin/menu"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive('menu') ? 'bg-[#4a6741] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid size={20} />
              <span>菜單管理</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-grow">
        <Routes>
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="*" element={<AdminOrders />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
