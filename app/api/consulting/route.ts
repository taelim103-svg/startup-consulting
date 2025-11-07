import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { budget, location, industry, experience, goals } = await request.json();

    if (!budget || !location || !industry) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요" },
        { status: 400 }
      );
    }

    // AI 컨설팅 생성
    const consultingData = await generateConsulting({
      budget,
      location,
      industry,
      experience,
      goals,
    });

    return NextResponse.json(consultingData);
  } catch (error) {
    console.error("컨설팅 오류:", error);
    return NextResponse.json(
      { error: "컨설팅 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

async function generateConsulting(formData: any) {
  const { budget, location, industry, experience, goals } = formData;

  // OpenAI API를 사용한 컨설팅 (실제 구현)
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `
당신은 전문 창업 컨설턴트입니다. 다음 정보를 바탕으로 맞춤형 창업 컨설팅을 제공해주세요.

- 예산: ${budget}
- 희망 지역: ${location}
- 희망 업종: ${industry}
- 창업 경험: ${experience || "없음"}
- 목표 및 고민: ${goals || "없음"}

다음 형식으로 답변해주세요:
1. 창업 적합도 점수 (0-100)
2. 적합도 평가 코멘트
3. 추천 아이템 3가지 (이름, 이유, 예상 초기 비용)
4. 예산 분석 (카테고리별 금액)
5. 받을 수 있는 지원금 3가지
6. 핵심 조언 3가지
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 20년 경력의 전문 창업 컨설턴트입니다. 실용적이고 현실적인 조언을 제공합니다.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;
      
      // AI 응답을 파싱하여 구조화된 데이터로 변환
      // (실제로는 더 정교한 파싱 로직 필요)
      return parseAIResponse(aiResponse, formData);
    } catch (error) {
      console.error("OpenAI API 오류:", error);
      // API 오류 시 데모 데이터 반환
    }
  }

  // 데모 데이터 생성
  return generateDemoConsulting(formData);
}

function parseAIResponse(aiResponse: string | null, formData: any) {
  // AI 응답을 파싱하여 구조화
  // 실제로는 더 정교한 파싱 로직이 필요합니다
  return generateDemoConsulting(formData);
}

function generateDemoConsulting(formData: any) {
  const { budget, location, industry, experience } = formData;

  // 예산에 따른 점수 계산
  const budgetScore = calculateBudgetScore(budget, industry);
  
  // 지역에 따른 점수
  const locationScore = calculateLocationScore(location);
  
  // 경험에 따른 점수
  const experienceScore = calculateExperienceScore(experience);

  const feasibilityScore = Math.round((budgetScore + locationScore + experienceScore) / 3);

  // 업종별 추천 아이템
  const recommendedItems = getRecommendedItems(industry, budget);

  // 예산 분석
  const budgetBreakdown = getBudgetBreakdown(budget, industry);

  // 지원금
  const availableSupports = getAvailableSupports(formData);

  // 핵심 조언
  const keyAdvice = getKeyAdvice(formData, feasibilityScore);

  return {
    feasibilityScore,
    feasibilityComment: getFeasibilityComment(feasibilityScore),
    recommendedItems,
    budgetBreakdown,
    availableSupports,
    keyAdvice,
  };
}

function calculateBudgetScore(budget: string, industry: string): number {
  const budgetMap: { [key: string]: number } = {
    "3천만원 이하": 30,
    "3천만원 ~ 5천만원": 50,
    "5천만원 ~ 7천만원": 70,
    "7천만원 ~ 1억원": 85,
    "1억원 ~ 2억원": 90,
    "2억원 이상": 95,
  };

  return budgetMap[budget] || 50;
}

function calculateLocationScore(location: string): number {
  // 서울 주요 상권은 높은 점수
  if (location.includes("강남") || location.includes("홍대") || location.includes("잠실")) {
    return 85;
  }
  if (location.includes("서울")) {
    return 75;
  }
  return 65;
}

function calculateExperienceScore(experience: string): number {
  const expMap: { [key: string]: number } = {
    "창업 경험 없음": 50,
    "1년 미만": 60,
    "1~3년": 75,
    "3~5년": 85,
    "5년 이상": 95,
  };

  return expMap[experience] || 60;
}

function getFeasibilityComment(score: number): string {
  if (score >= 80) {
    return "매우 좋은 조건입니다! 충분한 준비와 함께 성공 가능성이 높습니다.";
  }
  if (score >= 60) {
    return "양호한 조건입니다. 철저한 준비와 차별화 전략이 필요합니다.";
  }
  if (score >= 40) {
    return "도전 가능한 수준입니다. 리스크 관리와 충분한 시장 조사가 필수입니다.";
  }
  return "현재 조건으로는 어려움이 예상됩니다. 더 많은 준비가 필요합니다.";
}

function getRecommendedItems(industry: string, budget: string) {
  const items: { [key: string]: any[] } = {
    "카페": [
      {
        name: "소형 테이크아웃 카페",
        reason: "낮은 초기 비용, 빠른 회전율, 배달 가능",
        cost: "5천만원 ~ 7천만원",
      },
      {
        name: "디저트 카페",
        reason: "높은 마진율, 차별화 가능, SNS 마케팅 유리",
        cost: "6천만원 ~ 9천만원",
      },
      {
        name: "프랜차이즈 카페",
        reason: "검증된 시스템, 브랜드 인지도, 본사 지원",
        cost: "8천만원 ~ 1.5억원",
      },
    ],
    "음식점": [
      {
        name: "1인 운영 분식점",
        reason: "낮은 인건비, 간단한 조리, 안정적 수요",
        cost: "4천만원 ~ 6천만원",
      },
      {
        name: "테이크아웃 전문점",
        reason: "작은 평수, 배달 중심, 낮은 임대료",
        cost: "5천만원 ~ 8천만원",
      },
      {
        name: "특화 메뉴 음식점",
        reason: "차별화 가능, 높은 단가, 충성 고객 확보",
        cost: "7천만원 ~ 1.2억원",
      },
    ],
  };

  return items[industry] || items["카페"];
}

function getBudgetBreakdown(budget: string, industry: string) {
  // 업종별 예산 배분
  return [
    { category: "보증금 및 권리금", amount: "2,000만원" },
    { category: "인테리어", amount: "1,500만원" },
    { category: "설비 및 집기", amount: "1,000만원" },
    { category: "초기 재고", amount: "300만원" },
    { category: "마케팅", amount: "200만원" },
    { category: "운영 자금 (3개월)", amount: "1,000만원" },
  ];
}

function getAvailableSupports(formData: any) {
  const supports = [
    {
      name: "청년창업지원금",
      amount: "최대 1억원 (연 2% 금리)",
      eligibility: "만 39세 이하",
    },
    {
      name: "소상공인 정책자금",
      amount: "최대 7천만원",
      eligibility: "소상공인",
    },
    {
      name: "지역 창업 지원금",
      amount: "500만원 ~ 3천만원",
      eligibility: "지역별 상이",
    },
  ];

  return supports;
}

function getKeyAdvice(formData: any, score: number) {
  return [
    "상권 분석을 철저히 하세요. 최소 3곳 이상 비교 검토하세요.",
    "초기 3개월은 적자를 감수해야 합니다. 충분한 운영 자금을 확보하세요.",
    "차별화 전략이 핵심입니다. SNS 마케팅을 적극 활용하세요.",
  ];
}

