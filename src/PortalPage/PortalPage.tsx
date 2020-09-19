import React from "react";
import PortalArticle from "./PortalArticle/PortalArticle";
import PortalHeader from "./PortalHeader";
import PortalNav from "./PortalNav/PortalNav";
import module_styles from "./PortalPage.module.css";

function PortalPage() {
  return (
    <div className={module_styles["Portal-App"]}>
      <PortalHeader />
      <main className={module_styles["Portal-main"]}>
        <PortalNav />
        <PortalArticle />
      </main>
    </div>
  );
}

export default PortalPage;
