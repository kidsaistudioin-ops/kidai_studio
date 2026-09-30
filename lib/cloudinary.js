import crypto from 'crypto';

/**
 * Cloudinary Secure Upload Engine for KidAI Studio
 * Supports Book Scans, Drawings, Comics, and Stickers
 */

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  const isConfigured = !!(cloudName && (apiSecret ? apiKey : uploadPreset));

  return {
    cloudName,
    apiKey,
    apiSecret,
    uploadPreset,
    isConfigured
  };
}

/**
 * Upload Base64 or Image URL to Cloudinary
 * @param {string} fileData - Base64 data URI (data:image/...) or public image URL
 * @param {object} options - { folder: 'book_scans'|'drawings'|'stickers', studentId: 'student_123', tags: [] }
 * @returns {Promise<{ success: boolean, url: string, public_id?: string, format?: string, bytes?: number, isCloudinary: boolean }>}
 */
export async function uploadToCloudinary(fileData, options = {}) {
  const { 
    folder = 'kidai_studio', 
    studentId = 'anonymous',
    tags = ['kidai'] 
  } = options;

  const config = getCloudinaryConfig();

  // If Cloudinary is not yet configured in .env, gracefully fallback to base64
  if (!config.isConfigured) {
    console.log('ℹ️ [CLOUDINARY] Keys not configured in .env, using local asset storage.');
    return {
      success: true,
      url: fileData,
      isCloudinary: false,
      note: 'Stored locally (Add Cloudinary keys to .env for CDN hosting)'
    };
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const tagsStr = [...tags, `student_${studentId}`].join(',');

    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('tags', tagsStr);

    if (config.apiSecret && config.apiKey) {
      // Signed Upload (Most Secure)
      const paramsToSign = `folder=${folder}&tags=${tagsStr}&timestamp=${timestamp}${config.apiSecret}`;
      const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

      formData.append('api_key', config.apiKey);
      formData.append('signature', signature);
    } else if (config.uploadPreset) {
      // Unsigned Preset Upload
      formData.append('upload_preset', config.uploadPreset);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
    console.log(`☁️ [CLOUDINARY] Uploading image to folder: "${folder}" on cloud: "${config.cloudName}"...`);

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (data.error) {
      console.error('❌ [CLOUDINARY] Upload Error:', data.error.message);
      // Fallback to base64 on API failure
      return {
        success: true,
        url: fileData,
        isCloudinary: false,
        error: data.error.message
      };
    }

    console.log(`✅ [CLOUDINARY] Upload Success! CDN URL: ${data.secure_url}`);

    return {
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
      isCloudinary: true
    };
  } catch (err) {
    console.error('❌ [CLOUDINARY] Exception:', err.message);
    return {
      success: true,
      url: fileData,
      isCloudinary: false,
      error: err.message
    };
  }
}
