import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css"; 

const SignIn = ({setIsLoggedIn}) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, "Must contain uppercase, lowercase, number, and special character")
    .required("Password is required"),
  });

  const handleSubmit = (values) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === values.email && u.password === values.password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("Status","loggedIn")
      setIsLoggedIn(true);
      alert("Login successful!");
      navigate("/store");
    } else {
      alert("Invalid credentials!Please SignUp first");
      navigate("/signup");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <label>Email</label>
            <Field type="email"
             name="email"
                 />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Password</label>
            <Field type="password" 
            name="password"
          
           />
            <ErrorMessage name="password" component="div" className="error" />

            <button type="submit">Sign In</button>
          </Form>
        </Formik>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
