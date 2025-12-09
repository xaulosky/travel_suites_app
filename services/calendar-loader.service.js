import { fetchCalendarEvents } from './calendar.service.js';

/**
 * Carga todos los eventos de calendario de todas las propiedades
 * @param {Array} properties - Array de propiedades con URLs de calendario
 * @returns {Promise<Array>} Array de eventos combinados con propertyId
 */
export async function loadAllCalendarEvents(properties) {
    console.log(`🔄 Cargando calendarios de ${properties.length} propiedades...`);

    const allEvents = [];
    let loadedCount = 0;
    let errorCount = 0;

    // Cargar calendarios en paralelo (máximo 5 a la vez para no sobrecargar)
    const batchSize = 5;
    for (let i = 0; i < properties.length; i += batchSize) {
        const batch = properties.slice(i, i + batchSize);

        const batchPromises = batch.map(async (property) => {
            // Verificar si la propiedad tiene calendarios externos
            if (!property.externalCalendars) {
                return [];
            }

            try {
                // externalCalendars es un objeto con { airbnb: url, booking: url }
                const calendarUrls = [];
                if (property.externalCalendars.airbnb) {
                    calendarUrls.push(property.externalCalendars.airbnb);
                }
                if (property.externalCalendars.booking) {
                    calendarUrls.push(property.externalCalendars.booking);
                }

                if (calendarUrls.length === 0) {
                    return [];
                }

                // Cargar eventos de todos los calendarios de esta propiedad
                const calendarPromises = calendarUrls.map(url =>
                    fetchCalendarEvents(url)
                );

                const calendarResults = await Promise.all(calendarPromises);

                // Combinar todos los eventos y agregar propertyId
                const propertyEvents = calendarResults
                    .flat()
                    .map(event => ({
                        ...event,
                        propertyId: property.id,
                        propertyName: property.name
                    }));

                if (propertyEvents.length > 0) {
                    loadedCount++;
                    console.log(`✅ ${property.name}: ${propertyEvents.length} eventos`);
                }

                return propertyEvents;
            } catch (error) {
                errorCount++;
                console.warn(`⚠️ Error cargando calendario de ${property.name}:`, error.message);
                return [];
            }
        });

        const batchResults = await Promise.all(batchPromises);
        allEvents.push(...batchResults.flat());
    }

    console.log(`✅ Calendarios cargados: ${loadedCount}/${properties.length} propiedades`);
    if (errorCount > 0) {
        console.warn(`⚠️ ${errorCount} propiedades con errores`);
    }
    console.log(`📊 Total de eventos: ${allEvents.length}`);

    return allEvents;
}
