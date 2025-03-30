import { ShakeConfig, ShakeData } from "./types";

export const getRandomArrayItem = <T>(arr: T[]): T => {
  if (!arr.length) {
    throw new Error('Cannot get random item from empty array');
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

export class ShakeDetector {
  private config: ShakeConfig = {
    threshold: 15,    // Adjust sensitivity
    timeout: 1000,    // Minimum ms between triggers
  };

  private shakeData: ShakeData = {
    x: 0,
    y: 0,
    z: 0,
    lastTime: 0
  };

  constructor(private callback: () => void) {
    this.handleMotion = this.handleMotion.bind(this);
  }

  public start(): void {
    if (typeof DeviceMotionEvent !== 'undefined') {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        // iOS 13+ requires permission
        (DeviceMotionEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', this.handleMotion);
            }
          })
          .catch(console.error);
      } else {
        // Non-iOS devices
        window.addEventListener('devicemotion', this.handleMotion);
      }
    }
  }

  public stop(): void {
    window.removeEventListener('devicemotion', this.handleMotion);
  }

  private handleMotion(event: DeviceMotionEvent): void {
    const current = event.accelerationIncludingGravity;
    if (!current) return;

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.shakeData.lastTime;

    if (timeDiff > this.config.timeout) {
      const delta = Math.abs(
        Math.sqrt(
          Math.pow((current.x || 0) - this.shakeData.x, 2) +
          Math.pow((current.y || 0) - this.shakeData.y, 2) +
          Math.pow((current.z || 0) - this.shakeData.z, 2)
        )
      );

      if (delta > this.config.threshold) {
        this.callback();
        this.shakeData.lastTime = currentTime;
      }

      this.shakeData.x = current.x || 0;
      this.shakeData.y = current.y || 0;
      this.shakeData.z = current.z || 0;
    }
  }
}

export const vibrate = (pattern: number | number[]): void => {
  if (!window.navigator.vibrate) {
    return; // Silent fail if vibration is not supported
  }
  navigator.vibrate(pattern);
};