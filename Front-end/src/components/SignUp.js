import "../styles/SignUp.css";

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
  const [signUpError, setSignUpError] = useState([]);

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
      body: JSON.stringify(inputFields),
    });

    const data = await response.json();

    if (response.ok) {
      setInputFields({ username: "", email: "", password: "" });
      setSubmitting(false);
      navigate("/login");
    } else {
      setSubmitting(false);
      setSignUpError(data.message);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finishSubmit();
    }
  }, [errors, submitting]);

  return (
    <div className="signupMain">
      <div className="signupFirst"></div>
      <div className="signupSecond">
        <form onSubmit={handleSubmit} className="signupForm">
          <div className="signupField">
            <div className="formHeading">
              <h1 className="formH1">ThreatDetect</h1>
              <p className="formP">Enter your details below to register</p>
            </div>
            <div className="inputFieldsSign">
              <label htmlFor="" className="input">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={inputFields.username}
                onChange={handleChange}
                placeholder="Please enter Username:"
                className="signInput"
              />
              {errors.username && <p className="errors">*{errors.username}*</p>}
            </div>
            <div className="inputFieldsSign">
              <label htmlFor="" className="input">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={inputFields.email}
                onChange={handleChange}
                placeholder="Please enter Email:"
                className="signInput"
              />
              {errors.email && <p className="errors">*{errors.email}*</p>}
            </div>
            <div className="inputFieldsSign">
              <label htmlFor="" className="input">
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={inputFields.password}
                onChange={handleChange}
                placeholder="Please enter Password:"
                className="signInput"
              />
              {errors.password && <p className="errors">*{errors.password}</p>}
            </div>
            <div>
              {" "}
              <button
                type="submit"
                disabled={submitting}
                className="buttonForm"
              >
                {submitting ? "Submitting.." : "Submit"}
              </button>
            </div>
            <div className="signupRedirect">
              <div>
                {signUpError && signUpError.length >= 1 ? (
                  <div>
                    {signUpError && <p>{signUpError}</p>}
                    <p>Please Login Below !!</p>
                  </div>
                ) : null}
              </div>
              <div>
                {" "}
                <p>
                  Already registered? <a href="/login">Login In</a>
                </p>
              </div>
            </div>
          </div>
        </form>

        {Object.keys(errors).length === 0 && submitting ? (
          <span className="success">Login Succesful</span>
        ) : null}
      </div>
    </div>
  );
};

export default Signup;
