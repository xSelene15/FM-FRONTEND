import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function DashboardAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addMessage } = useMessages();

  const handleLogout = () => {
    logout();
    addMessage('Logout exitoso');
    navigate('/');
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            display: 'flex',
            mr: 2,           
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            flexGrow: 1
          }}
        >
          <SquareFootIcon sx={{ fontSize: 30, mr: 2 }}/>
          FERREMAS DASHBOARD
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ mr: 2 }}>
              Bienvenido: {user.correo} - {user.rol}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}