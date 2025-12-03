const https = require('https');

/**
 * Vercel Serverless Function - Get Products
 * Proxy para obtener productos de WooCommerce de forma segura
 */
module.exports = async (req, res) => {
    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Configuración desde variables de entorno
    const WC_URL = process.env.WOOCOMMERCE_URL;
    const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!WC_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        return res.status(500).json({ error: 'WooCommerce credentials not configured' });
    }

    try {
        // Construir URL con autenticación
        const url = new URL(`${WC_URL}/wp-json/wc/v3/products`);
        url.searchParams.append('consumer_key', CONSUMER_KEY);
        url.searchParams.append('consumer_secret', CONSUMER_SECRET);
        url.searchParams.append('per_page', '100');
        url.searchParams.append('status', 'publish');

        // Hacer petición a WooCommerce
        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`WooCommerce API error: ${response.status}`);
        }

        const products = await response.json();

        // Configurar CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(products);

    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            error: 'Failed to fetch products',
            message: error.message
        });
    }
};
