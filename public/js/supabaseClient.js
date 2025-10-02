'use strict';

// Inicialización global de Supabase
// Requiere que el script CDN de @supabase/supabase-js v2 esté cargado previamente
(function initSupabaseClient() {
  if (typeof window === 'undefined') return;

  // Evitar reinicialización si ya existe
  if (window.supabaseClient) return;

  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase SDK no está disponible. Asegúrate de cargar el CDN antes de este archivo.');
    return;
  }

  // Obtener configuración centralizada (debe definirse en js/supabaseConfig.js)
  const cfg = window.__SUPABASE_CONFIG__ || {};
  const SUPABASE_URL = cfg.url;
  const SUPABASE_ANON_KEY = cfg.anonKey;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase config no encontrada. Crea js/supabaseConfig.js con url y anonKey');
    return;
  }

  // Crear y exponer el cliente globalmente
  try {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('No se pudo inicializar el cliente de Supabase:', e);
  }
})();
