import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const page = Number(searchParams.get('page')) || 1;
    const limit_size = Number(searchParams.get('limit_size')) || 10;
    const skip = (page - 1) * limit_size;
    
    // Search parameters
    const search = searchParams.get('search') || '';
    const searchField = searchParams.get('searchField');

    // Build where clause based on search field
    let whereClause: any = {};
    
    if (search) {
      if (searchField) {
        // Search in specific field
        whereClause = {
          [searchField]: {
            contains: search,
            mode: 'insensitive' // Case-insensitive search
          }
        };
      } else {
        // Search across all relevant fields
        whereClause = {
          OR: [
            { tennhacungcap: { contains: search, mode: 'insensitive' } },
            { sodienthoai: { contains: search, mode: 'insensitive' } },
            { diachi: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        };
      }
    }

    // Get total records count
    const totalRecords = await prisma.nhacungcap.count({
      where: whereClause
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit_size);

    // Fetch paginated data
    const data = await prisma.nhacungcap.findMany({
      where: whereClause,
      skip,
      take: limit_size,
      orderBy: {
        idnhacungcap: 'desc' // Latest suppliers first
      }
    });

    return NextResponse.json({
      data,
      meta: {
        page,
        limit_size,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error) {
    console.error('Error in supplier pagination:', error);
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch suppliers',
    }, { 
      status: 500 
    });
  }
}