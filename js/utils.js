import { ICONS } from '../data/data.js';

/**
 * Copia texto al portapapeles y muestra feedback visual
 * @param {string} text - Texto a copiar
 * @param {HTMLElement} btnElement - Botón que disparó la acción
 */
export function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text);
    const originalIcon = btnElement.innerHTML;
    btnElement.innerHTML = ICONS.check;
    setTimeout(() => {
        btnElement.innerHTML = originalIcon;
    }, 2000);
}

/**
 * Obtiene un icono SVG por su nombre
 * @param {string} iconName - Nombre del icono
 * @returns {string} SVG del icono
 */
export function getIcon(iconName) {
    return ICONS[iconName] || '';
}
