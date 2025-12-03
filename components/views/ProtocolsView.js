import { PROTOCOLS_DATA } from '../../data/data.js';
import { ICONS } from '../../data/data.js';

/**
 * Vista de Protocolos
 * Renderiza la vista completa de protocolos operativos
 * @returns {string} HTML de la vista
 */
export function ProtocolsView() {
    const protocolsHtml = PROTOCOLS_DATA.map((proto, idx) => `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            <div class="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
                <div class="p-2 bg-white rounded-lg shadow-sm border border-slate-100 ${proto.iconColor}">
                    ${ICONS.clock} 
                </div>
                <h3 class="font-bold text-slate-800 text-lg">${proto.title}</h3>
            </div>
            <ul class="p-6 space-y-4 flex-1">
                ${proto.steps.map((step, sIdx) => `
                    <li class="text-sm text-slate-600 flex gap-4 leading-relaxed items-start">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mt-0.5 border border-slate-200">
                            ${sIdx + 1}
                        </span>
                        <span>${step}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    return `
        <div class="flex flex-col h-full">
            <div class="bg-slate-900 p-4 md:p-6 sticky top-0 z-10 shadow-lg md:rounded-b-2xl">
                <h1 class="text-white font-bold text-lg md:text-2xl">Protocolos Operativos</h1>
                <p class="text-slate-400 text-sm">Guía rápida para anfitrionas</p>
            </div>
            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    ${protocolsHtml}
                </div>
            </div>
        </div>
    `;
}
