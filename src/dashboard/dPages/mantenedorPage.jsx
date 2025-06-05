import React, { useEffect, useState } from 'react';

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
  const [search, setSearch] = useState(''); // <-- Estado para el buscador

  // Obtener productos
  const fetchProductos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
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
      console.log('Enviando producto:', form);
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

  return (
    <div>
      <h2>Mantenedor de Productos</h2>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre, marca o descripción"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="imagenUrl" placeholder="Imagen URL" value={form.imagenUrl} onChange={handleChange} />
        <input name="categoriaId" type="number" placeholder="Categoría ID" value={form.categoriaId} onChange={handleChange} required />
        <input name="subCategoriaId" type="number" placeholder="SubCategoría ID" value={form.subCategoriaId} onChange={handleChange} required />
        <input
          name="precioActual"
          type="number"
          placeholder="Precio"
          value={form.precioActual}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button type="button" onClick={() => { setForm(initialForm); setEditId(null); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Código Producto</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Categoría</th>
            <th>SubCategoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map((p) => (
            <tr key={p.id}>
              <td>{p.codProducto}</td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.marca}</td>
              <td>{p.stock}</td>
              <td><img src={p.imagenUrl} alt={p.nombre} width={50} /></td>
              <td>{p.categoriaId}</td>
              <td>{p.subCategoriaId}</td>
              <td>{p.precioActual}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}