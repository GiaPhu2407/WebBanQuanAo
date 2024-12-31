export const getStatusColor = (status: string): string => {
    const statusColors: { [key: string]: string } = {
      "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
      "Đã xác nhận": "bg-blue-100 text-blue-800",
      "Đang giao": "bg-purple-100 text-purple-800",
      "Đã giao": "bg-green-100 text-green-800",
      "Đã hủy": "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };
  
  export const canDeleteOrder = (status: string): boolean => {
    return status === "Đã hủy" || status === "Đã giao";
  };