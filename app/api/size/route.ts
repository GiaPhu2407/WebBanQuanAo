import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const searchParams = new URLSearchParams(request.url.split("?")[1]);
//   const productId = searchParams.get("productId");

//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Fetch all sizes
//     const sizes = await prisma.size.findMany();

//     // Fetch product sizes for the specific product
//     const productSizes = await prisma.productSize.findMany({
//       where: {
//         idsanpham: parseInt(productId),
//       },
//     });

//     // Combine the data
//     const formattedSizes = sizes.map((size) => {
//       const productSize = productSizes.find((ps) => ps.idSize === size.idSize);
//       return {
//         idSize: size.idSize,
//         tenSize: size.tenSize,
//         soluong: productSize?.soluong || 0,
//       };
//     });

//     return NextResponse.json({ sizes: formattedSizes }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function GET() {
  const size = await prisma.size.findMany();
  return NextResponse.json({ size, message: "success" }, { status: 201 });
}
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const createdSize = await prisma.size.create({
      data: {
        tenSize: data.name_size,
      },
    });
    return NextResponse.json(
      { createdSize, message: "success" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
