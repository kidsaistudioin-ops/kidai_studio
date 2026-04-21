'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalXP: 0, totalCoins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SECURITY CHECK: Sirf wahi khol paye jisne admin email se login kiya ho
    if (!localStorage.getItem('kidai_admin')) {
      router.push('/signup');
      return;
    }

    async function fetchAdminData() {
      try {
        const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false });
        
        // Agar database mein data nahi hai, toh dummy data dikhayenge taaki UI achha lage
        const users = (data && data.length > 0) ? data : [
          { id: '1', name: 'Arjun', email: 'parent1@test.com', total_xp: 450, coins: 120, streak_days: 5, current_class: 5 },
          { id: '2', name: 'Neha', email: 'parent2@test.com', total_xp: 890, coins: 340, streak_days: 12, current_class: 7 },
          { id: '3', name: 'Rahul', email: 'parent3@test.com', total_xp: 120, coins: 50, streak_days: 2, current_class: 4 },
        ];

        setStudents(users);
        setStats({
          totalUsers: users.length,
          totalXP: users.reduce((sum, u) => sum + (u.total_xp || 0), 0),
          totalCoins: users.reduce((sum, u) => sum + (u.coins || 0), 0)
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [router]);

  const logoutAdmin = () => {
    localStorage.removeItem('kidai_admin');
    router.push('/signup');
  };

  if (loading) return <div style={{ background: C.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cyan }}>Loading Admin Panel...</div>;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 32 }}>👑</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.orange }}>KidAI Control Center</h1>
              <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Super Admin Dashboard</p>
            </div>
          </div>
          <button onClick={logoutAdmin} style={{ background: C.card2, color: C.red, border: `1px solid ${C.red}44`, padding: '8px 16px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Exit Admin</button>
        </div>

        {/* System Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
          <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800 }}>TOTAL STUDENTS</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.cyan }}>{stats.totalUsers}</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800 }}>TOTAL XP GENERATED</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.green }}>{stats.totalXP}</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800 }}>COINS IN ECONOMY</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.orange }}>{stats.totalCoins}</div>
          </div>
        </div>

        {/* Users Table */}
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>👨‍🎓 Registered Students</h2>
        <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {students.map((student, i) => (
            <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: i === students.length - 1 ? 'none' : `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : C.card2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 2 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>{student.name?.charAt(0) || 'U'}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{student.name || 'Unknown'} <span style={{ fontSize: 11, background: C.border, padding: '2px 6px', borderRadius: 4, color: C.text, marginLeft: 8 }}>Class {student.current_class || '?'}</span></div>
                  <div style={{ fontSize: 12, color: C.muted }}>{student.email || 'No email linked'}</div>
                </div>
              </div>
              <div style={{ flex: 1, fontWeight: 800, color: C.green }}>⚡ {student.total_xp || 0} XP</div>
              <div style={{ flex: 1, fontWeight: 800, color: C.orange }}>🪙 {student.coins || 0} Coins</div>
              <div style={{ flex: 1, fontWeight: 800, color: C.pink }}>🔥 {student.streak_days || 0} Days</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}