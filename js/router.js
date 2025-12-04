import { Sidebar } from '../components/Sidebar.js';
import { BottomNav } from '../components/BottomNav.js';
import { PropertiesView } from '../components/views/PropertiesView.js';
import { ProtocolsView } from '../components/views/ProtocolsView.js';
import { DirectoryView } from '../components/views/DirectoryView.js';
import { CalendarView } from '../components/views/CalendarView.js';
import { CheckoutReportView } from '../components/views/CheckoutReportView.js';
import { DatosImportantesView } from '../components/views/DatosImportantesView.js';
import { FAQView } from '../components/views/FAQView.js';

/**
 * Router
 * Maneja la navegación y renderizado de vistas
 */

/**
 * Cambia la tab activa y renderiza la nueva vista
 * @param {string} tab - ID de la tab a activar
 * @param {Object} state - Estado de la aplicación
 */
export function setActiveTab(tab, state) {
    state.activeTab = tab;
    renderNavigation(state);
    renderContent(state);
    // Scroll al top
    document.getElementById('main-container').scrollTop = 0;
}

/**
 * Renderiza la navegación (sidebar y bottom nav)
 * @param {Object} state - Estado de la aplicación
 */
export function renderNavigation(state) {
    // Renderizar Sidebar (Desktop)
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = Sidebar(state.activeTab);
    }

    // Renderizar Bottom Nav (Mobile)
    const bottomNavContainer = document.getElementById('bottom-nav-container');
    if (bottomNavContainer) {
        bottomNavContainer.innerHTML = BottomNav(state.activeTab);
    }
}

/**
 * Renderiza el contenido principal según la tab activa
 * @param {Object} state - Estado de la aplicación
 */
export function renderContent(state) {
    const container = document.getElementById('main-container');

    if (state.activeTab === 'properties') {
        container.innerHTML = PropertiesView(state);
    } else if (state.activeTab === 'protocols') {
        container.innerHTML = ProtocolsView();
    } else if (state.activeTab === 'directory') {
        container.innerHTML = DirectoryView();
    } else if (state.activeTab === 'calendar') {
        container.innerHTML = CalendarView(state);
    } else if (state.activeTab === 'checkout-report') {
        container.innerHTML = CheckoutReportView(state);
    } else if (state.activeTab === 'faq') {
        container.innerHTML = FAQView();
    } else if (state.activeTab === 'datos-importantes') {
        container.innerHTML = DatosImportantesView();
    }
}
