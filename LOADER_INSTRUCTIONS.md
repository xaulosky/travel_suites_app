# Instrucciones para Agregar el Loader al Reporte de Check-outs

## Archivo a Editar
`components/views/CheckoutReportView.js`

## Cambio a Realizar

Busca la línea 9 que dice:
```javascript
    const viewMode = state.checkoutReportViewMode || 'daily'; // 'daily' o 'weekly'
```

Después de esa línea (línea 9), agrega estas 5 líneas:

```javascript
    
    // Mostrar loader mientras se cargan calendarios
    if (state.checkoutReportLoading) {
        return renderLoadingState();
    }
```

## Resultado Final

El código debería quedar así (líneas 7-16):

```javascript
export function CheckoutReportView(state) {
    const selectedDate = state.checkoutReportDate || new Date();
    const viewMode = state.checkoutReportViewMode || 'daily'; // 'daily' o 'weekly'
    
    // Mostrar loader mientras se cargan calendarios
    if (state.checkoutReportLoading) {
        return renderLoadingState();
    }
    
    let content = '';
    
    if (viewMode === 'daily') {
        content = renderDailyView(selectedDate, state);
    } else {
        content = renderWeeklyView(selectedDate, state);
    }
```

## ¿Qué hace esto?

Cuando abres el "Reporte Check-outs", el sistema automáticamente:
1. Activa `state.checkoutReportLoading = true`
2. Muestra el loader animado (spinner)
3. Carga TODOS los calendarios de las 55 propiedades
4. Cuando termina, desactiva `state.checkoutReportLoading = false`
5. Muestra el reporte con los check-outs

¡Eso es todo! Con este simple cambio verás el loader visual en la interfaz.
