/**
 * Servicio de Reportes de Check-out
 * Analiza eventos de calendario para generar reportes de salidas
 */

/**
 * Normaliza una fecha a formato ISO string (YYYY-MM-DD)
 * Maneja tanto objetos Date como strings de iCal
 */
function normalizeDate(dateInput) {
    if (!dateInput) return null;

    // Si ya es un string ISO, retornarlo
    if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateInput;
    }

    // Si es un Date object o string de fecha, convertir a ISO
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Obtiene check-outs para una fecha específica
 * @param {Date} date - Fecha a analizar
 * @param {Object} state - Estado global de la app
 * @returns {Array} Lista de check-outs
 */
export function getCheckoutsForDate(date, state) {
    const dateStr = formatDateISO(date);
    const checkouts = [];

    // Obtener todas las propiedades
    const properties = window.PROPERTIES_DATA || [];

    properties.forEach(property => {
        // Obtener eventos de esta propiedad
        const propertyEvents = (state.calendarEvents || []).filter(event =>
            event.propertyId === property.id
        );

        // Buscar eventos que terminen en esta fecha
        propertyEvents.forEach(event => {
            // Normalizar la fecha de fin del evento (puede ser Date o string)
            const eventEndDate = normalizeDate(event.end);

            if (eventEndDate === dateStr) {
                const eventStartDate = normalizeDate(event.start);
                const duration = calculateNights(eventStartDate, eventEndDate);
                const nextBooking = findNextBooking(property.id, dateStr, propertyEvents);

                checkouts.push({
                    property: property,
                    event: {
                        ...event,
                        start: eventStartDate,
                        end: eventEndDate
                    },
                    duration: duration,
                    nextBooking: nextBooking,
                    hasBackToBack: nextBooking && normalizeDate(nextBooking.start) === dateStr
                });
            }
        });
    });

    // Ordenar por nombre de propiedad
    checkouts.sort((a, b) => a.property.name.localeCompare(b.property.name));

    return checkouts;
}

/**
 * Obtiene check-outs para una semana completa
 * @param {Date} startDate - Fecha de inicio de la semana
 * @param {Object} state - Estado global
 * @returns {Array} Array de objetos {date, checkouts}
 */
export function getWeeklyCheckouts(startDate, state) {
    const week = [];

    for (let i = 0; i < 7; i++) {
        const date = addDays(startDate, i);
        const checkouts = getCheckoutsForDate(date, state);

        week.push({
            date: date,
            dayName: getDayName(date),
            checkouts: checkouts,
            count: checkouts.length
        });
    }

    return week;
}

/**
 * Calcula número de noches entre dos fechas
 */
function calculateNights(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Encuentra la próxima reserva después de una fecha
 */
function findNextBooking(propertyId, afterDate, events) {
    const afterDateObj = new Date(afterDate);

    const futureBookings = events
        .filter(event => {
            const eventStart = new Date(normalizeDate(event.start));
            return eventStart >= afterDateObj;
        })
        .sort((a, b) => new Date(normalizeDate(a.start)) - new Date(normalizeDate(b.start)));

    const nextEvent = futureBookings[0];
    if (!nextEvent) return null;

    // Retornar con fechas normalizadas
    return {
        ...nextEvent,
        start: normalizeDate(nextEvent.start),
        end: normalizeDate(nextEvent.end)
    };
}

/**
 * Formatea fecha a ISO (YYYY-MM-DD)
 */
function formatDateISO(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Suma días a una fecha
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Obtiene nombre del día
 */
function getDayName(date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
}

/**
 * Exporta check-outs a CSV
 * @param {Array} checkouts - Lista de check-outs
 * @param {Date} date - Fecha del reporte
 */
export function exportCheckoutsToCSV(checkouts, date) {
    const headers = ['Departamento', 'Dirección', 'Check-out', 'Noches', 'Próxima Reserva', 'Back-to-Back'];

    const rows = checkouts.map(checkout => [
        checkout.property.name,
        checkout.property.address || 'N/A',
        checkout.event.end,
        checkout.duration,
        checkout.nextBooking ? checkout.nextBooking.start : 'Disponible',
        checkout.hasBackToBack ? 'Sí' : 'No'
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `checkouts-${formatDateISO(date)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Exporta vista semanal a CSV
 */
export function exportWeeklyCheckoutsToCSV(weeklyData, startDate) {
    const headers = ['Fecha', 'Día', 'Departamento', 'Dirección', 'Noches'];

    const rows = [];
    weeklyData.forEach(day => {
        if (day.checkouts.length === 0) {
            rows.push([formatDateISO(day.date), day.dayName, 'Sin check-outs', '', '']);
        } else {
            day.checkouts.forEach(checkout => {
                rows.push([
                    formatDateISO(day.date),
                    day.dayName,
                    checkout.property.name,
                    checkout.property.address || 'N/A',
                    checkout.duration
                ]);
            });
        }
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `checkouts-semana-${formatDateISO(startDate)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
