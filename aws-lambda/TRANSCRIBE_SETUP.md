# AWS Transcribe Lambda Function Setup

## Overview
This Lambda function enables real AWS Transcribe speech-to-text functionality for the Kalaikatha voice recording feature.

## Prerequisites
- AWS Lambda function deployed
- API Gateway endpoint set up
- S3 bucket with Transcribe permissions
- Cognito role with Transcribe + S3 access

## Deployment Steps

### 1. Package Lambda Function
```bash
cd aws-lambda
npm install
zip -r lambda-deployment.zip . -x "node_modules/*"
```

### 2. Create/Update Lambda Function in AWS Console
1. Go to **AWS Lambda** → **Create function**
2. Choose **Node.js 18.x** or later
3. Upload the `lambda-deployment.zip` file
4. Set **Handler** to: `index.handler`
5. Configure **Timeout** to 5+ minutes
6. Set **Memory** to 512 MB minimum

### 3. Set Environment Variables in Lambda
In the Lambda console → **Configuration** → **Environment variables**, add:
```
S3_BUCKET = kalaikatha-artisan-uploads
```

### 4. Add IAM Role Permissions
The Lambda execution role needs these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::kalaikatha-artisan-uploads",
        "arn:aws:s3:::kalaikatha-artisan-uploads/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "transcribe:StartTranscriptionJob",
        "transcribe:GetTranscriptionJob"
      ],
      "Resource": "*"
    }
  ]
}
```

### 5. Create API Gateway Endpoint (Optional but Recommended)
1. Go to **API Gateway** → **Create API**
2. Choose **HTTP API**
3. **Integrations**: Select your Lambda function
4. Deploy to get an endpoint like:
   ```
   https://xxxxxxx.lambda-url.ap-south-1.amazonaws.com/
   ```

## Frontend Configuration

### 1. Add Environment Variable in `.env.local`
```env
VITE_LAMBDA_ENDPOINT=https://your-lambda-endpoint/
```

### 2. How It Works
1. User records audio in the browser
2. Audio blob is converted to Base64
3. Sent to Lambda function via POST request
4. Lambda:
   - Uploads audio to S3
   - Starts AWS Transcribe job
   - Polls for results (5-minute timeout)
   - Returns transcribed text
5. Frontend displays the transcription

## Function Signatures

### Lambda Request
```json
{
  "action": "transcribe",
  "audioBase64": "base64-encoded-audio-data",
  "fileType": "audio/webm",
  "language": "en"
}
```

### Lambda Response (Success)
```json
{
  "statusCode": 200,
  "body": "{\"success\": true, \"transcript\": \"...\", \"jobName\": \"...\"}"
}
```

### Lambda Response (Error)
```json
{
  "statusCode": 500,
  "body": "{\"error\": \"Error message\"}"
}
```

## Fallback Behavior
If the Lambda endpoint is not configured or Transcribe fails, the app automatically falls back to mock transcriptions with realistic demo text.

## Testing
1. Start the app: `npm run dev`
2. Navigate to "Tell Your Story" in Artisan Dashboard
3. Record audio and tap "Save & Transcribe"
4. Should show real AWS Transcribe results (or mock if Lambda not configured)

## Supported Languages
- **English (en)** → en-IN
- **Hindi (hi)** → hi-IN  
- **Tamil (ta)** → ta-IN

## Troubleshooting

### Lambda Returns 404
- Verify Lambda endpoint URL in `.env.local`
- Check API Gateway CORS settings

### Transcribe Job Fails
- Verify IAM role has Transcribe permissions
- Check S3 bucket permissions
- Ensure audio file format is supported (webm, wav, mp3, mp4)

### Timeout Error
- Increase Lambda timeout in AWS Console
- AWS Transcribe can take 5-30 seconds depending on audio length

## Costs
- **AWS Transcribe**: $0.0001 per second of audio
- **S3 Storage**: ~$0.023 per GB/month
- **Lambda**: First 1M requests free, then $0.20 per 1M requests

## Future Enhancements
- Add real-time streaming transcription with WebSocket
- Support additional languages
- Add speaker identification
- Enhancement options (punctuation, profanity filter)
