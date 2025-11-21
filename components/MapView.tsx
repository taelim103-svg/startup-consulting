"use client";

import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface MapViewProps {
  location: { lat: number; lng: number } | null;
  address: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapView({ location, address }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);

  // 카카오 지도 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setMapLoaded(true);
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !location) return;

    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    // 기존 지도 인스턴스가 있으면 제거
    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }

    // 지도 생성
    const mapOption = {
      center: new kakao.maps.LatLng(location.lat, location.lng),
      level: 3, // 지도 확대 레벨 (1-14, 숫자가 작을수록 확대)
    };

    const map = new kakao.maps.Map(mapRef.current, mapOption);
    mapInstanceRef.current = map;

    // 마커 생성
    const markerPosition = new kakao.maps.LatLng(location.lat, location.lng);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커를 지도에 표시
    marker.setMap(map);

    // 인포윈도우 생성 (선택사항)
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${address}</div>`,
    });
    infowindow.open(map, marker);

    // 마커 클릭 시 인포윈도우 토글
    kakao.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });

    console.log("카카오 지도 초기화 완료:", location);
  }, [mapLoaded, location, address]);

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

