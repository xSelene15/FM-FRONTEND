import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React from 'react';

export default function RegistroPage() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1, // Asegura que esté sobre el fondo
      }}
    >
      <Box
        component="form"
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          width: '100%',
        }}
        noValidate
        autoComplete="off"
      >
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Registro de Cliente</h1>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField id="Rut" label="DNI/RUT" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="Nombre" label="Nombre" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="PrimerApellido" label="Primer Apellido" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="SegundoApellido" label="Segundo Apellido" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="FechaNac" label="Fecha de Nacimiento" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="Direccion" label="Dirección" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="Ciudad" label="Ciudad" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="Pais" label="Pais" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="CodigoPostal" label="Codigo Postal" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="Telefono" label="Nº Teléfono" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="Email" label="Email" variant="outlined" type="email" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid item xs={12} sm={6}> 
            <TextField id="Password" label="Contraseña" variant="outlined" type="password" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} style={{ marginTop: 16 }}> 
            <TextField id="ConfirmarPassword" label="Confirmar Contraseña" variant="outlined" type="password" fullWidth />
          </Grid>
          </Grid>  
        </Grid>
        <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.5, fontSize: '1.1em', mt: 2 }}
            >
              Registrar
            </Button>
          </Grid>
      </Box>
    </Box>
  );
}
