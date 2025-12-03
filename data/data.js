// --- DATOS REALES ---
// PROPERTIES_DATA ahora se carga dinámicamente desde WooCommerce API
// Ver services/woocommerce.service.js para el mapeo de productos
export let PROPERTIES_DATA = [];

// Datos estáticos de respaldo (fallback) en caso de que falle la API
export const PROPERTIES_DATA_FALLBACK = [
    { id: 'sao-205', name: "Depto 205 Olivo", building: "Santa Ana Oriente", type: "departamento", address: "Av. Costanera Quilque Norte 820", wifi: { ssid: "SantaAna_205", pass: "travel2025" }, rooms: 2, beds: "1 Matrimonial, 1 Single", amenities: ["Estacionamiento", "Quincho", "Piscina"], protocol: "Conserjería +569 23768177. Recordar avisar ingreso al grupo de WhatsApp del edificio.", status: "disponible" },
    { id: 'sao-504', name: "Depto 504 Boldo", building: "Santa Ana Oriente", type: "departamento", address: "Av. Costanera Quilque Norte 820", wifi: { ssid: "SantaAna_504", pass: "visitas_504" }, rooms: 3, beds: "1 King, 2 Singles", amenities: ["Terraza", "Lavadora"], protocol: "Llave de paso de gas en logia. Conserjería estricta con ruidos molestos.", status: "ocupado" },
    { id: 'lum-401', name: "Depto 401 A", building: "Luminity", type: "departamento", address: "Laguna Verde 2365", wifi: { ssid: "Luminity_401A", pass: "laguna2365" }, rooms: 2, beds: "1 Matrimonial, 1 Camarote", amenities: ["Gimnasio", "Sala Gourmet", "Lavandería"], protocol: "Conserjería +569 58041210. Ingreso con código QR o huella (gestionar antes).", status: "disponible" },
    { id: 'fre-709', name: "Studio 709", building: "Espacio Freire", type: "departamento", address: "Freire 360", wifi: { ssid: "Freire_709_F", pass: "centro360" }, rooms: 1, beds: "1 Matrimonial", amenities: ["Céntrico", "Cowork"], protocol: "Conserjería +562 32824044 (Solo llamadas). Dejar llaves en buzón al salir.", status: "mantenimiento" },
    { id: 'enc-pocuro', name: "Casa Pocuro", building: "Hacienda Los Encinos", type: "casa", address: "Totoral Norte 480", wifi: { ssid: "Casa_Pocuro", pass: "encinos2024" }, rooms: 4, beds: "2 Matrimoniales, 3 Singles", amenities: ["Patio Grande", "Parrilla"], protocol: "No aplica conserjería. Coordinar entrega de llaves presencial o caja fuerte.", status: "disponible" },
    { id: 'puc-304', name: "Depto 304 Pucón", building: "Parque Pucón", type: "departamento", address: "Variante camino internacional 1895", wifi: { ssid: "Pucon_304", pass: "volcan_villarrica" }, rooms: 2, beds: "1 Queen, 1 Litera", amenities: ["Piscina", "Vista Volcán"], protocol: "Conserjería +569 26161887. En invierno dejar calefacción en 18°C.", status: "disponible" },
    { id: 'chi-502', name: "Depto 502 Nuevo 18", building: "Edificio Nuevo 18", type: "departamento", address: "18 de Septiembre 140, Chillán", wifi: { ssid: "Chillan_502", pass: "longaniza" }, rooms: 1, beds: "1 Matrimonial", amenities: ["Céntrico"], protocol: "Conserjería +569 41395203. Estacionamiento estrecho, avisar a huéspedes con camionetas.", status: "disponible" }
];

export const DIRECTORY_DATA = [
    { name: "Santa Ana Oriente", phone: "+56923768177", type: "whatsapp", address: "Av. Costanera Quilque Norte 820" },
    { name: "Luminity", phone: "+56958041210", type: "whatsapp", address: "Laguna Verde 2365" },
    { name: "Espacio Freire", phone: "+56232824044", type: "call", address: "Freire 360" },
    { name: "Laguna Esmeralda", phone: "+56940601310", type: "whatsapp", address: "Prat 450" },
    { name: "Parque Laguna II", phone: "+56942387185", type: "whatsapp", address: "Dr Manuel Rioseco 900" },
    { name: "Edificio Civilla", phone: "+56234169073", type: "call", address: "Maipú 1644, Concepción" },
    { name: "Edificio Smart", phone: "+56940792918", type: "call", address: "Tucapel 644, Concepción" },
    { name: "Parque Pucón", phone: "+56926161887", type: "call", address: "Var. Camino Internacional 1895" },
];

export const PROTOCOLS_DATA = [
    { title: "Rutina Diaria (AM)", iconColor: "text-blue-500", steps: ["Reunión Diaria: Verificar todas las reservas del día en planilla.", "Identificar huéspedes contactados vs pendientes de abono.", "Entregar info de pendientes de pago del día anterior.", "Aseos: Revisar, registrar y remitir por grupo asignado.", "Después de reunión: Contactar a los que salen (Check-out) y enviar mensaje de despedida.", "Contactar confirmaciones pendientes de Booking y pedir abono."] },
    { title: "Rutina Tarde (PM)", iconColor: "text-orange-500", steps: ["Actualizar planilla con abonos del día.", "Verificar que se hizo Check-in de todos los del día.", "Contactar a los huéspedes que ingresan MAÑANA.", "Avisar ingresos a las conserjerías respectivas.", "Verificar que huéspedes con salida hayan pagado el 50% restante."] },
    { title: "Cancelar Reserva Booking", iconColor: "text-red-500", steps: ["Llamar a Booking (+562 23937374).", "Elegir opción 1.", "Decir razón: 'No se ha realizado el abono. Política de pago anticipado 24hrs'.", "Tu cargo: 'Administradora de Reservas'.", "Tener a mano: N° Reserva, Nombre Propiedad, Nombre Huésped.", "Esperar llamada de vuelta para verificación (OJO: Llaman de otro número)."] },
    { title: "Nueva Reserva Airbnb", iconColor: "text-rose-500", steps: ["Bloquear INMEDIATAMENTE calendario en Booking para esa fecha.", "Avisar a Adm. Travel Suites por WhatsApp.", "En Airbnb: Enviar mensaje automático con indicaciones.", "Guardar contacto en celular: Nombre - Depto - Fecha.", "Pedir por WhatsApp: Rut y Patente (si aplica).", "Registrar en planilla y actualizar pagos."] }
];

// --- ICONOS SVG (Para no depender de librerías externas complejas) ---
export const ICONS = {
    search: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`,
    wifi: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>`,
    bed: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 7a2 2 0 00-2-2H5a2 2 0 00-2 2v10h2V9h14v8h2V7zM7 13h10a2 2 0 002-2V9H5v2a2 2 0 002 2z"></path></svg>`,
    mapPin: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
    copy: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>`,
    check: `<svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
    close: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
    layout: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>`,
    book: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`,
    users: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
    phone: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`,
    whatsapp: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>`,
    alert: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
    clock: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    calendar: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
};

