import React, { useMemo, useState,useEffect } from "react";
import { GrSearch } from "react-icons/gr";
import { Link } from "react-router-dom";
import "../App.css";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

function Navbar({ handleserach }) {
  const [isOpen, setIsOpen] = useState(false);
  const [Searchedvalue, setSearchedvalue] = useState("")
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(Searchedvalue);
    }, 500);

    return () => clearTimeout(handler); // Clears previous timeout
  }, [Searchedvalue]);
  useMemo(() => {
    handleserach(debouncedValue)
  }, [debouncedValue])
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (

    <div className="wrapper">
      <div className="container">
        <div className="Title">Alice</div>
        <div className="search">
          <input
            type="text"
            value={Searchedvalue}
            className="searchbox"
            placeholder="Enter Product"
            onChange={(e) => {
              setSearchedvalue(e.target.value)
            }}
          />



        </div>

        {/* Hamburger Menu */}
        <button className="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>

        {/* Navigation links for medium screens */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <ul>
            {/* <Link to="/store" onClick={handleNavClick}>Home</Link> */}
            <Link to="/store" onClick={handleNavClick}>Store</Link>
            <Link to="/account" onClick={handleNavClick}>Account</Link>
            <Link to="/wishlist" onClick={handleNavClick}>Wishlist</Link>
            <Link to="/basket" onClick={handleNavClick}>Basket <FaShoppingCart /></Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;