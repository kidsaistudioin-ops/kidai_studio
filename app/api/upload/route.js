import { NextResponse } from 'next/server';
import { uploadToCloudinary, getCloudinaryConfig } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      image, 
      folder = 'book_scans', 
      studentId = 'anonymous',
      tags = [] 
    } = body;

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image data is required' }, { status: 400 });
    }

    const result = await uploadToCloudinary(image, {
      folder: `kidai_studio/${folder}`,
      studentId,
      tags
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('API Upload Exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const config = getCloudinaryConfig();
  return NextResponse.json({
    configured: config.isConfigured,
    cloudName: config.cloudName ? `${config.cloudName.substring(0, 3)}***` : null,
    hasApiKey: !!config.apiKey,
    hasApiSecret: !!config.apiSecret,
    hasUploadPreset: !!config.uploadPreset
  });
}
