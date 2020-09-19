import React from "react";
import Card from "../Cards/Card";
import logo from "../../logo.svg";
import module_styles from "./PortalArticle.module.css";

function UserArticle() {
  return (
    <div className={module_styles["User-portal-article"]}>
      <div className={module_styles["Portal-article-column"]}>
        <Card
          title="Join a Meeting"
          description="Join a meeting with the provided meeting code."
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "Meeting Code",
              onClick: () => {
                console.log("clicked meeting code");
              },
            },
            {
              name: "Start Hacking!",
              onClick: () => {
                console.log("clicked start hacking");
              },
            },
          ]}
        />
      </div>
      <div className={module_styles["Portal-article-column"]}>
        <Card
          title="View Alerts"
          description="View notifications or reminders about upcoming events."
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "View",
              onClick: () => console.log("clicked view alerts"),
            },
          ]}
        />
        <Card
          title="View Calendar"
          description="View notifications or reminders about upcoming events."
          iconSrc={logo}
          style={{
            margin: "10px",
          }}
          buttons={[
            {
              name: "View",
              onClick: () => console.log("clicked view calendar"),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default UserArticle;
