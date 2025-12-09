/**
 * Servicio de Calendarios iCal
 * Maneja la obtención y parseo de calendarios externos (Airbnb, Booking.com)
 */

/**
 * Parsea un archivo iCal y extrae los eventos
 * @param {string} icalData - Contenido del archivo iCal
 * @returns {Array} Array de eventos
 */
function parseICal(icalData) {
    const events = [];
    const lines = icalData.split('\n');
    let currentEvent = null;

    for (let line of lines) {
        line = line.trim();

        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            events.push(currentEvent);
            currentEvent = null;
        } else if (currentEvent) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex);
                const value = line.substring(colonIndex + 1);

                if (key.startsWith('DTSTART')) {
                    currentEvent.start = parseiCalDate(value);
                } else if (key.startsWith('DTEND')) {
                    currentEvent.end = parseiCalDate(value);
                } else if (key === 'SUMMARY') {
                    currentEvent.summary = value;
                } else if (key === 'UID') {
                    currentEvent.uid = value;
                }
            }
        }
    }

    return events;
}

/**
 * Parsea una fecha en formato iCal
 * @param {string} dateStr - Fecha en formato iCal (YYYYMMDD o YYYYMMDDTHHMMSSZ)
 * @returns {Date} Objeto Date
 */
function parseiCalDate(dateStr) {
    // Formato: YYYYMMDD o YYYYMMDDTHHMMSSZ
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));

    return new Date(year, month, day);
}

/**
 * Obtiene eventos de un calendario iCal desde una URL
 * Nota: Debido a CORS, esto requiere un proxy o backend
 * @param {string} url - URL del calendario iCal
 * @returns {Promise<Array>} Array de eventos
 */
export async function fetchCalendarEvents(url) {
    if (!url) return [];

    try {
        // Usar nuestro proxy de Vercel
        const proxyUrl = `/api/ical-proxy?url=${encodeURIComponent(url)}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const icalData = await response.text();
        return parseICal(icalData);
    } catch (error) {
        console.error('Error fetching calendar:', error);
        return [];
    }
}

/**
 * Combina eventos de múltiples calendarios
 * @param {Array} calendars - Array de URLs de calendarios
 * @returns {Promise<Array>} Array combinado de eventos
 */
export async function fetchAllCalendarEvents(calendars) {
    const promises = calendars.map(url => fetchCalendarEvents(url));
    const results = await Promise.all(promises);

    // Combinar y eliminar duplicados por UID
    const allEvents = results.flat();
    const uniqueEvents = [];
    const seenUids = new Set();

    for (const event of allEvents) {
        if (event.uid && !seenUids.has(event.uid)) {
            seenUids.add(event.uid);
            uniqueEvents.push(event);
        }
    }

    return uniqueEvents;
}

/**
 * Verifica si una fecha está ocupada según los eventos
 * @param {Date} date - Fecha a verificar
 * @param {Array} events - Array de eventos
 * @returns {boolean} true si está ocupada
 */
export function isDateOccupied(date, events) {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    for (const event of events) {
        const start = new Date(event.start);
        const end = new Date(event.end);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (checkDate >= start && checkDate < end) {
            return true;
        }
    }

    return false;
}

/**
 * Cache de eventos de calendario
 */
const CALENDAR_CACHE_KEY = 'travelsuites_calendar_cache';
const CALENDAR_CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

/**
 * Guarda eventos en cache
 * @param {string} propertyId - ID de la propiedad
 * @param {Array} events - Eventos a cachear
 */
export function cacheCalendarEvents(propertyId, events) {
    const cache = JSON.parse(localStorage.getItem(CALENDAR_CACHE_KEY) || '{}');
    cache[propertyId] = {
        timestamp: Date.now(),
        events: events
    };
    localStorage.setItem(CALENDAR_CACHE_KEY, JSON.stringify(cache));
}

/**
 * Obtiene eventos desde cache
 * @param {string} propertyId - ID de la propiedad
 * @returns {Array|null} Eventos cacheados o null si expiró
 */
export function getCachedCalendarEvents(propertyId) {
    const cache = JSON.parse(localStorage.getItem(CALENDAR_CACHE_KEY) || '{}');
    const cached = cache[propertyId];

    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp < CALENDAR_CACHE_DURATION) {
        return cached.events;
    }

    return null;
}
