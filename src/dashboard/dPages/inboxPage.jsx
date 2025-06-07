import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useMessages } from '../../context/MessagesContext';

export default function InboxPage() {
  const { messages } = useMessages();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Estamos trabajando para usted
        </Typography>
        <Typography variant="body1">
          Pronto podrá ver sus mensajes aquí.
        </Typography>
      </Paper>
    </Box>
  );
}