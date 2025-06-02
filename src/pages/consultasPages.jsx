import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Consultas() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a tu backend o API
    setEnviado(true);
    setNombre('');
    setEmail('');
    setMensaje('');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Formulario de Consultas
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Mensaje"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar
        </Button>
      </form>
      {enviado && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          ¡Consulta enviada correctamente!
        </Typography>
      )}
    </Box>
  );
}