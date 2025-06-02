import * as React from 'react';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { ClickAwayListener, Box, Paper } from '@mui/material';

export default function CategoriesList({ handleCloseListMenu }) {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    fetch('http://34.204.114.72:8080/api/categorias')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  return (
    <ClickAwayListener onClickAway={handleCloseListMenu}>
      <Box
        sx={{
          position: 'fixed',
          top: 80, // adjust as needed to be below your AppBar
          left: 0,
          zIndex: 1300,
          width: 300,
        }}
      >
        <Paper elevation={4} sx={{ p: 2 }} > 
          {categories.map((categoria) => (
            <MenuItem key={categoria.id} onClick={handleCloseListMenu}>
              <Typography>{categoria.nombre}</Typography>
            </MenuItem>
          ))}
        </Paper>
      </Box>
    </ClickAwayListener>
  );
}

