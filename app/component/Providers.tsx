"use client";
import React, { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DragWrapperProps {
  children: ReactNode;
}

const DragWrapper: React.FC<DragWrapperProps> = ({ children }) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};

export default DragWrapper;
