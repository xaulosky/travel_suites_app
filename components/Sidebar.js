import { ICONS } from '../data/data.js';

/**
 * Componente Sidebar
 * Renderiza la barra lateral de navegación para desktop
 * @param {string} activeTab - Tab actualmente activa
 * @returns {string} HTML del sidebar
 */
export function Sidebar(activeTab) {
    const tabs = [
        { id: 'properties', label: 'Propiedades', icon: ICONS.layout },
        { id: 'calendar', label: 'Calendario', icon: ICONS.calendar },
        { id: 'checkout-report', label: 'Reporte Check-outs', icon: ICONS.calendar },
        { id: 'protocols', label: 'Protocolos', icon: ICONS.book },
        { id: 'directory', label: 'Directorio', icon: ICONS.users },
        { id: 'faq', label: 'Preguntas Frecuentes', icon: ICONS.helpCircle },
        { id: 'datos-importantes', label: 'Datos Importantes', icon: ICONS.fileText },
    ];

    const navItems = tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return `
            <button onclick="window.setActiveTab('${tab.id}')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}">
                <div class="${isActive ? 'stroke-2' : ''}">${tab.icon}</div>
                ${tab.label}
            </button>
        `;
    }).join('');

    return `
        <aside class="hidden md:flex flex-col w-64 bg-slate-900 h-screen sticky top-0 border-r border-slate-800 flex-shrink-0">
            <div class="p-6 border-b border-slate-800">
                <div class="flex items-center gap-3 text-white mb-1">
                    <div class="p-2 bg-teal-600 rounded-lg">
                        <!-- Icon Building -->
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                            </path>
                        </svg>
                    </div>
                    <span class="font-bold text-lg tracking-tight">TravelSuites</span>
                </div>
                <p class="text-xs text-slate-400 pl-1">Portal de Operaciones</p>
            </div>

            <nav class="p-4 space-y-2 flex-1">
                ${navItems}
            </nav>

            <div class="p-6 border-t border-slate-800">
                <div class="bg-slate-800/50 rounded-xl p-4">
                    <p class="text-xs text-slate-400 text-center font-medium">Versión HTML 1.0 <br /> Responsivo Total</p>
                </div>
            </div>
        </aside>
    `;
}
