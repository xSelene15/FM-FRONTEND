import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css'
import ResponsiveAppBar from './components/appbar.jsx';
import CategoriesList from './components/categories.jsx';
import InicioPage from './pages/inicioPage.jsx';
import CartPage from './pages/cartPage.jsx';
import ConsultasPage from './pages/consultasPage.jsx';
import RegistroPage from './pages/registrationPage.jsx';
import ProductsPage from './pages/productsPage.jsx'
import LoginPage from './pages/loginPage.jsx';
import LoginAdmPage from './dashboard/dPages/loginAdmPage.jsx';
import DashboardLayout from './dashboard/dashboardlayout.jsx';
import DashboardPage from './dashboard/dPages/dashboardPage.jsx';
import UsuariosPage from './dashboard/dPages/usuariosPage.jsx';
import InboxPage from './dashboard/dPages/inboxPage.jsx';
import PedidosPage from './dashboard/dPages/pedidosPage.jsx';
import MantenedorPage from './dashboard/dPages/mantenedorPage.jsx';
import CrearEmpleadoPage from './dashboard/dPages/crearEmpleadoPage.jsx';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoader } from './context/LoaderContext.jsx';
import { useAuth } from './context/AuthContext.jsx';

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
  const { loading } = useLoader();
  const { user, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const found = prevCart.find(item => item.codProducto === product.codProducto);
      if (found) {
        return prevCart.map(item =>
          item.codProducto === product.codProducto
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (codProducto) => {
    setCart((prevCart) => prevCart.filter(item => item.codProducto !== codProducto));
  };

  const isEmpleado = user?.tipo === 'empleado';
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Redirige a dashboard si es empleado y navega fuera del dashboard
  if (isEmpleado && !isDashboard) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirige a login-empleado si NO es empleado y quiere acceder al dashboard
  if (isDashboard && !isEmpleado) {
    return <Navigate to="/login-empleado" replace />;
  }

  // Solo muestra la AppBar principal si NO estás en /dashboard
  const showAppBar = !isDashboard;

  return (
    <>
      {loading && (
        <Box sx={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          bgcolor: 'rgba(255,255,255,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress size={80} />
        </Box>
      )}

      {showAppBar && (
        <>
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100 }}>
            <ResponsiveAppBar user={user} onLogout={logout} onCategoryClick={() => setShowCategoryList(true)} />
            {showCategoryList && (
              <CategoriesList handleCloseListMenu={() => setShowCategoryList(false)} />
            )}
          </Box>
          {/* Espacio para la navbar */}
          <Box sx={{ height: '64px' }} /> {/* Ajusta a la altura real de tu AppBar */}
        </>
      )}

      {/* El contenido de las páginas va debajo */}
      <Box sx={{ mt: !isDashboard ? '0px' : 0 }}>
        <Routes>
            <Route path="/" element={<InicioPage />} />
            <Route path="/products/:categoryId/:subcategoryId" element={<ProductsPage addToCart={addToCart} />} />
            <Route path="/carrito" element={<CartPage cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />
            <Route path="/consultas" element={<ConsultasPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-empleado" element={<LoginAdmPage />} />
            <Route path="/dashboard/*" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="usuarios/crear" element={<CrearEmpleadoPage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="pedidos" element={<PedidosPage />} />
              <Route path="productos" element={<MantenedorPage />} />
            </Route>
        </Routes>
      </Box>
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
