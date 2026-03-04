/**
 * AWS Lambda Function for Image Enhancement
 * 
 * System Instructions:
 * - Enhance artisan product images to highlight craftsmanship details
 * - Increase contrast and saturation to make colors pop
 * - Sharpen details to showcase texture and quality
 * - Maintain natural appearance while improving visual appeal
 * - Output optimized for e-commerce product listings
 */

const AWS = require('aws-sdk');
const Sharp = require('sharp');
const https = require('https');

const s3 = new AWS.S3();

const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = Buffer.alloc(0);
      response.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const enhanceImage = async (imageBuffer) => {
  try {
    const enhanced = await Sharp(imageBuffer)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .modulate({
        brightness: 1.1,
      })
      .modulate({
        saturation: 1.25,
      })
      .sharpen({
        sigma: 2.0,
      })
      .png({
        quality: 85,
        progressive: true,
      })
      .toBuffer();

    return enhanced;
  } catch (error) {
    console.error('Image enhancement error:', error);
    throw error;
  }
};

const uploadToS3 = async (bucket, key, imageBuffer) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/png',
    ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event));

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { imageUrl, bucket } = body;

    if (!imageUrl) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'imageUrl is required',
        }),
      };
    }

    console.log('Processing image:', imageUrl);

    const imageBuffer = await downloadImage(imageUrl);
    console.log('Image downloaded, size:', imageBuffer.length, 'bytes');

    const enhancedBuffer = await enhanceImage(imageBuffer);
    console.log('Image enhanced, new size:', enhancedBuffer.length, 'bytes');

    const timestamp = Date.now();
    const s3Key = `enhanced-products/enhanced-${timestamp}.png`;
    const s3Url = await uploadToS3(bucket, s3Key, enhancedBuffer);

    console.log('Enhanced image uploaded to S3:', s3Url);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        enhancedImageUrl: s3Url,
        originalSize: imageBuffer.length,
        enhancedSize: enhancedBuffer.length,
        processingMethod: 'AWS Lambda + Sharp Library',
        enhancements: [
          'Brightness increased by 10%',
          'Saturation increased by 25%',
          'Sharpening applied (sigma: 2.0)',
          'Optimized for web (quality: 85%)',
        ],
      }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
