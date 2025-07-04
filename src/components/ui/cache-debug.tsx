import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionCache, CacheKeys, ApiConfig } from '@/lib/sessionCache';
import { useWelcomeData } from '@/hooks/useWelcomeData';

interface CacheDebugProps {
  className?: string;
}

export function CacheDebug({ className }: CacheDebugProps) {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { getCacheInfo, refetch } = useWelcomeData();

  // Check if debug mode is enabled
  if (ApiConfig.isProdMode()) {
    return null; // Don't render anything in production mode
  }
  
  const forceRefresh = () => setRefreshKey(prev => prev + 1);
  
  const welcomeCacheInfo = getCacheInfo();
  
  const clearAllCache = () => {
    SessionCache.removeItem(CacheKeys.WELCOME_DATA);
    // Clear all restaurant detail caches
    if (typeof window !== 'undefined') {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('restaurant-detail-')) {
          SessionCache.removeItem(key);
        }
      });
    }
    forceRefresh();
  };
  
  const clearExpiredCache = () => {
    SessionCache.clearExpired();
    forceRefresh();
  };

  // Environment variables info
  const envInfo = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set',
    apiTimeout: process.env.NEXT_PUBLIC_API_TIMEOUT || 'Not set',
    cacheTimeout: process.env.NEXT_PUBLIC_CACHE_TIMEOUT || 'Not set',
    webStatus: process.env.NEXT_PUBLIC_WEB_STATUS || 'Not set',
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Cache & API Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variables */}
        <div>
          <h4 className="font-semibold mb-2">Environment Variables</h4>
          <div className="text-sm space-y-1">
            <div>API Base URL: <code className="bg-gray-100 px-1 rounded">{envInfo.apiBaseUrl}</code></div>
            <div>API Timeout: <code className="bg-gray-100 px-1 rounded">{envInfo.apiTimeout}ms</code></div>
            <div>Cache Timeout: <code className="bg-gray-100 px-1 rounded">{envInfo.cacheTimeout} minutes</code></div>
            <div>Web Status: <code className={`px-1 rounded ${envInfo.webStatus === 'debug' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{envInfo.webStatus}</code></div>
          </div>
        </div>

        {/* Welcome Data Cache Status */}
        <div>
          <h4 className="font-semibold mb-2">Welcome Data Cache</h4>
          <div className="text-sm space-y-1">
            <div>Status: <span className={welcomeCacheInfo.isCached ? 'text-green-600' : 'text-red-600'}>
              {welcomeCacheInfo.isCached ? 'Cached' : 'Not Cached'}
            </span></div>
            {welcomeCacheInfo.isCached && (
              <div>Expires in: <span className="text-blue-600">{welcomeCacheInfo.remainingMinutes} minutes</span></div>
            )}
          </div>
        </div>

        {/* Cache Actions */}
        <div className="space-y-2">
          <h4 className="font-semibold">Cache Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => refetch()}
            >
              Force Refresh Welcome Data
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={clearExpiredCache}
            >
              Clear Expired Cache
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={clearAllCache}
            >
              Clear All Cache
            </Button>
          </div>
        </div>

        {/* Refresh trigger */}
        <div className="hidden">{refreshKey}</div>
      </CardContent>
    </Card>
  );
}
