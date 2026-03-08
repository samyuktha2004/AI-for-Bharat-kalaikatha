/**
 * VoiceProductStory - Voice recording for product stories
 * 
 * Features:
 * - Record artisan speaking about their product
 * - Auto-transcribe using Speech-to-Text
 * - Store in vault for protection
 * - Generate marketing content from story
 * - Illiterate-friendly (no typing needed)
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { X, Mic, StopCircle, Save, Sparkles, Lock, Play, Pause, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { transcribeAudioFile } from '../../services/AWSTranscribeService';
// Uses AWS Transcribe for professional speech-to-text

interface VoiceProductStoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault: (story: ProductStory) => void;
  onGenerateMarketing?: (story: ProductStory) => void;
}

export interface ProductStory {
  id: string;
  audioBlob?: Blob;
  transcription: string;
  language: string;
  duration: number;
  recordedAt: Date;
  productName?: string;
}

export function VoiceProductStory({ isOpen, onClose, onSaveToVault, onGenerateMarketing }: VoiceProductStoryProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(''); // "uploading", "transcribing", "complete"
  const [transcriptionError, setTranscriptionError] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  /**
   * Start recording audio
   */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Auto-transcribe
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started! Speak naturally about your product.');
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast.error('Cannot access microphone. Please grant permission.');
    }
  }

  /**
   * Stop recording
   */
  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast.info('Processing your story...');
    }
  }

  /**
   * Transcribe audio using AWS Transcribe
   */
  async function transcribeAudio(blob: Blob) {
    setIsProcessing(true);
    setTranscriptionError('');
    setProcessingStep('uploading');

    try {
      console.log('🎤 Starting AWS Transcribe job...');
      toast.info('Transcribing your story with AWS Transcribe...');
      
      // Call real AWS Transcribe service
      setProcessingStep('transcribing');
      const text = await transcribeAudioFile(blob, 'ta'); // Tamil by default
      
      if (text && text.trim()) {
        setTranscription(text);
        setProcessingStep('complete');
        toast.success('🎯 Story transcribed successfully!');
        console.log('✅ Transcription result:', text.substring(0, 100) + '...');
      } else {
        throw new Error('No transcription returned');
      }
    } catch (error: any) {
      console.error('❌ AWS Transcribe error:', error);
      setTranscriptionError(error.message || 'Transcription failed');
      toast.error(`Transcription failed: ${error.message}`);
      
      // Fallback to mock for demo
      console.log('📝 Falling back to mock transcription...');
      const mockTranscription = generateMockTranscription();
      setTranscription(mockTranscription);
      setProcessingStep('fallback');
      toast.info('Using demo transcription (AWS Transcribe unavailable)');
    } finally {
      setIsProcessing(false);
    }
  }

  /**
   * Mock transcription fallback (when AWS Transcribe unavailable)
   */
  function generateMockTranscription(): string {
    return `[Demo Mode - Real AWS Transcribe Unavailable]\n\nஇந்த நடராஜர் சிலை எங்கள் குடும்பத்தின் 9 தலைமுறை பாரம்பரியம். இழந்த மெழுகு வார்ப்பு முறையில் செய்யப்பட்டது. சிறப்பு பஞ்சலோக உலோகக் கலவையுடன் கூடியது. ஒவ்வொரு விவரமும் கையால் செதுக்கப்பட்டது. இது 2 மாதங்கள் உழைப்பின் பலன்.\n\nThis Nataraja statue is our family's 9-generation legacy. Made using lost-wax casting method. With special panchaloha metal alloy. Every detail hand-carved. This is the result of 2 months of labor.\n\n⚠️ Note: Enable AWS Transcribe in your AWS console for live transcription.`;
  }

  /**
   * Play recorded audio
   */
  function playAudio() {
    if (audioBlob && !audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.play();
      setIsPlaying(true);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }

  /**
   * Save to vault
   */
  function handleSaveToVault() {
    if (!transcription) {
      toast.error('Please record your story first!');
      return;
    }

    const story: ProductStory = {
      id: `story-${Date.now()}`,
      audioBlob: audioBlob || undefined,
      transcription,
      language: 'ta', // Tamil
      duration: recordingTime,
      recordedAt: new Date(),
    };

    onSaveToVault(story);
    toast.success('✅ Story saved to vault and ready for marketing!');
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    // Auto-close after save
    setTimeout(() => {
      onClose();
      resetState();
    }, 1500);
  }

  /**
   * Generate marketing from story
   */
  function handleGenerateMarketing() {
    if (!transcription) {
      toast.error('Please record your story first!');
      return;
    }

    const story: ProductStory = {
      id: `story-${Date.now()}`,
      audioBlob: audioBlob || undefined,
      transcription,
      language: 'ta',
      duration: recordingTime,
      recordedAt: new Date(),
    };

    if (onGenerateMarketing) {
      onGenerateMarketing(story);
      toast.success('🚀 Generating marketing content from your story...');
      onClose();
      resetState();
    }
  }

  /**
   * Reset state
   */
  function resetState() {
    setIsRecording(false);
    setIsProcessing(false);
    setRecordingTime(0);
    setAudioBlob(null);
    setTranscription('');
    setIsPlaying(false);
    audioChunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }

  /**
   * Format time
   */
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Tell Your Story</h2>
                    <p className="text-white/90 text-sm">Voice recording for vault & marketing</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Instructions */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-700 rounded-2xl p-4 mb-6">
                <h3 className="font-bold text-orange-900 dark:text-orange-300 mb-2">📣 How to use:</h3>
                <ol className="text-sm text-orange-800 dark:text-orange-400 space-y-1 list-decimal list-inside">
                  <li>Tap the mic button to start recording</li>
                  <li>Speak naturally about your product (history, technique, materials)</li>
                  <li>Tap stop when done</li>
                  <li>Review the transcription</li>
                  <li>Save to vault OR generate marketing content</li>
                </ol>
              </div>

              {/* Recording Section */}
              <div className="mb-6">
                {!audioBlob ? (
                  <div className="flex flex-col items-center gap-6">
                    {/* Recording Button */}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                          : 'bg-gradient-to-br from-orange-500 to-red-500 hover:scale-105'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isRecording ? (
                        <StopCircle className="w-16 h-16 text-white" />
                      ) : (
                        <Mic className="w-16 h-16 text-white" />
                      )}
                    </button>

                    {/* Timer */}
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {formatTime(recordingTime)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Recording...</p>
                      </motion.div>
                    )}

                    {!isRecording && !isProcessing && (
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        Tap the microphone to start recording
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Playback */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          Your Recording
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Duration: {formatTime(recordingTime)}
                        </p>
                      </div>
                      <button
                        onClick={playAudio}
                        className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Transcription */}
                    {isProcessing ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6"
                      >
                        <div className="text-center">
                          <motion.div
                            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <p className="text-blue-900 dark:text-blue-300 font-bold mb-1">
                            AWS Transcribe Processing...
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            {processingStep === 'uploading' && '📤 Uploading audio to S3...'}
                            {processingStep === 'transcribing' && '🎤 Transcribing speech to text...'}
                            {processingStep === 'complete' && '✅ Transcription complete!'}
                            {!processingStep && '⏳ Initializing AWS services...'}
                          </p>
                        </div>
                      </motion.div>
                    ) : transcriptionError ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-1">
                              Transcription Note
                            </h4>
                            <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-2">
                              {transcriptionError}
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-500">
                              Using demo transcription. To enable AWS Transcribe:
                              <br/>• Ensure AWS Transcribe is enabled in your region
                              <br/>• Check IAM permissions for Transcribe + S3
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : transcription ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-4"
                      >
                        <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          {processingStep === 'fallback' ? '📝 Demo Transcription' : '✅ AWS Transcription'}
                        </h4>
                        <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                          {transcription}
                        </p>
                      </motion.div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {audioBlob && transcription && !isProcessing && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleSaveToVault}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold"
                  >
                    <Lock className="w-5 h-5" />
                    Save to Vault
                  </button>

                  <button
                    onClick={handleGenerateMarketing}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Marketing
                  </button>
                </div>
              )}

              {/* Re-record button */}
              {audioBlob && (
                <button
                  onClick={resetState}
                  className="w-full mt-4 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  🔄 Record Again
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
