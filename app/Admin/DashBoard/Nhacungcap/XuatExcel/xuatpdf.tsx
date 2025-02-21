import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  try {
    // Fetch suppliers from database
    const nhaCungCapList = await prisma.nhacungcap.findMany();

    // Create HTML report content
    const htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Times New Roman, serif;
          margin: 20px;
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
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: rgb(48, 77, 109);
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f5f5f5;
        }
        .page-number {
          text-align: center;
          font-size: 10px;
          position: fixed;
          bottom: 10px;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
        <div class="divider"></div>
      </div>

      <div class="date">
        Ngày ${new Date().getDate()} tháng ${
      new Date().getMonth() + 1
    } năm ${new Date().getFullYear()}
      </div>

      <div class="report-title">
        DANH SÁCH NHÀ CUNG CẤP
      </div>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã NCC</th>
            <th>Tên nhà cung cấp</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${nhaCungCapList
            .map(
              (ncc, index) => `
              <tr>
                <td style="text-align: center">${index + 1}</td>
                <td style="text-align: center">${ncc.idnhacungcap}</td>
                <td>${ncc.tennhacungcap}</td>
                <td>${ncc.sodienthoai}</td>
                <td>${ncc.diachi}</td>
                <td>${ncc.email}</td>
                <td style="text-align: center">${
                  ncc.trangthai ? "Đang cung cấp" : "Ngừng cung cấp"
                }</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>

      <div class="page-number" id="pageNumber"></div>

      <script>
        function addPageNumbers() {
          var vars = {};
          var x = document.location.search.substring(1).split('&');
          for (var i in x) {
            var z = x[i].split('=', 2);
            vars[z[0]] = unescape(z[1]);
          }
          var x = ['frompage', 'topage', 'page', 'webpage', 'section', 'subsection', 'subsubsection'];
          for (var i in x) {
            var y = document.getElementsByClassName(x[i]);
            for (var j = 0; j < y.length; ++j) {
              y[j].textContent = vars[x[i]];
            }
          }
          document.getElementById('pageNumber').textContent = 'Trang ' + vars.page + '/' + vars.topage;
        }
        window.onload = addPageNumbers;
      </script>
    </body>
    </html>
    `;

    // Initialize Puppeteer and generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        right: "10mm",
        bottom: "20mm",
        left: "10mm",
      },
    });

    await browser.close();

    // Generate filename with current date
    const currentDate = new Date();
    const fileName = `danh-sach-nha-cung-cap-${currentDate.getDate()}${
      currentDate.getMonth() + 1
    }${currentDate.getFullYear()}.pdf`;

    // Return PDF response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}`,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo PDF:", error);
    return NextResponse.json({ message: "Lỗi tạo PDF" }, { status: 500 });
  }
}
