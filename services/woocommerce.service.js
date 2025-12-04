import { WC_CONFIG } from '../config/woocommerce.js';
import { getDepartmentInfo } from '../data/departmentInfo.js';

/**
 * Servicio de WooCommerce
 * Maneja la comunicación con la API de WooCommerce
 */

/**
 * Obtiene todos los productos (departamentos) desde WooCommerce
 * Usa la API serverless de Vercel para mantener credenciales seguras
 * @returns {Promise<Array>} Array de propiedades mapeadas
 */
export async function fetchProducts() {
    try {
        // Usar siempre la ruta relativa
        // Vercel Dev la manejará correctamente en local
        // En producción también funciona
        const apiUrl = '/api/products';

        console.log('🔄 Cargando productos desde API...');

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error HTTP ${response.status}:`, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        console.log(`✅ ${products.length} productos cargados desde WooCommerce`);

        // Mapear productos de WooCommerce a estructura de propiedades
        return products.map(product => mapProductToProperty(product));
    } catch (error) {
        console.error('Error fetching products from API:', error);
        throw error;
    }
}

/**
 * Obtiene un valor de meta_data por clave
 * @param {Array} metaData - Array de meta_data del producto
 * @param {string} key - Clave a buscar
 * @returns {any} Valor encontrado o null
 */
function getMetaValue(metaData, key) {
    const meta = metaData.find(m => m.key === key);
    return meta ? meta.value : null;
}

/**
 * Mapea un producto de WooCommerce a la estructura de propiedad
 * @param {Object} product - Producto de WooCommerce
 * @returns {Object} Propiedad mapeada con todos los campos disponibles
 */
function mapProductToProperty(product) {
    const metaData = product.meta_data || [];

    // Obtener comodidades
    const comodidades = getMetaValue(metaData, 'comodidades') || {};
    const amenities = [];

    if (comodidades.wifi === 'true') amenities.push('WiFi');
    if (comodidades.tv === 'true') amenities.push('TV');
    if (comodidades.calefaccion === 'true') amenities.push('Calefacción');
    if (comodidades.aire_acondicionado === 'true') amenities.push('Aire Acondicionado');
    if (comodidades.piscina === 'true') amenities.push('Piscina');
    if (comodidades.parking === 'true') amenities.push('Estacionamiento');
    if (comodidades.lavadora === 'true') amenities.push('Lavadora');
    if (comodidades.cocina === 'true') amenities.push('Cocina');
    if (comodidades.mascotas === 'true') amenities.push('Mascotas Permitidas');

    // Obtener sofá cama
    const sofaCama = getMetaValue(metaData, 'sofa_cama') || {};
    const tieneSofaCama = sofaCama['Sofá Cama'] === 'true';

    // Construir descripción de camas
    const numCamas = parseInt(getMetaValue(metaData, 'camas') || '0');
    const numHabitaciones = parseInt(getMetaValue(metaData, 'habitaciones') || '0');
    const numBanos = parseInt(getMetaValue(metaData, 'banos') || '0');

    let bedsDescription = `${numCamas} cama${numCamas !== 1 ? 's' : ''}`;
    if (tieneSofaCama) {
        bedsDescription += ', 1 Sofá Cama';
    }

    // Capacidad de huéspedes
    const capacidadHuespedes = parseInt(getMetaValue(metaData, 'capacidad_huespedes') || '0');
    const minPersons = parseInt(getMetaValue(metaData, '_yith_booking_min_persons') || '1');
    const maxPersons = parseInt(getMetaValue(metaData, '_yith_booking_max_persons') || capacidadHuespedes);

    // Obtener checkin/checkout
    const checkin = getMetaValue(metaData, '_yith_booking_checkin') || '15:00';
    const checkout = getMetaValue(metaData, '_yith_booking_checkout') || '12:00';

    // Precios
    const basePrice = parseFloat(product.price || '0');
    const extraPricePerPerson = parseFloat(getMetaValue(metaData, '_yith_booking_extra_price_per_person') || '0');
    const extraPriceFrom = parseInt(getMetaValue(metaData, '_yith_booking_extra_price_per_person_greater_than') || '0');

    // Descuentos
    const weeklyDiscount = parseFloat(getMetaValue(metaData, '_yith_booking_weekly_discount') || '0');
    const monthlyDiscount = parseFloat(getMetaValue(metaData, '_yith_booking_monthly_discount') || '0');
    const lastMinuteDiscount = parseFloat(getMetaValue(metaData, '_yith_booking_last_minute_discount') || '0');

    const hasDiscount = weeklyDiscount > 0 || monthlyDiscount > 0 || lastMinuteDiscount > 0 || product.on_sale;

    // Duración
    const minDuration = parseInt(getMetaValue(metaData, '_yith_booking_minimum_duration') || '1');
    const maxDuration = parseInt(getMetaValue(metaData, '_yith_booking_maximum_duration') || '0');

    // Calendarios externos
    const externalCalendars = getMetaValue(metaData, '_yith_booking_external_calendars') || {};
    const calendarUrls = {
        airbnb: externalCalendars['1']?.url || null,
        booking: externalCalendars['2']?.url || null
    };

    // Galería de imágenes
    const images = product.images && product.images.length > 0
        ? product.images.map(img => ({
            src: img.src,
            alt: img.alt || product.name,
            id: img.id
        }))
        : [];

    // Construir protocolo mejorado
    const ubicacion = getMetaValue(metaData, 'ubicacion') || '';
    let protocol = `Check-in: ${checkin} | Check-out: ${checkout}.`;

    if (minDuration > 1) {
        protocol += ` Estadía mínima: ${minDuration} ${minDuration === 1 ? 'noche' : 'noches'}.`;
    }

    if (product.short_description) {
        const cleanDesc = product.short_description.replace(/<[^>]*>/g, '').trim();
        if (cleanDesc) {
            protocol += ` ${cleanDesc}`;
        }
    }

    // Determinar edificio desde categorías o ubicación
    let building = 'Sin categoría';
    if (product.categories && product.categories.length > 0) {
        // Si la categoría es "Departamento", intentar extraer edificio de la ubicación
        if (product.categories[0].name === 'Departamento' && ubicacion) {
            // Intentar extraer nombre del edificio de la dirección
            const parts = ubicacion.split(',');
            if (parts.length > 1) {
                building = parts[parts.length - 1].trim(); // Última parte (ciudad)
            } else {
                building = product.categories[0].name;
            }
        } else {
            building = product.categories[0].name;
        }
    }

    // Generar ID único
    const id = product.sku || `wc-${product.id}`;

    // Determinar status basado en stock
    let status = 'disponible';
    if (product.stock_status === 'outofstock') {
        status = 'ocupado';
    } else if (product.stock_status === 'onbackorder') {
        status = 'mantenimiento';
    }

    // Descripción completa (HTML limpio)
    const fullDescription = product.description
        ? product.description.replace(/<[^>]*>/g, '').trim()
        : '';

    // ===== FUSIONAR CON INFORMACIÓN REAL DEL DEPARTAMENTO =====
    const deptInfo = getDepartmentInfo(product.sku, product.name, product.id);

    // WiFi: usar info real si existe, sino genérico
    const wifiInfo = deptInfo?.wifi || {
        ssid: `TravelSuites_${product.id}`,
        pass: 'travel2025'
    };

    // Camas: usar descripción real si existe, sino la generada
    const finalBedsDescription = deptInfo?.beds || bedsDescription;

    // Distribución: agregar si existe
    const distribucion = deptInfo?.distribucion || null;

    return {
        // Campos básicos
        id: id,
        name: product.name,
        building: building,
        type: 'departamento',
        address: ubicacion,

        // WiFi (ahora con datos reales)
        wifi: wifiInfo,

        // Habitaciones y capacidad
        rooms: numHabitaciones,
        beds: finalBedsDescription,
        bathrooms: numBanos,
        distribucion: distribucion, // Nuevo campo
        capacity: {
            min: minPersons,
            max: maxPersons,
            total: capacidadHuespedes
        },

        // Amenities
        amenities: amenities,

        // Protocolo y descripción
        protocol: protocol,
        description: fullDescription,
        shortDescription: product.short_description?.replace(/<[^>]*>/g, '').trim() || '',

        // Estado y disponibilidad
        status: status,

        // Precios
        price: basePrice,
        priceFormatted: `$${basePrice.toLocaleString('es-CL')}`,
        extraPricePerPerson: extraPricePerPerson,
        extraPriceFrom: extraPriceFrom,

        // Descuentos
        discounts: {
            weekly: weeklyDiscount,
            monthly: monthlyDiscount,
            lastMinute: lastMinuteDiscount,
            hasDiscount: hasDiscount,
            onSale: product.on_sale
        },

        // Duración
        duration: {
            min: minDuration,
            max: maxDuration,
            unit: 'noche' + (minDuration !== 1 ? 's' : '')
        },

        // Imágenes
        images: images,
        image: images.length > 0 ? images[0].src : null,

        // Calendarios externos
        externalCalendars: calendarUrls,

        // Check-in/out
        checkin: checkin,
        checkout: checkout,

        // Links
        permalink: product.permalink,
        slug: product.slug,

        // Metadata adicional
        productId: product.id,
        sku: product.sku
    };
}

/**
 * Cache simple en localStorage
 */
const CACHE_KEY = 'travelsuites_properties_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Guarda productos en cache
 * @param {Array} products - Productos a cachear
 */
export function cacheProducts(products) {
    const cacheData = {
        timestamp: Date.now(),
        data: products
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

/**
 * Obtiene productos desde cache si están vigentes
 * @returns {Array|null} Productos cacheados o null si expiró
 */
export function getCachedProducts() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    try {
        const { timestamp, data } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp < CACHE_DURATION) {
            return data;
        }
    } catch (error) {
        console.error('Error reading cache:', error);
    }

    return null;
}
/**
 * Crea una orden en WooCommerce
 * Usa la API serverless de Vercel para mantener credenciales seguras
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<Object>} Orden creada
 */
export async function createOrder(orderData) {
    try {
        // Llamar a la API serverless de Vercel
        const apiUrl = '/api/orders';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Error creating order via API:', error);
        throw error;
    }
}
