"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data));

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] bg-cover bg-center opacity-5"></div>

      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden bg-white/5 backdrop-blur-lg shadow-[0_20px_50px_rgba(255,255,255,0.15)] border border-white/10 transform hover:scale-[1.01] transition-all duration-300 ease-out">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-center items-start">
          <div className="relative z-10 space-y-8 transform translate-z-10">
            <h2 className="text-4xl font-bold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
              Chào mừng trở lại!
            </h2>
            <p className="text-white/90 text-lg leading-relaxed text-shadow">
              Đăng nhập để khám phá những sản phẩm tuyệt vời của chúng tôi.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-white/90">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Trải nghiệm nhanh chóng</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm"></div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 p-8">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center transform hover:translate-y-[-5px] transition-transform duration-300">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                Đăng Nhập
              </h1>
              <p className="text-white/80">Vui lòng nhập thông tin của bạn</p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm animate-pulse shadow-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white/90"
                  htmlFor="usernameOrEmail"
                >
                  Email hoặc Tên đăng nhập
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors duration-200" />
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder-white/30 transition-all duration-200 shadow-lg transform hover:translate-y-[-2px]"
                    placeholder="Nhập email hoặc tên đăng nhập"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white/90"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors duration-200" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder-white/30 transition-all duration-200 shadow-lg transform hover:translate-y-[-2px]"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.25)]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng Nhập"
                )}
              </Button>

              <div className="space-y-4 text-center">
                <Link
                  href="/ForgotPassword"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block transform hover:scale-105"
                >
                  Quên mật khẩu?
                </Link>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-white/50">
                      Hoặc
                    </span>
                  </div>
                </div>

                <p className="text-white/80">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/Register"
                    className="text-white hover:text-gray-300 font-medium transition-colors duration-200 transform hover:scale-105 inline-block"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;
