// 소상공인 API 테스트 라우트
import { NextRequest, NextResponse } from "next/server";
import {
  fetchStoreStatus,
  fetchSalesTrend,
  fetchDeliveryStatus,
  fetchHotPlace,
  fetchSimpleAnalysis,
} from "../sbiz/apis";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiName = searchParams.get("api") || "all";

  const testParams = {
    // 테스트용 파라미터 (실제로는 사용자 입력값 사용)
    trdarCd: searchParams.get("trdarCd") || undefined,
    indsSclsCd: searchParams.get("indsSclsCd") || undefined,
    lat: searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined,
    lng: searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined,
  };

  const results: Record<string, any> = {};

  try {
    // 각 API 테스트
    if (apiName === "all" || apiName === "store") {
      try {
        results.storeStatus = await fetchStoreStatus({
          lat: testParams.lat || 37.5145, // 송파구 좌표
          lng: testParams.lng || 127.1059,
        });
      } catch (error: any) {
        results.storeStatus = { error: error.message, status: error.response?.status };
      }
    }

    if (apiName === "all" || apiName === "sales") {
      try {
        results.salesTrend = await fetchSalesTrend({
          trdarCd: testParams.trdarCd,
          indsSclsCd: testParams.indsSclsCd,
        });
      } catch (error: any) {
        results.salesTrend = { error: error.message, status: error.response?.status };
      }
    }

    if (apiName === "all" || apiName === "delivery") {
      try {
        results.delivery = await fetchDeliveryStatus({
          tpbizNm: "카페·디저트",
          ctyCd: "1114",
        });
      } catch (error: any) {
        results.delivery = { error: error.message, status: error.response?.status };
      }
    }

    if (apiName === "all" || apiName === "hotplace") {
      try {
        results.hotPlace = await fetchHotPlace({
          bizonTheme: "MZ",
        });
      } catch (error: any) {
        results.hotPlace = { error: error.message, status: error.response?.status };
      }
    }

    if (apiName === "all" || apiName === "simple") {
      try {
        results.simple = await fetchSimpleAnalysis({
          lat: testParams.lat || 37.5145,
          lng: testParams.lng || 127.1059,
        });
      } catch (error: any) {
        results.simple = { error: error.message, status: error.response?.status };
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

