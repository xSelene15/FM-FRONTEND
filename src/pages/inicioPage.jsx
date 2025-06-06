import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ImgListOffer from '../components/listoffers.jsx';
import ImgListNew from '../components/listnew.jsx';
import { Card } from '@mui/material';

export default function InicioPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
        Bienvenido a FERREMAS
      </Typography>
      <Grid container spacing={4} columns={12} sx={{ p: 4 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <ImgListOffer />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <ImgListNew />
        </Grid>
      </Grid>
    </>
  );
}