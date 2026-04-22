'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = { bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45', yellow: '#f59e0b', cyan: '#06b6d4', text: '#f1f5f9', muted: '#64748b', green: '#10b981' };

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(5);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setReviews(data);
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating((total / data.length).toFixed(1));
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.comment) return alert("Naam aur comment likhna zaroori hai!");
    setSubmitting(true);
    
    try {
      const newReview = { 
        name: form.name, 
        rating: form.rating, 
        comment: form.comment,
        status: 'approved' // Direct dikhane ke liye
      };
      
      const { error } = await supabase.from('reviews').insert([newReview]);
      if (error) throw error;

      // UI update turant karein
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setForm({ name: '', rating: 5, comment: '' });
      alert("🎉 Review submit karne ke liye shukriya!");
    } catch (err) {
      alert("Network error, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🚀 GOOGLE SEO SCHEMA (Rich Snippets ke liye)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "KidAI Studio",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "ratingCount": reviews.length > 0 ? reviews.length : 1
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      {/* Google ko batane ke liye hidden SEO code */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ textDecoration: 'none', color: C.muted, fontSize: 24 }}>←</Link>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>Parent <span style={{ color: C.yellow }}>Reviews</span> ⭐</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: C.yellow, color: '#000', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 15 }}>
            + Write Review
          </button>
        </div>

        {/* Summary Card */}
        <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, padding: 30, borderRadius: 20, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 30, marginBottom: 30 }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: C.yellow }}>{avgRating}</div>
          <div>
            <div style={{ fontSize: 24, letterSpacing: 2, marginBottom: 8 }}>{'⭐'.repeat(Math.round(avgRating))}</div>
            <div style={{ color: C.muted, fontSize: 15, fontWeight: 800 }}>Based on {reviews.length} reviews from Parents & Kids</div>
          </div>
        </div>

        {/* Write Review Form */}
        {showForm && (
          <div style={{ background: C.card, padding: 24, borderRadius: 20, border: `2px solid ${C.yellow}`, marginBottom: 30, animation: 'slideDown 0.3s ease' }}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18 }}>Write your experience ✍️</h3>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your Name (e.g. Rahul's Mom)" style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 15, marginBottom: 16, outline: 'none' }} />
            
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: C.muted, fontWeight: 800 }}>Rating:</span>
              {[1,2,3,4,5].map(num => (
                <span key={num} onClick={() => setForm({...form, rating: num})} style={{ fontSize: 28, cursor: 'pointer', opacity: form.rating >= num ? 1 : 0.3 }}>⭐</span>
              ))}
            </div>

            <textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} placeholder="Bacche ko game kaisa laga? Arya AI ne kitni help ki?..." style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 15, marginBottom: 16, outline: 'none', minHeight: 100, resize: 'vertical' }} />
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, background: C.green, color: '#fff', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 900, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>{submitting ? 'Submitting...' : 'Post Review'}</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '14px 20px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: 40, background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>Abhi tak koi review nahi hai. Pehle aap banaiye!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: C.cyan }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{new Date(r.created_at || Date.now()).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>{'⭐'.repeat(r.rating)}</div>
                <div style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.6 }}>"{r.comment}"</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewsPage;
