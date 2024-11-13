"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser } from "../api/auth/(functions)/function";
loginUser;

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { usernameOrEmail, password } = formData;

    // Kiểm tra đầu vào
    if (!usernameOrEmail || !password) {
      setError("Please fill in both email and password.");
      toast({
        title: "Validation Error!",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      return;
    }

    setError(""); // Xóa lỗi khi nhập đầy đủ thông tin
    try {
      const res = await loginUser(usernameOrEmail, password);
      if (res?.status) {
        localStorage.setItem("userData", JSON.stringify(res.data));
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
          variant: "success",
        });
        router.push("/Show");
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Login failed - Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
      <div className="w-full max-w-md px-4">
        <Card className="w-full backdrop-blur-sm bg-white/90 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Login now!
            </CardTitle>
            <p className="text-sm text-center text-gray-600">
              Join us to explore our amazing products and services.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="usernameOrEmail"
                >
                  Email or Username
                </label>
                <Input
                  id="usernameOrEmail"
                  name="usernameOrEmail" // Gắn name trùng với formData
                  type="text"
                  required
                  className="w-full"
                  placeholder="Enter your email or username"
                  value={formData.usernameOrEmail} // Gắn giá trị của formData.email vào value
                  onChange={handleChange} // Đảm bảo onChange được gọi khi nhập liệu
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password" // Gắn name trùng với formData
                  type="password"
                  required
                  className="w-full"
                  placeholder="Enter your password"
                  value={formData.password} // Gắn giá trị của formData.password vào value
                  onChange={handleChange} // Đảm bảo onChange được gọi khi nhập liệu
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
              >
                Login
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Register Here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
