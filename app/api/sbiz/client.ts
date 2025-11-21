// app/api/sbiz/client.ts
import axios from "axios";

interface FetchOptions {
  url: string;
  params?: Record<string, string | number>;
  certKey: string;
  apiType?: "sbiz" | "data"; // sbiz: bigdata.sbiz.or.kr, data: apis.data.go.kr
}

export async function callSbizApi<T>({ url, params = {}, certKey, apiType = "sbiz" }: FetchOptions) {
  // 실제 API 구조 확인됨:
  // https://bigdata.sbiz.or.kr/sbiz/api/bizonSttus/storSttus/search.json
  const baseUrl = apiType === "sbiz" 
    ? "https://bigdata.sbiz.or.kr/sbiz/api/bizonSttus" 
    : "https://apis.data.go.kr/B553077/api/open/sdsc2";
  
  // API별 엔드포인트 매핑
  // 실제 개발자 도구에서 확인한 정확한 URL 기반
  const endpointMap: Record<string, { path: string; endpoint: string }> = {
    storSttus: { 
      path: "sbiz/api/bizonSttus", 
      endpoint: "storSttus/search.json" 
    },
    // 매출추이: 실제 URL 확인 - slsIdex (대문자 I)
    slsIdex: { 
      path: "sbiz/api/bizonSttus", 
      endpoint: "slsIdex/search.json"  // 실제: slsIdex (대문자 I)
    },
    // 배달현황: 실제 경로 확인 - gis/delivery/getAdmAnlsByCty.json
    delivery: { 
      path: "gis/delivery", 
      endpoint: "getAdmAnlsByCty.json" 
    },
    // 핫플레이스: gis/hpAnls/report.json
    hpReport: { 
      path: "gis/hpAnls", 
      endpoint: "report.json" 
    },
    // 간단분석: 실제 경로 확인 - getAvgAmtInfo.json
    // 실제 API: gis/simpleAnls/getAvgAmtInfo.json?admiCd=...&upjongCd=...&simpleLoc=...&xtLoginId=...
    simple: { 
      path: "gis/simpleAnls", 
      endpoint: "getAvgAmtInfo.json" 
    },
    // 유동인구 정보: gis/simpleAnls/getPopularInfo.json
    // 실제 API: gis/simpleAnls/getPopularInfo.json?analyNo=...&admiCd=...&upjongCd=...&mililis=...&xtLoginId=...
    getPopularInfo: { 
      path: "gis/simpleAnls", 
      endpoint: "getPopularInfo.json" 
    },
    // 업종 코드 조회: gis/api/getTpbizMclCodeWithBest.json
    getTpbizMclCodeWithBest: { 
      path: "gis/api", 
      endpoint: "getTpbizMclCodeWithBest.json" 
    },
    // 창업기상도: sbiz/api/swc/getDetailScore
    // 실제 API: https://bigdata.sbiz.or.kr/sbiz/api/swc/getDetailScore?tpbizClscd=I21201&megaCd=28&chkCrtrYm=tdMonth&cityCd=2826
    startupClimate: { 
      path: "sbiz/api/swc", 
      endpoint: "getDetailScore" 
    },
  };

  const apiConfig = endpointMap[url];
  let requestUrl: string;
  if (apiConfig) {
    requestUrl = `https://bigdata.sbiz.or.kr/${apiConfig.path}/${apiConfig.endpoint}`;
  } else {
    requestUrl = `${baseUrl}/${url}/search.json`;
  }

  // 실제 API는 certKey를 파라미터로 사용하지 않음
  // 세션 기반 인증을 사용 (쿠키로 관리)
  const requestParams = apiType === "sbiz"
    ? {
        // certKey는 사용하지 않음 (세션 기반 인증)
        ...params,
      }
    : {
        serviceKey: certKey,
        pageNo: 1,
        numOfRows: 100,
        type: "json",
        ...params,
      };

  try {
    // URL 인코딩된 파라미터 확인용
    const encodedParams = new URLSearchParams();
    Object.entries(requestParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        encodedParams.append(key, String(value));
      }
    });
    const fullUrl = `${requestUrl}?${encodedParams.toString()}`;
    
    console.log(`[API 호출] ${url}`);
    console.log(`[URL] ${fullUrl}`);
    console.log(`[파라미터]`, requestParams);
    
    // 실제 API는 쿠키 기반 인증을 사용할 수 있음
    // certKey를 쿠키로 전달 시도
    const response = await axios.get<T>(requestUrl, {
      params: requestParams,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Referer": "https://bigdata.sbiz.or.kr/",
        "Origin": "https://bigdata.sbiz.or.kr",
      },
      withCredentials: true, // 쿠키 전송 허용
      timeout: 10000, // 10초 타임아웃
    });

    if (response.status === 200) {
      console.log(`[API 성공] ${url}:`, response.status);
      if (response.data) {
        console.log(`[데이터]`, typeof response.data === 'object' ? Object.keys(response.data) : '데이터 있음');
      }
      return response.data;
    } else {
      console.warn(`[API 경고] ${url}:`, response.status);
      return response.data;
    }
  } catch (error: any) {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: requestUrl,
      params: requestParams,
    };
    
    // 에러 상세 로그 출력
    console.error(`[API 오류] ${url}:`, JSON.stringify(errorInfo, null, 2));
    
    // 404 에러인 경우 다른 엔드포인트 패턴 시도
    if (error.response?.status === 404 && apiType === "sbiz") {
      // 간단분석 API의 경우 다른 엔드포인트 시도
      const altPatterns: string[] = [];
      
      if (url === "simple") {
        // 간단분석의 경우 다른 엔드포인트 시도 (getAvgAmtInfo.json이 실패한 경우)
        altPatterns.push(
          `https://bigdata.sbiz.or.kr/gis/simpleAnls/getBaeminInfo.json`,
          `https://bigdata.sbiz.or.kr/gis/simpleAnls/getPopularInfo.json`,
          `https://bigdata.sbiz.or.kr/gis/api/getPopularInfo.json`
        );
      } else {
        altPatterns.push(
          `https://bigdata.sbiz.or.kr/api/openApi/${url}`,
          `https://bigdata.sbiz.or.kr/api/${url}`,
          `https://bigdata.sbiz.or.kr/openApi/${url}?certKey=${certKey}`
        );
      }

      for (const altUrl of altPatterns) {
        try {
          console.log(`[재시도] ${altUrl}`);
          
          // URL에 이미 파라미터가 포함된 경우 (예: gis/openApi/simple?certKey=...)
          const urlObj = new URL(altUrl);
          const hasParams = urlObj.searchParams.toString().length > 0;
          
          const retryResponse = await axios.get<T>(altUrl, {
            // URL에 이미 파라미터가 있으면 추가 파라미터 전달하지 않음
            params: hasParams ? {} : (apiType === "sbiz" ? { ...params } : requestParams),
            headers: {
              "Accept": "application/json, text/plain, */*",
              "Referer": "https://bigdata.sbiz.or.kr/",
              "Origin": "https://bigdata.sbiz.or.kr",
            },
            withCredentials: true,
            timeout: 5000,
          });
          console.log(`[재시도 성공] ${altUrl}`);
          return retryResponse.data;
        } catch (retryError: any) {
          console.log(`[재시도 실패] ${altUrl}: ${retryError.response?.status || retryError.message}`);
        }
      }
    }
    
    throw error;
  }
}