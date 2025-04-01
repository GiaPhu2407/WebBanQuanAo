import React from "react";
import Header from "../component/Header";
import Home from "../component/Home";
import Content from "../component/Content";
import Footer from "../component/Footer";
import CozeChat from "../component/CozeAI";
import TawkMessenger from "../component/TawkMesseger";
import { ZaloChat } from "../component/ZaloChart";

const page = () => {
  return (
    <div>
      <Header />
      <Content />
      <Home />
      <Footer />
      {/* <ZaloChat oaId={"2288580799185233701"} /> */}
      {/* Đặt CozeChat ở góc trái dưới */}
      <div className="fixed bottom-4 left-4 z-50">
        <CozeChat />
      </div>

      {/* Đặt TawkMessenger ở góc phải dưới */}
      {/* <div className="fixed bottom-4 right-96 z-50">
        <TawkMessenger />
      </div> */}
    </div>
  );
};

export default page;
