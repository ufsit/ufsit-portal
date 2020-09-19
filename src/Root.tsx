import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import PortalPage from "./PortalPage/PortalPage";

function Root() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/Portal" component={PortalPage} />
        <Route>
          <h1>404 - Page Not Found</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
