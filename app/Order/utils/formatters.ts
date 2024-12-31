export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  export const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) {
      return "0 đ"; // or return whatever default value you want
    }
    return amount.toLocaleString("vi-VN") + " đ";
  };