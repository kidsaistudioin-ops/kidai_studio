'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = { bg: '#07090f', card: '#0f1520', border: '#1e2d45', cyan: '#06b6d4', green: '#10b981', purple: '#7c3aed', text: '#f1f5f9', muted: '#64748b' };

export default function AdminBlogCreate() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', slug: '', image_url: '', meta_desc: '', content: '' });
  const [loading, setLoading] = useState(false);

  // Check if admin
  useEffect(() => {
    if (!localStorage.getItem('kidai_admin')) router.push('/signup');
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      // Auto-generate SEO Slug from Title
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setForm({ ...form, title: value, slug: autoSlug });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePublish = async () => {
    if (!form.title || !form.content || !form.slug) return alert("Title, Slug aur Content likhna zaroori hai!");
    setLoading(true);
    try {
      const { error } = await supabase.from('blogs').insert([{
        title: form.title, 
        slug: form.slug, 
        image_url: form.image_url, 
        meta_description: form.meta_desc, 
        content: form.content
      }]);
      if (error) throw error;
      
      alert("✅ Blog Published Successfully!");
      router.push('/admin');
    } catch (err) {
      alert("Database me save nahi hua: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 16, marginBottom: 16, outline: 'none' };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
          <Link href="/admin" style={{ textDecoration: 'none', color: C.muted, fontSize: 24 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.cyan }}>✍️ Create New Blog</h1>
        </div>

        <div style={{ background: C.card, padding: 30, borderRadius: 20, border: `1px solid ${C.border}` }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 800, color: C.muted }}>Blog Title (H1)</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 5 Best Math Games for Kids" style={inputStyle} />

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 800, color: C.muted }}>SEO Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="5-best-math-games" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 800, color: C.muted }}>Cover Image URL</label>
              <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://image-link.com/img.png" style={inputStyle} />
            </div>
          </div>

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 800, color: C.muted }}>SEO Meta Description (160 chars limit)</label>
          <input name="meta_desc" value={form.meta_desc} onChange={handleChange} placeholder="Google search ke niche dikhne wala chhota description..." style={inputStyle} maxLength={160} />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 800, color: C.muted }}>Main Content (Use HTML/Text)</label>
          <textarea name="content" value={form.content} onChange={handleChange} placeholder="Yahan poora blog likhein..." style={{ ...inputStyle, minHeight: 300, resize: 'vertical' }} />

          <button 
            onClick={handlePublish} 
            disabled={loading}
            style={{ background: C.green, color: '#000', border: 'none', padding: '14px 24px', borderRadius: 12, fontWeight: 900, fontSize: 16, cursor: 'pointer', width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Publishing...' : '🚀 Publish Blog to Live'}
          </button>
        </div>
      </div>
    </div>
  );
}