/**
 * AWS S3 Storage Service
 * Replaces Azure Blob Storage
 */

import { Amplify } from 'aws-amplify';

const S3_CONFIG = {
  Storage: {
    S3: {
      bucket: import.meta.env?.VITE_AWS_S3_BUCKET || '',
      region: import.meta.env?.VITE_AWS_S3_REGION || 'ap-south-1',
    }
  }
};

// Check if S3 is configured
export function isS3Configured(): boolean {
  return !!S3_CONFIG.Storage.S3.bucket;
}

if (isS3Configured()) {
  try {
    const currentConfig = Amplify.getConfig();
    Amplify.configure({
      ...currentConfig,
      Storage: S3_CONFIG.Storage
    });
    console.log('✅ AWS S3 initialized');
  } catch (error) {
    console.error('❌ S3 initialization failed:', error);
  }
} else {
  console.log('🔧 S3 not configured - using localStorage');
}

/**
 * Upload image to S3
 */
export async function uploadImage(
  file: File,
  folder: string = 'products',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Check if S3 configured
  if (!isS3Configured()) {
    console.log('⚠️ S3 not configured, using localStorage fallback');
    return uploadToLocalStorage(file);
  }

  try {
    const { uploadData, getUrl } = await import('aws-amplify/storage');
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${folder}/${timestamp}_${sanitizedName}`;

    // Upload to S3
    const uploadTask = uploadData({
      path: filename,
      data: file,
      options: {
        contentType: file.type,
        onProgress: (event) => {
          if (onProgress && event.totalBytes) {
            const progress = (event.transferredBytes / event.totalBytes) * 100;
            onProgress(progress);
          }
        },
      },
    });

    const result = await uploadTask.result;

    // Get public URL
    const urlResult = await getUrl({
      path: result.path,
      options: {
        expiresIn: 604800, // 7 days
      },
    });

    return urlResult.url.toString();
  } catch (error) {
    console.error('S3 upload failed:', error);
    console.log('⚠️ Falling back to localStorage');
    // Fallback to localStorage
    return uploadToLocalStorage(file);
  }
}

/**
 * Delete image from S3
 */
export async function deleteImage(path: string): Promise<void> {
  if (!isS3Configured()) {
    // Remove from localStorage
    const key = path.replace(/^kalaikatha_image_/, '');
    localStorage.removeItem(`kalaikatha_image_${key}`);
    return;
  }

  try {
    const { remove } = await import('aws-amplify/storage');
    await remove({ path });
    console.log('✅ Image deleted from S3');
  } catch (error) {
    console.error('S3 delete failed:', error);
  }
}

/**
 * List images from S3
 */
export async function listImages(folder: string = 'products'): Promise<any[]> {
  if (!isS3Configured()) {
    // Get from localStorage
    return getLocalStorageImages();
  }

  try {
    const { list } = await import('aws-amplify/storage');
    const result = await list({
      path: folder + '/',
    });
    
    return result.items || [];
  } catch (error) {
    console.error('S3 list failed:', error);
    return [];
  }
}

/**
 * Fallback: Upload to localStorage as base64
 */
function uploadToLocalStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check file size (max 5MB for localStorage)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('File too large for local storage (max 5MB)'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      const imageId = crypto.randomUUID();
      
      // Store in localStorage
      try {
        localStorage.setItem(`kalaikatha_image_${imageId}`, base64);
        
        // Store metadata
        const metadata = {
          id: imageId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: Date.now(),
        };
        
        const existingMetadata = JSON.parse(
          localStorage.getItem('kalaikatha_images_metadata') || '[]'
        );
        existingMetadata.push(metadata);
        localStorage.setItem(
          'kalaikatha_images_metadata',
          JSON.stringify(existingMetadata)
        );

        console.log('⚠️ Image stored in localStorage (S3 not configured)');
        resolve(base64);
      } catch (error) {
        reject(new Error('localStorage quota exceeded'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get images from localStorage
 */
function getLocalStorageImages(): any[] {
  try {
    const metadata = localStorage.getItem('kalaikatha_images_metadata');
    return metadata ? JSON.parse(metadata) : [];
  } catch {
    return [];
  }
}

/**
 * Compress image before upload (optimization)
 */
export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Return original if compression fails
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
