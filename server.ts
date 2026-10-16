import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// High payload limit to allow camera photos and video clips to be transferred
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

const DATA_DIR = path.resolve(process.cwd(), 'data');
const MEDIA_FILE = path.join(DATA_DIR, 'shared_media.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface SharedMedia {
  images: Record<string, string>;
  videos: Record<string, string>;
  logoUrl?: string | null;
}

function getSharedMedia(): SharedMedia {
  try {
    if (fs.existsSync(MEDIA_FILE)) {
      const content = fs.readFileSync(MEDIA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading shared media file:', err);
  }
  return { images: {}, videos: {}, logoUrl: null };
}

function saveSharedMedia(data: SharedMedia): void {
  try {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing shared media file:', err);
  }
}

// ================= API ROUTES =================

// Get all shared product images, videos and logo
app.get('/api/media', (_req, res) => {
  const data = getSharedMedia();
  res.json(data);
});

// Save or update brand logo
app.post('/api/media/logo', (req, res) => {
  const { logoUrl } = req.body;
  const data = getSharedMedia();
  data.logoUrl = logoUrl || null;
  saveSharedMedia(data);

  if (logoUrl && logoUrl.startsWith('data:image')) {
    try {
      const base64Data = logoUrl.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.resolve(process.cwd(), 'public/logo.png'), Buffer.from(base64Data, 'base64'));
    } catch (e) {
      console.error('Error writing public/logo.png:', e);
    }
  }

  res.json({ success: true, logoUrl: data.logoUrl });
});

// Remove brand logo
app.delete('/api/media/logo', (_req, res) => {
  const data = getSharedMedia();
  data.logoUrl = null;
  saveSharedMedia(data);
  res.json({ success: true });
});

// Save or update an image
app.post('/api/media/image', (req, res) => {
  const { key, imageUrl } = req.body;
  if (!key || !imageUrl) {
    return res.status(400).json({ error: 'Missing key or imageUrl' });
  }
  const data = getSharedMedia();
  data.images[key] = imageUrl;

  // If color-specific key like 'prodId__Cor', ensure base prodId is also set if missing
  const [productId] = key.split('__');
  if (productId && !data.images[productId]) {
    data.images[productId] = imageUrl;
  }

  saveSharedMedia(data);

  if (imageUrl && imageUrl.startsWith('data:image')) {
    try {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.resolve(process.cwd(), `public/products/${key}.jpg`), Buffer.from(base64Data, 'base64'));
    } catch (e) {
      console.error('Error writing public product image:', e);
    }
  }

  res.json({ success: true, key });
});

// Remove an image
app.delete('/api/media/image/:key', (req, res) => {
  const { key } = req.params;
  const data = getSharedMedia();
  delete data.images[key];
  saveSharedMedia(data);
  res.json({ success: true });
});

// Save or update a video (for Árvore Giratória or other products)
app.post('/api/media/video', (req, res) => {
  const { productId, videoUrl } = req.body;
  if (!productId || !videoUrl) {
    return res.status(400).json({ error: 'Missing productId or videoUrl' });
  }
  const data = getSharedMedia();
  data.videos[productId] = videoUrl;
  saveSharedMedia(data);
  res.json({ success: true, productId });
});

// Remove a video
app.delete('/api/media/video/:productId', (req, res) => {
  const { productId } = req.params;
  const data = getSharedMedia();
  delete data.videos[productId];
  saveSharedMedia(data);
  res.json({ success: true });
});

async function start() {
  // Serve public directory directly for fast asset delivery (.zip, .mp4, images)
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VHDESIGNER3d Server running at http://0.0.0.0:${port}`);
  });
}

start();
