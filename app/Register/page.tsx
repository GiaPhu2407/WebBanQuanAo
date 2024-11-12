"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  // AlertDialog,
  // AlertDialogAction,
} from "@/components/ui/alert";

const RegistrationPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          username: formData.get("username"),
          password: formData.get("password"),
          fullname: formData.get("fullname"),
          phone: formData.get("phone"),
          address: formData.get("address"),
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      router.push("/Login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Phần hình ảnh */}
      <div className="bg-gradient-to-r from-pink-300 to-blue-400 flex-1 flex items-center justify-center hidden md:flex">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Register Now</h1>
          <p className="text-lg">
            Join us to explore our amazing products and services.
          </p>
        </div>
      </div>

      {/* Phần form đăng ký */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
          {error && (
            <Alert status="error" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-10">
              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-10">
              <div>
                <label htmlFor="fullname" className="block font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block font-medium mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Address"
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-3 w-full"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{" "}
              <Link href="/Login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
