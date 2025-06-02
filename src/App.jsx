import { useState } from 'react'
import './App.css'
import ResponsiveAppBar from './components/appbar.jsx';
import TitlebarBelowImageList from './components/listoffers.jsx';
import TitlebarBelowMasonryImageList from './components/listnew.jsx';
import CategoriesList from './components/categories.jsx';

function App() {
  const [showCategoryList, setShowCategoryList] = useState(false);
  return (
    <>
      <ResponsiveAppBar onCategoryClick={() => setShowCategoryList(true)} />
      {showCategoryList && (
        <CategoriesList handleCloseListMenu={() => setShowCategoryList(false)} />
      )}
      <TitlebarBelowImageList />
      <TitlebarBelowMasonryImageList />


    </>
  )
}

export default App
