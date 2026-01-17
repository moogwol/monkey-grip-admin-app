// MinIO removed: project uses file-based image storage under IMAGE_STORAGE_PATH.
// This placeholder avoids stale imports; do not use in new code.
const ensureBuckets = async () => {
  console.warn('MinIO is removed. File-based storage is in use.');
};

module.exports = { ensureBuckets };