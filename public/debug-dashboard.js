// Script de diagnóstico para identificar problemas en el dashboard
console.log('🔍 Iniciando diagnóstico del dashboard...');

// Verificar archivos críticos
const criticalFiles = [
    'css/styles.css',
    'js/dashboard.js',
    'js/supabaseClient.js'
];

criticalFiles.forEach(file => {
    const link = document.querySelector(`link[href="${file}"], script[src="${file}"]`);
    if (link) {
        console.log(`✅ ${file}: Enlazado correctamente`);
    } else {
        console.error(`❌ ${file}: No encontrado en el DOM`);
    }
});

// Verificar inicialización de Supabase
if (typeof window.supabaseClient !== 'undefined') {
    console.log('✅ Cliente de Supabase inicializado');
} else {
    console.error('❌ Cliente de Supabase no inicializado');
}

// Verificar elementos del DOM críticos
const criticalElements = [
    'sidebar',
    'dashboardSection',
    'propertiesSection',
    'propertyModal'
];

criticalElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        console.log(`✅ Elemento ${id}: Encontrado`);
    } else {
        console.error(`❌ Elemento ${id}: No encontrado`);
    }
});

console.log('🔍 Diagnóstico completado');
