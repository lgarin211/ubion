// Utility untuk mengelola session storage dengan expiration
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class SessionCache {
  // Get timeout dari environment variables (dalam menit)
  private static getTimeoutMinutes(): number {
    return parseInt(process.env.NEXT_PUBLIC_CACHE_TIMEOUT || '30');
  }

  // Set item ke session storage dengan expiration
  static setItem<T>(key: string, data: T, customTimeoutMinutes?: number): void {
    if (typeof window === 'undefined') return; // Server-side check
    
    const timeoutMinutes = customTimeoutMinutes || this.getTimeoutMinutes();
    const now = Date.now();
    const expiresAt = now + (timeoutMinutes * 60 * 1000); // Convert to milliseconds
    
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt
    };
    
    try {
      sessionStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to save to session storage:', error);
    }
  }

  // Get item dari session storage dengan expiration check
  static getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null; // Server-side check
    
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      
      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();
      
      // Check if item has expired
      if (now > cacheItem.expiresAt) {
        this.removeItem(key);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to get from session storage:', error);
      this.removeItem(key);
      return null;
    }
  }

  // Remove item dari session storage
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from session storage:', error);
    }
  }

  // Check if item exists and not expired
  static hasValidItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  // Clear all expired items
  static clearExpired(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(sessionStorage);
      const now = Date.now();
      
      keys.forEach(key => {
        try {
          const item = sessionStorage.getItem(key);
          if (item) {
            const cacheItem = JSON.parse(item);
            if (cacheItem.expiresAt && now > cacheItem.expiresAt) {
              sessionStorage.removeItem(key);
            }
          }
        } catch {
          // Invalid JSON, remove it
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear expired items:', error);
    }
  }

  // Get remaining time in minutes
  static getRemainingTime(key: string): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return 0;
      
      const cacheItem = JSON.parse(item);
      const now = Date.now();
      const remaining = cacheItem.expiresAt - now;
      
      return Math.max(0, Math.ceil(remaining / (60 * 1000))); // Convert to minutes
    } catch {
      return 0;
    }
  }
}

// API Configuration utilities
export class ApiConfig {
  static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
  }

  static getTimeout(): number {
    return parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');
  }

  static getFullUrl(endpoint: string): string {
    const baseUrl = this.getBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  static getWebStatus(): 'debug' | 'prod' {
    return (process.env.NEXT_PUBLIC_WEB_STATUS as 'debug' | 'prod') || 'prod';
  }

  static isDebugMode(): boolean {
    return this.getWebStatus() === 'debug';
  }

  static isProdMode(): boolean {
    return this.getWebStatus() === 'prod';
  }
}

// Hook utilities untuk cache management
export const CacheKeys = {
  WELCOME_DATA: 'welcome-data',
  RESTAURANT_DETAIL: (id: number) => `restaurant-detail-${id}`,
} as const;
