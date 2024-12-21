export const loginUser = async (usernameOrEmail: string, password: string) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const data = await response.json();
    console.log("data:", data);

    if (response.ok) {
      return {
        status: true,
        data,
      };
    } else {
      return {
        status: false,
        data,
      };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API đăng nhập:", error);
    return null;
  }
};

export const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await fetch("/api/auth/changepass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Password changed successfully",
      };
    } else {
      return {
        success: false,
        message: data.error || "Password change failed",
      };
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    return { success: false, message: "An error occurred while changing password" };
  }
};
