// Vercel Serverless Function to delete images from Cloudinary
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'public_id is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        result,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to delete image from Cloudinary',
        result,
      });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
