"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

interface SidebarBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
  className?: string;
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  className,
}: SidebarProps) => {
  return (
    <div
      className={cn(
        "h-full relative border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
        className
      )}
    >
      <div className="flex justify-end p-2 absolute right-0 top-0">
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          title={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <ChevronLeft
              size={18}
              className="text-neutral-700 dark:text-neutral-200"
            />
          ) : (
            <ChevronRight
              size={18}
              className="text-neutral-700 dark:text-neutral-200"
            />
          )}
        </button>
      </div>
      {children}
    </div>
  );
};

export const SidebarBody = ({ children, className }: SidebarBodyProps) => {
  return (
    <div className={cn("flex flex-col h-full p-3 pt-10", className)}>
      {children}
    </div>
  );
};

export const SidebarLink = ({ link, className }: SidebarLinkProps) => {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md px-3 py-2 text-sm transition-colors",
        className
      )}
    >
      {link.icon}
      <span className="truncate">{link.label}</span>
    </a>
  );
};
