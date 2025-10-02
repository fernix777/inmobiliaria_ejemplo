// Variables globales para manejo de imágenes
let selectedImageFile = null;
let uploadedImageUrl = null;
let charts = {}; // ✅ Declarar charts como objeto vacío

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (typeof window.supabaseClient === 'undefined') {
        console.error('Supabase client no disponible');
        window.location.href = 'login.html';
        return;
    }

    const supabaseClient = window.supabaseClient;

    // Verificar sesión
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    currentUserId = session.user.id;

    // Mostrar email del usuario
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) {
        userEmailElement.textContent = session.user.email;
    }

    // Inicializar storage (verificar bucket)
    try {
        await initializeStorage();
    } catch (error) {
        console.warn('Storage no disponible:', error);
    }

    // Inicializar
    await loadProperties();
    initializeEventListeners();
    initializeCharts();
});

// Cargar propiedades
async function loadProperties() {
    try {
        const { data, error } = await window.supabaseClient
            .from('properties')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error detallado de Supabase:', error);

            // Si el error es por tabla no encontrada, mostrar mensaje específico
            if (error.message.includes('relation "properties" does not exist')) {
                showNotification('La tabla "properties" no existe en la base de datos. Ejecuta el script SQL de configuración en Supabase Dashboard.', 'error');
                return;
            }

            throw error;
        }

        allProperties = data || [];
        updateDashboardStats();

        // Solo actualizar gráficos si están inicializados
        if (charts.byType || charts.byOperation) {
            updateCharts();
        }

        renderRecentProperties();
        renderPropertiesTable();
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
        showNotification('Error al cargar propiedades. Verifica la configuración de Supabase.', 'error');
    }
}

// Actualizar estadísticas
function updateDashboardStats() {
    const total = allProperties.length;
    const forSale = allProperties.filter(p => p.operation === 'venta').length;
    const forRent = allProperties.filter(p => p.operation === 'alquiler').length;
    const totalValue = allProperties
        .filter(p => p.price && p.currency === 'USD')
        .reduce((sum, p) => sum + (p.price || 0), 0);

    document.getElementById('totalProperties').textContent = total;
    document.getElementById('forSaleCount').textContent = forSale;
    document.getElementById('forRentCount').textContent = forRent;
    document.getElementById('totalValue').textContent = formatCurrency(totalValue, 'USD');
}

// Inicializar gráficos
function initializeCharts() {
    // Verificar que Chart.js esté disponible
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js no está disponible');
        return;
    }

    // Gráfico por tipo
    const typeCtx = document.getElementById('propertiesByTypeChart');
    if (typeCtx && !charts.byType) {
        charts.byType = new Chart(typeCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#3B82F6', // blue
                        '#10B981', // green
                        '#F59E0B', // amber
                        '#EF4444', // red
                        '#8B5CF6'  // purple
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico por operación
    const opCtx = document.getElementById('propertiesByOperationChart');
    if (opCtx && !charts.byOperation) {
        charts.byOperation = new Chart(opCtx, {
            type: 'bar',
            data: {
                labels: ['Venta', 'Alquiler'],
                datasets: [{
                    label: 'Propiedades',
                    data: [0, 0],
                    backgroundColor: ['#10B981', '#8B5CF6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Actualizar gráficos
function updateCharts() {
    // Verificar que los gráficos estén inicializados
    if (!charts.byType && !charts.byOperation) {
        console.warn('Gráficos no inicializados, intentando inicializar...');
        initializeCharts();
    }

    // Por tipo
    if (charts.byType) {
        const typeCounts = {};
        allProperties.forEach(p => {
            const type = p.property_type || p.type || 'Otro';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        charts.byType.data.labels = Object.keys(typeCounts);
        charts.byType.data.datasets[0].data = Object.values(typeCounts);
        charts.byType.update();
    }

    // Por operación
    if (charts.byOperation) {
        const saleCount = allProperties.filter(p => p.operation === 'venta').length;
        const rentCount = allProperties.filter(p => p.operation === 'alquiler').length;

        charts.byOperation.data.datasets[0].data = [saleCount, rentCount];
        charts.byOperation.update();
    }
}

// Renderizar propiedades recientes
function renderRecentProperties() {
    const container = document.getElementById('recentPropertiesList');
    if (!container) return;

    const recent = allProperties.slice(0, 5);

    if (recent.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay propiedades aún</p>';
        return;
    }

    container.innerHTML = recent.map(p => `
        <div class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
            <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                ${p.image_url ? 
                    `<img src="${p.image_url}" alt="${p.title}" class="w-full h-full object-cover">` :
                    `<div class="w-full h-full flex items-center justify-center bg-brand-100">
                        <svg class="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                    </div>`
                }
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 truncate">${p.title}</h4>
                <p class="text-sm text-gray-500">${p.location || 'Sin ubicación'}</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-brand-600">${formatCurrency(p.price, p.currency)}</p>
                <span class="inline-block px-2 py-1 text-xs font-medium rounded ${
                    p.operation === 'venta' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }">${p.operation === 'venta' ? 'Venta' : 'Alquiler'}</span>
            </div>
        </div>
    `).join('');
}

// Renderizar tabla de propiedades
function renderPropertiesTable() {
    const container = document.getElementById('propertiesTableContainer');
    if (!container) return;

    if (allProperties.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay propiedades</h3>
                <p class="text-gray-500 mb-4">Comienza agregando tu primera propiedad</p>
                <button onclick="openModal()" class="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Nueva Propiedad
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Propiedad</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ubicación</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Operación</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                        <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${allProperties.map(p => `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        ${p.image_url ? 
                                            `<img src="${p.image_url}" alt="${p.title}" class="w-full h-full object-cover">` :
                                            `<div class="w-full h-full flex items-center justify-center bg-brand-100">
                                                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                                </svg>
                                            </div>`
                                        }
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">${p.title}</p>
                                        <p class="text-sm text-gray-500">${p.bedrooms || 0} hab • ${p.bathrooms || 0} baños • ${p.area || 0} m²</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">${p.location || '-'}</td>
                            <td class="px-6 py-4">
                                <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 capitalize">
                                    ${p.property_type || p.type || '-'}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-block px-2 py-1 text-xs font-medium rounded capitalize ${
                                    p.operation === 'venta' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                }">${p.operation || '-'}</span>
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900">${formatCurrency(p.price, p.currency)}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button onclick="editProperty('${p.id}')" class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition" title="Editar">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button onclick="deleteProperty('${p.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Event Listeners
function initializeEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.dataset.section) {
                e.preventDefault();
                switchSection(link.dataset.section);
            }
        });
    });

    // Modal
    const btnAdd = document.getElementById('btnAddProperty');
    const btnClose = document.getElementById('btnCloseModal');
    const btnCancel = document.getElementById('btnCancelProperty');
    const modal = document.getElementById('propertyModal');
    const form = document.getElementById('propertyForm');

    if (btnAdd) btnAdd.addEventListener('click', () => openModal());
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Image preview
    const imageUrlInput = document.getElementById('pf_image_url');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            const preview = document.getElementById('imagePreview');
            const img = document.getElementById('imagePreviewImg');
            
            if (url && isValidUrl(url)) {
                img.src = url;
                preview.classList.remove('hidden');
            } else {
                preview.classList.add('hidden');
            }
        });
    }
}

// Switch sections
function switchSection(section) {
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'bg-white/10');
        if (link.dataset.section === section) {
            link.classList.add('active', 'bg-white/10');
        }
    });

    // Update content
    document.querySelectorAll('.section-content').forEach(content => {
        content.classList.add('hidden');
    });

    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        properties: 'Mis Propiedades'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
}

// Modal functions
function openModal(editing = false, data = null) {
    const modal = document.getElementById('propertyModal');
    const form = document.getElementById('propertyForm');
    const title = document.getElementById('modalTitle');

    // Limpiar variables de imagen
    selectedImageFile = null;
    uploadedImageUrl = null;

    if (editing && data) {
        currentEditingId = data.id;
        title.textContent = 'Editar Propiedad';

        // Fill form
        document.getElementById('pf_title').value = data.title || '';
        document.getElementById('pf_location').value = data.location || '';
        document.getElementById('pf_operation').value = data.operation || 'venta';
        document.getElementById('pf_type').value = data.property_type || data.type || '';
        document.getElementById('pf_price').value = data.price || '';
        document.getElementById('pf_currency').value = data.currency || 'USD';
        document.getElementById('pf_bedrooms').value = data.bedrooms || '';
        document.getElementById('pf_bathrooms').value = data.bathrooms || '';
        document.getElementById('pf_area').value = data.area || '';
        document.getElementById('pf_image_url').value = data.image_url || '';
        document.getElementById('pf_description').value = data.description || '';

        // Show image preview si existe URL
        if (data.image_url) {
            document.getElementById('imagePreviewImg').src = data.image_url;
            document.getElementById('imagePreview').classList.remove('hidden');
        }

        // Ocultar preview de archivo
        document.getElementById('filePreview').classList.add('hidden');
    } else {
        currentEditingId = null;
        title.textContent = 'Nueva Propiedad';
        form.reset();
        document.getElementById('imagePreview').classList.add('hidden');
        document.getElementById('filePreview').classList.add('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    currentEditingId = null;
}

// Form submit
async function handleFormSubmit(e) {
    e.preventDefault();

    const btn = document.getElementById('btnSaveProperty');
    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
        let finalImageUrl = null;

        // Si hay un archivo seleccionado, intentar subirlo
        if (selectedImageFile) {
            try {
                showNotification('Subiendo imagen...', 'info');
                finalImageUrl = await uploadImageToStorage(selectedImageFile);
                uploadedImageUrl = finalImageUrl;
                showNotification('Imagen subida correctamente', 'success');
            } catch (uploadError) {
                console.error('Error al subir imagen:', uploadError);
                // Si hay error de storage, usar la URL si existe, sino continuar sin imagen
                if (document.getElementById('pf_image_url').value.trim()) {
                    finalImageUrl = document.getElementById('pf_image_url').value.trim();
                    showNotification('Error al subir imagen local. Usando URL alternativa.', 'error');
                } else {
                    showNotification('Error al subir imagen. Puedes continuar sin imagen o usar una URL.', 'error');
                    finalImageUrl = null;
                }
            }
        } else {
            // Si no hay archivo, usar la URL si existe
            finalImageUrl = document.getElementById('pf_image_url').value.trim() || null;
        }

        const formData = {
            title: document.getElementById('pf_title').value.trim(),
            location: document.getElementById('pf_location').value.trim(),
            operation: document.getElementById('pf_operation').value,
            property_type: document.getElementById('pf_type').value,
            price: parseFloat(document.getElementById('pf_price').value) || null,
            currency: document.getElementById('pf_currency').value,
            bedrooms: parseInt(document.getElementById('pf_bedrooms').value) || null,
            bathrooms: parseInt(document.getElementById('pf_bathrooms').value) || null,
            area: parseFloat(document.getElementById('pf_area').value) || null,
            image_url: finalImageUrl,
            description: document.getElementById('pf_description').value.trim() || null
        };

        if (currentEditingId) {
            // Update
            const { error } = await window.supabaseClient
                .from('properties')
                .update(formData)
                .eq('id', currentEditingId)
                .eq('user_id', currentUserId);

            if (error) throw error;
            showNotification('Propiedad actualizada exitosamente', 'success');
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('properties')
                .insert([{ ...formData, user_id: currentUserId }]);

            if (error) throw error;
            showNotification('Propiedad creada exitosamente', 'success');
        }

        closeModal();
        await loadProperties();
    } catch (error) {
        console.error('Error al guardar:', error);
        showNotification('Error al guardar la propiedad: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar Propiedad';
    }
}

// Edit property
async function editProperty(id) {
    const property = allProperties.find(p => p.id === id);
    if (property) {
        openModal(true, property);
    }
}

// Delete property
async function deleteProperty(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('properties')
            .delete()
            .eq('id', id)
            .eq('user_id', currentUserId);

        if (error) throw error;

        showNotification('Propiedad eliminada exitosamente', 'success');
        await loadProperties();
    } catch (error) {
        console.error('Error al eliminar:', error);
        showNotification('Error al eliminar la propiedad', 'error');
    }
}

// Logout
async function logout() {
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        if (!error) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Utilities
function formatCurrency(value, currency = 'USD') {
    if (!value) return 'Consultar';
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(value);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[200] animate-fade-in`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para manejar selección de archivo local
function handleImageFile(input) {
    const file = input.files[0];
    if (!file) {
        selectedImageFile = null;
        document.getElementById('filePreview').classList.add('hidden');
        return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor selecciona un archivo de imagen válido', 'error');
        input.value = '';
        return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen debe ser menor a 5MB', 'error');
        input.value = '';
        return;
    }

    selectedImageFile = file;

    // Mostrar preview
    const preview = document.getElementById('filePreview');
    const img = document.getElementById('filePreviewImg');

    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);

    // Ocultar preview de URL si existe
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('pf_image_url').value = '';
}

// Función para inicializar storage bucket
async function initializeStorage() {
    try {
        const supabaseClient = window.supabaseClient;

        // Verificar si el bucket existe
        const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();

        if (listError) {
            console.error('Error al listar buckets:', listError);
            showNotification('Error al conectar con el servicio de almacenamiento. Verifica tu configuración de Supabase.', 'error');
            return false;
        }

        const bucketExists = buckets.some(bucket => bucket.name === 'property-images');

        if (!bucketExists) {
            console.log('El bucket property-images no existe');
            showNotification('El servicio de almacenamiento no está configurado. Ejecuta el script SQL completo en Supabase Dashboard.', 'error');
            return false;
        }

        console.log('✅ Storage inicializado correctamente');
        return true;
    } catch (error) {
        console.error('Error al inicializar storage:', error);
        showNotification('Error al inicializar el servicio de almacenamiento.', 'error');
        return false;
    }
}

// Función para subir imagen a Supabase Storage
async function uploadImageToStorage(file) {
    try {
        const supabaseClient = window.supabaseClient;

        // Verificar inicialización del storage
        const storageReady = await initializeStorage();
        if (!storageReady) {
            throw new Error('Storage no inicializado correctamente');
        }

        // Crear nombre único para el archivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `properties/${currentUserId}/${fileName}`;

        console.log('Subiendo archivo:', filePath);

        // Subir archivo
        const { data, error } = await supabaseClient.storage
            .from('property-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error al subir imagen:', error);

            // Si el error es por bucket no encontrado, mostrar mensaje específico
            if (error.message.includes('Bucket not found')) {
                showNotification('El bucket "property-images" no existe. Crea el bucket en Supabase Dashboard con el script SQL proporcionado.', 'error');
            }

            throw error;
        }

        console.log('Archivo subido correctamente:', data);

        // Obtener URL pública
        const { data: urlData } = supabaseClient.storage
            .from('property-images')
            .getPublicUrl(filePath);

        console.log('URL pública obtenida:', urlData.publicUrl);
        return urlData.publicUrl;

    } catch (error) {
        console.error('Error en uploadImageToStorage:', error);
        throw error;
    }
}
