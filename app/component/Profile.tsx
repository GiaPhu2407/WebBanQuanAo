"use client";
import React, { useEffect, useState } from "react";

interface IUser {
  idUsers: number;
  Tentaikhoan: string;
  Hoten: string;
  Sdt: string | number;
  Diachi: string;
  Email: string;
  Ngaydangky: string;
}

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);

  // Lấy token từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = window.localStorage.getItem("token");
      setToken(accessToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            const dataError = await res.json();
            setError(dataError.message || "Lỗi khi tải thông tin.");
          }
        } catch (error) {
          setError("Có lỗi xảy ra khi kết nối đến server.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser(); // Gọi hàm fetchUser
    }
  }, [token]);

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto my-8 border border-gray-900 shadow-lg max-w-6xl w-full h-[500px] rounded-xl bg-stone-100 opacity-90">
      <div className="w-full bg-black py-4 rounded-t-lg">
        <h2 className="text-center text-2xl text-white font-semibold">
          Thông Tin Người Dùng
        </h2>
      </div>
      <div className="rounded-b-lg p-6 mt-12">
        {user && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li className="py-5 px-3">
              <label className="font-medium text-gray-950 block text-2xl">
                Tên đăng nhập:
              </label>
              <span className="text-black text-xl pt-2">
                {user.Tentaikhoan}
              </span>
            </li>
            <li className="py-5 px-3">
              <label className="font-medium text-gray-950 block text-2xl">
                Tên đầy đủ:
              </label>
              <span className="text-black text-xl pt-2">{user.Hoten}</span>
            </li>
            <li className="py-5 px-3">
              <label className="font-medium text-gray-950 block text-2xl">
                Địa chỉ:
              </label>
              <span className="text-black text-xl pt-2">{user.Diachi}</span>
            </li>
            <li className="py-5 px-3">
              <label className="font-medium text-gray-950 block text-2xl">
                Số điện thoại:
              </label>
              <span className="text-black text-xl pt-2">{user.Sdt}</span>
            </li>
            <li className="py-5 px-3">
              <label className="font-medium text-gray-950 block text-2xl">
                Email:
              </label>
              <span className="text-black text-xl pt-2">{user.Email}</span>
            </li>
            <li className="py-5 px-3">
              <label className="font-medium text-gray-950 block text-2xl">
                Ngày đăng ký:
              </label>
              <span className="text-black text-xl pt-2">
                {new Date(user.Ngaydangky).toLocaleDateString("vi-VN")}
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
