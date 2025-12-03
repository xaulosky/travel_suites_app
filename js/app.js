import { setActiveTab, renderNavigation, renderContent } from './router.js';
import { openModal, closeModal } from '../components/Modal.js';
import { copyToClipboard } from './utils.js';
import { fetchProducts, getCachedProducts, cacheProducts, createOrder } from '../services/woocommerce.service.js';
import { calculateQuote, formatDateAPI } from '../services/booking.service.js';
import { fetchAllCalendarEvents, isDateOccupied, getCachedCalendarEvents, cacheCalendarEvents } from '../services/calendar.service.js';
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
    calendarEvents: [], // Eventos de ocupación (iCal)
    calendarSearchTerm: '', // Buscador de propiedades en calendario
    calendarSidebarOpen: false, // Estado del sidebar en móvil
    calendarLoading: false, // Indica si se están cargando eventos del calendario
    // Booking state
    selectedDates: [], // Array of ISO date strings (YYYY-MM-DD)
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
 * Filtra la lista de propiedades en el calendario
 * @param {string} val 
 */
function setCalendarSearch(val) {
    state.calendarSearchTerm = val;
    renderContent(state);

    // Mantener foco en el buscador del calendario
    const input = document.getElementById('calendar-search');
    if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}

/**
 * Alterna la visibilidad del sidebar de propiedades en móvil
 */
function toggleCalendarSidebar() {
    state.calendarSidebarOpen = !state.calendarSidebarOpen;
    renderContent(state);
}

/**
 * Carga los eventos del calendario para una propiedad
 * @param {string} propertyId 
 */
async function loadCalendarEvents(propertyId) {
    const property = PROPERTIES_DATA.find(p => p.id === propertyId);
    if (!property) return;

    // Resetear eventos actuales mientras carga
    state.calendarEvents = [];

    // Intentar desde cache
    const cached = getCachedCalendarEvents(propertyId);
    if (cached) {
        state.calendarEvents = cached;
        renderContent(state);
        return;
    }

    // Si no hay cache, buscar en APIs externas
    if (property.externalCalendars) {
        const urls = Object.values(property.externalCalendars).filter(url => url);
        if (urls.length > 0) {
            try {
                // Mostrar loading si es necesario (opcional)
                const events = await fetchAllCalendarEvents(urls);
                state.calendarEvents = events;
                cacheCalendarEvents(propertyId, events);
                renderContent(state);
            } catch (error) {
                console.error('Error loading calendar events:', error);
            }
        }
    }
}
/**
 * Cambia la propiedad seleccionada en el calendario
 * @param {string} propertyId - ID de la propiedad
 */
function setCalendarProperty(propertyId) {
    // Guardar posición del scroll
    const list = document.getElementById('calendar-property-list');
    const scrollTop = list ? list.scrollTop : 0;

    state.selectedCalendarProperty = propertyId;
    state.selectedDates = []; // Resetear selección al cambiar propiedad
    state.bookingQuote = null;

    // Renderizar inmediatamente con eventos cacheados o vacíos
    const cached = getCachedCalendarEvents(propertyId);
    if (cached) {
        state.calendarEvents = cached;
        state.calendarLoading = false;
    } else {
        state.calendarEvents = []; // Mostrar calendario vacío mientras carga
        state.calendarLoading = true; // Activar loading
    }

    renderContent(state);

    // Restaurar scroll INMEDIATAMENTE después del render
    requestAnimationFrame(() => {
        const newList = document.getElementById('calendar-property-list');
        if (newList) {
            newList.scrollTop = scrollTop;
        }
    });

    // Cargar eventos en segundo plano si no hay cache
    if (!cached) {
        loadCalendarEventsBackground(propertyId, scrollTop);
    }
}

/**
 * Carga eventos en segundo plano
 */
async function loadCalendarEventsBackground(propertyId, scrollTop) {
    const property = PROPERTIES_DATA.find(p => p.id === propertyId);
    if (!property || !property.externalCalendars) {
        state.calendarLoading = false;
        renderContent(state);
        return;
    }

    const urls = Object.values(property.externalCalendars).filter(url => url);
    if (urls.length === 0) {
        state.calendarLoading = false;
        renderContent(state);
        return;
    }

    try {
        const events = await fetchAllCalendarEvents(urls);

        // Solo actualizar si seguimos en la misma propiedad
        if (state.selectedCalendarProperty === propertyId) {
            state.calendarEvents = events;
            state.calendarLoading = false;
            cacheCalendarEvents(propertyId, events);

            // Guardar scroll actual antes de re-renderizar
            const list = document.getElementById('calendar-property-list');
            const currentScroll = list ? list.scrollTop : scrollTop;

            renderContent(state);

            // Restaurar scroll
            requestAnimationFrame(() => {
                const newList = document.getElementById('calendar-property-list');
                if (newList) {
                    newList.scrollTop = currentScroll;
                }
            });
        }
    } catch (error) {
        console.error('Error loading calendar events:', error);
        state.calendarLoading = false;
        renderContent(state);
    }
}

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
    state.selectedDates = []; // Resetear selección
    state.bookingQuote = null;

    loadCalendarEvents(propertyId); // Cargar eventos reales
    renderNavigation(state);
    renderContent(state);

    // Scroll al top
    document.getElementById('main-container').scrollTop = 0;
}

/**
 * Selecciona fechas en el calendario
 * @param {string} dateStr - Fecha en formato ISO (YYYY-MM-DD)
 * @param {Event} event - Evento del click (para detectar Shift/Ctrl)
 */
function selectDate(dateStr, event) {
    const date = new Date(dateStr + 'T00:00:00');

    // Manejo de teclas modificadoras
    const isCtrl = event && (event.ctrlKey || event.metaKey);
    const isShift = event && event.shiftKey;

    if (isShift && state.selectedDates.length > 0) {
        // Selección de Rango (Shift)
        const lastSelected = new Date(state.selectedDates[state.selectedDates.length - 1] + 'T00:00:00');
        const start = date < lastSelected ? date : lastSelected;
        const end = date < lastSelected ? lastSelected : date;

        // Generar todas las fechas en el rango
        const range = [];
        let current = new Date(start);
        while (current <= end) {
            range.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }

        // Unir con existentes o reemplazar según lógica deseada
        // Aquí reemplazamos para comportamiento estándar de Shift
        // Pero si quieren "agregar rango", sería diferente. 
        // Asumiremos comportamiento estándar: Shift define un nuevo rango desde el último punto.

        // Para simplificar y evitar conflictos con Ctrl, si es Shift, reconstruimos la selección
        // desde el último punto de anclaje hasta el nuevo.
        // Pero para ser más amigable: Agregamos el rango al set existente (o lo reseteamos?)
        // Lo más intuitivo en calendarios: Shift extiende desde el último click.

        // Vamos a hacer: Mantener lo que estaba si se usa Ctrl? No, Shift suele ser rango exclusivo.
        // Vamos a limpiar y setear el rango.
        state.selectedDates = range;

    } else if (isCtrl) {
        // Selección Múltiple (Ctrl) - Toggle
        const index = state.selectedDates.indexOf(dateStr);
        if (index >= 0) {
            state.selectedDates.splice(index, 1);
        } else {
            state.selectedDates.push(dateStr);
        }
    } else {
        // Selección Simple (Click) - Nuevo inicio
        // Si ya estaba seleccionada y es la única, la deseleccionamos? No, mejor siempre seleccionar.
        state.selectedDates = [dateStr];
    }

    // Ordenar fechas para consistencia
    state.selectedDates.sort();

    updateQuote();
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
    if (state.selectedDates.length > 0 && state.selectedCalendarProperty) {
        const property = PROPERTIES_DATA.find(p => p.id === state.selectedCalendarProperty);
        if (property) {
            state.bookingQuote = calculateQuote(
                property,
                state.selectedDates,
                state.bookingGuestCount
            );
        }
    }
}

/**
 * Crea la reserva (Mock por ahora)
 */
/**
 * Crea la reserva real en WooCommerce
 */
async function createBooking() {
    if (!state.bookingQuote || state.bookingQuote.error) return;

    const { name, email, phone } = state.guestDetails;
    if (!name || !email || !phone) {
        alert('Por favor complete todos los datos del huésped');
        return;
    }

    const property = PROPERTIES_DATA.find(p => p.id === state.selectedCalendarProperty);
    if (!property) return;

    // Mostrar estado de carga
    const confirmBtn = document.querySelector('button[onclick="window.createBooking()"]');
    const originalText = confirmBtn ? confirmBtn.innerText : 'Confirmar Reserva';
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerText = 'Procesando...';
    }

    try {
        // Preparar datos de la orden
        const orderData = {
            payment_method: 'bacs',
            payment_method_title: 'Transferencia Bancaria',
            set_paid: false,
            billing: {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email: email,
                phone: phone
            },
            line_items: [
                {
                    product_id: property.productId,
                    quantity: 1,
                    meta_data: [
                        {
                            key: 'Reserva',
                            value: `${state.selectedDates.join(', ')}`
                        },
                        {
                            key: 'Noches',
                            value: state.selectedDates.length
                        },
                        {
                            key: 'Huéspedes',
                            value: state.bookingGuestCount
                        },
                        {
                            key: 'Check-in',
                            value: state.selectedDates[0]
                        },
                        {
                            key: 'Check-out',
                            value: state.selectedDates[state.selectedDates.length - 1] // Aproximado si es continuo
                        }
                    ]
                }
            ]
        };

        console.log('Enviando orden:', orderData);
        const order = await createOrder(orderData);
        console.log('Orden creada:', order);

        alert(`¡Reserva Exitosa!\n\nID de Orden: #${order.id}\nSe ha enviado un correo a ${email} con los detalles para el pago.`);

        // Resetear selección
        state.selectionStart = null;
        state.selectionEnd = null;
        state.bookingQuote = null;
        state.guestDetails = { name: '', email: '', phone: '' };
        renderContent(state);

    } catch (error) {
        console.error('Error al crear reserva:', error);
        alert('Hubo un error al procesar la reserva. Por favor intente nuevamente.');
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerText = originalText;
        }
    }
}

// Exponer funciones globales necesarias para onclick handlers
window.setActiveTab = (tab) => {
    if (tab === 'calendar') {
        const propId = state.selectedCalendarProperty || (PROPERTIES_DATA.length > 0 ? PROPERTIES_DATA[0].id : null);
        if (propId) {
            state.selectedCalendarProperty = propId;
            loadCalendarEvents(propId);
        }
    }
    setActiveTab(tab, state);
};
window.setCalendarSearch = setCalendarSearch;
window.toggleCalendarSidebar = toggleCalendarSidebar;
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
