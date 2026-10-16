// Utility to safely compress and store product images in IndexedDB + LocalStorage

const DB_NAME = 'vhdesigner3d_store';
const STORE_NAME = 'product_images';
const STORE_NAME_VIDEOS = 'product_videos';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(STORE_NAME_VIDEOS)) {
        db.createObjectStore(STORE_NAME_VIDEOS);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProductImageToDB(productId: string, dataUrl: string): Promise<void> {
  // 1. Always save in IndexedDB first (no 5MB storage limit)
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, productId);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }

  // 2. Save in localStorage as well (safely catching QuotaExceededError)
  try {
    const current = JSON.parse(localStorage.getItem('vhdesigner3d_product_images') || '{}');
    current[productId] = dataUrl;
    localStorage.setItem('vhdesigner3d_product_images', JSON.stringify(current));
  } catch (err) {
    console.warn('LocalStorage quota limit reached (safely stored in IndexedDB):', err);
  }
}

export async function removeProductImageFromDB(productId: string): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(productId);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB delete error:', err);
  }

  try {
    const current = JSON.parse(localStorage.getItem('vhdesigner3d_product_images') || '{}');
    delete current[productId];
    localStorage.setItem('vhdesigner3d_product_images', JSON.stringify(current));
  } catch (err) {
    console.warn('LocalStorage remove error:', err);
  }
}

export async function loadAllProductImagesFromDB(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  // 1. First get from localStorage for instant synchronous-like render
  try {
    const local = localStorage.getItem('vhdesigner3d_product_images');
    if (local) {
      Object.assign(result, JSON.parse(local));
    }
  } catch (e) {
    // ignore
  }

  // 2. Fetch all from IndexedDB (source of truth for large images)
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const cursorReq = store.openCursor();

    await new Promise<void>((resolve) => {
      cursorReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          result[cursor.key as string] = cursor.value as string;
          cursor.continue();
        } else {
          resolve();
        }
      };
      cursorReq.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
  }

  return result;
}

export async function saveProductVideoToDB(productId: string, videoUrlOrData: string): Promise<void> {
  // 1. Save in IndexedDB (ideal for video blobs & large data URLs)
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME_VIDEOS, 'readwrite');
    const store = tx.objectStore(STORE_NAME_VIDEOS);
    store.put(videoUrlOrData, productId);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB video write error:', err);
  }

  // 2. Also keep in localStorage if small / a link URL
  try {
    if (videoUrlOrData.length < 500000) {
      const current = JSON.parse(localStorage.getItem('vhdesigner3d_product_videos') || '{}');
      current[productId] = videoUrlOrData;
      localStorage.setItem('vhdesigner3d_product_videos', JSON.stringify(current));
    }
  } catch {
    // ignore
  }
}

export async function removeProductVideoFromDB(productId: string): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME_VIDEOS, 'readwrite');
    const store = tx.objectStore(STORE_NAME_VIDEOS);
    store.delete(productId);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB video delete error:', err);
  }

  try {
    const current = JSON.parse(localStorage.getItem('vhdesigner3d_product_videos') || '{}');
    delete current[productId];
    localStorage.setItem('vhdesigner3d_product_videos', JSON.stringify(current));
  } catch {
    // ignore
  }
}

export async function loadAllProductVideosFromDB(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  try {
    const local = localStorage.getItem('vhdesigner3d_product_videos');
    if (local) {
      Object.assign(result, JSON.parse(local));
    }
  } catch {
    // ignore
  }

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME_VIDEOS, 'readonly');
    const store = tx.objectStore(STORE_NAME_VIDEOS);
    const cursorReq = store.openCursor();

    await new Promise<void>((resolve) => {
      cursorReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          result[cursor.key as string] = cursor.value as string;
          cursor.continue();
        } else {
          resolve();
        }
      };
      cursorReq.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('IndexedDB video read error:', err);
  }

  return result;
}

/**
 * Compresses an image file (e.g. from smartphone camera 5MB-15MB) down to ~60KB-120KB
 * ensuring it loads instantly and fits comfortably in both LocalStorage & IndexedDB.
 */
export function compressImageFile(file: File, maxWidth = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Falha ao ler o arquivo'));
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(dataUrl); // fallback to raw dataUrl if decoding fails
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Fill background with subtle dark green/black if JPEG conversion removes alpha
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          ctx.fillStyle = '#061b14';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for optimal photo compression ratio
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
