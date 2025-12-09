/**
 * Servicio TravelSuites API
 * Cliente para consumir la API custom de TravelSuites
 * Endpoints: bookings, check-ins, check-outs, stats, external-bookings
 */

const API_BASE = '/api/travelsuites';

/**
 * Hace una petición a la API de TravelSuites
 * @param {string} endpoint - Endpoint a llamar (sin slash inicial)
 * @param {Object} params - Query parameters
 * @param {Object} options - Opciones de fetch (method, body, etc)
 * @returns {Promise<Object>} Respuesta de la API
 */
async function apiRequest(endpoint, params = {}, options = {}) {
    const url = new URL(API_BASE, window.location.origin);
    url.searchParams.append('endpoint', endpoint);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    });

    const fetchOptions = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    console.log(`🔄 TravelSuites: ${endpoint}...`);

    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.json();

    if (!response.ok) {
        console.error(`❌ TravelSuites ${endpoint}:`, data);
        throw new Error(data.message || data.error || `Error ${response.status}`);
    }

    console.log(`✅ TravelSuites ${endpoint}: OK`);
    return data;
}

// ==================== RESERVAS ====================

/**
 * Obtiene todas las reservas con filtros opcionales
 * @param {Object} filters - Filtros: status, per_page, page, from_date, to_date, product_id
 * @returns {Promise<Array>} Lista de reservas
 */
export async function fetchBookings(filters = {}) {
    return apiRequest('bookings', filters);
}

/**
 * Obtiene reservas próximas (desde hoy en adelante)
 * @returns {Promise<Array>} Lista de reservas próximas
 */
export async function fetchUpcomingBookings() {
    return apiRequest('bookings/upcoming');
}

/**
 * Obtiene detalle de una reserva específica
 * @param {number|string} id - ID de la reserva
 * @returns {Promise<Object>} Detalle de la reserva
 */
export async function fetchBookingDetail(id) {
    return apiRequest(`bookings/${id}`);
}

// ==================== CHECK-INS / CHECK-OUTS ====================

/**
 * Obtiene check-ins para una fecha específica
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {Promise<Array>} Lista de check-ins
 */
export async function fetchCheckIns(date) {
    return apiRequest('check-ins', { date });
}

/**
 * Obtiene check-outs para una fecha específica
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {Promise<Array>} Lista de check-outs
 */
export async function fetchCheckOuts(date) {
    return apiRequest('check-outs', { date });
}

// ==================== RESERVAS EXTERNAS ====================

/**
 * Obtiene reservas externas (Airbnb, Booking.com)
 * @returns {Promise<Array>} Lista de reservas externas
 */
export async function fetchExternalBookings() {
    return apiRequest('external-bookings');
}

/**
 * Obtiene todas las reservas (internas + externas)
 * @returns {Promise<Array>} Lista combinada de reservas
 */
export async function fetchAllBookings() {
    return apiRequest('all-bookings');
}

/**
 * Obtiene detalle de una reserva externa
 * @param {number|string} id - ID de la reserva externa
 * @returns {Promise<Object>} Detalle de la reserva
 */
export async function fetchExternalBookingDetail(id) {
    return apiRequest(`external-bookings/${id}`);
}

/**
 * Agrega o actualiza datos del huésped en reserva externa
 * @param {number|string} id - ID de la reserva externa
 * @param {Object} guestData - Datos del huésped: guest_name, guest_email, guest_phone, guest_count, notes
 * @returns {Promise<Object>} Reserva actualizada
 */
export async function updateGuestData(id, guestData) {
    return apiRequest(`external-bookings/${id}/guest`, {}, {
        method: 'POST',
        body: guestData
    });
}

// ==================== PRODUCTOS Y ESTADÍSTICAS ====================

/**
 * Obtiene productos con booking habilitado
 * @returns {Promise<Array>} Lista de productos
 */
export async function fetchProducts() {
    return apiRequest('products');
}

/**
 * Obtiene estadísticas de reservas
 * @returns {Promise<Object>} Estadísticas: total, por estado, hoy, semana, mes
 */
export async function fetchStats() {
    return apiRequest('stats');
}

// ==================== UTILIDADES ====================

/**
 * Formatea fecha a YYYY-MM-DD
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function formatDateForAPI(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Cache simple para respuestas de la API
 */
const CACHE_KEY = 'travelsuites_api_cache';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

export function cacheResponse(key, data) {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[key] = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getCachedResponse(key) {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cached = cache[key];

    if (!cached) return null;

    if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    return null;
}

export function clearCache() {
    localStorage.removeItem(CACHE_KEY);
}
