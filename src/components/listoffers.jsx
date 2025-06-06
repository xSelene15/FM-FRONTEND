import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function ImgListOffer() {
  const [productos, setProductos] = React.useState([]);

  React.useEffect(() => {
    fetch('http://34.204.114.72:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        const productosOferta = data.filter(item => item.oferta === true);
        setProductos(productosOferta);
      });
  }, []);

  return (
    <Card
      sx={{
        p: 2,
        mb: 4,
        bgcolor: 'rgba(255,255,255,0.7)', // Fondo blanco translúcido
        boxShadow: 3,
        borderRadius: 2,
        backdropFilter: 'blur(2px)' // Opcional: efecto de desenfoque detrás
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Productos en Oferta
      </Typography>
      <Grid container spacing={2}>
        {productos.map((item) => (
          <Grid key={item.codProducto}>
            <Card
              sx={{
                width: 220,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                margin: '0 auto'
              }}
            >
              <CardMedia
                component="img"
                image={item.imagenUrl}
                alt={item.nombre}
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'cover',
                  margin: '16px auto 0 auto',
                  borderRadius: 2
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="subtitle1" component="div" align="center">
                  {item.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {item.marca}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
