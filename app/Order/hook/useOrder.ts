import { useState, useEffect } from "react";
import { OrderItem } from "../types";
import { toast } from "react-hot-toast";
import { fetchOrders, deleteOrder, cancelOrder } from "../services/orderservice";
import { showConfirmDialog } from "../utils/dialog";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    setupWebSocket();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Có lỗi xảy ra khi tải đơn hàng");
      toast.error("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket("ws://your-websocket-url");
    ws.onmessage = (event) => {
      const updatedOrder: OrderItem = JSON.parse(event.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.iddonhang === updatedOrder.iddonhang ? updatedOrder : order
        )
      );
      toast.success("Đơn hàng đã được cập nhật");
    };
    return () => ws.close();
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmed = await showConfirmDialog("Bạn có chắc muốn xóa đơn hàng này?");
    
    if (confirmed) {
      try {
        await deleteOrder(orderId);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.iddonhang !== orderId)
        );
        toast.success("Đã xóa đơn hàng thành công");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Không thể xóa đơn hàng");
      }
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = await showConfirmDialog("Bạn có chắc muốn hủy đơn hàng này?");
    
    if (confirmed) {
      try {
        await cancelOrder(orderId);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.iddonhang !== orderId)
        );
        toast.success("Đã hủy đơn hàng thành công");
      } catch (error) {
        console.error("Error canceling order:", error);
        toast.error("Không thể hủy đơn hàng");
      }
    }
  };

  return {
    orders,
    loading,
    error,
    handleCancelOrder,
    handleDeleteOrder,
  };
};