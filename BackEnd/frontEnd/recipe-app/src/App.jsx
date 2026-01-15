import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyResipes from './components/MyResipes';
import MyFavResipes from './components/MyFavResipes';
import AddResipes from './components/AddResipes';


export default function App() {
  return (
   <>


    <BrowserRouter>
    <Navbar/>
      {/* Routes */}
      <Routes>
        <Route path='/' index element={<Home />} />
        <Route path='/myRecipes'  element={<MyResipes />} />
        <Route path='/myFavRecipes'  element={<MyFavResipes />} />
        <Route path='/addRecipe'  element={<AddResipes />} />
      </Routes>
    </BrowserRouter>
    <Footer />


    </>
  );
}