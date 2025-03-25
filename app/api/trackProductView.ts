// Hàm này sẽ được gọi khi người dùng xem một sản phẩm
export const trackProductView = async (productId: number, userId: number) => {
  try {
    const response = await fetch("/api/userbehavior", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        action: "view", // Lưu hành động "view"
      }),
    });

    if (response.ok) {
      console.log("Hành vi xem sản phẩm đã được theo dõi");
    } else {
      console.error("Không thể theo dõi hành vi", await response.json());
    }
  } catch (error) {
    console.error("Lỗi khi gọi API theo dõi hành vi:", error);
  }
};
