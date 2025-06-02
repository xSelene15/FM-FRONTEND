import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import IntroDivider from '../components/products.jsx';

export default function ProductsPage() {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let url = '';
    if (subcategoryId && subcategoryId !== '0') {
      url = `http://34.204.114.72:8080/api/productos/buscar?subCategoriaId=${subcategoryId}&categoriaId=${categoryId}`;
    } else {
      url = `http://34.204.114.72:8080/api/productos/buscar?categoriaId=${categoryId}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [subcategoryId, categoryId]);

  return (
    <Grid container columns={12} spacing={2} sx={{ p: 2 }}>
      {products.map((product) => (
        <Grid key={product.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
          <IntroDivider {...product} />
        </Grid>
      ))}
    </Grid>
  );
}