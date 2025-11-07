import { NextRequest, NextResponse } from "next/server";

// 소상공인 API 연동
// 실제로는 https://www.data.go.kr/ 에서 API 키를 발급받아 사용해야 합니다
// 여기서는 데모 데이터를 반환합니다

export async function POST(request: NextRequest) {
  try {
    const { address, industry } = await request.json();

    if (!address || !industry) {
      return NextResponse.json(
        { error: "주소와 업종을 입력해주세요" },
        { status: 400 }
      );
    }

    // 주소를 좌표로 변환 (실제로는 Geocoding API 사용)
    const coordinates = await geocodeAddress(address);

    // 소상공인 API 호출 (실제 구현)
    // const sbizData = await fetchSbizData(coordinates, industry);

    // 데모 데이터 생성
    const analysisData = generateDemoData(address, industry, coordinates);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("분석 오류:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
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
      ageGender: {
        male: [15, 25, 20, 18, 12, 10],
        female: [12, 28, 22, 20, 10, 8],
      },
      timeSlot: [30, 50, 80, 70, 90, 60],
    },
    competition: {
      sameIndustry: baseData.competition,
      nearby: baseData.nearby,
      score: Math.max(0, 100 - baseData.nearby * 8),
      distribution: [35, 45, 20],
    },
    sales: {
      monthly: Math.round(baseData.avgSales * locationMultiplier),
      growth: baseData.salesGrowth,
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

