/**
 * api.js
 * Wrapper centralizado para todas las llamadas a la API
 * Maneja autenticación, headers y modo mock
 * 
 * CONEXIÓN CON BACKEND:
 * Para conectar con Django, cambiar API_BASE_URL y establecer MOCK_MODE = false en mockData.js
 */

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api'; // Cambiar por la URL real del backend Django

/**
 * Simula un delay de red para hacer el mock más realista
 */
function mockDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene los headers comunes para las peticiones
 */
function getHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('access_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

/**
 * Maneja errores de la API
 */
function handleApiError(error, response) {
    if (response && response.status === 401) {
        // Token expirado, redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
        window.location.href = 'login.html';
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    throw error;
}

/**
 * AUTENTICACIÓN
 */

// POST /api/auth/login/
async function apiLogin(email, password) {
    if (MOCK_MODE) {
        await mockDelay();
        const users = MockDB.users.getAll();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Credenciales incorrectas');
        }
        
        // Generar tokens falsos
        const accessToken = 'mock_access_' + Math.random().toString(36).substr(2, 9);
        const refreshToken = 'mock_refresh_' + Math.random().toString(36).substr(2, 9);
        
        // No incluir password en la respuesta
        const { password: _, ...userWithoutPassword } = user;
        
        return {
            access: accessToken,
            refresh: refreshToken,
            user: userWithoutPassword
        };
    }
    
    // Llamada real a la API
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        throw new Error('Credenciales incorrectas');
    }
    
    return await response.json();
}

// POST /api/auth/register/
async function apiRegister(userData) {
    if (MOCK_MODE) {
        await mockDelay();
        const users = MockDB.users.getAll();
        
        // Verificar si el email ya existe
        if (users.find(u => u.email === userData.email)) {
            throw new Error('El correo electrónico ya está registrado');
        }
        
        const newUser = MockDB.users.create(userData);
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    
    // Llamada real a la API
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al registrarse');
    }
    
    return await response.json();
}

// POST /api/auth/forgot-password/
async function apiForgotPassword(email) {
    if (MOCK_MODE) {
        await mockDelay();
        const user = MockDB.users.getByEmail(email);
        if (!user) {
            throw new Error('Email no encontrado');
        }
        return { message: 'Email enviado' };
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
    }
    
    return await response.json();
}

// POST /api/auth/change-password/
async function apiChangePassword(token, newPassword) {
    if (MOCK_MODE) {
        await mockDelay();
        // En mock, simplemente simular éxito
        return { message: 'Contraseña cambiada exitosamente' };
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword })
    });
    
    if (!response.ok) {
        throw new Error('Token inválido o expirado');
    }
    
    return await response.json();
}

/**
 * OFERTAS
 */

// GET /api/offers/
async function apiGetOffers(params = {}) {
    if (MOCK_MODE) {
        await mockDelay();
        let offers = MockDB.offers.getAll();
        
        // Filtrar por parámetros
        if (params.status) {
            offers = offers.filter(o => o.status === params.status);
        }
        if (params.company_id) {
            offers = offers.filter(o => o.company_id === params.company_id);
        }
        if (params.career) {
            offers = offers.filter(o => o.career === params.career);
        }
        if (params.type) {
            offers = offers.filter(o => o.type === params.type);
        }
        if (params.search) {
            const search = params.search.toLowerCase();
            offers = offers.filter(o => 
                o.title.toLowerCase().includes(search) ||
                o.description.toLowerCase().includes(search) ||
                o.company_name.toLowerCase().includes(search) ||
                o.career.toLowerCase().includes(search)
            );
        }
        
        return offers;
    }
    
    // Construir query string
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/offers/?${queryParams}`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener ofertas'), response);
    }
    
    const data = await response.json();
    return data.results || data;
}

// GET /api/offers/{id}/
async function apiGetOffer(id) {
    if (MOCK_MODE) {
        await mockDelay();
        const offer = MockDB.offers.getById(id);
        if (!offer) {
            throw new Error('Oferta no encontrada');
        }
        return offer;
    }
    
    const response = await fetch(`${API_BASE_URL}/offers/${id}/`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener oferta'), response);
    }
    
    return await response.json();
}

// POST /api/offers/
async function apiCreateOffer(offerData) {
    if (MOCK_MODE) {
        await mockDelay();
        const newOffer = MockDB.offers.create(offerData);
        return newOffer;
    }
    
    const response = await fetch(`${API_BASE_URL}/offers/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(offerData)
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al crear oferta'), response);
    }
    
    return await response.json();
}

// PUT /api/offers/{id}/
async function apiUpdateOffer(id, data) {
    if (MOCK_MODE) {
        await mockDelay();
        const updated = MockDB.offers.update(id, data);
        if (!updated) {
            throw new Error('Oferta no encontrada');
        }
        return updated;
    }
    
    const response = await fetch(`${API_BASE_URL}/offers/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al actualizar oferta'), response);
    }
    
    return await response.json();
}

// DELETE /api/offers/{id}/
async function apiDeleteOffer(id) {
    if (MOCK_MODE) {
        await mockDelay();
        MockDB.offers.delete(id);
        return { message: 'Oferta eliminada' };
    }
    
    const response = await fetch(`${API_BASE_URL}/offers/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al eliminar oferta'), response);
    }
    
    return { message: 'Oferta eliminada' };
}

/**
 * POSTULACIONES
 */

// POST /api/offers/{id}/apply/
async function apiApplyToOffer(offerId, applicationData) {
    if (MOCK_MODE) {
        await mockDelay();
        const offer = MockDB.offers.getById(offerId);
        if (!offer) {
            throw new Error('Oferta no encontrada');
        }
        
        const application = MockDB.applications.create({
            offer_id: offerId,
            offer_title: offer.title,
            company_id: offer.company_id,
            company_name: offer.company_name,
            student_id: applicationData.student_id,
            student_name: applicationData.profile_snapshot.name,
            status: 'pending',
            profile_snapshot: applicationData.profile_snapshot
        });
        
        return application;
    }
    
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/apply/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(applicationData)
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al aplicar a la oferta'), response);
    }
    
    return await response.json();
}

// GET /api/students/{id}/applications/
async function apiGetStudentApplications(studentId) {
    if (MOCK_MODE) {
        await mockDelay();
        const applications = MockDB.applications.getAll();
        return applications.filter(a => a.student_id === studentId);
    }
    
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/applications/`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener postulaciones'), response);
    }
    
    return await response.json();
}

// GET /api/offers/{id}/applicants/
async function apiGetOfferApplicants(offerId) {
    if (MOCK_MODE) {
        await mockDelay();
        const applications = MockDB.applications.getAll();
        return applications.filter(a => a.offer_id === offerId);
    }
    
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/applicants/`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener postulantes'), response);
    }
    
    return await response.json();
}

// PUT /api/applications/{id}/company-review/
async function apiCompanyReviewApplication(appId, data) {
    if (MOCK_MODE) {
        await mockDelay();
        const updated = MockDB.applications.update(appId, data);
        if (!updated) {
            throw new Error('Postulación no encontrada');
        }
        return updated;
    }
    
    const response = await fetch(`${API_BASE_URL}/applications/${appId}/company-review/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al revisar postulación'), response);
    }
    
    return await response.json();
}

// PUT /api/applications/{id}/admin-review/
async function apiAdminReviewApplication(appId, data) {
    if (MOCK_MODE) {
        await mockDelay();
        
        // Si se asigna profesor, obtener su nombre
        if (data.assigned_teacher_id) {
            const teacher = MockDB.users.getById(data.assigned_teacher_id);
            if (teacher) {
                data.assigned_teacher_name = teacher.name;
            }
        }
        
        const updated = MockDB.applications.update(appId, data);
        if (!updated) {
            throw new Error('Postulación no encontrada');
        }
        return updated;
    }
    
    const response = await fetch(`${API_BASE_URL}/applications/${appId}/admin-review/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al revisar postulación'), response);
    }
    
    return await response.json();
}

// GET todas las aplicaciones (solo admin)
async function apiGetAllApplications(params = {}) {
    if (MOCK_MODE) {
        await mockDelay();
        let applications = MockDB.applications.getAll();
        
        if (params.status) {
            applications = applications.filter(a => a.status === params.status);
        }
        
        return applications;
    }
    
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/applications/?${queryParams}`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener postulaciones'), response);
    }
    
    return await response.json();
}

/**
 * ADMINISTRACIÓN
 */

// GET /api/admin/metrics/
async function apiGetAdminMetrics() {
    if (MOCK_MODE) {
        await mockDelay();
        const users = MockDB.users.getAll();
        const offers = MockDB.offers.getAll();
        const applications = MockDB.applications.getAll();
        
        return {
            total_users: users.length,
            pending_offers: offers.filter(o => o.status === 'pending').length,
            ongoing_practices: applications.filter(a => a.status === 'approved').length,
            total_applications: applications.length,
            recent_activities: [
                {
                    icon: '📝',
                    text: 'Nueva postulación de Juan Pérez',
                    time: 'Hace 2 horas'
                },
                {
                    icon: '✅',
                    text: 'Oferta aprobada: Desarrollador Full Stack',
                    time: 'Hace 5 horas'
                },
                {
                    icon: '👤',
                    text: 'Nuevo usuario registrado',
                    time: 'Hace 1 día'
                }
            ]
        };
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/metrics/`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener métricas'), response);
    }
    
    return await response.json();
}

// GET /api/admin/users/
async function apiGetUsers(params = {}) {
    if (MOCK_MODE) {
        await mockDelay();
        let users = MockDB.users.getAll();
        
        if (params.role) {
            users = users.filter(u => u.role === params.role);
        }
        if (params.search) {
            const search = params.search.toLowerCase();
            users = users.filter(u => 
                u.name.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            );
        }
        
        // No devolver passwords
        return users.map(({ password, ...user }) => user);
    }
    
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users/?${queryParams}`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al obtener usuarios'), response);
    }
    
    return await response.json();
}

// PUT /api/admin/users/{id}/
async function apiUpdateUser(id, data) {
    if (MOCK_MODE) {
        await mockDelay();
        const updated = MockDB.users.update(id, data);
        if (!updated) {
            throw new Error('Usuario no encontrado');
        }
        const { password, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al actualizar usuario'), response);
    }
    
    return await response.json();
}

// DELETE /api/admin/users/{id}/
async function apiDeleteUser(id) {
    if (MOCK_MODE) {
        await mockDelay();
        MockDB.users.delete(id);
        return { message: 'Usuario eliminado' };
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    
    if (!response.ok) {
        handleApiError(new Error('Error al eliminar usuario'), response);
    }
    
    return { message: 'Usuario eliminado' };
}