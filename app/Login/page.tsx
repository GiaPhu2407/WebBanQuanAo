"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"; // Đảm bảo rằng đường dẫn tới `use-toast` là chính xác
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [error, setError] = useState("");
  const { toast } = useToast(); // Đảm bảo hook này được cấu hình chính xác
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const usernameOrEmail = formData.get("usernameOrEmail")?.toString();
    const password = formData.get("password")?.toString();

    // Kiểm tra xác thực
    if (!usernameOrEmail || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email/username and password.",
        variant: "destructive",
      });
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      // Hiển thị toast thành công và chuyển hướng
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "success",
      });
      router.push("/Show"); // Chuyển hướng tới trang Show
    } catch (error) {
      setError("Invalid credentials");
      toast({
        title: "Login Failed",
        description: "Invalid email/username or password.",
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
                  name="usernameOrEmail"
                  type="text"
                  required
                  className="w-full"
                  placeholder="Enter your email or username"
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
                  name="password"
                  type="password"
                  required
                  className="w-full"
                  placeholder="Enter your password"
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
