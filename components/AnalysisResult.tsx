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
  // 종합 점수: 창업기상도 API의 detailList[0].avgScore를 직접 사용
  // growth.score에 detailList[0].avgScore가 저장되어 있음
  const totalScore = data.growth?.score || 0;

  // 점수에 따른 등급 및 설명 (창업기상도 기준)
  const getGrade = (score: number) => {
    if (score >= 81) {
      return { 
        grade: "A", 
        color: "text-blue-600", 
        bg: "bg-blue-100",
        label: "양호",
        description: "지역/업종의 성장률, 이용비중, 운영기간 등이 최상위 수준으로 창업 유망"
      };
    }
    if (score >= 61) {
      return { 
        grade: "B", 
        color: "text-green-600", 
        bg: "bg-green-100",
        label: "보통",
        description: "지역/업종의 성장률, 이용비중, 운영기간 등이 상위 수준으로 창업 고려가능"
      };
    }
    if (score >= 41) {
      return { 
        grade: "C", 
        color: "text-yellow-600", 
        bg: "bg-yellow-100",
        label: "조금나쁨",
        description: "지역/업종의 성장률, 이용비중, 운영기간 등이 중위 수준으로 창업 주의"
      };
    }
    if (score >= 21) {
      return { 
        grade: "D", 
        color: "text-red-600", 
        bg: "bg-red-100",
        label: "나쁨",
        description: "지역/업종의 성장률, 이용비중, 운영기간 등이 하위 수준으로 창업 위험"
      };
    }
    return { 
      grade: "E", 
      color: "text-purple-600", 
      bg: "bg-purple-100",
      label: "매우나쁨",
      description: "지역/업종의 성장률, 이용비중, 운영기간 등이 최하위 수준으로 창업 고위험"
    };
  };

  const gradeInfo = getGrade(totalScore);

  // 주중/주말 차트 데이터
  const weekdayWeekendData = {
    labels: ['주중', '주말'],
    datasets: [
      {
        data: [
          data.traffic?.weekday || 79.3,
          data.traffic?.weekend || 20.7,
        ],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)', // 주중: 핑크/레드
          'rgba(59, 130, 246, 0.8)', // 주말: 블루
        ],
      },
    ],
  };

  // 요일별 데이터
  const weekdayData = data.traffic?.weekdayData || {};
  const weekdayListData = {
    labels: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
    datasets: [
      {
        label: '요일별 유동인구 비율',
        data: [
          weekdayData.mon || 15.9,
          weekdayData.tues || 16.4,
          weekdayData.wed || 16.2,
          weekdayData.thur || 16.3,
          weekdayData.fri || 14.5,
          weekdayData.sat || 11.1,
          weekdayData.sun || 9.5,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
      },
    ],
  };

  // 시간대별 유동인구
  const timeTrafficData = {
    labels: ['05~09', '09~12', '12~14', '14~18', '18~23', '23~05'],
    datasets: [
      {
        label: '유동인구 비율 (%)',
        data: data.traffic?.timeSlot || [15.7, 18.4, 11.6, 23.7, 23.1, 7.4],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
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
          <div className="flex items-start gap-3">
            <span className="text-2xl">{totalScore >= 81 ? "😊" : totalScore >= 61 ? "🙂" : totalScore >= 41 ? "😐" : totalScore >= 21 ? "😟" : "😰"}</span>
            <div>
              <p className="text-sm font-semibold opacity-95 mb-1">{gradeInfo.label}</p>
              <p className="text-sm opacity-90">{gradeInfo.description}</p>
            </div>
          </div>
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

        {/* 주중/주말 및 요일별 차트 */}
        <div className="mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 주중/주말 차트 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">주중/주말 분포</p>
              <Bar
                data={weekdayWeekendData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => `${context.parsed.y.toFixed(1)}%`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value: any) => `${value}%`,
                      },
                    },
                  },
                }}
              />
            </div>

            {/* 요일별 리스트 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">요일별 분포</p>
              <div className="space-y-2">
                {weekdayListData.labels.map((day, index) => {
                  const value = weekdayListData.datasets[0].data[index];
                  const isMax = value === Math.max(...weekdayListData.datasets[0].data);
                  return (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{day}</span>
                      <span className={`text-sm font-semibold ${isMax ? 'text-red-600' : 'text-gray-800'}`}>
                        {value.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 시간대별 차트 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">시간대별 유동인구</p>
          <Bar
            data={{
              ...timeTrafficData,
              datasets: [
                {
                  ...timeTrafficData.datasets[0],
                  backgroundColor: 'rgba(99, 102, 241, 0.8)', // 더 진한 색상
                  borderColor: 'rgb(99, 102, 241)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context: any) => `${context.parsed.y.toFixed(1)}%`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 70, // 최대값을 70%로 설정
                  ticks: {
                    callback: (value: any) => `${value}%`,
                  },
                },
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
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-lg">동일 업종 점포 수</span>
          <span className="text-3xl font-bold text-green-600">
            {data.competition?.sameIndustry || 23}개
          </span>
        </div>
      </div>

      {/* 매출 정보 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaMoneyBillWave className="text-yellow-500 mr-2" />
          매출 정보
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">월평균 매출</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.sales?.monthly?.toLocaleString() || "3,200"}만원
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">전월 대비</p>
            <p className={`text-2xl font-bold ${(data.sales?.prevMonRate || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(data.sales?.prevMonRate || 0) >= 0 ? '+' : ''}{data.sales?.prevMonRate?.toFixed(1) || "0.0"}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">전년 동월 대비</p>
            <p className={`text-2xl font-bold ${(data.sales?.prevYearRate || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(data.sales?.prevYearRate || 0) >= 0 ? '+' : ''}{data.sales?.prevYearRate?.toFixed(1) || "0.0"}%
            </p>
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

