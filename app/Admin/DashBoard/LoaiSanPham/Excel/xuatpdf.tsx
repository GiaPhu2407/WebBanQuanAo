// import prisma from "@/prisma/client";
// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function GET() {
//   try {
//     // Lấy danh sách loại sản phẩm từ database
//     const loaiSanPhamList = await prisma.loaisanpham.findMany();

//     // Nội dung HTML cho báo cáo
//     const htmlContent = `
//     <html>
//     <head>
//       <style>
//         body {
//           font-family: Times New Roman, serif;
//           margin: 20px;
//         }
//         .header {
//           text-align: center;
//           margin-bottom: 30px;
//         }
//         .title {
//           font-size: 18px;
//           font-weight: bold;
//           margin-bottom: 10px;
//         }
//         .subtitle {
//           font-size: 16px;
//           margin-bottom: 15px;
//         }
//         .divider {
//           border-top: 1px solid #000;
//           width: 60%;
//           margin: 15px auto;
//         }
//         .date {
//           text-align: right;
//           font-style: italic;
//           margin: 20px 20px;
//         }
//         .report-title {
//           text-align: center;
//           font-size: 20px;
//           font-weight: bold;
//           margin: 20px 0;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }
//         th, td {
//           border: 1px solid #ddd;
//           padding: 8px;
//           text-align: left;
//         }
//         th {
//           background-color: rgb(48, 77, 109);
//           color: white;
//           font-weight: bold;
//         }
//         tr:nth-child(even) {
//           background-color: #f5f5f5;
//         }
//         .page-number {
//           text-align: center;
//           font-size: 10px;
//           position: fixed;
//           bottom: 10px;
//           width: 100%;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
//         <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
//         <div class="divider"></div>
//       </div>

//       <div class="date">
//         Ngày ${new Date().getDate()} tháng ${
//       new Date().getMonth() + 1
//     } năm ${new Date().getFullYear()}
//       </div>

//       <div class="report-title">
//         DANH SÁCH LOẠI SẢN PHẨM
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>STT</th>
//             <th>Mã Loại</th>
//             <th>Tên Loại</th>
//             <th>Mô Tả</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${loaiSanPhamList
//             .map(
//               (loai, index) => `
//               <tr>
//                 <td style="text-align: center">${index + 1}</td>
//                 <td style="text-align: center">${loai.idloaisanpham}</td>
//                 <td>${loai.tenloai}</td>
//                 <td>${loai.mota}</td>
//               </tr>
//             `
//             )
//             .join("")}
//         </tbody>
//       </table>
//     </body>
//     </html>
//     `;

//     // Khởi tạo Puppeteer và tạo PDF
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent);

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       margin: {
//         top: "20mm",
//         right: "10mm",
//         bottom: "20mm",
//         left: "10mm",
//       },
//     });

//     await browser.close();

//     // Tạo tên file PDF
//     const currentDate = new Date();
//     const fileName = `danh-sach-loai-san-pham-${currentDate.getDate()}${
//       currentDate.getMonth() + 1
//     }${currentDate.getFullYear()}.pdf`;

//     // Trả về PDF
//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename=${fileName}`,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Lỗi tạo PDF:", error);
//     return NextResponse.json({ message: "Lỗi tạo PDF" }, { status: 500 });
//   }
// }
