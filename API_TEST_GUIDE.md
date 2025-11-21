# 🔌 소상공인 API 테스트 가이드

## ✅ 완료된 작업

1. ✅ API 호출 함수 작성 (`app/api/sbiz/apis.ts`)
2. ✅ 클라이언트 함수 작성 (`app/api/sbiz/client.ts`)
3. ✅ 테스트 API 라우트 생성 (`app/api/test-sbiz/route.ts`)
4. ✅ 실제 analysis API에 연동 (`app/api/analysis/route.ts`)

---

## 🧪 테스트 방법

### 1. 환경 변수 확인

`.env.local` 파일에 다음이 있는지 확인:

```env
SBIZ_STOR_STATUS_KEY=b5064a94fed20aee6e432aaf30789d198575103a55567c18d9b75e96acb4c51f
SBIZ_SALES_TREND_KEY=dedc266f64c449a7e4fee8b001e7b2f8afae9732be34bd728729fa4485efae0a
SBIZ_DELIVERY_KEY=df61e00ef720a70062c16e934b878648d09bc8f54d1436f2ab0a4d462741dbee
SBIZ_HOTPLACE_KEY=7ce110c780c37652a0e7d64fefe926dc155eca0cb31398d746c1bfe91bac2e96
SBIZ_SIMPLE_KEY=959fa1030890232e87710a2f808d11a11ee0c6447a3906e039aa795ce0ae4050
```

### 2. 서버 실행

```bash
npm run dev
```

### 3. 테스트 API 호출

브라우저나 터미널에서:

```bash
# 모든 API 테스트
curl "http://localhost:3000/api/test-sbiz?api=all"

# 개별 API 테스트
curl "http://localhost:3000/api/test-sbiz?api=simple"
curl "http://localhost:3000/api/test-sbiz?api=store"
curl "http://localhost:3000/api/test-sbiz?api=sales"
curl "http://localhost:3000/api/test-sbiz?api=delivery"
curl "http://localhost:3000/api/test-sbiz?api=hotplace"
```

또는 브라우저에서:
- http://localhost:3000/api/test-sbiz?api=all

---

## 🔍 실제 API 엔드포인트 확인

현재 코드는 다음 엔드포인트를 사용합니다:
- `https://bigdata.sbiz.or.kr/api/storSttus`
- `https://bigdata.sbiz.or.kr/api/slsIdex`
- `https://bigdata.sbiz.or.kr/api/delivery`
- `https://bigdata.sbiz.or.kr/api/hpReport`
- `https://bigdata.sbiz.or.kr/api/simple`

**만약 엔드포인트가 다르다면** `app/api/sbiz/client.ts`의 `baseUrl`을 수정하세요.

---

## 📊 응답 구조 확인

테스트 API를 호출하면 실제 응답 구조를 확인할 수 있습니다.

예상 응답 형태:
```json
{
  "success": true,
  "results": {
    "storeStatus": { ... },
    "salesTrend": { ... },
    "delivery": { ... },
    "hotPlace": { ... },
    "simple": { ... }
  }
}
```

**에러가 발생하면**:
- `error` 필드에 오류 메시지
- `status` 필드에 HTTP 상태 코드

---

## 🛠️ 문제 해결

### 1. 404 에러
→ API 엔드포인트가 잘못되었을 수 있습니다.
→ `app/api/sbiz/client.ts`의 `baseUrl` 확인

### 2. 401/403 에러
→ API 키가 잘못되었거나 만료되었을 수 있습니다.
→ `.env.local`의 키 확인

### 3. CORS 에러
→ 서버 사이드에서 호출하므로 문제 없어야 합니다.

### 4. 응답 구조가 다름
→ `app/api/analysis/route.ts`의 `convertSbizDataToAnalysis` 함수 수정

---

## 📝 다음 단계

1. ✅ 테스트 API로 실제 응답 확인
2. ✅ 응답 구조에 맞게 파싱 함수 수정
3. ✅ 실제 데이터를 UI에 표시
4. ✅ 에러 처리 개선

---

## 🎯 실제 사용

상권 분석 페이지에서:
1. 지역과 업종 입력
2. "상권 분석 시작하기" 클릭
3. 실제 API 데이터가 있으면 사용, 없으면 데모 데이터 사용

응답에 `dataSource: "real"` 또는 `"demo"` 필드로 구분됩니다.

