/**
 * Service Worker Registration
 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registered:', registration.scope);

      // Verificar actualizaciones cada hora
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Manejar actualizaciones del SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Hay una nueva versión disponible
            showUpdateNotification();
          }
        });
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });

  // Detectar cuando el SW toma control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker controller changed');
  });
}

/**
 * Mostrar notificación de actualización
 */
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'sw-update-notification';
  notification.innerHTML = `
    <div class="sw-update-content">
      <p><strong>Nueva versión disponible</strong></p>
      <p>Hay una actualización del sitio disponible.</p>
      <div class="sw-update-actions">
        <button onclick="updateServiceWorker()" class="btn-update">Actualizar</button>
        <button onclick="dismissUpdate()" class="btn-dismiss">Más tarde</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Estilos inline para evitar dependencias
  const style = document.createElement('style');
  style.textContent = `
    .sw-update-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .sw-update-content p {
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .sw-update-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .btn-update, .btn-dismiss {
      flex: 1;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    
    .btn-update {
      background: #274c72;
      color: white;
    }
    
    .btn-update:hover {
      background: #45729d;
    }
    
    .btn-dismiss {
      background: #e0e0e0;
      color: #333;
    }
    
    .btn-dismiss:hover {
      background: #d0d0d0;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Actualizar Service Worker
 */
window.updateServiceWorker = async function() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
};

/**
 * Descartar notificación de actualización
 */
window.dismissUpdate = function() {
  const notification = document.querySelector('.sw-update-notification');
  if (notification) {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }
};

/**
 * Detectar estado de conexión
 */
window.addEventListener('online', () => {
  console.log('🌐 Conexión restaurada');
  if (typeof ErrorHandler !== 'undefined') {
    ErrorHandler.showNotification({
      type: 'success',
      message: 'Conexión a internet restaurada',
      duration: 3000
    });
  }
});

window.addEventListener('offline', () => {
  console.log('📡 Sin conexión');
  if (typeof ErrorHandler !== 'undefined') {
    ErrorHandler.showNotification({
      type: 'warning',
      message: 'Sin conexión a internet. Modo offline activado.',
      duration: 5000
    });
  }
});
