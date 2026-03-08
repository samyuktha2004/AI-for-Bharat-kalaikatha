import { DEVICE_THRESHOLDS } from './constants';

/**
 * Device capability detection utilities
 */

export function getDeviceMemory(): number {
  return (navigator as any).deviceMemory || 4; // Default to 4GB if not available
}

export function getDeviceCores(): number {
  return navigator.hardwareConcurrency || 2; // Default to 2 cores
}

export function getConnectionType(): string {
  const connection = (navigator as any).connection;
  return connection?.effectiveType || '4g';
}

export function isLowEndDevice(): boolean {
  const memory = getDeviceMemory();
  const cores = getDeviceCores();
  const connectionType = getConnectionType();
  
  const hasLowMemory = memory < DEVICE_THRESHOLDS.LOW_MEMORY_GB;
  const hasLowCores = cores < DEVICE_THRESHOLDS.LOW_CORES;
  const hasSlowConnection = DEVICE_THRESHOLDS.SLOW_CONNECTIONS.includes(connectionType);
  
  return hasLowMemory || hasLowCores || hasSlowConnection;
}

export function getDeviceCapabilities() {
  return {
    memory: getDeviceMemory(),
    cores: getDeviceCores(),
    connection: getConnectionType(),
    isLowEnd: isLowEndDevice(),
  };
}

export function shouldUseCompression(): boolean {
  return isLowEndDevice();
}

export function shouldReduceAnimations(): boolean {
  return isLowEndDevice();
}
