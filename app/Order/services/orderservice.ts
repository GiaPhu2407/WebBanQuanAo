import { OrderItem } from "../types";

export const fetchOrders = async (): Promise<OrderItem[]> => {
  const response = await fetch("/api/thanhtoan");
  if (!response.ok) {
    throw new Error("Không thể tải đơn hàng");
  }
  const data = await response.json();
  return data.data || [];
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  const response = await fetch(`/api/donhang/${orderId}/delete`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Không thể xóa đơn hàng");
  }
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  const response = await fetch(`/api/donhang/${orderId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Không thể hủy đơn hàng");
  }
};