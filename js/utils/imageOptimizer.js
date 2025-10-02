/**
 * Image optimization and lazy loading utilities
 */

export class ImageOptimizer {
  /**
   * Initialize lazy loading for images
   */
  static initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img);
      });
    }
  }

  /**
   * Load a single image
   */
  static loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src) return;

    // Create a new image to preload
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      if (srcset) img.srcset = srcset;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    };

    tempImg.onerror = () => {
      console.error('Error loading image:', src);
      img.src = 'img/placeholder.jpg'; // Fallback image
      img.classList.add('error');
    };

    tempImg.src = src;
  }

  /**
   * Compress image file before upload
   */
  static async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al comprimir la imagen'));
                return;
              }
              
              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate responsive image srcset
   */
  static generateSrcset(baseUrl, widths = [320, 640, 960, 1280, 1920]) {
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ');
  }

  /**
   * Create image preview
   */
  static createPreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Error al crear vista previa'));
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image dimensions
   */
  static async validateDimensions(file, minWidth = 0, minHeight = 0, maxWidth = 10000, maxHeight = 10000) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const { width, height } = img;
          
          if (width < minWidth || height < minHeight) {
            reject(new Error(`La imagen debe tener al menos ${minWidth}x${minHeight}px`));
          } else if (width > maxWidth || height > maxHeight) {
            reject(new Error(`La imagen no puede exceder ${maxWidth}x${maxHeight}px`));
          } else {
            resolve({ width, height });
          }
        };

        img.onerror = () => reject(new Error('Error al validar dimensiones'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Add blur-up effect to images
   */
  static addBlurUpEffect(container) {
    const images = container.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      // Add blur placeholder
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.3s ease-out';
      
      // Remove blur when loaded
      img.addEventListener('load', () => {
        img.style.filter = 'blur(0)';
      }, { once: true });
    });
  }
}

export default ImageOptimizer;
