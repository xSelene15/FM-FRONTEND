import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function DashboardPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      <Paper
        elevation={8}
        sx={{
          p: 5,
          maxWidth: 600,
          width: '100%',
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.25)',
          textAlign: 'center',
        }}
      >
        <DashboardIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          ¡Bienvenido al Dashboard de Ferremas!
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Usa el menú lateral para navegar entre las distintas funcionalidades del sistema.
        </Typography>

      </Paper>
    </Box>
  );
}