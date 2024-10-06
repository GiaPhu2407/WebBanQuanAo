import React from "react";
import Intro from "../Profile/(Introduce)/intro";

import MyTimelinePage from "@/components/ui/timeline";
import Footer from "../Profile/(Home)/Footer";
import Header from "../Profile/(Home)/Header";
const page = () => {
  return (
    <div>
      <Header />
      <Intro />
      <MyTimelinePage />
      <Footer />
    </div>
  );
};

export default page;
