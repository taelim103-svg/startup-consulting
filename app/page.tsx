"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaChartLine, FaMapMarkedAlt, FaLightbulb, FaRocket, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "김지훈",
      age: 33,
      job: "6년차 직장인",
      budget: "6천만원",
      business: "카페",
      location: "서울 송파구",
      avatar: "👨‍💼",
      quote: "6천만원을 모아두고 카페 창업을 꿈꾸고 있지만, 어디서부터 시작해야 할지 막막했습니다.",
      story: "네이버와 유튜브를 뒤져봐도 정보가 파편화되어 있고, 각자 하는 말이 달라서 혼란스러웠죠.",
      achievements: [
        "송파구 인근 상권 데이터를 한눈에 확인",
        "6천만원 예산에 맞는 현실적인 창업 아이템 추천",
        "받을 수 있는 지원금과 신청 방법 정리",
        "AI 기반 맞춤형 사업계획서 작성 가이드"
      ],
      result: "이제 확신을 갖고 창업을 준비할 수 있게 되었습니다!",
      bgColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "박서연",
      age: 28,
      job: "마케터 출신",
      budget: "4천만원",
      business: "베이커리",
      location: "경기 성남시",
      avatar: "👩‍🍳",
      quote: "SNS 마케팅 경험을 살려 베이커리를 하고 싶었지만, 제빵 경험이 없어 걱정이었어요.",
      story: "초기 비용이 너무 많이 들까봐 걱정했는데, 작은 규모로 시작할 수 있다는 걸 알게 됐습니다.",
      achievements: [
        "소자본으로 시작 가능한 베이커리 모델 발견",
        "인스타그램 기반 예약 판매 전략 수립",
        "판교 테크노밸리 인근 직장인 타겟 상권 분석",
        "청년창업지원금 2천만원 신청 성공"
      ],
      result: "제 강점을 살린 차별화된 베이커리를 오픈했습니다!",
      bgColor: "bg-pink-500"
    },
    {
      id: 3,
      name: "이준호",
      age: 35,
      job: "요식업 10년 경력",
      budget: "8천만원",
      business: "한식당",
      location: "서울 강남구",
      avatar: "👨‍🍳",
      quote: "주방장으로 10년을 일했지만, 내 가게를 차리려니 막막했습니다.",
      story: "경쟁이 치열한 강남에서 살아남으려면 정확한 데이터가 필요했습니다.",
      achievements: [
        "역삼동 직장인 점심 시간대 유동인구 분석",
        "경쟁 음식점 대비 차별화 전략 수립",
        "월 매출 예상치와 손익분기점 명확히 파악",
        "소상공인 정책자금 7천만원 대출 성공"
      ],
      result: "오픈 2개월만에 단골 손님 100명 확보했습니다!",
      bgColor: "bg-orange-500"
    },
    {
      id: 4,
      name: "최민지",
      age: 30,
      job: "프리랜서 디자이너",
      budget: "5천만원",
      business: "네일샵",
      location: "서울 홍대",
      avatar: "👩‍🎨",
      quote: "예쁜 것을 좋아해서 네일샵을 하고 싶었지만, 홍대 임대료가 부담스러웠어요.",
      story: "합리적인 가격에 좋은 입지를 찾을 수 있을지 걱정했습니다.",
      achievements: [
        "홍대 골목 상권 숨은 입지 3곳 발견",
        "1인 운영 가능한 5평 매장 모델 설계",
        "인스타그램 기반 고객 유치 전략",
        "인테리어 비용 40% 절감 방법 습득"
      ],
      result: "예약이 끊이지 않는 인기 네일샵이 되었어요!",
      bgColor: "bg-purple-500"
    },
    {
      id: 5,
      name: "정우진",
      age: 42,
      job: "전 프랜차이즈 가맹점주",
      budget: "1억원",
      business: "편의점",
      location: "서울 마포구",
      avatar: "👨‍💼",
      quote: "프랜차이즈 실패 후 재기를 꿈꿨지만, 다시 시작할 용기가 나지 않았습니다.",
      story: "이번엔 실패하지 않기 위해 철저한 분석이 필요했습니다.",
      achievements: [
        "실패 원인 분석으로 같은 실수 방지",
        "주거지 밀집 지역 야간 수요 파악",
        "재창업 지원금 3천만원 지원받음",
        "무인 시스템 도입으로 인건비 절감"
      ],
      result: "안정적인 수익으로 빚도 갚고 새 출발했습니다!",
      bgColor: "bg-green-500"
    },
    {
      id: 6,
      name: "한소희",
      age: 26,
      job: "바리스타 자격증 보유",
      budget: "3천만원",
      business: "테이크아웃 카페",
      location: "경기 수원시",
      avatar: "👩‍💼",
      quote: "바리스타로 일하며 모은 돈으로 작은 카페를 하고 싶었어요.",
      story: "적은 예산으로 과연 가능할까 고민이 많았습니다.",
      achievements: [
        "3평 테이크아웃 전문 카페 모델 발견",
        "오피스 빌딩 1층 입지 선점",
        "아침 출근길 타겟 메뉴 구성",
        "여성 청년창업 지원금 1천만원 추가 확보"
      ],
      result: "월 순수익 400만원으로 안정적인 자리 잡았어요!",
      bgColor: "bg-cyan-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const features = [
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "창업 통합 정보",
      description: "흩어진 정보를 한 곳에서. 창업 절차, 지원금, 프랜차이즈 정보를 체계적으로 제공합니다.",
      link: "/info",
      color: "bg-blue-500"
    },
    {
      icon: <FaMapMarkedAlt className="text-3xl" />,
      title: "상권 분석",
      description: "정부 공공데이터 기반 유동인구, 매출, 경쟁업체 실시간 분석을 제공합니다.",
      link: "/analysis",
      color: "bg-blue-500"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "AI 컨설팅",
      description: "예산과 상권 데이터 기반으로 맞춤형 창업 전략을 AI가 제안합니다.",
      link: "/consulting",
      color: "bg-blue-500"
    }
  ];

  const steps = [
    { step: 1, title: "정보 수집", desc: "창업 기초 정보 확인" },
    { step: 2, title: "상권 분석", desc: "희망 지역 데이터 분석" },
    { step: 3, title: "예산 계획", desc: "초기 비용 및 운영비 산정" },
    { step: 4, title: "AI 컨설팅", desc: "맞춤형 전략 수립" },
    { step: 5, title: "실행", desc: "창업 실행 및 지원금 신청" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Toss Style */}
      <section className="relative overflow-hidden bg-white py-20 md:py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 bg-blue-50 rounded-full"
          >
            <span className="text-primary-500 text-sm font-semibold">🚀 데이터 기반 창업 컨설팅</span>
          </motion.div>
          
          <h1 className="heading-toss text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-gray-900">
            당신의 창업,<br />
            <span className="text-primary-500">체계적으로</span> 시작하세요
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto font-medium">
            정부 공공데이터와 AI로 분석하는<br className="hidden md:block" />
            성공 확률 높은 창업 전략
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/analysis">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-toss px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-600 w-full sm:w-auto"
              >
                상권 분석 시작하기
              </motion.button>
            </Link>
            <Link href="/info">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-toss px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 w-full sm:w-auto"
              >
                창업 정보 보기
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 translate-y-48 -translate-x-48"></div>
      </section>

      {/* Features Section - Toss Style */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-toss text-4xl md:text-5xl font-black text-gray-900 mb-4">
              3가지 핵심 기능
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              창업 성공을 위한 모든 것
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <div className="card-hover bg-white rounded-2xl p-8 h-full cursor-pointer border border-gray-100 hover:border-primary-500 hover:shadow-lg">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.color} text-white mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Toss Style */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-toss text-4xl md:text-5xl font-black text-gray-900 mb-4">
              창업 프로세스
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              5단계로 체계적으로 준비
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            
            <div className="grid md:grid-cols-5 gap-8 relative z-10">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-primary-500 text-white w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-3xl font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Carousel - Toss Style */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-toss text-4xl md:text-5xl font-black text-gray-900 mb-4">
              성공 창업 사례
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              실제 창업자들의 생생한 이야기
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center">
                    <div className={`w-20 h-20 ${testimonials[currentTestimonial].bgColor} rounded-2xl flex items-center justify-center text-4xl mr-4 shadow-sm`}>
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {testimonials[currentTestimonial].name}님의 이야기
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {testimonials[currentTestimonial].age}세, {testimonials[currentTestimonial].job}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-50 text-primary-500 text-sm font-semibold rounded-full">
                          {testimonials[currentTestimonial].business}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                          {testimonials[currentTestimonial].location}
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full">
                          {testimonials[currentTestimonial].budget}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg font-medium text-gray-900">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <p className="text-gray-600 font-medium">
                    {testimonials[currentTestimonial].story}
                  </p>

                  {/* Achievements */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <FaCheckCircle className="mr-2 text-primary-500" />
                      이 플랫폼으로 해결한 것들
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {testimonials[currentTestimonial].achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-500 mr-2 font-bold">✓</span>
                          <span className="font-medium text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Result */}
                  <div className="bg-gradient-to-r from-primary-500 to-blue-600 p-6 rounded-xl">
                    <p className="text-lg font-bold text-white">
                      "{testimonials[currentTestimonial].result}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 flex items-center justify-center transition-all hover:shadow-md"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>

              {/* Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonial
                        ? "w-8 bg-primary-500"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 flex items-center justify-center transition-all hover:shadow-md"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 font-medium">
                {currentTestimonial + 1} / {testimonials.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Toss Style */}
      <section className="py-24 px-4 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="heading-toss text-4xl md:text-6xl font-black mb-6 text-white">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-10 text-gray-300 font-medium">
            무료로 상권을 분석하고 AI 컨설팅을 받아보세요
          </p>
          <Link href="/analysis">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-toss px-12 py-5 bg-primary-500 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-primary-600"
            >
              무료로 시작하기
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

