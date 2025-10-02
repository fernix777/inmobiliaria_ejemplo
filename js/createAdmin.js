document.addEventListener('DOMContentLoaded', createAdminUser);
/*
  createAdmin.js

  Este script usaba las APIs de administración de Supabase (`auth.admin.*`) que
  solo deben ejecutarse en un entorno de servidor seguro (SERVICE_ROLE key).

  Ejecutar estas llamadas desde el navegador es inseguro. Por seguridad el
  contenido se ha convertido en ejemplo y la ejecución automática se ha
  deshabilitado. Para crear administradores, implementa una función en el
  servidor que ejecute estas llamadas con la SERVICE_ROLE key.

// Ejemplo (NO EJECUTAR EN CLIENTE):
// const supabase = supabase.createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
// async function createAdminUser() { ... }
*/
