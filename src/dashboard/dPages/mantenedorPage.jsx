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
  Divider,
  Checkbox,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';

const API_URL = 'http://34.204.114.72:8080/api/productos';

const initialForm = {
  nombre: '',
  descripcion: '',
  marca: '',
  stock: 0,
  imagenUrl: '',
  categoriaId: 0,
  subCategoriaId: '',
  precio: 0,
  oferta: false, // <-- nuevo campo
};

export default function MantenedorPage() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subCategorias, setSubCategorias] = useState([]);
  const [subCatDisabled, setSubCatDisabled] = useState(true);
  const [stockError, setStockError] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  // Obtener productos
  const fetchProductos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    fetch('http://34.204.114.72:8080/api/categorias')
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        if (data.length > 0) {
          setForm(f => ({ ...f, categoriaId: data[0].id }));
        }
      });
  }, []);

  useEffect(() => {
    if (form.categoriaId && Number(form.categoriaId) !== 0) {
      fetch(`http://34.204.114.72:8080/api/subcategorias/categoria/${form.categoriaId}`)
        .then(res => res.json())
        .then(data => {
          setSubCategorias(data);
          setSubCatDisabled(!data || data.length === 0);
          setForm(f => ({
            ...f,
            subCategoriaId: (!data || data.length === 0) ? '' : data[0].id // <--- string vacío si no hay subcats
          }));
        });
    } else {
      setSubCategorias([]);
      setSubCatDisabled(true);
      setForm(f => ({ ...f, subCategoriaId: '' })); // <--- string vacío
    }
  }, [form.categoriaId]);

  // Crear o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      categoriaId: Number(form.categoriaId),
      subCategoriaId: form.subCategoriaId === '' ? null : Number(form.subCategoriaId),
      stock: Number(form.stock),
      precio: Number(form.precio),
    };

    if (editId) {
      await fetch(`${API_URL}/codigo/${payload.codProducto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setToastMsg('Producto editado con éxito');
      setToastOpen(true);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setToastMsg('Producto creado con éxito');
      setToastOpen(true);
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
    setForm({
      ...producto,
      precio: producto.precio, // usa solo precio
    });
    setEditId(producto.id);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stock") {
      const num = Number(value);
      setStockError(num < 0);
      setForm({ ...form, stock: num < 0 ? 0 : num });
    } else if (name === "categoriaId") {
      setForm({ ...form, categoriaId: value, subCategoriaId: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
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
            <TextField
              name="stock"
              type="number"
              label="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              sx={{ width: 70, background: 'white' }}
              inputProps={{ min: 0 }}
              error={stockError}
              helperText={stockError ? "El stock no puede ser menor a 0" : ""}
            />
            <TextField name="imagenUrl" label="Imagen URL" value={form.imagenUrl} onChange={handleChange} sx={{ minWidth: 120, background: 'white' }} />
            <TextField
              select
              name="categoriaId"
              label="Categoría"
              value={form.categoriaId}
              onChange={handleChange}
              required
              sx={{ width: 150, background: 'white' }}
            >
              <MenuItem value={0} disabled>Seleccione una categoría</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="subCategoriaId"
              label="SubCategoría"
              value={form.subCategoriaId}
              onChange={handleChange}
              required
              sx={{ width: 150, background: 'white' }}
              disabled={subCatDisabled}
            >
              <MenuItem value="" disabled>
                {subCatDisabled
                  ? 'No hay subcategorías'
                  : 'Seleccione una subcategoría'}
              </MenuItem>
              {subCategorias.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="precio"
              type="number"
              label="Precio"
              value={form.precio}
              onChange={handleChange}
              required
              sx={{ width: 90, background: 'white' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.oferta}
                  onChange={e => setForm({ ...form, oferta: e.target.checked })}
                  name="oferta"
                  color="primary"
                />
              }
              label="Oferta"
              sx={{ alignSelf: 'center' }}
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
                onClick={() => {
                  setForm(f => ({
                    ...initialForm,
                    categoriaId: categorias.length > 0 ? categorias[0].id : 0,
                    subCategoriaId: '',
                  }));
                  setEditId(null);
                  if (categorias.length > 0) {
                    fetch(`http://34.204.114.72:8080/api/subcategorias/categoria/${categorias[0].id}`)
                      .then(res => res.json())
                      .then(data => {
                        setSubCategorias(data);
                        setSubCatDisabled(!data || data.length === 0);
                      });
                  } else {
                    setSubCategorias([]);
                    setSubCatDisabled(true);
                  }
                }}
              >
                Cancelar
              </Button>
            )}
          </form>

        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
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
          <TableContainer
            component={Paper}
            sx={{
              maxWidth: 1200,
              maxHeight: 427,
              overflowY: 'auto',
              boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.15)',
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
                  <TableCell><b>Oferta</b></TableCell>
                  <TableCell align="center"><b>Acciones</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{filteredProductos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.codProducto}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>{p.marca}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    {p.imagenUrl &&
                      (<img src={p.imagenUrl} alt={p.nombre} width={50} style={{ borderRadius: 4 }} />)}
                  </TableCell>
                  <TableCell>{getCategoriaNombre(p.categoriaId)}</TableCell>
                  <TableCell>{getSubCategoriaNombre(p.subCategoriaId)}</TableCell>
                  <TableCell>{p.precioActual}</TableCell>
                  <TableCell>{p.oferta ? 'Sí' : 'No'}</TableCell>
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
                    <TableCell colSpan={11} align="center">No hay productos registrados.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          message={toastMsg}
        />
      </Box>
    </Box>
  );
}