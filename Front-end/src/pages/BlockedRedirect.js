import React from "react";
import { Link } from "react-router-dom";

const BlockedRedirect = () => {
  console.log("Loaded");
  return (
    <div>
      <h1>You have been blocked</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default BlockedRedirect;
