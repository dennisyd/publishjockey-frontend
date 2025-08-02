export const realImageService = {
  async getUserImages() {
    const res = await fetch('/api/images');
    if (!res.ok) throw new Error('Failed to fetch images');
    return res.json();
  },
  async getStorageStats() {
    const res = await fetch('/api/storage');
    if (!res.ok) throw new Error('Failed to fetch storage stats');
    return res.json();
  },
  async uploadImage(file: File) {
    // 1. Get signed upload params from backend
    const res = await fetch('/api/images/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, type: file.type, size: file.size / (1024 * 1024) }),
    });
    if (!res.ok) throw new Error('Failed to get upload URL');
    const { uploadUrl, publicId, timestamp, signature, apiKey, folder } = await res.json();

    // 2. Upload to Cloudinary using form data
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

    // 3. Notify backend of success
    const notifyRes = await fetch('/api/images/confirm-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicId,
        filename: file.name,
        size: file.size / (1024 * 1024), // bytes to MB
        url: uploadResult.secure_url,
      }),
    });
    if (!notifyRes.ok) throw new Error('Failed to confirm upload');
    return notifyRes.json();
  },
  async deleteImage(id: string) {
    const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete image');
    return res.json();
  },
  async increaseStorage() {
    const res = await fetch('/api/storage/upgrade', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to upgrade storage');
    return res.json();
  }
};