"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaMoneyBillWave, FaMapMarkerAlt, FaStore, FaLightbulb, FaPaperPlane } from "react-icons/fa";

interface ConsultingForm {
  budget: string;
  location: string;
  industry: string;
  experience: string;
  goals: string;
}

export default function ConsultingPage() {
  const [formData, setFormData] = useState<ConsultingForm>({
    budget: "",
    location: "",
    industry: "",
    experience: "",
    goals: "",
  });
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultingResult, setConsultingResult] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [userMessage, setUserMessage] = useState("");

  const budgetRanges = [
    "3천만원 이하",
    "3천만원 ~ 5천만원",
    "5천만원 ~ 7천만원",
    "7천만원 ~ 1억원",
    "1억원 ~ 2억원",
    "2억원 이상",
  ];

  const experiences = [
    "창업 경험 없음",
    "1년 미만",
    "1~3년",
    "3~5년",
    "5년 이상",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.budget || !formData.location || !formData.industry) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsConsulting(true);

    try {
      const response = await fetch("/api/consulting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setConsultingResult(data);

      // 초기 AI 메시지 추가
      setChatMessages([
        {
          role: "assistant",
          content: `안녕하세요! ${formData.budget} 예산으로 ${formData.location}에서 ${formData.industry} 창업을 계획하시는군요. 맞춤형 컨설팅을 시작하겠습니다.`,
        },
      ]);
    } catch (error) {
      console.error("컨설팅 오류:", error);
      alert("컨설팅 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsConsulting(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    const newMessage = { role: "user", content: userMessage };
    setChatMessages([...chatMessages, newMessage]);
    setUserMessage("");

    try {
      const response = await fetch("/api/consulting/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatMessages, newMessage],
          context: { ...formData, consultingResult },
        }),
      });

      const data = await response.json();
      setChatMessages([...chatMessages, newMessage, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("채팅 오류:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FaRobot className="text-6xl text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            AI 창업 컨설팅
          </h1>
          <p className="text-xl text-gray-600">
            예산과 상권 데이터 기반 맞춤형 창업 전략을 제안합니다
          </p>
        </motion.div>

        {!consultingResult ? (
          // 컨설팅 신청 폼
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* 예산 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-green-500" />
                  창업 예산 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">예산을 선택하세요</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* 희망 지역 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                  희망 창업 지역 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="예: 서울 송파구"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* 희망 업종 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaStore className="inline mr-2 text-indigo-500" />
                  희망 업종 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="예: 카페, 음식점, 편의점 등"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* 창업 경험 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaLightbulb className="inline mr-2 text-yellow-500" />
                  창업 경험
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="">선택하세요 (선택사항)</option>
                  {experiences.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              {/* 창업 목표 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  창업 목표 및 고민사항
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="예: 퇴사 후 안정적인 수입을 원합니다. 카페를 운영하고 싶지만 경험이 없어 걱정됩니다."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isConsulting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isConsulting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isConsulting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    AI 분석 중...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaRobot className="mr-2" />
                    AI 컨설팅 받기
                  </span>
                )}
              </button>
            </form>

            {/* 안내 사항 */}
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">💡 AI 컨설팅 안내</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• 입력하신 정보를 바탕으로 맞춤형 창업 전략을 제안합니다</li>
                <li>• 예산에 맞는 현실적인 아이템과 초기 비용을 안내합니다</li>
                <li>• 희망 지역의 상권 데이터를 분석하여 성공 가능성을 평가합니다</li>
                <li>• AI와 대화하며 추가 질문을 할 수 있습니다</li>
              </ul>
            </div>
          </motion.div>
        ) : (
          // 컨설팅 결과 및 채팅
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 컨설팅 결과 */}
            <div className="lg:col-span-1 space-y-6">
              <ConsultingResult data={consultingResult} formData={formData} />
            </div>

            {/* AI 채팅 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl h-[700px] flex flex-col">
                {/* 채팅 헤더 */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center">
                    <FaRobot className="text-3xl mr-3" />
                    <div>
                      <h3 className="text-xl font-bold">AI 컨설턴트</h3>
                      <p className="text-sm opacity-90">궁금한 점을 자유롭게 물어보세요</p>
                    </div>
                  </div>
                </div>

                {/* 채팅 메시지 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 채팅 입력 */}
                <form onSubmit={handleChatSubmit} className="p-6 border-t">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="질문을 입력하세요..."
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 예: "초기 비용을 더 줄일 수 있는 방법이 있나요?", "이 지역에서 성공한 카페의 특징은?"
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 컨설팅 결과 컴포넌트
function ConsultingResult({ data, formData }: { data: any; formData: ConsultingForm }) {
  return (
    <div className="space-y-6">
      {/* 종합 평가 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-3">창업 적합도</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-5xl font-bold">{data.feasibilityScore}</span>
          <span className="text-xl ml-2">/ 100</span>
        </div>
        <p className="text-sm opacity-90">{data.feasibilityComment}</p>
      </motion.div>

      {/* 추천 아이템 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 추천 아이템</h3>
        <div className="space-y-3">
          {data.recommendedItems?.map((item: any, index: number) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.reason}</p>
              <p className="text-xs text-indigo-600 mt-1">예상 초기 비용: {item.cost}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 예산 분석 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💰 예산 분석</h3>
        <div className="space-y-2">
          {data.budgetBreakdown?.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-700">{item.category}</span>
              <span className="font-semibold text-gray-800">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 지원금 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🎁 받을 수 있는 지원금</h3>
        <div className="space-y-3">
          {data.availableSupports?.map((support: any, index: number) => (
            <div key={index} className="bg-green-50 rounded-lg p-3">
              <p className="font-semibold text-green-800">{support.name}</p>
              <p className="text-sm text-green-700">최대 {support.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 다시 시작 */}
      <button
        onClick={() => window.location.reload()}
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
      >
        새로운 컨설팅 받기
      </button>
    </div>
  );
}

