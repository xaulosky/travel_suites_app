/**
 * Vercel Serverless Function - TravelSuites API Proxy
 * Proxy para la API custom de TravelSuites (reservas, check-ins, check-outs, etc.)
 */
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Configuración desde variables de entorno
    const API_URL = process.env.TRAVELSUITES_API_URL || 'https://travelsuites.cl/wp-json/travelsuites/v1';
    const API_KEY = process.env.TRAVELSUITES_API_KEY;

    if (!API_KEY) {
        console.error('Missing TravelSuites API key');
        return res.status(500).json({
            error: 'TravelSuites API key not configured',
            details: 'Please configure TRAVELSUITES_API_KEY in Vercel Dashboard'
        });
    }

    try {
        // Obtener el endpoint del query string
        const { endpoint, ...queryParams } = req.query;

        if (!endpoint) {
            return res.status(400).json({
                error: 'Missing endpoint parameter',
                usage: '/api/travelsuites?endpoint=bookings&status=confirmed'
            });
        }

        // Construir URL con query params
        const url = new URL(`${API_URL}/${endpoint}`);
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) url.searchParams.append(key, value);
        });

        console.log(`🔄 TravelSuites API: ${req.method} ${endpoint}`);

        // Configurar request
        const fetchOptions = {
            method: req.method,
            headers: {
                'X-TravelSuites-API-Key': API_KEY,
                'Content-Type': 'application/json',
                'User-Agent': 'TravelSuites-App/1.0'
            }
        };

        // Agregar body para POST
        if (req.method === 'POST' && req.body) {
            fetchOptions.body = JSON.stringify(req.body);
        }

        // Hacer petición con timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        fetchOptions.signal = controller.signal;

        const response = await fetch(url.toString(), fetchOptions);
        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            console.error('TravelSuites API error:', data);
            return res.status(response.status).json(data);
        }

        console.log(`✅ TravelSuites API: ${endpoint} - OK`);

        // Cache por 1 minuto para GETs
        if (req.method === 'GET') {
            res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('TravelSuites API error:', error.message);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Request timeout',
                message: 'TravelSuites API took too long to respond'
            });
        }

        return res.status(500).json({
            error: 'TravelSuites API request failed',
            message: error.message
        });
    }
}
