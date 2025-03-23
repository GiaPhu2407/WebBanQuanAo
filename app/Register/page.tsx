"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Mail,
  User,
  Phone,
  Lock,
  MapPin,
  UserCircle,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const RegistrationPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { startUpload } = useUploadThing("imageUploader");

  // Reset progress when a new file is selected
  useEffect(() => {
    if (avatar) {
      setUploadProgress(0);
    }
  }, [avatar]);

  // Simulate upload progress during actual upload
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading && uploadProgress < 90 && avatar) {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90));
      }, 300);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading, uploadProgress, avatar]);

  // Handle avatar selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, GIF, or WEBP).",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setAvatar(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setFormSubmitted(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const fullname = formData.get("fullname") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    // Form validation
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

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      toast({
        title: "Password Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast({
        title: "Email Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Phone validation
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
      setError("Please enter a valid phone number (10-15 digits).");
      toast({
        title: "Phone Error",
        description: "Please enter a valid phone number (10-15 digits).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Avatar upload processing
    let avatarUrl = "";
    if (avatar) {
      try {
        console.log("Uploading avatar...");
        const uploadResponse = await startUpload([avatar]);
        setUploadProgress(100);

        if (uploadResponse && uploadResponse[0]?.url) {
          avatarUrl = uploadResponse[0].url;
          console.log("Avatar uploaded successfully:", avatarUrl);
        } else {
          console.error("Upload response invalid:", uploadResponse);
          toast({
            title: "Upload Failed",
            description: "An error occurred while uploading the image.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
        toast({
          title: "Upload Failed",
          description: "An error occurred while uploading the image.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Submit registration data
    try {
      console.log("Sending registration data with avatar:", avatarUrl);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          fullname,
          phone,
          address: address || "",
          avatar: avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Redirecting to login...",
        variant: "success",
      });

      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
      toast({
        title: "Registration Failed",
        description:
          error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side with image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-8">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Join our community and discover amazing features. Create your
            account today and start your journey with us.
          </p>
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Benefits of joining:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-white">
                <CheckCircle className="mr-2 h-5 w-5 text-green-300" />
                Access to exclusive products and offers
              </li>
              <li className="flex items-center text-white">
                <CheckCircle className="mr-2 h-5 w-5 text-green-300" />
                Track your orders and purchase history
              </li>
              <li className="flex items-center text-white">
                <CheckCircle className="mr-2 h-5 w-5 text-green-300" />
                Faster checkout process for future orders
              </li>
              <li className="flex items-center text-white">
                <CheckCircle className="mr-2 h-5 w-5 text-green-300" />
                Join our loyalty program and earn rewards
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Join us to get started or{" "}
              <Link href="/Login" className="text-blue-600 hover:underline">
                login to your account
              </Link>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Avatar upload with preview */}
              <div className="relative">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div
                      className={`h-24 w-24 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                        avatarPreview
                          ? "border-green-500"
                          : "border-gray-300 border-dashed"
                      }`}
                    >
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          width={96}
                          height={96}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <UserCircle className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="avatar"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                    >
                      <Upload className="h-8 w-8 text-white" />
                    </label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      className="hidden"
                      onChange={handleAvatarChange}
                      accept="image/*"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 inline-block"
                    >
                      {avatarPreview ? "Change Photo" : "Select Photo"}
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG, PNG, GIF up to 5MB
                    </p>
                    {avatar && (
                      <p className="mt-1 text-xs text-gray-700 truncate max-w-xs">
                        {avatar.name}
                      </p>
                    )}
                    {isLoading && avatar && (
                      <div className="mt-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <span className="text-xs text-gray-500">
                          {uploadProgress === 100
                            ? "Upload complete!"
                            : `Uploading... ${uploadProgress}%`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                {/* Email */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/* Username */}
                <div className="relative">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Full Name */}
                <div className="relative">
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      placeholder="Enter your full name"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              {/* Address */}
              <div className="relative">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    className="pl-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a password (min. 8 characters)"
                    className="pl-10 pr-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="relative w-full inline-flex items-center justify-center px-8 py-3 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/Login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default RegistrationPage;
