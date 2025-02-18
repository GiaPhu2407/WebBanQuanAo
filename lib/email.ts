import nodemailer from "nodemailer";

// Tạo transporter với thông tin chi tiết hơn
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  debug: true, // Enable debug logs
});

export async function sendResetCode(email: string, resetCode: string) {
  // Kiểm tra credentials
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Gmail credentials not configured");
    throw new Error("Email configuration missing");
  }

  console.log("Attempting to send email to:", email);
  console.log("Using Gmail account:", process.env.GMAIL_USER);

  const mailOptions = {
    from: `"GiPuDiHi Password Reset" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Mã xác nhận đặt lại mật khẩu",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Yêu cầu đặt lại mật khẩu</h2>
        <p>Mã xác nhận của bạn là: <strong>${resetCode}</strong></p>
        <p>Mã này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
      </div>
    `,
  };

  try {
    console.log(
      "Sending email with options:",
      JSON.stringify(mailOptions, null, 2)
    );
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
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
