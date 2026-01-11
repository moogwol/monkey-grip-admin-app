const sharp = require('sharp');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { generateFileName } = require('../middleware/upload');

class ImageService {
  constructor() {
    this.basePath = process.env.IMAGE_STORAGE_PATH || '/data/images';
  }

  async ensureDirs() {
    const dirs = [
      path.join(this.basePath, 'member-images'),
      path.join(this.basePath, 'thumbnails')
    ];

    for (const d of dirs) {
      await fs.mkdir(d, { recursive: true }).catch(() => {});
    }
  }

  async uploadProfileImage(fileBuffer, originalName, memberId) {
    await this.ensureDirs();

    const fileName = generateFileName(originalName);

    const sizes = {
      thumbnail: { width: 150, height: 150, folder: 'thumbnails' },
      medium: { width: 400, height: 400, folder: 'member-images' },
      full: { width: 800, height: 800, folder: 'member-images' }
    };

    const uploadedFiles = {};

    for (const [sizeName, config] of Object.entries(sizes)) {
      const processedBuffer = await sharp(fileBuffer)
        .resize(config.width, config.height, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85 })
        .toBuffer();

      const sizeFileName = sizeName === 'full' ? fileName : `${sizeName}_${fileName}`;
      const outDir = path.join(this.basePath, config.folder);
      const outPath = path.join(outDir, sizeFileName);
      const tmpPath = outPath + '.tmp';

      // Write atomically: write tmp then rename
      await fs.writeFile(tmpPath, processedBuffer);
      // Ensure the file is flushed to disk before rename on platforms that support it
      try {
        const fd = fsSync.openSync(tmpPath, 'r');
        fsSync.fsyncSync(fd);
        fsSync.closeSync(fd);
      } catch (e) {
        // ignore if fsync not available
      }
      await fs.rename(tmpPath, outPath);

      uploadedFiles[sizeName] = {
        bucket: config.folder,
        filename: sizeFileName,
        size: processedBuffer.length
      };
    }

    return uploadedFiles;
  }

  async deleteProfileImage(bucket, filename) {
    try {
      const p = path.join(this.basePath, bucket, filename);
      await fs.unlink(p).catch(() => {});
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  generatePublicUrl(bucket, filename) {
    const apiBaseUrl = process.env.API_BASE_URL || '';
    return `${apiBaseUrl}/api/images/serve/${bucket}/${filename}`;
  }
}

module.exports = new ImageService();