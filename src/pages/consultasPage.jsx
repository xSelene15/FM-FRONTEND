import React, { useState } from 'react';
import { useMessages } from '../context/MessagesContext.jsx';
import { Paper, Typography, Box, Button, TextareaAutosize } from '@mui/material';

export default function ConsultasPage() {
  const [text, setText] = useState('');
  const { addMessage } = useMessages();

  const handleSend = () => {
    if (text.trim()) {
      addMessage({ text, date: new Date().toLocaleString() });
      setText('');
      alert('Mensaje enviado');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          backdropFilter: 'blur(2px)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Consultas
        </Typography>
        <TextareaAutosize
          minRows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu consulta aquí..."
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: 4, borderColor: '#ccc', marginBottom: 16 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            sx={{ fontSize: 16, px: 4, py: 1 }}
          >
            Enviar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}