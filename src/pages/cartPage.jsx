import ProductCard from '../components/products.jsx';
import Grid from '@mui/material/Grid';

export default function CartPage({ cart }) {
    console.log('Carrito:', cart);
  return (
    <Grid container columns={12} spacing={2} sx={{ p: 2 }}>
      {cart.length === 0 ? (
        <Grid item xs={12}>
          <p>El carrito está vacío.</p>
        </Grid>
      ) : (
        cart.map((product, idx) => (
          <Grid key={idx} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
            <ProductCard {...product} addToCart={() => {}} />
          </Grid>
        ))
      )}
    </Grid>
  );
}