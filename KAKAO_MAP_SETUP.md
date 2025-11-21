# 카카오 지도 API 설정 가이드

## 필요한 키

웹 애플리케이션에서 카카오 지도를 사용하려면 **JavaScript 키**가 필요합니다.

## 환경 변수 설정

### 1. `.env.local` 파일에 추가

프로젝트 루트 디렉토리의 `.env.local` 파일에 다음을 추가하세요:

```env
# 카카오 지도 JavaScript 키
NEXT_PUBLIC_KAKAO_MAP_JS_KEY=your_javascript_key_here
```

### 2. 키 확인 방법

1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
2. 내 애플리케이션 선택
3. 앱 키 > JavaScript 키 확인
4. JavaScript 키를 복사하여 `.env.local`에 추가

### 3. 플랫폼 설정 확인

카카오 개발자 콘솔에서:
1. 내 애플리케이션 > 앱 설정 > 플랫폼
2. Web 플랫폼 등록 확인
3. 사이트 도메인 등록:
   - 개발: `http://localhost:3000`
   - 프로덕션: 실제 도메인 (예: `https://yourdomain.com`)

## 사용 방법

카카오 지도는 `MapView` 컴포넌트에서 자동으로 로드됩니다.

### 컴포넌트 사용 예시

```tsx
<MapView 
  location={{ lat: 37.5665, lng: 126.9780 }} 
  address="서울특별시 중구 세종대로 110" 
/>
```

## 주의사항

1. **JavaScript 키만 사용**: REST API 키나 어드민 키는 사용하지 않습니다.
2. **NEXT_PUBLIC_ 접두사 필수**: 클라이언트 사이드에서 사용하려면 `NEXT_PUBLIC_` 접두사가 필요합니다.
3. **도메인 등록 필수**: 카카오 개발자 콘솔에서 사용할 도메인을 등록해야 합니다.
4. **보안**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 문제 해결

### 지도가 표시되지 않는 경우

1. 브라우저 콘솔에서 에러 확인
2. 카카오 개발자 콘솔에서 도메인 등록 확인
3. JavaScript 키가 올바른지 확인
4. 환경 변수 재시작: 개발 서버를 재시작하세요 (`npm run dev`)

### CORS 에러가 발생하는 경우

카카오 개발자 콘솔에서 Web 플랫폼의 사이트 도메인이 올바르게 등록되어 있는지 확인하세요.

