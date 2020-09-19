import React, { useState } from "react";
import { accountRights } from "../PortalContext";
import module_styles from "./PortalNav.module.css";

const adminOptions = [
  "Home",
  "Attendance",
  "Calendar",
  "Users",
  "Alumni",
  "Notifications",
];
const userOptions = ["Home", "Attendance", "Calendar", "Alerts"];

function PortalNav() {
  const [panelOptions] = useState<string[]>(
    accountRights === "admin" ? adminOptions : userOptions
  );
  const [selectedPanelOption] = useState<string>("Home");

  return (
    <div className={module_styles["Portal-nav-container"]}>
      <nav className={module_styles["Portal-nav"]}>
        {panelOptions.map((elem, index) => (
          <div
            className={`${module_styles["Portal-panel-button"]} ${
              selectedPanelOption === elem
                ? module_styles["selected-panel-button"]
                : ""
            }`}
            key={`nav-button-${index}`}
          >
            {elem}
          </div>
        ))}
      </nav>
      <div
        className={`${module_styles["Portal-panel-button"]} ${module_styles["Portal-settings-button"]}`}
      >
        Settings
      </div>
    </div>
  );
}

export default PortalNav;
