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
    
    // 1. Check image limit before upload (GET)
    const checkRes = await fetch(`${API_BASE_URL}/images/check-limit`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    if (!checkRes.ok) throw new Error('Upload limit check failed');
    const check = await checkRes.json();
    if (check && check.canUpload === false) throw new Error('Upload limit reached');

    // 2. Get signed upload params from backend
    const res = await fetch(`${API_BASE_URL}/images/upload-url`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ filename: file.name, type: file.type }),
    });
    if (!res.ok) throw new Error('Failed to get upload URL');
    const { signature, timestamp, api_key, cloud_name, public_id } = await res.json();
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

    // 3. Upload to Cloudinary using form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('public_id', public_id);
    // Do not include upload_preset for signed uploads

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const uploadResult = await uploadRes.json();
    if (!uploadRes.ok) throw new Error('Upload to Cloudinary failed');

    // 4. Notify backend of success (will increment image count)
    const notifyRes = await fetch(`${API_BASE_URL}/images/confirm-upload`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        public_id: uploadResult.public_id,
        version: uploadResult.version,
        signature: uploadResult.signature
      }),
    });
    if (!notifyRes.ok) throw new Error('Failed to confirm upload');
    return notifyRes.json();
  },
  async deleteImage(id: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/images/${id}`, { 
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