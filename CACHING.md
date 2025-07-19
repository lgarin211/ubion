# Environment Configuration & Session Caching

This project implements session-based caching with configurable API settings and automatic cache expiration.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_TIMEOUT=10000

# Session/Cache Configuration (in minutes)
NEXT_PUBLIC_CACHE_TIMEOUT=30
NEXT_PUBLIC_SESSION_TIMEOUT=60

# Web Status Configuration
# Options: debug, prod
NEXT_PUBLIC_WEB_STATUS=debug
```

### Variable Descriptions

- **NEXT_PUBLIC_API_BASE_URL**: Base URL for all API requests
- **NEXT_PUBLIC_API_TIMEOUT**: Request timeout in milliseconds (default: 10000ms = 10 seconds)
- **NEXT_PUBLIC_CACHE_TIMEOUT**: Session cache expiration time in minutes (default: 30 minutes)
- **NEXT_PUBLIC_SESSION_TIMEOUT**: Overall session timeout in minutes (default: 60 minutes)
- **NEXT_PUBLIC_WEB_STATUS**: Controls debug features visibility
  - `debug`: Shows cache debug panel and API information
  - `prod`: Hides all debug information for production use

## Web Status Configuration

### Debug Mode (`NEXT_PUBLIC_WEB_STATUS=debug`)
- ✅ Cache debug panel visible
- ✅ Environment variables displayed  
- ✅ Cache status monitoring
- ✅ Manual cache management buttons
- ✅ API endpoint information shown

### Production Mode (`NEXT_PUBLIC_WEB_STATUS=prod`)
- ❌ No debug panel shown
- ❌ No environment variables exposed
- ❌ No cache information displayed
- ❌ No API details visible
- ✅ All caching functionality still works normally

## Security Benefits

The `NEXT_PUBLIC_WEB_STATUS` configuration provides:

- **Production Security**: Hides sensitive API information and internal cache details
- **Debug Convenience**: Easy development debugging when needed
- **Clean Production UI**: No debug clutter in production environment
- **Flexible Deployment**: Same codebase works for both debug and production

## Session Caching Features

### Automatic Caching
- All API responses are automatically cached in browser session storage
- Cache keys are unique per endpoint/resource
- Automatic expiration based on configured timeout

### Cache Benefits
- **Faster loading**: Subsequent visits load data from cache instantly
- **Reduced API calls**: No repeated requests until cache expires
- **Better UX**: Immediate content display for cached data
- **Bandwidth savings**: Less network usage

### Cache Management
- **Automatic cleanup**: Expired cache items are removed automatically
- **Force refresh**: Manual refresh option bypasses cache
- **Development tools**: Cache debug panel in development mode

## How It Works

### 1. First Visit
```
User visits page → API call made → Data cached with expiration → Content displayed
```

### 2. Subsequent Visits (within cache timeout)
```
User visits page → Check cache → Return cached data → Content displayed instantly
```

### 3. After Cache Expiration
```
User visits page → Cache expired → New API call → Update cache → Content displayed
```

## Development Features

In development mode (`NODE_ENV=development`), a debug panel appears in the bottom-right corner showing:

- Current environment variables
- Cache status for each endpoint
- Remaining cache time
- Manual cache management buttons

## API Endpoints Cached

1. **Welcome Data**: `/api/welcome` - Main homepage data
2. **Restaurant Details**: `/api/menuresto/{id}` - Individual restaurant information

## Usage Examples

### Basic Hook Usage
```typescript
const { data, loading, error, refetch, getCacheInfo } = useWelcomeData();

// Get cache information
const cacheInfo = getCacheInfo();
console.log(`Data is cached: ${cacheInfo.isCached}`);
console.log(`Cache expires in: ${cacheInfo.remainingMinutes} minutes`);

// Force refresh (bypass cache)
refetch();
```

### Restaurant Detail Hook
```typescript
const { fetchRestaurantDetail, getCacheInfo } = useRestaurantDetail();

// Fetch restaurant details (will use cache if available)
await fetchRestaurantDetail(restaurantId);

// Check cache status for specific restaurant
const cacheInfo = getCacheInfo(restaurantId);
```

## Cache Storage Location

Data is stored in browser's `sessionStorage`:
- Survives page refreshes
- Cleared when browser tab is closed
- Not shared between tabs
- Automatically cleaned on expiration

## Performance Benefits

- **Initial load time**: Same as before (first API call)
- **Subsequent loads**: Near-instantaneous (cached data)
- **Network usage**: Significantly reduced
- **Server load**: Reduced API calls
- **User experience**: Smoother navigation
