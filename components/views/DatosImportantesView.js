import { ICONS } from '../../data/data.js';

/**
 * Vista de Datos Importantes
 * Muestra información bancaria, SII, GETNET y credenciales
 * @returns {string} HTML de la vista
 */
export function DatosImportantesView() {
    return `
        <div class="flex flex-col h-full">
            <div class="bg-slate-900 p-4 md:p-6 sticky top-0 z-10 shadow-lg md:rounded-b-2xl">
                <h1 class="text-white font-bold text-lg md:text-2xl">📋 Datos Importantes</h1>
                <p class="text-slate-400 text-sm">Información bancaria, certificados y credenciales</p>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                <div class="max-w-6xl mx-auto space-y-6">
                    
                    <!-- Sección Banco -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div class="bg-slate-50 p-4 border-b border-slate-200">
                            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
                                🏦 Información Bancaria
                            </h2>
                        </div>
                        <div class="p-5 space-y-4">
                            <!-- Banco RUT -->
                            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Banco</div>
                                        <div class="text-sm font-bold text-slate-800">RUT</div>
                                    </div>
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Cuenta</div>
                                        <div class="text-sm font-bold text-slate-800">16.756.974-9 <span class="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">GESTIÓN</span></div>
                                    </div>
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">IVA</div>
                                        <div class="text-sm font-bold text-slate-800">EXENTA</div>
                                    </div>
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Sitio Web</div>
                                        <a href="https://officebanking.cl" target="_blank" class="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline">officebanking</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Banco CLAVE -->
                            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Banco</div>
                                        <div class="text-sm font-bold text-slate-800">CLAVE</div>
                                    </div>
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Cuenta</div>
                                        <div class="text-sm font-bold text-slate-800">Nat.87 <span class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">RED</span></div>
                                    </div>
                                    <div>
                                        <div class="text-xs font-semibold text-slate-500 uppercase mb-1">IVA</div>
                                        <div class="text-sm font-bold text-slate-800">AFECTA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección SII -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div class="bg-slate-50 p-4 border-b border-slate-200">
                            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
                                📄 Certificado Digital SII
                            </h2>
                        </div>
                        <div class="p-5">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div class="text-xs font-semibold text-slate-500 uppercase mb-1">RUT</div>
                                    <div class="text-sm font-bold text-slate-800">-</div>
                                </div>
                                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Clave</div>
                                    <div class="text-sm font-bold text-slate-800">Nata 3523</div>
                                </div>
                                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div class="text-xs font-semibold text-slate-500 uppercase mb-1">Código</div>
                                    <div class="text-sm font-bold text-slate-800">1675</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección GETNET -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div class="bg-slate-50 p-4 border-b border-slate-200">
                            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
                                💳 GETNET - Plataforma de Pagos
                            </h2>
                        </div>
                        <div class="p-5">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead>
                                        <tr class="border-b border-slate-200">
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">Tipo</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">Link/Usuario</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">IVA/Estado</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">Sitio Web/Notas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">RED</td>
                                            <td class="py-3 px-4 text-slate-600">Travel_Suites</td>
                                            <td class="py-3 px-4 text-slate-600">afecto</td>
                                            <td class="py-3 px-4">
                                                <a href="https://micrositios.getnet.cl" target="_blank" class="text-teal-600 hover:text-teal-700 hover:underline font-medium">micrositios getnet</a>
                                            </td>
                                        </tr>
                                        <tr class="hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">GESTIÓN</td>
                                            <td class="py-3 px-4 text-slate-600">Travelsuites</td>
                                            <td class="py-3 px-4 text-slate-600">exento</td>
                                            <td class="py-3 px-4 text-slate-400">-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Sección Contactos y Plataformas -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div class="bg-slate-50 p-4 border-b border-slate-200">
                            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
                                📧 Contactos y Plataformas
                            </h2>
                        </div>
                        <div class="p-5">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead>
                                        <tr class="border-b border-slate-200">
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">Plataforma</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">Correo/Usuario</th>
                                            <th class="text-left py-3 px-4 font-semibold text-slate-700 bg-slate-50">Clave/Notas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">SITIO</td>
                                            <td class="py-3 px-4 text-slate-600">CORREO</td>
                                            <td class="py-3 px-4">
                                                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">CLAVE</span>
                                            </td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">correo</td>
                                            <td class="py-3 px-4">
                                                <a href="mailto:contacto@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">contacto@travelsuites.cl</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">TSuites#2025</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">airbnb</td>
                                            <td class="py-3 px-4">
                                                <a href="mailto:contacto@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">contacto@travelsuites.cl</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Red.2024*</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">booking</td>
                                            <td class="py-3 px-4">
                                                <a href="mailto:natachapenalillo@gmail.com" class="text-teal-600 hover:text-teal-700 hover:underline">natachapenalillo@gmail.com</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Travel2024</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">travel.cl</td>
                                            <td class="py-3 px-4">
                                                <a href="mailto:contacto@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">contacto@travelsuites.cl</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">TSuites#2024</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">Quincho PL</td>
                                            <td class="py-3 px-4">
                                                <a href="mailto:contacto@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">contacto@travelsuites.cl</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Travel2024</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">micrositios</td>
                                            <td class="py-3 px-4 text-slate-600">getnet_napenalillo</td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Travel202424</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">Getnet.cl/comercio</td>
                                            <td class="py-3 px-4">
                                                <a href="mailto:ngarcia@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">ngarcia@travelsuites.cl</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Red 2025</td>
                                        </tr>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">pagina waty</td>
                                            <td class="py-3 px-4 text-slate-600">
                                                correo: <a href="mailto:contacto@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">contacto@travelsuites.cl</a> / ID: 457313
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Travel2025@</td>
                                        </tr>
                                        <tr class="hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-4 font-bold text-slate-800">Portal comercios</td>
                                            <td class="py-3 px-4 text-slate-600">
                                                Usuario: <a href="mailto:ngarcia@travelsuites.cl" class="text-teal-600 hover:text-teal-700 hover:underline">ngarcia@travelsuites.cl</a>
                                            </td>
                                            <td class="py-3 px-4 text-slate-600 font-mono">Red 2025</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}
