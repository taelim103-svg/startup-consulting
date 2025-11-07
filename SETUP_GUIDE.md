# 🚀 창업 컨설팅 플랫폼 - 설치 및 실행 가이드

## 📋 목차
1. [사전 요구사항](#사전-요구사항)
2. [설치 방법](#설치-방법)
3. [API 키 발급](#api-키-발급)
4. [실행 방법](#실행-방법)
5. [문제 해결](#문제-해결)

---

## 사전 요구사항

### 필수 설치 항목
- **Node.js**: v18.0.0 이상 ([다운로드](https://nodejs.org/))
- **npm** 또는 **yarn**: Node.js 설치 시 자동 설치됨

### 확인 방법
터미널에서 다음 명령어를 실행하여 버전을 확인하세요:

```bash
node --version  # v18.0.0 이상이어야 함
npm --version   # v9.0.0 이상 권장
```

---

## 설치 방법

### 1단계: 프로젝트 디렉토리로 이동
```bash
cd /Users/isc010250/Desktop/consulting
```

### 2단계: 의존성 패키지 설치
```bash
npm install
```

설치되는 주요 패키지:
- `next`: Next.js 프레임워크
- `react`, `react-dom`: React 라이브러리
- `typescript`: TypeScript
- `tailwindcss`: CSS 프레임워크
- `framer-motion`: 애니메이션
- `chart.js`: 차트 라이브러리
- `openai`: OpenAI API 클라이언트
- `axios`: HTTP 클라이언트

**예상 소요 시간**: 2-3분

---

## API 키 발급

### OpenAI API (AI 컨설팅용) 🤖

#### 1. OpenAI 계정 생성
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. "Sign up" 클릭하여 계정 생성
3. 이메일 인증 완료

#### 2. API 키 발급
1. 로그인 후 [API Keys](https://platform.openai.com/api-keys) 페이지 이동
2. "Create new secret key" 클릭
3. 키 이름 입력 (예: "창업컨설팅")
4. 생성된 키 복사 (⚠️ 한 번만 표시되므로 반드시 저장!)

#### 3. 비용 안내
- 무료 크레딧: 신규 가입 시 $5 제공
- GPT-4 사용 시: 약 $0.03/1000 토큰
- 예상 비용: 컨설팅 1회당 약 $0.10-0.30

---

### 소상공인 API (상권 분석용) 📊

#### 1. 공공데이터포털 회원가입
1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 (개인 또는 사업자)
3. 이메일 인증 완료

#### 2. API 신청
1. 로그인 후 검색창에 "소상공인시장진흥공단" 검색
2. 다음 API들을 신청:
   - **상가(상권)정보**: 상권 기본 정보
   - **소상공인시장진흥공단_상가업소정보**: 업소 정보
   - **소상공인시장진흥공단_상권정보**: 상권 통계

3. 각 API 상세 페이지에서 "활용신청" 클릭
4. 활용 목적 작성 (예: "창업 컨설팅 서비스 개발")
5. 신청 완료

#### 3. 인증키 확인
- 승인까지 1-2일 소요 (영업일 기준)
- 승인 후 [마이페이지 > 인증키 발급현황](https://www.data.go.kr/mypage/authKeyList.do)에서 확인
- 일반 인증키(Encoding) 복사

---

### Naver Map API (선택사항) 🗺️

#### 1. Naver Developers 등록
1. [Naver Developers](https://developers.naver.com/) 접속
2. 네이버 계정으로 로그인
3. "Application > 애플리케이션 등록" 클릭

#### 2. 애플리케이션 등록
1. 애플리케이션 이름: "창업컨설팅"
2. 사용 API: "Maps" 선택
3. 환경 추가:
   - Web 서비스 URL: `http://localhost:3000`
   - Web 서비스 URL: `http://localhost:3001` (추가)

#### 3. Client ID 확인
- 등록 완료 후 Client ID 복사
- Client Secret은 불필요 (프론트엔드에서만 사용)

---

## 환경 변수 설정

### 1. 환경 변수 파일 생성
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
touch .env.local
```

### 2. API 키 입력
`.env.local` 파일을 열고 다음 내용을 입력하세요:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 소상공인 API Key
SBIZ_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_SBIZ_API_KEY=your_actual_api_key_here

# Naver Map API (선택사항)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_client_id

# Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. 주의사항
- ⚠️ `.env.local` 파일은 절대 Git에 커밋하지 마세요!
- ⚠️ API 키는 외부에 노출되지 않도록 주의하세요!
- ✅ `.gitignore`에 `.env*.local`이 포함되어 있는지 확인하세요

---

## 실행 방법

### 개발 모드 실행
```bash
npm run dev
```

실행 후 브라우저에서 접속:
- 메인 페이지: [http://localhost:3000](http://localhost:3000)
- 창업 정보: [http://localhost:3000/info](http://localhost:3000/info)
- 상권 분석: [http://localhost:3000/analysis](http://localhost:3000/analysis)
- AI 컨설팅: [http://localhost:3000/consulting](http://localhost:3000/consulting)

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 다른 포트로 실행
```bash
PORT=3001 npm run dev
```

---

## 기능 테스트

### 1. 창업 정보 페이지 테스트
1. [http://localhost:3000/info](http://localhost:3000/info) 접속
2. 각 탭 클릭하여 정보 확인
3. 모든 정보가 정상적으로 표시되는지 확인

### 2. 상권 분석 테스트
1. [http://localhost:3000/analysis](http://localhost:3000/analysis) 접속
2. 지역 입력: "서울 송파구 잠실동"
3. 업종 선택: "커피전문점/카페"
4. "상권 분석 시작하기" 클릭
5. 분석 결과 및 차트 확인

### 3. AI 컨설팅 테스트
1. [http://localhost:3000/consulting](http://localhost:3000/consulting) 접속
2. 폼 작성:
   - 예산: "5천만원 ~ 7천만원"
   - 지역: "서울 송파구"
   - 업종: "카페"
   - 경험: "창업 경험 없음"
   - 목표: "안정적인 수입 원함"
3. "AI 컨설팅 받기" 클릭
4. 컨설팅 결과 확인
5. AI 채팅으로 추가 질문

---

## 문제 해결

### 문제 1: `npm install` 실패
**증상**: 패키지 설치 중 오류 발생

**해결 방법**:
```bash
# 캐시 삭제
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

### 문제 2: 포트 충돌 (Port 3000 already in use)
**증상**: 3000번 포트가 이미 사용 중

**해결 방법**:
```bash
# 다른 포트로 실행
PORT=3001 npm run dev

# 또는 3000번 포트 사용 중인 프로세스 종료 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

---

### 문제 3: API 키 인식 안 됨
**증상**: API 호출 시 401 Unauthorized 오류

**해결 방법**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. API 키가 올바르게 입력되었는지 확인
3. 개발 서버 재시작:
   ```bash
   # Ctrl+C로 서버 종료 후
   npm run dev
   ```

---

### 문제 4: OpenAI API 오류
**증상**: "Incorrect API key provided" 오류

**해결 방법**:
1. OpenAI API 키가 `sk-`로 시작하는지 확인
2. [OpenAI Platform](https://platform.openai.com/api-keys)에서 키 재확인
3. 크레딧 잔액 확인 ([Usage](https://platform.openai.com/usage))

---

### 문제 5: 빌드 오류
**증상**: `npm run build` 실패

**해결 방법**:
```bash
# .next 폴더 삭제
rm -rf .next

# 재빌드
npm run build
```

---

### 문제 6: 타입스크립트 오류
**증상**: TypeScript 타입 오류

**해결 방법**:
```bash
# 타입 체크
npm run lint

# 타입 정의 재설치
rm -rf node_modules/@types
npm install
```

---

## 데모 모드 vs 실제 API 모드

### 현재 구현 상태
- ✅ **UI/UX**: 완전 구현
- ✅ **데모 데이터**: 상권 분석 데모 데이터 제공
- ⚠️ **실제 API**: 주석으로 구현 방법 안내

### 실제 API 연동 방법

#### 1. 소상공인 API 연동
`app/api/analysis/route.ts` 파일에서:
```typescript
// 현재: 데모 데이터 사용
const analysisData = generateDemoData(address, industry, coordinates);

// 실제 API 사용으로 변경:
const analysisData = await fetchSbizDataReal(coordinates, industry);
```

#### 2. OpenAI API 활성화
- `.env.local`에 `OPENAI_API_KEY` 설정
- 자동으로 실제 AI 컨설팅 활성화

---

## 추가 리소스

### 공식 문서
- [Next.js 문서](https://nextjs.org/docs)
- [React 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [OpenAI API 문서](https://platform.openai.com/docs)

### 유용한 링크
- [공공데이터포털](https://www.data.go.kr/)
- [소상공인시장진흥공단](https://www.semas.or.kr/)
- [서울시 열린데이터광장](https://data.seoul.go.kr/)

---

## 🎉 설치 완료!

모든 설정이 완료되었습니다! 

이제 [http://localhost:3000](http://localhost:3000)에서 창업 컨설팅 플랫폼을 사용해보세요.

궁금한 점이 있으시면 이슈를 등록해주세요! 💪

