import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useLoader } from '../context/LoaderContext.jsx';

const CARDS_PER_VIEW = 5;
const AUTO_SCROLL_INTERVAL = 10000; // 10 segundos

export default function ImgListOffer() {
  const [productos, setProductos] = React.useState([]);
  const [startIdx, setStartIdx] = React.useState(0);
  const { setLoading } = useLoader();

  React.useEffect(() => {
    setLoading(true);
    fetch('http://34.204.114.72:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        const productosOferta = data.filter(item => item.oferta === true);
        setProductos(productosOferta);
      })
      .finally(() => setLoading(false));
  }, [setLoading]);

  // Avance automático
  React.useEffect(() => {
    if (productos.length <= CARDS_PER_VIEW) return;
    const interval = setInterval(() => {
      handleNext();
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [productos, startIdx]);

  const handlePrev = () => {
    setStartIdx((prev) =>
      prev - CARDS_PER_VIEW < 0
        ? Math.max(productos.length - CARDS_PER_VIEW, 0)
        : prev - CARDS_PER_VIEW
    );
  };

  const handleNext = () => {
    setStartIdx((prev) =>
      prev + CARDS_PER_VIEW >= productos.length
        ? 0
        : prev + CARDS_PER_VIEW
    );
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
        minWidth: 400,
        maxWidth: 1100,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
        Productos en Oferta
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 270 }}>
        <IconButton
          onClick={handlePrev}
          sx={{ position: 'absolute', left: 0, zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
          disabled={productos.length <= CARDS_PER_VIEW}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden', width: '100%', justifyContent: 'center' }}>
          {cardsToShow.map((item, idx) => (
            <Card
              key={item.codProducto || idx}
              sx={{
                width: 200,
                height: 270,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                mx: 1,
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              <CardMedia
                component="img"
                image={item.imagenUrl}
                alt={item.nombre}
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: 'contain',
                  margin: '16px auto 0 auto',
                  borderRadius: 2,
                  background: '#f5f5f5'
                }}
              />
              <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                p: 1
              }}>
                <Typography
                  variant="subtitle1"
                  component="div"
                  align="center"
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.nombre}
                >
                  {item.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.marca}
                >
                  {item.marca}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', right: 0, zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
          disabled={productos.length <= CARDS_PER_VIEW}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
