import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ProductSchema } from "@/app/zodschema/route";
import { USER_NOT_EXIST } from "@/lib/constant";
import { Decimal } from "@prisma/client/runtime/library";

async function checkProductExists(id: number) {
  const product = await prisma.sanpham.findUnique({
    where: { idsanpham: id },
  });
  return product !== null;
}

async function reorderProductIds() {
  try {
    const products = await prisma.sanpham.findMany({
      orderBy: { idsanpham: "asc" },
    });

    for (let i = 0; i < products.length; i++) {
      await prisma.sanpham.update({
        where: { idsanpham: products[i].idsanpham },
        data: { idsanpham: i + 1 },
      });
    }
  } catch (error) {
    console.error("Error while reordering product IDs:", error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const sanphamId = id;
  try {
    const getSanpham = await prisma.sanpham.findUnique({
      where: {
        idsanpham: Number(sanphamId),
      },
      include: {
        loaisanpham: true,
        images: true,
        ProductSizes: {
          select: {
            soluong: true,
            size: {
              select: {
                idSize: true,
                tenSize: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(
      { getSanpham, message: "Lấy sản phẩm thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const idsanpham = Number(params.id);

  if (isNaN(idsanpham)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    // Kiểm tra sản phẩm tồn tại
    const exists = await prisma.sanpham.findUnique({ where: { idsanpham } });
    if (!exists) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 },
      );
    }

    // Xóa theo thứ tự: bảng con trước, bảng cha sau
    await prisma.$transaction(async (tx) => {
      // 1. UserBehavior (idsanpham)
      await tx.userBehavior.deleteMany({ where: { idsanpham } });

      // 2. Giỏ hàng (idsanpham)
      await tx.giohang.deleteMany({ where: { idsanpham } });

      // 3. Chi tiết nhập kho (idsanpham)
      await tx.chitietnhap.deleteMany({ where: { idsanpham } });

      // 4. Chi tiết đơn hàng (idsanpham)
      await tx.chitietDonhang.deleteMany({ where: { idsanpham } });

      // 5. Đánh giá (idsanpham)
      await tx.danhgia.deleteMany({ where: { idsanpham } });

      // 6. Kho (idsanpham)
      await tx.kho.deleteMany({ where: { idsanpham } });

      // 7. Lịch giao hàng (idsanpham)
      await tx.lichGiaoHang.deleteMany({ where: { idsanpham } });

      // 8. Yêu thích — dùng idSanpham (chữ S hoa theo schema)
      await tx.yeuthich.deleteMany({ where: { idSanpham: idsanpham } });

      // 9. ProductSizes (idsanpham)
      await tx.productSize.deleteMany({ where: { idsanpham } });

      // 10. ProductColors (idsanpham)
      await tx.productColor.deleteMany({ where: { idsanpham } });

      // 11. Images — dùng idSanpham (chữ S hoa theo schema)
      await tx.image.deleteMany({ where: { idSanpham: idsanpham } });

      // 12. Cuối cùng xóa sản phẩm
      await tx.sanpham.delete({ where: { idsanpham } });
    });

    return NextResponse.json(
      { success: true, message: "Xóa sản phẩm thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[DELETE /api/sanpham/[id]] Lỗi:", error.message);
    return NextResponse.json(
      { error: "Không thể xóa sản phẩm", detail: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: "ID sản phẩm không hợp lệ" },
      { status: 400 },
    );
  }

  try {
    const {
      tensanpham,
      mota,
      gia,
      mausac,
      idloaisanpham,
      giamgia,
      gioitinh,
      trangthai,
      productSizes,
      hinhanh,
      releaseDate,
      // AI content fields
      tenSanPhamHapDan,
      seoTitle,
      seoKeywords,
      captionTiktok,
      captionFacebook,
      noiDungShopee,
      hashtag,
      traLoiKhachHang,
    } = await request.json();

    if (!tensanpham || !gia || !idloaisanpham || !productSizes) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 },
      );
    }

    const formattedSizes = Object.entries(productSizes).map(
      ([idSize, soluong]) => ({
        idSize: Number(idSize),
        soluong: Number(soluong),
      }),
    );

    // Convert releaseDate to UTC
    const utcReleaseDate = releaseDate ? new Date(releaseDate) : null;
    if (utcReleaseDate) {
      utcReleaseDate.setMinutes(
        utcReleaseDate.getMinutes() - utcReleaseDate.getTimezoneOffset(),
      );
    }

    const updatedProduct = await prisma.sanpham.update({
      where: { idsanpham: productId },
      data: {
        tensanpham,
        mota,
        gia: String(gia),
        idloaisanpham: Number(idloaisanpham),
        giamgia: giamgia ? Number(giamgia) : null,
        gioitinh,
        trangthai: releaseDate ? "SCHEDULED" : "ACTIVE",
        releaseDate: utcReleaseDate,
        hinhanh,
        // AI content fields
        tenSanPhamHapDan:
          tenSanPhamHapDan !== undefined ? tenSanPhamHapDan : undefined,
        seoTitle: seoTitle !== undefined ? seoTitle : undefined,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : undefined,
        captionTiktok: captionTiktok !== undefined ? captionTiktok : undefined,
        captionFacebook:
          captionFacebook !== undefined ? captionFacebook : undefined,
        noiDungShopee: noiDungShopee !== undefined ? noiDungShopee : undefined,
        hashtag: hashtag !== undefined ? hashtag : undefined,
        traLoiKhachHang:
          traLoiKhachHang !== undefined ? traLoiKhachHang : undefined,
        ProductSizes: {
          deleteMany: {},
          create: formattedSizes,
        },
      },
      include: {
        ProductSizes: true,
        loaisanpham: true,
      },
    });

    return NextResponse.json(
      {
        data: updatedProduct,
        message: "Cập nhật sản phẩm thành công",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
