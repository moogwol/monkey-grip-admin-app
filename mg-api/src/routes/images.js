const express = require('express');
const router = express.Router();
const {upload} = require('../middleware/upload');
const imageService = require('../services/imageService');
const Member = require('../models/Contact');
const path = require('path');
const fs = require('fs');

// Simple test route
router.get('/test', (req, res) => {
    res.json({ message: 'Images router is working!' });
});

router.post('/members/:memberId/profile-image',
    upload.single('profileImage'),
    async (req, res) => {
        try {
            const { memberId } = req.params;
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Upload and process image
            const uploadedFile = await imageService.uploadProfileImage(
                file.buffer,
                file.originalname,
                memberId
            );

            // Generate public URL and update member record in the db
            const imageUrl = imageService.generatePublicUrl(
                uploadedFile.medium.bucket,
                uploadedFile.medium.filename
            );

            await Member.updateProfile(memberId, { avatar_url: imageUrl });

            res.json({
                success: true,
                file: uploadedFile,
                profileImageUrl: imageUrl
            });

        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({
                success: false,
                message: 'Image upload failed'
            });
        }
    }
);


// Serve images through API (proxy)
router.get('/serve/:bucket/:filename', async (req, res) => {
    try {
        const { bucket, filename } = req.params;

        const basePath = process.env.IMAGE_STORAGE_PATH || '/data/images';
        const filePath = path.join(basePath, bucket, filename);

        // Prevent path traversal
        const resolved = path.resolve(filePath);
        if (!resolved.startsWith(path.resolve(basePath))) {
            console.error('❌ Invalid file path attempt:', filePath);
            return res.status(400).json({ error: 'Invalid file path' });
        }

        if (!fs.existsSync(resolved)) {
            console.error('❌ File not found:', resolved);
            return res.status(404).json({ error: 'Image not found' });
        }

        // Set appropriate headers
        res.set({
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400' // 24 hours
        });

        const stream = fs.createReadStream(resolved);
        stream.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(404).end();
        });
        stream.pipe(res);

    } catch (error) {
        console.error('❌ Serve image error:', error);
        res.status(404).json({ error: 'Image not found' });
    }
});

module.exports = router;
