import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

function Wishlist({ searchQuery }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage safely
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist.filter((item) => item !== null)); // Remove null values
  }, []);

  // Function to remove an item from wishlist
  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item?.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); //  Update local storage
    alert("Are you sure you want to remove? ");
  };

 // filtering to wishlist
  const filteredWishlist = wishlist.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.toString().includes(searchQuery) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.rating?.toString().includes(searchQuery)
  );

  return (
    <div>
      <h2 className="wishlist-title">
        Your Wishlist <FaRegHeart />
      </h2>
      <div className="Recommended-items-wish">
        {filteredWishlist.length > 0 ? (
          filteredWishlist.map((product) =>
            product ? ( // product is not null before rendering
              <div key={product.id} className="testimonial-wish">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  className="test-img"
                />
                <h4 className="test-name-wish">{product.title}</h4>
                <p className="description-wish">{product.description.substring(0, 75)}</p>
                <p className="price-wish">${product.price}</p>

                {/*  Button to View Product */}
                <button className="add-to-cart-button" onClick={() => navigate(`/product/${product.id}`)}>
                  View Product
                </button>

                {/*  Button to Remove from Wishlist */}
                <button className="back-btn" onClick={() => handleRemoveFromWishlist(product.id)}>
                  Remove
                </button>
              </div>
            ) : null
          )
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
