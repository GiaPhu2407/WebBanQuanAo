"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RegistrationPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    // Basic validation
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const fullname = formData.get("fullname");
    const phone = formData.get("phone");

    if (!email || !username || !password || !fullname || !phone) {
      setError("Please fill in all required fields.");
      toast({
        title: "Validation Error!",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          fullname: fullname,
          phone: phone,
          address: formData.get("address"),
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please login.",
        variant: "success",
      });

      // Delay redirect slightly to allow toast to be seen
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (error) {
      setError("Registration failed. Please try again.");
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with image */}
      <div className="bg-gradient-to-r from-pink-300 to-blue-400 flex-1 flex items-center justify-center hidden md:flex">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Register Now</h1>
          <p className="text-lg">
            Join us to explore our amazing products and services.
          </p>
        </div>
      </div>

      {/* Registration form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-3 w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
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
      <Toaster />
    </div>
  );
};

export default RegistrationPage;
