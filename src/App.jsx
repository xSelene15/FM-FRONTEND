import { useState , useEffect} from 'react'
import './App.css'
import ResponsiveAppBar from './components/appbar.jsx';
import CategoriesList from './components/categories.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InicioPage from './pages/inicioPage.jsx';
import CartPage from './pages/cartPage.jsx';
import ConsultasPage from './pages/consultasPage.jsx';
import RegistroPage from './pages/registrationPage.jsx';
import ProductsPage from './pages/productsPage.jsx'
import LoginPage from './pages/loginPage.jsx';
import Layout from './(dashboard)/layouts/dashboard.jsx';

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
          <Route path="/consultas/" element={<ConsultasPage/>} />
          <Route path="/registro/" element={<RegistroPage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/dashboard/" element={<Layout />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App
