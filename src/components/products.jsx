import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CardContent, CardActions, Button, Snackbar, Alert } from '@mui/material';


export default function ProductCard({ codProducto, nombre, precioActual, imagenUrl, marca, stock, descripcion, addToCart, onAddToCart, oferta }) {
  const [open, setOpen] = React.useState(false);

  const handleAdd = () => {
    addToCart({ codProducto, nombre, precioActual, imagenUrl, marca, stock });
    setOpen(true);
    if (onAddToCart) onAddToCart();
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent sx={{ p: 2 }}>
        <img src={imagenUrl} alt={nombre} style={{ width: '100%', height: 180, objectFit: 'cover', marginBottom: 8 }} />
        <Typography gutterBottom variant='h6' component="div">
          {codProducto}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {marca}
          <Typography gutterBottom variant="h4" component="div">
            {nombre}
          </Typography>
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          ${precioActual}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {descripcion}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Stock: {stock}
        </Typography>
      </CardContent>
      {addToCart && (
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAdd}
            disabled={stock === 0}
          >
            {stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </Button>
        </CardActions>
      )}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Producto agregado exitosamente
        </Alert>
      </Snackbar>
    </Card>
  );
}

