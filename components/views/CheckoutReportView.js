import { fetchCheckOuts, formatDateForAPI } from '../../services/travelsuites.service.js';

/**
 * Vista de Reporte de Check-outs
 * Muestra departamentos con salida de huéspedes en una fecha seleccionada
 * Usa directamente la API de TravelSuites
 */
export function CheckoutReportView(state) {
    const selectedDate = state.checkoutReportDate || new Date();
    const viewMode = state.checkoutReportViewMode || 'daily';
    const checkouts = state.apiCheckouts || null;
    const isLoading = state.apiCheckoutsLoading || false;

    let content = '';

    if (viewMode === 'daily') {
        content = renderDailyView(selectedDate, checkouts, isLoading);
    } else {
        content = renderWeeklyView(selectedDate, checkouts, isLoading);
    }

    return `
        <div class="h-full overflow-y-auto bg-slate-50">
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold mb-2">📅 Reporte de Check-outs</h1>
                        <p class="text-teal-100">Gestión de salidas de huéspedes</p>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-teal-100">
                        <span class="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Conectado a TravelSuites API
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
function renderDailyView(selectedDate, checkouts, isLoading) {
    const dateStr = formatDateForInput(selectedDate);
    const displayDate = formatDateDisplay(selectedDate);
    const checkoutList = checkouts || [];
    const checkoutCount = checkoutList.length;

    const loadBtnClass = isLoading ? 'opacity-50 cursor-not-allowed' : '';
    const loadBtnText = isLoading ? '⏳ Cargando...' : '🔄 Cargar Check-outs';

    const checkoutText = checkoutCount === 0 ? 'No hay check-outs programados' :
        checkoutCount === 1 ? '1 departamento con check-out' :
            `${checkoutCount} departamentos con check-out`;

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
        checkoutsList = renderLoadingState();
    } else if (checkoutCount === 0) {
        checkoutsList = checkouts === null ? renderPromptState() : renderEmptyState();
    } else {
        const cards = checkoutList.map(checkout => renderCheckoutCard(checkout)).join('');
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
            <!-- Checkouts List -->
            <div class="space-y-4">
                ${cards}
            </div>
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
                        <button 
                            onclick="window.loadAPICheckouts('${dateStr}')"
                            class="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all font-semibold shadow-md ${loadBtnClass}"
                            ${isLoading ? 'disabled' : ''}
                        >
                            ${loadBtnText}
                        </button>
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
                            class="flex-1 md:flex-none px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            📥 Exportar CSV
                        </button>
                    </div>
                </div>
            </div>

            ${checkoutsList}
        </div>
    `;
}

/**
 * Vista semanal
 */
function renderWeeklyView(selectedDate, checkouts, isLoading) {
    const weekStart = getWeekStart(selectedDate);

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
                    </div>
                </div>
            </div>
            
            <!-- Weekly Grid -->
            <div class="bg-white rounded-xl shadow-md p-6">
                <p class="text-slate-600 text-center">
                    La vista semanal requiere cargar cada día individualmente.<br>
                    Usa la vista diaria para consultar check-outs por fecha.
                </p>
            </div>
        </div>
    `;
}

/**
 * Renderiza tarjeta de check-out desde API
 */
function renderCheckoutCard(booking) {
    const productName = booking.product_name || 'Propiedad sin nombre';
    const guestName = booking.guest_name || booking.billing?.first_name || 'Huésped no registrado';
    const checkIn = booking.start_date || 'N/A';
    const checkOut = booking.end_date || 'N/A';
    const nights = booking.nights || calculateNights(checkIn, checkOut);
    const source = booking.source || 'TravelSuites';
    const status = booking.status || 'confirmed';

    // Badge según origen
    let sourceBadge = '';
    if (source === 'airbnb') {
        sourceBadge = '<span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Airbnb</span>';
    } else if (source === 'booking') {
        sourceBadge = '<span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Booking</span>';
    } else {
        sourceBadge = '<span class="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Directo</span>';
    }

    // Badge de estado
    let statusBadge = '';
    if (status === 'confirmed' || status === 'paid') {
        statusBadge = '<span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✓ Confirmado</span>';
    } else if (status === 'pending') {
        statusBadge = '<span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">⏳ Pendiente</span>';
    }

    return `
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-teal-500">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-800 mb-1">
                        🏠 ${productName}
                    </h3>
                    <p class="text-slate-600 text-sm">
                        👤 ${guestName}
                    </p>
                </div>
                <div class="flex gap-2">
                    ${sourceBadge}
                    ${statusBadge}
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <div class="text-slate-500 mb-1">Check-in</div>
                    <div class="font-semibold text-slate-800">📅 ${formatDateShort(checkIn)}</div>
                </div>
                <div>
                    <div class="text-slate-500 mb-1">Check-out</div>
                    <div class="font-semibold text-slate-800">📅 ${formatDateShort(checkOut)}</div>
                </div>
                <div>
                    <div class="text-slate-500 mb-1">Estadía</div>
                    <div class="font-semibold text-slate-800">🌙 ${nights} ${nights === 1 ? 'noche' : 'noches'}</div>
                </div>
            </div>
            
            ${booking.notes ? `
                <div class="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                    💬 ${booking.notes}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Estado de carga
 */
function renderLoadingState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 class="text-xl font-semibold text-slate-700 mb-2">Cargando check-outs...</h3>
            <p class="text-slate-500">Consultando la API de TravelSuites</p>
        </div>
    `;
}

/**
 * Estado inicial - pedir que cargue datos
 */
function renderPromptState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="inline-block p-4 bg-teal-100 rounded-full mb-4">
                <span class="text-4xl">🔍</span>
            </div>
            <h3 class="text-xl font-semibold text-slate-700 mb-2">Selecciona una fecha y carga los datos</h3>
            <p class="text-slate-500 mb-4">
                Haz clic en "Cargar Check-outs" para consultar las salidas del día seleccionado.
            </p>
        </div>
    `;
}

/**
 * Estado vacío
 */
function renderEmptyState() {
    return `
        <div class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="inline-block p-4 bg-green-100 rounded-full mb-4">
                <span class="text-4xl">✅</span>
            </div>
            <h3 class="text-xl font-semibold text-slate-700 mb-2">No hay check-outs para esta fecha</h3>
            <p class="text-slate-500">
                No se encontraron salidas programadas para el día seleccionado.
            </p>
        </div>
    `;
}

// ==================== Utilidades ====================

function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-CL', options);
}

function formatDateShort(dateStr) {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('es-CL', options);
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
}
