import { useState, useEffect } from 'react';
import { SessionCache, ApiConfig, CacheKeys } from '@/lib/sessionCache';

// Type definitions berdasarkan struktur API response
export interface WelcomeData {
  message: string;
  data: {
    component1: {
      title: string;
      big_banner: string;
      big_welcome: string;
    };
    component2: Array<{
      id: number;
      banner: string;
      title: string;
      description: string;
      created_at: string;
      updated_at: string;
    }>;
    component3: Array<{
      id: number;
      image: string;
      description: string;
      created_at: string;
      updated_at: string;
    }>;
    component4: Array<{
      id: number;
      img: string;
      created_at: string;
      updated_at: string;
    }>;
    component5: {
      fb: string;
      ig: string;
    };
  };
}

interface UseWelcomeDataResult {
  data: WelcomeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getCacheInfo: () => { isCached: boolean; remainingMinutes: number };
}

export const useWelcomeData = (): UseWelcomeDataResult => {
  const [data, setData] = useState<WelcomeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (forceRefresh = false) => {
    // Check cache first (jika tidak force refresh)
    if (!forceRefresh) {
      const cachedData = SessionCache.getItem<WelcomeData>(CacheKeys.WELCOME_DATA);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = ApiConfig.getFullUrl('/api/welcome');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ApiConfig.getTimeout());
      
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: WelcomeData = await response.json();
      
      // Save to cache
      SessionCache.setItem(CacheKeys.WELCOME_DATA, result);
      
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      }
      console.error('Error fetching welcome data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
    
    // Clean up expired cache items on component mount
    SessionCache.clearExpired();
  }, []);

  // Refetch function untuk manual refresh
  const refetch = () => {
    fetchData(true); // Force refresh
  };

  // Get cache info
  const getCacheInfo = () => {
    const hasCache = SessionCache.hasValidItem(CacheKeys.WELCOME_DATA);
    const remainingTime = SessionCache.getRemainingTime(CacheKeys.WELCOME_DATA);
    
    return {
      isCached: hasCache,
      remainingMinutes: remainingTime,
    };
  };

  return {
    data,
    loading,
    error,
    refetch,
    getCacheInfo
  };
};

// Helper functions untuk memproses data
export const getFullImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `${ApiConfig.getBaseUrl()}/${imagePath}`;
};

// Helper untuk parse HTML content
export const parseHtmlContent = (htmlString: string): string => {
  // Remove HTML tags for plain text usage
  return htmlString.replace(/<[^>]*>/g, '');
};
