/**
 * SimplifiedPhotoUpload - Camera-first photo upload for illiterate users
 * 
 * Design principles:
 * - No text input required
 * - Large camera button (take photo now)
 * - Instant preview with accept/reject
 * - Auto-compression for 2G networks
 * - Visual progress (no percentages)
 * - Voice feedback at each step
 * - Works offline (queues uploads)
 */

import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, X, Upload, ArrowLeft, Loader } from 'lucide-react';
import { useState, useRef } from 'react';
import { useFileUpload, useTextToSpeech, useDeviceCapability } from '../../hooks/useArtisanFeatures';

interface SimplifiedPhotoUploadProps {
  onBack: () => void;
  onUploadComplete?: (url: string) => void;
}

export function SimplifiedPhotoUpload({ onBack, onUploadComplete }: SimplifiedPhotoUploadProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { upload, uploading, progress, uploadedUrl, error } = useFileUpload();
  const { speak } = useTextToSpeech();
  const capability = useDeviceCapability();

  // Open camera directly
  const handleCameraClick = () => {
    speak('Opening camera');
    cameraInputRef.current?.click();
  };

  // Open gallery
  const handleGalleryClick = () => {
    speak('Opening gallery');
    fileInputRef.current?.click();
  };

  // Handle photo capture/selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      speak('Please select a photo');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
      setSelectedFile(file);
      speak('Photo captured. Do you want to upload this?');
    };
    reader.readAsDataURL(file);
  };

  // Accept and upload
  const handleAccept = async () => {
    if (!selectedFile) return;

    speak('Uploading your photo');
    
    const url = await upload(selectedFile);
    
    if (url) {
      speak('Upload complete! Your photo is safe.');
      onUploadComplete?.(url);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCapturedImage(null);
        setSelectedFile(null);
      }, 2000);
    } else {
      speak('Upload failed. Please try again.');
    }
  };

  // Reject and retake
  const handleReject = () => {
    speak('Photo deleted. Take another one.');
    setCapturedImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => {
              speak('Going back');
              onBack();
            }}
            className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="text-4xl">📸</div>
        </motion.div>

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileChange(e, 'camera')}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'gallery')}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!capturedImage && !uploading ? (
            // Initial state - Take photo
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Data Saver Warning */}
              {capability.shouldCompressUploads && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 rounded-3xl p-6 flex items-start gap-4"
                >
                  <span className="text-5xl">⚡</span>
                  <div>
                    <p className="text-amber-900 dark:text-amber-300 font-bold text-lg mb-1">
                      Data Saver Mode
                    </p>
                    <p className="text-amber-800 dark:text-amber-400">
                      Photos will be compressed to save data and upload faster on slow networks
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Large camera button */}
              <motion.button
                onClick={handleCameraClick}
                whileTap={{ scale: 0.95 }}
                className="w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-6 relative overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 bg-white/20"
                />

                <Camera className="w-32 h-32 text-white relative z-10" />
                <div className="relative z-10 space-y-2">
                  <p className="text-white text-3xl font-bold">Take Photo</p>
                  <p className="text-white/80 text-xl">Tap to open camera</p>
                </div>
              </motion.button>

              {/* Gallery option (smaller) */}
              <motion.button
                onClick={handleGalleryClick}
                whileTap={{ scale: 0.95 }}
                className="w-full py-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center gap-4"
              >
                <Upload className="w-8 h-8 text-indigo-600" />
                <span className="text-gray-900 dark:text-white text-xl font-medium">
                  Choose from Gallery
                </span>
              </motion.button>

              {/* Offline queue indicator */}
              {!navigator.onLine && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600 rounded-2xl p-4 flex items-center gap-3"
                >
                  <span className="text-3xl">📡</span>
                  <p className="text-blue-900 dark:text-blue-300 text-sm">
                    No internet. Photos will upload when you're back online.
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : uploading ? (
            // Uploading state
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              {/* Preview */}
              {capturedImage && (
                <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={capturedImage}
                    alt="Uploading"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Progress visualization */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Loader className="w-16 h-16 text-indigo-600 animate-spin" />
                </motion.div>

                {/* Visual progress bar (no numbers) */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  />
                </div>

                <p className="text-center text-gray-600 dark:text-gray-400 text-xl">
                  Uploading your photo...
                </p>

                {/* Speed indicator (visual only) */}
                {capability.connectionType === '2g' && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🐌</span>
                    <p className="text-amber-700 dark:text-amber-400">
                      Slow network detected - this may take a while
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : capturedImage && !uploadedUrl ? (
            // Preview - Accept or Reject
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Photo preview */}
              <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={capturedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Accept/Reject buttons */}
              <div className="grid grid-cols-2 gap-6">
                {/* Reject (Red) */}
                <motion.button
                  onClick={handleReject}
                  whileTap={{ scale: 0.9 }}
                  className="aspect-square bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4"
                >
                  <X className="w-20 h-20 text-white" />
                  <p className="text-white text-2xl font-bold">Delete</p>
                </motion.button>

                {/* Accept (Green) */}
                <motion.button
                  onClick={handleAccept}
                  whileTap={{ scale: 0.9 }}
                  className="aspect-square bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4"
                >
                  <Check className="w-20 h-20 text-white" />
                  <p className="text-white text-2xl font-bold">Upload</p>
                </motion.button>
              </div>
            </motion.div>
          ) : uploadedUrl ? (
            // Success state
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Check className="w-16 h-16 text-white" />
              </motion.div>

              <p className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                Upload Complete!
              </p>

              <p className="text-xl text-gray-600 dark:text-gray-400 text-center">
                Your photo is safe ✓
              </p>

              {/* Confetti animation */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 rounded-2xl p-6 flex items-start gap-4"
          >
            <span className="text-4xl">⚠️</span>
            <div>
              <p className="text-red-900 dark:text-red-300 font-bold text-lg mb-1">
                Upload Failed
              </p>
              <p className="text-red-800 dark:text-red-400">
                {error}
              </p>
              <button
                onClick={handleAccept}
                className="mt-3 px-6 py-3 bg-red-600 text-white rounded-xl font-medium"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
