import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
   <>


    <BrowserRouter>
    <Navbar/>
      {/* Routes */}
      <Routes>
        <Route path='/' index element={<Home />} />
      </Routes>
    </BrowserRouter>
    <Footer />


    </>
  );
}