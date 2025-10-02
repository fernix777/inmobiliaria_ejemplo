/**
 * Performance monitoring and optimization utilities
 */

export class PerformanceMonitor {
  static marks = new Map();
  static measures = [];

  /**
   * Start performance measurement
   */
  static start(name) {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`);
    }
    this.marks.set(name, Date.now());
  }

  /**
   * End performance measurement
   */
  static end(name) {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return null;
    }

    const duration = Date.now() - startTime;
    this.marks.delete(name);

    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
      } catch (e) {
        console.warn('Error measuring performance:', e);
      }
    }

    this.measures.push({ name, duration, timestamp: Date.now() });

    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration}ms`);
    }

    return duration;
  }

  /**
   * Get all measures
   */
  static getMeasures() {
    return [...this.measures];
  }

  /**
   * Clear all measures
   */
  static clear() {
    this.marks.clear();
    this.measures = [];
    
    if ('performance' in window && 'clearMarks' in performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }

  /**
   * Get page load metrics
   */
  static getPageMetrics() {
    if (!('performance' in window) || !performance.timing) {
      return null;
    }

    const timing = performance.timing;
    const navigation = performance.navigation;

    return {
      // Navigation timing
      navigationStart: timing.navigationStart,
      redirectTime: timing.redirectEnd - timing.redirectStart,
      dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
      tcpTime: timing.connectEnd - timing.connectStart,
      requestTime: timing.responseStart - timing.requestStart,
      responseTime: timing.responseEnd - timing.responseStart,
      
      // Page load timing
      domInteractive: timing.domInteractive - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      domComplete: timing.domComplete - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      
      // Navigation type
      navigationType: navigation.type,
      redirectCount: navigation.redirectCount
    };
  }

  /**
   * Debounce function
   */
  static debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   */
  static throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Request idle callback wrapper
   */
  static requestIdleCallback(callback, options = {}) {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, options);
    }
    // Fallback
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
  }

  /**
   * Prefetch resource
   */
  static prefetch(url, as = 'fetch') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  }

  /**
   * Preload resource
   */
  static preload(url, as = 'fetch') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  }

  /**
   * Check if connection is slow
   */
  static isSlowConnection() {
    if (!('connection' in navigator)) return false;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return false;

    // Check for slow connection types
    const slowTypes = ['slow-2g', '2g'];
    if (slowTypes.includes(connection.effectiveType)) {
      return true;
    }

    // Check for save-data preference
    if (connection.saveData) {
      return true;
    }

    return false;
  }

  /**
   * Get memory info (Chrome only)
   */
  static getMemoryInfo() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Log performance report
   */
  static logReport() {
    console.group('Performance Report');
    
    const metrics = this.getPageMetrics();
    if (metrics) {
      console.table(metrics);
    }

    const measures = this.getMeasures();
    if (measures.length > 0) {
      console.table(measures);
    }

    const memory = this.getMemoryInfo();
    if (memory) {
      console.log('Memory:', memory);
    }

    console.log('Slow connection:', this.isSlowConnection());
    
    console.groupEnd();
  }
}

export default PerformanceMonitor;
