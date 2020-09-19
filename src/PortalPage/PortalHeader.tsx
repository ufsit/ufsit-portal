import React from "react";
import logo from "../logo.svg";
import { accountRights } from "./PortalContext";
import module_styles from "./PortalPage.module.css";

function PortalHeader() {
  return (
    <header className={module_styles["Portal-header"]}>
      <div className={module_styles["Portal-header-title"]}>
        <img src={logo} className={module_styles["Portal-logo"]} alt="logo" />
        <h1 className={module_styles["Portal-title"]}>{`UFSIT Portal - ${
          accountRights === "admin" ? "Admin" : "User"
        }`}</h1>
      </div>
      <div className={module_styles["Portal-user-portrait-container"]}>
        <img
          src={logo}
          className={module_styles["Portal-user-icon"]}
          alt="logo"
        />
        <h3 className={module_styles["Portal-username"]}>
          {accountRights === "admin" ? "Admin" : "User"}
        </h3>
      </div>
    </header>
  );
}

export default PortalHeader;
