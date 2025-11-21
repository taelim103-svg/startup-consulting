// 모든 API 엔드포인트 패턴 테스트
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const baseUrl = "https://bigdata.sbiz.or.kr";
  
  // 각 API별로 가능한 엔드포인트 패턴들
  const apiTests = [
    {
      name: "업소현황 (storSttus)",
      patterns: [
        "sbiz/api/bizonSttus/storSttus/search.json",
        "sbiz/api/storSttus/search.json",
        "api/bizonSttus/storSttus/search.json",
        "openApi/storSttus/search.json",
      ],
    },
    {
      name: "매출추이 (slsIdex)",
      patterns: [
        "sbiz/api/bizonSttus/slsIdex/search.json",
        "sbiz/api/slsIdex/search.json",
        "api/bizonSttus/slsIdex/search.json",
        "openApi/slsIdex/search.json",
      ],
    },
    {
      name: "배달현황 (delivery)",
      patterns: [
        "sbiz/api/bizonSttus/delivery/search.json",
        "sbiz/api/delivery/search.json",
        "api/bizonSttus/delivery/search.json",
        "openApi/delivery/search.json",
      ],
    },
    {
      name: "핫플레이스 (hpReport)",
      patterns: [
        "sbiz/api/bizonSttus/hpReport/search.json",
        "sbiz/api/hpReport/search.json",
        "api/bizonSttus/hpReport/search.json",
        "openApi/hpReport/search.json",
      ],
    },
    {
      name: "간단분석 (simple)",
      patterns: [
        "sbiz/api/bizonSttus/simple/search.json",
        "sbiz/api/simple/search.json",
        "api/bizonSttus/simple/search.json",
        "openApi/simple/search.json",
      ],
    },
  ];

  const testParams = {
    sprTypeNo: 1,
    areaCd: "1168",
    upjongGb: 2,
    upjongCd: "1212",
    kin: "area",
  };

  const results: any = {};

  for (const apiTest of apiTests) {
    results[apiTest.name] = [];
    
    for (const pattern of apiTest.patterns) {
      const url = `${baseUrl}/${pattern}`;
      try {
        const response = await axios.get(url, {
          params: testParams,
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://bigdata.sbiz.or.kr/",
            "Origin": "https://bigdata.sbiz.or.kr",
          },
          withCredentials: true,
          timeout: 5000,
        });

        results[apiTest.name].push({
          pattern,
          success: true,
          status: response.status,
          hasData: !!response.data,
        });
      } catch (error: any) {
        results[apiTest.name].push({
          pattern,
          success: false,
          status: error.response?.status || "N/A",
          error: error.message,
        });
      }
    }
  }

  return NextResponse.json({
    testParams,
    results,
  });
}

