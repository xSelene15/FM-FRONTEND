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

  // Función para obtener los datos completos de una consulta por ID
  const fetchConsultaById = async (consultaId) => {
    try {
      const response = await fetch(`http://34.204.114.72:8080/api/consultas/${consultaId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la consulta');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener consulta por ID:', error);
      throw error;
    }
  };

  const generateEmailHTML = (consulta, respuesta) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Respuesta a su consulta - FERREMAS</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #040b4b 0%, #67aad6 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #040b4b 0%, #67aad6 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">
                    🔧 FERREMAS
                </h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                    Su ferretería de confianza
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #040b4b; margin: 0 0 20px 0; font-size: 24px;">
                    Respuesta a su consulta
                </h2>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #67aad6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                    <h3 style="color: #040b4b; margin: 0 0 10px 0; font-size: 18px;">
                        Detalles de su consulta:
                    </h3>
                    <p style="margin: 5px 0; color: #333;"><strong>ID de consulta:</strong> ${consulta.id}</p>
                    <p style="margin: 5px 0; color: #333;"><strong>Título:</strong> ${consulta.mensaje}</p>
                    <p style="margin: 5px 0; color: #333;"><strong>Su mensaje:</strong></p>
                    <p style="margin: 10px 0; color: #555; font-style: italic; background: white; padding: 15px; border-radius: 5px;">
                        "${consulta.mensajeCliente}"
                    </p>
                </div>
                
                <div style="background: linear-gradient(135deg, #040b4b 0%, #67aad6 100%); color: white; padding: 25px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px;">
                        📝 Nuestra respuesta:
                    </h3>
                    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 6px; border-left: 4px solid white;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                            ${respuesta}
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #555; margin: 0 0 15px 0;">
                        ¿Necesita más ayuda? No dude en contactarnos nuevamente.
                    </p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0; color: #333;"><strong>📧 Email:</strong> contacto@ferremas.cl</p>
                        <p style="margin: 5px 0; color: #333;"><strong>📞 Teléfono:</strong> +56 2 1234 5678</p>
                        <p style="margin: 5px 0; color: #333;"><strong>🕒 Horario:</strong> Lunes a Viernes 9:00 - 18:00</p>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #040b4b; color: white; padding: 25px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
                    Gracias por confiar en FERREMAS
                </p>
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">
                    Su consulta ha sido marcada como resuelta. Este correo fue generado automáticamente.
                </p>
                <div style="margin: 15px 0 0 0; padding: 15px 0; border-top: 1px solid rgba(255,255,255,0.2);">
                    <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        © ${new Date().getFullYear()} FERREMAS - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  const sendEmailToClient = async (consultaId, respuesta) => {
    try {
      // 1. Obtener los datos completos de la consulta por ID
      const consultaCompleta = await fetchConsultaById(consultaId);
      
      // 2. Usar el campo 'correo' del response
      const emailData = {
        to: consultaCompleta.correo,
        subject: `Respuesta a su consulta con id: ${consultaCompleta.id}`,
        body: generateEmailHTML(consultaCompleta, respuesta)
      };

      console.log('Enviando email a:', consultaCompleta.correo);

      const response = await fetch('http://34.204.114.72:8080/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el email');
      }

      console.log('Email enviado exitosamente al cliente:', consultaCompleta.correo);
    } catch (error) {
      console.error('Error al enviar email:', error);
      // Relanzar el error para que pueda ser manejado por la función que llama
      throw error;
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
      // 1. Enviar respuesta a la API
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

      // 2. Enviar email al cliente usando el ID de la consulta
      await sendEmailToClient(selectedConsulta.id, respuestaVendedor.trim());

      setSnackbar({
        open: true,
        message: 'Respuesta enviada exitosamente. Se ha enviado un email al cliente.',
        severity: 'success'
      });

      fetchConsultas(); // Recargar la lista
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al enviar la respuesta. Intente nuevamente.';
      
      // Si el error es específicamente del email, personalizar el mensaje
      if (error.message.includes('email')) {
        errorMessage = 'Respuesta guardada, pero hubo un error al enviar el email al cliente.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResolved = async (consulta) => {
    setLoading(true);
    try {
      const respuestaAutomatica = 'Consulta procesada y resuelta.';
      
      // 1. Marcar como resuelto
      const response = await fetch(`http://34.204.114.72:8080/api/consultas/${consulta.id}/respuesta`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          respuestaVendedor: respuestaAutomatica
        }),
      });

      if (!response.ok) {
        throw new Error('Error al marcar como resuelto');
      }

      // 2. Enviar email al cliente usando el ID de la consulta
      await sendEmailToClient(consulta.id, respuestaAutomatica);

      setSnackbar({
        open: true,
        message: 'Consulta marcada como resuelta. Se ha enviado un email al cliente.',
        severity: 'success'
      });

      fetchConsultas();
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al marcar como resuelta';
      
      // Si el error es específicamente del email, personalizar el mensaje
      if (error.message.includes('email')) {
        errorMessage = 'Consulta marcada como resuelta, pero hubo un error al enviar el email al cliente.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
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
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Al enviar la respuesta, la consulta se marcará automáticamente como resuelta y se enviará un email al cliente.
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