export function calculateDeliveryDate(): Date {
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + Math.floor(Math.random() * 4) + 3);
    deliveryDate.setHours(8 + Math.floor(Math.random() * 4), 0, 0, 0);
    return deliveryDate;
  }