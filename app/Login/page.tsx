"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserCircle2, Lock, UserCircle } from "lucide-react";
import { loginUser } from "../api/auth/(functions)/function";
import { Toaster } from "@/components/ui/toaster";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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

    // Validation check
    if (!usernameOrEmail || !password) {
      setError("Vui lòng nhập email/tên đăng nhập và mật khẩu.");
      toast({
        title: "Lỗi Xác Thực!",
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await loginUser(usernameOrEmail, password);
      if (res?.status) {
        // Lưu token và thông tin người dùng
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data));

        // Điều hướng dựa trên vai trò
        if (res.data.role === "Admin") {
          toast({
            title: "Đăng Nhập Thành Công!",
            description: "Chào mừng quản trị viên!",
            variant: "success",
          });
          router.push("/Admin");
        } else {
          toast({
            title: "Đăng Nhập Thành Công!",
            description: "Chào mừng bạn quay trở lại!",
            variant: "success",
          });
          router.push("/Show");
        }
      } else {
        setError("Thông tin đăng nhập không chính xác");
        toast({
          title: "Đăng Nhập Thất Bại",
          description: "Vui lòng kiểm tra lại email/tên đăng nhập và mật khẩu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError("Đã xảy ra lỗi trong quá trình đăng nhập");
      toast({
        title: "Lỗi!",
        description: "Đăng nhập thất bại - Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <Card className="w-full bg-white shadow-lg border-0 rounded-2xl">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-4xl font-bold text-gray-800">
              Đăng Nhập
            </CardTitle>
            <p className="text-gray-600">
              Chào mừng bạn quay trở lại! Vui lòng nhập thông tin.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md animate-pulse">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="usernameOrEmail"
                >
                  Email hoặc Tên đăng nhập
                </label>
                <Input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  required
                  disabled={isLoading}
                  className="w-full border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-200"
                  placeholder="Nhập email hoặc tên đăng nhập"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="w-full border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-200"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng Nhập"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/Register"
                    className="text-gray-800 hover:text-gray-900 font-semibold transition-colors"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default LoginPage;
