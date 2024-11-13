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
