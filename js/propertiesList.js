// Importar los servicios de Supabase
import { getAllProperties, searchProperties } from './propertyService.js';

// Variables globales
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 9;

document.addEventListener('DOMContentLoaded', async function() {
    // Elementos del DOM
    const propertiesGrid = document.getElementById('properties-grid');
    const propertiesLoading = document.getElementById('properties-loading');
    const noPropertiesMessage = document.getElementById('no-properties-message');
    const propertiesTotalElement = document.getElementById('properties-total');
    const paginationElement = document.getElementById('pagination');
    const sortSelect = document.getElementById('sort-properties');
    const filterForm = document.getElementById('advanced-filter-form');
    const resetButton = document.querySelector('.reset-btn');
    
    // Cargar todas las propiedades al iniciar
    try {
        // Obtener todas las propiedades
        allProperties = await getAllProperties();
        
        // Inicializar propiedades filtradas con todas las propiedades
        filteredProperties = [...allProperties];
        
        // Actualizar contador de propiedades
        updatePropertiesCount();
        
        // Ordenar propiedades (por defecto, las más recientes primero)
        sortProperties('newest');
        
        // Ocultar indicador de carga (Tailwind)
        propertiesLoading.classList.add('hidden');
        
        // Mostrar propiedades
        renderProperties();
        
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
        propertiesLoading.classList.add('hidden');
        showNoPropertiesMessage('Error al cargar las propiedades. Por favor, intente nuevamente más tarde.');
    }
    
    // Event listener para ordenar propiedades
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProperties(this.value);
            renderProperties();
        });
    }
    
    // Event listener para filtrar propiedades
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Event listener para resetear filtros
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Resetear el formulario
            filterForm.reset();
            
            // Resetear filtros
            filteredProperties = [...allProperties];
            currentPage = 1;
            
            // Actualizar contador y renderizar
            updatePropertiesCount();
            sortProperties(sortSelect.value);
            renderProperties();
        });
    }
    
    // Configurar utilidades de página (sin interferir con menú móvil centralizado)
    setupMobileMenu();
    
    /**
     * Renderiza las propiedades en la grilla con paginación
     */
    function renderProperties() {
        if (!propertiesGrid) return;
        
        // Calcular propiedades para la página actual
        const startIndex = (currentPage - 1) * propertiesPerPage;
        const endIndex = startIndex + propertiesPerPage;
        const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
        
        // Limpiar la grilla
        propertiesGrid.innerHTML = '';
        
        // Verificar si hay propiedades para mostrar
        if (paginatedProperties.length === 0) {
            noPropertiesMessage.classList.remove('hidden');
            paginationElement.classList.add('hidden');
            return;
        }
        
        // Ocultar mensaje de no propiedades
        noPropertiesMessage.classList.add('hidden');
        
        // Agregar cada propiedad a la grilla
        paginatedProperties.forEach(property => {
            const propertyCard = createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        });
        
        // Actualizar paginación
        renderPagination();
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
     * Renderiza la paginación
     */
    function renderPagination() {
        if (!paginationElement) return;
        
        // Calcular número total de páginas
        const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
        
        // No mostrar paginación si solo hay una página
        if (totalPages <= 1) {
            paginationElement.classList.add('hidden');
            return;
        }
        
        // Mostrar paginación
        paginationElement.classList.remove('hidden');
        
        // Limpiar paginación
        paginationElement.innerHTML = '';
        
        // Botón anterior
        const prevButton = document.createElement('button');
        prevButton.className = `px-3 py-1 rounded border text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`;
        prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProperties();
                // Scroll al inicio de la sección
                document.querySelector('.properties-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationElement.appendChild(prevButton);
        
        // Botones de página
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Ajustar startPage si estamos cerca del final
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Agregar botones de página
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `px-3 py-1 rounded border text-sm ${i === currentPage ? 'bg-brand-700 text-white border-brand-700' : 'hover:bg-gray-100'}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderProperties();
                // Scroll al inicio de la sección
                document.querySelector('.properties-section').scrollIntoView({ behavior: 'smooth' });
            });
            paginationElement.appendChild(pageButton);
        }
        
        // Botón siguiente
        const nextButton = document.createElement('button');
        nextButton.className = `px-3 py-1 rounded border text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`;
        nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProperties();
                // Scroll al inicio de la sección
                document.querySelector('.properties-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationElement.appendChild(nextButton);
    }
    
    /**
     * Ordena las propiedades según el criterio seleccionado
     * @param {string} sortBy - Criterio de ordenamiento
     */
    function sortProperties(sortBy) {
        switch (sortBy) {
            case 'newest':
                // Ordenar por ID (asumiendo que IDs más altos son más recientes)
                filteredProperties.sort((a, b) => b.id - a.id);
                break;
            case 'price-asc':
                // Ordenar por precio ascendente
                filteredProperties.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                // Ordenar por precio descendente
                filteredProperties.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'area-asc':
                // Ordenar por área ascendente
                filteredProperties.sort((a, b) => (a.area || 0) - (b.area || 0));
                break;
            case 'area-desc':
                // Ordenar por área descendente
                filteredProperties.sort((a, b) => (b.area || 0) - (a.area || 0));
                break;
            default:
                // Por defecto, ordenar por más recientes
                filteredProperties.sort((a, b) => b.id - a.id);
        }
    }
    
    /**
     * Aplica los filtros seleccionados a las propiedades
     */
    function applyFilters() {
        // Obtener valores de los filtros
        const propertyType = document.getElementById('filter-type').value;
        const operation = document.getElementById('filter-operation').value;
        const location = document.getElementById('filter-location').value;
        const priceRange = document.getElementById('filter-price-range').value;
        const bedrooms = document.getElementById('filter-bedrooms').value;
        const bathrooms = document.getElementById('filter-bathrooms').value;
        const areaMin = document.getElementById('filter-area-min').value;
        const areaMax = document.getElementById('filter-area-max').value;
        
        // Obtener amenidades seleccionadas
        const amenities = [];
        // Corregido: el HTML usa .amenities-options como contenedor de checkboxes
        document.querySelectorAll('.amenities-options input[type="checkbox"]:checked').forEach(checkbox => {
            amenities.push(checkbox.value);
        });
        
        // Filtrar propiedades
        filteredProperties = allProperties.filter(property => {
            // Filtrar por tipo de propiedad
            if (propertyType && property.property_type !== propertyType) {
                return false;
            }
            
            // Filtrar por operación
            if (operation && property.operation !== operation) {
                return false;
            }
            
            // Filtrar por ubicación
            if (location && property.location !== location) {
                return false;
            }
            
            // Filtrar por rango de precio
            if (priceRange) {
                const [min, max] = priceRange.split('-');
                if (min && max && (property.price < parseInt(min) || property.price > parseInt(max))) {
                    return false;
                } else if (min && !max && property.price < parseInt(min)) {
                    return false;
                }
            }
            
            // Filtrar por número de habitaciones
            if (bedrooms && property.bedrooms < parseInt(bedrooms)) {
                return false;
            }
            
            // Filtrar por número de baños
            if (bathrooms && property.bathrooms < parseInt(bathrooms)) {
                return false;
            }
            
            // Filtrar por área mínima
            if (areaMin && property.area < parseInt(areaMin)) {
                return false;
            }
            
            // Filtrar por área máxima
            if (areaMax && property.area > parseInt(areaMax)) {
                return false;
            }
            
            // Filtrar por amenidades
            if (amenities.length > 0) {
                // Verificar que la propiedad tenga todas las amenidades seleccionadas
                if (!property.amenities || !Array.isArray(property.amenities)) {
                    return false;
                }
                
                for (const amenity of amenities) {
                    if (!property.amenities.includes(amenity)) {
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        // Resetear a la primera página
        currentPage = 1;
        
        // Actualizar contador de propiedades
        updatePropertiesCount();
        
        // Ordenar propiedades
        sortProperties(sortSelect.value);
        
        // Renderizar propiedades
        renderProperties();
    }
    
    /**
     * Actualiza el contador de propiedades
     */
    function updatePropertiesCount() {
        if (propertiesTotalElement) {
            propertiesTotalElement.textContent = filteredProperties.length;
        }
    }
    
    /**
     * Muestra un mensaje de no propiedades personalizado
     * @param {string} message - Mensaje a mostrar
     */
    function showNoPropertiesMessage(message) {
        if (noPropertiesMessage) {
            noPropertiesMessage.querySelector('p').textContent = message;
            noPropertiesMessage.style.display = 'block';
        }
    }
});

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