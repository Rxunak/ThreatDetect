import "../styles/Login.css";

import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [inputFields, setInputFields] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const validationValues = (inputValues) => {
    let errors = {};

    if (inputValues.username.length === 0) {
      errors.username = "Enter your username";
    }

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
    const response = await fetch("http://localhost:5001/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputFields), // Sending the input fields (username, email, password) to the backend
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Signup successful:", data);
      setInputFields({ username: "", email: "", password: "" });
      setSubmitting(false);

      navigate("/login");
    } else {
      console.log("Signup failed:", data);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finishSubmit();
    }
  }, [errors, submitting]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="">Username</label>
            <input
              type="text"
              name="username"
              value={inputFields.username}
              onChange={handleChange}
            />
            {errors.username && <p className="errors">{errors.username}</p>}
          </div>
          <div>
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              value={inputFields.email}
              onChange={handleChange}
            />
            {errors.email && <p className="errors">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              value={inputFields.password}
              onChange={handleChange}
            />
            {errors.password && <p className="errors">{errors.password}</p>}
          </div>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting.." : "Submit"}
        </button>
      </form>
      {Object.keys(errors).length === 0 && submitting ? (
        <span className="success">Login Succesful</span>
      ) : null}
    </div>
  );
};

export default Signup;
