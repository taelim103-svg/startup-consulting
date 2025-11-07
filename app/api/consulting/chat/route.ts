import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "메시지를 입력해주세요" },
        { status: 400 }
      );
    }

    // AI 응답 생성
    const aiMessage = await generateChatResponse(messages, context);

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("채팅 오류:", error);
    return NextResponse.json(
      { error: "채팅 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

async function generateChatResponse(messages: any[], context: any) {
  // OpenAI API를 사용한 채팅 (실제 구현)
  if (process.env.OPENAI_API_KEY) {
    try {
      const systemPrompt = `
당신은 전문 창업 컨설턴트입니다. 다음 고객 정보를 바탕으로 질문에 답변해주세요.

고객 정보:
- 예산: ${context.budget}
- 희망 지역: ${context.location}
- 희망 업종: ${context.industry}
- 창업 경험: ${context.experience || "없음"}
- 목표: ${context.goals || "없음"}

답변 시 유의사항:
1. 친절하고 공감하는 톤으로 답변하세요
2. 구체적이고 실용적인 조언을 제공하세요
3. 필요시 예시나 수치를 들어 설명하세요
4. 3-5문장 정도로 간결하게 답변하세요
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "죄송합니다. 답변을 생성할 수 없습니다.";
    } catch (error) {
      console.error("OpenAI API 오류:", error);
      // API 오류 시 기본 응답
    }
  }

  // 데모 응답 생성
  return generateDemoResponse(messages, context);
}

function generateDemoResponse(messages: any[], context: any) {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();

  // 키워드 기반 응답
  if (lastMessage.includes("비용") || lastMessage.includes("예산")) {
    return `${context.budget} 예산으로 ${context.industry} 창업을 하신다면, 초기 비용을 최대한 절감하는 것이 중요합니다. 
    
보증금과 권리금을 낮추기 위해 신규 상가나 재개발 지역을 고려해보세요. 인테리어는 셀프 인테리어나 중고 집기를 활용하면 30% 이상 절감할 수 있습니다.

또한 정부 지원금을 적극 활용하시면 실제 부담을 크게 줄일 수 있습니다. 청년창업지원금의 경우 연 2% 저금리로 최대 1억원까지 지원받을 수 있습니다.`;
  }

  if (lastMessage.includes("상권") || lastMessage.includes("지역") || lastMessage.includes("입지")) {
    return `${context.location}은 좋은 선택입니다! 해당 지역은 유동인구가 많고 대중교통 접근성이 우수합니다.

상권 선택 시 주의할 점은:
1. 시간대별 유동인구 확인 (점심/저녁 시간대가 중요)
2. 주 고객층 분석 (연령대, 소득 수준)
3. 경쟁 업체 현황 (너무 많으면 레드오션)
4. 향후 개발 계획 (재개발, 신규 건물 등)

최소 3곳 이상을 비교 검토하시고, 각 지역을 평일/주말, 낮/밤 시간대별로 직접 방문해보시길 권장합니다.`;
  }

  if (lastMessage.includes("성공") || lastMessage.includes("팁") || lastMessage.includes("조언")) {
    return `${context.industry} 창업 성공을 위한 핵심 조언을 드리겠습니다:

1. **차별화가 핵심**: 비슷한 업종이 많으므로 나만의 강점을 만드세요. 특별한 메뉴, 독특한 인테리어, 뛰어난 서비스 등 최소 하나는 확실히 차별화하세요.

2. **SNS 마케팅**: 인스타그램, 블로그를 적극 활용하세요. 특히 오픈 초기 3개월이 매우 중요합니다.

3. **고객 피드백**: 초기 고객들의 의견을 적극 수렴하고 빠르게 개선하세요. 단골 고객 확보가 생존의 열쇠입니다.

4. **비용 관리**: 매출도 중요하지만 불필요한 지출을 줄이는 것이 더 중요합니다. 매일 장부를 기록하세요.`;
  }

  if (lastMessage.includes("경쟁") || lastMessage.includes("차별화")) {
    return `경쟁이 치열한 것은 사실이지만, 그만큼 수요가 있다는 의미이기도 합니다!

차별화 전략:
1. **타겟 고객 명확화**: 모든 사람을 만족시키려 하지 말고, 특정 고객층을 정확히 타겟하세요.
2. **시그니처 메뉴**: 다른 곳에서 맛볼 수 없는 특별한 메뉴 1-2개를 개발하세요.
3. **스토리텔링**: 창업 스토리, 메뉴 개발 과정 등을 SNS로 공유하여 감성적 연결을 만드세요.
4. **틈새 시간 공략**: 경쟁이 약한 시간대(예: 오전 10-12시)를 집중 공략하세요.

작은 차이가 큰 경쟁력이 됩니다!`;
  }

  if (lastMessage.includes("지원금") || lastMessage.includes("대출")) {
    return `창업 지원금은 적극적으로 활용하셔야 합니다! 

주요 지원금:
1. **청년창업지원금**: 만 39세 이하, 최대 1억원, 연 2% 저금리
2. **소상공인 정책자금**: 업종 무관, 최대 7천만원, 2-3% 금리
3. **지역 창업 지원금**: 지자체별 500만원~3천만원 (반환 불필요)

신청 팁:
- 사업계획서를 구체적으로 작성하세요 (시장 분석, 재무 계획 등)
- 여러 지원금을 동시에 신청할 수 있습니다
- 소상공인진흥공단에서 무료 컨설팅을 받을 수 있습니다

지원금 신청 기한을 놓치지 마세요!`;
  }

  // 기본 응답
  return `좋은 질문입니다! ${context.industry} 창업과 관련하여 더 구체적으로 말씀해주시면 맞춤형 조언을 드릴 수 있습니다.

예를 들어:
- 초기 비용을 줄이는 방법
- 상권 선택 기준
- 경쟁 업체 대응 전략
- 마케팅 방법
- 지원금 신청 방법

어떤 부분이 가장 궁금하신가요?`;
}

