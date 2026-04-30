import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Award, Mail, Calendar, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';

const Profile: React.FC = () => {
  const { profile, user } = useAuth();

  if (!profile || !user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden"
      >
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-[#4a6741] to-[#6b8c5f]" />
        
        <div className="px-8 pb-8">
          {/* Avatar & Basic Info */}
          <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <img 
                src={user.photoURL || ''} 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg object-cover" 
                alt="Profile"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black text-gray-900">{profile.displayName}</h2>
                  <span className="bg-[#4a6741]/10 text-[#4a6741] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-[#4a6741]/20">
                    {profile.role}
                  </span>
                </div>
                <p className="text-gray-400 font-bold flex items-center gap-1 mt-1">
                  <Mail size={14} />
                  {profile.email}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
            >
              <LogOut size={18} />
              <span>登出</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">累積紅利</p>
                <div className="text-4xl font-black text-[#4a6741]">{profile.points}</div>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                <Award size={32} />
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">註冊於</p>
                <div className="text-xl font-black text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                <Calendar size={32} />
              </div>
            </div>
          </div>

          {/* Membership Tier info */}
          <div className="bg-[#4a6741] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">尊榮會員計畫</h3>
              <p className="text-[#c9d6c5] font-medium text-sm max-w-sm mb-6">
                每消費 100 元即可獲得 1 點紅利，點數可用於兌換限定飲品或折抵現金。
              </p>
              <div className="w-full bg-black/20 h-2 rounded-full mb-2 overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${Math.min(100, (profile.points / 50) * 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                <span>當前點數: {profile.points}</span>
                <span>下一階目標: 50 點</span>
              </div>
            </div>
            <Award className="absolute -right-8 -bottom-8 opacity-10 w-48 h-48" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
