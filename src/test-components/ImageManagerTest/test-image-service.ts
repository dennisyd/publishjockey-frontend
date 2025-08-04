const mockImages = [
  {
    id: '1',
    filename: 'cover-image.jpg',
    size: 2.4, // MB
    uploadDate: '2024-01-15',
    url: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: '2',
    filename: 'chapter1.png',
    size: 1.1,
    uploadDate: '2024-01-16',
    url: 'https://picsum.photos/300/200?random=2'
  }
];

let images = [...mockImages];
let storage = { used: 3.5, total: 50 };

export const mockImageService = {
  uploadImage: async (file: { name: string; size?: number }) => {
    // Simulate file size if not provided (for test buttons)
    const fileSize = file.size ?? +(Math.random() * 3 + 0.5).toFixed(1); // MB
    // Check if adding this file would exceed storage
    if (storage.used + fileSize > storage.total) {
      throw new Error("Storage limit exceeded");
    }
    await new Promise((res) => setTimeout(res, 800));
    const newImage = {
      id: String(Date.now()),
      filename: file.name,
      size: fileSize,
      uploadDate: new Date().toISOString().slice(0, 10),
      url: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`
    };
    images.push(newImage);
    storage.used += newImage.size;
    return newImage;
  },
  getUserImages: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return images;
  },
  deleteImage: async (id) => {
    await new Promise((res) => setTimeout(res, 400));
    const img = images.find((img) => img.id === id);
    if (img) storage.used -= img.size;
    images = images.filter((img) => img.id !== id);
    return true;
  },
  getStorageStats: async () => {
    await new Promise((res) => setTimeout(res, 200));
    return { ...storage, percentage: Math.round((storage.used / storage.total) * 100) };
  },
  reset: () => {
    images = [...mockImages];
    storage = { used: 3.5, total: 50 };
  },
  increaseTotalStorage: (amount: number) => {
    storage.total += amount;
  }
};