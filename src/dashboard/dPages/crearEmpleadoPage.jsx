import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const roles = [
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'BODEGUERO', label: 'Bodeguero' },
  { value: 'AUDITOR', label: 'Auditor' }
];

export default function CrearEmpleadoPage() {
  const [form, setForm] = useState({
    nombreCompleto: '',
    rut: '',
    correo: '',
    password: '',
    rol: 'VENDEDOR',
    sucursalId: ''
  });
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://34.204.114.72:8080/api/sucursales')
      .then(res => res.json())
      .then(data => setSucursales(data))
      .catch(() => setSucursales([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    const payload = {
      nombreCompleto: form.nombreCompleto,
      rut: form.rut,
      correo: form.correo,
      password: form.password,
      rol: form.rol,
      sucursal: { id: Number(form.sucursalId) }
    };
    try {
      const res = await fetch('http://34.204.114.72:8080/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        navigate('/dashboard/usuarios');
      } else {
        setError('Error al crear empleado. Verifica los datos.');
      }
    } catch {
      setError('Error de red al crear empleado.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, width: 420 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Tooltip title="Atrás">
            <IconButton
              onClick={() => navigate('/dashboard/usuarios')}
              sx={{ color: 'primary.main' }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
            Crear nuevo empleado
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre completo"
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="RUT"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Correo"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                name="rol"
                value={form.rol}
                label="Rol"
                onChange={handleChange}
              >
                {roles.map((r) => (
                  <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="sucursal-label">Sucursal</InputLabel>
              <Select
                labelId="sucursal-label"
                name="sucursalId"
                value={form.sucursalId}
                label="Sucursal"
                onChange={handleChange}
              >
                {sucursales.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nombre} ({s.ciudad})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && (
              <Typography color="error" sx={{ mt: 2, mb: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2, fontWeight: 700, fontSize: '1.1em', py: 1.5 }}
              disabled={sending}
            >
              {sending ? 'Creando...' : 'Crear empleado'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}