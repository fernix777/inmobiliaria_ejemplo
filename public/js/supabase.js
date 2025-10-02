// Configuración de Supabase
import { createClient } from '@supabase/supabase-js';

// Estas credenciales deberían estar en variables de entorno en un entorno de producción
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-clave-anon-key';

// Crear el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;