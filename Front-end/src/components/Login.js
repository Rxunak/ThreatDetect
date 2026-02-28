import "../styles/Login.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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

  const finishSubmit = useCallback(async () => {
    const response = await fetch("http://localhost:5001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputFields),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          userId: data.userId,
          role: data.role,
          isBlocked: data.isBlocked,
        })
      );
      setInputFields({ email: "", password: "" });
      setSubmitting(false);

      toast.success("Loggin Succesfull", {
        position: "top-right",
        autoClose: 500
      })
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setSubmitting(false);
      setLoginError(data.message);
      toast.error("Login Failed!", {
        position: "top-right",
        autoClose: 1000
      })
    }
  }, [inputFields, navigate]);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finishSubmit();
    }
  }, [errors, submitting, finishSubmit]);

  return (
    <div className="loginMain">
      <div className="firstDiv">
        <div className="firstDivSide"></div>
      </div>
      <div className="secondDiv">
        <div className="secondDivForm">
          <div className="formDiv">
            <form onSubmit={handleSubmit} className="form">
              <div className="fieldName">
                <div className="formHeading">
                  <h1 className="formH1">ThreatDetect</h1>
                  <p className="formP">Enter your login credentials</p>
                </div>
                <div className="emailDiv">
                  <label htmlFor="" className="input">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={inputFields.email}
                    onChange={handleChange}
                    placeholder="Enter your Email:"
                    className="label"
                  />
                  {errors.email && <p className="error">*{errors.email}*</p>}
                </div>
                <div className="passwordDiv">
                  <label htmlFor="" className="input">
                    Password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={inputFields.password}
                    onChange={handleChange}
                    placeholder="Enter your Password:"
                    className="label"
                  />
                  {errors.password && (
                    <p className="error">*{errors.password}*</p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="buttonForm"
                  >
                    {submitting ? "Submitting.." : "Submit"}
                  </button>
                </div>
                <ToastContainer/>
                <div>
                  <div>
                    {loginError && loginError.length >= 1 ? (
                      <div>
                        <p>
                          Have't registered yet please click the link below!!
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <p>
                      Not registered? <a href="/signup">Create an account</a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
