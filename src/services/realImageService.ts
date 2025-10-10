import { ENV } from '../config/env';
import { http } from './http';
const API_BASE_URL = ENV.API_URL;

export const realImageService = {
  async getUserImages() {
    const res = await http.get(`${API_BASE_URL}/images`);
    return res.data;
  },
  async getImageUsageStats() {
    const res = await http.get(`${API_BASE_URL}/images/usage`);
    return res.data;
  },
  async validateExport() {
    const res = await http.post(`${API_BASE_URL}/images/validate-export`);
    return res.data;
  },
  async uploadImage(file: File) {
    // 1. Check image limit before upload (GET)
    const checkRes = await http.get(`${API_BASE_URL}/images/check-limit`);
    const check = checkRes.data;
    if (check && check.canUpload === false) throw new Error('Upload limit reached');

    // 2. Get signed upload params from backend
    const res = await http.post(`${API_BASE_URL}/images/upload-url`, {
      filename: file.name, 
      type: file.type 
    });
    const { signature, timestamp, api_key, cloud_name, public_id } = res.data;
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
    const notifyRes = await http.post(`${API_BASE_URL}/images/confirm-upload`, {
      public_id: uploadResult.public_id,
      version: uploadResult.version,
      signature: uploadResult.signature
    });
    return notifyRes.data;
  },
  async deleteImage(id: string) {
    const res = await http.delete(`${API_BASE_URL}/images/${id}`);
    return res.data;
  },
  async purchaseImageSlots(quantity: number) {
    // Use the same Stripe checkout flow as the main pricing page
    const planId = 'images_addon_100'; // This matches the backend configuration
    const res = await http.post('/stripe/create-checkout-session', {
      planId,
      successUrl: `${window.location.origin}/dashboard?success=true&addon=images`,
      cancelUrl: `${window.location.origin}/dashboard?canceled=true`
    });
    return res.data;
  }
};