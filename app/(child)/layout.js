'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav'

export default function ChildLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('kidai_student_id');
    
    // Agar id nahi hai, toh login par bhej do
    if (!studentId) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Jab tak check ho raha hai, tab tak blank return karo (taaki error/flicker na aaye)
  if (!isAuthorized) return null;

  return (
    <>
      <div style={{ paddingBottom: '80px' }}>
        {children}
      </div>
      <BottomNav currentPath={pathname} />
    </>
  )
}