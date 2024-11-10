import { data, div } from "@tensorflow/tfjs";
import "../styles/Login.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState([]);

  const navigate = useNavigate();

  const validationValues = (inputValues) => {
    let errors = {};

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(inputValues.email)) {
      errors.email = "Invalid Email !!";
    }

    const regexPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    if (!regexPass.test(inputValues.password)) {
      errors.password =
        "Password must contain at least 5 characters, one uppercase, one lowercase, and one number.";
    }

    return errors;
  };

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validationValues(inputFields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitting(true);
    } else {
      setSubmitting(false);
    }
  };

  const finishSubmit = async () => {
    const response = await fetch("http://localhost:5001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputFields), // Sending the input fields (username, email, password) to the backend
    });

    const data = await response.json();

    if (response.ok) {
      console.log("login successful:", data);

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          userId: data.userId,
          role: data.role,
        })
      );
      setInputFields({ email: "", password: "" });
      setSubmitting(false);
      navigate("/");
    } else {
      console.log("Login has beenss failed:", data);
      setSubmitting(false);
      setLoginError(data.message);

      console.log(loginError);

      // navigate("/signup");
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finishSubmit();
    }
  }, [errors, submitting]);

  return (
    <div className="loginMain">
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              value={inputFields.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              value={inputFields.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting.." : "Submit"}
        </button>
      </form>
      {loginError && <p>{loginError}</p>}
      {loginError && loginError.length >= 1 ? (
        <div>
          <p>Have't registered yet please click the button below!!</p>
          <button>
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Login;
