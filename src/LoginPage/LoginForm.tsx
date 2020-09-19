import React, { useState } from "react";
import module_styles from "./LoginPage.module.css";

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const onInvalidFormField = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ): void => {
    e.target.setCustomValidity(`Please enter your ${fieldName} here.`);
  };

  return (
    <form
      //   action=""
      method="post"
      className={module_styles["login-form"]}
      onSubmit={(e) => {
        // here we can validate the input before sending to the server
        setErrorMessage("Invalid Username or Password");
        e.preventDefault();
      }}
    >
      <input
        type="text"
        placeholder="Username"
        onInvalid={(e: React.ChangeEvent<HTMLInputElement>): void =>
          onInvalidFormField(e, "Username")
        }
        onInput={(e: React.ChangeEvent<HTMLInputElement>): void =>
          e.target.setCustomValidity("")
        }
        required
        className={module_styles["login-input"]}
      />
      <input
        type="password"
        placeholder="Password"
        onInvalid={(e: React.ChangeEvent<HTMLInputElement>): void =>
          onInvalidFormField(e, "Password")
        }
        onInput={(e: React.ChangeEvent<HTMLInputElement>): void =>
          e.target.setCustomValidity("")
        }
        required
        className={module_styles["login-input"]}
      />
      {/* Show following error message only if the form is submitted and rejected */}
      {typeof errorMessage !== "undefined" && (
        <span className={module_styles["form-error-message"]}>
          {errorMessage}
        </span>
      )}
      <button type="submit" className={module_styles["login-button"]}>
        Log In
      </button>
    </form>
  );
}

export default LoginForm;
