import React, { useState } from 'react';
import { useMessages } from '../context/MessagesContext.jsx';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField,
  Alert,
  Snackbar
} from '@mui/material';

export default function ConsultasPage() {
  const [formData, setFormData] = useState({
    clienteCorreo: '',
    mensaje: '',
    mensajeCliente: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addMessage } = useMessages();

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    // Limitar mensajeCliente a 500 caracteres
    if (field === 'mensajeCliente' && value.length > 500) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clienteCorreo.trim()) {
      newErrors.clienteCorreo = 'El correo del cliente es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clienteCorreo.trim())) {
      newErrors.clienteCorreo = 'El formato del correo no es válido';
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El título de la consulta es requerido';
    }
    
    if (!formData.mensajeCliente.trim()) {
      newErrors.mensajeCliente = 'El mensaje de la consulta es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const consultaData = {
        clienteCorreo: formData.clienteCorreo.trim(),
        mensaje: formData.mensaje.trim(),
        fecha: new Date().toISOString(),
        mensajeCliente: formData.mensajeCliente.trim()
      };

      // Enviar datos a la API
      const response = await fetch('http://34.204.114.72:8080/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultaData)
      });

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Consulta enviada exitosamente:', responseData);

      // Agregar mensaje al contexto
      addMessage({ 
        text: `Consulta enviada: ${formData.mensaje}`, 
        date: new Date().toLocaleString() 
      });
      
      // Limpiar formulario
      setFormData({
        clienteCorreo: '',
        mensaje: '',
        mensajeCliente: ''
      });
      
      setSnackbar({
        open: true,
        message: 'Consulta enviada exitosamente',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar la consulta. Intente nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
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
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Complete el siguiente formulario para enviar su consulta
        </Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Correo Cliente"
            value={formData.clienteCorreo}
            onChange={handleChange('clienteCorreo')}
            error={!!errors.clienteCorreo}
            helperText={errors.clienteCorreo}
            fullWidth
            required
            type="email"
            placeholder="Ej: cliente@correo.com"
            variant="outlined"
          />

          <TextField
            label="Título de Consulta"
            value={formData.mensaje}
            onChange={handleChange('mensaje')}
            error={!!errors.mensaje}
            helperText={errors.mensaje}
            fullWidth
            required
            placeholder="Ingrese el título de su consulta"
            variant="outlined"
          />

          <TextField
            label="Mensaje de Consulta"
            value={formData.mensajeCliente}
            onChange={handleChange('mensajeCliente')}
            error={!!errors.mensajeCliente}
            helperText={errors.mensajeCliente || `${formData.mensajeCliente.length}/500 caracteres`}
            fullWidth
            required
            multiline
            rows={6}
            placeholder="Describa detalladamente su consulta (máximo 500 caracteres)"
            variant="outlined"
            inputProps={{
              style: { resize: 'none' }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              disabled={loading}
              sx={{ fontSize: 16, px: 4, py: 1.5, minWidth: 120 }}
            >
              {loading ? 'Enviando...' : 'Enviar Consulta'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}