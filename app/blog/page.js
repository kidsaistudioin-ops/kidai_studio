'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = { bg: '#07090f', card: '#0f1520', border: '#1e2d45', cyan: '#06b6d4', text: '#f1f5f9', muted: '#64748b' };

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (data) setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', color: C.muted, fontSize: 24 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>KidAI <span style={{ color: C.cyan }}>Learning Blog</span> 📚</h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Loading articles...</div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: 40, background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
            Abhi koi article nahi hai! Jaldi hi kuch naya aayega.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {blogs.map(blog => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} style={{ textDecoration: 'none' }}>
                <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, transition: 'transform 0.2s', cursor: 'pointer' }}>
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: 180, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📝</div>
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 12, color: C.cyan, fontWeight: 800, marginBottom: 8 }}>{new Date(blog.created_at).toLocaleDateString()}</div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: C.text, margin: '0 0 8px 0', lineHeight: 1.4 }}>{blog.title}</h2>
                    <p style={{ color: C.muted, fontSize: 14, margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.meta_description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}