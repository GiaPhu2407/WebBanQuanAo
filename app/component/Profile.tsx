"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserCircle,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import Footer from "./Footer";
import { User } from "../types/auth";
import Header from "./Header";
import { useUploadThing } from "@/lib/uploadthing";

// Validation function
const validateForm = (formData: any) => {
  const errors: { [key: string]: string } = {};

  if (!formData.Tentaikhoan.trim()) {
    errors.Tentaikhoan = "Tên tài khoản không được để trống";
  }

  if (!formData.Email.trim()) {
    errors.Email = "Email không được để trống";
  } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
    errors.Email = "Email không hợp lệ";
  }

  if (!formData.Hoten.trim()) {
    errors.Hoten = "Họ tên không được để trống";
  }

  if (!formData.Sdt.trim()) {
    errors.Sdt = "Số điện thoại không được để trống";
  } else if (!/^\d{10}$/.test(formData.Sdt)) {
    errors.Sdt = "Số điện thoại không hợp lệ (phải có 10 chữ số)";
  }

  return errors;
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Avatar related states
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload } = useUploadThing("imageUploader");

  const [formData, setFormData] = useState({
    Tentaikhoan: "",
    Email: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
    MatKhau: "", // Optional password field for changes
    avatar: "", // Field for avatar URL - lowercase to match database
  });

  // Reset progress when a new file is selected
  useEffect(() => {
    if (avatar) {
      setUploadProgress(0);
    }
  }, [avatar]);

  // Simulate upload progress during actual upload
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isSubmitting && uploadProgress < 90 && avatar) {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90));
      }, 300);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isSubmitting, uploadProgress, avatar]);

  // Fetch user data function that can be reused
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Prevent caching
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      if (!userData || !userData.idUsers) {
        router.push("/Login");
        return;
      }

      // Update user state
      setUser(userData);

      // Update form data using the correct field names
      setFormData({
        Tentaikhoan: userData.Tentaikhoan || "",
        Email: userData.Email || "",
        Hoten: userData.Hoten || "",
        Sdt: userData.Sdt || "",
        Diachi: userData.Diachi || "",
        MatKhau: "", // Clear password field
        avatar: userData.avatar || "",
      });

      // Set avatar preview with cache busting
      if (userData.avatar) {
        // Add a timestamp query parameter to force browser to reload the image
        setAvatarPreview(`${userData.avatar}?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage("Lỗi tải dữ liệu người dùng");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUserData();
  }, [router]);

  // Handle avatar selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setMessage("Vui lòng chọn file hình ảnh (JPEG, PNG, GIF, hoặc WEBP)");
        setMessageType("error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Vui lòng chọn ảnh nhỏ hơn 5MB");
        setMessageType("error");
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
      // Don't reset avatarPreview to keep showing current avatar
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);

    // If there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (!user?.idUsers) {
      setMessage("Không tìm thấy ID người dùng");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle avatar upload if a new avatar is selected
      let avatarUrl = formData.avatar || "";
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
            setMessage("Có lỗi xảy ra khi tải ảnh lên");
            setMessageType("error");
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          console.error("Avatar upload error:", error);
          setMessage("Có lỗi xảy ra khi tải ảnh lên");
          setMessageType("error");
          setIsSubmitting(false);
          return;
        }
      }

      // Update formData with new avatar URL - using lowercase 'avatar' to match database
      const updatedFormData = {
        ...formData,
        avatar: avatarUrl, // Using lowercase 'avatar' to match database
      };

      const response = await fetch(`/api/user/${user.idUsers}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Cập nhật hồ sơ không thành công"
        );
      }

      // Update user state with new data
      setUser((prev) => ({
        ...prev!,
        ...updatedFormData,
      }));

      // Update form data with the new avatar URL
      setFormData(updatedFormData);

      // Force refresh the avatar preview to ensure it displays the new image
      // Add a timestamp to force a cache refresh
      setAvatarPreview(`${avatarUrl}?t=${new Date().getTime()}`);

      // Clear password field after successful update
      setFormData((prev) => ({
        ...prev,
        MatKhau: "",
      }));

      setMessage("Cập nhật hồ sơ thành công!");
      setMessageType("success");
      setIsEditing(false);

      // Reload user data from server to ensure all data is fresh
      await fetchUserData();
    } catch (error: any) {
      console.error("Update error:", error);
      setMessage(error.message || "Cập nhật hồ sơ không thành công");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Thông tin cá nhân
              </h1>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  // Reset form when canceling edit
                  if (isEditing) {
                    setFormData({
                      Tentaikhoan: user?.Tentaikhoan || "",
                      Email: user?.Email || "",
                      Hoten: user?.Hoten || "",
                      Sdt: user?.Sdt || "",
                      Diachi: user?.Diachi || "",
                      MatKhau: "",
                      avatar: user?.avatar || "", // Using lowercase 'avatar' to match database
                    });
                    setFormErrors({});
                    setAvatar(null);
                    // Refresh avatar preview with cache busting
                    if (user?.avatar) {
                      setAvatarPreview(
                        `${user.avatar}?t=${new Date().getTime()}`
                      );
                    } else {
                      setAvatarPreview(null);
                    }
                  }
                }}
                className={`px-4 py-2 rounded-md ${
                  isEditing
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors`}
                disabled={isSubmitting}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 p-4 rounded-md flex items-center gap-2 ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar upload with preview */}
              <div className="flex flex-col items-center mb-6">
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
                        unoptimized={true} // Prevents Next.js from optimizing/caching the image
                        key={avatarPreview} // Force re-render when preview changes
                      />
                    ) : (
                      <UserCircle className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <label
                        htmlFor="avatar"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                      >
                        <Upload className="h-8 w-8 text-white" />
                      </label>
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        className="hidden"
                        onChange={handleAvatarChange}
                        accept="image/*"
                        disabled={isSubmitting}
                      />
                    </>
                  )}
                </div>

                {avatar && isEditing && (
                  <div className="flex flex-col items-center mt-2">
                    <p className="text-sm text-gray-600 mb-1">
                      {avatar.name.length > 20
                        ? `${avatar.name.substring(0, 20)}...`
                        : avatar.name}
                    </p>
                    {isSubmitting && (
                      <div className="w-48">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {uploadProgress === 100
                            ? "Tải lên hoàn tất!"
                            : `Đang tải... ${uploadProgress}%`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    name="Tentaikhoan"
                    value={formData.Tentaikhoan}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSubmitting}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.Tentaikhoan
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                  />
                  {formErrors.Tentaikhoan && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.Tentaikhoan}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSubmitting}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.Email ? "border-red-500" : "border-gray-300"
                    } bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                  />
                  {formErrors.Email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.Email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="Hoten"
                    value={formData.Hoten}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSubmitting}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.Hoten ? "border-red-500" : "border-gray-300"
                    } bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                  />
                  {formErrors.Hoten && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.Hoten}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="Sdt"
                    value={formData.Sdt}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSubmitting}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.Sdt ? "border-red-500" : "border-gray-300"
                    } bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                  />
                  {formErrors.Sdt && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.Sdt}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="Diachi"
                    value={formData.Diachi}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSubmitting}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                {isEditing && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu (để trống nếu không muốn thay đổi)
                    </label>
                    <input
                      type="password"
                      name="MatKhau"
                      value={formData.MatKhau}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu mới (nếu muốn)"
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
