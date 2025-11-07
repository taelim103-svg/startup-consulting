# 🚀 창업 컨설팅 플랫폼

김지훈씨와 같은 예비 창업자를 위한 **AI 기반 맞춤형 창업 컨설팅 웹 플랫폼**입니다.

## 📋 프로젝트 소개

### 타겟 유저 시나리오
> 33살 6년차 직장인 김지훈씨는 모아둔 6천만원으로 카페 창업을 준비하고 있습니다.
> 하지만 정보가 파편화되어 있고, 어디서부터 시작해야 할지 막막합니다.
> 
> 이 플랫폼은 김지훈씨가 **체계적이고 데이터 기반으로** 창업을 준비할 수 있도록 돕습니다.

### 감정선 여정
```
흥미 → 혼란 → 명확함 → 현실감 → 확신 → 실행 의지 상승
```

## ✨ 주요 기능

### 1. 📚 창업 통합 정보
- **창업 절차**: 8단계 체계적 가이드
- **초기 비용**: 업종별 상세 비용 분석
- **지원금 정보**: 정부/지자체 지원금 총정리
- **프랜차이즈**: 주요 브랜드 비교 분석
- **창업 팁**: 성공 창업을 위한 실전 노하우

### 2. 🗺️ 상권 분석
- **정부 공공데이터 연동**: 소상공인시장진흥공단 데이터 활용
- **유동인구 분석**: 시간대별, 연령별, 성별 분석
- **경쟁 현황**: 동일 업종 점포 수 및 밀집도
- **매출 정보**: 업종별 평균 매출 및 성장률
- **종합 평가**: AI 기반 창업 적합도 점수

### 3. 🤖 AI 컨설팅
- **맞춤형 분석**: 예산, 지역, 업종 기반 개인화
- **추천 아이템**: 조건에 맞는 창업 아이템 제안
- **예산 계획**: 카테고리별 상세 예산 분석
- **지원금 안내**: 받을 수 있는 지원금 추천
- **실시간 채팅**: AI와 대화하며 추가 질문 가능

## 🛠️ 기술 스택

### Frontend
- **Next.js 14**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Framer Motion**: 부드러운 애니메이션
- **Chart.js**: 데이터 시각화

### Backend
- **Next.js API Routes**: 서버리스 API
- **OpenAI API**: AI 컨설팅 및 채팅
- **소상공인 API**: 정부 공공데이터 연동

### State Management
- **Zustand**: 경량 상태 관리 (필요시)

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
cd /Users/isc010250/Desktop/consulting
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# OpenAI API Key (AI 컨설팅용)
OPENAI_API_KEY=your_openai_api_key_here

# 소상공인 API Key
# https://www.data.go.kr/ 에서 발급
SBIZ_API_KEY=your_sbiz_api_key_here
NEXT_PUBLIC_SBIZ_API_KEY=your_sbiz_api_key_here

# Naver Map API (선택사항)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id

# Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 5. 프로덕션 빌드
```bash
npm run build
npm start
```

## 🔑 API 키 발급 방법

### OpenAI API
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. 계정 생성 및 로그인
3. API Keys 메뉴에서 새 키 생성
4. `.env.local`에 추가

### 소상공인 API
1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. "소상공인시장진흥공단" 검색
4. 필요한 API 신청 (승인까지 1-2일 소요)
5. 마이페이지에서 인증키 확인
6. `.env.local`에 추가

### Naver Map API (선택사항)
1. [Naver Developers](https://developers.naver.com/) 접속
2. 애플리케이션 등록
3. Maps API 선택
4. Client ID 발급
5. `.env.local`에 추가

## 📁 프로젝트 구조

```
consulting/
├── app/
│   ├── page.tsx                 # 메인 페이지
│   ├── layout.tsx               # 전역 레이아웃
│   ├── globals.css              # 전역 스타일
│   ├── info/
│   │   └── page.tsx            # 창업 정보 페이지
│   ├── analysis/
│   │   └── page.tsx            # 상권 분석 페이지
│   ├── consulting/
│   │   └── page.tsx            # AI 컨설팅 페이지
│   └── api/
│       ├── analysis/
│       │   └── route.ts        # 상권 분석 API
│       └── consulting/
│           ├── route.ts        # 컨설팅 API
│           └── chat/
│               └── route.ts    # 채팅 API
├── components/
│   ├── Navigation.tsx          # 네비게이션 바
│   ├── MapView.tsx             # 지도 컴포넌트
│   └── AnalysisResult.tsx      # 분석 결과 컴포넌트
├── public/                      # 정적 파일
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🎨 주요 페이지

### 1. 메인 페이지 (`/`)
- 히어로 섹션: 임팩트 있는 메시지
- 3가지 핵심 기능 소개
- 창업 프로세스 5단계
- 유저 스토리 (김지훈씨)
- CTA 버튼

### 2. 창업 정보 (`/info`)
- 탭 기반 정보 제공
- 창업 절차, 초기 비용, 지원금, 프랜차이즈, 창업 팁
- 실용적이고 구체적인 정보

### 3. 상권 분석 (`/analysis`)
- 지역 및 업종 검색
- 실시간 상권 데이터 분석
- 지도 시각화
- 유동인구, 경쟁 현황, 매출 정보
- 차트 기반 데이터 시각화

### 4. AI 컨설팅 (`/consulting`)
- 예산, 지역, 업종 입력
- AI 기반 맞춤형 분석
- 추천 아이템 및 예산 계획
- 실시간 AI 채팅

## 🚀 배포

### Vercel 배포 (권장)
```bash
npm install -g vercel
vercel
```

### 환경 변수 설정
Vercel 대시보드에서 환경 변수를 설정하세요.

## 📊 데이터 출처

- **소상공인시장진흥공단**: 상권 정보, 업종별 매출
- **서울시 열린데이터광장**: 유동인구 데이터
- **공공데이터포털**: 각종 통계 데이터

## 🔮 향후 개선 사항

- [ ] 실제 Kakao/Naver Map API 연동
- [ ] 소상공인 API 실제 데이터 연동
- [ ] 사용자 인증 및 저장 기능
- [ ] 사업계획서 자동 생성 기능
- [ ] 창업 성공 사례 DB 구축
- [ ] 모바일 앱 개발
- [ ] 전문가 매칭 서비스

## 📝 라이선스

MIT License

## 👨‍💻 개발자

창업을 꿈꾸는 모든 분들을 응원합니다! 💪

---

## 🆘 문제 해결

### API 키 오류
- `.env.local` 파일이 올바르게 설정되었는지 확인
- 개발 서버 재시작 (`npm run dev`)

### 빌드 오류
```bash
rm -rf .next
npm install
npm run build
```

### 포트 충돌
```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

## 📞 문의

궁금한 점이 있으시면 이슈를 등록해주세요!

