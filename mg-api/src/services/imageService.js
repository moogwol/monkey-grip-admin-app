const sharp = require('sharp');
const { minioClient } = require('../config/minio');
const { generateFileName } = require('../middleware/upload');

class ImageService {
  async uploadProfileImage(fileBuffer, originalName, memberId) {
    const fileName = generateFileName(originalName);
    
    // Create different sizes
    const sizes = {
      thumbnail: { width: 150, height: 150, folder: 'thumbnails' },
      medium: { width: 400, height: 400, folder: 'member-images' },
      full: { width: 800, height: 800, folder: 'member-images' }
    };
    
    const uploadedFiles = {};
    
    for (const [sizeName, config] of Object.entries(sizes)) {
      // Process image
      const processedBuffer = await sharp(fileBuffer)
        .resize(config.width, config.height, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // Generate filename for this size
      const sizeFileName = sizeName === 'full' 
        ? fileName 
        : `${sizeName}_${fileName}`;
      
      // Upload to MinIO
      await minioClient.putObject(
        config.folder,
        sizeFileName,
        processedBuffer,
        processedBuffer.length,
        {
          'Content-Type': 'image/jpeg',
          'X-Member-ID': memberId.toString()
        }
      );
      
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
      await minioClient.removeObject(bucket, filename);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
  
  generatePublicUrl(bucket, filename) {
    // Return API proxy URL instead of direct MinIO URL for production-ready setup
    const apiBaseUrl = process.env.API_BASE_URL || '';
    return `${apiBaseUrl}/api/images/serve/${bucket}/${filename}`;
  }
}

module.exports = new ImageService();