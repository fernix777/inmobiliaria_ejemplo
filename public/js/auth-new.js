// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Usar el cliente global unificado
    const supabaseClient = window.supabaseClient;
    if (!supabaseClient) {
        console.error('Supabase client no se ha inicializado. Asegúrate de cargar js/supabaseClient.js.');
        return;
    }
    
    // Función para mostrar mensajes de error
    function showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            console.error('Error:', message);
        }
    }
    
    // Función para manejar el inicio de sesión
    async function handleLogin(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Redirigir al dashboard después del inicio de sesión exitoso
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            showError('Usuario o contraseña incorrectos');
        }
    }

    // Configurar el formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password);
        });
    }

    // Configurar el enlace de registro
    const registerLink = document.getElementById('registerLink');
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
        if (session && window.location.pathname.endsWith('login.html')) {
            window.location.href = 'dashboard.html';
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
