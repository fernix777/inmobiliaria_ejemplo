// Importar los servicios de propiedades
import { getAllProperties, searchProperties } from './propertyService.js';
import ErrorHandler from './utils/errorHandler.js';
import { ImageOptimizer } from './utils/imageOptimizer.js';
import { PerformanceMonitor } from './utils/performance.js';

document.addEventListener('DOMContentLoaded', async function() {
    PerformanceMonitor.start('pageLoad');
    
    // Initialize lazy loading for images
    ImageOptimizer.initLazyLoading();
    // Menú móvil unificado: el toggle está centralizado en js/includeTemplates.js

    // Scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7M12 3v18"/></svg>';
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.remove('opacity-0','invisible');
            scrollTopBtn.classList.add('opacity-100','visible');
        } else {
            scrollTopBtn.classList.add('opacity-0','invisible');
            scrollTopBtn.classList.remove('opacity-100','visible');
        }
    });

    // Create scroll to top button with Tailwind classes
    scrollTopBtn.classList.add(
        'fixed','bottom-5','right-5','w-12','h-12','rounded-full','bg-brand-700','text-white',
        'border','border-transparent','cursor-pointer','flex','items-center','justify-center',
        'text-xl','z-[999]','opacity-0','invisible','transition','duration-300','hover:bg-brand-600',
        'sm:bottom-6','sm:right-6','sm:w-12','sm:h-12','sm:text-xl'
    );

    // Hint: El menú móvil se maneja desde includeTemplates.js

    // Cargar propiedades destacadas al iniciar la página
    try {
        const featuredProperties = await getAllProperties();
        renderProperties(featuredProperties.slice(0, 6)); // Mostrar las primeras 6 propiedades
    } catch (error) {
        console.error('Error al cargar propiedades destacadas:', error);
        ErrorHandler.handle(error, { context: 'loadFeaturedProperties' });
    }
    
    PerformanceMonitor.end('pageLoad');

    // Property search form functionality
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const propertyType = document.getElementById('property-type').value;
            const operation = document.getElementById('operation').value;
            const location = document.getElementById('location').value;
            const priceRange = document.getElementById('price-range').value;
            
            // Crear objeto de filtros
            const filters = {
                propertyType,
                operation,
                location,
                priceRange
            };
            
            try {
                // Mostrar indicador de carga
                showLoadingIndicator();
                
                // Buscar propiedades con los filtros
                const filteredProperties = await searchProperties(filters);
                
                // Ocultar indicador de carga
                hideLoadingIndicator();
                
                // Renderizar resultados
                renderProperties(filteredProperties);
                
                // Mostrar mensaje si no hay resultados
                if (filteredProperties.length === 0) {
                    showNoResultsMessage();
                } else {
                    ErrorHandler.showNotification({
                        type: 'success',
                        message: `Se encontraron ${filteredProperties.length} propiedades`,
                        duration: 3000
                    });
                }
            } catch (error) {
                console.error('Error al buscar propiedades:', error);
                hideLoadingIndicator();
                ErrorHandler.handle(error, { context: 'searchProperties' });
            }
        });
    }
    
    // Función para renderizar propiedades en la grilla
    function renderProperties(properties) {
        const propertyGrid = document.querySelector('.property-grid');
        if (!propertyGrid) return;
        
        // Limpiar la grilla actual
        propertyGrid.innerHTML = '';
        
        // Agregar cada propiedad a la grilla
        properties.forEach(property => {
            const propertyCard = createPropertyCard(property);
            propertyGrid.appendChild(propertyCard);
        });
    }
    
    // Función para crear una tarjeta de propiedad
    function createPropertyCard(property) {
        const article = document.createElement('article');
        article.className = 'rounded-lg overflow-hidden bg-white shadow hover:shadow-md transition flex flex-col';
        article.setAttribute('role', 'listitem');
        const statusBg = property.operation === 'venta' ? 'bg-green-600' : 'bg-blue-600';
        const imageUrl = property.image_url || 'img/properties/default.jpg';
        article.innerHTML = `
            <div class="relative">
                <img data-src="${imageUrl}" alt="${property.title}" class="w-full h-48 object-cover" loading="lazy" width="400" height="300">
                <span class="${statusBg} text-white text-xs px-2 py-1 rounded absolute top-2 left-2" role="status">${property.operation === 'venta' ? 'Venta' : 'Alquiler'}</span>
            </div>
            <div class="p-4 flex flex-col gap-2">
                <h3 class="text-lg font-semibold line-clamp-2">${property.title}</h3>
                <p class="text-gray-600 text-sm"><svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"/></svg>${property.location}</p>
                <p class="text-brand-700 font-bold">${formatPrice(property.price, property.currency)}</p>
                <div class="flex gap-4 text-sm text-gray-700">
                    <span><svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7a3 3 0 013-3h10a3 3 0 013 3v8h1a1 1 0 110 2H3a1 1 0 110-2h1V7z"/><path d="M6 7v8h12V7a1 1 0 00-1-1H7a1 1 0 00-1 1z"/></svg> ${property.bedrooms || 0} Hab</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10a3 3 0 116 0v1h4V8a2 2 0 10-4 0H9a4 4 0 00-4 4v3h14v-2h-2v-1H7v-2z"/></svg> ${property.bathrooms || 0} Baños</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/></svg> ${property.area || 0} m²</span>
                </div>
                <a href="property-detail.html?id=${property.id}" class="mt-2 inline-block bg-brand-700 hover:bg-brand-600 text-white px-4 py-2 rounded-md text-sm text-center" aria-label="Ver detalles de ${property.title}">Ver detalles</a>
            </div>
        `;
        // Initialize lazy loading for the new image
        setTimeout(() => {
            const img = article.querySelector('img[data-src]');
            if (img) ImageOptimizer.loadImage(img);
        }, 0);
        
        return article;
    }
    
    // Función para formatear el precio
    function formatPrice(price, currency) {
        if (!price) return 'Consultar';
        
        const formatter = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: 0
        });
        
        return formatter.format(price);
    }
    
    // Funciones para mostrar/ocultar indicadores
    function showLoadingIndicator() {
        let loader = document.querySelector('#search-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'search-loader';
            loader.className = 'mt-4 inline-flex items-center gap-2 text-brand-700';
            loader.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v2m0 12v2m8-8h-2M6 12H4m12.364 5.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414"/></svg><span>Buscando propiedades...</span>';
            const parent = document.querySelector('.property-search .container') || document.querySelector('.property-search');
            parent && parent.appendChild(loader);
        }
        loader.classList.remove('hidden');
    }
    
    function hideLoadingIndicator() {
        const loader = document.querySelector('#search-loader');
        if (loader) loader.classList.add('hidden');
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'p-4 rounded-md bg-red-50 text-red-700';
        errorDiv.textContent = message;
        const propertyGrid = document.querySelector('.property-grid');
        if (propertyGrid) {
            propertyGrid.innerHTML = '';
            propertyGrid.appendChild(errorDiv);
        }
    }
    
    function showNoResultsMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'p-4 rounded-md bg-yellow-50 text-yellow-800 flex items-center gap-2';
        messageDiv.innerHTML = '<i class="fa fa-info-circle"></i><span>No se encontraron propiedades con los criterios seleccionados. Por favor, intente con otros filtros.</span>';
        const propertyGrid = document.querySelector('.property-grid');
        if (propertyGrid) {
            propertyGrid.appendChild(messageDiv);
        }
    }
});