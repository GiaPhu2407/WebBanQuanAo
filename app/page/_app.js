// pages/_app.js
import React from "react";
import { Router } from "next/router";
import { SalesDashboard } from "../components/SalesDashboard";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Router>
      <SalesDashboard />
    </Router>
  );
};

export default MyApp;
