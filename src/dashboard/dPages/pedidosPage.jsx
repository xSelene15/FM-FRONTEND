import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Collapse,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [itemsPedido, setItemsPedido] = useState({}); // Almacenar items por ID de pedido
  const [loadingItems, setLoadingItems] = useState({}); // Estado de carga por pedido
  const navigate = useNavigate();

  const estadosPedido = [
    { value: 'PENDIENTE', label: 'Pendiente', color: 'warning' },
    { value: 'EN_PROCESO', label: 'En Proceso', color: 'info' },
    { value: 'COMPLETADO', label: 'Completado', color: 'success' },
    { value: 'CANCELADO', label: 'Cancelado', color: 'error' }
  ];

  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = () => {
    fetch('http://34.204.114.72:8080/api/pedidos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPedidos(data);
        } else {
          console.error('Los datos recibidos no son un array:', data);
          setPedidos([]);
        }
      })
      .catch(error => {
        console.error('Error al cargar pedidos:', error);
        setPedidos([]);
      });
  };

  // Función para cargar items de un pedido específico
  const fetchItemsPedido = async (pedidoId) => {
    if (itemsPedido[pedidoId]) {
      // Si ya tenemos los items, no los volvemos a cargar
      return;
    }

    setLoadingItems(prev => ({ ...prev, [pedidoId]: true }));
    
    try {
      const response = await fetch(`http://34.204.114.72:8080/api/itempedidos/pedido/${pedidoId}`);
      if (response.ok) {
        const items = await response.json();
        setItemsPedido(prev => ({ ...prev, [pedidoId]: items }));
      } else {
        console.error('Error al cargar items del pedido:', response.statusText);
        setItemsPedido(prev => ({ ...prev, [pedidoId]: [] }));
      }
    } catch (error) {
      console.error('Error al cargar items del pedido:', error);
      setItemsPedido(prev => ({ ...prev, [pedidoId]: [] }));
    } finally {
      setLoadingItems(prev => ({ ...prev, [pedidoId]: false }));
    }
  };

  // Función para calcular el total de los items del pedido - ACTUALIZADA
  const calcularTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
      // Usar precioActual del producto y cantidad del item
      if (item.producto?.precioActual && item.cantidad) {
        return total + (Number(item.producto.precioActual) * Number(item.cantidad));
      }
      return total;
    }, 0);
  };

  // Función auxiliar para obtener el nombre completo del cliente
  const getClienteName = (cliente) => {
    if (!cliente) return 'Sin cliente';
    if (typeof cliente === 'string') return cliente;
    if (typeof cliente === 'object') {
      const nombre = cliente.nombre || '';
      const apellidoPat = cliente.apellidoPat || '';
      const apellidoMat = cliente.apellidoMat || '';
      return `${nombre} ${apellidoPat} ${apellidoMat}`.trim() || cliente.correo || 'Sin nombre';
    }
    return 'Sin cliente';
  };

  // Función auxiliar para obtener texto de búsqueda del cliente
  const getClienteSearchText = (cliente) => {
    if (!cliente) return '';
    if (typeof cliente === 'string') return cliente.toLowerCase();
    if (typeof cliente === 'object') {
      const searchableText = [
        cliente.nombre,
        cliente.apellidoPat,
        cliente.apellidoMat,
        cliente.correo,
        cliente.rut
      ].filter(Boolean).join(' ');
      return searchableText.toLowerCase();
    }
    return '';
  };

  // Filtrar pedidos por búsqueda con validaciones
  const filteredPedidos = pedidos.filter(pedido => {
    if (!pedido) return false;
    
    const id = pedido.id ? pedido.id.toString() : '';
    const clienteText = getClienteSearchText(pedido.cliente);
    const estado = pedido.estado ? pedido.estado.toLowerCase() : '';
    const searchTerm = search.toLowerCase();
    
    return id.includes(searchTerm) || 
           clienteText.includes(searchTerm) || 
           estado.includes(searchTerm);
  });

  // Manejar edición - MODIFICADO para mantener datos originales
  const handleEditClick = (pedido) => {
    if (!pedido) return;
    
    setEditId(pedido.id);
    setEditForm({
      estado: pedido.estado || 'PENDIENTE',
      // Mantener los datos originales del pedido
      id: pedido.id,
      fecha: pedido.fecha,
      cliente: pedido.cliente,
      total: pedido.total
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    // Solo permitir cambiar el estado
    if (name === 'estado') {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAcceptEdit = async (id) => {
    try {
      // Encontrar el pedido completo para mantener todos los datos
      const pedidoCompleto = pedidos.find(p => p.id === id);
      
      if (!pedidoCompleto) {
        setSnackbarMessage('Error: No se encontró el pedido');
        setSnackbarOpen(true);
        return;
      }

      // Crear el objeto completo manteniendo todos los datos originales
      const updateData = {
        id: pedidoCompleto.id,
        fecha: pedidoCompleto.fecha,
        cliente: pedidoCompleto.cliente,
        total: pedidoCompleto.total,
        estado: editForm.estado // Solo cambiar el estado
      };
      
      const response = await fetch(`http://34.204.114.72:8080/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        fetchPedidos();
        setEditId(null);
        setEditForm({});
        setSnackbarMessage('Estado del pedido modificado correctamente');
        setSnackbarOpen(true);
      } else {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        setSnackbarMessage('Error al modificar el pedido');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      setSnackbarMessage('Error al modificar el pedido');
      setSnackbarOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  // Manejar eliminación
  const handleDeleteClick = (pedido) => {
    if (!pedido) return;
    setPedidoToDelete(pedido);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPedidoToDelete(null);
  };

  const handleDeleteAccept = async () => {
    if (!pedidoToDelete) return;
    try {
      await fetch(`http://34.204.114.72:8080/api/pedidos/${pedidoToDelete.id}`, {
        method: 'DELETE',
      });
      fetchPedidos();
      setDeleteDialogOpen(false);
      setPedidoToDelete(null);
      setSnackbarMessage('Pedido eliminado correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      setSnackbarMessage('Error al eliminar el pedido');
      setSnackbarOpen(true);
    }
  };

  // Manejar expansión de filas para ver detalles
  const handleRowExpand = (pedidoId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(pedidoId)) {
      newExpanded.delete(pedidoId);
    } else {
      newExpanded.add(pedidoId);
      // Cargar items cuando se expande la fila
      fetchItemsPedido(pedidoId);
    }
    setExpandedRows(newExpanded);
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estadosPedido.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getEstadoLabel = (estado) => {
    const estadoObj = estadosPedido.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado || 'Sin estado';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('es-CL');
    } catch (error) {
      return '-';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '$0';
    try {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(amount);
    } catch (error) {
      return `$${amount}`;
    }
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
            Gestión de Pedidos Ferremas
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Buscar por ID, cliente, RUT, correo o estado"
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, maxWidth: 400, background: 'white' }}
            />
            <Box sx={{ flex: 1 }} />
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 1400,
              maxHeight: 600,
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
                  <TableCell sx={{ minWidth: 250 }}><b>Cliente</b></TableCell>
                  <TableCell><b>Fecha</b></TableCell>
                  <TableCell><b>Estado</b></TableCell>
                  <TableCell><b>Total</b></TableCell>
                  <TableCell align="center"><b>Acciones</b></TableCell>
                  <TableCell align="center" sx={{ width: 80 }}><b>Detalles</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPedidos.map((pedido) => {
                  if (!pedido || !pedido.id) return null;
                  
                  return (
                    <React.Fragment key={pedido.id}>
                      <TableRow>
                        <TableCell>{pedido.id}</TableCell>
                        <TableCell>
                          {editId === pedido.id ? (
                            <Typography variant="body2">
                              {getClienteName(pedido.cliente)}
                            </Typography>
                          ) : (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {getClienteName(pedido.cliente)}
                              </Typography>
                              {pedido.cliente?.correo && (
                                <Typography variant="caption" color="text.secondary">
                                  {pedido.cliente.correo}
                                </Typography>
                              )}
                              {pedido.cliente?.rut && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  RUT: {pedido.cliente.rut}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(pedido.fecha)}
                        </TableCell>
                        <TableCell>
                          {editId === pedido.id ? (
                            // Solo mostrar el selector de estado en modo edición
                            <FormControl fullWidth size="small">
                              <Select
                                name="estado"
                                value={editForm.estado || 'PENDIENTE'}
                                onChange={handleEditFormChange}
                              >
                                {estadosPedido.map((estado) => (
                                  <MenuItem key={estado.value} value={estado.value}>
                                    {estado.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Chip
                              label={getEstadoLabel(pedido.estado)}
                              color={getEstadoColor(pedido.estado)}
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {editId === pedido.id ? (
                            // Mostrar total calculado en modo edición (no editable)
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {itemsPedido[pedido.id] 
                                  ? formatCurrency(calcularTotalItems(itemsPedido[pedido.id]))
                                  : formatCurrency(pedido.total)
                                }
                              </Typography>
                            </Box>
                          ) : (
                            // Mostrar total calculado en lugar del total original
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {itemsPedido[pedido.id] 
                                  ? formatCurrency(calcularTotalItems(itemsPedido[pedido.id]))
                                  : formatCurrency(pedido.total)
                                }
                              </Typography>
                              {itemsPedido[pedido.id] && pedido.total && 
                               calcularTotalItems(itemsPedido[pedido.id]) !== pedido.total && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Original: {formatCurrency(pedido.total)}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editId === pedido.id ? (
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleAcceptEdit(pedido.id)}
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
                              <IconButton color="primary" size="small" onClick={() => handleEditClick(pedido)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton color="error" size="small" onClick={() => handleDeleteClick(pedido)}>
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleRowExpand(pedido.id)}
                          >
                            {expandedRows.has(pedido.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                          <Collapse in={expandedRows.has(pedido.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600 }}>
                                Detalles del Pedido
                              </Typography>
                              
                              {/* Información del cliente */}
                              {pedido.cliente && (
                                <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Información del Cliente:
                                  </Typography>
                                  <Typography variant="body2">
                                    <b>Nombre:</b> {getClienteName(pedido.cliente)}
                                  </Typography>
                                  <Typography variant="body2">
                                    <b>RUT:</b> {pedido.cliente.rut || 'No especificado'}
                                  </Typography>
                                  <Typography variant="body2">
                                    <b>Correo:</b> {pedido.cliente.correo || 'No especificado'}
                                  </Typography>
                                  <Typography variant="body2">
                                    <b>Teléfono:</b> {pedido.cliente.telefono || 'No especificado'}
                                  </Typography>
                                  <Typography variant="body2">
                                    <b>Dirección:</b> {pedido.cliente.direccion || 'No especificada'}
                                  </Typography>
                                  <Typography variant="body2">
                                    <b>Ciudad:</b> {pedido.cliente.ciudad || 'No especificada'}
                                  </Typography>
                                </Box>
                              )}

                              {/* Items del pedido - SIMPLIFICADO */}
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Items del pedido:
                                </Typography>
                                {loadingItems[pedido.id] ? (
                                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                      Cargando items...
                                    </Typography>
                                  </Box>
                                ) : itemsPedido[pedido.id] && itemsPedido[pedido.id].length > 0 ? (
                                  <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1 }}>
                                    {itemsPedido[pedido.id].map((item, index) => (
                                      <Box key={item.id || index} sx={{ mb: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          <b>Código:</b> {item.producto?.codProducto || 'Sin código'}
                                        </Typography>
                                        <Typography variant="body2">
                                          <b>Producto:</b> {item.producto?.nombre || 'Nombre no disponible'}
                                        </Typography>
                                        <Typography variant="body2">
                                          <b>Cantidad:</b> {item.cantidad || 0}
                                        </Typography>
                                      </Box>
                                    ))}
                                    {/* Total calculado - ACTUALIZADO */}
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1, textAlign: 'right' }}>
                                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                                        Total: {formatCurrency(calcularTotalItems(itemsPedido[pedido.id]))}
                                      </Typography>
                                      {pedido.total && calcularTotalItems(itemsPedido[pedido.id]) !== pedido.total && (
                                        <Typography variant="body2" color="text.secondary">
                                          Total original: {formatCurrency(pedido.total)}
                                        </Typography>
                                      )}
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        Total de items: {itemsPedido[pedido.id].length}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No hay items disponibles para este pedido.
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
                {filteredPedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay pedidos registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'warning.light',
            color: 'warning.contrastText',
            borderRadius: 4,
            border: '3px solid #ff9800',
            boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.25)',
            textAlign: 'center',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 700 }}>
          <WarningAmberIcon sx={{ fontSize: 60, color: 'warning.dark', mb: 1 }} />
          ¿Está seguro que desea eliminar este pedido?
        </DialogTitle>
        <DialogContent>
          {pedidoToDelete && (
            <Box sx={{ my: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Pedido #{pedidoToDelete.id}
              </Typography>
              <Typography variant="body1">
                Cliente: <b>{getClienteName(pedidoToDelete.cliente)}</b>
              </Typography>
              {pedidoToDelete.cliente?.correo && (
                <Typography variant="body2" color="text.secondary">
                  Correo: {pedidoToDelete.cliente.correo}
                </Typography>
              )}
              {pedidoToDelete.cliente?.rut && (
                <Typography variant="body2" color="text.secondary">
                  RUT: {pedidoToDelete.cliente.rut}
                </Typography>
              )}
              <Typography variant="body1">
                Estado: <b>{getEstadoLabel(pedidoToDelete.estado)}</b>
              </Typography>
              <Typography variant="body1">
                Total: <b>
                  {itemsPedido[pedidoToDelete.id] 
                    ? formatCurrency(calcularTotalItems(itemsPedido[pedidoToDelete.id]))
                    : formatCurrency(pedidoToDelete.total)
                  }
                </b>
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: 'warning.dark', mt: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccept}
            sx={{ fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1em' }}
          >
            Aceptar
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleDeleteCancel}
            sx={{ fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1em', ml: 2 }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}