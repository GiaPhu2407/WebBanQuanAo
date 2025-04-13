import React from "react";
import Content1 from "./Content1";
import Content2 from "./Content2";
import ClothingViewerPage from "@/app/component/ClothingViewPage";
import AboutPage from "@/app/About/page";

const Content = () => {
  return (
    <div className="overflow-hidden">
      <Content1 />
      <Content2 />
      <ClothingViewerPage />
      <AboutPage />
    </div>
  );
};

export default Content;
