import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import ResponsiveAppBar from './components/appbar.jsx';
import CategoriesList from './components/categories.jsx';
import InicioPage from './pages/inicioPage.jsx';
import CartPage from './pages/cartPage.jsx';
import ConsultasPage from './pages/consultasPage.jsx';
import RegistroPage from './pages/registrationPage.jsx';
import ProductsPage from './pages/productsPage.jsx'
import LoginPage from './pages/loginPage.jsx';
import DashboardLayout from './dashboard/dashboardlayout.jsx';
import DashboardPage from './dashboard/dPages/dashboardPage.jsx';
import UsuariosPage from './dashboard/dPages/usuariosPage.jsx';
import InboxPage from './dashboard/dPages/InboxPage.jsx';
import PedidosPage from './dashboard/dPages/pedidosPage.jsx';
import MantenedorPage from './dashboard/dPages/mantenedorPage.jsx';

const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  return (
    <MessagesContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}

function AppContent() {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (codProducto) => {
    setCart((prevCart) => prevCart.filter(item => item.codProducto !== codProducto));
  };

  // Solo muestra la AppBar principal si NO estás en /dashboard
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && (
        <>
          <ResponsiveAppBar onCategoryClick={() => setShowCategoryList(true)} />
          {showCategoryList && (
            <CategoriesList handleCloseListMenu={() => setShowCategoryList(false)} />
          )}
        </>
      )}

      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/products/:categoryId/:subcategoryId" element={<ProductsPage addToCart={addToCart} />} />
        <Route path="/carrito" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="productos" element={<MantenedorPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
