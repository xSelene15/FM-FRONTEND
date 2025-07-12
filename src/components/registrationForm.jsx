import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPat: '',
    apellidoMat: '',
    fechaNacimiento: '',
    rut: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigoPostal: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateRut = (rut) => {
    // Validación básica del RUT chileno
    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
    return rutRegex.test(rut);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellidoPat.trim()) newErrors.apellidoPat = 'El apellido paterno es requerido';
    if (!formData.apellidoMat.trim()) newErrors.apellidoMat = 'El apellido materno es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    
    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es requerido';
    } else if (!validateRut(formData.rut)) {
      newErrors.rut = 'El RUT debe tener el formato: 12345678-9';
    }
    
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = 'El correo debe tener un formato válido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.pais.trim()) newErrors.pais = 'El país es requerido';
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'El código postal es requerido';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://34.204.114.72:8080/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el cliente');
      }

      const result = await response.json();
      console.log('Cliente registrado exitosamente:', result);
      
      setSuccessMessage('¡Cliente registrado exitosamente! Será redirigido al inicio de sesión.');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellidoPat: '',
        apellidoMat: '',
        fechaNacimiento: '',
        rut: '',
        correo: '',
        password: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        pais: '',
        codigoPostal: ''
      });
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      setErrorMessage(error.message || 'Error al registrar el cliente. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos comunes para los TextField
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#67aad6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#040b4b',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#040b4b',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #040b4b 0%, #67aad6 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #040b4b 0%, #67aad6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              FERREMAS
            </Typography>
            <Typography variant="h5" component="h2" sx={{ color: '#040b4b', fontWeight: 600 }}>
              Registro de Cliente
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Complete todos los campos para crear su cuenta
            </Typography>
          </Box>

          {/* Alertas */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#040b4b', 
                  fontWeight: 600, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📋 Datos Personales
              </Typography>
              <Divider sx={{ mb: 3, borderColor: '#67aad6' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nombre *"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Apellido Paterno *"
                    name="apellidoPat"
                    value={formData.apellidoPat}
                    onChange={handleChange}
                    error={!!errors.apellidoPat}
                    helperText={errors.apellidoPat}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Apellido Materno *"
                    name="apellidoMat"
                    value={formData.apellidoMat}
                    onChange={handleChange}
                    error={!!errors.apellidoMat}
                    helperText={errors.apellidoMat}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento *"
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    error={!!errors.fechaNacimiento}
                    helperText={errors.fechaNacimiento}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="RUT *"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    error={!!errors.rut}
                    helperText={errors.rut || 'Formato: 12345678-9'}
                    variant="outlined"
                    placeholder="12345678-9"
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* SECCIÓN 2: DATOS DE CONTACTO */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#040b4b', 
                  fontWeight: 600, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📞 Datos de Contacto
              </Typography>
              <Divider sx={{ mb: 3, borderColor: '#67aad6' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico *"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    error={!!errors.correo}
                    helperText={errors.correo}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono *"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    variant="outlined"
                    placeholder="+56 9 1234 5678"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña *"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password || 'Mínimo 6 caracteres'}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* SECCIÓN 3: DIRECCIÓN */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#040b4b', 
                  fontWeight: 600, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📍 Dirección
              </Typography>
              <Divider sx={{ mb: 3, borderColor: '#67aad6' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección *"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                    variant="outlined"
                    multiline
                    rows={2}
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Ciudad *"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    error={!!errors.ciudad}
                    helperText={errors.ciudad}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="País *"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    error={!!errors.pais}
                    helperText={errors.pais}
                    variant="outlined"
                    placeholder="Chile"
                    sx={textFieldSx}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Código Postal *"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    error={!!errors.codigoPostal}
                    helperText={errors.codigoPostal}
                    variant="outlined"
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* BOTÓN DE REGISTRO */}
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  height: 56,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #040b4b 0%, #67aad6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #030a42 0%, #5a9bc4 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(4, 11, 75, 0.5)',
                  },
                  borderRadius: 2,
                  boxShadow: '0 4px 15px rgba(4, 11, 75, 0.3)',
                  mb: 2
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
                    Registrando...
                  </>
                ) : (
                  '🔧 Registrar Cliente'
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya tienes una cuenta?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      color: '#040b4b',
                      '&:hover': {
                        color: '#67aad6',
                        backgroundColor: 'rgba(4, 11, 75, 0.1)',
                      }
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationForm;