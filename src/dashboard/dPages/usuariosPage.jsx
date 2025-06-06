import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const roles = [
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'BODEGUERO', label: 'Bodeguero' },
  { value: 'AUDITOR', label: 'Auditor' }
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [sucursales, setSucursales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://34.204.114.72:8080/api/empleados')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]));
    fetch('http://34.204.114.72:8080/api/sucursales')
      .then(res => res.json())
      .then(data => setSucursales(data))
      .catch(() => setSucursales([]));
  }, []);

  // Filtrado por nombre o rut
  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
      u.rut.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (usuario) => {
    setEditId(usuario.id);
    setEditForm({
      nombreCompleto: usuario.nombreCompleto,
      rut: usuario.rut,
      correo: usuario.correo,
      rol: usuario.rol,
      sucursalId: usuario.sucursal ? usuario.sucursal.id : ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleAcceptEdit = async (id) => {
    // Aquí puedes hacer el fetch para actualizar el usuario en la API si lo deseas
    const payload = {
      ...editForm,
      sucursal: { id: Number(editForm.sucursalId) }
    };
    await fetch(`http://34.204.114.72:8080/api/empleados/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // Refresca la lista
    fetch('http://34.204.114.72:8080/api/empleados')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]));
    setEditId(null);
    setEditForm({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 1400, width: '100%', mx: 'auto' }}>
        <Paper
          elevation={8}
          sx={{
            p: 3,
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
            Mantenedor de usuarios Ferremas
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Buscar por RUT o nombre"
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, maxWidth: 350, background: 'white' }}
            />
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              sx={{ fontWeight: 700, fontSize: '1rem', px: 3, py: 1, ml: 2 }}
              onClick={() => navigate('/dashboard/usuarios/crear')}
            >
              Agregar usuario
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 1400,
              maxHeight: 427,
              overflowY: 'auto',
              boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.15)',
              border: '0.3px solid #000000',
              mx: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}><b>ID</b></TableCell>
                  <TableCell sx={{ minWidth: 200, width: 250 }}><b>Nombre Completo</b></TableCell>
                  <TableCell sx={{ minWidth: 100, width: 120 }}><b>RUT</b></TableCell>
                  <TableCell><b>Correo</b></TableCell>
                  <TableCell><b>Rol</b></TableCell>
                  <TableCell sx={{ minWidth: 100, width: 200 }} > <b>Sucursal</b></TableCell>
                  <TableCell align="center"><b>Acciones</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.id}</TableCell>
                    <TableCell sx={{ minWidth: 220, width: 280 }}>
                      {editId === usuario.id ? (
                        <TextField
                          name="nombreCompleto"
                          value={editForm.nombreCompleto}
                          onChange={handleEditFormChange}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        usuario.nombreCompleto
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 90, width: 110 }}>
                      {editId === usuario.id ? (
                        <TextField
                          name="rut"
                          value={editForm.rut}
                          onChange={handleEditFormChange}
                          size="small"
                          fullWidth
                          disabled // <-- RUT no modificable
                        />
                      ) : (
                        usuario.rut
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === usuario.id ? (
                        <TextField
                          name="correo"
                          value={editForm.correo}
                          onChange={handleEditFormChange}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        usuario.correo
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === usuario.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            name="rol"
                            value={editForm.rol}
                            onChange={handleEditFormChange}
                          >
                            {roles.map((r) => (
                              <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        usuario.rol
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === usuario.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            name="sucursalId"
                            value={editForm.sucursalId}
                            onChange={handleEditFormChange}
                          >
                            {sucursales.map((s) => (
                              <MenuItem key={s.id} value={s.id}>
                                {s.nombre} ({s.ciudad})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        usuario.sucursal
                          ? `${usuario.sucursal.nombre} (${usuario.sucursal.ciudad})`
                          : 'Sin sucursal'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {editId === usuario.id ? (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleAcceptEdit(usuario.id)}
                          >
                            Aceptar
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </Button>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton color="primary" size="small" onClick={() => handleEditClick(usuario)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsuarios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay usuarios registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}