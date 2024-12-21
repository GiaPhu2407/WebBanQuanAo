import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const page: number = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit_size: number = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
    const skip = (page - 1) * limit_size;
    
    // Search parameter
    const searchText = searchParams.get('search') || '';

    // Construct where clause for search across multiple fields
    const whereClause = searchText ? {
      OR: [
        { tenloai: { contains: searchText } },
        { mota: { contains: searchText } }
      ]
    } : {};

    // Count total records with search filter
    const totalRecords = await prisma.loaisanpham.count({
      where: whereClause
    });

    const totalPage = Math.ceil(totalRecords / limit_size);

    // Fetch data with search and pagination
    const data = await prisma.loaisanpham.findMany({
      where: whereClause,
      skip: skip,
      take: limit_size,
      orderBy: {
        idloaisanpham: 'asc'
      }
    });

    return NextResponse.json(
      {
        data,
        meta: {
          totalRecords,
          totalPage,
          page,
          limit_size,
          skip,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : error 
      },
      { status: 500 }
    );
  }
}