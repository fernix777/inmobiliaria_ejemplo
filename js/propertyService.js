// Servicio para acceder a los datos de propiedades usando Supabase (cliente unificado)
import { cache } from './utils/cache.js';
import { NetworkError, AppError } from './utils/errorHandler.js';
import { PerformanceMonitor } from './utils/performance.js';

function getClient() {
  const client = (typeof window !== 'undefined') ? window.supabaseClient : undefined;
  if (!client) {
    console.error('Supabase client no está disponible. Asegúrate de cargar el CDN y js/supabaseClient.js antes de este módulo.');
  }
  return client;
}

// Cache TTL: 5 minutes for properties
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Obtiene todas las propiedades de la base de datos
 * @returns {Promise<Array>} Array de propiedades
 */
export async function getAllProperties() {
  const cacheKey = 'all_properties';
  
  try {
    // Try to get from cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Properties loaded from cache');
      return cached;
    }

    PerformanceMonitor.start('getAllProperties');
    
    const client = getClient();
    if (!client) throw new NetworkError('Cliente de base de datos no disponible');
    
    const { data, error } = await client
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw new AppError(error.message, 'DB_ERROR');
    
    const properties = data || [];
    
    // Cache the results
    cache.set(cacheKey, properties, CACHE_TTL);
    
    PerformanceMonitor.end('getAllProperties');
    
    return properties;
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    if (error instanceof NetworkError || error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error al cargar las propiedades', 'FETCH_ERROR');
  }
}

/**
 * Busca propiedades según los filtros proporcionados
 * @param {Object} filters - Objeto con los filtros a aplicar
 * @returns {Promise<Array>} Array de propiedades filtradas
 */
export async function searchProperties(filters = {}) {
  const cacheKey = `search_${JSON.stringify(filters)}`;
  
  try {
    // Try cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Search results loaded from cache');
      return cached;
    }

    PerformanceMonitor.start('searchProperties');
    
    const client = getClient();
    if (!client) throw new NetworkError('Cliente de base de datos no disponible');
    
    let query = client.from('properties').select('*');

    // Aplicar filtros
    if (filters.operation) {
      query = query.eq('operation', filters.operation);
    }
    
    if (filters.type || filters.propertyType) {
      const type = filters.type || filters.propertyType;
      query = query.or(`property_type.eq.${type},type.eq.${type}`);
    }
    
    if (filters.bedrooms) {
      query = query.gte('bedrooms', parseInt(filters.bedrooms));
    }
    
    if (filters.bathrooms) {
      query = query.gte('bathrooms', parseInt(filters.bathrooms));
    }
    
    if (filters.minPrice) {
      query = query.gte('price', parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', parseInt(filters.maxPrice));
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.minArea) {
      query = query.gte('area', parseInt(filters.minArea));
    }

    if (filters.maxArea) {
      query = query.lte('area', parseInt(filters.maxArea));
    }
    
    // Order results
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw new AppError(error.message, 'DB_ERROR');
    
    const results = data || [];
    
    // Cache results
    cache.set(cacheKey, results, CACHE_TTL);
    
    PerformanceMonitor.end('searchProperties');
    
    return results;
  } catch (error) {
    console.error('Error al buscar propiedades:', error);
    if (error instanceof NetworkError || error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error al buscar propiedades', 'SEARCH_ERROR');
  }
}

/**
 * Obtiene una propiedad por su ID
 * @param {string|number} id - ID de la propiedad
 * @returns {Promise<Object|null>} Datos de la propiedad o null si no existe
 */
export async function getPropertyById(id) {
  const cacheKey = `property_${id}`;
  
  try {
    // Try cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Property ${id} loaded from cache`);
      return cached;
    }

    PerformanceMonitor.start('getPropertyById');
    
    const client = getClient();
    if (!client) throw new NetworkError('Cliente de base de datos no disponible');
    
    const { data, error } = await client
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Propiedad no encontrada', 'NOT_FOUND', 404);
      }
      throw new AppError(error.message, 'DB_ERROR');
    }
    
    // Cache the result
    cache.set(cacheKey, data, CACHE_TTL);
    
    PerformanceMonitor.end('getPropertyById');
    
    return data;
  } catch (error) {
    console.error(`Error al obtener la propiedad con ID ${id}:`, error);
    if (error instanceof NetworkError || error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error al cargar la propiedad', 'FETCH_ERROR');
  }
}

/**
 * Clear properties cache
 */
export function clearPropertiesCache() {
  cache.clear();
  console.log('Properties cache cleared');
}