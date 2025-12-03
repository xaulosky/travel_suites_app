/**
 * Servicio de Reservas
 * Maneja la lógica de negocio para cálculos de precios y reglas de reserva
 */

/**
 * Calcula la cotización para una reserva
 * @param {Object} property - Objeto de la propiedad
 * @param {Date} checkIn - Fecha de entrada
 * @param {Date} checkOut - Fecha de salida
 * @param {number} guests - Cantidad de huéspedes
 * @returns {Object} Cotización detallada
 */
/**
 * Calcula la cotización para una reserva
 * @param {Object} property - Objeto de la propiedad
 * @param {Array} selectedDates - Array de fechas seleccionadas (YYYY-MM-DD)
 * @param {number} guests - Cantidad de huéspedes
 * @returns {Object} Cotización detallada
 */
export function calculateQuote(property, selectedDates, guests) {
    // Validaciones básicas
    if (!property || !selectedDates || selectedDates.length === 0) return null;

    // Calcular número de noches (cada fecha seleccionada es una noche)
    const nights = selectedDates.length;

    // Validar estadía mínima
    const minDuration = property.duration?.min || 1;
    if (nights < minDuration) {
        return { error: `La estadía mínima es de ${minDuration} noches` };
    }

    // Validar capacidad
    const maxCapacity = property.capacity?.max || 2;
    if (guests > maxCapacity) {
        return { error: `La capacidad máxima es de ${maxCapacity} personas` };
    }

    // Precio base por noche
    const basePricePerNight = parseInt(property.price) || 0;
    let totalBase = basePricePerNight * nights;

    // Costo por persona extra
    let extraPersonTotal = 0;
    const extraPrice = parseInt(property.prices?.extraPerson) || 0;
    const extraPersonThreshold = parseInt(property.prices?.extraPersonTrigger) || 0;

    if (extraPrice > 0 && guests > extraPersonThreshold) {
        const extraGuests = guests - extraPersonThreshold;
        extraPersonTotal = extraGuests * extraPrice * nights;
    }

    // Subtotal antes de descuentos
    let subtotal = totalBase + extraPersonTotal;

    // Calcular descuentos
    let discountTotal = 0;
    let discountApplied = null;

    // Descuento mensual (30+ noches)
    if (nights >= 30 && property.discounts?.monthly) {
        const monthlyDiscount = parseInt(property.discounts.monthly) || 0;
        if (monthlyDiscount > 0) {
            discountTotal = Math.round(subtotal * (monthlyDiscount / 100));
            discountApplied = { type: 'monthly', percentage: monthlyDiscount, amount: discountTotal };
        }
    }
    // Descuento semanal (7+ noches) - Solo si no aplicó mensual
    else if (nights >= 7 && property.discounts?.weekly) {
        const weeklyDiscount = parseInt(property.discounts.weekly) || 0;
        if (weeklyDiscount > 0) {
            discountTotal = Math.round(subtotal * (weeklyDiscount / 100));
            discountApplied = { type: 'weekly', percentage: weeklyDiscount, amount: discountTotal };
        }
    }

    const total = subtotal - discountTotal;

    return {
        nights,
        guests,
        pricePerNight: basePricePerNight,
        totalBase,
        extraPersonPrice: extraPrice,
        extraPersonTotal,
        subtotal,
        discount: discountApplied,
        total,
        formattedTotal: new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)
    };
}

/**
 * Formatea una fecha para mostrar (DD/MM/YYYY)
 * @param {Date} date 
 * @returns {string}
 */
export function formatDate(date) {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formatea una fecha para API (YYYY-MM-DD)
 * @param {Date} date 
 * @returns {string}
 */
export function formatDateAPI(date) {
    return date.toISOString().split('T')[0];
}
