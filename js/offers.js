/**
 * offers.js
 * Lógica para manejo de ofertas
 */

async function showOfferDetail(offerId) {
    try {
        const offer = await apiGetOffer(offerId);
        const modal = document.getElementById('offerModal');
        const content = document.getElementById('offerDetailContent');
        
        if (!modal || !content) return;
        
        const currentUser = getCurrentUser();
        const canApply = currentUser && currentUser.role === 'student';
        
        content.innerHTML = `
            <h2 class="modal-title">${offer.title}</h2>
            <div class="offer-detail">
                <p><strong>Empresa:</strong> ${offer.company_name}</p>
                <p><strong>Tipo:</strong> <span class="badge badge-${offer.type}">${offer.type}</span></p>
                <p><strong>Carrera:</strong> ${offer.career}</p>
                <p><strong>Fecha Límite:</strong> ${formatDate(offer.deadline)}</p>
                
                <h3>Descripción</h3>
                <p>${offer.description}</p>
                
                <h3>Requisitos</h3>
                <p>${offer.requirements}</p>
                
                <div class="modal-actions">
                    ${canApply ? `<button class="btn btn-primary" onclick="applyToOfferFromModal(${offer.id})">Aplicar</button>` : ''}
                    <button class="btn btn-secondary" onclick="closeModal('offerModal')">Cerrar</button>
                </div>
            </div>
        `;
        
        openModal('offerModal');
    } catch (error) {
        showNotification('Error al cargar oferta', 'error');
    }
}

async function applyToOfferFromModal(offerId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        const profileSnapshot = {
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
            career: currentUser.career,
            student_id: currentUser.student_id
        };
        
        await apiApplyToOffer(offerId, {
            student_id: currentUser.id,
            profile_snapshot: profileSnapshot
        });
        
        showNotification('¡Aplicación enviada exitosamente!', 'success');
        closeModal('offerModal');
    } catch (error) {
        showNotification(error.message || 'Error al aplicar', 'error');
    }
}

/**
 * applications.js
 * Lógica para manejo de postulaciones
 */

// Ya implementado en los dashboards, funciones auxiliares aquí

function getApplicationStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'company_accepted': 'info',
        'company_rejected': 'danger',
        'approved': 'success',
        'rejected': 'danger'
    };
    return colors[status] || 'secondary';
}

function getApplicationStatusMessage(status) {
    const messages = {
        'pending': '⏳ En revisión por la empresa',
        'company_accepted': '✅ Aceptada por empresa - Pendiente aprobación admin',
        'company_rejected': '❌ Rechazada por la empresa',
        'approved': '🎉 Práctica aprobada',
        'rejected': '❌ Rechazada por el administrador'
    };
    return messages[status] || '';
}

/**
 * profile.js
 * Manejo de perfiles de usuario
 */

function renderProfileSection(user) {
    return `
        <div class="profile-header">
            <div class="profile-avatar">
                <img src="assets/logo.png" alt="Avatar">
            </div>
            <div class="profile-info">
                <h2>${user.name}</h2>
                <p>${user.email}</p>
                ${user.career ? `<p>${user.career}</p>` : ''}
            </div>
        </div>
        <div class="profile-details">
            ${user.student_id ? `<p><strong>Documento:</strong> ${user.student_id}</p>` : ''}
            ${user.phone ? `<p><strong>Teléfono:</strong> ${user.phone}</p>` : ''}
            <p><strong>Rol:</strong> ${getRoleLabel(user.role)}</p>
        </div>
    `;
}

function getRoleLabel(role) {
    const labels = {
        'admin': 'Administrador',
        'company': 'Empresa',
        'student': 'Estudiante',
        'teacher': 'Profesor'
    };
    return labels[role] || role;
}

async function updateProfile(userId, data) {
    try {
        const updated = await apiUpdateUser(userId, data);
        showNotification('Perfil actualizado exitosamente', 'success');
        return updated;
    } catch (error) {
        showNotification('Error al actualizar perfil', 'error');
        throw error;
    }
}

/**
 * main.js
 * Inicialización y routing simple
 */

// Sistema de routing simple basado en hash
function initRouter() {
    const routes = {
        '#/dashboard-admin': 'dashboard-admin.html',
        '#/dashboard-company': 'dashboard-company.html',
        '#/dashboard-student': 'dashboard-student.html',
        '#/dashboard-teacher': 'dashboard-teacher.html',
        '#/offers': 'index.html',
        '#/login': 'login.html',
        '#/register': 'register.html'
    };
    
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (routes[hash]) {
            window.location.href = routes[hash];
        }
    });
}

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar router
    initRouter();
    
    // Cerrar modales con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
});

// Funciones de utilidad global
window.formatDate = formatDate;
window.truncateText = truncateText;
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;
window.showOfferDetail = showOfferDetail;