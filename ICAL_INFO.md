# Información que Trae el iCal

## Formato iCal (Ejemplo Real)

Un archivo iCal de Airbnb o Booking.com tiene este formato:

```ical
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Airbnb Inc//Hosting Calendar 0.8.8//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

BEGIN:VEVENT
DTSTART;VALUE=DATE:20241215
DTEND;VALUE=DATE:20241220
DTSTAMP:20241204T131500Z
UID:airbnb_1416705135371185300_20241215@airbnb.com
SUMMARY:Airbnb (No disponible)
DESCRIPTION:Reserva de Airbnb
STATUS:CONFIRMED
END:VEVENT

BEGIN:VEVENT
DTSTART;VALUE=DATE:20241225
DTEND;VALUE=DATE:20241230
DTSTAMP:20241204T131500Z
UID:booking_123456@booking.com
SUMMARY:Booking.com reservation
DESCRIPTION:Reserva de Booking.com
STATUS:CONFIRMED
END:VEVENT

END:VCALENDAR
```

---

## Información que Extraemos

Actualmente, nuestro parser (`calendar.service.js`) extrae **solo 4 campos**:

### 1. **DTSTART** → `event.start`
- **Qué es:** Fecha de inicio de la reserva (check-in)
- **Formato original:** `20241215` (YYYYMMDD)
- **Convertido a:** `Date` object de JavaScript
- **Ejemplo:** `new Date(2024, 11, 15)` → 15 de diciembre de 2024

### 2. **DTEND** → `event.end`
- **Qué es:** Fecha de fin de la reserva (check-out)
- **Formato original:** `20241220` (YYYYMMDD)
- **Convertido a:** `Date` object de JavaScript
- **Ejemplo:** `new Date(2024, 11, 20)` → 20 de diciembre de 2024

### 3. **SUMMARY** → `event.summary`
- **Qué es:** Título/resumen de la reserva
- **Ejemplos:**
  - Airbnb: `"Airbnb (No disponible)"`
  - Booking: `"Booking.com reservation"`
  - A veces incluye nombre del huésped (depende de la plataforma)

### 4. **UID** → `event.uid`
- **Qué es:** Identificador único del evento
- **Formato:** String único
- **Ejemplo:** `"airbnb_1416705135371185300_20241215@airbnb.com"`

---

## Estructura del Evento Parseado

Después de parsear, cada evento tiene esta estructura:

```javascript
{
  start: Date,      // Fecha de check-in
  end: Date,        // Fecha de check-out
  summary: String,  // Título de la reserva
  uid: String       // ID único
}
```

**Ejemplo concreto:**
```javascript
{
  start: Wed Dec 15 2024 00:00:00,
  end: Wed Dec 20 2024 00:00:00,
  summary: "Airbnb (No disponible)",
  uid: "airbnb_1416705135371185300_20241215@airbnb.com"
}
```

---

## Información Adicional Disponible (No Extraída Actualmente)

El iCal contiene **más información** que NO estamos extrayendo:

### Campos Disponibles pero No Usados:

1. **DESCRIPTION** - Descripción detallada
   - Puede incluir: nombre del huésped, notas, instrucciones
   - Ejemplo: `"Reserva de Juan Pérez para 2 personas"`

2. **STATUS** - Estado de la reserva
   - Valores: `CONFIRMED`, `TENTATIVE`, `CANCELLED`
   - Útil para filtrar reservas canceladas

3. **DTSTAMP** - Timestamp de cuándo se creó/modificó
   - Formato: `20241204T131500Z`
   - Útil para saber cuándo se actualizó

4. **LOCATION** - Ubicación (raramente incluido)
   - Dirección de la propiedad

5. **ORGANIZER** - Organizador del evento
   - Email o nombre de la plataforma

6. **ATTENDEE** - Asistentes (raramente incluido)
   - Información del huésped

---

## Cómo se Usa en el Reporte de Check-outs

### Proceso:

1. **Cargamos** todos los iCal de Airbnb y Booking
2. **Parseamos** cada archivo para extraer eventos
3. **Enriquecemos** cada evento con:
   ```javascript
   {
     ...event,
     propertyId: "123",
     propertyName: "Acogedor Depto 2D+2B"
   }
   ```

4. **Analizamos** qué eventos tienen `end` (check-out) en la fecha seleccionada
5. **Calculamos** duración de estadía:
   ```javascript
   duration = (event.end - event.start) / (1000 * 60 * 60 * 24)
   ```

6. **Buscamos** la próxima reserva para detectar "Back-to-Back"

---

## Ejemplo de Análisis de Check-out

**Fecha seleccionada:** 20 de diciembre de 2024

**Evento encontrado:**
```javascript
{
  start: new Date(2024, 11, 15),  // 15 dic
  end: new Date(2024, 11, 20),    // 20 dic ← MATCH!
  summary: "Airbnb (No disponible)",
  uid: "airbnb_...",
  propertyId: "123",
  propertyName: "Acogedor Depto 2D+2B"
}
```

**Resultado mostrado:**
- 🏠 **Acogedor Depto 2D+2B**
- 📍 Dirección de la propiedad
- ⏰ Check-out: 12:00
- 📊 Estadía: 5 noches
- 📅 Próxima reserva: 21 dic (si existe) → ⚡ Back-to-Back

---

## Limitaciones Actuales

### ❌ No Extraemos:
- Nombre del huésped (a veces viene en DESCRIPTION)
- Estado de la reserva (CONFIRMED/CANCELLED)
- Precio de la reserva (no viene en iCal)
- Número de huéspedes (no viene en iCal)
- Notas especiales (a veces en DESCRIPTION)

### ✅ Podríamos Agregar:
Si quieres más información, podemos modificar el parser para extraer:
- `DESCRIPTION` → Para ver notas y posible nombre de huésped
- `STATUS` → Para filtrar reservas canceladas
- `DTSTAMP` → Para saber cuándo se actualizó

---

## ¿Quieres Extraer Más Información?

Si necesitas extraer campos adicionales como `DESCRIPTION` o `STATUS`, puedo modificar el parser en `calendar.service.js` para incluirlos.

¿Qué información adicional te gustaría ver en el reporte de check-outs?
