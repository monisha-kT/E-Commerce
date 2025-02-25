import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const Checkout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");  
    const [state, setState] = useState(""); 
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Tax & Delivery Charges
    const TAX_RATE = 0.10; // 10% tax
    const DELIVERY_CHARGE = 50; // Fixed delivery charge

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            alert("You must be logged in to proceed to checkout.");
            navigate("/signin");
            return;
        }
        setUser(loggedInUser);

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        const subtotal = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * TAX_RATE;
        setTotalPrice(subtotal + tax + DELIVERY_CHARGE);
    }, [navigate]);

    // **Validation Functions**
    const isValidPincode = (pincode) => /^\d{6}$/.test(pincode); // Only 6-digit number
    const isValidCityOrState = (value) => /^[A-Za-z\s]+$/.test(value.trim()); // Only letters & spaces

    // **Form Validation & Order Handling**
    const handlePlaceOrder = () => {
        if (!address.trim() || !pincode.trim() || !city.trim() || !state.trim()) {
            alert("Please fill in all fields: Address, Pincode, City, and State.");
            return;
        }

        if (!isValidPincode(pincode)) {
            alert("Invalid Pincode! It must be a 6-digit number.");
            return;
        }

        if (!isValidCityOrState(city)) {
            alert("Invalid City! Only letters are allowed.");
            return;
        }

        if (!isValidCityOrState(state)) {
            alert("Invalid State! Only letters are allowed.");
            return;
        }

        if (paymentMethod === "cod") {
            alert("Order placed successfully! Payment will be collected on delivery.");
        } else {
            alert("Payment successful! Order confirmed.");
        }

        localStorage.removeItem("cart"); // Clear cart after order
        navigate("/store"); // Redirect to store after order
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            {user && (
                <div className="user-details">
                    <h3>Shipping Details</h3>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>

                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input-field"
                        placeholder="Enter your full address"
                        required
                    />

                    <label>Pincode:</label>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="input-field"
                        placeholder="Enter Pincode"
                        maxLength="6"
                        required
                    />

                    <label>City:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                        placeholder="Enter City"
                        required
                    />

                    <label>State:</label> 
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="input-field"
                        placeholder="Enter State"
                        required
                    />
                </div>
            )}

            <h3>Order Summary</h3>
            <p>Subtotal: ${(totalPrice - DELIVERY_CHARGE) / (1 + TAX_RATE)}</p>
            <p>Tax (10%): ${(totalPrice - DELIVERY_CHARGE) * TAX_RATE}</p>
            <p>Delivery Charges: ${DELIVERY_CHARGE}</p>
            <h3>Total Amount: ${totalPrice.toFixed(2)}</h3>

            <h3>Select Payment Method:</h3>
            <label>
                <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery (COD)
            </label>

            <label>
                <input
                    type="radio"
                    name="payment"
                    value="qr"
                    checked={paymentMethod === "qr"}
                    onChange={() => setPaymentMethod("qr")}
                />
                Pay via QR Code
            </label>

            {paymentMethod === "qr" && (
                <div className="qr-code">
                    <h3>Scan to Pay</h3>
                    <QRCode
                        value={`upi://pay?pa=Testupi@techgenzi&pn=Merchant&mc=1234&tid=Txn001&tr=Order123&am=${totalPrice}&cu=INR`}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                    <p>Scan the QR code with your UPI app to complete the payment.</p>
                </div>
            )}

            <div className="return-policy">
                <h3>Return & Refund Policy</h3>
                <p>If you receive a damaged or incorrect product, you can return it within 7 days for a full refund.</p>
            </div>

            <button onClick={handlePlaceOrder} className="place-order-button">
                Place Order
            </button>

            <h3 className="thank-you">🎉 Thanks for shopping with us! 🎉</h3>
        </div>
    );
};

export default Checkout;
