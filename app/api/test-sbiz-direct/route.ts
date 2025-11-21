// 직접 API 테스트 - 실제 엔드포인트 확인용
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiName = searchParams.get("api") || "simple";
  const certKey = searchParams.get("key") || "";

  // 가능한 엔드포인트 패턴들
  const endpoints = [
    `https://bigdata.sbiz.or.kr/openApi/${apiName}?certKey=${certKey}`,
    `https://bigdata.sbiz.or.kr/api/${apiName}?certKey=${certKey}`,
    `https://bigdata.sbiz.or.kr/api/openApi/${apiName}?certKey=${certKey}`,
    `https://bigdata.sbiz.or.kr/openApi/${apiName}?certKey=${certKey}&type=json`,
    `https://bigdata.sbiz.or.kr/api/v1/${apiName}?certKey=${certKey}`,
  ];

  const results: any[] = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`[테스트] ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          "Accept": "application/json",
        },
        timeout: 5000,
      });

      results.push({
        endpoint,
        success: true,
        status: response.status,
        data: response.data,
      });
    } catch (error: any) {
      results.push({
        endpoint,
        success: false,
        status: error.response?.status || "N/A",
        error: error.message,
        data: error.response?.data,
      });
    }
  }

  return NextResponse.json({
    apiName,
    results,
  });
}

