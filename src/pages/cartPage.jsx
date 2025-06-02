import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products.jsx';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function CartPage({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + Number(item.precioActual), 0);
  const [webpayData, setWebpayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Detectar retorno de WebPay
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('token_ws')) {
      setShowSuccess(true);
      // Aquí podrías limpiar el carrito si quieres
      // localStorage.removeItem('cart');
      // window.history.replaceState({}, document.title, "/carrito/");
    }
  }, []);

  const handleWebPay = () => {
    setLoading(true);
    fetch('http://34.204.114.72:8080/webpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyOrder: 'orden-' + Date.now(),
        sessionId: 'session-' + Date.now(),
        amount: total,
        returnUrl: window.location.href
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.url && data.token) {
          // Crear y enviar el formulario automáticamente
          const form = document.createElement('form');
          form.action = data.url;
          form.method = 'POST';
          form.target = '_self';

          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'token_ws';
          input.value = data.token;
          form.appendChild(input);

          document.body.appendChild(form);
          form.submit();
        } else {
          setWebpayData(data);
        }
      })
      .catch(() => {
        setLoading(false);
        setWebpayData({ error: 'Transacción fallida. Intenta nuevamente.' });
      });
  };

  return (
    <Box>
      {showSuccess && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
          ¡Pago realizado con éxito!
        </Box>
      )}
      <Grid container columns={12} spacing={2} sx={{ p: 2 }}>
        {cart.length === 0 ? (
          <Grid item xs={12}>
            <p>El carrito está vacío.</p>
          </Grid>
        ) : (
          cart.map((product, idx) => (
            <Grid key={idx} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
              <ProductCard {...product} addToCart={null} />
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => removeFromCart(product.codProducto)}
              >
                Quitar del carrito
              </Button>
            </Grid>
          ))
        )}
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <input
          type="text"
          value={`Total: $${total.toFixed(2)}`}
          readOnly
          style={{ fontSize: '1.2em', padding: '0.5em', width: '200px', textAlign: 'right' }}
        />
        <Button
          variant="contained"
          color="success"
          sx={{ fontSize: '1.1em', height: '48px' }}
          onClick={handleWebPay}
          disabled={loading || cart.length === 0}
        >
          {loading ? 'Redirigiendo...' : 'Pagar con WebPay'}
        </Button>
      </Box>
      {webpayData && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          {typeof webpayData === 'string'
            ? webpayData
            : <pre>{JSON.stringify(webpayData, null, 2)}</pre>}
        </Box>
      )}
    </Box>
  );
}