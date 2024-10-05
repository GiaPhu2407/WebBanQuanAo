import React from "react";
import Intro from "../Profile/(Introduce)/intro";
import MyTimelinePage from "@/components/ui/timeline";
import Footer from "../Profile/(Home)/Footer";
const page = () => {
  return (
    <div>
      <Intro />
      <MyTimelinePage />
      <Footer />
    </div>
  );
};

export default page;
