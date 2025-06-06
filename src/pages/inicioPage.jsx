import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ImgListOffer from '../components/listoffers.jsx';
import ImgListNew from '../components/listnew.jsx';

export default function InicioPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
        Bienvenido a FERREMAS
      </Typography>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={4}
        sx={{ minHeight: '70vh', p: 4 }}
      >        
      <Grid item>
          <ImgListNew />
        </Grid>
        <Grid item>
          <ImgListOffer />
        </Grid>

      </Grid>
    </>
  );
}