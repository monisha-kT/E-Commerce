import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

const Account = ({setIsLoggedIn}) => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
    navigate("/signin")
      
    } else {
      setUser(loggedInUser);
      
     
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.setItem("Status","")

    setIsLoggedIn(false);
    navigate("/SignIn");
  };

  return (
    <div className="account-container">
      <div className="account-box">
        <h2>My Account</h2>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Link to="/SignIn" onClick={handleLogout}>Logout</Link>
          </>
        ):(
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Account;
