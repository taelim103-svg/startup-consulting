"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  FaMoneyBillWave, 
  FaStore, 
  FaFileAlt, 
  FaHandHoldingUsd,
  FaChartBar,
  FaUsers,
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkedAlt
} from "react-icons/fa";

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<string>("process");

  const tabs = [
    { id: "process", name: "창업 절차", icon: <FaFileAlt /> },
    { id: "cost", name: "초기 비용", icon: <FaMoneyBillWave /> },
    { id: "support", name: "지원금", icon: <FaHandHoldingUsd /> },
    { id: "franchise", name: "프랜차이즈", icon: <FaStore /> },
    { id: "tips", name: "창업 팁", icon: <FaLightbulb /> },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            창업 통합 정보
          </h1>
          <p className="text-xl text-gray-600">
            흩어진 창업 정보를 한 곳에서 체계적으로 확인하세요
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "process" && <ProcessContent />}
          {activeTab === "cost" && <CostContent />}
          {activeTab === "support" && <SupportContent />}
          {activeTab === "franchise" && <FranchiseContent />}
          {activeTab === "tips" && <TipsContent />}
        </motion.div>
      </div>
    </div>
  );
}

// 창업 절차
function ProcessContent() {
  const steps = [
    {
      title: "1. 아이템 선정",
      items: [
        "본인의 관심사, 경험, 전문성 고려",
        "시장 트렌드 및 수요 조사",
        "경쟁 환경 분석",
        "초기 투자 비용 대비 수익성 검토"
      ]
    },
    {
      title: "2. 상권 분석",
      items: [
        "유동인구 조사 (연령대, 성별, 시간대)",
        "경쟁업체 현황 파악",
        "주변 시설 및 교통 접근성",
        "임대료 및 권리금 조사"
      ]
    },
    {
      title: "3. 사업계획서 작성",
      items: [
        "사업 개요 및 목표 설정",
        "시장 분석 및 마케팅 전략",
        "재무 계획 (손익분기점 분석)",
        "운영 계획 및 인력 구성"
      ]
    },
    {
      title: "4. 자금 조달",
      items: [
        "자기자본 확인",
        "정부 지원금 신청",
        "은행 대출 상담",
        "투자 유치 (필요시)"
      ]
    },
    {
      title: "5. 사업자 등록",
      items: [
        "사업자등록증 발급 (세무서)",
        "업종별 인허가 취득",
        "4대 보험 가입",
        "통신판매업 신고 (온라인 판매시)"
      ]
    },
    {
      title: "6. 매장 준비",
      items: [
        "임대차 계약 체결",
        "인테리어 및 시설 공사",
        "설비 및 집기 구입",
        "재고 확보 및 공급처 계약"
      ]
    },
    {
      title: "7. 오픈 준비",
      items: [
        "직원 채용 및 교육",
        "메뉴/상품 최종 확정",
        "마케팅 및 홍보 (SNS, 전단지)",
        "소프트 오픈 (시범 운영)"
      ]
    },
    {
      title: "8. 정식 오픈",
      items: [
        "그랜드 오픈 이벤트",
        "고객 피드백 수집",
        "운영 개선 및 최적화",
        "매출 및 비용 관리"
      ]
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-bold text-indigo-600 mb-4">{step.title}</h3>
          <ul className="space-y-2">
            {step.items.map((item, idx) => (
              <li key={idx} className="flex items-start text-gray-700">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// 초기 비용
function CostContent() {
  const costCategories = [
    {
      category: "카페",
      budget: "5천만원 ~ 1억원",
      items: [
        { name: "보증금 및 권리금", cost: "2,000만원 ~ 4,000만원" },
        { name: "인테리어", cost: "1,500만원 ~ 3,000만원" },
        { name: "설비 (에스프레소 머신 등)", cost: "800만원 ~ 1,500만원" },
        { name: "집기 및 비품", cost: "300만원 ~ 500만원" },
        { name: "초기 재고", cost: "200만원 ~ 300만원" },
        { name: "운영 자금 (3개월)", cost: "700만원 ~ 1,200만원" },
      ]
    },
    {
      category: "음식점 (소형)",
      budget: "6천만원 ~ 1.5억원",
      items: [
        { name: "보증금 및 권리금", cost: "2,500만원 ~ 5,000만원" },
        { name: "인테리어", cost: "2,000만원 ~ 4,000만원" },
        { name: "주방 설비", cost: "1,000만원 ~ 2,000만원" },
        { name: "집기 및 비품", cost: "500만원 ~ 800만원" },
        { name: "초기 재고", cost: "300만원 ~ 500만원" },
        { name: "운영 자금 (3개월)", cost: "1,000만원 ~ 1,500만원" },
      ]
    },
    {
      category: "소매업 (의류/잡화)",
      budget: "3천만원 ~ 8천만원",
      items: [
        { name: "보증금 및 권리금", cost: "1,500만원 ~ 3,000만원" },
        { name: "인테리어", cost: "800만원 ~ 2,000만원" },
        { name: "집기 (진열대 등)", cost: "300만원 ~ 500만원" },
        { name: "초기 재고", cost: "1,000만원 ~ 2,000만원" },
        { name: "운영 자금 (3개월)", cost: "500만원 ~ 1,000만원" },
      ]
    },
    {
      category: "서비스업 (미용실)",
      budget: "4천만원 ~ 1억원",
      items: [
        { name: "보증금 및 권리금", cost: "1,500만원 ~ 3,000만원" },
        { name: "인테리어", cost: "1,500만원 ~ 3,000만원" },
        { name: "설비 (의자, 세면대 등)", cost: "800만원 ~ 1,500만원" },
        { name: "집기 및 도구", cost: "300만원 ~ 500만원" },
        { name: "운영 자금 (3개월)", cost: "600만원 ~ 1,000만원" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-yellow-500 text-2xl mr-3 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">비용 계획 시 유의사항</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• 예상 비용의 20-30% 여유 자금을 확보하세요</li>
              <li>• 최소 3-6개월치 운영 자금을 준비하세요</li>
              <li>• 지역과 입지에 따라 비용이 크게 달라질 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>

      {costCategories.map((category, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{category.category}</h3>
            <span className="text-lg font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
              {category.budget}
            </span>
          </div>
          <div className="space-y-3">
            {category.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-semibold text-gray-800">{item.cost}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// 지원금
function SupportContent() {
  const supports = [
    {
      title: "청년창업지원금",
      target: "만 39세 이하 청년",
      amount: "최대 1억원",
      type: "융자 (저금리)",
      features: [
        "연 2% 대 저금리",
        "최대 5년 거치 10년 분할상환",
        "사업계획서 심사 통과 필요",
        "온라인 신청 가능"
      ],
      link: "https://www.k-startup.go.kr"
    },
    {
      title: "소상공인 정책자금",
      target: "소상공인 (업종 무관)",
      amount: "최대 7천만원",
      type: "융자",
      features: [
        "업종별 차등 금리 (2~3%)",
        "담보 또는 보증서 필요",
        "창업 초기 운영자금 지원",
        "소상공인진흥공단 운영"
      ],
      link: "https://www.semas.or.kr"
    },
    {
      title: "지역 창업 지원금",
      target: "지역별 상이",
      amount: "500만원 ~ 3천만원",
      type: "보조금",
      features: [
        "지자체별 상이한 조건",
        "서울시: 청년창업 1천만원",
        "경기도: 소상공인 500만원",
        "반환 불필요 (조건 충족시)"
      ],
      link: "각 지자체 홈페이지"
    },
    {
      title: "여성 창업 지원",
      target: "여성 예비창업자",
      amount: "최대 5천만원",
      type: "융자 + 교육",
      features: [
        "여성기업종합지원센터 운영",
        "창업 교육 무료 제공",
        "멘토링 및 컨설팅 지원",
        "네트워킹 기회 제공"
      ],
      link: "https://www.wbiz.or.kr"
    },
    {
      title: "기술창업 지원 (TIPS)",
      target: "기술 기반 창업",
      amount: "최대 5억원",
      type: "투자 + 보조금",
      features: [
        "기술성 평가 통과 필요",
        "엔젤투자 매칭",
        "R&D 자금 지원",
        "해외 진출 지원"
      ],
      link: "https://www.tips.or.kr"
    },
    {
      title: "재창업 지원금",
      target: "폐업 후 재창업자",
      amount: "최대 3천만원",
      type: "융자",
      features: [
        "실패 경험 인정",
        "낮은 금리 (2% 내외)",
        "신용회복 지원 병행",
        "재기교육 프로그램 제공"
      ],
      link: "https://www.semas.or.kr"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
        <div className="flex items-start">
          <FaHandHoldingUsd className="text-green-500 text-2xl mr-3 mt-1" />
          <div>
            <h3 className="font-bold text-green-800 mb-2">지원금 신청 팁</h3>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• 여러 지원금을 중복으로 신청할 수 있습니다</li>
              <li>• 사업계획서를 꼼꼼하게 작성하세요</li>
              <li>• 신청 기한을 놓치지 않도록 주의하세요</li>
              <li>• 지원금 조건을 반드시 확인하세요</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {supports.map((support, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{support.title}</h3>
                <p className="text-sm text-gray-600">{support.target}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                {support.type}
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 mb-4">
              <p className="text-sm opacity-90 mb-1">지원 금액</p>
              <p className="text-2xl font-bold">{support.amount}</p>
            </div>

            <ul className="space-y-2 mb-4">
              {support.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={support.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
            >
              자세히 보기 →
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 프랜차이즈
function FranchiseContent() {
  const franchises = [
    {
      category: "카페",
      brands: [
        { name: "이디야커피", cost: "1억~1.5억", royalty: "3%", features: "저비용, 높은 인지도" },
        { name: "빽다방", cost: "1.5억~2억", royalty: "5%", features: "가성비, 빠른 회전율" },
        { name: "메가커피", cost: "8천~1.2억", royalty: "4%", features: "저가 전략, 높은 수익" },
        { name: "컴포즈커피", cost: "7천~1억", royalty: "3%", features: "초저가, 빠른 성장" },
      ]
    },
    {
      category: "치킨",
      brands: [
        { name: "교촌치킨", cost: "2억~3억", royalty: "5%", features: "프리미엄, 높은 단가" },
        { name: "BBQ", cost: "2억~2.5억", royalty: "4%", features: "다양한 메뉴, 브랜드력" },
        { name: "네네치킨", cost: "1.5억~2억", royalty: "4%", features: "안정적, 검증된 시스템" },
        { name: "굽네치킨", cost: "1.8억~2.3억", royalty: "5%", features: "오븐구이, 차별화" },
      ]
    },
    {
      category: "분식",
      brands: [
        { name: "죠스떡볶이", cost: "5천~8천", royalty: "3%", features: "소자본, 간편 운영" },
        { name: "국대떡볶이", cost: "6천~9천", royalty: "4%", features: "다양한 메뉴, 배달 강점" },
        { name: "신전떡볶이", cost: "7천~1억", royalty: "4%", features: "독특한 맛, 충성고객" },
      ]
    },
    {
      category: "편의점",
      brands: [
        { name: "CU", cost: "1억~2억", royalty: "없음", features: "1위 점유율, 다양한 상품" },
        { name: "GS25", cost: "1억~2억", royalty: "없음", features: "안정적, 좋은 입지" },
        { name: "세븐일레븐", cost: "1.2억~2.5억", royalty: "없음", features: "글로벌 브랜드" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-start">
          <FaStore className="text-blue-500 text-2xl mr-3 mt-1" />
          <div>
            <h3 className="font-bold text-blue-800 mb-2">프랜차이즈 선택 시 체크리스트</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• 가맹비, 로열티, 교육비 등 숨은 비용 확인</li>
              <li>• 본사의 지원 시스템 (마케팅, 물류, 교육)</li>
              <li>• 기존 가맹점주 인터뷰 및 실제 수익 확인</li>
              <li>• 계약 조건 (기간, 해지 조건 등) 꼼꼼히 검토</li>
              <li>• 상권 보호 및 배타적 권리 확인</li>
            </ul>
          </div>
        </div>
      </div>

      {franchises.map((category, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaStore className="text-indigo-600 mr-2" />
            {category.category}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {category.brands.map((brand, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-bold text-lg text-gray-800 mb-2">{brand.name}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">초기 비용:</span> {brand.cost}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">로열티:</span> {brand.royalty}
                  </p>
                  <p className="text-gray-600 mt-2">{brand.features}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">프랜차이즈 vs 독립 창업</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-indigo-200 rounded-xl p-5">
            <h4 className="font-bold text-indigo-600 mb-3 flex items-center">
              <FaCheckCircle className="mr-2" />
              프랜차이즈 장점
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 검증된 비즈니스 모델</li>
              <li>• 브랜드 인지도 활용</li>
              <li>• 본사의 운영 지원</li>
              <li>• 마케팅 및 물류 시스템</li>
              <li>• 초보자도 시작 가능</li>
            </ul>
          </div>
          <div className="border-2 border-purple-200 rounded-xl p-5">
            <h4 className="font-bold text-purple-600 mb-3 flex items-center">
              <FaCheckCircle className="mr-2" />
              독립 창업 장점
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 낮은 초기 비용</li>
              <li>• 로열티 부담 없음</li>
              <li>• 자유로운 운영</li>
              <li>• 차별화된 컨셉 가능</li>
              <li>• 높은 수익률 가능</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 창업 팁
function TipsContent() {
  const tips = [
    {
      title: "상권 선택이 50% 이상",
      icon: <FaMapMarkedAlt className="text-3xl text-blue-500" />,
      content: "아무리 좋은 아이템도 상권이 맞지 않으면 실패합니다. 유동인구, 주 고객층, 경쟁 환경을 철저히 분석하세요.",
      tips: [
        "최소 3개 이상의 후보지를 비교하세요",
        "시간대별로 직접 방문해 유동인구를 확인하세요",
        "주변 상권의 변화 추이를 파악하세요",
        "임대료가 저렴하다고 무조건 좋은 것은 아닙니다"
      ]
    },
    {
      title: "초기 3개월이 중요",
      icon: <FaChartBar className="text-3xl text-green-500" />,
      content: "대부분의 창업 실패는 초기 3개월에 결정됩니다. 충분한 운영 자금을 확보하고 빠르게 개선하세요.",
      tips: [
        "최소 3-6개월치 고정비를 확보하세요",
        "오픈 초기 마케팅에 집중하세요",
        "고객 피드백을 즉시 반영하세요",
        "손익분기점 달성 시기를 명확히 하세요"
      ]
    },
    {
      title: "차별화 전략 필수",
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      content: "비슷한 업종이 많은 시대, 나만의 강점을 만들어야 살아남습니다.",
      tips: [
        "가격, 품질, 서비스 중 하나는 확실히 차별화",
        "SNS 마케팅을 적극 활용하세요",
        "고객과의 소통을 중요하게 생각하세요",
        "시즌별 이벤트로 재방문을 유도하세요"
      ]
    },
    {
      title: "비용 관리가 생명",
      icon: <FaMoneyBillWave className="text-3xl text-red-500" />,
      content: "매출도 중요하지만 비용 관리가 더 중요합니다. 불필요한 지출을 줄이세요.",
      tips: [
        "고정비와 변동비를 명확히 구분하세요",
        "재고 관리를 철저히 하세요",
        "인건비 최적화 (효율적인 시간대 배치)",
        "매일 매출과 비용을 기록하세요"
      ]
    },
    {
      title: "온라인 채널 활용",
      icon: <FaUsers className="text-3xl text-purple-500" />,
      content: "오프라인 매장도 온라인 마케팅은 필수입니다. SNS와 배달앱을 적극 활용하세요.",
      tips: [
        "인스타그램, 블로그로 매장을 알리세요",
        "배달앱 입점으로 매출 다각화",
        "리뷰 관리를 꼼꼼히 하세요",
        "온라인 예약 시스템 도입 검토"
      ]
    },
    {
      title: "실패를 두려워하지 마세요",
      icon: <FaCheckCircle className="text-3xl text-indigo-500" />,
      content: "많은 성공한 창업가들도 실패를 경험했습니다. 중요한 것은 빠르게 배우고 개선하는 것입니다.",
      tips: [
        "작은 규모로 시작해 리스크를 줄이세요",
        "실패 사례를 공부하세요",
        "멘토나 선배 창업자의 조언을 구하세요",
        "포기하지 말고 끈기있게 도전하세요"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-3">💡 성공 창업을 위한 핵심 원칙</h3>
        <p className="text-lg opacity-90">
          "준비된 창업자만이 성공합니다. 충분히 조사하고, 계획하고, 실행하세요."
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="mr-4">{tip.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{tip.title}</h3>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{tip.content}</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">실천 방법:</h4>
              <ul className="space-y-2">
                {tip.tips.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="text-indigo-500 mr-2">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          창업 실패의 주요 원인
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-red-500 mb-2">38%</div>
            <p className="text-gray-700 font-semibold">상권 분석 부족</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-500 mb-2">27%</div>
            <p className="text-gray-700 font-semibold">자금 부족</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-2">22%</div>
            <p className="text-gray-700 font-semibold">경쟁 과다</p>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-6 text-sm">
          * 소상공인시장진흥공단 2023년 조사 기준
        </p>
      </div>
    </div>
  );
}

