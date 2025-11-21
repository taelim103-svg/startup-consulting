import { NextRequest, NextResponse } from "next/server";
import {
  fetchSimpleAnalysis,
  fetchPopularInfo,
  fetchStartupClimate,
} from "../sbiz/apis";

// 소상공인 API 연동
export async function POST(request: NextRequest) {
  try {
    const { address, industry } = await request.json();

    if (!address || !industry) {
      return NextResponse.json(
        { error: "주소와 업종을 입력해주세요" },
        { status: 400 }
      );
    }

    // 주소를 좌표로 변환
    const coordinates = await geocodeAddress(address);

    // 실제 소상공인 API 호출 시도
    let sbizData = null;
    let useRealData = false;

    try {
      // 주소에서 지역 코드 추출 (예: 강남구 = 1168)
      const areaCode = getAreaCodeFromAddress(address);
      
      // 업종 코드 변환
      const industryCode = getIndustryCode(industry);
      
      // 간단분석 API와 유동인구 API 호출
      const admiCd = getAdmiCdFromAddress(address);
      const upjongCd = convertIndustryToSimpleCode(industry);
      
      // 1. 간단분석 API 먼저 호출 (analyNo를 얻기 위해)
      const simpleResult = await Promise.allSettled([
        fetchSimpleAnalysis({
          admiCd: admiCd, // 행정동 코드
          upjongCd: upjongCd, // 업종 코드 (예: I21201)
          address: address, // 주소 (dong, gu, si 추출용)
        }),
      ]);

      // 간단분석 API 결과 수집
      const simpleData = simpleResult[0].status === "fulfilled" ? simpleResult[0].value : null;
      const simpleDataParsed = (simpleData && typeof simpleData === 'object' && 'data' in simpleData) 
        ? (simpleData as any).data || simpleData 
        : simpleData || {};
      const analyNo = (simpleDataParsed as any)?.analyNo;

      // 2. 유동인구 API 호출 (간단분석 API의 analyNo 필요)
      let popularData = null;
      if (analyNo) {
        try {
          popularData = await fetchPopularInfo({
            analyNo: analyNo,
            admiCd: admiCd,
            upjongCd: upjongCd,
            mililis: Date.now(),
          });
        } catch (error) {
          console.error("[유동인구 API 호출 실패]", error);
        }
      } else {
        console.warn("[유동인구 API 경고] 간단분석 API에서 analyNo를 찾을 수 없습니다.");
      }

      // 3. 창업기상도 API 호출 (구 단위 정보 + 업종)
      // megaCd: 시도 코드 (예: 11=서울, 28=인천)
      // cityCd: 구 코드 (예: 1168=강남구, 2826=인천 서구)
      // tpbizClscd: 업종 코드 (예: I21201)
      let startupClimateData = null;
      try {
        // areaCode는 구 코드 (4자리, 예: 1168=강남구)
        // areaCode에서 megaCd 추출 (앞 2자리)
        const megaCd = areaCode.substring(0, 2);
        // areaCode가 cityCd (구 코드)
        const cityCd = areaCode;
        
        console.log("[창업기상도 API 파라미터]", {
          megaCd,
          cityCd,
          tpbizClscd: upjongCd,
          areaCode,
        });
        
        startupClimateData = await fetchStartupClimate({
          tpbizClscd: upjongCd, // 업종 코드 (예: I21201)
          megaCd: megaCd, // 시도 코드 (예: 11=서울)
          cityCd: cityCd, // 구 코드 (예: 1168=강남구)
        });
      } catch (error) {
        console.error("[창업기상도 API 호출 실패]", error);
      }

      sbizData = {
        simple: simpleData,
        popular: popularData,
        startupClimate: startupClimateData,
      };

      // 간단분석 API 성공 여부 확인
      useRealData = sbizData.simple !== null;
      
      // 간단분석 API 실패 시 상세 에러 로그
      if (simpleResult[0].status === "rejected") {
        console.error("[간단분석 API 실패]", {
          error: simpleResult[0].reason?.message || simpleResult[0].reason,
          status: simpleResult[0].reason?.response?.status,
          url: simpleResult[0].reason?.config?.url,
          params: simpleResult[0].reason?.config?.params,
        });
      }

      console.log("[API 호출 결과]", {
        useRealData,
        address,
        industry,
        areaCode,
        industryCode,
        simple: simpleResult[0].status,
        popular: popularData ? "success" : "failed",
        startupClimate: startupClimateData ? "success" : "failed",
        analyNo: analyNo,
      });


      // 간단분석 API 응답 구조 디버깅
      if (simpleResult[0].status === "fulfilled") {
        const simpleValueRaw = simpleResult[0].value;
        const simpleValue = (simpleValueRaw && typeof simpleValueRaw === 'object' && 'data' in simpleValueRaw)
          ? (simpleValueRaw as any).data || simpleValueRaw
          : simpleValueRaw || {};
        console.log("[간단분석 API 응답 구조]", {
          keys: Object.keys(simpleValue as any),
          hasStoreCnt: !!(simpleValue as any).storeCnt,
          hasAvgList: !!(simpleValue as any).avgList,
          hasGuAmt: !!(simpleValue as any).guAmt,
          hasSiAmt: !!(simpleValue as any).siAmt,
          hasSaleAmt: !!(simpleValue as any).saleAmt,
          hasPrevMonRate: !!(simpleValue as any).prevMonRate,
          hasPrevYearRate: !!(simpleValue as any).prevYearRate,
          analyNo: (simpleValue as any).analyNo,
        });
      }

      // 유동인구 API 응답 구조 디버깅
      if (popularData) {
        const popularValueRaw = popularData;
        const popularValue = (popularValueRaw && typeof popularValueRaw === 'object' && 'data' in popularValueRaw)
          ? (popularValueRaw as any).data || popularValueRaw
          : popularValueRaw || {};
        console.log("[유동인구 API 응답 구조]", {
          keys: Object.keys(popularValue as any),
          hasPopulation: !!(popularValue as any).population,
          dayAvg: (popularValue as any).population?.dayAvg,
        });
      }
    } catch (apiError) {
      console.error("소상공인 API 호출 오류:", apiError);
      // API 실패 시 데모 데이터 사용
    }

    // 실제 데이터가 있으면 변환, 없으면 데모 데이터 사용
    const analysisData = useRealData && sbizData
      ? convertSbizDataToAnalysis(sbizData, address, industry, coordinates)
      : generateDemoData(address, industry, coordinates);

    return NextResponse.json({
      ...analysisData,
      dataSource: useRealData ? "real" : "demo",
    });
  } catch (error) {
    console.error("분석 오류:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 업종명을 업종코드로 변환
// 실제 API는 숫자 코드를 사용 (예: 1212)
function getIndustryCode(industry: string): string {
  const industryMap: Record<string, string> = {
    "커피전문점/카페": "1212", // 실제 코드 확인 필요
    "한식": "1211",
    "중식": "1213",
    "일식": "1214",
    "양식": "1215",
    "치킨": "1216",
    "분식": "1217",
    "편의점": "1221",
  };
  return industryMap[industry] || "1212";
}

// 업종명을 upjongCd로 변환 (매출추이 API용)
// 실제 API는 I201 형식 사용 (문자로 시작)
function convertIndustryToUpjongCd(industry: string): string {
  const industryMap: Record<string, string> = {
    "커피전문점/카페": "I212", // 실제 코드 확인 필요
    "한식": "I201", // 실제: I201
    "중식": "I202",
    "일식": "I203",
    "양식": "I204",
    "치킨": "I205",
    "분식": "I206",
    "편의점": "I221",
  };
  return industryMap[industry] || "I201"; // 기본값: 한식
}

// 주소에서 구 코드 추출 (구 단위만, 동 정보는 무시)
// 예: "서울 강남구 역삼1동" -> "1168" (강남구)
function getAreaCodeFromAddress(address: string): string {
  const areaMap: Record<string, string> = {
    "강남구": "1168",
    "송파구": "1171",
    "마포구": "1144",
    "서초구": "1165",
    "강동구": "1174",
    "강서구": "1150",
    "관악구": "1162",
    "광진구": "1121",
    "구로구": "1153",
    "금천구": "1154",
    "노원구": "1135",
    "도봉구": "1132",
    "동대문구": "1123",
    "동작구": "1159",
    "은평구": "1138",
    "종로구": "1111",
    "중구": "1114",
    "중랑구": "1126",
    "용산구": "1120",
    "성동구": "1121",
    "서대문구": "1141",
    "양천구": "1147",
    "영등포구": "1156",
  };
  
  // 주소에서 "XX구" 패턴 찾기 (동 정보는 무시)
  for (const [area, code] of Object.entries(areaMap)) {
    if (address.includes(area)) {
      console.log(`[구 코드 추출] 주소: ${address} -> 구: ${area} -> 코드: ${code}`);
      return code;
    }
  }
  
  console.warn(`[구 코드 추출 경고] 주소에서 구를 찾을 수 없습니다: ${address}, 기본값 사용: 1168 (강남구)`);
  return "1168"; // 기본값: 강남구
}

// 주소에서 행정동 코드 추출 (간단분석 API용)
function getAdmiCdFromAddress(address: string): string {
  // 행정동 코드 매핑 (8자리)
  const dongMap: Record<string, string> = {
    "역삼2동": "11680650",
    "역삼1동": "11680640",
    "소공동": "11140520",
    "잠실동": "11710600",
    "홍대": "11440600",
    "강남구": "11680650", // 기본값: 역삼2동
    "송파구": "11710600", // 기본값: 잠실동
    "마포구": "11440600", // 기본값: 홍대
    "중구": "11140520", // 기본값: 소공동
  };
  
  for (const [dong, code] of Object.entries(dongMap)) {
    if (address.includes(dong)) {
      return code;
    }
  }
  
  return "11140520"; // 기본값: 중구 소공동
}

// 업종명을 간단분석 API용 업종 코드로 변환
// 실제 API는 I21201 형식 사용
function convertIndustryToSimpleCode(industry: string): string {
  const industryMap: Record<string, string> = {
    "커피전문점/카페": "I21201", // 실제: I21201
    "한식": "I20101",
    "중식": "I20201",
    "일식": "I20301",
    "양식": "I20401",
    "치킨": "I20501",
    "분식": "I20601",
    "편의점": "I22101",
  };
  return industryMap[industry] || "I21201"; // 기본값: 카페
}

// 업종명을 배달현황 API용 업종명으로 변환
// 실제 API는 "카페·디저트" 형식 사용
function getTpbizNmFromIndustry(industry: string): string {
  const industryMap: Record<string, string> = {
    "커피전문점/카페": "카페·디저트",
    "한식": "한식",
    "중식": "중식",
    "일식": "일식",
    "양식": "서양식",
    "치킨": "치킨",
    "분식": "분식",
    "편의점": "편의점",
  };
  return industryMap[industry] || "카페·디저트"; // 기본값: 카페·디저트
}

// areaCode를 ctyCd(시도 코드)로 변환
function getCtyCdFromAreaCode(areaCode: string): string {
  // 서울특별시 구 코드는 11로 시작
  // 시도 코드는 앞 4자리 사용 (예: 1114 = 중구)
  if (areaCode.startsWith("11")) {
    return areaCode.substring(0, 4);
  }
  // 다른 시도는 앞 2자리 사용
  return areaCode.substring(0, 2);
}

// 소상공인 API 데이터를 분석 데이터 형식으로 변환
function convertSbizDataToAnalysis(
  sbizData: any,
  address: string,
  industry: string,
  coordinates: { lat: number; lng: number }
) {
  const startupClimateData = sbizData.startupClimate?.data || sbizData.startupClimate || {};
  
  console.log("[데이터 변환 시작] 간단분석 API + 창업기상도 API 사용", {
    hasSimple: !!sbizData.simple,
    hasStartupClimate: !!sbizData.startupClimate,
  });

  // 간단분석 API 응답 구조 파싱
  // simple API 응답: { storeCnt: [...], avgList: [...], guAmt: "...", siAmt: "...", saleAmt: "...", prevMonRate: ..., prevYearRate: ..., saleCnt: "...", storeCntAdmin: [...], topFive: [...], analyNo: "...", ... }
  const simpleData = sbizData.simple?.data || sbizData.simple || {};
  
  // 유동인구 API 응답 구조 파싱
  // popular API 응답: { analyNo: "...", population: { dayAvg: 183784, firstHour: 15.7, secondHour: 18.4, ... } }
  const popularData = sbizData.popular?.data || sbizData.popular || {};
  const populationData = popularData.population || {};

  // simple API 응답의 전체 구조 확인 (디버깅용)
  // 유동인구 관련 필드 찾기
  const populationFields = Object.keys(simpleData).filter(key => 
    key.toLowerCase().includes('pop') || 
    key.toLowerCase().includes('traffic') || 
    key.toLowerCase().includes('flow') ||
    key.toLowerCase().includes('daily') ||
    key.toLowerCase().includes('visitor')
  );
  
  console.log("[simple API 전체 응답 구조]", {
    allKeys: Object.keys(simpleData),
    guAmt: simpleData.guAmt,
    siAmt: simpleData.siAmt,
    adminMaxCnt: simpleData.adminMaxCnt,
    adminMinCnt: simpleData.adminMinCnt,
    ctyMaxCnt: simpleData.ctyMaxCnt,
    storeCnt: simpleData.storeCnt,
    saleAmt: simpleData.saleAmt,
    guMax: simpleData.guMax,
    guMin: simpleData.guMin,
    siMax: simpleData.siMax,
    siMin: simpleData.siMin,
    avgList: simpleData.avgList,
    minAmt: simpleData.minAmt,
    maxAmt: simpleData.maxAmt,
    populationFields: populationFields,
    // 유동인구 관련 가능한 필드들 확인
    totPopltnCo: simpleData.totPopltnCo,
    population: simpleData.population,
    dailyTraffic: simpleData.dailyTraffic,
    flowPopltn: simpleData.flowPopltn,
    visitorCnt: simpleData.visitorCnt,
  });

  console.log("[파싱된 데이터]", {
    hasStoreCnt: !!simpleData.storeCnt,
    hasAvgList: !!simpleData.avgList,
    hasStoreCntAdmin: !!simpleData.storeCntAdmin,
    hasTopFive: !!simpleData.topFive,
  });

  // 간단분석 API에서 경쟁 데이터 추출 (storeCnt 또는 storeCntAdmin 사용)
  let sameIndustryStores = 0;
  if (simpleData.storeCntAdmin && Array.isArray(simpleData.storeCntAdmin) && simpleData.storeCntAdmin.length > 0) {
    // storeCntAdmin: 동 단위 업소 수 (areaGb: "13")
    const latestDongStoreCnt = simpleData.storeCntAdmin
      .sort((a: any, b: any) => b.yymm.localeCompare(a.yymm))[0];
    sameIndustryStores = latestDongStoreCnt.storeCnt || 0;
    console.log(`[경쟁 현황] 간단분석 동 단위 추출 (storeCntAdmin): ${sameIndustryStores}개 (${latestDongStoreCnt.yymm})`);
  } else if (simpleData.storeCnt && Array.isArray(simpleData.storeCnt)) {
    // simple API의 storeCnt 배열에서 구 단위 데이터 추출 (동 단위는 storeCntAdmin 사용)
    // areaGb 코드: '11'=시, '12'=구
    const guStoreCnt = simpleData.storeCnt
      .filter((item: any) => item.areaGb === '12') // 구 단위 데이터
      .sort((a: any, b: any) => b.yymm.localeCompare(a.yymm))[0];
    
    if (guStoreCnt) {
      sameIndustryStores = guStoreCnt.storeCnt || 0;
      console.log(`[경쟁 현황] 간단분석 구 단위 추출: ${sameIndustryStores}개 (${guStoreCnt.yymm})`);
    }
  }

  // 매출 데이터 추출 (간단분석 API만 사용)
  let avgSales = 3200;
  let salesGrowth = 12.5;
  
  console.log(`[매출 추출 시작] 업종: ${industry}, simpleData 키: ${Object.keys(simpleData).join(', ')}`);
  
  // 간단분석 API에서 매출 정보 추출
  // avgList 배열의 첫 번째 항목이 최신 월의 동 단위 평균 매출 (만원 단위)
  // avgList: [{ saleAmt: 6728, maxAmt: 71403, minAmt: 464, crtrYm: '202508' }, ...]
  if (simpleData.avgList && Array.isArray(simpleData.avgList) && simpleData.avgList.length > 0) {
    const firstAvg = simpleData.avgList[0];
    if (firstAvg && typeof firstAvg === 'object') {
      const dongAvg = firstAvg.saleAmt || 0;
      const dongAvgNum = typeof dongAvg === 'string' ? parseFloat(dongAvg) : dongAvg;
      if (dongAvgNum && dongAvgNum > 0) {
        avgSales = dongAvgNum * 10000; // 만원을 원으로 변환
        console.log(`[매출 정보] 간단분석 avgList 동 단위 추출: ${avgSales}원 (saleAmt: ${dongAvgNum}만원, 업종: ${industry})`);
      } else {
        console.log(`[매출 정보] avgList[0].saleAmt가 유효하지 않음: ${dongAvg}`);
      }
    }
  }
  // saleAmt 필드 확인 (동 단위 매출일 수 있음)
  else if (simpleData.saleAmt) {
    const saleAmt = typeof simpleData.saleAmt === 'string' ? parseFloat(simpleData.saleAmt) : simpleData.saleAmt;
    if (saleAmt && saleAmt > 0) {
      avgSales = saleAmt * 10000; // 만원을 원으로 변환
      console.log(`[매출 정보] 간단분석 saleAmt 추출: ${avgSales}원 (saleAmt: ${saleAmt}만원, 업종: ${industry})`);
    }
  }
  // 구 단위 매출 (동 단위 데이터가 없을 때만 사용)
  else if (simpleData.guAmt) {
    const guAmt = typeof simpleData.guAmt === 'string' ? parseFloat(simpleData.guAmt) : simpleData.guAmt;
    avgSales = guAmt * 10000; // 만원을 원으로 변환
    console.log(`[매출 정보] 간단분석 구 단위 추출: ${avgSales}원 (guAmt: ${guAmt}만원, 업종: ${industry})`);
  }
  
  // 전월 대비 및 전년 동월 대비 성장률 추출 (storeCntAdmin 기반)
  let prevMonRate = null;
  let prevYearRate = null;
  
  // storeCntAdmin에서 전월 대비 및 전년 동월 대비 계산
  // storeCntAdmin: [{ storeCnt: 116, areaGb: "13", yymm: "202508" }, { storeCnt: 118, areaGb: "13", yymm: "202507" }, { storeCnt: 127, areaGb: "13", yymm: "202408" }]
  if (simpleData.storeCntAdmin && Array.isArray(simpleData.storeCntAdmin) && simpleData.storeCntAdmin.length > 0) {
    // yymm 기준으로 정렬 (최신순)
    const sortedStoreCnt = simpleData.storeCntAdmin
      .filter((item: any) => item.yymm && item.storeCnt !== undefined)
      .sort((a: any, b: any) => b.yymm.localeCompare(a.yymm));
    
    if (sortedStoreCnt.length > 0) {
      const currentMonth = sortedStoreCnt[0];
      const currentYymm = currentMonth.yymm; // 예: "202508"
      const currentStoreCnt = typeof currentMonth.storeCnt === 'string' 
        ? parseFloat(currentMonth.storeCnt) 
        : currentMonth.storeCnt;
      
      console.log(`[업소 수 추출] 현재 월: ${currentYymm}, 업소 수: ${currentStoreCnt}`);
      
      // 전월 찾기 (yymm이 1개월 전인 것)
      // 예: 202508 -> 202507
      const currentYear = parseInt(currentYymm.substring(0, 4));
      const currentMonthNum = parseInt(currentYymm.substring(4, 6));
      const prevYear = currentMonthNum === 1 ? currentYear - 1 : currentYear;
      const prevMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
      const prevYymm = `${prevYear}${String(prevMonthNum).padStart(2, '0')}`;
      
      const prevMonth = sortedStoreCnt.find((item: any) => item.yymm === prevYymm);
      if (prevMonth && prevMonth.storeCnt !== undefined) {
        const prevStoreCnt = typeof prevMonth.storeCnt === 'string' 
          ? parseFloat(prevMonth.storeCnt) 
          : prevMonth.storeCnt;
        
        if (prevStoreCnt > 0) {
          prevMonRate = ((currentStoreCnt - prevStoreCnt) / prevStoreCnt) * 100;
          console.log(`[전월 대비] ${currentYymm} vs ${prevYymm}: ${currentStoreCnt} vs ${prevStoreCnt} = ${prevMonRate.toFixed(2)}%`);
        }
      }
      
      // 전년 동월 찾기 (yymm이 12개월 전인 것)
      // 예: 202508 -> 202408
      const prevYearYymm = `${currentYear - 1}${String(currentMonthNum).padStart(2, '0')}`;
      const prevYearMonth = sortedStoreCnt.find((item: any) => item.yymm === prevYearYymm);
      if (prevYearMonth && prevYearMonth.storeCnt !== undefined) {
        const prevYearStoreCnt = typeof prevYearMonth.storeCnt === 'string' 
          ? parseFloat(prevYearMonth.storeCnt) 
          : prevYearMonth.storeCnt;
        
        if (prevYearStoreCnt > 0) {
          prevYearRate = ((currentStoreCnt - prevYearStoreCnt) / prevYearStoreCnt) * 100;
          console.log(`[전년 동월 대비] ${currentYymm} vs ${prevYearYymm}: ${currentStoreCnt} vs ${prevYearStoreCnt} = ${prevYearRate.toFixed(2)}%`);
        }
      }
    }
  }
  
  // storeCntAdmin에서 계산하지 못한 경우, simpleData의 prevMonRate/prevYearRate 사용
  if (prevMonRate === null && simpleData.prevMonRate !== undefined && simpleData.prevMonRate !== null) {
    prevMonRate = typeof simpleData.prevMonRate === 'string' 
      ? parseFloat(simpleData.prevMonRate) * 100
      : simpleData.prevMonRate * 100;
    console.log(`[매출 성장률] 간단분석 prevMonRate (전월 대비): ${prevMonRate}%`);
  }
  
  if (prevYearRate === null && simpleData.prevYearRate !== undefined && simpleData.prevYearRate !== null) {
    prevYearRate = typeof simpleData.prevYearRate === 'string' 
      ? parseFloat(simpleData.prevYearRate) * 100
      : simpleData.prevYearRate * 100;
    console.log(`[매출 성장률] 간단분석 prevYearRate (전년 동월 대비): ${prevYearRate}%`);
  }

  // 유동인구 데이터 추출 (유동인구 API 사용)
  let dailyTraffic = 12450;
  
  console.log(`[유동인구 추출 시작] 주소: ${address}, 업종: ${industry}`);
  console.log(`[유동인구 데이터 확인]`, {
    hasPopulation: !!populationData,
    populationKeys: Object.keys(populationData),
    dayAvg: populationData.dayAvg,
  });
  
  // 유동인구 API에서 dayAvg 추출
  if (populationData.dayAvg !== undefined && populationData.dayAvg !== null) {
    const dayAvg = typeof populationData.dayAvg === 'string' 
      ? parseFloat(populationData.dayAvg) 
      : populationData.dayAvg;
    if (dayAvg && dayAvg > 0) {
      dailyTraffic = Math.round(dayAvg);
      console.log(`[유동인구] 유동인구 API에서 추출: ${dailyTraffic}명 (dayAvg: ${dayAvg})`);
    } else {
      console.warn(`[유동인구 경고] dayAvg가 유효하지 않음: ${populationData.dayAvg}`);
    }
  } else {
    console.warn(`[유동인구 경고] 유동인구 API에서 dayAvg를 찾을 수 없습니다. 주소: ${address}`);
  }

  // 창업기상도 API에서 종합 점수 추출 (구 단위 정보만 사용)
  // 창업기상도 API 응답: { resultCode: "SUCCESS", data: { avgScore: 0, detailList: [{ avgScore: 23, ... }] } }
  // 주의: 창업기상도 API는 구 단위까지만 점수를 제공하므로 detailList[0].avgScore를 사용
  let overallScore = 0; // 기본값을 0으로 설정 (창업기상도 API 점수가 없으면 0)
  
  console.log(`[창업기상도 데이터 확인]`, {
    hasStartupClimate: !!startupClimateData,
    startupClimateKeys: startupClimateData ? Object.keys(startupClimateData) : [],
    resultCode: startupClimateData?.resultCode,
    hasData: !!startupClimateData?.data,
    dataKeys: startupClimateData?.data ? Object.keys(startupClimateData.data) : [],
    detailListLength: startupClimateData?.data?.detailList?.length || 0,
  });

  // 창업기상도 API에서 avgScore 추출 (구 단위 점수)
  const climateData = startupClimateData?.data || startupClimateData || {};
  
  // detailList[0].avgScore를 우선 확인 (구 단위 점수)
  if (climateData.detailList && Array.isArray(climateData.detailList) && climateData.detailList.length > 0) {
    const firstDetail = climateData.detailList[0];
    if (firstDetail.avgScore !== undefined && firstDetail.avgScore !== null) {
      overallScore = typeof firstDetail.avgScore === 'string' 
        ? parseFloat(firstDetail.avgScore) 
        : firstDetail.avgScore;
      console.log(`[종합 점수] 창업기상도 API에서 추출 (detailList[0].avgScore, 구 단위): ${overallScore}점`);
    } else {
      console.warn(`[창업기상도 경고] detailList[0].avgScore가 유효하지 않음: ${firstDetail.avgScore}`);
    }
  } else {
    console.warn(`[창업기상도 경고] detailList가 없거나 비어있습니다.`);
  }
  
  // 창업기상도 API 점수가 없으면 경고 (동 단위 계산은 사용하지 않음)
  if (overallScore === 0) {
    console.warn(`[종합 점수 경고] 창업기상도 API에서 점수를 찾을 수 없습니다. 0점으로 표시됩니다.`);
  }
  
  console.log(`[종합 점수] 최종 (구 단위): ${overallScore}점`);

  // 유동인구 API에서 주중/주말, 요일별, 시간대별 데이터 추출
  const weekdayPercent = typeof populationData.day === 'string' ? parseFloat(populationData.day) : (populationData.day || 79.3);
  const weekendPercent = typeof populationData.weekend === 'string' ? parseFloat(populationData.weekend) : (populationData.weekend || 20.7);
  
  // 요일별 데이터 (월~일)
  const weekdayData = {
    mon: typeof populationData.mon === 'string' ? parseFloat(populationData.mon) : (populationData.mon || 15.9),
    tues: typeof populationData.tues === 'string' ? parseFloat(populationData.tues) : (populationData.tues || 16.4),
    wed: typeof populationData.wed === 'string' ? parseFloat(populationData.wed) : (populationData.wed || 16.2),
    thur: typeof populationData.thur === 'string' ? parseFloat(populationData.thur) : (populationData.thur || 16.3),
    fri: typeof populationData.fri === 'string' ? parseFloat(populationData.fri) : (populationData.fri || 14.5),
    sat: typeof populationData.sat === 'string' ? parseFloat(populationData.sat) : (populationData.sat || 11.1),
    sun: typeof populationData.sun === 'string' ? parseFloat(populationData.sun) : (populationData.sun || 9.5),
  };
  
  // 시간대별 데이터 (firstHour ~ sixthHour)
  const timeSlotData = [
    typeof populationData.firstHour === 'string' ? parseFloat(populationData.firstHour) : (populationData.firstHour || 15.7),  // 05~09
    typeof populationData.secondHour === 'string' ? parseFloat(populationData.secondHour) : (populationData.secondHour || 18.4), // 09~12
    typeof populationData.thirdHour === 'string' ? parseFloat(populationData.thirdHour) : (populationData.thirdHour || 11.6),   // 12~14
    typeof populationData.fourthHour === 'string' ? parseFloat(populationData.fourthHour) : (populationData.fourthHour || 23.7), // 14~18
    typeof populationData.fifthHour === 'string' ? parseFloat(populationData.fifthHour) : (populationData.fifthHour || 23.1),   // 18~23
    typeof populationData.sixthHour === 'string' ? parseFloat(populationData.sixthHour) : (populationData.sixthHour || 7.4),    // 23~05
  ];
  
  console.log(`[유동인구 상세 데이터]`, {
    weekday: weekdayPercent,
    weekend: weekendPercent,
    weekdayData,
    timeSlotData,
  });

  return {
    coordinates,
    traffic: {
      daily: dailyTraffic,
      score: Math.min(100, Math.round((dailyTraffic / 20000) * 100)),
      weekday: weekdayPercent,      // 주중 비율
      weekend: weekendPercent,      // 주말 비율
      weekdayData: weekdayData,     // 요일별 데이터
      timeSlot: timeSlotData,       // 시간대별 데이터 (05~09, 09~12, 12~14, 14~18, 18~23, 23~05)
    },
    competition: {
      sameIndustry: sameIndustryStores || 23,
      nearby: Math.round(sameIndustryStores * 0.35) || 8, // 반경 500m 내 추정
      score: Math.max(0, 100 - (sameIndustryStores || 8) * 8),
      distribution: [35, 45, 20], // 실제 데이터로 교체 필요
    },
    sales: {
      monthly: Math.round(avgSales),
      prevMonRate: prevMonRate,      // 전월 대비 성장률
      prevYearRate: prevYearRate,    // 전년 동월 대비 성장률
      score: Math.min(100, Math.round((avgSales / 5000) * 100)),
    },
    growth: {
      score: overallScore,
    },
    recommendations: simpleData.recommendations || [
      "점심 시간대(12-15시) 타겟 메뉴 강화",
      "20-30대 고객층 집중 공략",
      "SNS 마케팅 적극 활용",
      "배달 서비스 병행 운영",
    ],
    // 원본 데이터도 포함 (디버깅용)
    rawData: {
      simple: sbizData.simple,
      startupClimate: sbizData.startupClimate,
    },
  };
}

// 주소를 좌표로 변환 (데모)
async function geocodeAddress(address: string) {
  // 실제로는 Kakao Local API 또는 Naver Geocoding API 사용
  // https://developers.kakao.com/docs/latest/ko/local/dev-guide
  
  // 서울 주요 지역 좌표 (데모)
  const seoulDistricts: { [key: string]: { lat: number; lng: number } } = {
    "송파": { lat: 37.5145, lng: 127.1059 },
    "강남": { lat: 37.4979, lng: 127.0276 },
    "마포": { lat: 37.5663, lng: 126.9019 },
    "서초": { lat: 37.4837, lng: 127.0324 },
    "잠실": { lat: 37.5133, lng: 127.1000 },
    "홍대": { lat: 37.5568, lng: 126.9236 },
    "강북": { lat: 37.6398, lng: 127.0253 },
  };

  // 주소에서 구 이름 추출
  for (const [district, coords] of Object.entries(seoulDistricts)) {
    if (address.includes(district)) {
      return coords;
    }
  }

  // 기본 좌표 (서울시청)
  return { lat: 37.5665, lng: 126.9780 };
}

// 데모 데이터 생성
function generateDemoData(address: string, industry: string, coordinates: { lat: number; lng: number }) {
  // 업종별 기본 데이터
  const industryData: { [key: string]: any } = {
    "커피전문점/카페": {
      avgSales: 3200,
      competition: 23,
      nearby: 8,
      trafficScore: 75,
      salesGrowth: 12.5,
    },
    "한식": {
      avgSales: 4500,
      competition: 18,
      nearby: 6,
      trafficScore: 80,
      salesGrowth: 8.3,
    },
    "치킨": {
      avgSales: 3800,
      competition: 15,
      nearby: 5,
      trafficScore: 70,
      salesGrowth: 15.2,
    },
    "편의점": {
      avgSales: 5200,
      competition: 12,
      nearby: 4,
      trafficScore: 85,
      salesGrowth: 6.8,
    },
  };

  const baseData = industryData[industry] || industryData["커피전문점/카페"];

  // 지역별 가중치 (송파, 강남 등은 유동인구가 많음)
  const locationMultiplier = address.includes("강남") || address.includes("송파") ? 1.3 : 
                             address.includes("홍대") || address.includes("마포") ? 1.2 : 1.0;

  return {
    coordinates,
    traffic: {
      daily: Math.round(12450 * locationMultiplier),
      score: Math.min(100, Math.round(baseData.trafficScore * locationMultiplier)),
      weekday: 79.3,
      weekend: 20.7,
      weekdayData: {
        mon: 15.9,
        tues: 16.4,
        wed: 16.2,
        thur: 16.3,
        fri: 14.5,
        sat: 11.1,
        sun: 9.5,
      },
      timeSlot: [15.7, 18.4, 11.6, 23.7, 23.1, 7.4],
    },
    competition: {
      sameIndustry: baseData.competition,
      nearby: baseData.nearby,
      score: Math.max(0, 100 - baseData.nearby * 8),
      distribution: [35, 45, 20],
    },
    sales: {
      monthly: Math.round(baseData.avgSales * locationMultiplier),
      prevMonRate: -0.7,   // 전월 대비 (예시: -0.7%)
      prevYearRate: 9.1,   // 전년 동월 대비 (예시: 9.1%)
      score: Math.min(100, Math.round(70 * locationMultiplier)),
    },
    growth: {
      score: Math.round(65 + Math.random() * 20),
    },
    recommendations: [
      "점심 시간대(12-15시) 타겟 메뉴 강화",
      "20-30대 고객층 집중 공략",
      "SNS 마케팅 적극 활용",
      "배달 서비스 병행 운영",
    ],
  };
}

// 실제 소상공인 API 호출 함수 (참고용)
async function fetchSbizDataReal(coordinates: { lat: number; lng: number }, industry: string) {
  const API_KEY = process.env.SBIZ_API_KEY;
  
  if (!API_KEY) {
    throw new Error("소상공인 API 키가 설정되지 않았습니다");
  }

  try {
    // 1. 상권정보 조회
    const areaInfoUrl = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeZoneOne`;
    const areaResponse = await fetch(
      `${areaInfoUrl}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&divId=ctprvnCd&key=11&type=json`
    );

    // 2. 업종별 상권정보 조회
    const industryUrl = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong`;
    const industryResponse = await fetch(
      `${industryUrl}?serviceKey=${API_KEY}&pageNo=1&numOfRows=100&divId=indsLclsCd&key=${industry}&type=json`
    );

    // 3. 유동인구 데이터
    const populationUrl = `https://apis.data.go.kr/B553077/api/open/sdsc2/floatingPopulation`;
    const populationResponse = await fetch(
      `${populationUrl}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&divId=stdrYm&key=202312&type=json`
    );

    const areaData = await areaResponse.json();
    const industryData = await industryResponse.json();
    const populationData = await populationResponse.json();

    return {
      area: areaData,
      industry: industryData,
      population: populationData,
    };
  } catch (error) {
    console.error("소상공인 API 호출 오류:", error);
    throw error;
  }
}

