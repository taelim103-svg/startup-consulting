"use client";

import { useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface MapViewProps {
  location: { lat: number; lng: number } | null;
  address: string;
}

export default function MapView({ location, address }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 실제 프로덕션에서는 Naver Map API 또는 Kakao Map API를 사용
    // 여기서는 데모용 정적 지도 표시
    if (mapRef.current && location) {
      // 지도 초기화 로직
      console.log("지도 초기화:", location);
    }
  }, [location]);

  return (
    <div className="h-full min-h-[500px] relative">
      {/* 헤더 */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 z-10">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-2xl mr-3" />
          <div>
            <p className="text-sm opacity-90">분석 지역</p>
            <p className="font-bold text-lg">{address || "지역을 선택해주세요"}</p>
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div ref={mapRef} className="w-full h-full bg-gray-100">
        {location ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center p-8">
              <FaMapMarkerAlt className="text-6xl text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold mb-2">지도 표시 영역</p>
              <p className="text-sm text-gray-600">
                실제 서비스에서는 Kakao Map 또는 Naver Map이 표시됩니다
              </p>
              <div className="mt-4 bg-white rounded-lg p-4 shadow-md inline-block">
                <p className="text-xs text-gray-500 mb-1">좌표</p>
                <p className="text-sm font-mono text-gray-700">
                  위도: {location.lat.toFixed(6)}<br />
                  경도: {location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FaMapMarkerAlt className="text-6xl mx-auto mb-4 opacity-30" />
              <p>지역을 검색하면 지도가 표시됩니다</p>
            </div>
          </div>
        )}
      </div>

      {/* 지도 컨트롤 (데모) */}
      {location && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
          <button className="w-10 h-10 bg-white hover:bg-gray-100 rounded flex items-center justify-center border border-gray-300">
            <span className="text-xl">+</span>
          </button>
          <button className="w-10 h-10 bg-white hover:bg-gray-100 rounded flex items-center justify-center border border-gray-300">
            <span className="text-xl">−</span>
          </button>
        </div>
      )}
    </div>
  );
}

