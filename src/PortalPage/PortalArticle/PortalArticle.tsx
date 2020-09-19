import React from "react";
import { accountRights } from "../PortalContext";
import module_styles from "./PortalArticle.module.css";
import UserArticle from "./UserArticle";
import AdminArticle from "./AdminArticle";

function PortalArticle() {
  return (
    <article className={module_styles["Portal-article"]}>
      <h1 className={module_styles["Portal-article-title"]}>{`Welcome back, ${
        accountRights === "admin" ? "Admin" : "User"
      }!`}</h1>
      {accountRights === "admin" ? <AdminArticle /> : <UserArticle />}
    </article>
  );
}

export default PortalArticle;
