# AWS Lambda Image Enhancement Deployment Guide

## System Instructions Implemented

The Lambda function enhances artisan product images with:
- **Contrast Boost**: +20% brightness to highlight craftsmanship
- **Color Enhancement**: +25% saturation to make colors pop
- **Detail Sharpening**: Applied sharpening filter to showcase texture
- **Web Optimization**: Compressed to 85% quality for fast loading
- **Output Format**: PNG for quality, easy integration

## Step 1: Prepare Lambda Package Locally

Open PowerShell and run:

```powershell
cd "d:\Kalaikatha AWS\aws-lambda"
npm install
```

This installs:
- `aws-sdk`: AWS service client
- `sharp`: High-performance image processing library

## Step 2: Create Lambda Execution Role

1. Open AWS Console → IAM
2. Click **Roles** → **Create role**
3. Select **AWS service** → **Lambda** → **Next**
4. Search for and attach these policies:
   - `AWSLambdaBasicExecutionRole` (for CloudWatch logs)
   - `AmazonS3FullAccess` (for S3 upload)
5. Name: `kalaikatha-lambda-image-role`
6. Create role and **copy the ARN** (looks like: `arn:aws:iam::123456789:role/kalaikatha-lambda-image-role`)

## Step 3: Create Lambda Function in AWS Console

1. Lambda → **Create function**
2. **Function name**: `kalaikatha-image-enhancement`
3. **Runtime**: Node.js 18.x (or latest)
4. **Execution role**: Select `kalaikatha-lambda-image-role` (created above)
5. Click **Create function**

## Step 4: Deploy Code to Lambda

### Option A: Using AWS Console (Simple)

1. In the Lambda console, go to **Code** tab
2. Delete existing code
3. Copy-paste all code from `image-enhancement-function.js` into the editor
4. Under **Layers**, click **Add a layer** → **Create a new layer**:
   - **Layer name**: `sharp-layer`
   - Upload a ZIP file with node_modules/sharp (see Option B if needed)
5. Click **Deploy**

### Option B: Using AWS CLI (Recommended)

From PowerShell in `d:\Kalaikatha AWS\aws-lambda`:

```powershell
# 1. Zip the function code
Compress-Archive -Path image-enhancement-function.js, package.json -DestinationPath function.zip -Force

# 2. Install dependencies locally (for packaging)
npm install

# 3. Create a layer with sharp (if on Windows, use WSL or download pre-built layer)
# For now, use inline code without layer - AWS Lambda has 250MB uncompressed limit

# 4. Deploy using AWS CLI
aws lambda create-function `
  --function-name kalaikatha-image-enhancement `
  --runtime nodejs18.x `
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/kalaikatha-lambda-image-role `
  --handler image-enhancement-function.handler `
  --zip-file fileb://function.zip `
  --timeout 60 `
  --memory-size 1024 `
  --region ap-south-1

# (Replace YOUR_ACCOUNT_ID with your AWS Account ID)
```

## Step 5: Configure Lambda Settings

In Lambda Console:

1. **General Configuration**:
   - **Memory**: 1024 MB (required for image processing)
   - **Timeout**: 60 seconds
   - **Ephemeral storage**: 512 MB (default)

2. **Environment Variables**:
   - Key: `STATUS`
   - Value: `production`

3. **CORS Configuration**:
   - Go to **Configuration** → **Function URLs** (if using public access)
   - Or set up API Gateway for more control

## Step 6: Create API Gateway (Recommended)

1. API Gateway → **Create API**
2. **HTTP API** → **Create**
3. **Integration type**: Lambda function
4. **Function name**: `kalaikatha-image-enhancement`
5. **CORS**: Enable (allow `http://localhost:*` for development)
6. **Deploy** → Copy the **Invoke URL** (looks like: `https://xxxxx.lambda-url.ap-south-1.on.aws/`)

## Step 7: Test the Lambda Function

In AWS Lambda Console:

1. Click **Test** tab
2. **Event name**: `test-enhancement`
3. **Event JSON**:
```json
{
  "body": "{\"imageUrl\": \"https://your-public-image-url.jpg\", \"bucket\": \"kalaikatha-artisan-uploads\"}"
}
```
4. Click **Test** → Should return success with enhanced image URL

## Step 8: Add Lambda Endpoint to .env.local

After API Gateway creates your endpoint, add to `.env.local`:

```env
VITE_AWS_LAMBDA_ENDPOINT=https://xxxxx.lambda-url.ap-south-1.on.aws/
```

Replace `xxxxx` with your actual API Gateway endpoint.

## Troubleshooting

### Sharp not found
- Ensure Lambda memory >= 1024 MB
- Check that sharp is in node_modules (run `npm install` in aws-lambda folder)

### Timeout error
- Function taking > 60 seconds: increase Lambda timeout
- Large images: Lambda has 512MB ephemeral storage limit

### CORS errors
- Ensure API Gateway CORS allows your development URLs
- Check S3 bucket CORS allows Lambda region

### S3 upload fails
- Verify Lambda role has `AmazonS3FullAccess` policy
- Verify bucket name in request matches actual bucket

## Next: Update App Code

Once endpoint is ready, update `AIStudio.tsx`:
```typescript
const handleEnhanceImage = async () => {
  const response = await fetch(import.meta.env.VITE_AWS_LAMBDA_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: previewUrl,
      bucket: import.meta.env.VITE_AWS_S3_BUCKET,
    }),
  });
  const { enhancedImageUrl } = await response.json();
  setEnhancedUrl(enhancedImageUrl);
};
```

## System Instructions Reference

The Lambda function applies these enhancements in order:

1. **Resize Normalization**: Max 1920x1920px to fit memory limits
2. **Brightness Boost**: 1.1x multiplier (10% increase)
3. **Saturation Increase**: 1.25x multiplier (25% increase)
4. **Sharpening Filter**: Sigma 2.0 for texture detail
5. **Web Optimization**: PNG format, 85% quality, progressive encoding
6. **Output**: Public S3 URL with enhanced image

All enhancements are designed for **handcrafted products** to:
- Highlight fine details and texture
- Make colors vibrant and appealing
- Maintain natural look (not oversaturated)
- Optimize for e-commerce product pages
