import React, { useState, useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import authService from "../../services/authService";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import "../../css/auth.css";
import { AuthContext } from "../../App";
import store from "../../redux/store";

function Login(props) {
  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [serverError, setServerError] = useState({});
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);

  // Form data avaialble here
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      async function loginUser() {
        const res = await authService.login(formValues);
        if (res.error) {
          setServerError({ server_error: res.error });
        } else {
          store.dispatch({
            type: "userAdded",
            payload: {
              user: res.user,
            },
          });
          navigate("/sellerpage");
        }
      }
      loginUser();
    }
  }, [formErrors, navigate, formValues, isSubmit]);

  if (currentUser) {
    console.log("currentUser", currentUser);
    return <Navigate to="/sellerpage"></Navigate>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  // validate form values
  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required!*";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required!*";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    return errors;
  };

  return (
    <div className="auth-form-container">
      <Form
        onSubmit={handleSubmit}
        className="p-4 d-flex flex-column gap-4 shadow-sm form-bg"
      >
        <h3 className="text-center">Login</h3>
        <Form.Group>
          <Form.Control
            type="text"
            size="lg"
            name="email"
            placeholder="Email"
            value={formValues.email}
            onChange={handleChange}
            isInvalid={formErrors.email ? true : false}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {formErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="input-lg">
          <Form.Control
            type="password"
            size="lg"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            isInvalid={formErrors.password ? true : false}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {formErrors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-danger">{serverError.server_error}</div>

        <div className="text-center">
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            className="auth-button"
          >
            Login
          </Button>
        </div>
        <div className="text-center text-muted">
          <a href="/" className="text-decoration-none">
            Forgot Password?
          </a>
        </div>
        <hr className="m-0" />
        <div className="text-center text-muted">
          Don't have an account?{" "}
          <span>
            <NavLink to="/register" className="text-decoration-none">
              Register
            </NavLink>
          </span>
        </div>
      </Form>
    </div>
  );
}

export default Login;
