import { PROPERTIES_DATA } from '../../data/data.js';
import { ICONS } from '../../data/data.js';
import { formatDate } from '../../services/booking.service.js';
import { isDateOccupied } from '../../services/calendar.service.js';

/**
 * Vista de Calendario
 * Muestra calendario estilo Airbnb con disponibilidad sincronizada
 * @param {Object} state - Estado de la aplicación
 * @returns {string} HTML de la vista de calendario
 */
export function CalendarView(state) {
    const selectedProperty = state.selectedCalendarProperty || (PROPERTIES_DATA.length > 0 ? PROPERTIES_DATA[0].id : null);
    const property = PROPERTIES_DATA.find(p => p.id === selectedProperty);

    // Filtrar propiedades para el sidebar
    const searchTerm = (state.calendarSearchTerm || '').toLowerCase();
    const filteredProperties = PROPERTIES_DATA.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.building.toLowerCase().includes(searchTerm)
    );

    if (!property) {
        return `
            <div class="flex flex-col h-full items-center justify-center p-8">
                <div class="text-slate-400 mb-4">${ICONS.calendar}</div>
                <p class="text-slate-600">No hay propiedades disponibles</p>
            </div>
        `;
    }

    // Generar lista de propiedades (Sidebar)
    const sidebarClasses = state.calendarSidebarOpen
        ? 'fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto'
        : 'fixed inset-0 z-50 -translate-x-full lg:translate-x-0 lg:relative lg:inset-auto lg:z-auto';

    const propertyList = `
        <div class="${sidebarClasses} flex flex-col bg-white border-l border-slate-200 w-full lg:w-80 flex-shrink-0 shadow-2xl lg:shadow-none transition-transform duration-300" style="height: 100%;">
            <!-- Mobile Header -->
            <div class="lg:hidden p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
                <h3 class="font-bold text-slate-800">Seleccionar Departamento</h3>
                <button onclick="window.toggleCalendarSidebar()" class="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
                    ${ICONS.close}
                </button>
            </div>

            <div class="p-4 border-b border-slate-100 flex-shrink-0">
                <div class="relative">
                    <input 
                        type="text" 
                        id="calendar-search"
                        placeholder="Buscar departamento..." 
                        value="${state.calendarSearchTerm || ''}"
                        oninput="window.setCalendarSearch(this.value)"
                        class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    >
                    <div class="absolute left-3 top-2.5 text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>
            
            <div id="calendar-property-list" class="flex-1 overflow-y-scroll p-2 space-y-2" style="min-height: 0;">
                ${filteredProperties.map(p => `
                    <div 
                        onclick="event.preventDefault(); event.stopPropagation(); window.setCalendarProperty('${p.id}'); if(window.innerWidth < 1024) window.toggleCalendarSidebar();"
                        class="p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${p.id === selectedProperty ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-300' : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50'}"
                    >
                        <div class="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover" alt="${p.name}">` : `<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">N/A</div>`}
                        </div>
                        <div class="min-w-0">
                            <h4 class="text-sm font-bold text-slate-800 truncate">${p.name}</h4>
                            <p class="text-xs text-slate-500 truncate">${p.building}</p>
                        </div>
                        ${p.id === selectedProperty ? `
                            <div class="ml-auto text-teal-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                
                ${filteredProperties.length === 0 ? `
                    <div class="text-center py-8 text-slate-400 text-sm">
                        No se encontraron propiedades
                    </div>
                ` : ''}
            </div>
        </div>
        <!-- Backdrop for mobile -->
        ${state.calendarSidebarOpen ? '<div onclick="window.toggleCalendarSidebar()" class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"></div>' : ''}
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

        // Verificar disponibilidad real
        const isOccupied = state.calendarEvents ? isDateOccupied(currentDay, state.calendarEvents) : false;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        let cellClass = 'aspect-square p-2 rounded-lg border transition-all cursor-pointer relative';
        let textClass = 'text-sm font-medium relative z-10';

        // Lógica de selección
        let isSelected = state.selectedDates.includes(dateStr);
        let isInRange = false;

        if (state.selectedDates.length > 0) {
            const first = state.selectedDates[0];
            const last = state.selectedDates[state.selectedDates.length - 1];

            if (dateStr === first || dateStr === last) {
                isSelected = true;
            } else if (state.selectedDates.includes(dateStr)) {
                isInRange = true;
                isSelected = false;
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
            cellClass += ' bg-green-50/50 border-green-100 hover:border-teal-400 hover:shadow-sm';
            textClass += ' text-slate-700';
        }

        if (isToday && !isSelected && !isInRange) {
            cellClass += ' ring-2 ring-teal-500';
        }

        const onClick = (!isPast && !isOccupied) ? `onclick="window.selectDate('${dateStr}', event)"` : '';

        calendarCells += `
            <div class="${cellClass}" ${onClick}>
                <div class="${textClass}">${day}</div>
                ${isOccupied && !isPast ? '<div class="text-[10px] text-red-500 mt-1 font-medium">Ocupado</div>' : ''}
                ${!isOccupied && !isPast && !isSelected && !isInRange ? '<div class="text-[10px] text-green-600 mt-1 font-medium">Libre</div>' : ''}
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
        <div class="absolute inset-0 flex flex-col lg:flex-row overflow-hidden bg-white">
            <!-- Calendar Main Area -->
            <div class="flex-1 flex flex-col overflow-hidden relative" style="height: 100%;">
                <!-- Header -->
                <div class="bg-slate-900 p-4 md:p-6 flex-shrink-0 shadow-lg md:rounded-bl-2xl flex justify-between items-center">
                    <div>
                        <h1 class="text-white font-bold text-lg md:text-2xl">Calendario de Disponibilidad</h1>
                        <p class="text-slate-400 text-sm mt-1">${property.name}</p>
                    </div>
                    <!-- Mobile Toggle Button -->
                    <button onclick="window.toggleCalendarSidebar()" class="lg:hidden p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors border border-slate-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
                
                <!-- Loading Overlay -->
                ${state.calendarLoading ? `
                    <div class="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center">
                        <div class="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 border border-slate-200">
                            <div class="relative">
                                <div class="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                            </div>
                            <div class="text-center">
                                <h3 class="font-bold text-slate-800 text-lg mb-1">Sincronizando calendario</h3>
                                <p class="text-slate-500 text-sm">Obteniendo disponibilidad actualizada...</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
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
                                    <div class="w-4 h-4 bg-green-50 border-2 border-green-100 rounded"></div>
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
                ${state.selectedDates.length > 0 ? renderBookingPanel(state, property) : ''}
            </div>

            <!-- Property Sidebar -->
            ${propertyList}
        </div>
    `;
}

function renderBookingPanel(state, property) {
    const quote = state.bookingQuote;

    let checkIn = '-';
    let checkOut = '-';

    if (state.selectedDates.length > 0) {
        const first = new Date(state.selectedDates[0] + 'T00:00:00');
        const last = new Date(state.selectedDates[state.selectedDates.length - 1] + 'T00:00:00');

        checkIn = formatDate(first);
        if (state.selectedDates.length === 1) {
            const nextDay = new Date(first);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOut = formatDate(nextDay);
        } else {
            const nextDay = new Date(last);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOut = formatDate(nextDay);
        }
    }

    return `
        <div class="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-white shadow-2xl md:rounded-2xl border-t md:border border-slate-200 p-6 z-50 animate-slide-up">
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-lg text-slate-800">Nueva Reserva</h3>
                <button onclick="window.selectDate('${state.selectedDates[0]}')" class="text-slate-400 hover:text-slate-600">
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
