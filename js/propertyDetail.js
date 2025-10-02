// Importar los servicios de Supabase
import { getPropertyById, getAllProperties } from './propertyService.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID de la propiedad de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    // Verificar si se proporcionó un ID
    if (!propertyId) {
        showError('No se especificó una propiedad para mostrar');
        return;
    }
    
    // Elementos del DOM
    const loadingElement = document.getElementById('property-loading');
    const errorElement = document.getElementById('property-error');
    const contentElement = document.getElementById('property-content');
    const relatedPropertiesGrid = document.getElementById('related-properties-grid');
    const propertyIdInput = document.getElementById('property-id');
    
    // Establecer el ID de la propiedad en el formulario de contacto
    if (propertyIdInput) {
        propertyIdInput.value = propertyId;
    }
    
    try {
        // Cargar los datos de la propiedad
        const property = await getPropertyById(propertyId);
        
        // Verificar si se encontró la propiedad
        if (!property) {
            showError('La propiedad solicitada no existe o ha sido eliminada');
            return;
        }
        
        // Ocultar el indicador de carga
        loadingElement.style.display = 'none';
        
        // Mostrar el contenido de la propiedad
        contentElement.style.display = 'block';
        
        // Renderizar los detalles de la propiedad
        renderPropertyDetails(property, contentElement);
        
        // Cargar propiedades relacionadas
        loadRelatedProperties(property, relatedPropertiesGrid);
        
        // Configurar el formulario de contacto
        setupContactForm(property);
        
    } catch (error) {
        console.error('Error al cargar la propiedad:', error);
        showError('Ocurrió un error al cargar la información de la propiedad');
    }
    
    // Configurar el botón de menú móvil
    setupMobileMenu();
});

/**
 * Muestra un mensaje de error y oculta el indicador de carga
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    const loadingElement = document.getElementById('property-loading');
    const errorElement = document.getElementById('property-error');
    const contentElement = document.getElementById('property-content');
    
    // Ocultar el indicador de carga y el contenido
    loadingElement.style.display = 'none';
    contentElement.style.display = 'none';
    
    // Mostrar el mensaje de error
    errorElement.style.display = 'block';
    errorElement.querySelector('p').textContent = message;
}

/**
 * Renderiza los detalles de la propiedad en el contenedor
 * @param {Object} property - Datos de la propiedad
 * @param {HTMLElement} container - Contenedor donde renderizar los detalles
 */
function renderPropertyDetails(property, container) {
    // Crear el HTML para los detalles de la propiedad con Tailwind
    const statusBg = property.operation === 'venta' ? 'bg-green-600' : 'bg-blue-600';
    const propertyHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="relative rounded-lg overflow-hidden shadow">
                <img src="${property.image_url || 'img/properties/default.jpg'}" alt="${property.title}" class="w-full h-80 object-cover">
                <span class="${statusBg} text-white text-xs px-2 py-1 rounded absolute top-2 left-2">${property.operation === 'venta' ? 'Venta' : 'Alquiler'}</span>
            </div>
            <div class="space-y-3">
                <h1 class="text-2xl font-bold">${property.title}</h1>
                <div class="text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"/></svg> <span>${property.location}</span></div>
                <div class="text-brand-700 text-2xl font-extrabold">${formatPrice(property.price, property.currency)}</div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
                    <div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7a3 3 0 013-3h10a3 3 0 013 3v8h1a1 1 0 110 2H3a1 1 0 110-2h1V7z"/><path d="M6 7v8h12V7a1 1 0 00-1-1H7a1 1 0 00-1 1z"/></svg><span>${property.bedrooms || 0} Habitaciones</span></div>
                    <div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10a3 3 0 116 0v1h4V8a2 2 0 10-4 0H9a4 4 0 00-4 4v3h14v-2h-2v-1H7v-2z"/></svg><span>${property.bathrooms || 0} Baños</span></div>
                    <div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/></svg><span>${property.area || 0} m²</span></div>
                    <div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h18l-1-3a4 4 0 00-3.8-2.7H7.8A4 4 0 004 10l-1 3zm1 0v6m16-6v6M6 19h12"/></svg><span>${property.garage || 0} Cocheras</span></div>
                </div>
            </div>
        </div>
        <div class="mt-8">
            <h2 class="text-xl font-semibold mb-2">Descripción</h2>
            <p class="text-gray-700">${property.description || 'No hay descripción disponible para esta propiedad.'}</p>
        </div>
        <div class="mt-8">
            <h2 class="text-xl font-semibold mb-3">Amenidades</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                ${renderAmenities(property.amenities)}
            </div>
        </div>
    `;
    
    // Insertar el HTML en el contenedor
    container.innerHTML = propertyHTML;
}

/**
 * Renderiza la lista de amenidades
 * @param {Array} amenities - Lista de amenidades
 * @returns {string} HTML de las amenidades
 */
function renderAmenities(amenities) {
    if (!amenities || !Array.isArray(amenities) || amenities.length === 0) {
        return '<p class="text-gray-600">No hay amenidades registradas para esta propiedad.</p>';
    }
    // Map each amenity to an SVG icon string
    const icons = {
        piscina: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0M3 14c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0"/></svg>',
        gimnasio: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h12M7 9v6m10-6v6"/></svg>',
        seguridad: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/></svg>',
        aire_acondicionado: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8h18M3 12h18M7 16h10"/></svg>',
        calefaccion: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3s4 4 4 7a4 4 0 11-8 0c0-3 4-7 4-7z"/></svg>',
        balcon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M6 10V6h12v4M6 14h12v4H6z"/></svg>',
        terraza: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18m9-9H3"/></svg>',
        jardin: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/></svg>',
        parrilla: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8h12M7 12h10M8 16h8M6 20h12"/></svg>',
        laundry: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="13" r="4"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 7h12M6 3h12M7 3l2 4m6-4l2 4"/></svg>',
        wifi: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 16.5a5 5 0 016.99 0M6 14a8 8 0 0112 0M3.5 11.5a12 12 0 0117 0M12 20h.01"/></svg>',
        estacionamiento: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 19V5h6a4 4 0 010 8H6"/></svg>',
        ascensor: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4h10v16H7zM12 8v8m-2-2l2 2 2-2"/></svg>',
        amueblado: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16v6H4zM6 12V7h12v5"/></svg>'
    };
    const fallback = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    return amenities.map(amenity => {
        const svg = icons[amenity] || fallback;
        return `
            <div class="flex items-center gap-2 p-2 rounded bg-gray-50">
                ${svg}
                <span>${formatAmenityName(amenity)}</span>
            </div>
        `;
    }).join('');
}

/**
 * Formatea el nombre de una amenidad para mostrar
 * @param {string} name - Nombre de la amenidad
 * @returns {string} Nombre formateado
 */
function formatAmenityName(name) {
    const nameMap = {
        'piscina': 'Piscina',
        'gimnasio': 'Gimnasio',
        'seguridad': 'Seguridad 24hs',
        'aire_acondicionado': 'Aire acondicionado',
        'calefaccion': 'Calefacción',
        'balcon': 'Balcón',
        'terraza': 'Terraza',
        'jardin': 'Jardín',
        'parrilla': 'Parrilla',
        'laundry': 'Lavadero',
        'wifi': 'WiFi',
        'estacionamiento': 'Estacionamiento',
        'ascensor': 'Ascensor',
        'amueblado': 'Amueblado'
    };
    
    return nameMap[name] || name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Carga y muestra propiedades relacionadas
 * @param {Object} currentProperty - Propiedad actual
 * @param {HTMLElement} container - Contenedor donde mostrar las propiedades relacionadas
 */
async function loadRelatedProperties(currentProperty, container) {
    try {
        // Obtener todas las propiedades
        const allProperties = await getAllProperties();
        
        // Filtrar propiedades relacionadas (mismo tipo y operación, pero diferente ID)
        const relatedProperties = allProperties
            .filter(property => 
                property.id !== currentProperty.id && 
                property.property_type === currentProperty.property_type &&
                property.operation === currentProperty.operation
            )
            .slice(0, 3); // Limitar a 3 propiedades relacionadas
        
        // Si no hay propiedades relacionadas, ocultar la sección
        if (relatedProperties.length === 0) {
            const relatedSection = document.querySelector('.related-properties');
            if (relatedSection) {
                relatedSection.style.display = 'none';
            }
            return;
        }
        
        // Limpiar el contenedor
        container.innerHTML = '';
        
        // Agregar cada propiedad relacionada al contenedor
        relatedProperties.forEach(property => {
            const propertyCard = createPropertyCard(property);
            container.appendChild(propertyCard);
        });
        
    } catch (error) {
        console.error('Error al cargar propiedades relacionadas:', error);
        // Ocultar la sección en caso de error
        const relatedSection = document.querySelector('.related-properties');
        if (relatedSection) {
            relatedSection.style.display = 'none';
        }
    }
}

/**
 * Crea una tarjeta de propiedad
 * @param {Object} property - Datos de la propiedad
 * @returns {HTMLElement} Elemento de la tarjeta de propiedad
 */
function createPropertyCard(property) {
    const article = document.createElement('article');
    article.className = 'rounded-lg overflow-hidden bg-white shadow hover:shadow-md transition flex flex-col';
    const statusBg = property.operation === 'venta' ? 'bg-green-600' : 'bg-blue-600';
    article.innerHTML = `
        <div class="relative">
            <img src="${property.image_url || 'img/properties/default.jpg'}" alt="${property.title}" class="w-full h-48 object-cover" loading="lazy">
            <span class="${statusBg} text-white text-xs px-2 py-1 rounded absolute top-2 left-2">${property.operation === 'venta' ? 'Venta' : 'Alquiler'}</span>
        </div>
        <div class="p-4 flex flex-col gap-2">
            <h3 class="text-lg font-semibold line-clamp-2">${property.title}</h3>
            <p class="text-gray-600 text-sm"><i class="fa fa-map-marker"></i> ${property.location}</p>
            <p class="text-brand-700 font-bold">${formatPrice(property.price, property.currency)}</p>
            <div class="flex gap-4 text-sm text-gray-700">
                <span><i class="fa fa-bed"></i> ${property.bedrooms || 0} Hab</span>
                <span><i class="fa fa-bath"></i> ${property.bathrooms || 0} Baños</span>
                <span><i class="fa fa-expand"></i> ${property.area || 0} m²</span>
            </div>
            <a href="property-detail.html?id=${property.id}" class="mt-2 inline-block bg-brand-700 hover:bg-brand-600 text-white px-4 py-2 rounded-md text-sm text-center">Ver detalles</a>
        </div>
    `;
    return article;
}

/**
 * Configura el formulario de contacto
 * @param {Object} property - Datos de la propiedad
 */
function setupContactForm(property) {
    const contactForm = document.getElementById('property-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // En una implementación real, aquí se enviaría el formulario a un servidor
            // o se guardaría en Supabase
            
            // Mostrar mensaje de éxito
            alert(`Gracias por su interés en la propiedad "${property.title}". Nos pondremos en contacto a la brevedad.`);
            
            // Limpiar el formulario
            contactForm.reset();
        });
    }
}

/**
 * Formatea el precio para mostrar
 * @param {number} price - Precio
 * @param {string} currency - Moneda
 * @returns {string} Precio formateado
 */
function formatPrice(price, currency) {
    if (!price) return 'Consultar';
    
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency || 'USD',
        maximumFractionDigits: 0
    });
    
    return formatter.format(price);
}

/**
 * Configura el menú móvil
 */
function setupMobileMenu() {
    // El manejo del menú móvil se centraliza en js/includeTemplates.js
    // Aquí solo configuramos el botón de volver arriba.
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '<i class="fa fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
}