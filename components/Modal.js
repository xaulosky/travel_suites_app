import { PROPERTIES_DATA } from '../data/data.js';
import { ICONS } from '../data/data.js';

/**
 * Componente Modal Mejorado
 * Maneja la apertura, cierre y renderizado del modal de detalles de propiedad
 * Incluye galería de imágenes, información completa, precios, descuentos
 */

/**
 * Abre el modal con los detalles completos de una propiedad
 * @param {string} propId - ID de la propiedad
 */
export function openModal(propId) {
    const prop = PROPERTIES_DATA.find(p => p.id === propId);
    if (!prop) return;

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    // Generar galería de imágenes
    const imageGallery = prop.images && prop.images.length > 1 ? `
        <div class="relative bg-slate-900">
            <div id="image-gallery" class="overflow-x-auto hide-scrollbar flex snap-x snap-mandatory">
                ${prop.images.map((img, idx) => `
                    <img src="${img.src}" alt="${img.alt}" class="w-full flex-shrink-0 snap-center object-cover h-64 md:h-80" />
                `).join('')}
            </div>
            ${prop.images.length > 1 ? `
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    ${prop.images.map((_, idx) => `
                        <div class="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 cursor-pointer" onclick="scrollToImage(${idx})"></div>
                    `).join('')}
                </div>
                <div class="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    ${prop.images.length} fotos
                </div>
            ` : ''}
        </div>
    ` : (prop.image ? `
        <div class="relative bg-slate-900">
            <img src="${prop.image}" alt="${prop.name}" class="w-full object-cover h-64 md:h-80" />
        </div>
    ` : '');

    // Badges de descuentos
    const discountBadges = [];
    if (prop.discounts?.weekly > 0) discountBadges.push(`<span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">-${prop.discounts.weekly}% semanal</span>`);
    if (prop.discounts?.monthly > 0) discountBadges.push(`<span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">-${prop.discounts.monthly}% mensual</span>`);
    if (prop.discounts?.lastMinute > 0) discountBadges.push(`<span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">-${prop.discounts.lastMinute}% last minute</span>`);

    const discountsSection = discountBadges.length > 0 ? `
        <div class="flex flex-wrap gap-2 mb-4">
            ${discountBadges.join('')}
        </div>
    ` : '';

    // Generar contenido del modal
    modalContent.innerHTML = `
        <!-- Header -->
        <div class="p-4 md:p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
            <div class="flex-1 pr-4">
                <h2 class="font-bold text-lg md:text-xl">${prop.name}</h2>
                <p class="text-xs text-slate-400 md:text-sm">${prop.building}</p>
            </div>
            <button onclick="window.closeModal()" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex-shrink-0">
                ${ICONS.close}
            </button>
        </div>
        
        <!-- Galería de Imágenes -->
        ${imageGallery}
        
        <!-- Body -->
        <div class="p-5 md:p-8 overflow-y-auto space-y-6 pb-20 md:pb-8 flex-1">
            ${discountsSection}
            
            <!-- Precio Principal -->
            <div class="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-5 shadow-sm">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-teal-800 font-bold text-lg mb-1">Precio por noche</h3>
                        <p class="text-3xl font-bold text-teal-700">${prop.priceFormatted || '$' + prop.price}</p>
                        ${prop.extraPricePerPerson > 0 ? `
                            <p class="text-xs text-teal-600 mt-1">+$${prop.extraPricePerPerson.toLocaleString('es-CL')} por persona adicional (desde ${prop.extraPriceFrom + 1} personas)</p>
                        ` : ''}
                    </div>
                    ${prop.capacity?.max ? `
                        <div class="text-center bg-white rounded-lg p-3 shadow-sm">
                            <div class="text-blue-600 mb-1">${ICONS.users.replace('w-6 h-6', 'w-8 h-8')}</div>
                            <div class="text-xs text-slate-600">Hasta</div>
                            <div class="text-xl font-bold text-blue-700">${prop.capacity.max}</div>
                            <div class="text-xs text-slate-600">personas</div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Columna Izq -->
                <div class="space-y-6">
                    <!-- WIFI -->
                    <div class="bg-teal-50 border border-teal-100 rounded-xl p-5 shadow-sm">
                        <h3 class="text-teal-800 font-bold text-sm flex items-center mb-4">
                            <div class="mr-2">${ICONS.wifi}</div> Datos WiFi
                        </h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center text-sm border-b border-teal-100 pb-2">
                                <span class="text-teal-700 font-medium">Red:</span>
                                <span class="font-mono font-bold text-slate-800">${prop.wifi.ssid}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm pt-1">
                                <span class="text-teal-700 font-medium">Contraseña:</span>
                                <div class="flex items-center gap-2">
                                    <span class="font-mono font-bold bg-white px-3 py-1 rounded border border-teal-200 text-slate-800 shadow-sm">${prop.wifi.pass}</span>
                                    <button onclick="window.copyToClipboard('${prop.wifi.pass}', this)" class="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600">
                                        ${ICONS.copy}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- INFO BÁSICA -->
                    <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div class="flex items-center gap-3 text-sm text-slate-700">
                            <div class="text-slate-400">${ICONS.mapPin}</div> ${prop.address}
                        </div>
                        <div class="flex items-center gap-3 text-sm text-slate-700">
                            <div class="text-slate-400">${ICONS.bed}</div> ${prop.beds}
                        </div>
                        ${prop.bathrooms ? `
                            <div class="flex items-center gap-3 text-sm text-slate-700">
                                <div class="text-slate-400">🚿</div> ${prop.bathrooms} baño${prop.bathrooms !== 1 ? 's' : ''}
                            </div>
                        ` : ''}
                        ${prop.duration?.min > 1 ? `
                            <div class="flex items-center gap-3 text-sm text-slate-700">
                                <div class="text-slate-400">📅</div> Estadía mínima: ${prop.duration.min} ${prop.duration.unit}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Columna Der -->
                <div class="space-y-6">
                    <!-- PROTOCOLO -->
                    <div class="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl text-sm text-amber-900 shadow-sm">
                        <h3 class="font-bold mb-2 flex items-center gap-2 text-amber-700">
                            ${ICONS.alert} Notas Importantes
                        </h3>
                        <p class="leading-relaxed">${prop.protocol}</p>
                    </div>
                    
                    <!-- AMENITIES -->
                    <div>
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Equipamiento</h4>
                        <div class="flex flex-wrap gap-2">
                            ${prop.amenities.map(a => `<span class="text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-200">${a}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Descripción Completa -->
            ${prop.description ? `
                <div class="bg-white border border-slate-200 rounded-xl p-5">
                    <h4 class="text-sm font-bold text-slate-700 mb-3">Descripción</h4>
                    <p class="text-sm text-slate-600 leading-relaxed">${prop.description}</p>
                </div>
            ` : ''}
            
            <!-- Link al producto -->
            <div class="flex gap-3">
                <button onclick="window.viewPropertyCalendar('${prop.id}')" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl font-medium text-sm text-center transition-colors flex items-center justify-center gap-2">
                    ${ICONS.calendar}
                    Ver Calendario
                </button>
                <a href="${prop.permalink}" target="_blank" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium text-sm text-center transition-colors">
                    Ver en WooCommerce →
                </a>
            </div>
        </div>

        <!-- Footer Movil -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 md:hidden">
            <div class="flex gap-2">
                <button onclick="window.viewPropertyCalendar('${prop.id}')" class="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                    ${ICONS.calendar}
                    Calendario
                </button>
                <button onclick="window.closeModal()" class="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg">Cerrar</button>
            </div>
        </div>
    `;

    modalOverlay.classList.remove('hidden');
}

/**
 * Cierra el modal
 */
export function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

/**
 * Scroll a una imagen específica en la galería
 * @param {number} index - Índice de la imagen
 */
window.scrollToImage = function (index) {
    const gallery = document.getElementById('image-gallery');
    if (gallery) {
        const imageWidth = gallery.children[0]?.offsetWidth || 0;
        gallery.scrollTo({
            left: imageWidth * index,
            behavior: 'smooth'
        });
    }
};
