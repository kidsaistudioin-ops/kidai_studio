import { supabaseAdmin as supabase } from '@/lib/supabase';

export default async function sitemap() {
  // NOTE: Jab aapki website live ho jaye (jaise kidai.com), toh yahan apna asli URL daal dena
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kidai-studio.vercel.app';

  // Database se saare published blogs uthana
  const { data: blogs } = await supabase.from('blogs').select('slug, created_at');

  // Blogs ke URLs generate karna
  const blogUrls = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Main pages aur blogs ko combine karke return karna
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/select-profile`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    ...blogUrls,
  ];
}