"use client";
import React, { useState, useEffect } from "react";

import { User, CartItem } from "@/app/Menu/type/menu";
import DesktopDropdowns from "../Menu/DesktopDropdown";
import DesktopMenu from "../Menu/DesktopMenu";
import TabletMenu from "../Menu/TableMenu";
import MobileMenu from "../Menu/MobileMenu";
import { Link } from "lucide-react";

const Menu: React.FC = () => {
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Determine device type based on window width
  const isDesktop = windowWidth >= 1024; // lg breakpoint
  const isTablet = windowWidth >= 768 && windowWidth < 1024; // md to lg
  const isMobile = windowWidth < 768; // below md

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Fetch user session and order count on component mount
  useEffect(() => {
    // Fetch user session
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Session fetch error:", error);
      }
    };

    // Fetch order count
    const fetchOrderCount = async () => {
      try {
        const response = await fetch("/api/countdonhang");
        if (!response.ok) throw new Error("Failed to fetch order count");
        const count = await response.json();
        setOrderCount(count);
      } catch (error) {
        console.error("Order count fetch error:", error);
      }
    };

    // Fetch cart items
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Cart items fetch error:", error);
      }
    };

    fetchUserSession();
    fetchOrderCount();
    fetchCartItems();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUserData(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <div className="bg-white w-full h-20 shadow fixed z-[99]">
        {/* Mobile Header - Always visible on small screens */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between h-full px-4">
            {/* Logo and Hamburger */}
            <div className="flex items-center">
              <button
                className="p-2 mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link href="/" className="text-xl font-bold">
                Logo
              </Link>
            </div>

            {/* Mobile Cart Icon */}
            <div className="flex items-center">
              <Link href="/component/shopping" className="p-2 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {orderCount}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <MobileMenu
          userData={userData}
          handleLogout={handleLogout}
          showMaleDropdown={showMaleDropdown}
          setShowMaleDropdown={setShowMaleDropdown}
          showFemaleDropdown={showFemaleDropdown}
          setShowFemaleDropdown={setShowFemaleDropdown}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Tablet Menu Component */}
        <TabletMenu
          userData={userData}
          orderCount={orderCount}
          handleLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobileProfileOpen={isMobileProfileOpen}
          setIsMobileProfileOpen={setIsMobileProfileOpen}
        />

        {/* Desktop Menu Component */}
        <DesktopMenu
          userData={userData}
          orderCount={orderCount}
          handleLogout={handleLogout}
          showMaleDropdown={showMaleDropdown}
          setShowMaleDropdown={setShowMaleDropdown}
          showFemaleDropdown={showFemaleDropdown}
          setShowFemaleDropdown={setShowFemaleDropdown}
        />
      </div>

      {/* Desktop Dropdowns Component */}
      <DesktopDropdowns
        showMaleDropdown={showMaleDropdown}
        setShowMaleDropdown={setShowMaleDropdown}
        showFemaleDropdown={showFemaleDropdown}
        setShowFemaleDropdown={setShowFemaleDropdown}
      />

      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Menu;
// "use client";
// import React, { useState, useEffect } from "react";

// import { User, CartItem } from "@/app/Menu/type/menu";
// import DesktopDropdowns from "../Menu/DesktopDropdown";
// import DesktopMenu from "../Menu/DesktopMenu";
// import TabletMenu from "../Menu/TableMenu";
// import MobileMenu from "../Menu/MobileMenu";

// const Menu: React.FC = () => {
//   // State management
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showMaleDropdown, setShowMaleDropdown] = useState(false);
//   const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
//   const [userData, setUserData] = useState<User | null>(null);
//   const [orderCount, setOrderCount] = useState<number>(0);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState<number>(
//     typeof window !== "undefined" ? window.innerWidth : 0
//   );

//   // Determine device type based on window width
//   const isDesktop = windowWidth >= 1024; // lg breakpoint
//   const isTablet = windowWidth >= 768 && windowWidth < 1024; // md to lg
//   const isMobile = windowWidth < 768; // below md

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, []);

//   // Fetch user session and order count on component mount
//   useEffect(() => {
//     // Fetch user session
//     const fetchUserSession = async () => {
//       try {
//         const response = await fetch("/api/auth/session");
//         if (!response.ok) throw new Error("Failed to fetch session");
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Session fetch error:", error);
//       }
//     };

//     // Fetch order count
//     const fetchOrderCount = async () => {
//       try {
//         const response = await fetch("/api/countdonhang");
//         if (!response.ok) throw new Error("Failed to fetch order count");
//         const count = await response.json();
//         setOrderCount(count);
//       } catch (error) {
//         console.error("Order count fetch error:", error);
//       }
//     };

//     // Fetch cart items
//     const fetchCartItems = async () => {
//       try {
//         const response = await fetch("/api/giohang");
//         if (!response.ok) throw new Error("Failed to fetch cart items");
//         const data = await response.json();
//         setCartItems(data);
//       } catch (error) {
//         console.error("Cart items fetch error:", error);
//       }
//     };

//     fetchUserSession();
//     fetchOrderCount();
//     fetchCartItems();
//   }, []);

//   // Logout handler
//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUserData(null);
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white w-full h-20 shadow fixed z-[99]">
//         {/* Mobile Menu Component */}
//         <MobileMenu
//           userData={userData}
//           handleLogout={handleLogout}
//           showMaleDropdown={showMaleDropdown}
//           setShowMaleDropdown={setShowMaleDropdown}
//           showFemaleDropdown={showFemaleDropdown}
//           setShowFemaleDropdown={setShowFemaleDropdown}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//         />

//         {/* Tablet Menu Component */}
//         <TabletMenu
//           userData={userData}
//           orderCount={orderCount}
//           handleLogout={handleLogout}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//           isMobileProfileOpen={isMobileProfileOpen}
//           setIsMobileProfileOpen={setIsMobileProfileOpen}
//         />

//         {/* Desktop Menu Component */}
//         <DesktopMenu
//           userData={userData}
//           orderCount={orderCount}
//           handleLogout={handleLogout}
//           showMaleDropdown={showMaleDropdown}
//           setShowMaleDropdown={setShowMaleDropdown}
//           showFemaleDropdown={showFemaleDropdown}
//           setShowFemaleDropdown={setShowFemaleDropdown}
//         />
//       </div>

//       {/* Desktop Dropdowns Component */}
//       <DesktopDropdowns
//         showMaleDropdown={showMaleDropdown}
//         setShowMaleDropdown={setShowMaleDropdown}
//         showFemaleDropdown={showFemaleDropdown}
//         setShowFemaleDropdown={setShowFemaleDropdown}
//       />

//       {/* Spacer */}
//       <div className="h-20"></div>
//     </div>
//   );
// };

// export default Menu;
