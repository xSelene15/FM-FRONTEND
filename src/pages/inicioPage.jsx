import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TitlebarBelowImageList from '../components/listoffers.jsx';
import TitlebarBelowMasonryImageList from '../components/listnew.jsx';

export default function InicioPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
        Bienvenido a FERREMAS
      </Typography>
      <Grid container spacing={4} columns={12} sx={{ p: 4 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Ofertas Especiales
          </Typography>
          <TitlebarBelowImageList />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Nuevos Productos
          </Typography>
          <TitlebarBelowMasonryImageList />
        </Grid>
      </Grid>
    </>
  );
}