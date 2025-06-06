import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx'; // Corrige el import si es necesario
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function LoginAdmPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { loginEmpleado } = useAuth();
  const { addMessage } = useMessages();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    const res = await fetch('http://34.204.114.72:8080/api/empleados/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      loginEmpleado(data);
      addMessage('¡Inicio de sesión correcto!');
      navigate('/dashboard');
      return;
    }
    setMensaje('Credenciales incorrectas');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión Empleado
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ py: 1.5, fontSize: '1.1em', mt: 2 }}
          >
            Ingresar
          </Button>
        </form>
        {mensaje && (
          <Typography color="error" sx={{ mt: 2 }}>
            {mensaje}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}