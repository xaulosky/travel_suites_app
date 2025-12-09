/**
 * Proxy para calendarios iCal
 * Evita problemas de CORS y límites de proxies públicos
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        console.log(`📅 Fetching iCal from: ${url}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 segundos

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'TravelSuites/1.0'
            }
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const icalData = await response.text();

        // Retornar el contenido iCal
        res.setHeader('Content-Type', 'text/calendar');
        return res.status(200).send(icalData);

    } catch (error) {
        console.error('Error fetching iCal:', error.message);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Request timeout',
                message: 'iCal fetch took too long'
            });
        }

        return res.status(500).json({
            error: 'Failed to fetch iCal',
            message: error.message
        });
    }
}
