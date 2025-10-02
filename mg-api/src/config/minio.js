const Minio = require('minio');

// Initialize MinIO client
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

// Ensure buckets exist on startup
const ensureBuckets = async () => {
  const buckets = ['member-images', 'documents', 'thumbnails'];
  
  try {
    for (const bucket of buckets) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket);
        console.log(`✅ Created bucket: ${bucket}`);
      } else {
        console.log(`📁 Bucket exists: ${bucket}`);
      }
    }
  } catch (error) {
    console.error('❌ Error creating buckets:', error);
  }
};

module.exports = { minioClient, ensureBuckets };