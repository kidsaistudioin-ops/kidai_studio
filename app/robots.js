export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kidai-studio.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Admin panel aur API Google search me na dikhe
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}