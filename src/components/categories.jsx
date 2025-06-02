import * as React from 'react';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { ClickAwayListener, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CategoriesList({ handleCloseListMenu }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://34.204.114.72:8080/api/categorias')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      setLoadingSubcategories(true);
      fetch(`http://34.204.114.72:8080/api/subcategorias/categoria/${selectedCategoryId}`)
        .then((response) => response.json())
        .then((data) => {
          setSubcategories(data);
          setLoadingSubcategories(false);
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
          setLoadingSubcategories(false);
        });
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

  return (
    <ClickAwayListener onClickAway={handleCloseListMenu}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 80, // adjust as needed to be below your AppBar
          left: 0,
          zIndex: 1300,
          width: 300,
        }}
      >
        <Paper elevation={4} sx={{ p: 2 }}>
          {categories.map((categoria) => (
            <div key={categoria.id}>
              <MenuItem
                onClick={() => {
                  setSelectedCategoryId(categoria.id);
                  setSelectedSubcategoryId(null);
                }}
                selected={selectedCategoryId === categoria.id}
              >
                <Typography>{categoria.nombre}</Typography>
              </MenuItem>
              {/* Show subcategories if this category is selected and has subcategories */}
              {selectedCategoryId === categoria.id && (
                loadingSubcategories ? (
                  <Typography sx={{ pl: 4 }}>Cargando...</Typography>
                ) : subcategories.length > 0 ? (
                  <Box sx={{ pl: 4 }}>
                    {subcategories.map((sub) => (
                      <MenuItem
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubcategoryId(sub.id);
                          navigate(`/products/${selectedCategoryId}/${sub.id}`);
                          handleCloseListMenu();
                        }}
                        selected={selectedSubcategoryId === sub.id}
                      >
                        <Typography variant="body2">{sub.nombre}</Typography>
                      </MenuItem>
                    ))}
                  </Box>
                ) : (
                  // If no subcategories, allow navigation to products by category only
                  <MenuItem
                    sx={{ pl: 4 }}
                    onClick={() => {
                      navigate(`/products/${categoria.id}/0`);
                      handleCloseListMenu();
                    }}
                  >
                    <Typography variant="body2">Ver {categoria.nombre}</Typography>
                  </MenuItem>
                )
              )}
            </div>
          ))}
        </Paper>
      </Box>
    </ClickAwayListener>
  );
}

