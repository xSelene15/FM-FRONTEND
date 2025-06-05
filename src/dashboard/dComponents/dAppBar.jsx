import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

export default function DashboardAppBar() {
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

          }}
        >
          <SquareFootIcon sx={{ fontSize: 30, mr: 2 }}/>
          FERREMAS DASHBOARD
        </Typography>
      </Toolbar>
    </AppBar>
  );
}