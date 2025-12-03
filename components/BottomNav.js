import { ICONS } from '../data/data.js';

/**
 * Componente BottomNav
 * Renderiza la barra de navegación inferior para móvil
 * @param {string} activeTab - Tab actualmente activa
 * @returns {string} HTML de la navegación móvil
 */
export function BottomNav(activeTab) {
    const tabs = [
        { id: 'properties', label: 'Propiedades', icon: ICONS.layout },
        { id: 'calendar', label: 'Calendario', icon: ICONS.calendar },
        { id: 'protocols', label: 'Protocolos', icon: ICONS.book },
        { id: 'directory', label: 'Directorio', icon: ICONS.users },
        { id: 'faq', label: 'FAQ', icon: ICONS.helpCircle },
        { id: 'datos-importantes', label: 'Datos', icon: ICONS.fileText },
    ];

    const navItems = tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return `
            <button onclick="window.setActiveTab('${tab.id}')" class="flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${isActive ? 'text-teal-600 bg-teal-50' : 'text-slate-500'}">
                <div class="w-6 h-6 ${isActive ? 'stroke-2' : ''}">${tab.icon}</div>
                <span class="text-[10px] font-medium">${tab.label}</span>
            </button>
        `;
    }).join('');

    return `
        <nav class="md:hidden flex-shrink-0 bg-white border-t border-slate-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            ${navItems}
        </nav>
    `;
}
