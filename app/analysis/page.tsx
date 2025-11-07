"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaStore, FaUsers, FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import MapView from "@/components/MapView";
import AnalysisResult from "@/components/AnalysisResult";

export default function AnalysisPage() {
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const industries = [
    "커피전문점/카페",
    "한식",
    "중식",
    "일식",
    "양식",
    "치킨",
    "분식",
    "패스트푸드",
    "편의점",
    "의류",
    "화장품",
    "미용실",
    "네일샵",
    "학원",
    "헬스장",
    "기타"
  ];

  const handleAnalysis = async () => {
    if (!address || !industry) {
      alert("지역과 업종을 모두 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);

    try {
      // API 호출
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, industry }),
      });

      const data = await response.json();
      setAnalysisData(data);
      
      // 지도 위치 설정
      if (data.coordinates) {
        setSelectedLocation(data.coordinates);
      }
    } catch (error) {
      console.error("분석 중 오류 발생:", error);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const quickSearches = [
    { area: "서울 송파구 잠실동", industry: "커피전문점/카페" },
    { area: "서울 강남구 역삼동", industry: "한식" },
    { area: "서울 마포구 홍대입구역", industry: "치킨" },
    { area: "서울 서초구 강남역", industry: "편의점" },
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
            상권 분석
          </h1>
          <p className="text-xl text-gray-600">
            정부 공공데이터 기반 실시간 상권 분석 서비스
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 지역 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                분석 지역
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 서울 송파구 잠실동"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 도로명 주소, 지번 주소, 역명 모두 가능합니다
              </p>
            </div>

            {/* 업종 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaStore className="inline mr-2 text-indigo-500" />
                분석 업종
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">업종을 선택하세요</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                💡 구체적인 업종을 선택할수록 정확한 분석이 가능합니다
              </p>
            </div>
          </div>

          {/* 분석 버튼 */}
          <button
            onClick={handleAnalysis}
            disabled={isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isAnalyzing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                분석 중...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaSearch className="mr-2" />
                상권 분석 시작하기
              </span>
            )}
          </button>

          {/* 빠른 검색 */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">🔥 인기 검색</p>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAddress(search.area);
                    setIndustry(search.industry);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-full text-sm font-medium transition-colors"
                >
                  {search.area} · {search.industry}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 안내 섹션 */}
        {!analysisData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                icon: <FaUsers className="text-4xl text-blue-500" />,
                title: "유동인구",
                desc: "시간대별, 연령별, 성별 유동인구 데이터"
              },
              {
                icon: <FaStore className="text-4xl text-green-500" />,
                title: "경쟁 현황",
                desc: "동일 업종 점포 수 및 밀집도 분석"
              },
              {
                icon: <FaMoneyBillWave className="text-4xl text-yellow-500" />,
                title: "매출 정보",
                desc: "업종별 평균 매출 및 추이"
              },
              {
                icon: <FaChartLine className="text-4xl text-purple-500" />,
                title: "성장성",
                desc: "상권 성장률 및 미래 전망"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 지도 및 분석 결과 */}
        {analysisData && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 지도 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <MapView location={selectedLocation} address={address} />
            </motion.div>

            {/* 분석 결과 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AnalysisResult data={analysisData} industry={industry} />
            </motion.div>
          </div>
        )}

        {/* 데이터 출처 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>📊 데이터 출처: 소상공인시장진흥공단, 서울시 열린데이터광장</p>
          <p className="mt-1">본 데이터는 참고용이며, 실제 창업 시 현장 조사를 병행하시기 바랍니다.</p>
        </motion.div>
      </div>
    </div>
  );
}

