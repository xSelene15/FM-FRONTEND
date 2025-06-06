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
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://34.204.114.72:8080/api/productos';

const initialForm = {
  nombre: '',
  descripcion: '',
  marca: '',
  stock: 0,
  imagenUrl: '',
  categoriaId: 0,
  subCategoriaId: 0,
  precioActual: 0,
};

export default function MantenedorPage() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subCategorias, setSubCategorias] = useState([]);

  // Obtener productos
  const fetchProductos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
    fetch('http://34.204.114.72:8080/api/categorias')
      .then(res => res.json())
      .then(setCategorias);
    fetch('http://34.204.114.72:8080/api/subcategorias')
      .then(res => res.json())
      .then(setSubCategorias);
  }, []);

  // Crear o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Editar
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      // Crear
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(initialForm);
    setEditId(null);
    fetchProductos();
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchProductos();
  };

  // Editar producto (cargar en formulario)
  const handleEdit = (producto) => {
    setForm(producto);
    setEditId(producto.id);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Filtrar productos por nombre, marca o descripción
  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.marca.toLowerCase().includes(search.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  // Funciones para obtener el nombre por ID
  const getCategoriaNombre = (id) => {
    const cat = categorias.find(c => c.id === id);
    return cat ? cat.nombre : id;
  };
  const getSubCategoriaNombre = (id) => {
    const sub = subCategorias.find(s => s.id === id);
    return sub ? sub.nombre : id;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
            Mantenedor de Productos
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Buscar producto por nombre, marca o descripción
          </Typography>
          <TextField
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 2, width: 300, background: 'white' }}
          />
          <Divider sx={{ mb: 2 }} />
          <form
            onSubmit={handleSubmit}
            style={{
              marginBottom: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              maxWidth: 'auto'
            }}
          >
            <TextField name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} required sx={{ minWidth: 120, background: 'white' }} />
            <TextField name="descripcion" label="Descripción" value={form.descripcion} onChange={handleChange} required sx={{ minWidth: 120, background: 'white' }} />
            <TextField name="marca" label="Marca" value={form.marca} onChange={handleChange} required sx={{ minWidth: 100, background: 'white' }} />
            <TextField name="stock" type="number" label="Stock" value={form.stock} onChange={handleChange} required sx={{ width: 70, background: 'white' }} />
            <TextField name="imagenUrl" label="Imagen URL" value={form.imagenUrl} onChange={handleChange} sx={{ minWidth: 120, background: 'white' }} />
            <TextField name="categoriaId" type="number" label="Categoría ID" value={form.categoriaId} onChange={handleChange} required sx={{ width: 90, background: 'white' }} />
            <TextField name="subCategoriaId" type="number" label="SubCategoría ID" value={form.subCategoriaId} onChange={handleChange} required sx={{ width: 110, background: 'white' }} />
            <TextField
              name="precioActual"
              type="number"
              label="Precio"
              value={form.precioActual}
              onChange={handleChange}
              required
              sx={{ width: 90, background: 'white' }}
            />
            <Button type="submit" variant="contained" color="success" sx={{ height: 56 }}>
              {editId ? 'Actualizar' : 'Crear'}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                sx={{ height: 56 }}
                onClick={() => { setForm(initialForm); setEditId(null); }}
              >
                Cancelar
              </Button>
            )}
          </form>
        </Paper>
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 1200,
            maxHeight: 427,
            overflowY: 'auto',
            boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.15)',
            border: '0.3px solid #000000'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Código Producto</b></TableCell>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Descripción</b></TableCell>
                <TableCell><b>Marca</b></TableCell>
                <TableCell><b>Stock</b></TableCell>
                <TableCell><b>Imagen</b></TableCell>
                <TableCell><b>Categoría</b></TableCell>
                <TableCell><b>SubCategoría</b></TableCell>
                <TableCell><b>Precio</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.codProducto}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>{p.marca}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    {p.imagenUrl && (
                      <img src={p.imagenUrl} alt={p.nombre} width={50} style={{ borderRadius: 4 }} />
                    )}
                  </TableCell>
                  <TableCell>{getCategoriaNombre(p.categoriaId)}</TableCell>
                  <TableCell>{getSubCategoriaNombre(p.subCategoriaId)}</TableCell>
                  <TableCell>{p.precioActual}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(p)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(p.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProductos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No hay productos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}