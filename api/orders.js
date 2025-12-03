/**
 * Vercel Serverless Function - Create Order
 * Proxy para crear órdenes en WooCommerce de forma segura
 */
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Configuración desde variables de entorno
    const WC_URL = process.env.WOOCOMMERCE_URL;
    const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!WC_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error('Missing WooCommerce credentials');
        return res.status(500).json({
            error: 'WooCommerce credentials not configured',
            details: 'Please configure environment variables in Vercel Dashboard'
        });
    }

    try {
        // Validar que se recibieron datos
        if (!req.body) {
            return res.status(400).json({ error: 'Order data is required' });
        }

        // Construir URL con autenticación
        const url = `${WC_URL}/wp-json/wc/v3/orders?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

        console.log('Creating order in WooCommerce...');

        // Hacer petición a WooCommerce con timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Vercel-Serverless-Function'
            },
            body: JSON.stringify(req.body)
        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            console.error('WooCommerce API error:', data);
            throw new Error(data.message || `WooCommerce API error: ${response.status}`);
        }

        console.log('Order created successfully:', data.id);

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error creating order:', error.message);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Request timeout',
                message: 'WooCommerce API took too long to respond'
            });
        }

        return res.status(500).json({
            error: 'Failed to create order',
            message: error.message
        });
    }
}
