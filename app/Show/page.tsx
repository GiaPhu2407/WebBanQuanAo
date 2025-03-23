import React from "react";
import Header from "../component/Header";
import Home from "../component/Home";
import Content from "../component/Content";
import Footer from "../component/Footer";
import CozeChat from "../component/CozeAI";
const page = () => {
  return (
    <div>
      <Header />
      <Content />
      <Home />
      <Footer />
      <CozeChat />
    </div>
  );
};

export default page;
