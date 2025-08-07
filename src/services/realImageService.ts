const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://publishjockey-backend.onrender.com/api';

export const realImageService = {
  async getUserImages() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/images`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch images');
    return res.json();
  },
  async getImageUsageStats() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/images/usage`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch image usage');
    return res.json();
  },
  async validateExport() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/images/validate-export`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to validate export');
    return res.json();
  },
  async uploadImage(file: File) {
    const token = localStorage.getItem('token');
    
    // 1. Check image limit before upload
    const checkRes = await fetch(`${API_BASE_URL}/api/images/check-limit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!checkRes.ok) {
      const error = await checkRes.json();
      throw new Error(error.message || 'Upload limit reached');
    }

    // 2. Get signed upload params from backend
    const res = await fetch(`${API_BASE_URL}/api/images/upload-url`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ filename: file.name, type: file.type }),
    });
    if (!res.ok) throw new Error('Failed to get upload URL');
    const { uploadUrl, publicId, timestamp, signature, apiKey, folder } = await res.json();

    // 3. Upload to Cloudinary using form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('folder', folder);

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const uploadResult = await uploadRes.json();
    if (!uploadRes.ok) throw new Error('Upload to Cloudinary failed');

    // 4. Notify backend of success (will increment image count)
    const notifyRes = await fetch(`${API_BASE_URL}/api/images/confirm-upload`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        publicId,
        filename: file.name,
        url: uploadResult.secure_url,
      }),
    });
    if (!notifyRes.ok) throw new Error('Failed to confirm upload');
    return notifyRes.json();
  },
  async deleteImage(id: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/images/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete image');
    return res.json();
  },
  async purchaseImageSlots(quantity: number) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/images/purchase-slots`, { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) throw new Error('Failed to purchase image slots');
    return res.json();
  }
};