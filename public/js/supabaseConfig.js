/*
	Archivo de configuración de Supabase

	Este archivo centraliza la URL y la ANON KEY para que el resto de scripts
	lean la configuración desde `window.__SUPABASE_CONFIG__`.

	ADVERTENCIA: Mantener claves en archivos del repositorio no es seguro. Para
	producción, mueve estas credenciales a variables de entorno en el servidor
	o usa el mecanismo de configuración del hosting. Este archivo contiene la
	clave por conveniencia local; reemplázala por tu propia configuración o
	elimina este archivo y crea `js/supabaseConfig.js` en el servidor.
*/

window.__SUPABASE_CONFIG__ = {
	url: 'https://uncbkuayattrifnmyafh.supabase.co',
	anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY2JrdWF5YXR0cmlmbm15YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0Nzk2OTksImV4cCI6MjA3MzA1NTY5OX0.O7UeGhnooSiE-ZjPr_63DxAL7JsYyc7JJr9ctA707Es'
};

// Si prefieres no tener la clave en el repo, renombra este archivo a
// `js/supabaseConfig.example.js` y crea `js/supabaseConfig.js` con la
// configuración en el servidor/hosting privado.
