// 개별 API 테스트 - 각 API를 하나씩 테스트하여 정확한 에러 확인
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

  const results: any = {};

  // 테스트 파라미터
  const testParams = {
    areaCode: "1168", // 강남구
    industry: "커피전문점/카페",
    address: "서울 강남구 역삼2동",
  };

  try {
    if (apiName === "all" || apiName === "store") {
      console.log("\n=== 업소현황 API 테스트 ===");
      try {
        results.storeStatus = await fetchStoreStatus({
          sprTypeNo: 1,
          areaCd: testParams.areaCode,
          upjongGb: 2,
          upjongCd: "1212", // 업소현황은 숫자 코드 사용
          kin: "area",
        });
        console.log("✅ 업소현황 성공");
      } catch (error: any) {
        console.error("❌ 업소현황 실패:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          params: error.config?.params,
          data: error.response?.data,
        });
        results.storeStatus = { error: error.message };
      }
    }

    if (apiName === "all" || apiName === "sales") {
      console.log("\n=== 매출추이 API 테스트 ===");
      try {
        results.salesTrend = await fetchSalesTrend({
          megaCd: "11",
          upjongCd: "I201", // 실제: I201 형식
        });
        console.log("✅ 매출추이 성공");
      } catch (error: any) {
        console.error("❌ 매출추이 실패:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          params: error.config?.params,
          data: error.response?.data,
        });
        results.salesTrend = { error: error.message };
      }
    }

    if (apiName === "all" || apiName === "delivery") {
      console.log("\n=== 배달현황 API 테스트 ===");
      try {
        results.delivery = await fetchDeliveryStatus({
          tpbizNm: "카페·디저트", // 실제: 카페·디저트
          ctyCd: "1114", // 중구
        });
        console.log("✅ 배달현황 성공");
      } catch (error: any) {
        console.error("❌ 배달현황 실패:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          params: error.config?.params,
          data: error.response?.data,
        });
        results.delivery = { error: error.message };
      }
    }

    if (apiName === "all" || apiName === "hotplace") {
      console.log("\n=== 핫플레이스 API 테스트 ===");
      try {
        results.hotPlace = await fetchHotPlace({
          bizonTheme: "MZ",
        });
        console.log("✅ 핫플레이스 성공");
      } catch (error: any) {
        console.error("❌ 핫플레이스 실패:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          params: error.config?.params,
          data: error.response?.data,
        });
        results.hotPlace = { error: error.message };
      }
    }

    if (apiName === "all" || apiName === "simple") {
      console.log("\n=== 간단분석 API 테스트 ===");
      try {
        results.simple = await fetchSimpleAnalysis({
          admiCd: "11140605", // 을지로동 (실제 API 예시와 동일)
          upjongCd: "I21201", // 실제: I21201 형식
          address: "서울 중구 을지로동", // 주소 (simpleLoc 추출용)
        });
        console.log("✅ 간단분석 성공");
      } catch (error: any) {
        console.error("❌ 간단분석 실패:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          params: error.config?.params,
          data: error.response?.data,
        });
        results.simple = { error: error.message };
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

