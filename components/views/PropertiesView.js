import { PROPERTIES_DATA } from '../../data/data.js';
import { ICONS } from '../../data/data.js';
import { PropertyCard } from '../PropertyCard.js';

/**
 * Vista de Propiedades
 * Renderiza la vista completa de propiedades con búsqueda, filtros y grid
 * @param {Object} state - Estado de la aplicación (searchTerm, filterType, isLoading, error)
 * @returns {string} HTML de la vista
 */
export function PropertiesView(state) {
    // Mostrar loading spinner
    if (state.isLoading) {
        return `
            <div class="flex flex-col h-full items-center justify-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
                <p class="mt-4 text-slate-600">Cargando propiedades desde WooCommerce...</p>
            </div>
        `;
    }

    // Mostrar error si existe
    const errorBanner = state.error ? `
        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    ${ICONS.alert}
                </div>
                <div class="ml-3">
                    <p class="text-sm text-amber-700">${state.error}</p>
                </div>
            </div>
        </div>
    ` : '';

    const buildings = ['todos', ...new Set(PROPERTIES_DATA.map(p => p.building))];

    // Lógica de filtrado
    const filtered = PROPERTIES_DATA.filter(p => {
        const searchLower = state.searchTerm.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchLower) ||
            p.building.toLowerCase().includes(searchLower) ||
            p.address.toLowerCase().includes(searchLower);
        const matchesType = state.filterType === 'todos' || p.building === state.filterType;
        return matchesSearch && matchesType;
    });

    const cardsHtml = filtered.map(prop => PropertyCard(prop)).join('');

    const filtersHtml = buildings.map(b => `
        <button onclick="window.setFilter('${b}')" class="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${state.filterType === b ? 'bg-teal-500 text-white border-teal-500 shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}">
            ${b === 'todos' ? 'Todos' : b}
        </button>
    `).join('');

    return `
        <div class="flex flex-col h-full">
            <div class="bg-slate-900 p-4 md:p-6 sticky top-0 z-10 shadow-lg md:rounded-b-2xl">
                <h1 class="text-white font-bold text-lg md:text-2xl mb-3 md:mb-4">Propiedades</h1>
                <div class="relative max-w-2xl">
                    <input type="text" placeholder="Buscar depto, edificio..." value="${state.searchTerm}" oninput="window.setSearch(this.value)" class="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm">
                    <div class="absolute left-3 top-3.5 text-slate-400">${ICONS.search}</div>
                </div>
                <div class="flex gap-2 overflow-x-auto mt-4 pb-1 hide-scrollbar md:flex-wrap">
                    ${filtersHtml}
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                ${errorBanner}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    ${cardsHtml}
                </div>
                ${filtered.length === 0 ? '<p class="text-center text-slate-400 mt-10">No se encontraron propiedades.</p>' : ''}
            </div>
        </div>
    `;
}
