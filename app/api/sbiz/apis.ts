// 소상공인 365 API 호출 함수들
import { callSbizApi } from "./client";

// 환경 변수에서 API 키 가져오기
const API_KEYS = {
  STOR_STATUS: process.env.SBIZ_STOR_STATUS_KEY || "",
  SALES_TREND: process.env.SBIZ_SALES_TREND_KEY || "",
  DELIVERY: process.env.SBIZ_DELIVERY_KEY || "",
  HOTPLACE: process.env.SBIZ_HOTPLACE_KEY || "",
  SIMPLE: process.env.SBIZ_SIMPLE_KEY || "",
  STARTUP_CLIMATE: process.env.SBIZ_STARTUP_CLIMATE_KEY || process.env.SBIZ_SIMPLE_KEY || "",
};

// 1. 업소현황 API (storSttus)
// 실제 API 파라미터: sprTypeNo=1&areaCd=1168&upjongGb=2&upjongCd=1212&kin=area
export async function fetchStoreStatus(params: {
  sprTypeNo?: number; // 시도/구/동 구분 (1=행정구역, 2=주요상권)
  areaCd?: string; // 지역 코드 (예: 1168=강남구)
  upjongGb?: number; // 업종 구분 (1=알코올, 2=비알코올)
  upjongCd?: string; // 업종 코드
  kin?: string; // 조회 유형 (area=행정구역, trdar=상권)
  // 기존 파라미터도 지원 (변환 필요)
  trdarCd?: string;
  indsSclsCd?: string;
  adongCd?: string;
  lat?: number;
  lng?: number;
}) {
  try {
    const apiParams: Record<string, any> = {
      // 기본값 설정
      sprTypeNo: params.sprTypeNo || 1, // 행정구역 기본
      kin: params.kin || "area", // 행정구역 기본
    };

    // 실제 API 파라미터
    if (params.areaCd) apiParams.areaCd = params.areaCd;
    if (params.upjongGb) apiParams.upjongGb = params.upjongGb;
    if (params.upjongCd) apiParams.upjongCd = params.upjongCd;
    
    // 기존 파라미터 변환 (필요시)
    if (params.adongCd) apiParams.areaCd = params.adongCd;
    if (params.indsSclsCd) apiParams.upjongCd = params.indsSclsCd;

    const data = await callSbizApi({
      url: "storSttus",
      params: apiParams,
      certKey: API_KEYS.STOR_STATUS,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("업소현황 API 오류:", error);
    throw error;
  }
}

// 2. 매출추이 API (slsIdex)
// 실제 API 파라미터: megaCd=11&upjongCd=1201
export async function fetchSalesTrend(params: {
  megaCd?: string; // 시도 코드 (11=서울특별시)
  upjongCd?: string; // 업종 코드 (1201=한식)
  // 기존 파라미터도 지원 (변환)
  areaCd?: string; // areaCd를 megaCd로 변환
  upjongGb?: number;
  sprTypeNo?: number;
  kin?: string;
  trdarCd?: string;
  indsSclsCd?: string;
  stdrYm?: string;
}) {
  try {
    const apiParams: Record<string, any> = {};

    // 실제 API 파라미터 (필수)
    if (params.megaCd) {
      apiParams.megaCd = params.megaCd;
    } else if (params.areaCd) {
      // areaCd를 megaCd로 변환 (서울 = 11)
      apiParams.megaCd = getMegaCdFromAreaCd(params.areaCd);
    } else {
      // 기본값: 서울특별시
      apiParams.megaCd = "11";
    }

    // upjongCd는 필수 파라미터
    if (params.upjongCd) {
      apiParams.upjongCd = params.upjongCd;
    } else if (params.indsSclsCd) {
      // 업종 코드 변환 필요
      apiParams.upjongCd = convertIndustryCodeToUpjongCd(params.indsSclsCd);
    } else {
      // 기본값이 없으면 에러 발생 가능
      throw new Error("upjongCd 파라미터가 필요합니다");
    }

    const data = await callSbizApi({
      url: "slsIdex",
      params: apiParams,
      certKey: API_KEYS.SALES_TREND,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("매출추이 API 오류:", error);
    throw error;
  }
}

// areaCd를 megaCd로 변환
function getMegaCdFromAreaCd(areaCd: string): string {
  // 서울특별시 구 코드는 11로 시작
  if (areaCd.startsWith("11")) {
    return "11"; // 서울특별시
  }
  // 다른 시도는 areaCd의 앞 2자리 사용
  return areaCd.substring(0, 2);
}

// 업종 코드를 upjongCd로 변환
// 실제 API는 I201 형식 사용 (문자로 시작)
function convertIndustryCodeToUpjongCd(industryCode: string): string {
  // 실제 매핑 필요 (예: 한식 = I201)
  const codeMap: Record<string, string> = {
    "I20A01": "I201", // 한식
    "Q12A01": "I212", // 커피전문점
    "1201": "I201", // 숫자 형식도 변환
    "1212": "I212",
    // 추가 매핑 필요
  };
  return codeMap[industryCode] || "I201";
}

// 3. 배달현황 API (delivery)
// 실제 API: gis/delivery/getAdmAnlsByCty.json?tpbizNm=카페·디저트&ctyCd=1114&fromDate=202201&toDate=202508
export async function fetchDeliveryStatus(params: {
  tpbizNm?: string; // 업종명 (예: "카페·디저트", URL 인코딩 필요)
  ctyCd?: string; // 시도 코드 (예: 1114 = 중구)
  fromDate?: string; // 시작일자 (YYYYMM, 예: "202201")
  toDate?: string; // 종료일자 (YYYYMM, 예: "202508")
  // 기존 파라미터
  areaCd?: string; // areaCd를 ctyCd로 변환
  megaCd?: string; // 시도 코드
  lat?: number;
  lng?: number;
}) {
  try {
    const apiParams: Record<string, any> = {};

    // 실제 API 파라미터
    if (params.tpbizNm) {
      // URL 인코딩은 axios가 자동으로 처리
      apiParams.tpbizNm = params.tpbizNm;
    } else {
      // 기본값: 카페·디저트
      apiParams.tpbizNm = "카페·디저트";
    }

    if (params.ctyCd) {
      apiParams.ctyCd = params.ctyCd;
    } else if (params.areaCd) {
      // areaCd를 ctyCd로 변환 (시도 코드)
      apiParams.ctyCd = getCtyCdFromAreaCd(params.areaCd);
    } else if (params.megaCd) {
      // megaCd를 ctyCd로 변환
      apiParams.ctyCd = params.megaCd;
    } else {
      // 기본값: 서울 중구 (1114)
      apiParams.ctyCd = "1114";
    }

    if (params.fromDate) {
      apiParams.fromDate = params.fromDate;
    } else {
      apiParams.fromDate = "202201"; // 기본값: 2022년 1월
    }

    if (params.toDate) {
      apiParams.toDate = params.toDate;
    } else {
      // 현재 월
      const today = new Date();
      apiParams.toDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    }

    const data = await callSbizApi({
      url: "delivery",
      params: apiParams,
      certKey: API_KEYS.DELIVERY,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("배달현황 API 오류:", error);
    throw error;
  }
}

// areaCd를 ctyCd(시도 코드)로 변환
function getCtyCdFromAreaCd(areaCd: string): string {
  // 시도 코드는 앞 2자리 또는 4자리
  // 서울특별시 구 코드는 11로 시작
  if (areaCd.startsWith("11")) {
    // 서울특별시의 경우 구 코드를 시도 코드로 변환
    // 예: 1114 = 중구
    return areaCd.substring(0, 4); // 앞 4자리 사용
  }
  // 다른 시도는 앞 2자리 사용
  return areaCd.substring(0, 2);
}

// 4. 핫플레이스 (유동인구) API (hpReport)
// 실제 API: gis/hpAnls/report.json?bizonTheme=MZ&mjrBzznno=10116&anlsNo=104135764&anlsDt=20251121&rptpinfoTpcd=RT1&xtLoginId=...
export async function fetchHotPlace(params: {
  bizonTheme?: string; // 테마 (예: "MZ")
  mjrBzznno?: string; // 주요 비즈니스 번호
  anlsNo?: string; // 분석번호
  anlsDt?: string; // 분석일자 (YYYYMMDD)
  rptpinfoTpcd?: string; // 리포트 타입 코드 (예: "RT1")
  xtLoginId?: string; // 로그인 ID (certKey)
  areaCd?: string; // 지역 코드
  megaCd?: string; // 시도 코드
  // 기존 파라미터
  sprTypeNo?: number;
  kin?: string;
  trdarCd?: string;
  adongCd?: string;
  stdrYm?: string;
}) {
  try {
    const apiParams: Record<string, any> = {};

    // 실제 API 파라미터
    if (params.bizonTheme) {
      apiParams.bizonTheme = params.bizonTheme;
    } else {
      apiParams.bizonTheme = "MZ"; // 기본값: MZ 핫플레이스
    }

    if (params.mjrBzznno) apiParams.mjrBzznno = params.mjrBzznno;
    if (params.anlsNo) apiParams.anlsNo = params.anlsNo;
    if (params.anlsDt) apiParams.anlsDt = params.anlsDt;
    if (params.rptpinfoTpcd) apiParams.rptpinfoTpcd = params.rptpinfoTpcd;
    if (params.xtLoginId) apiParams.xtLoginId = params.xtLoginId;

    // 지역 정보 (필요시)
    if (params.areaCd) apiParams.areaCd = params.areaCd;
    if (params.megaCd) apiParams.megaCd = params.megaCd;

    // xtLoginId가 없으면 certKey 사용
    if (!apiParams.xtLoginId) {
      apiParams.xtLoginId = API_KEYS.HOTPLACE;
    }

    const data = await callSbizApi({
      url: "hpReport",
      params: apiParams,
      certKey: API_KEYS.HOTPLACE,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("핫플레이스 API 오류:", error);
    throw error;
  }
}

// 5. 간단분석 API (simple)
// 실제 API: gis/simpleAnls/getAvgAmtInfo.json?admiCd=11140605&upjongCd=I21201&simpleLoc=서울특별시+중구+을지로동&bizonNumber=&bizonName=&bzznType=&xtLoginId=...
export async function fetchSimpleAnalysis(params: {
  admiCd?: string; // 행정동 코드 (예: 11140605 = 을지로동)
  upjongCd?: string; // 업종 코드 (예: I21201)
  simpleLoc?: string; // 간단 위치 (예: "서울특별시 중구 을지로동", URL 인코딩 필요, 공백은 +로 변환)
  bizonNumber?: string; // 비즈니스 번호 (선택)
  bizonName?: string; // 비즈니스 이름 (선택)
  bzznType?: string; // 비즈니스 타입 (선택)
  xtLoginId?: string; // 로그인 ID (certKey)
  // 기존 파라미터 (호환성 유지)
  analyNo?: string;
  stdYm?: string;
  mililis?: number;
  dong?: string;
  gu?: string;
  si?: string;
  // 기존 파라미터
  megaCd?: string;
  areaCd?: string;
  sprTypeNo?: number;
  upjongGb?: number;
  kin?: string;
  trdarCd?: string;
  indsSclsCd?: string;
  lat?: number;
  lng?: number;
  address?: string; // 주소 (dong, gu, si 추출용)
}) {
  try {
    const apiParams: Record<string, any> = {};

    // 실제 API 파라미터
    if (params.admiCd) {
      apiParams.admiCd = params.admiCd;
    } else if (params.areaCd) {
      // areaCd를 admiCd로 변환 (행정동 코드)
      apiParams.admiCd = convertAreaCdToAdmiCd(params.areaCd);
    }

    // 업종 정보
    if (params.upjongCd) {
      apiParams.upjongCd = params.upjongCd;
    } else {
      // 기본값: 카페 (I21201)
      apiParams.upjongCd = "I21201";
    }

    // 간단 위치 (simpleLoc) - 주소를 "시 구 동" 형식으로 변환
    // 실제 API 예시: "서울특별시 중구 을지로동"
    if (params.simpleLoc) {
      apiParams.simpleLoc = params.simpleLoc;
    } else if (params.address) {
      // 주소에서 시, 구, 동 추출하여 조합
      let si = "서울특별시";
      let gu = "";
      let dong = "";

      // 시 추출
      if (params.address.includes("서울")) {
        si = "서울특별시";
      } else if (params.address.includes("부산")) {
        si = "부산광역시";
      } else if (params.address.includes("대구")) {
        si = "대구광역시";
      } else if (params.address.includes("인천")) {
        si = "인천광역시";
      } else if (params.address.includes("광주")) {
        si = "광주광역시";
      } else if (params.address.includes("대전")) {
        si = "대전광역시";
      } else if (params.address.includes("울산")) {
        si = "울산광역시";
      }

      // 구 추출 (예: "강남구", "중구", "송파구")
      const guMatch = params.address.match(/(\S+구)/);
      if (guMatch) gu = guMatch[1];

      // 동 추출 (예: "역삼2동", "역삼1동", "을지로동", "소공동")
      // "역삼2동" 같은 경우도 매칭되도록 수정
      const dongMatch = params.address.match(/([가-힣0-9]+동)/);
      if (dongMatch) dong = dongMatch[1];

      // "시 구 동" 형식으로 조합 (모두 필수)
      if (si && gu && dong) {
        // 동을 찾았으면 그대로 사용
        apiParams.simpleLoc = `${si} ${gu} ${dong}`;
        console.log(`[simpleLoc 생성] 주소에서 추출: ${apiParams.simpleLoc}`);
      } else if (si && gu) {
        // 동이 없으면 admiCd를 기반으로 동 이름 추정
        if (params.admiCd) {
          const dongName = getDongNameFromAdmiCd(params.admiCd);
          if (dongName) {
            apiParams.simpleLoc = `${si} ${gu} ${dongName}`;
            console.log(`[simpleLoc 생성] admiCd 기반: ${apiParams.simpleLoc} (admiCd: ${params.admiCd})`);
          } else {
            // admiCd 매핑이 없으면 주소에서 다시 시도
            console.warn(`[simpleLoc 경고] admiCd ${params.admiCd}에 대한 동 이름 매핑이 없습니다. 주소에서 다시 추출 시도.`);
            apiParams.simpleLoc = `${si} ${gu} 을지로동`; // 기본값
          }
        } else {
          console.warn(`[simpleLoc 경고] 동 정보를 찾을 수 없어 기본값 사용: ${si} ${gu} 을지로동`);
          apiParams.simpleLoc = `${si} ${gu} 을지로동`; // 기본값
        }
      } else {
        // 구와 동이 모두 없으면 기본값 사용
        console.warn(`[simpleLoc 경고] 구 정보를 찾을 수 없어 기본값 사용: 서울특별시 중구 을지로동`);
        apiParams.simpleLoc = "서울특별시 중구 을지로동";
      }
    } else if (params.si && params.gu && params.dong) {
      apiParams.simpleLoc = `${params.si} ${params.gu} ${params.dong}`;
    } else if (params.si && params.gu) {
      // 동이 없으면 admiCd 기반으로 추정
      if (params.admiCd) {
        const dongName = getDongNameFromAdmiCd(params.admiCd);
        apiParams.simpleLoc = `${params.si} ${params.gu} ${dongName || "을지로동"}`;
      } else {
        apiParams.simpleLoc = `${params.si} ${params.gu} 을지로동`;
      }
    } else {
      // 기본값: 실제 API 예시와 동일하게
      apiParams.simpleLoc = "서울특별시 중구 을지로동";
    }

    // 선택적 파라미터
    if (params.bizonNumber !== undefined) apiParams.bizonNumber = params.bizonNumber || "";
    if (params.bizonName !== undefined) apiParams.bizonName = params.bizonName || "";
    if (params.bzznType !== undefined) apiParams.bzznType = params.bzznType || "";

    // xtLoginId가 없으면 certKey 사용
    if (!apiParams.xtLoginId) {
      apiParams.xtLoginId = API_KEYS.SIMPLE;
    }

    const data = await callSbizApi({
      url: "simple",
      params: apiParams,
      certKey: API_KEYS.SIMPLE,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("간단분석 API 오류:", error);
    throw error;
  }
}

// areaCd를 admiCd(행정동 코드)로 변환
function convertAreaCdToAdmiCd(areaCd: string): string {
  // 행정동 코드는 8자리 (예: 11680650 = 강남구 역삼2동)
  // areaCd가 구 코드(4자리)면 기본 행정동 코드 반환
  if (areaCd.length === 4) {
    // 강남구 = 1168, 역삼2동 = 11680650
    const dongMap: Record<string, string> = {
      "1168": "11680650", // 강남구 역삼2동 (기본값)
      "1171": "11710600", // 송파구 잠실동
      "1144": "11440600", // 마포구 홍대입구
      "1114": "11140605", // 중구 을지로동
    };
    return dongMap[areaCd] || "11140605"; // 기본값: 중구 을지로동
  }
  return areaCd;
}

// admiCd(행정동 코드)에서 동 이름 추출
function getDongNameFromAdmiCd(admiCd: string): string {
  const dongMap: Record<string, string> = {
    "11140605": "을지로동",
    "11140520": "소공동",
    "11680650": "역삼2동",
    "11680640": "역삼1동",
    "11710600": "잠실동",
    "11440600": "홍대입구",
  };
  return dongMap[admiCd] || "을지로동"; // 기본값
}

// 6. 유동인구 정보 API (getPopularInfo)
// 실제 API: gis/simpleAnls/getPopularInfo.json?analyNo=104136502&admiCd=11680650&upjongCd=I21201&mililis=1763700719839&bizonNumber=&bizonName=&bzznType=&xtLoginId=...
export async function fetchPopularInfo(params: {
  analyNo?: string; // 분석번호 (간단분석 API 응답에서 가져옴)
  admiCd?: string; // 행정동 코드 (예: 11680650 = 역삼2동)
  upjongCd?: string; // 업종 코드 (예: I21201)
  mililis?: number; // 밀리초 타임스탬프
  bizonNumber?: string; // 비즈니스 번호 (선택)
  bizonName?: string; // 비즈니스 이름 (선택)
  bzznType?: string; // 비즈니스 타입 (선택)
  xtLoginId?: string; // 로그인 ID (certKey)
  // 기존 파라미터 (호환성 유지)
  address?: string;
  areaCd?: string;
  megaCd?: string;
}) {
  try {
    const apiParams: Record<string, any> = {};

    // 실제 API 파라미터
    if (params.analyNo) {
      apiParams.analyNo = params.analyNo;
    }

    if (params.admiCd) {
      apiParams.admiCd = params.admiCd;
    } else if (params.areaCd) {
      // areaCd를 admiCd로 변환
      apiParams.admiCd = convertAreaCdToAdmiCd(params.areaCd);
    }

    if (params.upjongCd) {
      apiParams.upjongCd = params.upjongCd;
    } else {
      // 기본값: 카페 (I21201)
      apiParams.upjongCd = "I21201";
    }

    // mililis: 현재 시간의 밀리초 타임스탬프
    if (params.mililis) {
      apiParams.mililis = params.mililis;
    } else {
      apiParams.mililis = Date.now();
    }

    // 선택적 파라미터
    if (params.bizonNumber !== undefined) apiParams.bizonNumber = params.bizonNumber || "";
    if (params.bizonName !== undefined) apiParams.bizonName = params.bizonName || "";
    if (params.bzznType !== undefined) apiParams.bzznType = params.bzznType || "";

    // xtLoginId가 없으면 certKey 사용
    if (!apiParams.xtLoginId) {
      apiParams.xtLoginId = API_KEYS.SIMPLE;
    }

    const data = await callSbizApi({
      url: "getPopularInfo",
      params: apiParams,
      certKey: API_KEYS.SIMPLE,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("유동인구 정보 API 오류:", error);
    throw error;
  }
}

// 업종 대분류 코드로 최적의 업종 코드 조회
// gis/api/getTpbizMclCodeWithBest.json?tpbizLclcd=I2
export async function fetchIndustryCodeBest(tpbizLclcd: string = "I2") {
  try {
    const data = await callSbizApi({
      url: "getTpbizMclCodeWithBest",
      params: {
        tpbizLclcd, // 업종 대분류 코드 (예: I2 = 음식)
      },
      certKey: API_KEYS.SIMPLE,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("업종 코드 조회 API 오류:", error);
    throw error;
  }
}

// 7. 창업기상도 API (startupClimate)
// 실제 API: https://bigdata.sbiz.or.kr/sbiz/api/swc/getDetailScore?tpbizClscd=I21201&megaCd=28&chkCrtrYm=tdMonth&cityCd=2826
// 응답: { resultCode: "SUCCESS", data: { avgScore: 23, detailList: [{ avgScore: 23, ... }] } }
export async function fetchStartupClimate(params: {
  tpbizClscd?: string; // 업종 코드 (예: I21201)
  megaCd?: string; // 시도 코드 (예: 11=서울, 28=인천)
  cityCd?: string; // 시군구 코드 (예: 2826=인천 서구)
  chkCrtrYm?: string; // 기준월 (기본값: "tdMonth")
  // 기존 파라미터 (호환성 유지)
  admiCd?: string;
  upjongCd?: string;
  address?: string;
  areaCd?: string;
}) {
  try {
    const apiParams: Record<string, any> = {};

    // 실제 API 파라미터
    // tpbizClscd: 업종 코드 (필수)
    if (params.tpbizClscd) {
      apiParams.tpbizClscd = params.tpbizClscd;
    } else if (params.upjongCd) {
      apiParams.tpbizClscd = params.upjongCd;
    } else {
      // 기본값: 카페 (I21201)
      apiParams.tpbizClscd = "I21201";
    }

    // megaCd: 시도 코드 (필수)
    if (params.megaCd) {
      apiParams.megaCd = params.megaCd;
    } else if (params.areaCd) {
      // areaCd에서 megaCd 추출 (앞 2자리)
      apiParams.megaCd = getMegaCdFromAreaCd(params.areaCd);
    } else if (params.address) {
      // 주소에서 megaCd 추출
      apiParams.megaCd = getMegaCdFromAddress(params.address);
    } else {
      console.warn("[창업기상도 API 경고] megaCd가 없습니다. 기본값 사용: 11 (서울)");
      apiParams.megaCd = "11"; // 기본값: 서울
    }

    // cityCd: 구 코드 (필수) - 구 단위 정보
    if (params.cityCd) {
      apiParams.cityCd = params.cityCd;
    } else if (params.areaCd) {
      // areaCd를 cityCd로 변환 (시군구 코드는 보통 4자리)
      apiParams.cityCd = getCityCdFromAreaCd(params.areaCd);
    } else if (params.address) {
      // 주소에서 cityCd 추출
      apiParams.cityCd = getCityCdFromAddress(params.address);
    } else {
      console.warn("[창업기상도 API 경고] cityCd가 없습니다. 기본값 사용: 1114 (서울 중구)");
      apiParams.cityCd = "1114"; // 기본값: 서울 중구
    }

    // chkCrtrYm: 기준월 (기본값: "tdMonth")
    apiParams.chkCrtrYm = params.chkCrtrYm || "tdMonth";
    
    console.log("[창업기상도 API 최종 파라미터]", {
      tpbizClscd: apiParams.tpbizClscd,
      megaCd: apiParams.megaCd,
      cityCd: apiParams.cityCd,
      chkCrtrYm: apiParams.chkCrtrYm,
    });

    const data = await callSbizApi({
      url: "startupClimate",
      params: apiParams,
      certKey: API_KEYS.STARTUP_CLIMATE,
      apiType: "sbiz",
    });

    return data;
  } catch (error) {
    console.error("창업기상도 API 오류:", error);
    throw error;
  }
}

// 주소에서 megaCd(시도 코드) 추출
function getMegaCdFromAddress(address: string): string {
  if (address.includes("서울")) return "11";
  if (address.includes("부산")) return "26";
  if (address.includes("대구")) return "27";
  if (address.includes("인천")) return "28";
  if (address.includes("광주")) return "29";
  if (address.includes("대전")) return "30";
  if (address.includes("울산")) return "31";
  if (address.includes("세종")) return "36";
  if (address.includes("경기")) return "41";
  if (address.includes("강원")) return "42";
  if (address.includes("충북") || address.includes("충청북도")) return "43";
  if (address.includes("충남") || address.includes("충청남도")) return "44";
  if (address.includes("전북") || address.includes("전라북도")) return "45";
  if (address.includes("전남") || address.includes("전라남도")) return "46";
  if (address.includes("경북") || address.includes("경상북도")) return "47";
  if (address.includes("경남") || address.includes("경상남도")) return "48";
  if (address.includes("제주")) return "50";
  return "11"; // 기본값: 서울
}

// 주소에서 cityCd(시군구 코드) 추출
function getCityCdFromAddress(address: string): string {
  // 서울특별시 구 코드 매핑
  const seoulGuMap: Record<string, string> = {
    "종로구": "1111",
    "중구": "1114",
    "용산구": "1120",
    "성동구": "1121",
    "광진구": "1121",
    "동대문구": "1123",
    "중랑구": "1124",
    "노원구": "1135",
    "은평구": "1138",
    "서대문구": "1141",
    "마포구": "1144",
    "양천구": "1147",
    "강서구": "1150",
    "구로구": "1153",
    "금천구": "1154",
    "영등포구": "1156",
    "동작구": "1159",
    "관악구": "1162",
    "서초구": "1165",
    "강남구": "1168",
    "송파구": "1171",
    "강동구": "1174",
  };

  // 인천광역시 구 코드 매핑
  const incheonGuMap: Record<string, string> = {
    "중구": "2811",
    "동구": "2814",
    "미추홀구": "2817",
    "연수구": "2818",
    "남동구": "2820",
    "부평구": "2823",
    "계양구": "2824",
    "서구": "2826",
    "강화군": "2828",
    "옹진군": "2830",
  };

  // 주소에서 구 이름 추출
  const guMatch = address.match(/(\S+구)/);
  if (guMatch) {
    const guName = guMatch[1];
    // 서울인 경우
    if (address.includes("서울")) {
      return seoulGuMap[guName] || "1114"; // 기본값: 중구
    }
    // 인천인 경우
    if (address.includes("인천")) {
      return incheonGuMap[guName] || "2826"; // 기본값: 서구
    }
  }

  // 기본값: 서울 중구
  return "1114";
}

// areaCd를 cityCd(시군구 코드)로 변환
function getCityCdFromAreaCd(areaCd: string): string {
  // areaCd가 4자리면 그대로 사용 (시군구 코드)
  if (areaCd.length === 4) {
    return areaCd;
  }
  // areaCd가 8자리면 앞 4자리 사용
  if (areaCd.length === 8) {
    return areaCd.substring(0, 4);
  }
  // 기본값: 서울 중구
  return "1114";
}

