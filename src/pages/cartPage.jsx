import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function CartPage({ cart, setCart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + Number(item.precioActual) * (item.cantidad || 1), 0);
  const [webpayData, setWebpayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para obtener el ID del cliente por correo
  const obtenerClienteIdPorCorreo = async (correo) => {
    try {
      const response = await fetch(`http://34.204.114.72:8080/api/clientes/correo/${correo}`);
      if (response.ok) {
        const cliente = await response.json();
        return cliente.id;
      } else {
        console.error('Cliente no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return null;
    }
  };

  // Función para crear el pedido en la BD
  const crearPedidoAPI = async () => {
    try {
      // Obtener el correo del usuario logueado
      const correoUsuario = JSON.parse(localStorage.getItem('user')).correo;
      
      // Obtener el ID del cliente usando el correo
      const clienteId = await obtenerClienteIdPorCorreo(correoUsuario);
          
      if (!clienteId) {
        console.error('No se pudo obtener el ID del cliente');
        return;
      }

      const pedidoData = {
        clienteId: clienteId,
        items: cart.map(product => ({
          codProducto: product.codProducto,
          cantidad: product.cantidad || 1
        }))
      };

      console.log('Creando pedido:', pedidoData);

      const response = await fetch('http://34.204.114.72:8080/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      });

      if (response.ok) {
        const pedidoCreado = await response.json();
        console.log('Pedido creado exitosamente:', pedidoCreado);
        return pedidoCreado;
      } else {
        console.error('Error al crear el pedido:', response.statusText);
      }
    } catch (error) {
      console.error('Error al crear el pedido:', error);
    }
  };

  // Función para descontar stock en la API
  const descontarStockAPI = async () => {
    try {
      for (const product of cart) {
        // PATCH para descontar stock
        await fetch(`http://34.204.114.72:8080/api/productos/codigo/${product.codProducto}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: product.stock - (product.cantidad) })
        });
      }
    } catch (error) {
      console.error('Error al descontar stock:', error);
    }
  };

  // Detectar retorno de WebPay
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('token_ws')) {
      setShowSuccess(true);
      
      // Crear el pedido primero, luego descontar stock
      crearPedidoAPI().then(() => {
        descontarStockAPI(); // Descontar stock al pagar
        setCart([]); // Limpiar carrito al pagar exitosamente

        // Enviar email de confirmación de compra
        fetch('http://34.204.114.72:8080/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'rodr.amigo@duocuc.cl', // Reemplaza por el email real del cliente si lo tienes
            subject: 'Compra realizada con éxito',
            body: 'Gracias por su compra. Su pedido ha sido procesado correctamente.'
          }),
        });
      });

      // localStorage.removeItem('cart'); // Si usas localStorage, descomenta esta línea
    }
    // eslint-disable-next-line
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <h2 style={{ margin: 0, fontWeight: 700, textAlign: 'center' }}>Carrito</h2>
          </Box>
          {showSuccess && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
              ¡Pago realizado con éxito! Tu pedido ha sido registrado.
              En breve recibirás un correo de confirmación.
            </Box>
          )}
          <List sx={{ width: '100%' }}>
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
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, width: '100%' }}>
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
            <Box sx={{ mt: 2, color: 'error.main', textAlign: 'right', width: '100%' }}>
              Hay productos sin stock en el carrito. Elimina o ajusta antes de pagar.
            </Box>
          )}
          {webpayData && (
            <Box sx={{ mt: 2, color: 'error.main', width: '100%' }}>
              {typeof webpayData === 'string'
                ? webpayData
                : <pre>{JSON.stringify(webpayData, null, 2)}</pre>}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}