import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

const SignUp = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabetic characters are allowed")
    .min(3, "Minimum 3 characters")
    .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, "Must contain uppercase, lowercase, number, and special character")
    .required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Required"),
  });

  const handleSubmit = (values) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ name: values.name, email: values.email, password: values.password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Sign Up successful! Please Sign In.");
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        <Formik initialValues={{ name: "", email: "", password: "", confirmPassword: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <label>Name</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" className="error" />

            <label>Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />

            <label>Confirm Password</label>
            <Field type="password" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />

            <button type="submit">Sign Up</button>
          </Form>
        </Formik>
        <p>Already have an account? <Link to="/">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
