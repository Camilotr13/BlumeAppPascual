/**
 * mockData.js
 * Sistema de datos mock almacenados en localStorage
 * Simula una base de datos completa con usuarios, ofertas y postulaciones
 */

// Flag global para activar/desactivar modo mock
const MOCK_MODE = true;

/**
 * Inicializa los datos mock si no existen en localStorage
 */
function initializeMockData() {
    if (!MOCK_MODE) return;
    
    // Verificar si ya existen datos
    if (localStorage.getItem('mock_initialized')) {
        return;
    }
    
    // Usuarios de prueba
    const mockUsers = [
        {
            id: 1,
            name: 'Administrador Sistema',
            email: 'admin@pascualbravo.edu.co',
            password: 'admin123', 
            role: 'admin',
            phone: '3001234567',
            date_joined: new Date().toISOString()
        },
        {
            id: 2,
            name: 'TechCorp S.A.',
            email: 'empresa@example.com',
            password: 'empresa123',
            role: 'company',
            phone: '3002345678',
            company_name: 'TechCorp S.A.',
            nit: '900123456-7',
            date_joined: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Juan Pérez Estudiante',
            email: 'estudiante@pascualbravo.edu.co',
            password: 'estudiante123',
            role: 'student',
            phone: '3003456789',
            student_id: '1234567890',
            career: 'Ingeniería de Sistemas',
            date_joined: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Profesor Carlos Gómez',
            email: 'profesor@pascualbravo.edu.co',
            password: 'profesor123',
            role: 'teacher',
            phone: '3004567890',
            department: 'Ingeniería',
            date_joined: new Date().toISOString()
        },
        {
            id: 5,
            name: 'Innovación Digital Ltda',
            email: 'innovacion@example.com',
            password: 'empresa123',
            role: 'company',
            phone: '3005678901',
            company_name: 'Innovación Digital Ltda',
            nit: '900234567-8',
            date_joined: new Date().toISOString()
        },
        {
            id: 6,
            name: 'María García',
            email: 'maria.garcia@pascualbravo.edu.co',
            password: 'estudiante123',
            role: 'student',
            phone: '3006789012',
            student_id: '9876543210',
            career: 'Tecnología en Desarrollo de Software',
            date_joined: new Date().toISOString()
        }
    ];
    
    // Ofertas de práctica
    const mockOffers = [
        {
            id: 1,
            title: 'Desarrollador Full Stack Junior',
            description: 'Buscamos estudiante para desarrollar aplicaciones web con React y Node.js. Trabajarás en proyectos reales con nuestro equipo de desarrollo.',
            requirements: 'Conocimientos en JavaScript, HTML, CSS. Deseable: React, Node.js, bases de datos SQL.',
            deadline: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
            type: 'Práctica',
            career: 'Ingeniería de Sistemas',
            company_id: 2,
            company_name: 'TechCorp S.A.',
            status: 'approved',
            created_at: new Date().toISOString(),
            applicants_count: 2
        },
        {
            id: 2,
            title: 'Asistente de Gestión Administrativa',
            description: 'Apoyo en procesos administrativos y gestión documental. Excelente oportunidad para aprender sobre gestión empresarial.',
            requirements: 'Manejo de Office, organización, capacidad de trabajo en equipo.',
            deadline: new Date(Date.now() + 45*24*60*60*1000).toISOString(),
            type: 'Pasantía',
            career: 'Tecnología en Gestión Administrativa',
            company_id: 5,
            company_name: 'Innovación Digital Ltda',
            status: 'approved',
            created_at: new Date().toISOString(),
            applicants_count: 1
        },
        {
            id: 3,
            title: 'Desarrollador Mobile React Native',
            description: 'Desarrollo de aplicaciones móviles multiplataforma. Participarás en el ciclo completo de desarrollo de apps móviles.',
            requirements: 'Conocimientos en JavaScript, React. Deseable: React Native, Git.',
            deadline: new Date(Date.now() + 60*24*60*60*1000).toISOString(),
            type: 'Proyecto',
            career: 'Tecnología en Desarrollo de Software',
            company_id: 2,
            company_name: 'TechCorp S.A.',
            status: 'pending',
            created_at: new Date().toISOString(),
            applicants_count: 0
        },
        {
            id: 4,
            title: 'Analista de Procesos Industriales',
            description: 'Apoyo en optimización de procesos de producción y control de calidad.',
            requirements: 'Conocimientos en estadística, Excel avanzado, gestión de procesos.',
            deadline: new Date(Date.now() + 40*24*60*60*1000).toISOString(),
            type: 'Práctica',
            career: 'Ingeniería Industrial',
            company_id: 5,
            company_name: 'Innovación Digital Ltda',
            status: 'approved',
            created_at: new Date().toISOString(),
            applicants_count: 0
        }
    ];
    
    // Postulaciones
    const mockApplications = [
        {
            id: 1,
            offer_id: 1,
            offer_title: 'Desarrollador Full Stack Junior',
            student_id: 3,
            student_name: 'Juan Pérez Estudiante',
            company_id: 2,
            company_name: 'TechCorp S.A.',
            status: 'pending',
            applied_at: new Date().toISOString(),
            profile_snapshot: {
                name: 'Juan Pérez Estudiante',
                email: 'estudiante@pascualbravo.edu.co',
                phone: '3003456789',
                student_id: '1234567890',
                career: 'Ingeniería de Sistemas'
            }
        },
        {
            id: 2,
            offer_id: 2,
            offer_title: 'Asistente de Gestión Administrativa',
            student_id: 6,
            student_name: 'María García',
            company_id: 5,
            company_name: 'Innovación Digital Ltda',
            status: 'company_accepted',
            applied_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
            company_reviewed_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
            profile_snapshot: {
                name: 'María García',
                email: 'maria.garcia@pascualbravo.edu.co',
                phone: '3006789012',
                student_id: '9876543210',
                career: 'Tecnología en Desarrollo de Software'
            }
        },
        {
            id: 3,
            offer_id: 1,
            offer_title: 'Desarrollador Full Stack Junior',
            student_id: 6,
            student_name: 'María García',
            company_id: 2,
            company_name: 'TechCorp S.A.',
            status: 'approved',
            applied_at: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
            company_reviewed_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
            admin_reviewed_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
            assigned_teacher_id: 4,
            assigned_teacher_name: 'Profesor Carlos Gómez',
            start_date: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
            profile_snapshot: {
                name: 'María García',
                email: 'maria.garcia@pascualbravo.edu.co',
                phone: '3006789012',
                student_id: '9876543210',
                career: 'Tecnología en Desarrollo de Software'
            }
        }
    ];
    
    // Guardar en localStorage
    localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    localStorage.setItem('mock_offers', JSON.stringify(mockOffers));
    localStorage.setItem('mock_applications', JSON.stringify(mockApplications));
    localStorage.setItem('mock_initialized', 'true');
    localStorage.setItem('mock_user_counter', '6');
    localStorage.setItem('mock_offer_counter', '4');
    localStorage.setItem('mock_application_counter', '3');
    
    console.log('✅ Mock data initialized');
}

/**
 * Resetea todos los datos mock a su estado inicial
 */
function resetMockData() {
    localStorage.removeItem('mock_initialized');
    localStorage.removeItem('mock_users');
    localStorage.removeItem('mock_offers');
    localStorage.removeItem('mock_applications');
    localStorage.removeItem('mock_user_counter');
    localStorage.removeItem('mock_offer_counter');
    localStorage.removeItem('mock_application_counter');
    initializeMockData();
    console.log('✅ Mock data reset');
}

/**
 * Obtiene un nuevo ID para una entidad
 */
function getNextId(entityType) {
    const key = `mock_${entityType}_counter`;
    const current = parseInt(localStorage.getItem(key) || '0');
    const next = current + 1;
    localStorage.setItem(key, next.toString());
    return next;
}

/**
 * Funciones helper para acceso a datos
 */
const MockDB = {
    users: {
        getAll: () => JSON.parse(localStorage.getItem('mock_users') || '[]'),
        getById: (id) => MockDB.users.getAll().find(u => u.id === id),
        getByEmail: (email) => MockDB.users.getAll().find(u => u.email === email),
        create: (user) => {
            const users = MockDB.users.getAll();
            user.id = getNextId('user');
            user.date_joined = new Date().toISOString();
            users.push(user);
            localStorage.setItem('mock_users', JSON.stringify(users));
            return user;
        },
        update: (id, data) => {
            const users = MockDB.users.getAll();
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users[index] = { ...users[index], ...data };
                localStorage.setItem('mock_users', JSON.stringify(users));
                return users[index];
            }
            return null;
        },
        delete: (id) => {
            const users = MockDB.users.getAll().filter(u => u.id !== id);
            localStorage.setItem('mock_users', JSON.stringify(users));
        }
    },
    
    offers: {
        getAll: () => JSON.parse(localStorage.getItem('mock_offers') || '[]'),
        getById: (id) => MockDB.offers.getAll().find(o => o.id === id),
        create: (offer) => {
            const offers = MockDB.offers.getAll();
            offer.id = getNextId('offer');
            offer.created_at = new Date().toISOString();
            offer.applicants_count = 0;
            offers.push(offer);
            localStorage.setItem('mock_offers', JSON.stringify(offers));
            return offer;
        },
        update: (id, data) => {
            const offers = MockDB.offers.getAll();
            const index = offers.findIndex(o => o.id === id);
            if (index !== -1) {
                offers[index] = { ...offers[index], ...data };
                localStorage.setItem('mock_offers', JSON.stringify(offers));
                return offers[index];
            }
            return null;
        },
        delete: (id) => {
            const offers = MockDB.offers.getAll().filter(o => o.id !== id);
            localStorage.setItem('mock_offers', JSON.stringify(offers));
        }
    },
    
    applications: {
        getAll: () => JSON.parse(localStorage.getItem('mock_applications') || '[]'),
        getById: (id) => MockDB.applications.getAll().find(a => a.id === id),
        create: (application) => {
            const applications = MockDB.applications.getAll();
            application.id = getNextId('application');
            application.applied_at = new Date().toISOString();
            applications.push(application);
            localStorage.setItem('mock_applications', JSON.stringify(applications));
            
            // Actualizar contador de aplicantes en la oferta
            const offer = MockDB.offers.getById(application.offer_id);
            if (offer) {
                MockDB.offers.update(application.offer_id, {
                    applicants_count: (offer.applicants_count || 0) + 1
                });
            }
            
            return application;
        },
        update: (id, data) => {
            const applications = MockDB.applications.getAll();
            const index = applications.findIndex(a => a.id === id);
            if (index !== -1) {
                applications[index] = { ...applications[index], ...data };
                if (data.status === 'company_accepted') {
                    applications[index].company_reviewed_at = new Date().toISOString();
                } else if (data.status === 'approved') {
                    applications[index].admin_reviewed_at = new Date().toISOString();
                }
                localStorage.setItem('mock_applications', JSON.stringify(applications));
                return applications[index];
            }
            return null;
        },
        delete: (id) => {
            const applications = MockDB.applications.getAll().filter(a => a.id !== id);
            localStorage.setItem('mock_applications', JSON.stringify(applications));
        }
    }
};

// Exponer funciones globalmente
window.initializeMockData = initializeMockData;
window.resetMockData = resetMockData;
window.MockDB = MockDB;
window.MOCK_MODE = MOCK_MODE;