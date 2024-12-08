// "use client";
// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import { FaBagShopping } from "react-icons/fa6";
// import { FaMars, FaVenus } from "react-icons/fa";
// import { User } from "@/app/types/auth";
// import {
//   HoverCard,
//   HoverCardTrigger,
//   HoverCardContent,
// } from "@/components/ui/hover-card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { MenuIcon } from "lucide-react";
// interface Product {
//   idsanpham: number;
//   tensanpham: string;
//   hinhanh: string;
//   gia: number;
//   mota: string;
//   idloaisanpham: number;
//   giamgia: number;
//   gioitinh: boolean;
//   size: string;
// }
// interface CartItem {
//   idgiohang: number;
//   idsanpham: number;
//   soluong: number;
//   sanpham: {
//     tensanpham: string;
//     mota: string;
//     gia: number;
//     hinhanh: string | string[];
//     giamgia: number;
//     gioitinh: boolean; // true for "Nam", false for "Nữ"
//     size: string;
//   };
// }

// const Menu = () => {
//   const [showMaleDropdown, setShowMaleDropdown] = useState(false);
//   const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
//   // const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<any>();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const cartItemCount = cartItems?.length || 0;
//   const cartSubtotal = Array.isArray(cartItems) ? cartItems.reduce(
//     (total, item) => total + ((item?.idsanpham?.gia || 0) * (item?.soluong || 0)),
//     0
//   ) : 0;

//   // useEffect(() => {
//   //   const storedUserData = localStorage.getItem("userData");
//   //   if (storedUserData) {
//   //     setUserData(JSON.parse(storedUserData));
//   //   } else {
//   //     fetch("/api/auth/session")
//   //       .then((response) => {
//   //         if (!response.ok) throw new Error("Failed to fetch session");
//   //         return response.json();
//   //       })
//   //       .then((data) => setUserData(data))
//   //       .catch((error) => console.error("Failed to fetch session", error));
//   //   }
//   // }, []);
//   useEffect(() => {
//     fetch("/api/auth/session")
//       .then((response) => {
//         if (!response.ok) throw new Error("Failed to fetch session");
//         return response.json();
//       })
//       .then((data) => {
//         setUserData(data);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch session", error);
//       });
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUserData(null);
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };
//   // const [userData, setUserData] = useState<any>()
//   // useEffect(() => {
//   //   setUserData(JSON.parse(localStorage.getItem('userData') as string))
//   // },[])
//   // function onLogout() {
//   //   localStorage.removeItem('userData')
//   //   setUserData(undefined)
//   // }
//   return (
//     <div>
//       <div className="bg-white w-full h-20 shadow fixed z-[99]">
//         <div className="flex items-center justify-center h-full">
//           {/* Existing menu items */}
//           <div className="flex gap-10 content-center">
//             <ul className="flex gap-10 content-center ">
//               <li>
//                 <Link href={""}>Sale</Link>
//               </li>
//               <li>
//                 <Link href={""}>Mới về</Link>
//               </li>
//               <li>
//                 <Link href={""}>Bán chạy</Link>
//               </li>
//               <li
//                 onMouseEnter={() => {
//                   setShowMaleDropdown(true);
//                   setShowFemaleDropdown(false);
//                 }}
//               >
//                 <span className="relative cursor-pointer group">
//                   <FaMars className="inline mr-1 mb-[3px]" />
//                   Nam
//                   <span className="absolute left-0 bottom-0 h-0.5 w-full bg-black transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
//                 </span>
//               </li>
//               <li
//                 onMouseEnter={() => {
//                   setShowFemaleDropdown(true);
//                   setShowMaleDropdown(false);
//                 }}
//               >
//                 <span className="relative cursor-pointer group">
//                   <FaVenus className="inline mr-1 mb-[3px]" />
//                   Nữ
//                   <span className="absolute left-0 bottom-0 h-0.5 w-full bg-pink-500 border-dotted transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
//                 </span>
//               </li>
//               <li>
//                 <Link href={""}>Trẻ Em</Link>
//               </li>
//               <li>
//                 <Link href={""}>Bộ sưu tập</Link>
//               </li>
//               <li>
//                 <Link href={""}>Đồng phục</Link>
//               </li>
//               <li>
//                 <Link href={""}>Tin Hot</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Search bar */}
//           <label className="input input-bordered flex items-center gap-2 ml-3">
//             <input
//               type="text"
//               className="grow rounded-full w-32 h-10"
//               placeholder="Search"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 16 16"
//               fill="currentColor"
//               className="h-4 w-4 opacity-70"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </label>

//           {/* Shopping cart */}
//           <div className="dropdown dropdown-end">
//                 <div
//                   tabIndex={0}
//                   role="button"
//                   className="btn btn-ghost btn-circle"
//                 >
//                   <div className="indicator">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                       />
//                     </svg>
//                     <span className="badge badge-sm indicator-item">
//                       {cartItemCount}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Cart items dropdown content */}
//                 <div
//                   tabIndex={0}
//                   className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
//                 >
//                   <div className="card-body">
//                     <span className="text-lg font-bold">
//                       {cartItemCount} Items
//                     </span>
//                     <span className="text-info">
//                       Subtotal: ${cartSubtotal.toFixed(2)}
//                     </span>
//                     <div className="card-actions">
//                       <Link href="/Cart" className="btn btn-primary btn-block">
//                         View cart
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//           {/* User Avatar with Tooltip */}
//           <div className="flex items-center gap-4">
//             {userData ? (
//               <div>
//                 {/* Thẻ hover để hiển thị thông tin người dùng */}
//                 <HoverCard>
//                   <HoverCardTrigger asChild>
//                     <div className="flex items-center gap-2 cursor-pointer">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage
//                           src="https://github.com/shadcn.png"
//                           alt={userData?.Hoten || "User"}
//                         />
//                         <AvatarFallback>
//                           {userData?.Hoten ? userData.Hoten[0] : "JP"}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="hidden md:block text-sm font-medium">
//                         {userData?.Hoten}
//                       </div>
//                       <Button variant="destructive" onClick={handleLogout}>
//                         Logout
//                       </Button>
//                     </div>
//                   </HoverCardTrigger>
//                   <HoverCardContent className="w-64">
//                     <div className="flex flex-col gap-2">
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-12 w-12">
//                           <AvatarImage
//                             src="https://github.com/shadcn.png"
//                             alt={userData?.Hoten || "User"}
//                           />
//                           <AvatarFallback>
//                             {userData?.Hoten ? userData.Hoten[0] : "JP"}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="grid gap-0.5">
//                           <div className="text-sm font-medium">
//                             {userData?.Hoten}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             {userData?.Email}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <Link
//                           href="/Show/ShowProfile"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           Profile
//                         </Link>
//                         {userData.role?.Tennguoidung === "Admin" && (
//                           <Link
//                             href="/Admin"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             Dashboard
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   </HoverCardContent>
//                 </HoverCard>
//               </div>
//             ) : (
//               <div>
//                 {/* Các nút cho người dùng chưa đăng nhập */}
//                 <Link href={"/contact"}>
//                   <Button variant="outline" className="me-2">
//                     Contact
//                   </Button>
//                 </Link>
//                 <Link href={"/auth/login"}>
//                   <Button variant="ghost">Login</Button>
//                 </Link>
//                 <Link href={"/auth/register"}>
//                   <Button variant="destructive" className="ms-2">
//                     Register
//                   </Button>
//                 </Link>
//               </div>
//             )}

//             {/* Nút menu dành cho màn hình nhỏ */}
//             <Button variant="ghost" size="icon" className="md:hidden">
//               <MenuIcon className="h-6 w-6" />
//               <span className="sr-only">Toggle menu</span>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Spacer to push content down */}
//       <div className="h-20"></div>

//       {/* Dropdown for "Nam" */}
//       <div
//         onMouseLeave={() => setShowMaleDropdown(false)}
//         className={`${
//           showMaleDropdown
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 -translate-y-full"
//         } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20`}
//       >
//         <div className="flex gap-11 justify-center items-start mt-4">
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Áo</p>
//             <ul>
//               <li>Áo polo</li>
//               <li>Áo thun</li>
//               <li>Áo sơ mi</li>
//               <li>Áo khoác</li>
//               <li>Áo hoodie - Áo nỉ</li>
//             </ul>
//           </div>
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Quần</p>
//             <ul>
//               <li>Quần jeans</li>
//               <li>Quần âu</li>
//               <li>Quần kaki</li>
//               <li>Quần dài</li>
//               <li>Quần short</li>
//               <li>Quần nỉ</li>
//             </ul>
//           </div>
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Đồ Bộ</p>
//             <ul>
//               <li>Đồ bộ ngắn tay</li>
//               <li>Đồ bộ dài tay</li>
//             </ul>
//             <p className="mb-2 font-semibold mt-10">Đồ mặc trong</p>
//             <ul>
//               <li>Áo ba lỗ</li>
//               <li>Quần lót</li>
//             </ul>
//           </div>
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Đồ Thể Thao Nam</p>
//             <ul>
//               <li>Áo thun thể thao</li>
//               <li>Áo polo thể thao</li>
//               <li>Quần Thể Thao</li>
//               <li>Bộ Thể Thao</li>
//             </ul>
//           </div>
//           <div>
//             <img
//               src="https://yody.vn/images/menu-desktop/menu_man.png"
//               alt=""
//               className="w-56 h-32"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Dropdown for "Nữ" */}
//       <div
//         onMouseLeave={() => setShowFemaleDropdown(false)}
//         className={`${
//           showFemaleDropdown
//             ? "opacity-100 translate-y-0 "
//             : "opacity-0 -translate-y-full"
//         } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20`}
//       >
//         <div className="flex gap-11 justify-center items-start mt-4">
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Áo</p>
//             <ul>
//               <li>Áo polo</li>
//               <li>Áo thun</li>
//               <li>Áo sơ mi</li>
//               <li>Áo khoác</li>
//               <li>Áo hoodie - Áo nỉ</li>
//             </ul>
//           </div>
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Quần</p>
//             <ul>
//               <li>Quần jeans</li>
//               <li>Quần âu</li>
//               <li>Quần kaki</li>
//               <li>Quần dài</li>
//               <li>Quần short</li>
//               <li>Quần nỉ</li>
//             </ul>
//           </div>
//           <div className="flex flex-col items-center border-r h-48 pr-4">
//             <p className="mb-2 font-semibold">Đồ Bộ</p>
//             <ul>
//               <li>Đồ bộ ngắn tay</li>
//               <li>Đồ bộ dài tay</li>
//             </ul>
//             <p className="mb-2 font-semibold mt-10">Đồ mặc trong</p>
//             <ul>
//               <li>Áo ba lỗ</li>
//               <li>Quần lót</li>
//             </ul>
//           </div>
//           <div>
//             <img
//               src="https://yody.vn/images/menu-desktop/menu_woman.png"
//               alt=""
//               className="w-56 h-32"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Menu;



"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaMars, 
  FaVenus, 
  FaShoppingCart, 
  FaSearch 
} from "react-icons/fa";
import { MenuIcon } from "lucide-react";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Interfaces for type safety
interface User {
  id: number;
  Hoten: string;
  Email: string;
  role?: {
    Tennguoidung: string;
  };
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
}

const Menu: React.FC = () => {
  // State management
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user session and cart data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Session fetch error:", error);
      }
    };

    const fetchCartData = async () => {
      try {
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };

    fetchUserData();
    fetchCartData();
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

  // Computed values
  // const cartItemCount = cartItems.length;
  // const cartSubtotal = cartItems.reduce(
  //   (total, item) => total + (item.product.price * item.quantity), 
  //   0
  // );

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Your Store
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex space-x-6">
          <NavLink href="/sale">Sale</NavLink>
          <NavLink href="/new-arrivals">Mới về</NavLink>
          
          <div 
            onMouseEnter={() => {
              setShowMaleDropdown(true);
              setShowFemaleDropdown(false);
            }}
            className="relative group"
          >
            <span className="flex items-center cursor-pointer">
              <FaMars className="mr-1" />
              Nam
            </span>
            {showMaleDropdown && <MaleDropdown />}
          </div>

          <div 
            onMouseEnter={() => {
              setShowFemaleDropdown(true);
              setShowMaleDropdown(false);
            }}
            className="relative group"
          >
            <span className="flex items-center cursor-pointer">
              <FaVenus className="mr-1" />
              Nữ
            </span>
            {showFemaleDropdown && <FemaleDropdown />}
          </div>

          <NavLink href="/children">Trẻ Em</NavLink>
          <NavLink href="/collections">Bộ sưu tập</NavLink>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered rounded-full px-4 py-2 w-48"
            />
            <button type="submit" className="absolute right-3 top-3">
              <FaSearch />
            </button>
          </form>

          {/* Shopping Cart */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <FaShoppingCart className="w-5 h-5" />
                
              
              </div>
            </div>
            {/* <CartDropdown 
              items={cartItems}  */}
              {/* // total={}  */}
            {/* /> */}
          </div>

          {/* User Profile */}
          {userData ? (
            <UserProfileMenu 
              user={userData} 
              onLogout={handleLogout} 
            />
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </nav>
  );
};

// Sub-components
const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ 
  href, 
  children 
}) => (
  <Link 
    href={href} 
    className="text-gray-700 hover:text-primary transition-colors"
  >
    {children}
  </Link>
);

const MaleDropdown: React.FC = () => (
  <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-6 w-64">
    {/* Male category dropdown content */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Áo</h4>
        <ul>
          {["Áo polo", "Áo thun", "Áo sơ mi"].map((item) => (
            <li key={item} className="text-sm hover:text-primary">
              <Link href={`/male/${item.toLowerCase().replace(' ', '-')}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Add more columns as needed */}
    </div>
  </div>
);

const FemaleDropdown: React.FC = () => (
  <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-6 w-64">
    {/* Female category dropdown content */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Áo</h4>
        <ul>
          {["Áo polo", "Áo thun", "Áo sơ mi"].map((item) => (
            <li key={item} className="text-sm hover:text-primary">
              <Link href={`/female/${item.toLowerCase().replace(' ', '-')}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Add more columns as needed */}
    </div>
  </div>
);

const CartDropdown: React.FC<{ 
  items: CartItem[], 
  total: number 
}> = ({ items, total }) => (
  <div className="dropdown-content card card-compact bg-base-100 w-52 shadow z-20">
    <div className="card-body">
      <span className="text-lg font-bold">{items.length} Sản phẩm</span>
      <span className="text-info">Tổng: {total.toLocaleString()}đ</span>
      <div className="card-actions z-10">
        <Link href="/component/shopping" className="btn btn-primary btn-block">
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  </div>
);

const UserProfileMenu: React.FC<{ 
  user: User, 
  onLogout: () => void 
}> = ({ user, onLogout }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="flex items-center cursor-pointer">
        <Avatar>
          <AvatarImage 
            src={`https://ui-avatars.com/api/?name=${user.Hoten}`} 
            alt={user.Hoten} 
          />
          <AvatarFallback>{user.Hoten[0]}</AvatarFallback>
        </Avatar>
      </div>
    </HoverCardTrigger>
    <HoverCardContent>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage 
              src={`https://ui-avatars.com/api/?name=${user.Hoten}`} 
              alt={user.Hoten} 
            />
            <AvatarFallback>{user.Hoten[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{user.Hoten}</div>
            <div className="text-sm text-gray-500">{user.Email}</div>
          </div>
        </div>
        <div className="space-y-2">
          <Link 
            href="/profile" 
            className="block py-2 hover:bg-gray-100 rounded"
          >
            Hồ sơ của tôi
          </Link>
          {user.role?.Tennguoidung === "Admin" && (
            <Link 
              href="/admin" 
              className="block py-2 hover:bg-gray-100 rounded"
            >
              Quản trị
            </Link>
          )}
          <button 
            onClick={onLogout} 
            className="w-full text-left py-2 hover:bg-gray-100 rounded text-red-500"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

const AuthButtons: React.FC = () => (
  <div className="space-x-2">
    <Link href="/login">
      <Button variant="outline">Đăng nhập</Button>
    </Link>
    <Link href="/register">
      <Button variant="default">Đăng ký</Button>
    </Link>
  </div>
);

export default Menu;