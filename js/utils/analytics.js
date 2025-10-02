/**
 * Analytics and tracking utilities
 * Privacy-focused analytics implementation
 */

export class Analytics {
  static initialized = false;
  static events = [];

  /**
   * Initialize analytics
   */
  static init(config = {}) {
    if (this.initialized) return;

    this.config = {
      trackPageViews: true,
      trackClicks: true,
      trackErrors: true,
      trackPerformance: true,
      debug: false,
      ...config
    };

    if (this.config.trackPageViews) {
      this.trackPageView();
    }

    if (this.config.trackClicks) {
      this.initClickTracking();
    }

    if (this.config.trackErrors) {
      this.initErrorTracking();
    }

    if (this.config.trackPerformance) {
      this.initPerformanceTracking();
    }

    this.initialized = true;
    this.log('Analytics initialized');
  }

  /**
   * Track page view
   */
  static trackPageView(page = window.location.pathname) {
    this.track('page_view', {
      page,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track custom event
   */
  static track(eventName, data = {}) {
    const event = {
      event: eventName,
      ...data,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    this.events.push(event);
    this.log('Event tracked:', event);

    // Send to analytics service (implement based on your provider)
    this.sendToAnalytics(event);
  }

  /**
   * Track property view
   */
  static trackPropertyView(propertyId, propertyData = {}) {
    this.track('property_view', {
      property_id: propertyId,
      property_type: propertyData.property_type,
      operation: propertyData.operation,
      location: propertyData.location,
      price: propertyData.price
    });
  }

  /**
   * Track search
   */
  static trackSearch(filters = {}) {
    this.track('search', {
      filters: JSON.stringify(filters),
      results_count: filters.resultsCount || 0
    });
  }

  /**
   * Track form submission
   */
  static trackFormSubmit(formName, success = true) {
    this.track('form_submit', {
      form_name: formName,
      success
    });
  }

  /**
   * Track button click
   */
  static trackClick(elementName, elementType = 'button') {
    this.track('click', {
      element_name: elementName,
      element_type: elementType
    });
  }

  /**
   * Initialize click tracking
   */
  static initClickTracking() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-track]');
      if (target) {
        const trackData = target.dataset.track;
        this.track('click', {
          element: trackData,
          text: target.textContent.trim().substring(0, 50)
        });
      }
    });
  }

  /**
   * Initialize error tracking
   */
  static initErrorTracking() {
    window.addEventListener('error', (e) => {
      this.track('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.track('unhandled_rejection', {
        reason: e.reason,
        promise: e.promise
      });
    });
  }

  /**
   * Initialize performance tracking
   */
  static initPerformanceTracking() {
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.track('lcp', {
          value: lastEntry.renderTime || lastEntry.loadTime,
          element: lastEntry.element?.tagName
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.track('fid', {
            value: entry.processingStart - entry.startTime,
            name: entry.name
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.track('cls', { value: clsValue });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Track page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        this.track('page_load', {
          load_time: pageLoadTime,
          dom_ready: perfData.domContentLoadedEventEnd - perfData.navigationStart,
          first_paint: perfData.responseEnd - perfData.navigationStart
        });
      }, 0);
    });
  }

  /**
   * Get or create session ID
   */
  static getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * Send event to analytics service
   */
  static sendToAnalytics(event) {
    // Implementar según tu proveedor de analytics
    // Ejemplos: Google Analytics, Plausible, Matomo, etc.
    
    // Google Analytics 4 example:
    if (typeof gtag !== 'undefined') {
      gtag('event', event.event, event);
    }

    // Custom endpoint example:
    if (this.config.endpoint) {
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(err => console.error('Analytics send failed:', err));
    }
  }

  /**
   * Get all tracked events
   */
  static getEvents() {
    return [...this.events];
  }

  /**
   * Clear tracked events
   */
  static clearEvents() {
    this.events = [];
  }

  /**
   * Log (only in debug mode)
   */
  static log(...args) {
    if (this.config?.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  /**
   * Track user engagement
   */
  static trackEngagement() {
    let startTime = Date.now();
    let isActive = true;

    // Track time on page
    const trackTime = () => {
      if (isActive) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        this.track('engagement', {
          time_on_page: timeSpent,
          page: window.location.pathname
        });
      }
    };

    // Track every 30 seconds
    setInterval(trackTime, 30000);

    // Track on page unload
    window.addEventListener('beforeunload', trackTime);

    // Detect user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        isActive = true;
      }, { passive: true });
    });

    // Detect inactivity
    setInterval(() => {
      isActive = false;
    }, 5000);
  }

  /**
   * Track conversion
   */
  static trackConversion(conversionType, value = 0) {
    this.track('conversion', {
      type: conversionType,
      value
    });
  }
}

export default Analytics;
