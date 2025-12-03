import { ICONS } from '../data/data.js';

/**
 * Componente PropertyCard
 * Renderiza una tarjeta individual de propiedad
 * @param {Object} prop - Datos de la propiedad
 * @returns {string} HTML de la tarjeta
 */
export function PropertyCard(prop) {
    // Badge de descuento
    const discountBadge = prop.discounts?.hasDiscount ? `
        <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            OFERTA
        </div>
    ` : '';

    return `
        <div onclick="window.openModal('${prop.id}')" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group flex flex-col justify-between h-full relative">
            ${discountBadge}
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors line-clamp-1 pr-2">${prop.name}</span>
                    <div class="w-2.5 h-2.5 flex-shrink-0 rounded-full ${prop.status === 'disponible' ? 'bg-green-500' : 'bg-red-500'}" title="${prop.status}"></div>
                </div>
                <p class="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                    ${ICONS.layout} ${prop.building}
                </p>
                <div class="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-3">
                    <div class="flex-shrink-0 text-slate-400">${ICONS.mapPin}</div>
                    <span class="line-clamp-1">${prop.address}</span>
                </div>
                
                <!-- Precio y Capacidad -->
                <div class="flex gap-2 mb-3">
                    <div class="flex-1 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100">
                        <div class="text-xs text-teal-600 font-medium">Precio/noche</div>
                        <div class="text-sm font-bold text-teal-700">${prop.priceFormatted || '$' + prop.price}</div>
                    </div>
                    ${prop.capacity?.max ? `
                    <div class="flex-1 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        <div class="text-xs text-blue-600 font-medium">Capacidad</div>
                        <div class="text-sm font-bold text-blue-700">${ICONS.users.replace('w-6 h-6', 'w-4 h-4 inline')} ${prop.capacity.max} personas</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="flex gap-2 mt-auto">
                <div class="bg-slate-100 px-3 py-1.5 rounded-lg text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    ${ICONS.bed} ${prop.rooms} hab
                </div>
                <div class="bg-teal-50 px-3 py-1.5 rounded-lg text-xs text-teal-700 font-mono flex items-center gap-1.5 border border-teal-100 flex-1 justify-center">
                    ${ICONS.wifi} <span class="truncate">${prop.wifi.pass}</span>
                </div>
            </div>
        </div>
    `;
}
