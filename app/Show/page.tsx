import React from "react";
import Header from "../component/Header";
import Home from "../component/Home";
import Content from "../component/Content";
import Footer from "../component/Footer";
const page = () => {
  return (
    <div>
      <Header />
      <Content />
      <Home />
      <Footer />
    </div>
  );
};

export default page;
