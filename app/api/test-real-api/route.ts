// 실제 API 구조로 테스트
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiName = searchParams.get("api") || "storSttus";

  // 실제 API URL 구조
  const baseUrl = "https://bigdata.sbiz.or.kr/sbiz/api/bizonSttus";
  
  // API별 엔드포인트
  const endpoints: Record<string, string> = {
    storSttus: "storSttus/search.json",
    slsIdex: "slsIdex/search.json",
    delivery: "delivery/search.json",
    hpReport: "hpReport/search.json",
    simple: "simple/search.json",
  };

  const endpoint = endpoints[apiName] || `${apiName}/search.json`;
  const requestUrl = `${baseUrl}/${endpoint}`;

  // 실제 API 파라미터 (업소현황 예시)
  const testParams: Record<string, any> = {
    sprTypeNo: 1,      // 행정구역
    areaCd: "1168",    // 강남구
    upjongGb: 2,       // 비알코올
    upjongCd: "1212",  // 업종 코드
    kin: "area",       // 행정구역 조회
  };

  try {
    console.log(`[실제 API 테스트] ${requestUrl}`);
    console.log(`[파라미터]`, testParams);

    const response = await axios.get(requestUrl, {
      params: testParams,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://bigdata.sbiz.or.kr/",
        "Origin": "https://bigdata.sbiz.or.kr",
      },
      withCredentials: true,
    });

    return NextResponse.json({
      success: true,
      url: requestUrl,
      params: testParams,
      status: response.status,
      data: response.data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      url: requestUrl,
      params: testParams,
      error: {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      },
    }, { status: 500 });
  }
}

