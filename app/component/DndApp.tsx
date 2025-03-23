"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Menu from "./Header";
import Providers from "./Providers";

interface DndAppProps {
  children: React.ReactNode;
}

const DndApp: React.FC<DndAppProps> = ({ children }) => {
  return (
    <Providers>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen">
          <Menu />
          <main>{children}</main>
        </div>
      </DndProvider>
    </Providers>
  );
};

export default DndApp;
