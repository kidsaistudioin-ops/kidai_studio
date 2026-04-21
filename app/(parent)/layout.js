'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ParentLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // NOTE: Real app me yahan Supabase Auth se role check hoga.
    // Abhi ke liye hum localStorage se check kar rahe hain.
    const parentId = localStorage.getItem('kidai_parent_id');
    
    if (!parentId) {
      // Agar parent logged in nahi hai, toh login page par bhej do
      router.push('/login'); 
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return null; // Jab tak check ho raha hai, blank dikhao

  return <div style={{ background: '#07090f', minHeight: '100vh' }}>{children}</div>;
}