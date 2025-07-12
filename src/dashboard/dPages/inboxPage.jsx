import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useMessages } from '../../context/MessagesContext';

export default function InboxPage() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // 'view' o 'edit'
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [respuestaVendedor, setRespuestaVendedor] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://34.204.114.72:8080/api/consultas');
      if (!response.ok) {
        throw new Error('Error al obtener las consultas');
      }
      const data = await response.json();
      setConsultas(data);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las consultas',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewConsulta = (consulta) => {
    setSelectedConsulta(consulta);
    setDialogMode('view');
    setOpenDialog(true);
  };

  const handleEditConsulta = (consulta) => {
    setSelectedConsulta(consulta);
    setRespuestaVendedor(consulta.respuestaVendedor || '');
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedConsulta(null);
    setRespuestaVendedor('');
  };

  const handleSaveResponse = async () => {
    if (!selectedConsulta || !respuestaVendedor.trim()) {
      setSnackbar({
        open: true,
        message: 'Debe escribir una respuesta antes de enviar',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://34.204.114.72:8080/api/consultas/${selectedConsulta.id}/respuesta`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          respuestaVendedor: respuestaVendedor.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la respuesta');
      }

      setSnackbar({
        open: true,
        message: 'Respuesta enviada exitosamente. Consulta marcada como resuelta.',
        severity: 'success'
      });

      fetchConsultas(); // Recargar la lista
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar la respuesta. Intente nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResolved = async (consulta) => {
    // Como solo tienes el endpoint para responder, podrías enviar una respuesta automática
    // o eliminar esta función si no es necesaria
    setLoading(true);
    try {
      const response = await fetch(`http://34.204.114.72:8080/api/consultas/${consulta.id}/respuesta`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          respuestaVendedor: 'Consulta procesada y resuelta.'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al marcar como resuelto');
      }

      setSnackbar({
        open: true,
        message: 'Consulta marcada como resuelta',
        severity: 'success'
      });

      fetchConsultas();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error al marcar como resuelta',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Gestión de Consultas
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>{consulta.id}</TableCell>
                    <TableCell>{consulta.clienteCorreo || consulta.clienteRut || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {consulta.mensaje}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(consulta.fecha)}</TableCell>
                    <TableCell>
                      <Chip
                        label={consulta.resuelto ? 'Resuelto' : 'Pendiente'}
                        color={consulta.resuelto ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewConsulta(consulta)}
                        size="small"
                        title="Ver detalles"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {!consulta.resuelto && (
                        <IconButton
                          onClick={() => handleEditConsulta(consulta)}
                          size="small"
                          title="Responder"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {!consulta.resuelto && (
                        <IconButton
                          onClick={() => handleMarkAsResolved(consulta)}
                          size="small"
                          title="Marcar como resuelto"
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={consultas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Dialog para ver/editar consulta */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'view' ? 'Detalles de la Consulta' : 'Responder Consulta'}
        </DialogTitle>
        <DialogContent>
          {selectedConsulta && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información del Cliente
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {selectedConsulta.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Cliente:</strong> {selectedConsulta.clienteCorreo || selectedConsulta.clienteRut || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Fecha:</strong> {formatDate(selectedConsulta.fecha)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Estado:</strong> {selectedConsulta.resuelto ? 'Resuelto' : 'Pendiente'}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Mensaje del Cliente
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Título:</strong> {selectedConsulta.mensaje}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Mensaje:</strong> {selectedConsulta.mensajeCliente}
              </Typography>

              {dialogMode === 'edit' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Respuesta del Vendedor
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={respuestaVendedor}
                    onChange={(e) => setRespuestaVendedor(e.target.value)}
                    placeholder="Escriba su respuesta aquí..."
                    variant="outlined"
                    required
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Al enviar la respuesta, la consulta se marcará automáticamente como resuelta.
                  </Typography>
                </Box>
              )}

              {dialogMode === 'view' && selectedConsulta.respuestaVendedor && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Respuesta del Vendedor
                  </Typography>
                  <Typography variant="body1">
                    {selectedConsulta.respuestaVendedor}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          {dialogMode === 'edit' && (
            <Button
              onClick={handleSaveResponse}
              variant="contained"
              disabled={loading || !respuestaVendedor.trim()}
            >
              {loading ? 'Enviando...' : 'Enviar Respuesta'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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