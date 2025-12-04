import { getCheckoutsForDate, getWeeklyCheckouts, exportCheckoutsToCSV, exportWeeklyCheckoutsToCSV } from '../../services/checkout-report.service.js';

/**
 * Vista de Reporte de Check-outs
 * Muestra departamentos con salida de huéspedes en una fecha seleccionada
 */
export function CheckoutReportView(state) {
    const selectedDate = state.checkoutReportDate || new Date();
    const viewMode = state.checkoutReportViewMode || 'daily'; // 'daily' o 'weekly'

    let content = '';

    if (viewMode === 'daily') {
        content = renderDailyView(selectedDate, state);
    } else {
        content = renderWeeklyView(selectedDate, state);
    }

    return `
        <div class="h-full overflow-y-auto bg-slate-50">
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg">
                <h1 class="text-2xl md:text-3xl font-bold mb-2">📅 Reporte de Check-outs</h1>
                <p class="text-teal-100">Gestión de salidas de huéspedes</p>
            </div>
            
            ${content}
        </div>
    `;
}

/**
 * Vista diaria
 */
function renderDailyView(selectedDate, state) {
    const checkouts = getCheckoutsForDate(selectedDate, state);
    const dateStr = formatDateForInput(selectedDate);
    const displayDate = formatDateDisplay(selectedDate);

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
            </div>
            
            <!-- Summary -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">${displayDate}</h2>
                        <p class="text-slate-600 mt-1">
                            ${checkouts.length === 0 ? 'No hay check-outs programados' :
            checkouts.length === 1 ? '1 departamento con check-out' :
                `${checkouts.length} departamentos con check-out`}
                        </p>
                    </div>
                    ${checkouts.length > 5 ? `
                        <div class="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold">
                            ⚠️ Día con alta actividad
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Checkouts List -->
            ${checkouts.length === 0 ? renderEmptyState() : `
                <div class="space-y-4">
                    ${checkouts.map(checkout => renderCheckoutCard(checkout)).join('')}
                </div>
            `}
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
                        <div class="text-2xl font-bold text-blue-600">${Math.round(totalCheckouts / 7 * 10) / 10}</div>
                        <div class="text-sm text-slate-600">Promedio Diario</div>
                    </div>
                    <div class="bg-amber-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-amber-600">${Math.max(...weeklyData.map(d => d.count))}</div>
                        <div class="text-sm text-slate-600">Día Más Activo</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-green-600">${weeklyData.filter(d => d.count === 0).length}</div>
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
 * Renderiza tarjeta de check-out
 */
function renderCheckoutCard(checkout) {
    const { property, event, duration, nextBooking, hasBackToBack } = checkout;

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
                ${hasBackToBack ? `
                    <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                        ⚡ Back-to-Back
                    </span>
                ` : ''}
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
            
            ${nextBooking ? `
                <div class="bg-slate-50 rounded-lg p-3 border-l-4 ${hasBackToBack ? 'border-amber-500' : 'border-teal-500'}">
                    <div class="text-xs text-slate-500 mb-1">Próxima reserva</div>
                    <div class="font-semibold text-slate-800">
                        ➡️ ${formatDateDisplay(new Date(nextBooking.start))}
                        ${hasBackToBack ? '<span class="text-amber-600 ml-2">(Mismo día)</span>' : ''}
                    </div>
                </div>
            ` : `
                <div class="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                    <div class="font-semibold text-green-700">✨ Disponible después del check-out</div>
                </div>
            `}
        </div>
    `;
}

/**
 * Renderiza tarjeta de día (vista semanal)
 */
function renderDayCard(day) {
    const isToday = isDateToday(day.date);

    return `
        <div class="bg-white rounded-xl shadow-md p-4 ${isToday ? 'ring-2 ring-teal-500' : ''}">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <h3 class="font-bold text-slate-800">${day.dayName}</h3>
                    <p class="text-sm text-slate-600">${formatDateShort(day.date)}</p>
                </div>
                <div class="text-2xl font-bold ${day.count === 0 ? 'text-slate-300' : day.count > 3 ? 'text-amber-600' : 'text-teal-600'}">
                    ${day.count}
                </div>
            </div>
            
            ${day.count === 0 ? `
                <p class="text-sm text-slate-400 italic">Sin check-outs</p>
            ` : `
                <div class="space-y-2">
                    ${day.checkouts.slice(0, 3).map(checkout => `
                        <div class="text-sm text-slate-700 truncate">
                            🏠 ${checkout.property.name}
                        </div>
                    `).join('')}
                    ${day.count > 3 ? `
                        <div class="text-xs text-slate-500 italic">
                            +${day.count - 3} más...
                        </div>
                    ` : ''}
                </div>
            `}
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
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como inicio
    return new Date(d.setDate(diff));
}

function isDateToday(date) {
    const today = new Date();
    const d = new Date(date);
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
}
