import { useState } from 'react'
import './App.css'
import ResponsiveAppBar from './components/appbar.jsx';
import CategoriesList from './components/categories.jsx';
import ProductsPage from './pages/productsPage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InicioPage from './pages/inicioPage.jsx';

function App() {
  const [showCategoryList, setShowCategoryList] = useState(false);
  return (
    <>
      <Router>
      <ResponsiveAppBar onCategoryClick={() => setShowCategoryList(true)} />
        {showCategoryList && (
          <CategoriesList handleCloseListMenu={() => setShowCategoryList(false)} />
        )}
  
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/products/:categoryId/:subcategoryId" element={<ProductsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
