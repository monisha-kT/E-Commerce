import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductListing from './components/Pages/ProductListing';
import SignIn from './components/authentication/SignIn';
import SignUp from './components/authentication/SignUp';
import Account from './components/Pages/Account';
import Wishlist from './components/Pages/Wishlist';
import ProductDetails from './components/Pages/ProductDetails';
import Basket from './components/Pages/Basket';
import Checkout from './components/Pages/Checkout';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("Status") === "loggedIn");

  const handleserach = (values) => {
    setSearchQuery(values);
  };

  return (
    <BrowserRouter>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleserach={handleserach} searchQuery={searchQuery} />
    </BrowserRouter>
  );
}

function AppContent({ isLoggedIn, setIsLoggedIn, handleserach, searchQuery }) {
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem("Status");
    if(window.location.pathname==="/"&&status==="loggedIn"){
      navigate("/store")
    }
    if (status !== "loggedIn") {
     
      setIsLoggedIn(false);
      navigate("/");
    }
  }, []);

  return (
    <div>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      ) : (
        <>
          <Navbar handleserach={handleserach} />
          <Routes>
            <Route path="/store" element={<ProductListing searchQuery={searchQuery} />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Wishlist" element={<Wishlist   searchQuery={searchQuery} />} />
            <Route path="/Basket" element={<Basket />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
