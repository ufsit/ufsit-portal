import React from "react";
import Card from "../Cards/Card";
import logo from "../../logo.svg";
import module_styles from "./PortalArticle.module.css";

function AdminArticle() {
  return (
    <div className={module_styles["User-portal-article"]}>
      <div className={module_styles["Portal-article-column"]}>
        <Card
          title="Start a Meeting"
          description="Allow users to sign in and get things rolling!"
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "Start",
              onClick: () => {
                console.log("clicked start");
              },
            },
          ]}
        />
        <Card
          title="Manage Users"
          description="Add, remove, and manage existing users."
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "Manage",
              onClick: () => {
                console.log("clicked manage");
              },
            },
          ]}
        />
      </div>
      <div className={module_styles["Portal-article-column"]}>
        <Card
          title="Add a Meeting"
          description="Add a meeting or club event to the calendar."
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "Add",
              onClick: () => {
                console.log("clicked add");
              },
            },
          ]}
        />
        <Card
          title="Send an Alert"
          description="Send alerts to members or schedule notifications."
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "Alert",
              onClick: () => {
                console.log("clicked alert");
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

export default AdminArticle;
