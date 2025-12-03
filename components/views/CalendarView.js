import { PROPERTIES_DATA } from '../../data/data.js';
import { ICONS } from '../../data/data.js';
import { formatDate } from '../../services/booking.service.js';

/**
 * Vista de Calendario
 * Muestra calendario estilo Airbnb con disponibilidad sincronizada
 * @param {Object} state - Estado de la aplicación
 * @returns {string} HTML de la vista de calendario
 */
export function CalendarView(state) {
    const selectedProperty = state.selectedCalendarProperty || (PROPERTIES_DATA.length > 0 ? PROPERTIES_DATA[0].id : null);
    const property = PROPERTIES_DATA.find(p => p.id === selectedProperty);

    if (!property) {
        return `
            <div class="flex flex-col h-full items-center justify-center p-8">
                <div class="text-slate-400 mb-4">${ICONS.calendar}</div>
                <p class="text-slate-600">No hay propiedades disponibles</p>
            </div>
        `;
    }

    // Generar selector de propiedades
    const propertySelector = `
        <select onchange="window.setCalendarProperty(this.value)" class="w-full md:w-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 outline-none">
            ${PROPERTIES_DATA.map(p => `
                <option value="${p.id}" ${p.id === selectedProperty ? 'selected' : ''}>
                    ${p.name}
                </option>
            `).join('')}
        </select>
    `;

    // Obtener mes y año actual
    const currentDate = state.calendarDate || new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Generar días del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Días de la semana
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Generar celdas del calendario
    let calendarCells = '';

    // Celdas vacías antes del primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarCells += '<div class="aspect-square"></div>';
    }

    // Celdas de los días del mes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month, day);
        currentDay.setHours(0, 0, 0, 0);

        const isPast = currentDay < today;
        const isToday = currentDay.getTime() === today.getTime();

        // Aquí se verificaría si el día está ocupado según los calendarios externos
        // Por ahora, simulamos algunos días ocupados
        const isOccupied = Math.random() > 0.7; // Simulación

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        let cellClass = 'aspect-square p-2 rounded-lg border transition-all cursor-pointer relative';
        let textClass = 'text-sm font-medium relative z-10';

        // Lógica de selección
        let isSelected = false;
        let isInRange = false;

        if (state.selectionStart) {
            const startStr = state.selectionStart.toDateString();
            const endStr = state.selectionEnd ? state.selectionEnd.toDateString() : null;
            const currentStr = currentDay.toDateString();

            if (currentStr === startStr || currentStr === endStr) {
                isSelected = true;
            } else if (state.selectionEnd && currentDay > state.selectionStart && currentDay < state.selectionEnd) {
                isInRange = true;
            }
        }

        if (isPast) {
            cellClass += ' bg-slate-50 border-slate-100 cursor-not-allowed';
            textClass += ' text-slate-300';
        } else if (isOccupied) {
            cellClass += ' bg-red-50 border-red-200 cursor-not-allowed';
            textClass += ' text-red-600';
        } else if (isSelected) {
            cellClass += ' bg-teal-600 border-teal-600 text-white shadow-md transform scale-105 z-20';
            textClass += ' text-white';
        } else if (isInRange) {
            cellClass += ' bg-teal-50 border-teal-100';
            textClass += ' text-teal-700';
        } else {
            cellClass += ' bg-white border-slate-200 hover:border-teal-400 hover:shadow-sm';
            textClass += ' text-slate-700';
        }

        if (isToday && !isSelected && !isInRange) {
            cellClass += ' ring-2 ring-teal-500';
        }

        const onClick = (!isPast && !isOccupied) ? `onclick="window.selectDate('${dateStr}')"` : '';

        calendarCells += `
            <div class="${cellClass}" ${onClick}>
                <div class="${textClass}">${day}</div>
                ${isOccupied && !isPast ? '<div class="text-[10px] text-red-500 mt-1 font-medium">Ocupado</div>' : ''}
                ${!isOccupied && !isPast && !isSelected && !isInRange ? '<div class="text-[10px] text-green-600 mt-1 opacity-0 hover:opacity-100 transition-opacity">Libre</div>' : ''}
                ${isSelected ? '<div class="text-[10px] text-white mt-1 font-medium">Check</div>' : ''}
            </div>
        `;
    }

    // Información de sincronización
    const syncInfo = property.externalCalendars ? `
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <h4 class="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Sincronización Activa
            </h4>
            <div class="space-y-1 text-xs text-blue-700">
                ${property.externalCalendars.airbnb ? '<div>✓ Airbnb conectado</div>' : ''}
                ${property.externalCalendars.booking ? '<div>✓ Booking.com conectado</div>' : ''}
                <div class="text-blue-600 mt-2">Última actualización: hace 5 minutos</div>
            </div>
        </div>
    ` : `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <p class="text-sm text-amber-700">
                ⚠️ Esta propiedad no tiene calendarios externos configurados
            </p>
        </div>
    `;

    return `
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="bg-slate-900 p-4 md:p-6 sticky top-0 z-10 shadow-lg md:rounded-b-2xl">
                <h1 class="text-white font-bold text-lg md:text-2xl mb-4">Calendario de Disponibilidad</h1>
                ${propertySelector}
            </div>
            
            <!-- Calendar Content -->
            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                <div class="max-w-4xl mx-auto">
                    <!-- Month Navigation -->
                    <div class="flex justify-between items-center mb-6">
                        <button onclick="window.previousMonth()" class="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <h2 class="text-2xl font-bold text-slate-800">${monthNames[month]} ${year}</h2>
                        <button onclick="window.nextMonth()" class="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <!-- Week Days -->
                        <div class="grid grid-cols-7 gap-2 mb-2">
                            ${weekDays.map(day => `
                                <div class="text-center text-xs font-bold text-slate-500 uppercase">${day}</div>
                            `).join('')}
                        </div>
                        
                        <!-- Calendar Days -->
                        <div class="grid grid-cols-7 gap-2">
                            ${calendarCells}
                        </div>
                    </div>
                    
                    <!-- Legend -->
                    <div class="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <h3 class="text-sm font-bold text-slate-700 mb-3">Leyenda</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-white border-2 border-slate-200 rounded"></div>
                                <span class="text-xs text-slate-600">Disponible</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-red-50 border-2 border-red-200 rounded"></div>
                                <span class="text-xs text-slate-600">Ocupado</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-slate-50 border-2 border-slate-100 rounded"></div>
                                <span class="text-xs text-slate-600">Pasado</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-white border-2 border-teal-500 rounded ring-2 ring-teal-500"></div>
                                <span class="text-xs text-slate-600">Hoy</span>
                            </div>
                        </div>
                    </div>
                    
                    ${syncInfo}
                    
                    <!-- Property Info -->
                    <div class="mt-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 border border-teal-200">
                        <h3 class="font-bold text-teal-800 mb-2">${property.name}</h3>
                        <div class="text-sm text-teal-700 space-y-1">
                            <div>📍 ${property.address}</div>
                            <div>💰 ${property.priceFormatted}/noche</div>
                            <div>👥 Hasta ${property.capacity?.max || 'N/A'} personas</div>
                            ${property.duration?.min > 1 ? `<div>📅 Estadía mínima: ${property.duration.min} noches</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Booking Panel (Side/Bottom) -->
            ${state.selectionStart ? renderBookingPanel(state, property) : ''}
        </div>
    `;
}

function renderBookingPanel(state, property) {
    const quote = state.bookingQuote;
    const checkIn = state.selectionStart ? formatDate(state.selectionStart) : '-';
    const checkOut = state.selectionEnd ? formatDate(state.selectionEnd) : '-';

    return `
        <div class="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-white shadow-2xl md:rounded-2xl border-t md:border border-slate-200 p-6 z-50 animate-slide-up">
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-lg text-slate-800">Nueva Reserva</h3>
                <button onclick="window.selectDate('${state.selectionStart.toISOString().split('T')[0]}')" class="text-slate-400 hover:text-slate-600">
                    ${ICONS.close}
                </button>
            </div>
            
            <div class="space-y-4">
                <!-- Fechas -->
                <div class="flex gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div class="flex-1">
                        <div class="text-xs text-slate-500 uppercase font-bold">Check-in</div>
                        <div class="font-medium text-slate-800">${checkIn}</div>
                    </div>
                    <div class="w-px bg-slate-200"></div>
                    <div class="flex-1">
                        <div class="text-xs text-slate-500 uppercase font-bold">Check-out</div>
                        <div class="font-medium text-slate-800">${checkOut}</div>
                    </div>
                </div>
                
                <!-- Huéspedes -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Huéspedes</label>
                    <select onchange="window.updateGuestCount(this.value)" class="w-full p-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 outline-none">
                        ${Array.from({ length: property.capacity.max }, (_, i) => i + 1).map(n => `
                            <option value="${n}" ${n === state.bookingGuestCount ? 'selected' : ''}>${n} Persona${n > 1 ? 's' : ''}</option>
                        `).join('')}
                    </select>
                </div>
                
                ${quote && !quote.error ? `
                    <!-- Cotización -->
                    <div class="space-y-2 py-3 border-t border-b border-slate-100">
                        <div class="flex justify-between text-sm text-slate-600">
                            <span>${quote.nights} noches x $${quote.pricePerNight.toLocaleString('es-CL')}</span>
                            <span>$${quote.totalBase.toLocaleString('es-CL')}</span>
                        </div>
                        ${quote.extraPersonTotal > 0 ? `
                            <div class="flex justify-between text-sm text-slate-600">
                                <span>Extra personas</span>
                                <span>$${quote.extraPersonTotal.toLocaleString('es-CL')}</span>
                            </div>
                        ` : ''}
                        ${quote.discount ? `
                            <div class="flex justify-between text-sm text-green-600 font-medium">
                                <span>Descuento ${quote.discount.type === 'weekly' ? 'Semanal' : 'Mensual'} (${quote.discount.percentage}%)</span>
                                <span>-$${quote.discount.amount.toLocaleString('es-CL')}</span>
                            </div>
                        ` : ''}
                        <div class="flex justify-between font-bold text-lg text-slate-800 pt-2">
                            <span>Total</span>
                            <span>${quote.formattedTotal}</span>
                        </div>
                    </div>
                    
                    <!-- Datos Cliente -->
                    <div class="space-y-3">
                        <input type="text" placeholder="Nombre completo" class="w-full p-2 rounded-lg border border-slate-200 text-sm" onchange="window.updateGuestDetails('name', this.value)" value="${state.guestDetails?.name || ''}">
                        <input type="email" placeholder="Email" class="w-full p-2 rounded-lg border border-slate-200 text-sm" onchange="window.updateGuestDetails('email', this.value)" value="${state.guestDetails?.email || ''}">
                        <input type="tel" placeholder="Teléfono" class="w-full p-2 rounded-lg border border-slate-200 text-sm" onchange="window.updateGuestDetails('phone', this.value)" value="${state.guestDetails?.phone || ''}">
                    </div>
                    
                    <button onclick="window.createBooking()" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-900/20 transition-all transform hover:scale-[1.02]">
                        Confirmar Reserva
                    </button>
                ` : quote && quote.error ? `
                    <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                        ${quote.error}
                    </div>
                ` : `
                    <div class="text-center text-slate-400 text-sm py-2">
                        Selecciona fecha de salida para ver precio
                    </div>
                `}
            </div>
        </div>
    `;
}
