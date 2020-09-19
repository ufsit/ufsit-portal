import React from "react";
import LoginForm from "./LoginForm";
import logo from "../logo.svg";
import module_styles from "./LoginPage.module.css";

function LoginPage() {
  return (
    <div className={module_styles["Login-App"]}>
      <header className={module_styles["login-header"]}>
        <img src={logo} className={module_styles["App-logo"]} alt="logo" />
        <h1 className={module_styles["login-header-title"]}>UFSIT Portal</h1>
      </header>
      <LoginForm />
      <a
        className={module_styles["register-link"]}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Register Here
      </a>
    </div>
  );
}

export default LoginPage;
