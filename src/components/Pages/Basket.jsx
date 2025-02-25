import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("Cart from Local Storage:", storedCart); // Debugging
        setCart(storedCart);
        setTotalPrice(
            storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        );
    }, []); // Fetch cart items when component loads

    const handleRemove = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleCheckout = () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            alert("You must be logged in to proceed to checkout.");
            navigate("/signin");
        } else {
            alert("Proceeding to checkout...");
            navigate("/checkout");
        }
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <div>
                    {cart.map((item) => (
                        <div key={item.id} className="testimonial">
                            <img src={item.thumbnail} alt={item.title} loading="lazy" className="cart-img" />
                            <div>
                                <h4 className="test-name">{item.title}</h4>
                                <p className="price">Price:${item.price}</p>
                                <p className="description">Quantity: {item.quantity}</p>
                                <button className='cart-remove'onClick={() => handleRemove(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <h3 className='cart-total'>Total: ${totalPrice.toFixed(2)}</h3>
                    <button onClick={handleCheckout} className="checkout-button">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
