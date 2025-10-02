/**
 * Input validation utilities
 */

import { ValidationError } from './errorHandler.js';

export class Validator {
  /**
   * Validate email format
   */
  static email(value, fieldName = 'Email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      throw new ValidationError(`${fieldName} no es válido`, fieldName);
    }
    return true;
  }

  /**
   * Validate required field
   */
  static required(value, fieldName = 'Campo') {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new ValidationError(`${fieldName} es requerido`, fieldName);
    }
    return true;
  }

  /**
   * Validate minimum length
   */
  static minLength(value, min, fieldName = 'Campo') {
    if (!value || value.length < min) {
      throw new ValidationError(`${fieldName} debe tener al menos ${min} caracteres`, fieldName);
    }
    return true;
  }

  /**
   * Validate maximum length
   */
  static maxLength(value, max, fieldName = 'Campo') {
    if (value && value.length > max) {
      throw new ValidationError(`${fieldName} no puede exceder ${max} caracteres`, fieldName);
    }
    return true;
  }

  /**
   * Validate number range
   */
  static range(value, min, max, fieldName = 'Valor') {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      throw new ValidationError(`${fieldName} debe estar entre ${min} y ${max}`, fieldName);
    }
    return true;
  }

  /**
   * Validate positive number
   */
  static positiveNumber(value, fieldName = 'Número') {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new ValidationError(`${fieldName} debe ser un número positivo`, fieldName);
    }
    return true;
  }

  /**
   * Validate URL format
   */
  static url(value, fieldName = 'URL') {
    try {
      new URL(value);
      return true;
    } catch {
      throw new ValidationError(`${fieldName} no es una URL válida`, fieldName);
    }
  }

  /**
   * Validate phone number (Argentina format)
   */
  static phone(value, fieldName = 'Teléfono') {
    const phoneRegex = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
    if (!value || !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      throw new ValidationError(`${fieldName} no es válido`, fieldName);
    }
    return true;
  }

  /**
   * Validate file size
   */
  static fileSize(file, maxSizeInMB, fieldName = 'Archivo') {
    const maxBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new ValidationError(
        `${fieldName} no puede exceder ${maxSizeInMB}MB (tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        fieldName
      );
    }
    return true;
  }

  /**
   * Validate file type
   */
  static fileType(file, allowedTypes, fieldName = 'Archivo') {
    const fileType = file.type;
    const fileExt = file.name.split('.').pop().toLowerCase();
    
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('/')) {
        return fileType === type;
      }
      return fileExt === type.replace('.', '');
    });

    if (!isAllowed) {
      throw new ValidationError(
        `${fieldName} debe ser de tipo: ${allowedTypes.join(', ')}`,
        fieldName
      );
    }
    return true;
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  static sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  }

  /**
   * Validate property data
   */
  static validateProperty(data) {
    const errors = [];

    try {
      this.required(data.title, 'Título');
      this.minLength(data.title, 5, 'Título');
      this.maxLength(data.title, 200, 'Título');
    } catch (e) {
      errors.push(e.message);
    }

    try {
      this.required(data.location, 'Ubicación');
    } catch (e) {
      errors.push(e.message);
    }

    try {
      this.required(data.operation, 'Operación');
    } catch (e) {
      errors.push(e.message);
    }

    try {
      this.required(data.property_type, 'Tipo de propiedad');
    } catch (e) {
      errors.push(e.message);
    }

    if (data.price) {
      try {
        this.positiveNumber(data.price, 'Precio');
      } catch (e) {
        errors.push(e.message);
      }
    }

    if (data.bedrooms) {
      try {
        this.range(data.bedrooms, 0, 50, 'Habitaciones');
      } catch (e) {
        errors.push(e.message);
      }
    }

    if (data.bathrooms) {
      try {
        this.range(data.bathrooms, 0, 20, 'Baños');
      } catch (e) {
        errors.push(e.message);
      }
    }

    if (data.area) {
      try {
        this.positiveNumber(data.area, 'Superficie');
      } catch (e) {
        errors.push(e.message);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('. '));
    }

    return true;
  }
}

export default Validator;
