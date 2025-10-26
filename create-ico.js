import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

async function createIco() {
  console.log('Converting PNGs to ICO format...');
  
  try {
    // Create favicon.ico from multiple PNG sizes (16, 32, 48)
    const ico = await pngToIco([
      path.join(publicPath, 'favicon-16x16.png'),
      path.join(publicPath, 'favicon-32x32.png'),
      path.join(publicPath, 'favicon-48x48.png')
    ]);
    
    fs.writeFileSync(path.join(publicPath, 'favicon.ico'), ico);
    console.log('✓ Created favicon.ico with multiple resolutions (16x16, 32x32, 48x48)');
    console.log('\nFavicon created successfully!');
  } catch (error) {
    console.error('✗ Failed to create favicon.ico:', error.message);
  }
}

createIco().catch(console.error);

