import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function CartPage({ cart, setCart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + Number(item.precioActual) * (item.cantidad || 1), 0);
  const [webpayData, setWebpayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para descontar stock en la API
  const descontarStockAPI = async () => {
    try {
      // Por cada producto en el carrito, envía una petición para descontar el stock
      for (const product of cart) {
        await fetch(`http://http://34.204.114.72:8080//productos/${product.codProducto}/descontar-stock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: product.stock - (product.cantidad || 1) })
        });
      }
    } catch (error) {
      // Puedes mostrar un mensaje de error si lo deseas
      console.error('Error al descontar stock:', error);
    }
  };

  // Detectar retorno de WebPay
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('token_ws')) {
      setShowSuccess(true);
      descontarStockAPI(); // Descontar stock al pagar
      // Aquí podrías limpiar el carrito si quieres
      // localStorage.removeItem('cart');
      // setCart([]);
    }
  }, [setCart]);

  // Unifica productos con el mismo codProducto sumando cantidades
  useEffect(() => {
    const uniqueCart = [];
    cart.forEach(item => {
      const found = uniqueCart.find(i => i.codProducto === item.codProducto);
      if (found) {
        found.cantidad += item.cantidad || 1;
      } else {
        uniqueCart.push({ ...item });
      }
    });
    if (uniqueCart.length !== cart.length) {
      setCart(uniqueCart);
    }
    // eslint-disable-next-line
  }, []);

  // Aumentar cantidad
  const handleIncrease = (codProducto) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.codProducto === codProducto && item.cantidad < item.stock
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // Disminuir cantidad
  const handleDecrease = (codProducto) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.codProducto === codProducto
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  // Agregar al carrito
  const addToCart = (product) => {
    setCart(prevCart => {
      const found = prevCart.find(item => item.codProducto === product.codProducto);
      if (found) {
        return prevCart.map(item =>
          item.codProducto === product.codProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  // Pago WebPay
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

  // Verifica si hay algún producto con stock 0 en el carrito
  const hasOutOfStock = cart.some(product => product.stock === 0);

  return (
    <Box>
      {showSuccess && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
          ¡Pago realizado con éxito!
        </Box>
      )}
      <List>
        {cart.length === 0 ? (
          <ListItem>
            <ListItemText primary="El carrito está vacío." />
          </ListItem>
        ) : (
          cart.map((product, idx) => (
            <ListItem
              key={product.codProducto || idx}
              secondaryAction={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeFromCart(product.codProducto)}
                >
                  Quitar
                </Button>
              }
              sx={{ borderBottom: '1px solid #eee' }}
            >
              <img
                src={product.imagenUrl}
                alt={product.nombre}
                style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16 }}
              />
              <ListItemText
                primary={product.nombre}
                secondary={
                  <span>
                    Precio: ${product.precioActual} | Marca: {product.marca}
                    <br />
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleDecrease(product.codProducto)}
                        disabled={product.cantidad <= 1}
                      >-</Button>
                      <span style={{ minWidth: 30, textAlign: 'center' }}>{product.cantidad || 1}</span>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleIncrease(product.codProducto)}
                        disabled={product.cantidad >= product.stock || product.stock === 0}
                      >+</Button>
                      <span style={{ marginLeft: 8, color: product.stock === 0 ? 'red' : '#888' }}>
                        Stock: {product.stock - (product.cantidad || 1)}
                        {product.stock === 0 && ' (Sin stock)'}
                      </span>
                    </Box>
                  </span>
                }
              />
            </ListItem>
          ))
        )}
      </List>
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
          disabled={loading || cart.length === 0 || hasOutOfStock}
        >
          {loading ? 'Redirigiendo...' : 'Pagar con WebPay'}
        </Button>
      </Box>
      {hasOutOfStock && (
        <Box sx={{ mt: 2, color: 'error.main', textAlign: 'right' }}>
          Hay productos sin stock en el carrito. Elimina o ajusta antes de pagar.
        </Box>
      )}
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