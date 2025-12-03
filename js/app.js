import { setActiveTab, renderNavigation, renderContent } from './router.js';
import { openModal, closeModal } from '../components/Modal.js';
import { copyToClipboard } from './utils.js';
import { fetchProducts, getCachedProducts, cacheProducts } from '../services/woocommerce.service.js';
import { calculateQuote } from '../services/booking.service.js';
import { PROPERTIES_DATA, PROPERTIES_DATA_FALLBACK } from '../data/data.js';

/**
 * Aplicación Principal
 * Inicializa la app y maneja el estado global
 */

// --- ESTADO DE LA APP ---
const state = {
    activeTab: 'properties',
    searchTerm: '',
    filterType: 'todos',
    selectedProp: null,
    isLoading: true,
    error: null,
    // Calendar state
    selectedCalendarProperty: null,
    calendarDate: new Date(),
    // Booking state
    selectionStart: null,
    selectionEnd: null,
    bookingGuestCount: 1,
    bookingQuote: null,
    guestDetails: { name: '', email: '', phone: '' }
};

/**
 * Inicializa la aplicación y carga datos desde WooCommerce
 */
async function init() {
    // Renderizar UI inicial con loading
    renderNavigation(state);
    renderContent(state);

    try {
        // Intentar obtener desde cache primero
        let properties = getCachedProducts();

        if (!properties) {
            console.log('Cargando propiedades desde WooCommerce API...');
            properties = await fetchProducts();
            cacheProducts(properties);
            console.log(`✅ ${properties.length} propiedades cargadas desde API`);
        } else {
            console.log(`✅ ${properties.length} propiedades cargadas desde cache`);
        }

        // Actualizar PROPERTIES_DATA
        PROPERTIES_DATA.length = 0;
        PROPERTIES_DATA.push(...properties);

        state.isLoading = false;
        state.error = null;
        renderContent(state);

    } catch (error) {
        console.error('❌ Error cargando propiedades:', error);
        console.log('⚠️ Usando datos de respaldo (fallback)');

        // Usar datos de fallback
        PROPERTIES_DATA.length = 0;
        PROPERTIES_DATA.push(...PROPERTIES_DATA_FALLBACK);

        state.isLoading = false;
        state.error = 'No se pudieron cargar las propiedades desde WooCommerce. Mostrando datos de respaldo.';
        renderContent(state);
    }
}

/**
 * Cambia la búsqueda y re-renderiza
 * @param {string} val - Término de búsqueda
 */
function setSearch(val) {
    state.searchTerm = val;
    renderContent(state);
    // Mantener foco en el input
    const input = document.querySelector('input[type="text"]');
    if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}

/**
 * Cambia el filtro de edificio y re-renderiza
 * @param {string} type - Tipo de filtro
 */
function setFilter(type) {
    state.filterType = type;
    renderContent(state);
}

/**
 * Cambia la propiedad seleccionada en el calendario
 * @param {string} propertyId - ID de la propiedad
 */
function setCalendarProperty(propertyId) {
    state.selectedCalendarProperty = propertyId;
    renderContent(state);
}

/**
 * Navega al mes anterior
 */
function previousMonth() {
    const current = state.calendarDate;
    state.calendarDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    renderContent(state);
}

/**
 * Navega al mes siguiente
 */
function nextMonth() {
    const current = state.calendarDate;
    state.calendarDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    renderContent(state);
}

/**
 * Navega al calendario con una propiedad específica seleccionada
 * @param {string} propertyId - ID de la propiedad
 */
function viewPropertyCalendar(propertyId) {
    // Cerrar modal si está abierto
    closeModal();

    // Cambiar a tab de calendario
    state.activeTab = 'calendar';
    state.selectedCalendarProperty = propertyId;
    state.calendarDate = new Date(); // Resetear a mes actual

    renderNavigation(state);
    renderContent(state);

    // Scroll al top
    document.getElementById('main-container').scrollTop = 0;
}

/**
 * Selecciona una fecha en el calendario
 * @param {string} dateStr - Fecha en formato ISO (YYYY-MM-DD)
 */
function selectDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00'); // Asegurar hora local

    if (!state.selectionStart || (state.selectionStart && state.selectionEnd)) {
        // Nueva selección
        state.selectionStart = date;
        state.selectionEnd = null;
        state.bookingQuote = null;
    } else {
        // Completar rango
        if (date < state.selectionStart) {
            state.selectionEnd = state.selectionStart;
            state.selectionStart = date;
        } else {
            state.selectionEnd = date;
        }

        // Calcular cotización al completar rango
        updateQuote();
    }

    renderContent(state);
}

/**
 * Actualiza la cantidad de huéspedes
 * @param {number} count 
 */
function updateGuestCount(count) {
    state.bookingGuestCount = parseInt(count);
    updateQuote();
    renderContent(state);
}

/**
 * Actualiza detalles del huésped
 * @param {string} field 
 * @param {string} value 
 */
function updateGuestDetails(field, value) {
    state.guestDetails[field] = value;
    // No necesitamos re-renderizar todo, solo guardar el estado
}

/**
 * Calcula y actualiza la cotización actual
 */
function updateQuote() {
    if (state.selectionStart && state.selectionEnd && state.selectedCalendarProperty) {
        const property = PROPERTIES_DATA.find(p => p.id === state.selectedCalendarProperty);
        if (property) {
            state.bookingQuote = calculateQuote(
                property,
                state.selectionStart,
                state.selectionEnd,
                state.bookingGuestCount
            );
        }
    }
}

/**
 * Crea la reserva (Mock por ahora)
 */
async function createBooking() {
    if (!state.bookingQuote || state.bookingQuote.error) return;

    const { name, email, phone } = state.guestDetails;
    if (!name || !email || !phone) {
        alert('Por favor complete todos los datos del huésped');
        return;
    }

    alert(`¡Reserva Simulada!\n\nPropiedad: ${state.selectedCalendarProperty}\nTotal: ${state.bookingQuote.formattedTotal}\nCliente: ${name}`);

    // Resetear selección
    state.selectionStart = null;
    state.selectionEnd = null;
    state.bookingQuote = null;
    state.guestDetails = { name: '', email: '', phone: '' };
    renderContent(state);
}

// Exponer funciones globales necesarias para onclick handlers
window.setActiveTab = (tab) => setActiveTab(tab, state);
window.setSearch = setSearch;
window.setFilter = setFilter;
window.openModal = openModal;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.setCalendarProperty = setCalendarProperty;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.viewPropertyCalendar = viewPropertyCalendar;
window.selectDate = selectDate;
window.updateGuestCount = updateGuestCount;
window.updateGuestDetails = updateGuestDetails;
window.createBooking = createBooking;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
