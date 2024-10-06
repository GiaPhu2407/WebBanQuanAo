import React from "react";
import Intro from "../Profile/(Introduce)/intro";

import MyTimelinePage from "@/components/ui/timeline";
import Footer from "../Profile/(Home)/Footer";
import Header from "../Profile/(Home)/Header";
import Content from "../Profile/(Introduce)/Content";
const page = () => {
  return (
    <div>
      <Header />
      <Intro />
      <Content />
      <MyTimelinePage />
      <Footer />
    </div>
  );
};

export default page;
