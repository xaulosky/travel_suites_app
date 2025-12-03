/**
 * Vercel Serverless Function - Get Products
 * Proxy para obtener productos de WooCommerce de forma segura
 */
export default async function handler(req, res) {
    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Configurar CORS primero
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Configuración desde variables de entorno
    const WC_URL = process.env.WOOCOMMERCE_URL;
    const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    console.log('Environment check:', {
        hasUrl: !!WC_URL,
        hasKey: !!CONSUMER_KEY,
        hasSecret: !!CONSUMER_SECRET
    });

    if (!WC_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error('Missing WooCommerce credentials');
        return res.status(500).json({
            error: 'WooCommerce credentials not configured',
            details: 'Please configure environment variables in Vercel Dashboard'
        });
    }

    try {
        // Construir URL con autenticación
        const url = `${WC_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100&status=publish`;

        console.log('Fetching from WooCommerce...');

        // Hacer petición a WooCommerce con timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8 segundos

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Vercel-Serverless-Function'
            }
        });

        clearTimeout(timeout);

        if (!response.ok) {
            console.error('WooCommerce API error:', response.status);
            throw new Error(`WooCommerce API error: ${response.status}`);
        }

        const products = await response.json();
        console.log(`Successfully fetched ${products.length} products`);

        // Cache por 5 minutos
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(products);

    } catch (error) {
        console.error('Error fetching products:', error.message);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Request timeout',
                message: 'WooCommerce API took too long to respond'
            });
        }

        return res.status(500).json({
            error: 'Failed to fetch products',
            message: error.message
        });
    }
}
