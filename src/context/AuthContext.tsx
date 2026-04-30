import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { OperationType, handleFirestoreError } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const MASTER_ADMIN_EMAIL = 'joannajoanna0205@gmail.com';

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // 清除舊的監聽器
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        
        // 監聽使用者設定檔
        unsubscribeProfile = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            setLoading(false);
          } else {
            // 如果文件不存在，代表是第一次登入，建立新設定檔
            const isMaster = user.email === MASTER_ADMIN_EMAIL;
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Guest',
              role: isMaster ? UserRole.ADMIN : UserRole.USER,
              points: 0,
              createdAt: new Date().toISOString(),
            };
            
            try {
              // 注意：這會觸發下一次 onSnapshot
              await setDoc(docRef, newProfile);
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
            }
          }
        }, (error) => {
          // 處理權限或其他 Firestore 錯誤
          console.error("Profile sync error:", error);
          if (user) {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const isAdmin = profile?.role === UserRole.ADMIN || user?.email === MASTER_ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
