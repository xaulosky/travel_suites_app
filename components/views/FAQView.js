import { ICONS } from '../../data/data.js';

/**
 * Vista de Preguntas Frecuentes
 * Muestra guías de solución de problemas y políticas de cancelación
 * @returns {string} HTML de la vista
 */
export function FAQView() {
    const faqs = [
        {
            question: "¿No funciona el calefón?",
            answer: `
                <ol class="space-y-2 text-sm text-slate-600">
                    <li>1. Solicitar foto y/o video para ver si está encendido</li>
                    <li>2. Verificar que esté encendido, automáticos de la luz arriba, paso de agua y gas dado</li>
                    <li>3. En invierno la perilla del gas debe estar más cerca del máximo y el nivel de agua medio</li>
                    <li>4. Si lo anterior no funciona, informar a la administración para corroborar el pago de parte del propietario (si es un depto a porcentaje)</li>
                </ol>
            `,
            icon: "🔥",
            color: "orange"
        },
        {
            question: "¿Cancelaron la reservación el mismo día?",
            answer: `
                <p class="text-sm text-slate-600">Aplicar la política de la reservación correspondiente (ver sección de Políticas de Cancelación más abajo).</p>
            `,
            icon: "❌",
            color: "red"
        },
        {
            question: "Distancias: ¿A cuánto queda de XX lugar?",
            answer: `
                <div class="space-y-3 text-sm text-slate-600">
                    <p><strong>Opción 1:</strong> Enviar la dirección exacta de la propiedad</p>
                    <p class="italic bg-slate-50 p-3 rounded-lg border-l-4 border-teal-500">
                        "El departamento está ubicado en [dirección], puede revisar la distancia exacta en maps o waze 🙂"
                    </p>
                    
                    <p><strong>Opción 2:</strong> A criterio de la anfitriona, buscar la distancia en maps y enviar la captura</p>
                    <p class="italic bg-slate-50 p-3 rounded-lg border-l-4 border-teal-500">
                        "Según maps me indica que está a [xxx] distancia de ese sector."
                    </p>
                    
                    <p><strong>Opción 3:</strong> Indicar la zona o punto de referencia</p>
                    <ul class="list-disc list-inside ml-4 space-y-1">
                        <li>Condominio Santa Ana, Luminity, Parque Laguna y casas: sector norte de la ciudad</li>
                        <li>Freire: a dos cuadras del hospital</li>
                        <li>1912: dos cuadras del mall del centro</li>
                        <li>203: a dos cuadras de UDD</li>
                        <li>502: a tres cuadras de la plaza de Chillán</li>
                    </ul>
                </div>
            `,
            icon: "📍",
            color: "blue"
        },
        {
            question: "¿La TV no está conectada a internet?",
            answer: `
                <ol class="space-y-2 text-sm text-slate-600">
                    <li>1. Consultar si revisó las redes disponibles, solicitar fotos</li>
                    <li>2. Corroborar que esté bien escrita la clave del wifi</li>
                    <li>3. Si no funciona, reiniciar el router</li>
                    <li>4. Si la persona insiste, buscar un video de YouTube de cómo conectar el wifi y enviarlo</li>
                    <li>5. Si no funciona lo anterior, dejar registrado en planilla para que lo revise personal de limpieza</li>
                </ol>
            `,
            icon: "📺",
            color: "purple"
        },
        {
            question: "¿No funciona la encimera eléctrica?",
            answer: `
                <ol class="space-y-2 text-sm text-slate-600">
                    <li>1. Solicitar foto, si está correcta la imagen indicar cómo subir la temperatura</li>
                    <li>2. Si sigue sin funcionar, solicitar reiniciar el panel eléctrico:
                        <ul class="list-disc list-inside ml-6 mt-1">
                            <li>Bajar el automático</li>
                            <li>Esperar mínimo 40 segundos</li>
                            <li>Volver a subir (los paneles siempre indican cuál automático es de la encimera)</li>
                        </ul>
                    </li>
                    <li>3. Si no funcionó a pesar de reiniciar varias veces:
                        <ul class="list-disc list-inside ml-6 mt-1">
                            <li>Pedir disculpas al huésped</li>
                            <li>Indicar que se solicitará la revisión a post venta</li>
                            <li>Registrar en planilla para revisión de personal de limpieza</li>
                            <li>Posteriormente solicitar a post venta la revisión</li>
                        </ul>
                    </li>
                </ol>
            `,
            icon: "🔌",
            color: "yellow"
        },
        {
            question: "¿No hay internet?",
            answer: `
                <ol class="space-y-2 text-sm text-slate-600">
                    <li>1. Solicitar la mayor información posible, confirmando que tenga más de un dispositivo con la misma dificultad</li>
                    <li>2. Confirmar y verificar que están conectando a la señal correcta del departamento y el ingreso correcto de la clave (solicitar fotos o videos)</li>
                    <li>3. Solicitar el reinicio del router</li>
                    <li>4. Confirmar que todos los interruptores eléctricos del departamento estén operativos (arriba)</li>
                    <li>5. Facilitar la señal del departamento más cercano (en caso que aplique)</li>
                    <li>6. Verificar la responsabilidad del pago del servicio (de Travel Suites o del propietario)</li>
                    <li>7. En caso que sea responsabilidad del propietario:
                        <ul class="list-disc list-inside ml-6 mt-1">
                            <li>Consultar nombre de la compañía de servicio</li>
                            <li>Revisar con los RUT de los datos de propietarios (planilla de excel compartida) si existe deuda e informar</li>
                        </ul>
                    </li>
                    <li>8. Si aún no hay conexión pese a la correcta ejecución de los pasos anteriores o existe deuda del propietario, dar aviso a las coordinadoras de anfitrionas</li>
                </ol>
            `,
            icon: "📶",
            color: "teal"
        }
    ];

    const policies = [
        {
            title: "Política de Cancelación - Departamentos TravelSuites",
            icon: "🏢",
            rules: [
                { condition: "Hasta 24 horas antes (1 día antes)", result: "Devolución íntegra del 100% de lo pagado", color: "green" },
                { condition: "Después de 24 horas antes y hasta las 12:00 del día del ingreso", result: "Devolución del 50% de lo transferido", color: "yellow" },
                { condition: "Después de las 12:00 hrs del mismo día del ingreso", result: "No se hace devolución del dinero", color: "red" },
                { condition: "Clientes frecuentes (mismo día antes de las 16:00 hrs)", result: "Reembolso del 50%", color: "blue" }
            ]
        },
        {
            title: "Política de Cancelación - Roqueríos Lodge",
            icon: "🏔️",
            rules: [
                { condition: "Hasta 3 días antes del ingreso", result: "Devolución del 100% del abono realizado", color: "green" },
                { condition: "Hasta 1 día antes del ingreso a las 18:00 hrs", result: "Devolución del 50%", color: "yellow" },
                { condition: "Después de las 18:00 hrs del día anterior o el mismo día del ingreso", result: "No hay devolución", color: "red" }
            ]
        }
    ];

    const faqsHtml = faqs.map((faq, idx) => `
        <div id="faq-item-${idx}" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <button onclick="toggleFAQ(${idx})" class="w-full p-5 flex items-start gap-4 text-left hover:bg-slate-50 transition-colors">
                <div class="text-2xl flex-shrink-0">${faq.icon}</div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-slate-800 text-base md:text-lg pr-8">${faq.question}</h3>
                </div>
                <div class="flex-shrink-0">
                    <svg id="faq-icon-${idx}" class="w-5 h-5 text-slate-400 transition-transform" style="transform: rotate(180deg)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            <div id="faq-answer-${idx}" class="px-5 pb-5 pl-16 border-t border-slate-100">
                <div class="pt-4">
                    ${faq.answer}
                </div>
            </div>
        </div>
    `).join('');

    const policiesHtml = policies.map(policy => `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="bg-slate-50 p-4 border-b border-slate-200">
                <h3 class="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <span class="text-2xl">${policy.icon}</span>
                    ${policy.title}
                </h3>
            </div>
            <div class="p-5">
                <div class="space-y-3">
                    ${policy.rules.map(rule => {
        const colorClasses = {
            green: 'bg-green-50 border-green-200 text-green-800',
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            red: 'bg-red-50 border-red-200 text-red-800',
            blue: 'bg-blue-50 border-blue-200 text-blue-800'
        };
        return `
                            <div class="p-4 rounded-xl border-2 ${colorClasses[rule.color]}">
                                <div class="font-semibold text-sm mb-1">${rule.condition}</div>
                                <div class="text-sm font-bold">→ ${rule.result}</div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="flex flex-col h-full">
            <div class="bg-slate-900 p-4 md:p-6 sticky top-0 z-10 shadow-lg md:rounded-b-2xl">
                <h1 class="text-white font-bold text-lg md:text-2xl">❓ Preguntas Frecuentes</h1>
                <p class="text-slate-400 text-sm mb-4">Guías de solución de problemas y políticas</p>
                
                <!-- Buscador -->
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="faq-search"
                        placeholder="Buscar preguntas..." 
                        class="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        oninput="window.filterFAQs(this.value)"
                    />
                    <button 
                        id="clear-search"
                        onclick="window.clearFAQSearch()"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors hidden"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                <div class="max-w-4xl mx-auto space-y-8">
                    
                    <!-- Mensaje de sin resultados -->
                    <div id="no-results" class="hidden text-center py-12">
                        <div class="text-6xl mb-4">🔍</div>
                        <h3 class="text-xl font-bold text-slate-700 mb-2">No se encontraron resultados</h3>
                        <p class="text-slate-500">Intenta con otros términos de búsqueda</p>
                    </div>
                    
                    <!-- Sección de FAQs -->
                    <div id="faqs-section">
                        <h2 class="text-xl font-bold text-slate-800 mb-4">Solución de Problemas</h2>
                        <div class="space-y-3" id="faqs-container">
                            ${faqsHtml}
                        </div>
                    </div>

                    <!-- Sección de Políticas -->
                    <div id="policies-section">
                        <h2 class="text-xl font-bold text-slate-800 mb-4">Políticas de Cancelación</h2>
                        <div class="space-y-4">
                            ${policiesHtml}
                        </div>
                        
                        <div class="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                            <p class="text-sm font-semibold text-amber-900">
                                ⚠️ IMPORTANTE: Todos los reembolsos se hacen al día siguiente en horario hábil. En caso de ser fin de semana, indicar que el reembolso se hará el día lunes.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <script>
            // Datos de FAQs para filtrado
            window.faqsData = ${JSON.stringify(faqs)};
            
            window.toggleFAQ = function(index) {
                const answer = document.getElementById('faq-answer-' + index);
                const icon = document.getElementById('faq-icon-' + index);
                
                if (answer.classList.contains('hidden')) {
                    answer.classList.remove('hidden');
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    answer.classList.add('hidden');
                    icon.style.transform = 'rotate(0deg)';
                }
            };
            
            window.filterFAQs = function(searchTerm) {
                const term = searchTerm.toLowerCase().trim();
                const clearBtn = document.getElementById('clear-search');
                const noResults = document.getElementById('no-results');
                const faqsSection = document.getElementById('faqs-section');
                const policiesSection = document.getElementById('policies-section');
                
                // Mostrar/ocultar botón de limpiar
                if (term) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
                
                // Si no hay término de búsqueda, mostrar todo
                if (!term) {
                    faqsSection.classList.remove('hidden');
                    policiesSection.classList.remove('hidden');
                    noResults.classList.add('hidden');
                    
                    // Restaurar todas las FAQs
                    const allFaqItems = document.querySelectorAll('[id^="faq-item-"]');
                    allFaqItems.forEach(item => item.classList.remove('hidden'));
                    return;
                }
                
                // Filtrar FAQs
                let hasResults = false;
                window.faqsData.forEach((faq, idx) => {
                    const faqItem = document.getElementById('faq-item-' + idx);
                    if (!faqItem) return;
                    
                    const questionMatch = faq.question.toLowerCase().includes(term);
                    const answerText = faq.answer.replace(/<[^>]*>/g, '').toLowerCase();
                    const answerMatch = answerText.includes(term);
                    
                    if (questionMatch || answerMatch) {
                        faqItem.classList.remove('hidden');
                        hasResults = true;
                        
                        // Auto-expandir si coincide con la respuesta
                        if (answerMatch && !questionMatch) {
                            const answer = document.getElementById('faq-answer-' + idx);
                            const icon = document.getElementById('faq-icon-' + idx);
                            if (answer && answer.classList.contains('hidden')) {
                                answer.classList.remove('hidden');
                                icon.style.transform = 'rotate(180deg)';
                            }
                        }
                    } else {
                        faqItem.classList.add('hidden');
                    }
                });
                
                // Mostrar/ocultar secciones según resultados
                if (hasResults) {
                    faqsSection.classList.remove('hidden');
                    policiesSection.classList.add('hidden');
                    noResults.classList.add('hidden');
                } else {
                    faqsSection.classList.add('hidden');
                    policiesSection.classList.add('hidden');
                    noResults.classList.remove('hidden');
                }
            };
            
            window.clearFAQSearch = function() {
                const searchInput = document.getElementById('faq-search');
                searchInput.value = '';
                searchInput.focus();
                window.filterFAQs('');
            };
        </script>
    `;
}
