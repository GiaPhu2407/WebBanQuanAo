import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { data, loaisanpham, qrCode, metadata } = await req.json();
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Times New Roman, serif;
          margin: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          margin-bottom: 15px;
        }
        .divider {
          border-top: 1px solid #000;
          width: 60%;
          margin: 15px auto;
        }
        .date {
          text-align: right;
          font-style: italic;
          margin: 20px 20px;
        }
        .report-title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
          text-transform: uppercase;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          border: 1.5px solid #000;
          padding: 12px 8px;
          text-align: center;
          background-color: #f5f5f5;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 13px;
        }
        td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        .terms {
          margin: 30px 0;
        }
        .terms h3 {
          font-size: 14px;
          margin-bottom: 10px;
        }
        .terms p {
          margin: 5px 0;
          text-align: justify;
        }
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .signature-box {
          width: 45%;
          text-align: center;
        }
        .signature-line {
          margin-top: 80px;
          border-top: 1px dashed #000;
          width: 80%;
          margin-left: auto;
          margin-right: auto;
        }
        .document-info {
          position: absolute;
          top: 20px;
          right: 20px;
          text-align: right;
          font-size: 12px;
          border: 1px solid #000;
          padding: 10px;
          background-color: #fff;
        }
        .qr-code {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 100px;
          height: 100px;
        }
        .qr-code img {
          width: 100%;
          height: 100%;
        }
        .metadata {
          position: absolute;
          top: 130px;
          right: 20px;
          font-size: 10px;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="qr-code">
        <img src="${qrCode}" alt="QR Code" />
      </div>
      
     

      <div class="header">
        <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
        <div class="divider"></div>
      </div>

      <div class="date">
        Ngày ${day} tháng ${month} năm ${year}
      </div>

      <div class="report-title">
        BÁO CÁO NHÀ CUNG CẤP CHO LOẠI SẢN PHẨM: <br> "${loaisanpham}"
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%">STT</th>
            <th style="width: 10%">ID Loại sản phẩm</th>
            <th style="width: 20%">Tên loại</th>
            <th style="width: 15%">Mô tả</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item: any, index: number) => `
              <tr>
                <td style="text-align: center">${index + 1}</td>
                <td style="text-align: center">${item.idloaisanpham}</td>
                <td>${item.tenloai}</td>
                <td>${item.mota}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>

      <div class="terms">
        <h3>ĐIỀU KHOẢN THỎA THUẬN:</h3>
        <p>1. Nhà cung cấp cam kết cung cấp đúng và đầy đủ thông tin như đã được liệt kê trong danh sách trên.</p>
        <p>2. Mọi thay đổi về thông tin liên hệ cần được thông báo bằng văn bản cho đơn vị quản lý trong vòng 07 ngày làm việc.</p>
        <p>3. Nhà cung cấp có trách nhiệm duy trì chất lượng dịch vụ và tuân thủ các quy định của đơn vị quản lý.</p>
        <p>4. Các bên cam kết thực hiện đúng các điều khoản đã thỏa thuận.</p>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <h3>ĐẠI DIỆN ĐƠN VỊ QUẢN LÝ</h3>
          <p><i>(Ký, ghi rõ họ tên)</i></p>
          <div class="signature-line"></div>
        </div>
        <div class="signature-box">
          <h3>ĐẠI DIỆN NHÀ CUNG CẤP</h3>
          <p><i>(Ký, ghi rõ họ tên)</i></p>
          <div class="signature-line"></div>
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      printBackground: true, // Quan trọng: cho phép in background
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=baocao_nhacungcap.pdf`,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo PDF:", error);
    return NextResponse.json({ message: "Lỗi tạo PDF" }, { status: 500 });
  }
}
