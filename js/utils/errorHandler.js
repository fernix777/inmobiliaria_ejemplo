/**
 * Centralized error handling utility
 */

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NetworkError extends AppError {
  constructor(message) {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(message) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

/**
 * Global error handler
 */
export class ErrorHandler {
  static handlers = new Map();

  static register(errorType, handler) {
    this.handlers.set(errorType, handler);
  }

  static handle(error, context = {}) {
    // Log error for debugging
    console.error('[ErrorHandler]', {
      error,
      context,
      timestamp: new Date().toISOString()
    });

    // Get appropriate handler
    const handler = this.handlers.get(error.constructor.name) || this.defaultHandler;
    
    return handler(error, context);
  }

  static defaultHandler(error, context) {
    const message = error.message || 'Ha ocurrido un error inesperado';
    
    // Show user-friendly error message
    ErrorHandler.showNotification({
      type: 'error',
      message,
      duration: 5000
    });

    return {
      success: false,
      error: {
        message,
        code: error.code || 'UNKNOWN_ERROR'
      }
    };
  }

  static showNotification({ type = 'info', message, duration = 3000 }) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.app-notification');
    existing.forEach(el => el.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `app-notification fixed top-4 right-4 z-[9999] max-w-md p-4 rounded-lg shadow-strong animate-slide-up ${
      type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
      type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
      type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
      'bg-blue-50 text-blue-800 border border-blue-200'
    }`;

    const icon = type === 'error' ? '⚠️' : type === 'success' ? '✓' : type === 'warning' ? '⚡' : 'ℹ️';
    
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-xl">${icon}</span>
        <p class="flex-1 text-sm font-medium">${message}</p>
        <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.app-notification').remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
  }
}

// Register default handlers
ErrorHandler.register('ValidationError', (error) => {
  ErrorHandler.showNotification({
    type: 'warning',
    message: error.message,
    duration: 4000
  });
  return { success: false, error: { message: error.message, field: error.field } };
});

ErrorHandler.register('NetworkError', (error) => {
  ErrorHandler.showNotification({
    type: 'error',
    message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    duration: 5000
  });
  return { success: false, error: { message: error.message, code: 'NETWORK_ERROR' } };
});

ErrorHandler.register('AuthError', (error) => {
  ErrorHandler.showNotification({
    type: 'error',
    message: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
    duration: 5000
  });
  
  // Redirect to login after delay
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 2000);
  
  return { success: false, error: { message: error.message, code: 'AUTH_ERROR' } };
});

export default ErrorHandler;
