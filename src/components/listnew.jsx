import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';

const CARDS_PER_VIEW = 1; // Solo una card visible
const AUTO_SCROLL_INTERVAL = 4000; // 4 segundos

export default function ImgListNew() {
  const [productos, setProductos] = React.useState([]);
  const [startIdx, setStartIdx] = React.useState(0);
  const [fadeIn, setFadeIn] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch('http://34.204.114.72:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        const productosNuevos = data.filter(item => item.nuevo === true);
        setProductos(productosNuevos);
      });
  }, []);

  // Avance automático con fade
  React.useEffect(() => {
    if (productos.length <= CARDS_PER_VIEW) return;
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        handleNext();
        setFadeIn(true);
      }, 300); // Duración del fade out
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [productos, startIdx]);

  const handlePrev = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStartIdx((prev) =>
        prev - CARDS_PER_VIEW < 0
          ? Math.max(productos.length - CARDS_PER_VIEW, 0)
          : prev - CARDS_PER_VIEW
      );
      setFadeIn(true);
    }, 300);
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStartIdx((prev) =>
        prev + CARDS_PER_VIEW >= productos.length
          ? 0
          : prev + CARDS_PER_VIEW
      );
      setFadeIn(true);
    }, 300);
  };

  // Slice los productos a mostrar
  const visibleProducts = productos.slice(startIdx, startIdx + CARDS_PER_VIEW);

  // Si quedan menos de CARDS_PER_VIEW al final, puedes rellenar desde el inicio para efecto "loop"
  let cardsToShow = visibleProducts;
  if (visibleProducts.length < CARDS_PER_VIEW && productos.length > 0) {
    cardsToShow = [
      ...visibleProducts,
      ...productos.slice(0, CARDS_PER_VIEW - visibleProducts.length),
    ];
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
      <Card
        sx={{
          p: 2,
          mb: 4,
          bgcolor: 'rgba(255,255,255,0.7)',
          boxShadow: 3,
          borderRadius: 2,
          backdropFilter: 'blur(2px)',
          position: 'relative',
          overflow: 'visible',
          minWidth: 400, // Ajusta el ancho máximo para una sola card
          width: '100%',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
          Productos Nuevos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 270 }}>
          <IconButton
            onClick={handlePrev}
            sx={{ position: 'absolute', left: 0, zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            disabled={productos.length <= CARDS_PER_VIEW}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Fade in={fadeIn} timeout={300}>
            <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden', width: '100%', justifyContent: 'center' }}>
              {cardsToShow.map((item, idx) => (
                <Card
                  key={item.codProducto || idx}
                  sx={{
                    width: 400,
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mx: 1,
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (item.categoriaId && item.subCategoriaId) {
                      navigate(`/products/${item.categoriaId}/${item.subCategoriaId}`);
                    } else if (item.categoriaId) {
                      navigate(`/products/${item.categoriaId}/0`);
                    } else {
                      // Opcional: navega a una ruta por defecto o muestra un error
                      alert('Este producto no tiene categoría asignada');
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.imagenUrl}
                    alt={item.nombre}
                    sx={{
                      width: 200,         // Puedes ajustar este valor según tu diseño
                      height: 200,        // Puedes ajustar este valor según tu diseño
                      objectFit: 'contain', // <-- Esto asegura que la imagen no se corte
                      margin: '16px auto 0 auto',
                      borderRadius: 2,
                      background: '#f5f5f5' // Opcional: fondo claro para imágenes con transparencia
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="div" align="center" noWrap>
                      {item.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" noWrap>
                      {item.marca}
                    </Typography>
                    <Typography variant="h6" component="div" align="center">
                      ${item.precioActual}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" noWrap>
                      {item.descripcion}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Fade>
          <IconButton
            onClick={handleNext}
            sx={{ position: 'absolute', right: 0, zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            disabled={productos.length <= CARDS_PER_VIEW}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}