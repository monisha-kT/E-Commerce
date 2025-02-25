import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa6";

function ProductDetails() {
    const [productcard, setProductcard] = useState([]);
    const [error, setError] = useState('');
    const { productId } = useParams();

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://dummyjson.com/products/${productId}`)
            .then((res) => {
                setProductcard(res.data);
                setLoading(false);
            })
            .catch((e) => {
                setError("Error fetching API");
                setLoading(false);
            });
    }, [productId]);

    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : []; // Always an Array
    });

    const handleWishlist = (product) => {
        setWishlist((prevWishlist) => {
            const cleanedWishlist = prevWishlist.filter((item) => item !== null); // Remove null values first
            const isInWishlist = cleanedWishlist.some((item) => item.id === product.id);
            const updatedWishlist = isInWishlist
                ? cleanedWishlist.filter((item) => item.id !== product.id) // Remove item
                : [...cleanedWishlist, product]; // Add item

            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
            return updatedWishlist;
        });
    };

    //handle cart 
    const handleAddtoCard = () => {
        if (!productcard) return;

        // Fetch existing cart from localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("Existing Cart:", cart);

        // Find if product already exists in the cart
        const existingProduct = cart.find((item) => item.id === productcard.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...productcard, quantity: 1 });
        }

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Updated Cart:", JSON.parse(localStorage.getItem("cart")));
        alert("Product added to cart!");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!productcard) return <p>No product found</p>;

    return (
        <div className="Recommended-items-product">
            <div className="testimonial-product">

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering product card click
                        handleWishlist(productcard);
                    }}
                    className="like-button-product"
                >
                    {wishlist.some((item) => item && item.id === productcard.id) ? (
                        <FaHeart color="red" />
                    ) : (
                        <FaRegHeart color="gray" />
                    )}
                </button>

                {/* Product Details */}
                <img src={productcard.thumbnail} alt={productcard.title} loading="lazy" className="productdetails-img" />
                <h4 className="test-name-pr">{productcard.title}</h4>
                <p className="description-pr">{productcard.description}</p>
                <p className="price-pr">${productcard.price}</p>
                {/* Star visualization */}
                <div className="star-rating-productcard">
                        {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        return (
                            <span
                            key={i}
                            className={
                                productcard.rating >= starValue
                                ? "star full"
                                : productcard.rating >= starValue - 0.5
                                    ? "star half"
                                    : "star empty"
                            }
                >
               <FaStar />
            </span>
          );
        })}
      </div>

                {/* Button to Add to Cart */}
                <button className='add-to-cart-button' onClick= {handleAddtoCard}>
                    Add to cart <FaShoppingCart />
                </button>

                {/* Button to Move Back */}
                <button className='back-btn' onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        </div>
    );
}

export default ProductDetails;