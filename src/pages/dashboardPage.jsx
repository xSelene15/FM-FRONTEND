import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline,
  Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, IconButton, Toolbar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 220;

const summaryData = [
  { label: 'Ventas', value: '$12,500', icon: <ShoppingCartIcon color="primary" /> },
  { label: 'Clientes', value: '320', icon: <PeopleIcon color="primary" /> },
  { label: 'Pedidos', value: '87', icon: <DashboardIcon color="primary" /> },
];

const orders = [
  { id: 1, cliente: 'Juan Pérez', total: '$120', estado: 'Completado' },
  { id: 2, cliente: 'Ana Gómez', total: '$80', estado: 'Pendiente' },
  { id: 3, cliente: 'Carlos Ruiz', total: '$200', estado: 'Enviado' },
];

export default function DashboardPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <List>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Resumen" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Clientes" />
      </ListItem>
    </List>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <CssBaseline />
      {/* Drawer permanente en desktop, temporal en mobile */}
      <Drawer
        variant={isSm ? 'temporary' : 'permanent'}
        anchor="left"
        open={isSm ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isSm ? 0 : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: isSm ? 0 : 64, // 0 en mobile para que empiece desde arriba, 64 en desktop
            left: 0,
            height: isSm ? '100%' : 'calc(100% - 64px)',
            position: isSm ? 'fixed' : 'fixed',
            zIndex: 1200,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6f8',
          p: { xs: 1, sm: 2, md: 3 },
          ml: isSm ? 0 : `${drawerWidth}px`,
          mt: { xs: '56px', sm: '64px' },
          display: 'flex',
          justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'center' },
          alignItems: 'flex-start',
          minHeight: { xs: 'auto', sm: 'calc(100vh - 64px)' },
          width: '100vw',
          overflowX: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 700, md: 900, lg: 1100 },
            mx: { xs: 0, sm: 2, md: 'auto' },
            position: 'relative'
          }}
        >
          {/* Header con botón y título alineados */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              mt: 1,
            }}
          >
            <Typography variant="h6" noWrap component="div">
              Dashboard Ferremas
            </Typography>
            {isSm && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  boxShadow: 3,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: 6,
                  },
                  display: { xs: 'flex', sm: 'none' }
                }}
                size="large"
              >
                <AppsIcon fontSize="medium" />
              </IconButton>
            )}
          </Box>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            {summaryData.map((item) => (
              <Grid
                key={item.label}
                sx={{ display: 'flex' }}
                xs={12}
                sm={6}
                md={4}
              >
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
                  {item.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6">{item.value}</Typography>
                    <Typography color="text.secondary">{item.label}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Últimos pedidos
            </Typography>
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto', maxHeight: 350 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                      }}
                    >
                      Cliente
                    </TableCell>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                      }}
                    >
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>{order.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}