/**
 * Vercel Serverless Function - Create Order
 * Proxy para crear órdenes en WooCommerce de forma segura
 */
module.exports = async (req, res) => {
    // Solo permitir POST
    if (req.method !== 'POST') {
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
        // Validar que se recibieron datos
        if (!req.body) {
            return res.status(400).json({ error: 'Order data is required' });
        }

        // Construir URL con autenticación
        const url = new URL(`${WC_URL}/wp-json/wc/v3/orders`);
        url.searchParams.append('consumer_key', CONSUMER_KEY);
        url.searchParams.append('consumer_secret', CONSUMER_SECRET);

        // Hacer petición a WooCommerce
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `WooCommerce API error: ${response.status}`);
        }

        const order = await response.json();

        // Configurar CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        return res.status(200).json(order);

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            error: 'Failed to create order',
            message: error.message
        });
    }
};
