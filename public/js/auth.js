// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el cliente global de Supabase esté disponible
    if (typeof window.supabaseClient === 'undefined') {
        console.error('Error: El cliente de Supabase no se ha inicializado correctamente');
        return;
    }
    
    // Usar el cliente global inicializado en js/supabaseClient.js
    const supabaseClient = window.supabaseClient;
    
    // Obtener referencias a los elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('registerLink');
    const errorMessage = document.getElementById('errorMessage');
    
    // Función para mostrar mensajes de error
    function showError(message) {
        // Usar la nueva función del login mejorado si existe
        if (typeof window.showLoginError === 'function') {
            window.showLoginError(message);
        } else if (errorMessage) {
            const errorText = document.getElementById('errorText');
            if (errorText) {
                errorText.textContent = message;
            } else {
                errorMessage.textContent = message;
            }
            errorMessage.classList.remove('hidden');
            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 5000);
        } else {
            console.error('Error:', message);
            alert(message); // Fallback
        }
    }
    
    // Función para manejar el inicio de sesión
    async function handleLogin(email, password) {
        // Mostrar indicador de carga en el botón
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Mostrar mensaje de éxito
            submitButton.innerHTML = `
                <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
            
            // Redirigir al dashboard después del inicio de sesión exitoso
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Mostrar error específico
            let errorMsg = 'Error al iniciar sesión';
            if (error.message.includes('Invalid login credentials')) {
                errorMsg = 'Usuario o contraseña incorrectos';
            } else if (error.message.includes('Email not confirmed')) {
                errorMsg = 'Por favor confirma tu email antes de iniciar sesión';
            } else if (error.message.includes('network')) {
                errorMsg = 'Error de conexión. Verifica tu internet';
            }
            
            showError(errorMsg);
        }
    }
    
    // Configurar el formulario de inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password);
        });
    }
    
    // Configurar el enlace de registro
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Funcionalidad de registro no implementada aún.');
        });
    }
    
    // Verificar si el usuario ya está autenticado
    async function checkAuth() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
        if (session && window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
        
        // Si el usuario no está autenticado y está en una página protegida, redirigir al login
        if (!session && window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
    
    // Verificar autenticación al cargar la página
    checkAuth();
    
    // Hacer la función de logout accesible globalmente
    window.logout = async function() {
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
            window.location.href = 'login.html';
        }
    };
});
