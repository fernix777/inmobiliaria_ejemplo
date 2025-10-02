/**
 * Client-side caching utilities
 */

export class CacheManager {
  constructor(namespace = 'debrasi_cache') {
    this.namespace = namespace;
    this.storage = this.getStorage();
  }

  /**
   * Get available storage (localStorage or fallback)
   */
  getStorage() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return localStorage;
    } catch (e) {
      console.warn('localStorage not available, using memory cache');
      return new Map();
    }
  }

  /**
   * Generate cache key
   */
  getCacheKey(key) {
    return `${this.namespace}:${key}`;
  }

  /**
   * Set cache item with expiration
   */
  set(key, value, ttl = 3600000) { // Default 1 hour
    const cacheKey = this.getCacheKey(key);
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };

    try {
      if (this.storage instanceof Map) {
        this.storage.set(cacheKey, item);
      } else {
        this.storage.setItem(cacheKey, JSON.stringify(item));
      }
      return true;
    } catch (e) {
      console.error('Error setting cache:', e);
      return false;
    }
  }

  /**
   * Get cache item if not expired
   */
  get(key) {
    const cacheKey = this.getCacheKey(key);

    try {
      let item;
      
      if (this.storage instanceof Map) {
        item = this.storage.get(cacheKey);
      } else {
        const cached = this.storage.getItem(cacheKey);
        if (!cached) return null;
        item = JSON.parse(cached);
      }

      if (!item) return null;

      // Check if expired
      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (e) {
      console.error('Error getting cache:', e);
      return null;
    }
  }

  /**
   * Remove cache item
   */
  remove(key) {
    const cacheKey = this.getCacheKey(key);
    
    try {
      if (this.storage instanceof Map) {
        this.storage.delete(cacheKey);
      } else {
        this.storage.removeItem(cacheKey);
      }
      return true;
    } catch (e) {
      console.error('Error removing cache:', e);
      return false;
    }
  }

  /**
   * Clear all cache items for this namespace
   */
  clear() {
    try {
      if (this.storage instanceof Map) {
        this.storage.clear();
      } else {
        const keys = Object.keys(this.storage);
        keys.forEach(key => {
          if (key.startsWith(this.namespace)) {
            this.storage.removeItem(key);
          }
        });
      }
      return true;
    } catch (e) {
      console.error('Error clearing cache:', e);
      return false;
    }
  }

  /**
   * Get or set cache with callback
   */
  async getOrSet(key, callback, ttl = 3600000) {
    const cached = this.get(key);
    
    if (cached !== null) {
      return cached;
    }

    try {
      const value = await callback();
      this.set(key, value, ttl);
      return value;
    } catch (e) {
      console.error('Error in getOrSet:', e);
      throw e;
    }
  }

  /**
   * Check if cache has valid item
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const stats = {
      namespace: this.namespace,
      itemCount: 0,
      totalSize: 0
    };

    try {
      if (this.storage instanceof Map) {
        stats.itemCount = this.storage.size;
      } else {
        const keys = Object.keys(this.storage);
        const namespaceKeys = keys.filter(k => k.startsWith(this.namespace));
        stats.itemCount = namespaceKeys.length;
        
        namespaceKeys.forEach(key => {
          const item = this.storage.getItem(key);
          if (item) {
            stats.totalSize += new Blob([item]).size;
          }
        });
      }
    } catch (e) {
      console.error('Error getting cache stats:', e);
    }

    return stats;
  }
}

// Create default cache instance
export const cache = new CacheManager();

export default CacheManager;
