import { DIRECTORY_DATA } from '../../data/data.js';
import { ICONS } from '../../data/data.js';

/**
 * Vista de Directorio
 * Renderiza la vista completa del directorio de conserjerías
 * @returns {string} HTML de la vista
 */
export function DirectoryView() {
    const contactsHtml = DIRECTORY_DATA.map(contact => `
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-teal-200 transition-colors group">
            <div class="min-w-0 pr-4">
                <h3 class="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-teal-700 transition-colors">${contact.name}</h3>
                <p class="text-xs text-slate-500 mt-1 truncate">${contact.address}</p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
                <a href="tel:${contact.phone}" class="p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors" title="Llamar">
                    ${ICONS.phone}
                </a>
                ${contact.type === 'whatsapp' ? `
                <a href="https://wa.me/${contact.phone.replace('+', '')}?text=Hola,%20soy%20de%20Travel%20Suites" target="_blank" class="p-2.5 bg-green-100 rounded-xl text-green-600 hover:bg-green-200 hover:text-green-800 transition-colors" title="WhatsApp">
                    ${ICONS.whatsapp}
                </a>
                ` : ''}
            </div>
        </div>
    `).join('');

    return `
        <div class="flex flex-col h-full">
            <div class="bg-slate-900 p-4 md:p-6 sticky top-0 z-10 shadow-lg md:rounded-b-2xl">
                <h1 class="text-white font-bold text-lg md:text-2xl">Directorio Conserjerías</h1>
                <p class="text-slate-400 text-sm">Contactos de emergencia e ingresos</p>
            </div>
            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    ${contactsHtml}
                </div>
            </div>
        </div>
    `;
}
