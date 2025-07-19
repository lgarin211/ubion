import { useState, useCallback } from 'react';
import { SessionCache, ApiConfig, CacheKeys } from '@/lib/sessionCache';

// Type definitions untuk restaurant detail API response
export interface RestaurantDetailData {
  message: string;
  data: {
    component1: {
      id: number;
      img: string;
      created_at: string;
      updated_at: string;
      resto_name: string;
      about_resto: string;
      location: string;
      timeopr: string;
      simpel_menu_baneer: string;
    };
    component2: Array<{
      id: number;
      image: string;
      title: string;
      created_at: string;
      updated_at: string;
      id_tenant: number;
    }>;
  };
}

interface UseRestaurantDetailResult {
  data: RestaurantDetailData | null;
  loading: boolean;
  error: string | null;
  fetchRestaurantDetail: (id: number) => Promise<void>;
  parseHtmlContent: (htmlString: string | undefined | null) => string;
  getFullImageUrl: (imagePath: string | undefined | null) => string;
  getCacheInfo: (id: number) => { isCached: boolean; remainingMinutes: number };
}

export const useRestaurantDetail = (): UseRestaurantDetailResult => {
  const [data, setData] = useState<RestaurantDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantDetail = async (id: number) => {
    // Check cache first
    const cacheKey = CacheKeys.RESTAURANT_DETAIL(id);
    const cachedData = SessionCache.getItem<RestaurantDetailData>(cacheKey);
    
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = ApiConfig.getFullUrl(`/api/menuresto/${id}`);
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
      
      const result: RestaurantDetailData = await response.json();
      
      // Save to cache
      SessionCache.setItem(cacheKey, result);
      
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      }
      console.error('Error fetching restaurant detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for safe data processing
  const parseHtmlContent = useCallback((htmlString: string | undefined | null): string => {
    if (!htmlString || typeof htmlString !== 'string') {
      return '';
    }
    return htmlString.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—');
  }, []);

  const getFullImageUrl = useCallback((imagePath: string | undefined | null): string => {
    if (!imagePath || typeof imagePath !== 'string') {
      return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"; // Default image
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://127.0.0.1:8000/${imagePath}`;
  }, []);

  // Get cache info for specific restaurant
  const getCacheInfo = useCallback((id: number) => {
    const cacheKey = CacheKeys.RESTAURANT_DETAIL(id);
    const hasCache = SessionCache.hasValidItem(cacheKey);
    const remainingTime = SessionCache.getRemainingTime(cacheKey);
    
    return {
      isCached: hasCache,
      remainingMinutes: remainingTime,
    };
  }, []);

  return {
    data,
    loading,
    error,
    fetchRestaurantDetail,
    parseHtmlContent,
    getFullImageUrl,
    getCacheInfo
  };
};
