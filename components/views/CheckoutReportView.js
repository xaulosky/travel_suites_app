import { getCheckoutsForDate, getWeeklyCheckouts, exportCheckoutsToCSV, exportWeeklyCheckoutsToCSV } from '../../services/checkout-report.service.js';
import { fetchCheckOuts, formatDateForAPI } from '../../services/travelsuites.service.js';

/**
 * Vista de Reporte de Check-outs
 * Muestra departamentos con salida de huéspedes en una fecha seleccionada
 * Soporta dos modos: iCal (local) y API TravelSuites (rápido)
 */
export function CheckoutReportView(state) {
    const selectedDate = state.checkoutReportDate || new Date();
    const viewMode = state.checkoutReportViewMode || 'daily';
    const dataSource = state.checkoutDataSource || 'ical';
    const apiCheckouts = state.apiCheckouts || null;
    const apiLoading = state.apiCheckoutsLoading || false;

    let content = '';

    if (viewMode === 'daily') {
        content = renderDailyView(selectedDate, state, dataSource, apiCheckouts, apiLoading);
    } else {
        content = renderWeeklyView(selectedDate, state);
    }

    const icalActiveClass = dataSource === 'ical' ? 'bg-white text-teal-700' : 'text-white hover:bg-white/20';
    const apiActiveClass = dataSource === 'api' ? 'bg-white text-teal-700' : 'text-white hover:bg-white/20';

    return `
        <div class="h-full overflow-y-auto bg-slate-50">
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold mb-2">📅 Reporte de Check-outs</h1>
                        <p class="text-teal-100">Gestión de salidas de huéspedes</p>
                    </div>
                    <!-- Data Source Toggle -->
                    <div class="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                        <button 
                            onclick="window.setCheckoutDataSource('ical')"
                            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all ${icalActiveClass}"
                        >
                            📆 iCal
                        </button>
                        <button 
                            onclick="window.setCheckoutDataSource('api')"
                            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all ${apiActiveClass}"
                        >
                            🚀 API Rápida
                        </button>
                    </div>
                </div>
            </div>
            
            ${content}
        </div>
    `;
}

/**
 * Carga check-outs desde la API de TravelSuites
 */
export async function loadCheckoutsFromAPI(date) {
    const dateStr = formatDateForAPI(date);
    console.log(`🚀 Cargando check-outs desde API: ${dateStr}`);
    return await fetchCheckOuts(dateStr);
}

/**
 * Vista diaria
 */
function renderDailyView(selectedDate, state, dataSource, apiCheckouts, apiLoading) {
    const dateStr = formatDateForInput(selectedDate);
    const displayDate = formatDateDisplay(selectedDate);

    let checkouts = [];
    let isLoading = false;
    const useAPI = dataSource === 'api';

    if (useAPI) {
        isLoading = apiLoading;
        checkouts = apiCheckouts || [];
    } else {
        checkouts = getCheckoutsForDate(selectedDate, state);
    }

    const loadBtnClass = isLoading ? 'opacity-50 cursor-not-allowed' : '';
    const loadBtnText = isLoading ? '⏳ Cargando...' : '🔄 Cargar';
    const checkoutCount = checkouts.length;
    const checkoutText = checkoutCount === 0 ? 'No hay check-outs programados' :
        checkoutCount === 1 ? '1 departamento con check-out' :
            `${checkoutCount} departamentos con check-out`;

    let loadButton = '';
    if (useAPI) {
        loadButton = `
            <button 
                onclick="window.loadAPICheckouts('${dateStr}')"
                class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md ${loadBtnClass}"
                ${isLoading ? 'disabled' : ''}
            >
                ${loadBtnText}
            </button>
        `;
    }

    let apiIndicator = '';
    if (useAPI) {
        apiIndicator = `
            <div class="mt-3 flex items-center gap-2 text-sm text-purple-600">
                <span class="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Modo API TravelSuites - Datos en tiempo real del servidor
            </div>
        `;
    }

    let highActivityBadge = '';
    if (checkoutCount > 5) {
        highActivityBadge = `
            <div class="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold">
                ⚠️ Día con alta actividad
            </div>
        `;
    }

    let checkoutsList = '';
    if (isLoading) {
        checkoutsList = renderAPILoadingState();
    } else if (checkoutCount === 0) {
        checkoutsList = useAPI && !apiCheckouts ? renderAPIPromptState() : renderEmptyState();
    } else {
        const cards = checkouts.map(checkout =>
            useAPI ? renderAPICheckoutCard(checkout) : renderCheckoutCard(checkout)
        ).join('');
        checkoutsList = `
            <!-- Summary -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">${displayDate}</h2>
                        <p class="text-slate-600 mt-1">${checkoutText}</p>
                    </div>
                    ${highActivityBadge}
                </div>
            </div>
            <div class="space-y-4">${cards}</div>
        `;
    }

    // Si no hay loading pero tampoco hay checkouts, mostrar el resumen
    if (!isLoading && checkoutCount === 0) {
        checkoutsList = `
            <!-- Summary -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">${displayDate}</h2>
                        <p class="text-slate-600 mt-1">${checkoutText}</p>
                    </div>
                </div>
            </div>
            ${useAPI && !apiCheckouts ? renderAPIPromptState() : renderEmptyState()}
        `;
    }

    return `
        <div class="max-w-6xl mx-auto p-4 md:p-6">
            <!-- Controls -->
            <div class="bg-white rounded-xl shadow-md p-4 mb-6">
                <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <label class="font-semibold text-slate-700">Fecha:</label>
                        <input 
                            type="date" 
                            value="${dateStr}"
                            onchange="window.setCheckoutReportDate(this.value)"
                            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        ${loadButton}
                    </div>
                    
                    <div class="flex gap-2 w-full md:w-auto">
                        <button 
                            onclick="window.setCheckoutReportViewMode('weekly')"
                            class="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            📊 Vista Semanal
                        </button>
                        <button 
                            onclick="window.exportDailyCheckouts()"
                            class="flex-1 md:flex-none px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            📥 Exportar CSV
                        </button>
                    </div>
                </div>
                ${apiIndicator}
            </div>
            
            ${checkoutsList}
        </div>
    `;
}

/**
 * Vista semanal
 */
function renderWeeklyView(selectedDate, state) {
    const weekStart = getWeekStart(selectedDate);
    const weeklyData = getWeeklyCheckouts(weekStart, state);
    const totalCheckouts = weeklyData.reduce((sum, day) => sum + day.count, 0);
    const avgDaily = Math.round(totalCheckouts / 7 * 10) / 10;
    const maxDay = Math.max(...weeklyData.map(d => d.count));
    const freeDays = weeklyData.filter(d => d.count === 0).length;

    return `
        <div class="max-w-6xl mx-auto p-4 md:p-6">
            <!-- Controls -->
            <div class="bg-white rounded-xl shadow-md p-4 mb-6">
                <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div class="flex items-center gap-3">
                        <button 
                            onclick="window.navigateWeek(-1)"
                            class="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                        >
                            ← Anterior
                        </button>
                        <span class="font-semibold text-slate-700">
                            Semana del ${formatDateDisplay(weekStart)}
                        </span>
                        <button 
                            onclick="window.navigateWeek(1)"
                            class="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                        >
                            Siguiente →
                        </button>
                    </div>
                    
                    <div class="flex gap-2 w-full md:w-auto">
                        <button 
                            onclick="window.setCheckoutReportViewMode('daily')"
                            class="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            📅 Vista Diaria
                        </button>
                        <button 
                            onclick="window.exportWeeklyCheckouts()"
                            class="flex-1 md:flex-none px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            📥 Exportar CSV
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Weekly Summary -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 class="text-xl font-bold text-slate-800 mb-4">Resumen Semanal</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-teal-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-teal-600">${totalCheckouts}</div>
                        <div class="text-sm text-slate-600">Total Check-outs</div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-blue-600">${avgDaily}</div>
                        <div class="text-sm text-slate-600">Promedio Diario</div>
                    </div>
                    <div class="bg-amber-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-amber-600">${maxDay}</div>
                        <div class="text-sm text-slate-600">Día Más Activo</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-green-600">${freeDays}</div>
                        <div class="text-sm text-slate-600">Días Sin Check-outs</div>
                    </div>
                </div>
            </div>
            
            <!-- Weekly Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${weeklyData.map(day => renderDayCard(day)).join('')}
            </div>
        </div>
    `;
}

/**
 * Renderiza tarjeta de check-out (desde iCal)
 */
function renderCheckoutCard(checkout) {
    const { property, event, duration, nextBooking, hasBackToBack } = checkout;

    const backToBackBadge = hasBackToBack ? `
        <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
            ⚡ Back-to-Back
        </span>
    ` : '';

    const borderColor = hasBackToBack ? 'border-amber-500' : 'border-teal-500';
    const sameDayNote = hasBackToBack ? '<span class="text-amber-600 ml-2">(Mismo día)</span>' : '';

    let nextBookingSection = '';
    if (nextBooking) {
        nextBookingSection = `
            <div class="bg-slate-50 rounded-lg p-3 border-l-4 ${borderColor}">
                <div class="text-xs text-slate-500 mb-1">Próxima reserva</div>
                <div class="font-semibold text-slate-800">
                    ➡️ ${formatDateDisplay(new Date(nextBooking.start))}
                    ${sameDayNote}
                </div>
            </div>
        `;
    } else {
        nextBookingSection = `
            <div class="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                <div class="font-semibold text-green-700">✨ Disponible después del check-out</div>
            </div>
        `;
    }

    return `
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-800 mb-1">
                        🏠 ${property.name}
                    </h3>
                    <p class="text-slate-600 text-sm">
                        📍 ${property.address || 'Dirección no disponible'}
                    </p>
                </div>
                ${backToBackBadge}
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div class="text-xs text-slate-500 mb-1">Check-out</div>
                    <div class="font-semibold text-slate-800">⏰ 12:00</div>
                </div>
                <div>
                    <div class="text-xs text-slate-500 mb-1">Estadía</div>
                    <div class="font-semibold text-slate-800">📊 ${duration} ${duration === 1 ? 'noche' : 'noches'}</div>
                </div>
            </div>
            
            ${nextBookingSection}
        </div>
    `;
}

/**
 * Renderiza tarjeta de check-out desde API
 */
function renderAPICheckoutCard(booking) {
    const productName = booking.product_name || 'Propiedad desconocida';
    const checkoutDate = booking.to || booking.end_date || '';
    const checkinDate = booking.from || booking.start_date || '';
    const guestName = booking.guest_name || booking.customer_name || 'Huésped';
    const source = booking.source || 'woocommerce';

    // Calcular noches
    let nights = 0;
    if (checkinDate && checkoutDate) {
        const start = new Date(checkinDate);
        const end = new Date(checkoutDate);
        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    const sourceBadge = source === 'airbnb' ? `
        <span class="bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-1 rounded-full">Airbnb</span>
    ` : source === 'booking' ? `
        <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">Booking</span>
    ` : `
        <span class="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-1 rounded-full">Web</span>
    `;

    return `
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-800 mb-1">
                        🏠 ${productName}
                    </h3>
                    <p class="text-slate-600 text-sm">
                        👤 ${guestName}
                    </p>
                </div>
                ${sourceBadge}
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div class="text-xs text-slate-500 mb-1">Check-out</div>
                    <div class="font-semibold text-slate-800">⏰ 12:00</div>
                </div>
                <div>
                    <div class="text-xs text-slate-500 mb-1">Estadía</div>
                    <div class="font-semibold text-slate-800">📊 ${nights} ${nights === 1 ? 'noche' : 'noches'}</div>
                </div>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                <div class="text-xs text-purple-600">Datos desde API TravelSuites</div>
            </div>
        </div>
    `;
}

/**
 * Estado de carga para API
 */
function renderAPILoadingState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Consultando API TravelSuites...</h3>
            <p class="text-slate-600">Obteniendo check-outs en tiempo real</p>
        </div>
    `;
}

/**
 * Estado para indicar que hay que cargar datos de API
 */
function renderAPIPromptState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="text-6xl mb-4">🚀</div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Modo API TravelSuites</h3>
            <p class="text-slate-600 mb-6">Presiona "🔄 Cargar" para obtener los check-outs desde el servidor.</p>
            <div class="bg-purple-50 border-l-4 border-purple-500 p-4 text-left max-w-md mx-auto">
                <p class="text-purple-800 text-sm">
                    <strong>💡 Ventaja:</strong> Los datos vienen directamente de WordPress, 
                    sin necesidad de sincronizar calendarios iCal.
                </p>
            </div>
        </div>
    `;
}

/**
 * Renderiza tarjeta de día (vista semanal)
 */
function renderDayCard(day) {
    const isToday = isDateToday(day.date);
    const ringClass = isToday ? 'ring-2 ring-teal-500' : '';
    const countColorClass = day.count === 0 ? 'text-slate-300' : day.count > 3 ? 'text-amber-600' : 'text-teal-600';

    let checkoutsList = '';
    if (day.count === 0) {
        checkoutsList = '<p class="text-sm text-slate-400 italic">Sin check-outs</p>';
    } else {
        const items = day.checkouts.slice(0, 3).map(checkout => `
            <div class="text-sm text-slate-700 truncate">
                🏠 ${checkout.property.name}
            </div>
        `).join('');
        const moreItems = day.count > 3 ? `
            <div class="text-xs text-slate-500 italic">
                +${day.count - 3} más...
            </div>
        ` : '';
        checkoutsList = `<div class="space-y-2">${items}${moreItems}</div>`;
    }

    return `
        <div class="bg-white rounded-xl shadow-md p-4 ${ringClass}">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <h3 class="font-bold text-slate-800">${day.dayName}</h3>
                    <p class="text-sm text-slate-600">${formatDateShort(day.date)}</p>
                </div>
                <div class="text-2xl font-bold ${countColorClass}">
                    ${day.count}
                </div>
            </div>
            ${checkoutsList}
        </div>
    `;
}

/**
 * Estado de carga genérico
 */
function renderLoadingState() {
    return `
        <div class="max-w-6xl mx-auto p-4 md:p-6">
            <div class="bg-white rounded-xl shadow-md p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mb-4"></div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Analizando fechas...</h3>
                <p class="text-slate-600">Buscando check-outs en el calendario</p>
            </div>
        </div>
    `;
}

/**
 * Estado cuando no hay calendarios cargados
 */
function renderNoCalendarEventsState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="text-6xl mb-4">📆</div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">No hay eventos de calendario cargados</h3>
            <p class="text-slate-600 mb-6">Para ver el reporte de check-outs, primero necesitas sincronizar los calendarios.</p>
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left max-w-2xl mx-auto">
                <h4 class="font-semibold text-blue-900 mb-2">📝 Pasos para cargar eventos:</h4>
                <ol class="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                    <li>Ve a la vista <strong>"Calendario"</strong></li>
                    <li>Selecciona una propiedad de la lista</li>
                    <li>Los eventos iCal se cargarán automáticamente</li>
                    <li>Regresa a <strong>"Reporte Check-outs"</strong></li>
                </ol>
            </div>
            
            <button 
                onclick="window.setActiveTab('calendar')"
                class="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
                📅 Ir al Calendario
            </button>
        </div>
    `;
}

/**
 * Estado vacío
 */
function renderEmptyState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="text-6xl mb-4">📭</div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">No hay check-outs programados</h3>
            <p class="text-slate-600">No hay salidas de huéspedes para esta fecha.</p>
        </div>
    `;
}

// Utilidades de formato
function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
    const d = new Date(date);
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${d.getDate()} de ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(date) {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function isDateToday(date) {
    const today = new Date();
    const d = new Date(date);
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
}
