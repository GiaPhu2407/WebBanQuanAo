import nodemailer from "nodemailer";
import { formatCurrency } from "@/app/component/utils/currency";
import prisma from "@/prisma/client";

// Create transporter with detailed configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  debug: true, // Enable debug logs
});

interface OrderItem {
  idsanpham: number;
  soluong: number;
  dongia: number;
  sanpham: {
    Tensanpham: string;
    hinhanh: string;
    gia: number;
    giamgia?: number | null;
  };
  size?: {
    idSize: number;
    tenSize: string;
  } | null;
}

interface Address {
  idDiaChi: number;
  tenNguoiNhan: string;
  soDienThoai: string;
  diaChiChiTiet: string;
  phuongXa: string;
  quanHuyen: string;
  thanhPho: string;
}

interface Payment {
  idthanhtoan: number;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: Date | null;
  hinhanhthanhtoan?: string | null;
}

export interface OrderDetails {
  iddonhang: number;
  ngaydat: Date | null;
  tongsotien: number;
  tongsoluong: number | null;
  trangthai: string | null;
  discountValue?: number;
  items: OrderItem[];
  paymentMethod: string;
  shippingAddress: Address;
  discount?: {
    code: string;
    discountType: string;
    value: number;
  } | null;
  payment?: Payment;
}

export async function sendOrderConfirmationEmail(
  email: string,
  order: OrderDetails
) {
  // Check credentials
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Gmail credentials not configured");
    throw new Error("Email configuration missing");
  }

  console.log("Attempting to send order confirmation email to:", email);
  console.log("Using Gmail account:", process.env.GMAIL_USER);

  // Format payment method for display
  const paymentMethodText = getPaymentMethodText(order.paymentMethod);

  // Calculate original total before discount
  const originalTotal = order.discountValue
    ? Number(order.tongsotien) + Number(order.discountValue)
    : Number(order.tongsotien);

  // Generate HTML for order items
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center;">
          <img src="${item.sanpham.hinhanh}" alt="${
        item.sanpham.Tensanpham
      }" style="width: 60px; height: 60px; object-fit: cover; margin-right: 12px; border-radius: 4px;">
          <div>
            <p style="margin: 0; font-weight: 500;">${
              item.sanpham.Tensanpham
            }</p>
            ${
              item.size
                ? `<p style="margin: 0; color: #64748b; font-size: 14px;">Size: ${item.size.tenSize}</p>`
                : ""
            }
            <p style="margin: 0; color: #64748b; font-size: 14px;">Số lượng: ${
              item.soluong
            }</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 500;">
        ${formatCurrency(item.dongia * item.soluong)}
      </td>
    </tr>
  `
    )
    .join("");

  // Generate discount information if applicable
  const discountInfo =
    order.discountValue && order.discountValue > 0
      ? `
      <tr>
        <td style="padding: 12px; text-align: right; font-weight: 500;">Giảm giá${
          order.discount ? ` (${order.discount.code})` : ""
        }:</td>
        <td style="padding: 12px; text-align: right; font-weight: 500; color: #16a34a;">-${formatCurrency(
          Number(order.discountValue)
        )}</td>
      </tr>
    `
      : "";

  const mailOptions = {
    from: `"GiPuDiHi Shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Xác nhận đơn hàng #${order.iddonhang}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2563eb; margin: 0;">Cảm ơn bạn đã đặt hàng!</h1>
          <p style="color: #64748b; margin-top: 8px;">Đơn hàng của bạn đã được xác nhận</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Thông tin đơn hàng #${
            order.iddonhang
          }</h2>
          <p style="margin: 4px 0; color: #334155;"><strong>Ngày đặt:</strong> ${
            order.ngaydat
              ? new Date(order.ngaydat).toLocaleString("vi-VN")
              : "N/A"
          }</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Trạng thái:</strong> ${
            order.trangthai || "Đang xử lý"
          }</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Phương thức thanh toán:</strong> ${paymentMethodText}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Địa chỉ giao hàng</h2>
          <p style="margin: 4px 0; color: #334155;"><strong>${
            order.shippingAddress.tenNguoiNhan
          }</strong></p>
          <p style="margin: 4px 0; color: #334155;">${
            order.shippingAddress.soDienThoai
          }</p>
          <p style="margin: 4px 0; color: #334155;">${
            order.shippingAddress.diaChiChiTiet
          }, ${order.shippingAddress.phuongXa}, ${
      order.shippingAddress.quanHuyen
    }, ${order.shippingAddress.thanhPho}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Chi tiết đơn hàng</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Sản phẩm</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 500;">Tạm tính:</td>
                <td style="padding: 12px; text-align: right; font-weight: 500;">${formatCurrency(
                  originalTotal
                )}</td>
              </tr>
              ${discountInfo}
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 500;">Phí vận chuyển:</td>
                <td style="padding: 12px; text-align: right; font-weight: 500; color: #16a34a;">Miễn phí</td>
              </tr>
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px;">Tổng cộng:</td>
                <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: #2563eb;">${formatCurrency(
                  Number(order.tongsotien)
                )}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Thông tin vận chuyển</h2>
          <p style="margin: 4px 0; color: #334155;">Đơn hàng của bạn sẽ được giao trong vòng 3-5 ngày làm việc.</p>
          <p style="margin: 4px 0; color: #334155;">Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi".</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Cần hỗ trợ?</h2>
          <p style="margin: 4px 0; color: #334155;">Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại dưới đây:</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Email:</strong> support@gipudihi.com</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Điện thoại:</strong> 1900 1234</p>
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          <p style="margin: 4px 0;">© 2025 GiPuDiHi Shop. Tất cả các quyền được bảo lưu.</p>
          <p style="margin: 4px 0;">Đây là email tự động, vui lòng không trả lời email này.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log(
      "Sending email with options:",
      JSON.stringify(mailOptions, null, 2)
    );
    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully:", info.response);

    // Create notification for email sent
    try {
      await prisma.notification.create({
        data: {
          idUsers: order.iddonhang, // Assuming this is the user ID
          title: "Email xác nhận đã gửi",
          message: `Email xác nhận đơn hàng #${order.iddonhang} đã được gửi đến ${email}`,
          type: "email",
          idDonhang: order.iddonhang,
          isRead: false,
          createdAt: new Date(),
        },
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return true;
  } catch (error) {
    console.error("Detailed email send error:", error);
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  order: OrderDetails
) {
  // Check credentials
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Gmail credentials not configured");
    throw new Error("Email configuration missing");
  }

  console.log("Attempting to send order status update email to:", email);

  // Format payment method for display
  const paymentMethodText = getPaymentMethodText(order.paymentMethod);

  // Generate HTML for order items
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center;">
          <img src="${item.sanpham.hinhanh}" alt="${
        item.sanpham.Tensanpham
      }" style="width: 60px; height: 60px; object-fit: cover; margin-right: 12px; border-radius: 4px;">
          <div>
            <p style="margin: 0; font-weight: 500;">${
              item.sanpham.Tensanpham
            }</p>
            ${
              item.size
                ? `<p style="margin: 0; color: #64748b; font-size: 14px;">Size: ${item.size.tenSize}</p>`
                : ""
            }
            <p style="margin: 0; color: #64748b; font-size: 14px;">Số lượng: ${
              item.soluong
            }</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 500;">
        ${formatCurrency(item.dongia * item.soluong)}
      </td>
    </tr>
  `
    )
    .join("");

  // Get status color and message based on order status
  let statusColor = "#2563eb"; // Default blue
  let statusMessage = "Đơn hàng của bạn đang được xử lý.";

  if (order.trangthai) {
    const status = order.trangthai.toLowerCase();
    if (status.includes("đã giao")) {
      statusColor = "#16a34a"; // Green
      statusMessage = "Đơn hàng của bạn đã được giao thành công!";
    } else if (status.includes("đã hủy")) {
      statusColor = "#dc2626"; // Red
      statusMessage = "Đơn hàng của bạn đã bị hủy.";
    } else if (status.includes("đang xử lý")) {
      statusColor = "#2563eb"; // Blue
      statusMessage = "Đơn hàng của bạn đang được xử lý.";
    } else if (status.includes("đã thanh toán")) {
      statusColor = "#16a34a"; // Green
      statusMessage = "Đơn hàng của bạn đã được thanh toán thành công!";
    }
  }

  const mailOptions = {
    from: `"GiPuDiHi Shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Cập nhật trạng thái đơn hàng #${order.iddonhang}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: ${statusColor}; margin: 0;">Cập nhật trạng thái đơn hàng</h1>
          <p style="color: #64748b; margin-top: 8px;">${statusMessage}</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Thông tin đơn hàng #${
            order.iddonhang
          }</h2>
          <p style="margin: 4px 0; color: #334155;"><strong>Ngày đặt:</strong> ${
            order.ngaydat
              ? new Date(order.ngaydat).toLocaleString("vi-VN")
              : "N/A"
          }</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Trạng thái mới:</strong> <span style="color: ${statusColor}; font-weight: bold;">${
      order.trangthai
    }</span></p>
          <p style="margin: 4px 0; color: #334155;"><strong>Phương thức thanh toán:</strong> ${paymentMethodText}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Chi tiết đơn hàng</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Sản phẩm</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px;">Tổng cộng:</td>
                <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: #2563eb;">${formatCurrency(
                  Number(order.tongsotien)
                )}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Thông tin thêm</h2>
          ${
            order.trangthai?.toLowerCase().includes("đã giao")
              ? `
            <p style="margin: 4px 0; color: #334155;">Cảm ơn bạn đã mua sắm tại GiPuDiHi Shop! Chúng tôi hy vọng bạn hài lòng với sản phẩm của mình.</p>
            <p style="margin: 4px 0; color: #334155;">Nếu bạn có bất kỳ phản hồi nào, vui lòng liên hệ với chúng tôi.</p>
          `
              : order.trangthai?.toLowerCase().includes("đã hủy")
              ? `
            <p style="margin: 4px 0; color: #334155;">Đơn hàng của bạn đã bị hủy. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
            <p style="margin: 4px 0; color: #334155;">Nếu bạn đã thanh toán, khoản tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc.</p>
          `
              : `
            <p style="margin: 4px 0; color: #334155;">Chúng tôi sẽ tiếp tục cập nhật tình trạng đơn hàng của bạn.</p>
            <p style="margin: 4px 0; color: #334155;">Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" trên trang web của chúng tôi.</p>
          `
          }
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Cần hỗ trợ?</h2>
          <p style="margin: 4px 0; color: #334155;">Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại dưới đây:</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Email:</strong> support@gipudihi.com</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Điện thoại:</strong> 1900 1234</p>
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          <p style="margin: 4px 0;">© 2025 GiPuDiHi Shop. Tất cả các quyền được bảo lưu.</p>
          <p style="margin: 4px 0;">Đây là email tự động, vui lòng không trả lời email này.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log(
      "Sending order status update email with options:",
      JSON.stringify(mailOptions, null, 2)
    );
    const info = await transporter.sendMail(mailOptions);
    console.log("Order status update email sent successfully:", info.response);

    // Create notification for email sent
    try {
      await prisma.notification.create({
        data: {
          idUsers: order.iddonhang, // Assuming this is the user ID
          title: "Email cập nhật trạng thái đã gửi",
          message: `Email cập nhật trạng thái đơn hàng #${order.iddonhang} đã được gửi đến ${email}`,
          type: "email",
          idDonhang: order.iddonhang,
          isRead: false,
          createdAt: new Date(),
        },
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return true;
  } catch (error) {
    console.error("Detailed email send error:", error);
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function sendPaymentConfirmationEmail(
  email: string,
  order: OrderDetails
) {
  // Check credentials
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Gmail credentials not configured");
    throw new Error("Email configuration missing");
  }

  console.log("Attempting to send payment confirmation email to:", email);

  // Format payment method for display
  const paymentMethodText = getPaymentMethodText(order.paymentMethod);

  // Generate HTML for order items
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center;">
          <img src="${item.sanpham.hinhanh}" alt="${
        item.sanpham.Tensanpham
      }" style="width: 60px; height: 60px; object-fit: cover; margin-right: 12px; border-radius: 4px;">
          <div>
            <p style="margin: 0; font-weight: 500;">${
              item.sanpham.Tensanpham
            }</p>
            ${
              item.size
                ? `<p style="margin: 0; color: #64748b; font-size: 14px;">Size: ${item.size.tenSize}</p>`
                : ""
            }
            <p style="margin: 0; color: #64748b; font-size: 14px;">Số lượng: ${
              item.soluong
            }</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 500;">
        ${formatCurrency(item.dongia * item.soluong)}
      </td>
    </tr>
  `
    )
    .join("");

  // Generate discount information if applicable
  const discountInfo =
    order.discountValue && order.discountValue > 0
      ? `
      <tr>
        <td style="padding: 12px; text-align: right; font-weight: 500;">Giảm giá${
          order.discount ? ` (${order.discount.code})` : ""
        }:</td>
        <td style="padding: 12px; text-align: right; font-weight: 500; color: #16a34a;">-${formatCurrency(
          Number(order.discountValue)
        )}</td>
      </tr>
    `
      : "";

  const mailOptions = {
    from: `"GiPuDiHi Shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Xác nhận thanh toán đơn hàng #${order.iddonhang}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #16a34a; margin: 0;">Thanh toán thành công!</h1>
          <p style="color: #64748b; margin-top: 8px;">Chúng tôi đã nhận được thanh toán cho đơn hàng của bạn</p>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style="background-color: #16a34a; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style="margin: 0; color: #16a34a; font-size: 18px;">Thanh toán đã được xác nhận</h2>
          </div>
          <p style="margin: 0; color: #334155;">Chúng tôi đã nhận được khoản thanh toán của bạn và đơn hàng của bạn đang được xử lý.</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Thông tin thanh toán</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #334155;">Phương thức thanh toán:</span>
            <span style="font-weight: 500;">${paymentMethodText}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #334155;">Số tiền:</span>
            <span style="font-weight: 500;">${formatCurrency(
              Number(order.tongsotien)
            )}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #334155;">Ngày thanh toán:</span>
            <span style="font-weight: 500;">${
              order.payment?.ngaythanhtoan
                ? new Date(order.payment.ngaythanhtoan).toLocaleString("vi-VN")
                : new Date().toLocaleString("vi-VN")
            }</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #334155;">Trạng thái:</span>
            <span style="font-weight: 500; color: #16a34a;">Thành công</span>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Thông tin đơn hàng #${
            order.iddonhang
          }</h2>
          <p style="margin: 4px 0; color: #334155;"><strong>Ngày đặt:</strong> ${
            order.ngaydat
              ? new Date(order.ngaydat).toLocaleString("vi-VN")
              : "N/A"
          }</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Trạng thái:</strong> ${
            order.trangthai || "Đang xử lý"
          }</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Chi tiết đơn hàng</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Sản phẩm</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 500;">Tạm tính:</td>
                <td style="padding: 12px; text-align: right; font-weight: 500;">${formatCurrency(
                  order.discountValue
                    ? Number(order.tongsotien) + Number(order.discountValue)
                    : Number(order.tongsotien)
                )}</td>
              </tr>
              ${discountInfo}
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 500;">Phí vận chuyển:</td>
                <td style="padding: 12px; text-align: right; font-weight: 500; color: #16a34a;">Miễn phí</td>
              </tr>
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px;">Tổng cộng:</td>
                <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: #2563eb;">${formatCurrency(
                  Number(order.tongsotien)
                )}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Các bước tiếp theo</h2>
          <p style="margin: 4px 0; color: #334155;">Đơn hàng của bạn đang được chuẩn bị và sẽ được giao trong thời gian sớm nhất.</p>
          <p style="margin: 4px 0; color: #334155;">Bạn sẽ nhận được email thông báo khi đơn hàng được gửi đi.</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #0f172a;">Cần hỗ trợ?</h2>
          <p style="margin: 4px 0; color: #334155;">Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại dưới đây:</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Email:</strong> support@gipudihi.com</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Điện thoại:</strong> 1900 1234</p>
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          <p style="margin: 4px 0;">© 2025 GiPuDiHi Shop. Tất cả các quyền được bảo lưu.</p>
          <p style="margin: 4px 0;">Đây là email tự động, vui lòng không trả lời email này.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log(
      "Sending payment confirmation email with options:",
      JSON.stringify(mailOptions, null, 2)
    );
    const info = await transporter.sendMail(mailOptions);
    console.log("Payment confirmation email sent successfully:", info.response);

    // Create notification for email sent
    try {
      await prisma.notification.create({
        data: {
          idUsers: order.iddonhang, // Assuming this is the user ID
          title: "Email xác nhận thanh toán đã gửi",
          message: `Email xác nhận thanh toán đơn hàng #${order.iddonhang} đã được gửi đến ${email}`,
          type: "email",
          idDonhang: order.iddonhang,
          isRead: false,
          createdAt: new Date(),
        },
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return true;
  } catch (error) {
    console.error("Detailed email send error:", error);
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function to get formatted payment method text
function getPaymentMethodText(method: string): string {
  switch (method) {
    case "stripe":
      return "Thẻ tín dụng/ghi nợ (Stripe)";
    case "online":
      return "Chuyển khoản ngân hàng";
    case "cash":
      return "Tiền mặt khi nhận hàng";
    case "Chuyển khoản":
      return "Chuyển khoản ngân hàng";
    case "Tiền mặt":
      return "Tiền mặt khi nhận hàng";
    case "Thẻ":
      return "Thẻ tín dụng/ghi nợ";
    case "Online":
      return "Thanh toán online";
    default:
      return method;
  }
}
