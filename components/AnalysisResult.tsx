"use client";

import { motion } from "framer-motion";
import { FaUsers, FaStore, FaMoneyBillWave, FaChartLine, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface AnalysisResultProps {
  data: any;
  industry: string;
}

export default function AnalysisResult({ data, industry }: AnalysisResultProps) {
  // 종합 점수 계산
  const calculateScore = () => {
    const scores = {
      traffic: data.traffic?.score || 0,
      competition: data.competition?.score || 0,
      sales: data.sales?.score || 0,
      growth: data.growth?.score || 0,
    };
    return Math.round((scores.traffic + scores.competition + scores.sales + scores.growth) / 4);
  };

  const totalScore = calculateScore();

  // 점수에 따른 등급
  const getGrade = (score: number) => {
    if (score >= 80) return { grade: "A", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 60) return { grade: "B", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 40) return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { grade: "D", color: "text-red-600", bg: "bg-red-100" };
  };

  const gradeInfo = getGrade(totalScore);

  // 유동인구 차트 데이터
  const trafficChartData = {
    labels: ['10대', '20대', '30대', '40대', '50대', '60대+'],
    datasets: [
      {
        label: '남성',
        data: data.traffic?.ageGender?.male || [15, 25, 20, 18, 12, 10],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: '여성',
        data: data.traffic?.ageGender?.female || [12, 28, 22, 20, 10, 8],
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
      },
    ],
  };

  // 시간대별 유동인구
  const timeTrafficData = {
    labels: ['06-09', '09-12', '12-15', '15-18', '18-21', '21-24'],
    datasets: [
      {
        label: '유동인구',
        data: data.traffic?.timeSlot || [30, 50, 80, 70, 90, 60],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // 경쟁 현황 차트
  const competitionData = {
    labels: ['해당 업종', '유사 업종', '기타'],
    datasets: [
      {
        data: data.competition?.distribution || [35, 45, 20],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 종합 점수 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">상권 종합 평가</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-2">창업 적합도</p>
            <div className="flex items-baseline">
              <span className="text-6xl font-bold">{totalScore}</span>
              <span className="text-2xl ml-2">/ 100</span>
            </div>
          </div>
          <div className={`${gradeInfo.bg} ${gradeInfo.color} w-24 h-24 rounded-full flex items-center justify-center`}>
            <span className="text-5xl font-bold">{gradeInfo.grade}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90">
            {totalScore >= 80 && "✨ 매우 우수한 상권입니다. 적극 추천합니다!"}
            {totalScore >= 60 && totalScore < 80 && "👍 양호한 상권입니다. 충분히 고려할 만합니다."}
            {totalScore >= 40 && totalScore < 60 && "⚠️ 보통 수준의 상권입니다. 신중한 검토가 필요합니다."}
            {totalScore < 40 && "❌ 창업에 어려움이 예상됩니다. 다른 지역을 고려해보세요."}
          </p>
        </div>
      </motion.div>

      {/* 세부 분석 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaUsers className="text-blue-500 mr-2" />
          유동인구 분석
        </h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">일평균 유동인구</span>
            <span className="text-2xl font-bold text-indigo-600">
              {data.traffic?.daily?.toLocaleString() || "12,450"}명
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
              style={{ width: `${(data.traffic?.score || 75)}%` }}
            ></div>
          </div>
        </div>

        {/* 연령대별 차트 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">연령대별 성별 분포</p>
          <Bar
            data={trafficChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        {/* 시간대별 차트 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">시간대별 유동인구</p>
          <Line
            data={timeTrafficData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* 경쟁 현황 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaStore className="text-green-500 mr-2" />
          경쟁 현황
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">동일 업종 점포 수</span>
                <span className="text-2xl font-bold text-green-600">
                  {data.competition?.sameIndustry || 23}개
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">반경 500m 내</span>
                <span className="text-lg font-semibold text-gray-800">
                  {data.competition?.nearby || 8}개
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
              <p className="text-sm text-yellow-800">
                {data.competition?.nearby > 10
                  ? "⚠️ 경쟁이 매우 치열합니다"
                  : data.competition?.nearby > 5
                  ? "⚡ 적정 수준의 경쟁입니다"
                  : "✅ 경쟁이 적은 편입니다"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">업종 분포</p>
            <Doughnut
              data={competitionData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* 매출 정보 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaMoneyBillWave className="text-yellow-500 mr-2" />
          매출 정보
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">월평균 매출</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.sales?.monthly?.toLocaleString() || "3,200"}만원
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">분기 성장률</p>
            <p className="text-2xl font-bold text-green-600">
              +{data.sales?.growth || "12.5"}%
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">업종별 비교</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">상위 25%</span>
              <span className="text-sm font-semibold">4,500만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">평균</span>
              <span className="text-sm font-semibold">3,200만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">하위 25%</span>
              <span className="text-sm font-semibold">2,100만원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 종합 의견 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaChartLine className="text-purple-500 mr-2" />
          종합 의견
        </h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">강점</p>
              <p className="text-sm text-gray-600">
                유동인구가 풍부하고 주 고객층이 명확합니다. 대중교통 접근성이 우수합니다.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">약점</p>
              <p className="text-sm text-gray-600">
                경쟁 업체가 다소 많은 편입니다. 차별화된 전략이 필요합니다.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <FaChartLine className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">추천 사항</p>
              <p className="text-sm text-gray-600">
                점심 시간대(12-15시)와 저녁 시간대(18-21시)를 타겟으로 한 메뉴 구성을 추천합니다.
                SNS 마케팅을 통한 20-30대 고객 유치가 효과적일 것으로 예상됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center">
        <p className="text-lg font-semibold mb-3">
          더 자세한 컨설팅이 필요하신가요?
        </p>
        <a
          href="/consulting"
          className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          AI 컨설팅 받기 →
        </a>
      </div>
    </div>
  );
}

