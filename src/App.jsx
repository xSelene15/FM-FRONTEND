import { useState , useEffect} from 'react'
import './App.css'
import ResponsiveAppBar from './components/appbar.jsx';
import CategoriesList from './components/categories.jsx';
import ProductsPage from './pages/productsPage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InicioPage from './pages/inicioPage.jsx';
import CartPage from './pages/cartPage.jsx';


function App() {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    console.log('Producto agregado al carrito:', product);
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (codProducto) => {
    setCart((prevCart) => prevCart.filter(item => item.codProducto !== codProducto));
  };

  return (
    <>
      <Router>
        <ResponsiveAppBar onCategoryClick={() => setShowCategoryList(true)} />
        {showCategoryList && (
          <CategoriesList handleCloseListMenu={() => setShowCategoryList(false)} />
        )}

        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/products/:categoryId/:subcategoryId" element={<ProductsPage addToCart={addToCart} />} />
          <Route path="/carrito/" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
