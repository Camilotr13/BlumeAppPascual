/**
 * auth.js
 * Manejo de autenticación, tokens JWT y protección de rutas
 */

/**
 * Guarda los datos de autenticación en localStorage
 */
function saveAuthData(accessToken, refreshToken, user, rememberMe = false) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('current_user', JSON.stringify(user));
    
    if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
    }
}

/**
 * Obtiene el usuario actual
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Verifica si el usuario está autenticado
 */
function isAuthenticated() {
    return !!localStorage.getItem('access_token');
}

/**
 * Verifica si el usuario tiene un rol específico
 */
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

/**
 * Requiere autenticación para acceder a una página
 * Si no está autenticado, redirige a login
 * Si role es especificado, verifica que el usuario tenga ese rol
 */
function requireAuth(role = null) {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (role && !hasRole(role)) {
        showNotification('No tienes permisos para acceder a esta página', 'error');
        redirectToDashboard();
    }
}

/**
 * Redirige al dashboard correspondiente según el rol del usuario
 */
function redirectToDashboard() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const dashboards = {
        'admin': 'dashboard-admin.html',
        'company': 'dashboard-company.html',
        'student': 'dashboard-student.html',
        'teacher': 'dashboard-teacher.html'
    };
    
    window.location.href = dashboards[user.role] || 'index.html';
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('remember_me');
    window.location.href = 'login.html';
}

/**
 * Refresca el access token usando el refresh token
 * Llamar esto cuando el access token expire (401)
 */
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        logout();
        return null;
    }
    
    try {
        if (MOCK_MODE) {
            // En modo mock, generar nuevo token
            const newAccessToken = 'mock_access_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('access_token', newAccessToken);
            return newAccessToken;
        }
        
        // Llamada real a la API
        const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });
        
        if (!response.ok) {
            throw new Error('Token refresh failed');
        }
        
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
        
    } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
        return null;
    }
}