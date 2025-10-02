// Archivo neutralizado: elimina claves y evita ejecuciones peligrosas.
// Si necesitas un script de pruebas, usa `js/testSupabase.example.js` como
// plantilla y revisa manualmente antes de ejecutar cualquier operación.

/* Ejemplo (NO EJECUTAR automáticamente):
if (window.__SUPABASE_CONFIG__) {
  const { createClient } = supabase;
  const supabaseClient = createClient(window.__SUPABASE_CONFIG__.url, window.__SUPABASE_CONFIG__.anonKey);

  async function deleteAllProperties() {
    // Esta función borraría datos: NO LA EJECUTES en entornos con datos reales.
  }

  // document.addEventListener('DOMContentLoaded', deleteAllProperties);
}
*/
