/**
 * ui.js
 * Funciones para renderizar componentes UI, notificaciones, modales, etc.
 */

/**
 * Muestra una notificación temporal
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) {
        // Crear elemento de notificación si no existe
        const notif = document.createElement('div');
        notif.id = 'notification';
        document.body.appendChild(notif);
        return showNotification(message, type);
    }
    notification.textContent = message;
    // Mantener clases base y agregar estado
    notification.classList.remove('success', 'error', 'warning', 'info');
    notification.classList.add('show', type);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.remove(type);
    }, 3000);
}

/**
 * Abre un modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        
        // Cerrar al hacer clic en el botón close
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => closeModal(modalId);
        }
        
        // Cerrar al hacer clic fuera del contenido
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal(modalId);
            }
        };
    }
}

/**
 * Cierra un modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Crea una tarjeta de oferta
 */
function createOfferCard(offer, showActions = true) {
    const statusBadge = offer.status ? `<span class="badge badge-${offer.status}">${getStatusLabel(offer.status)}</span>` : '';
    
    return `
        <div class="offer-card" data-offer-id="${offer.id}">
            <div class="offer-header">
                <h3 class="offer-title">${offer.title}</h3>
                ${statusBadge}
            </div>
            <div class="offer-company">${offer.company_name || 'Empresa'}</div>
            <div class="offer-details">
                <span>📚 ${offer.career}</span>
                <span>📅 ${formatDate(offer.deadline)}</span>
                ${offer.type ? `<span>🏷️ ${offer.type}</span>` : ''}
            </div>
            <div class="offer-description">${truncateText(offer.description, 120)}</div>
            ${showActions ? `
                <div class="offer-actions">
                    <button class="btn btn-sm btn-primary" onclick="showOfferDetail(${offer.id})">Ver Detalle</button>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Renderiza tabla de datos genérica
 */
function renderTable(containerId, columns, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = '<tr><td colspan="' + columns.length + '" class="empty-state">No hay datos para mostrar</td></tr>';
        return;
    }
    
    const rows = data.map(row => {
        const cells = columns.map(col => {
            let value = row[col.key];
            if (col.render) {
                value = col.render(value, row);
            }
            return `<td>${value}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
    
    container.innerHTML = rows;
}

/**
 * Crea un loader/spinner
 */
function createLoader() {
    return '<div class="loader">Cargando...</div>';
}

/**
 * Valida un formulario
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * Limpia un formulario
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Formatea una fecha a formato local
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Trunca un texto a una longitud específica
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Obtiene el label de un estado
 */
function getStatusLabel(status) {
    const labels = {
        'pending': 'Pendiente',
        'approved': 'Aprobada',
        'rejected': 'Rechazada',
        'company_accepted': 'Empresa Aceptó',
        'company_rejected': 'Empresa Rechazó',
        'active': 'Activa',
        'completed': 'Completada'
    };
    return labels[status] || status;
}

/**
 * Confirma una acción con el usuario
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Deshabilita un botón temporalmente
 */
function disableButton(buttonId, text = 'Procesando...') {
    const btn = document.getElementById(buttonId);
    if (btn) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = text;
    }
}

/**
 * Habilita un botón previamente deshabilitado
 */
function enableButton(buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn) {
        btn.disabled = false;
        if (btn.dataset.originalText) {
            btn.textContent = btn.dataset.originalText;
        }
    }
}

/**
 * Renderiza un estado vacío
 */
function renderEmptyState(message, icon = '📭') {
    return `
        <div class="empty-state">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Crea un badge de estado
 */
function createStatusBadge(status) {
    return `<span class="badge badge-${status}">${getStatusLabel(status)}</span>`;
}

/**
 * Scroll suave a un elemento
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Copia texto al portapapeles
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copiado al portapapeles', 'success');
    } catch (err) {
        showNotification('Error al copiar', 'error');
    }
}

/**
 * Debounce para búsquedas
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Asegurar que las funciones estén disponibles globalmente
if (typeof window !== 'undefined') {
    window.formatDate = formatDate;
    window.showNotification = showNotification;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.getStatusLabel = getStatusLabel;
    window.truncateText = truncateText;
}